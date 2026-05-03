require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// ============================================================
// MATH FORM 4 — 10 CHAPTERS KSSM
// ============================================================

const MATH_F4_PART1 = [
  {
    id: 'math-f4-ch1',
    chapter: 'Chapter 1',
    topic: 'Quadratic Functions and Equations in One Variable',
    keywords: ['quadratic', 'quadratic function', 'quadratic equation', 'parabola', 'axis of symmetry']
  },
  {
    id: 'math-f4-ch2',
    chapter: 'Chapter 2',
    topic: 'Number Bases',
    keywords: ['number base', 'base two', 'binary', 'base eight', 'octal', 'base five']
  },
  {
    id: 'math-f4-ch3',
    chapter: 'Chapter 3',
    topic: 'Logical Reasoning',
    keywords: ['logical reasoning', 'statement', 'implication', 'argument', 'deduction', 'induction']
  },
  {
    id: 'math-f4-ch4',
    chapter: 'Chapter 4',
    topic: 'Operations on Sets',
    keywords: ['sets', 'union', 'intersection', 'complement', 'subset', 'venn diagram']
  },
  {
    id: 'math-f4-ch5',
    chapter: 'Chapter 5',
    topic: 'Network in Graph Theory',
    keywords: ['network', 'graph theory', 'vertices', 'edges', 'weighted graph', 'tree diagram']
  },
  {
    id: 'math-f4-ch6',
    chapter: 'Chapter 6',
    topic: 'Linear Inequalities in Two Variables',
    keywords: ['linear inequalities', 'two variables', 'region', 'shading', 'boundary line']
  }
];

const MATH_F4_PART2 = [
  {
    id: 'math-f4-ch7',
    chapter: 'Chapter 7',
    topic: 'Graphs of Motion',
    keywords: ['distance time', 'speed time', 'motion graph', 'velocity', 'gradient']
  },
  {
    id: 'math-f4-ch8',
    chapter: 'Chapter 8',
    topic: 'Measures of Dispersion for Ungrouped Data',
    keywords: ['dispersion', 'ungrouped', 'range', 'interquartile', 'variance', 'standard deviation']
  },
  {
    id: 'math-f4-ch9',
    chapter: 'Chapter 9',
    topic: 'Probability of Combined Events',
    keywords: ['probability', 'combined events', 'dependent', 'independent', 'mutually exclusive']
  },
  {
    id: 'math-f4-ch10',
    chapter: 'Chapter 10',
    topic: 'Consumer Mathematics: Financial Management',
    keywords: ['financial management', 'financial plan', 'budget', 'savings', 'investment', 'smart']
  }
];

// ============================================================
// EXTRACT CHAPTER TEXT
// ============================================================

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

// ============================================================
// SEED ONE PDF
// ============================================================

const seedFromPdf = async (pdfFile, chapters) => {
  const pdfPath = path.join(__dirname, 'pdfs', pdfFile);

  if (!fs.existsSync(pdfPath)) {
    console.error(`❌ ${pdfFile} not found in src/seeds/pdfs/`);
    return { seeded: 0, failed: chapters.length };
  }

  console.log(`📄 Reading ${pdfFile}...`);
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const nextChapter = chapters[i + 1] || null;

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
          subject: 'MATH',
          form: 'FORM_4',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Mathematics Form 4 Textbook (KPM)'
        }
      });
      console.log(`✅ Seeded: ${chapter.chapter} — ${chapter.topic} (${chapterText.length} chars)`);
      seeded++;
    } catch (err) {
      console.error(`❌ Failed: ${chapter.chapter}:`, err.message);
      failed++;
    }
  }

  return { seeded, failed };
};

// ============================================================
// MAIN
// ============================================================

async function seedMathF4() {
  console.log('🧠 Starting Math Form 4 seeding...');
  console.log('📚 Total chapters: 10 (Part 1: Ch1-6, Part 2: Ch7-10)');

  const result1 = await seedFromPdf('math-form4-part1.pdf', MATH_F4_PART1);
  console.log(`\nPart 1 done — Seeded: ${result1.seeded}, Failed: ${result1.failed}`);

  const result2 = await seedFromPdf('math-form4-part2.pdf', MATH_F4_PART2);
  console.log(`Part 2 done — Seeded: ${result2.seeded}, Failed: ${result2.failed}`);

  const totalSeeded = result1.seeded + result2.seeded;
  const totalFailed = result1.failed + result2.failed;

  console.log(`\n🎉 Done!`);
  console.log(`✅ Total Seeded: ${totalSeeded}/10 chapters`);
  console.log(`❌ Total Failed: ${totalFailed}/10 chapters`);
  console.log(`\nZed now knows Math Form 4! 🧠`);
}

seedMathF4()
  .catch(console.error)
  .finally(() => prisma.$disconnect());