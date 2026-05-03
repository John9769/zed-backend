require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const SCIENCE_F5_CHAPTERS = [
  {
    id: 'science-f5-ch1',
    chapter: 'Chapter 1',
    topic: 'Microorganisms',
    keywords: ['microorganism', 'bacteria', 'virus', 'fungi', 'pathogen', 'disease']
  },
  {
    id: 'science-f5-ch2',
    chapter: 'Chapter 2',
    topic: 'Nutrition and Food Technology',
    keywords: ['nutrition', 'balanced diet', 'calorific', 'nitrogen cycle', 'food technology', 'food processing']
  },
  {
    id: 'science-f5-ch3',
    chapter: 'Chapter 3',
    topic: 'Sustainability of the Environment',
    keywords: ['sustainability', 'product life cycle', 'environmental pollution', 'conservation', 'preservation']
  },
  {
    id: 'science-f5-ch4',
    chapter: 'Chapter 4',
    topic: 'Rate of Reaction',
    keywords: ['rate of reaction', 'factors affecting', 'collision theory', 'catalyst', 'concentration']
  },
  {
    id: 'science-f5-ch5',
    chapter: 'Chapter 5',
    topic: 'Carbon Compounds',
    keywords: ['carbon compounds', 'hydrocarbon', 'alcohol', 'fats', 'palm oil']
  },
  {
    id: 'science-f5-ch6',
    chapter: 'Chapter 6',
    topic: 'Electrochemistry',
    keywords: ['electrochemistry', 'electrolytic cell', 'chemical cell', 'electrolysis', 'electrode']
  },
  {
    id: 'science-f5-ch7',
    chapter: 'Chapter 7',
    topic: 'Light and Optics',
    keywords: ['light', 'optics', 'lenses', 'optical instruments', 'refraction', 'image formation']
  },
  {
    id: 'science-f5-ch8',
    chapter: 'Chapter 8',
    topic: 'Force and Pressure',
    keywords: ['force', 'pressure', 'fluids', 'pascal', 'archimedes']
  },
  {
    id: 'science-f5-ch9',
    chapter: 'Chapter 9',
    topic: 'Space Technology',
    keywords: ['space technology', 'satellite', 'global positioning system', 'gps', 'orbit']
  }
];

const extractChapterText = (fullText, chapter, nextChapter) => {
  const text = fullText.toLowerCase();
  const searchFrom = 8000;

  let startIdx = -1;
  for (const keyword of chapter.keywords) {
    const idx = text.indexOf(keyword.toLowerCase(), searchFrom);
    if (idx !== -1 && (startIdx === -1 || idx < startIdx)) {
      startIdx = idx;
    }
  }

  if (startIdx === -1) return null;

  let endIdx = fullText.length;
  if (nextChapter) {
    for (const keyword of nextChapter.keywords) {
      const idx = text.indexOf(keyword.toLowerCase(), startIdx + 100);
      if (idx !== -1 && idx < endIdx) {
        endIdx = idx;
      }
    }
  }

  const chapterText = fullText.substring(startIdx, endIdx).trim();
  return chapterText.length > 200 ? chapterText.substring(0, 4000) : null;
};

async function seedScienceF5() {
  console.log('🧠 Starting Science Form 5 seeding...');
  console.log('📚 Total chapters: 9');

  const pdfPath = path.join(__dirname, 'pdfs', 'science-f5.pdf');

  if (!fs.existsSync(pdfPath)) {
    console.error('❌ science-f5.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < SCIENCE_F5_CHAPTERS.length; i++) {
    const chapter = SCIENCE_F5_CHAPTERS[i];
    const nextChapter = SCIENCE_F5_CHAPTERS[i + 1] || null;

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
          subject: 'SCIENCE',
          form: 'FORM_5',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Science Form 5 Textbook (KPM)'
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
  console.log(`✅ Seeded: ${seeded}/9 chapters`);
  console.log(`❌ Failed: ${failed}/9 chapters`);
  console.log(`\nZed now knows Science Form 5! 🧠`);
}

seedScienceF5()
  .catch(console.error)
  .finally(() => prisma.$disconnect());