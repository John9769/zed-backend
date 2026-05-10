require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const PHYSICS_F4_CHAPTERS = [
  {
    id: 'physics-f4-ch1',
    chapter: 'Chapter 1',
    topic: 'Measurement',
    keywords: ['physical quantities', 'scientific investigation', 'measurement', 'base units', 'si units']
  },
  {
    id: 'physics-f4-ch2',
    chapter: 'Chapter 2',
    topic: 'Force and Motion I',
    keywords: ['linear motion', 'linear motion graphs', 'free fall motion', 'inertia', 'momentum']
  },
  {
    id: 'physics-f4-ch3',
    chapter: 'Chapter 3',
    topic: 'Gravitation',
    keywords: ['gravitation', 'universal law of gravitation', 'kepler', 'man-made satellites', 'gravitational field']
  },
  {
    id: 'physics-f4-ch4',
    chapter: 'Chapter 4',
    topic: 'Heat',
    keywords: ['heat', 'thermal equilibrium', 'specific heat capacity', 'specific latent heat', 'gas laws']
  },
  {
    id: 'physics-f4-ch5',
    chapter: 'Chapter 5',
    topic: 'Waves',
    keywords: ['waves', 'transverse wave', 'longitudinal wave', 'reflection of waves', 'diffraction']
  },
  {
    id: 'physics-f4-ch6',
    chapter: 'Chapter 6',
    topic: 'Light and Optics',
    keywords: ['light', 'optics', 'refraction', 'total internal reflection', 'lenses']
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

async function seedPhysicsF4() {
  console.log('🧠 Starting Physics Form 4 seeding...');
  console.log('📚 Total chapters: 6');

  const pdfPath = path.join(__dirname, 'pdfs', 'physics-f4.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error('❌ physics-f4.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < PHYSICS_F4_CHAPTERS.length; i++) {
    const chapter = PHYSICS_F4_CHAPTERS[i];
    const nextChapter = PHYSICS_F4_CHAPTERS[i + 1] || null;
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
          form: 'FORM_4',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Physics Form 4 Textbook (KPM)'
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
  console.log(`✅ Seeded: ${seeded}/6 chapters`);
  console.log(`❌ Failed: ${failed}/6 chapters`);
}

seedPhysicsF4()
  .catch(console.error)
  .finally(() => prisma.$disconnect());