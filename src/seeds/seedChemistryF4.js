require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const CHEMISTRY_F4_CHAPTERS = [
  {
    id: 'chemistry-f4-ch1',
    chapter: 'Chapter 1',
    topic: 'Introduction to Chemistry',
    keywords: ['introduction to chemistry', 'scientific investigation', 'chemistry field', 'apparatus and materials', 'laboratory rules']
  },
  {
    id: 'chemistry-f4-ch2',
    chapter: 'Chapter 2',
    topic: 'Matter and the Atomic Structure',
    keywords: ['atomic structure', 'basic concepts of matter', 'atomic model', 'isotopes', 'proton neutron electron']
  },
  {
    id: 'chemistry-f4-ch3',
    chapter: 'Chapter 3',
    topic: 'The Mole Concept, Chemical Formula and Equation',
    keywords: ['mole concept', 'relative atomic mass', 'chemical formula', 'chemical equation', 'molecular mass']
  },
  {
    id: 'chemistry-f4-ch4',
    chapter: 'Chapter 4',
    topic: 'The Periodic Table of Elements',
    keywords: ['periodic table', 'arrangement of elements', 'group 18', 'group 1', 'transition elements']
  },
  {
    id: 'chemistry-f4-ch5',
    chapter: 'Chapter 5',
    topic: 'Chemical Bond',
    keywords: ['chemical bond', 'ionic bond', 'covalent bond', 'metallic bond', 'hydrogen bond']
  },
  {
    id: 'chemistry-f4-ch6',
    chapter: 'Chapter 6',
    topic: 'Acid, Base and Salt',
    keywords: ['acid base salt', 'ph value', 'neutralisation', 'concentration of aqueous solution', 'standard solution']
  },
  {
    id: 'chemistry-f4-ch7',
    chapter: 'Chapter 7',
    topic: 'Rate of Reaction',
    keywords: ['rate of reaction', 'determining rate of reaction', 'factors affecting rate', 'collision theory', 'activation energy']
  },
  {
    id: 'chemistry-f4-ch8',
    chapter: 'Chapter 8',
    topic: 'Manufactured Substances in Industry',
    keywords: ['manufactured substances', 'alloy', 'composition of glass', 'ceramics', 'composite materials']
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

async function seedChemistryF4() {
  console.log('🧠 Starting Chemistry Form 4 seeding...');
  console.log('📚 Total chapters: 8');

  const pdfPath = path.join(__dirname, 'pdfs', 'chemistry-f4.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error('❌ chemistry-f4.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < CHEMISTRY_F4_CHAPTERS.length; i++) {
    const chapter = CHEMISTRY_F4_CHAPTERS[i];
    const nextChapter = CHEMISTRY_F4_CHAPTERS[i + 1] || null;
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
          subject: 'CHEMISTRY',
          form: 'FORM_4',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Chemistry Form 4 Textbook (KPM)'
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
  console.log(`✅ Seeded: ${seeded}/8 chapters`);
  console.log(`❌ Failed: ${failed}/8 chapters`);
}

seedChemistryF4()
  .catch(console.error)
  .finally(() => prisma.$disconnect());