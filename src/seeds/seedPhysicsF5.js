require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const PHYSICS_F5_CHAPTERS = [
  {
    id: 'physics-f5-ch1',
    chapter: 'Chapter 1',
    topic: 'Force and Motion II',
    keywords: ['resultant force', 'resolution of forces', 'forces in equilibrium', 'elasticity', 'hookes law']
  },
  {
    id: 'physics-f5-ch2',
    chapter: 'Chapter 2',
    topic: 'Pressure',
    keywords: ['pressure in liquids', 'atmospheric pressure', 'pascal principle', 'archimedes principle', 'bernoulli principle']
  },
  {
    id: 'physics-f5-ch3',
    chapter: 'Chapter 3',
    topic: 'Electricity',
    keywords: ['current and potential difference', 'resistance', 'electromotive force', 'electrical energy and power', 'internal resistance']
  },
  {
    id: 'physics-f5-ch4',
    chapter: 'Chapter 4',
    topic: 'Electromagnetism',
    keywords: ['electromagnetic induction', 'current-carrying conductor', 'magnetic field', 'transformer', 'faraday']
  },
  {
    id: 'physics-f5-ch5',
    chapter: 'Chapter 5',
    topic: 'Electronics',
    keywords: ['electron', 'semiconductor diode', 'transistor', 'electronics', 'rectification']
  },
  {
    id: 'physics-f5-ch6',
    chapter: 'Chapter 6',
    topic: 'Nuclear Physics',
    keywords: ['nuclear physics', 'radioactive decay', 'nuclear energy', 'half life', 'radiation']
  },
  {
    id: 'physics-f5-ch7',
    chapter: 'Chapter 7',
    topic: 'Quantum Physics',
    keywords: ['quantum physics', 'quantum theory of light', 'photoelectric effect', 'einstein photoelectric', 'wave particle duality']
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

async function seedPhysicsF5() {
  console.log('🧠 Starting Physics Form 5 seeding...');
  console.log('📚 Total chapters: 7');

  const pdfPath = path.join(__dirname, 'pdfs', 'physics-f5.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error('❌ physics-f5.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < PHYSICS_F5_CHAPTERS.length; i++) {
    const chapter = PHYSICS_F5_CHAPTERS[i];
    const nextChapter = PHYSICS_F5_CHAPTERS[i + 1] || null;
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
          subject: 'PHYSICS',
          form: 'FORM_5',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Physics Form 5 Textbook (KPM)'
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
  console.log(`✅ Seeded: ${seeded}/7 chapters`);
  console.log(`❌ Failed: ${failed}/7 chapters`);
}

seedPhysicsF5()
  .catch(console.error)
  .finally(() => prisma.$disconnect());