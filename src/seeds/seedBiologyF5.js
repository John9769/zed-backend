require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const BIOLOGY_F5_CHAPTERS = [
  {
    id: 'biology-f5-ch1',
    chapter: 'Chapter 1',
    topic: 'Organisation of Plant Tissues and Growth',
    keywords: ['organisation of plant tissues', 'meristematic tissues', 'growth curves', 'plant tissues growth']
  },
  {
    id: 'biology-f5-ch2',
    chapter: 'Chapter 2',
    topic: 'Leaf Structure and Function',
    keywords: ['structure of a leaf', 'gaseous exchange', 'transpiration', 'photosynthesis', 'compensation point']
  },
  {
    id: 'biology-f5-ch3',
    chapter: 'Chapter 3',
    topic: 'Nutrition in Plants',
    keywords: ['inorganic nutrients', 'water and mineral salts uptake', 'diversity in plant nutrition', 'nutrition in plants']
  },
  {
    id: 'biology-f5-ch4',
    chapter: 'Chapter 4',
    topic: 'Transport in Plants',
    keywords: ['vascular tissues', 'transport of water and mineral salts', 'translocation', 'phytoremediation']
  },
  {
    id: 'biology-f5-ch5',
    chapter: 'Chapter 5',
    topic: 'Response in Plants',
    keywords: ['types of responses', 'phytohormone', 'application of phytohormones', 'response in plants', 'tropism']
  },
  {
    id: 'biology-f5-ch6',
    chapter: 'Chapter 6',
    topic: 'Sexual Reproduction in Flowering Plants',
    keywords: ['structure of a flower', 'pollen grains', 'embryo sac', 'pollination and fertilisation', 'development of seeds and fruits']
  },
  {
    id: 'biology-f5-ch7',
    chapter: 'Chapter 7',
    topic: 'Adaptations of Plants in Different Habitats',
    keywords: ['adaptations of plants', 'different habitats', 'plant adaptations', 'hydrophytes', 'xerophytes']
  },
  {
    id: 'biology-f5-ch8',
    chapter: 'Chapter 8',
    topic: 'Biodiversity',
    keywords: ['classification system', 'naming of organisms', 'biodiversity', 'microorganisms and viruses', 'taxonomy']
  },
  {
    id: 'biology-f5-ch9',
    chapter: 'Chapter 9',
    topic: 'Ecosystem',
    keywords: ['community and ecosystem', 'population ecology', 'food chain', 'food web', 'ecological pyramid']
  },
  {
    id: 'biology-f5-ch10',
    chapter: 'Chapter 10',
    topic: 'Environmental Sustainability',
    keywords: ['threats to the environment', 'preservation conservation restoration', 'environmental sustainability', 'green technology']
  },
  {
    id: 'biology-f5-ch11',
    chapter: 'Chapter 11',
    topic: 'Inheritance',
    keywords: ['monohybrid inheritance', 'dihybrid inheritance', 'genes and alleles', 'inheritance in humans', 'mendel']
  },
  {
    id: 'biology-f5-ch12',
    chapter: 'Chapter 12',
    topic: 'Variation',
    keywords: ['types and factors of variation', 'variation in humans', 'mutation', 'continuous variation', 'discontinuous variation']
  },
  {
    id: 'biology-f5-ch13',
    chapter: 'Chapter 13',
    topic: 'Genetic Technology',
    keywords: ['genetic engineering', 'biotechnology', 'genetic technology', 'recombinant dna', 'cloning']
  }
];

const MIN_CHAPTER_LENGTH = 500;

const extractChapterText = (fullText, chapter, nextChapter) => {
  const text = fullText.toLowerCase();
  const searchFrom = 5000;

  const allHits = [];
  for (const keyword of chapter.keywords) {
    let searchPos = searchFrom;
    while (true) {
      const idx = text.indexOf(keyword.toLowerCase(), searchPos);
      if (idx === -1) break;
      allHits.push(idx);
      searchPos = idx + 1;
    }
  }

  if (allHits.length === 0) return null;
  allHits.sort((a, b) => a - b);

  for (const startIdx of allHits) {
    let endIdx = fullText.length;
    if (nextChapter) {
      for (const keyword of nextChapter.keywords) {
        const idx = text.indexOf(keyword.toLowerCase(), startIdx + 100);
        if (idx !== -1 && idx < endIdx) endIdx = idx;
      }
    }

    const chapterText = fullText.substring(startIdx, endIdx).trim();
    if (chapterText.length < MIN_CHAPTER_LENGTH) {
      console.log(`   ⚡ Skipped short hit at ${startIdx} (${chapterText.length} chars) — likely TOC`);
      continue;
    }
    return chapterText.substring(0, 4000);
  }
  return null;
};

async function seedBiologyF5() {
  console.log('🧠 Starting Biology Form 5 seeding...');
  console.log('📚 Total chapters: 13');

  const pdfPath = path.join(__dirname, 'pdfs', 'biology-f5.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error('❌ biology-f5.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < BIOLOGY_F5_CHAPTERS.length; i++) {
    const chapter = BIOLOGY_F5_CHAPTERS[i];
    const nextChapter = BIOLOGY_F5_CHAPTERS[i + 1] || null;
    const chapterText = extractChapterText(fullText, chapter, nextChapter);

    if (!chapterText) {
      console.log(`⚠️  Could not extract: ${chapter.chapter} — ${chapter.topic}`);
      failed++;
      continue;
    }

    try {
      await prisma.subjectContent.upsert({
        where: { id: chapter.id },
        update: { body: chapterText, updatedAt: new Date() },
        create: {
          id: chapter.id,
          subject: 'BIOLOGY',
          form: 'FORM_5',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Biology Form 5 Textbook (KPM)'
        }
      });
      console.log(`✅ Seeded: ${chapter.chapter} — ${chapter.topic} (${chapterText.length} chars)`);
      seeded++;
    } catch (err) {
      console.error(`❌ Failed: ${chapter.chapter}:`, err.message);
      failed++;
    }
  }

  console.log(`\n🎉 Done!`);
  console.log(`✅ Seeded: ${seeded}/13 chapters`);
  console.log(`❌ Failed: ${failed}/13 chapters`);
}

seedBiologyF5()
  .catch(console.error)
  .finally(() => prisma.$disconnect());