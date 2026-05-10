require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const ADD_MATH_F4_CHAPTERS = [
  {
    id: 'add-math-f4-ch1',
    chapter: 'Chapter 1',
    topic: 'Functions',
    keywords: ['function', 'domain', 'codomain', 'range', 'object', 'image', 'composite function']
  },
  {
    id: 'add-math-f4-ch2',
    chapter: 'Chapter 2',
    topic: 'Quadratic Functions',
    keywords: ['quadratic function', 'axis of symmetry', 'minimum point', 'maximum point', 'completing the square']
  },
  {
    id: 'add-math-f4-ch3',
    chapter: 'Chapter 3',
    topic: 'Systems of Equations',
    keywords: ['systems of equations', 'simultaneous equations', 'linear equation', 'non-linear equation', 'substitution']
  },
  {
    id: 'add-math-f4-ch4',
    chapter: 'Chapter 4',
    topic: 'Indices, Surds and Logarithms',
    keywords: ['indices', 'surds', 'logarithm', 'laws of indices', 'laws of logarithm']
  },
  {
    id: 'add-math-f4-ch5',
    chapter: 'Chapter 5',
    topic: 'Progressions',
    keywords: ['arithmetic progression', 'geometric progression', 'common difference', 'common ratio', 'sum of progression']
  },
  {
    id: 'add-math-f4-ch6',
    chapter: 'Chapter 6',
    topic: 'Linear Law',
    keywords: ['linear law', 'best fit line', 'non-linear relation', 'linearise', 'y = mx + c']
  },
  {
    id: 'add-math-f4-ch7',
    chapter: 'Chapter 7',
    topic: 'Coordinate Geometry',
    keywords: ['coordinate geometry', 'midpoint', 'distance formula', 'equation of locus', 'parallel lines']
  },
  {
    id: 'add-math-f4-ch8',
    chapter: 'Chapter 8',
    topic: 'Vectors',
    keywords: ['vector', 'scalar', 'resultant vector', 'unit vector', 'magnitude of vector']
  },
  {
    id: 'add-math-f4-ch9',
    chapter: 'Chapter 9',
    topic: 'Solution of Triangles',
    keywords: ['sine rule', 'cosine rule', 'area of triangle', 'ambiguous case', 'bearing']
  },
  {
    id: 'add-math-f4-ch10',
    chapter: 'Chapter 10',
    topic: 'Index Number',
    keywords: ['index number', 'index numbers', 'composite index', 'price index', 'weightage']
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

async function seedAddMathF4() {
  console.log('🧠 Starting Add Math Form 4 seeding...');
  console.log('📚 Total chapters: 10');

  const pdfPath = path.join(__dirname, 'pdfs', 'add-math-f4.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error('❌ add-math-f4.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < ADD_MATH_F4_CHAPTERS.length; i++) {
    const chapter = ADD_MATH_F4_CHAPTERS[i];
    const nextChapter = ADD_MATH_F4_CHAPTERS[i + 1] || null;
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
          subject: 'ADD_MATH',
          form: 'FORM_4',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Additional Mathematics Form 4 Textbook (KPM)'
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
  console.log(`✅ Seeded: ${seeded}/10 chapters`);
  console.log(`❌ Failed: ${failed}/10 chapters`);
}

seedAddMathF4()
  .catch(console.error)
  .finally(() => prisma.$disconnect());