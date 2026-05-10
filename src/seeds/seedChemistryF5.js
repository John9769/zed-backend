require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const CHEMISTRY_F5_CHAPTERS = [
  {
    id: 'chemistry-f5-ch1',
    chapter: 'Chapter 1',
    topic: 'Redox Equilibrium',
    keywords: ['oxidation and reduction', 'standard electrode potential', 'voltaic cell', 'electrolytic cell', 'rusting']
  },
  {
    id: 'chemistry-f5-ch2',
    chapter: 'Chapter 2',
    topic: 'Carbon Compound',
    keywords: ['carbon compound', 'homologous series', 'types of carbon compounds', 'isomers', 'iupac nomenclature']
  },
  {
    id: 'chemistry-f5-ch3',
    chapter: 'Chapter 3',
    topic: 'Thermochemistry',
    keywords: ['thermochemistry', 'heat change in reactions', 'heat of reaction', 'exothermic', 'endothermic']
  },
  {
    id: 'chemistry-f5-ch4',
    chapter: 'Chapter 4',
    topic: 'Polymer',
    keywords: ['polymer', 'natural rubber', 'synthetic rubber', 'polymerisation', 'monomer']
  },
  {
    id: 'chemistry-f5-ch5',
    chapter: 'Chapter 5',
    topic: 'Consumer and Industrial Chemistry',
    keywords: ['consumer chemistry', 'oils and fats', 'cleaning agents', 'food additives', 'nanotechnology']
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

async function seedChemistryF5() {
  console.log('🧠 Starting Chemistry Form 5 seeding...');
  console.log('📚 Total chapters: 5');

  const pdfPath = path.join(__dirname, 'pdfs', 'chemistry-f5.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error('❌ chemistry-f5.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < CHEMISTRY_F5_CHAPTERS.length; i++) {
    const chapter = CHEMISTRY_F5_CHAPTERS[i];
    const nextChapter = CHEMISTRY_F5_CHAPTERS[i + 1] || null;
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
          form: 'FORM_5',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Chemistry Form 5 Textbook (KPM)'
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
  console.log(`✅ Seeded: ${seeded}/5 chapters`);
  console.log(`❌ Failed: ${failed}/5 chapters`);
}

seedChemistryF5()
  .catch(console.error)
  .finally(() => prisma.$disconnect());