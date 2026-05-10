require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const ADD_MATH_F5_CHAPTERS = [
  {
    id: 'add-math-f5-ch1',
    chapter: 'Chapter 1',
    topic: 'Circular Measure',
    keywords: ['radian', 'arc length', 'area of sector', 'circular measure', 'subtended angle']
  },
  {
    id: 'add-math-f5-ch2',
    chapter: 'Chapter 2',
    topic: 'Differentiation',
    keywords: ['differentiation', 'first derivative', 'second derivative', 'limit', 'application of differentiation']
  },
  {
    id: 'add-math-f5-ch3',
    chapter: 'Chapter 3',
    topic: 'Integration',
    keywords: ['integration', 'indefinite integral', 'definite integral', 'inverse of differentiation', 'application of integration']
  },
  {
    id: 'add-math-f5-ch4',
    chapter: 'Chapter 4',
    topic: 'Permutation and Combination',
    keywords: ['permutation', 'combination', 'factorial', 'arrangement', 'selection']
  },
  {
    id: 'add-math-f5-ch5',
    chapter: 'Chapter 5',
    topic: 'Probability Distribution',
    keywords: ['probability distribution', 'random variable', 'binomial distribution', 'normal distribution', 'z-score']
  },
  {
    id: 'add-math-f5-ch6',
    chapter: 'Chapter 6',
    topic: 'Trigonometric Functions',
    keywords: ['trigonometric functions', 'positive angles', 'negative angles', 'sine cosine tangent', 'double angle formulae']
  },
  {
    id: 'add-math-f5-ch7',
    chapter: 'Chapter 7',
    topic: 'Linear Programming',
    keywords: ['linear programming', 'linear programming model', 'feasible region', 'objective function', 'optimum value']
  },
  {
    id: 'add-math-f5-ch8',
    chapter: 'Chapter 8',
    topic: 'Kinematics of Linear Motion',
    keywords: ['kinematics', 'displacement', 'velocity', 'acceleration', 'function of time']
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

async function seedAddMathF5() {
  console.log('🧠 Starting Add Math Form 5 seeding...');
  console.log('📚 Total chapters: 8');

  const pdfPath = path.join(__dirname, 'pdfs', 'add-math-f5.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error('❌ add-math-f5.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < ADD_MATH_F5_CHAPTERS.length; i++) {
    const chapter = ADD_MATH_F5_CHAPTERS[i];
    const nextChapter = ADD_MATH_F5_CHAPTERS[i + 1] || null;
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
          form: 'FORM_5',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Additional Mathematics Form 5 Textbook (KPM)'
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

seedAddMathF5()
  .catch(console.error)
  .finally(() => prisma.$disconnect());