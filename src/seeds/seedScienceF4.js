require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const SCIENCE_F4_CHAPTERS = [
  {
    id: 'science-f4-ch1',
    chapter: 'Chapter 1',
    topic: 'Safety Measures in the Laboratory',
    keywords: ['safety measures', 'laboratory', 'protective equipment', 'disposal of waste', 'fire extinguisher']
  },
  {
    id: 'science-f4-ch2',
    chapter: 'Chapter 2',
    topic: 'Emergency Help',
    // FIXED: TOC has "Emergency Help 18" + "Cardiopulmonary Resuscitation (CPR) 20"
    // These body-specific terms only appear in actual chapter content, not TOC
    keywords: ['cardiopulmonary resuscitation', 'abdominal thrust', 'heimlich', 'recovery position', 'unconscious victim']
  },
  {
    id: 'science-f4-ch3',
    chapter: 'Chapter 3',
    topic: 'Techniques of Measuring the Parameters of Body Health',
    keywords: ['body temperature', 'pulse rate', 'blood pressure', 'body mass index', 'bmi']
  },
  {
    id: 'science-f4-ch4',
    chapter: 'Chapter 4',
    topic: 'Green Technology for Environmental Sustainability',
    keywords: ['green technology', 'environmental sustainability', 'energy sector', 'wastewater', 'transportation sector']
  },
  {
    id: 'science-f4-ch5',
    chapter: 'Chapter 5',
    topic: 'Genetics',
    // FIXED: TOC has "Genetics 74", "Cell Division 76", "Inheritance 84"
    // These body-specific terms only appear in actual chapter content, not TOC
    keywords: ['mitosis', 'meiosis', 'chromosome', 'dominant allele', 'gamete']
  },
  {
    id: 'science-f4-ch6',
    chapter: 'Chapter 6',
    topic: 'Support, Movement and Growth',
    keywords: ['support', 'movement and growth', 'human movement', 'plants stability', 'skeleton']
  },
  {
    id: 'science-f4-ch7',
    chapter: 'Chapter 7',
    topic: 'Body Coordination',
    keywords: ['body coordination', 'endocrine system', 'disruptions', 'healthy mind']
  },
  {
    id: 'science-f4-ch8',
    chapter: 'Chapter 8',
    topic: 'Elements and Substances',
    keywords: ['elements and substances', 'matter', 'periodic table', 'isotope']
  },
  {
    id: 'science-f4-ch9',
    chapter: 'Chapter 9',
    topic: 'Chemicals in Industry',
    keywords: ['chemicals in industry', 'alloy', 'glass', 'ceramic', 'polymer']
  },
  {
    id: 'science-f4-ch10',
    chapter: 'Chapter 10',
    topic: 'Chemicals in Medicine and Health',
    keywords: ['chemicals in medicine', 'traditional medicine', 'free radicals', 'antioxidant', 'health products']
  },
  {
    id: 'science-f4-ch11',
    chapter: 'Chapter 11',
    topic: 'Force and Motion',
    keywords: ['force and motion', 'linear motion', 'gravitational acceleration', 'free fall', 'mass and inertia']
  },
  {
    id: 'science-f4-ch12',
    chapter: 'Chapter 12',
    topic: 'Nuclear Energy',
    keywords: ['nuclear energy', 'production of nuclear energy', 'impact of nuclear', 'nuclear energy in malaysia']
  }
];

const MIN_CHAPTER_LENGTH = 500; // guard: TOC hits are always shorter than this

const extractChapterText = (fullText, chapter, nextChapter) => {
  const text = fullText.toLowerCase();
  const searchFrom = 8000;

  // Collect ALL occurrences of each keyword (not just the first)
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

  // Sort ascending — try each hit until we get a chunk long enough
  // (TOC hits produce tiny chunks; the real chapter body is long)
  allHits.sort((a, b) => a - b);

  for (const startIdx of allHits) {
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

    // If extracted chunk is too short, this was a TOC hit — skip to next hit
    if (chapterText.length < MIN_CHAPTER_LENGTH) {
      console.log(`   ⚡ Skipped short hit at ${startIdx} (${chapterText.length} chars) — likely TOC`);
      continue;
    }

    return chapterText.substring(0, 4000);
  }

  return null; // all hits were TOC-level — chapter genuinely not extractable
};

async function seedScienceF4() {
  console.log('🧠 Starting Science Form 4 seeding...');
  console.log('📚 Total chapters: 12');

  const pdfPath = path.join(__dirname, 'pdfs', 'science-f4.pdf');

  if (!fs.existsSync(pdfPath)) {
    console.error('❌ science-f4.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < SCIENCE_F4_CHAPTERS.length; i++) {
    const chapter = SCIENCE_F4_CHAPTERS[i];
    const nextChapter = SCIENCE_F4_CHAPTERS[i + 1] || null;

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
          form: 'FORM_4',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Science Form 4 Textbook (KPM)'
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
  console.log(`✅ Seeded: ${seeded}/12 chapters`);
  console.log(`❌ Failed: ${failed}/12 chapters`);
  console.log(`\nZed now knows Science Form 4! 🧠`);
}

seedScienceF4()
  .catch(console.error)
  .finally(() => prisma.$disconnect());