require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const BIOLOGY_F4_CHAPTERS = [
  {
    id: 'biology-f4-ch1',
    chapter: 'Chapter 1',
    topic: 'Introduction to Biology and Laboratory Rules',
    keywords: ['fields and careers in biology', 'safety and rules in a biology laboratory', 'scientific investigation in biology', 'communicating in biology']
  },
  {
    id: 'biology-f4-ch2',
    chapter: 'Chapter 2',
    topic: 'Cell Biology and Organisation',
    keywords: ['cell structure and function', 'unicellular organisms', 'multicellular organisms', 'levels of organisation']
  },
  {
    id: 'biology-f4-ch3',
    chapter: 'Chapter 3',
    topic: 'Movement of Substances across a Plasma Membrane',
    keywords: ['plasma membrane', 'movement of substances', 'diffusion', 'osmosis', 'active transport']
  },
  {
    id: 'biology-f4-ch4',
    chapter: 'Chapter 4',
    topic: 'Chemical Compositions in a Cell',
    keywords: ['chemical compositions', 'carbohydrates', 'proteins', 'lipids', 'nucleic acids']
  },
  {
    id: 'biology-f4-ch5',
    chapter: 'Chapter 5',
    topic: 'Metabolism and Enzymes',
    keywords: ['metabolism', 'enzymes', 'application of enzymes', 'enzyme activity', 'metabolic reactions']
  },
  {
    id: 'biology-f4-ch6',
    chapter: 'Chapter 6',
    topic: 'Cell Division',
    keywords: ['cell division', 'cell cycle', 'mitosis', 'meiosis', 'issues of cell division']
  },
  {
    id: 'biology-f4-ch7',
    chapter: 'Chapter 7',
    topic: 'Cellular Respiration',
    keywords: ['cellular respiration', 'energy production', 'aerobic respiration', 'fermentation', 'atp']
  },
  {
    id: 'biology-f4-ch8',
    chapter: 'Chapter 8',
    topic: 'Respiratory Systems in Humans and Animals',
    keywords: ['respiratory system', 'types of respiratory system', 'mechanisms of breathing', 'gaseous exchange', 'human respiratory']
  },
  {
    id: 'biology-f4-ch9',
    chapter: 'Chapter 9',
    topic: 'Nutrition and the Human Digestive System',
    keywords: ['digestive system', 'digestion', 'absorption', 'assimilation', 'balanced diet']
  },
  {
    id: 'biology-f4-ch10',
    chapter: 'Chapter 10',
    topic: 'Transport in Humans and Animals',
    keywords: ['circulatory system', 'mechanism of heartbeat', 'blood clotting', 'blood groups', 'lymphatic system']
  },
  {
    id: 'biology-f4-ch11',
    chapter: 'Chapter 11',
    topic: 'Immunity in Humans',
    keywords: ['immunity', 'body defence', 'actions of antibodies', 'types of immunity', 'health issues related to immunity']
  },
  {
    id: 'biology-f4-ch12',
    chapter: 'Chapter 12',
    topic: 'Coordination and Response in Humans',
    keywords: ['coordination and response', 'nervous system', 'neurones and synapse', 'voluntary and involuntary actions', 'hormones']
  },
  {
    id: 'biology-f4-ch13',
    chapter: 'Chapter 13',
    topic: 'Homeostasis and the Human Urinary System',
    keywords: ['homeostasis', 'urinary system', 'kidney', 'osmoregulation', 'health issues urinary']
  },
  {
    id: 'biology-f4-ch14',
    chapter: 'Chapter 14',
    topic: 'Support and Movement in Humans and Animals',
    keywords: ['types of skeleton', 'musculoskeletal system', 'movement and locomotion', 'support and movement', 'musculoskeletal health']
  },
  {
    id: 'biology-f4-ch15',
    chapter: 'Chapter 15',
    topic: 'Sexual Reproduction, Development and Growth in Humans and Animals',
    keywords: ['reproductive system', 'gametogenesis', 'menstrual cycle', 'development of human foetus', 'formation of twins']
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

async function seedBiologyF4() {
  console.log('🧠 Starting Biology Form 4 seeding...');
  console.log('📚 Total chapters: 15');

  const pdfPath = path.join(__dirname, 'pdfs', 'biology-f4.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error('❌ biology-f4.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < BIOLOGY_F4_CHAPTERS.length; i++) {
    const chapter = BIOLOGY_F4_CHAPTERS[i];
    const nextChapter = BIOLOGY_F4_CHAPTERS[i + 1] || null;
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
          subject: 'BIOLOGY',
          form: 'FORM_4',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Biology Form 4 Textbook (KPM)'
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
  console.log(`✅ Seeded: ${seeded}/15 chapters`);
  console.log(`❌ Failed: ${failed}/15 chapters`);
}

seedBiologyF4()
  .catch(console.error)
  .finally(() => prisma.$disconnect());