require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// ============================================================
// MATH FORM 5 — REAL CHAPTERS FROM KSSM TEXTBOOK
// ============================================================

const MATH_F5_CHAPTERS = [
  {
    id: 'math-f5-ch1',
    chapter: 'Chapter 1',
    topic: 'Variation',
    subtopics: ['Direct Variation', 'Inverse Variation', 'Combined Variation'],
    keywords: ['variation', 'direct variation', 'inverse variation', 'combined variation']
  },
  {
    id: 'math-f5-ch2',
    chapter: 'Chapter 2',
    topic: 'Matrices',
    subtopics: ['Matrices', 'Basic Operation on Matrices'],
    keywords: ['matrices', 'matrix', 'basic operation on matrices', 'rows', 'columns']
  },
  {
    id: 'math-f5-ch3',
    chapter: 'Chapter 3',
    topic: 'Consumer Mathematics: Insurance',
    subtopics: ['Risk and Insurance Coverage'],
    keywords: ['insurance', 'risk', 'coverage', 'premium', 'policy']
  },
  {
    id: 'math-f5-ch4',
    chapter: 'Chapter 4',
    topic: 'Consumer Mathematics: Taxation',
    subtopics: ['Taxation'],
    keywords: ['taxation', 'tax', 'income tax', 'assessment']
  },
  {
    id: 'math-f5-ch5',
    chapter: 'Chapter 5',
    topic: 'Congruency, Enlargement and Combined Transformations',
    subtopics: ['Congruency', 'Enlargement', 'Combined Transformation', 'Tessellation'],
    keywords: ['congruency', 'enlargement', 'combined transformation', 'tessellation']
  },
  {
    id: 'math-f5-ch6',
    chapter: 'Chapter 6',
    topic: 'Ratios and Graphs of Trigonometric Functions',
    subtopics: ['The Value of Sine, Cosine and Tangent', 'The Graphs of Sine, Cosine and Tangent Functions'],
    keywords: ['trigonometric', 'sine', 'cosine', 'tangent', 'graphs', 'ratio']
  },
  {
    id: 'math-f5-ch7',
    chapter: 'Chapter 7',
    topic: 'Measures of Dispersion for Grouped Data',
    subtopics: ['Dispersion', 'Measures of Dispersion'],
    keywords: ['dispersion', 'grouped data', 'measures of dispersion', 'variance', 'standard deviation']
  },
  {
    id: 'math-f5-ch8',
    chapter: 'Chapter 8',
    topic: 'Mathematical Modeling',
    subtopics: ['Mathematical Modeling'],
    keywords: ['mathematical modeling', 'model', 'real life', 'application']
  }
];

// ============================================================
// EXTRACT CHAPTER TEXT FROM FULL PDF TEXT
// ============================================================

const extractChapterText = (fullText, chapter, nextChapter) => {
  const text = fullText.toLowerCase();

  // Find this chapter start — skip first 8000 chars (table of contents)
  const searchFrom = 8000;
  let startIdx = -1;
  for (const keyword of chapter.keywords) {
    const idx = text.indexOf(keyword.toLowerCase(), searchFrom);
    if (idx !== -1 && (startIdx === -1 || idx < startIdx)) {
      startIdx = idx;
    }
  }

  if (startIdx === -1) return null;

  // Find next chapter start
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

// ============================================================
// MAIN SEED FUNCTION
// ============================================================

async function seedMathF5() {
  console.log('🧠 Starting Math Form 5 seeding...');
  console.log('📚 Total chapters to seed: 8');

  const pdfPath = path.join(__dirname, 'pdfs', 'math-f5.pdf');

  if (!fs.existsSync(pdfPath)) {
    console.error('❌ math-f5.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;

  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < MATH_F5_CHAPTERS.length; i++) {
    const chapter = MATH_F5_CHAPTERS[i];
    const nextChapter = MATH_F5_CHAPTERS[i + 1] || null;

    const chapterText = extractChapterText(fullText, chapter, nextChapter);

    if (!chapterText) {
      console.log(`⚠️  Could not extract text for ${chapter.chapter} — ${chapter.topic}`);
      failed++;
      continue;
    }

    try {
      await prisma.subjectContent.upsert({
        where: { id: chapter.id },
        update: {
          body: chapterText,
          updatedAt: new Date()
        },
        create: {
          id: chapter.id,
          subject: 'MATH',
          form: 'FORM_5',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Mathematics Form 5 Textbook (KPM)'
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
  console.log(`\nZed now knows Math Form 5! 🧠`);
}

seedMathF5()
  .catch(console.error)
  .finally(() => prisma.$disconnect());