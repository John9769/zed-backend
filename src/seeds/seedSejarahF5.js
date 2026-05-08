require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const SEJARAH_F5_CHAPTERS = [
  {
    id: 'sejarah-f5-ch1',
    chapter: 'Bab 1',
    topic: 'Kedaulatan Negara',
    keywords: ['kedaulatan negara', 'konsep kedaulatan', 'negara berdaulat', 'mempertahankan kedaulatan']
  },
  {
    id: 'sejarah-f5-ch2',
    chapter: 'Bab 2',
    topic: 'Perlembagaan Persekutuan',
    keywords: ['perlembagaan persekutuan', 'penggubalan perlembagaan', 'ciri utama perlembagaan', 'pindaan perlembagaan']
  },
  {
    id: 'sejarah-f5-ch3',
    chapter: 'Bab 3',
    topic: 'Raja Berperlembagaan dan Demokrasi Berparlimen',
    keywords: ['raja berperlembagaan', 'demokrasi berparlimen', 'majlis raja-raja', 'yang di-pertuan agong']
  },
  {
    id: 'sejarah-f5-ch4',
    chapter: 'Bab 4',
    topic: 'Sistem Persekutuan',
    keywords: ['sistem persekutuan', 'kerajaan persekutuan', 'kerajaan negeri', 'kuasa persekutuan']
  },
  {
    id: 'sejarah-f5-ch5',
    chapter: 'Bab 5',
    topic: 'Pembentukan Malaysia',
    keywords: ['pembentukan malaysia', 'gagasan malaysia', 'pengisytiharan malaysia', 'perjanjian julai 1963']
  },
  {
    id: 'sejarah-f5-ch6',
    chapter: 'Bab 6',
    topic: 'Cabaran Selepas Pembentukan Malaysia',
    keywords: ['cabaran selepas pembentukan', 'konfrontasi', 'pemisahan singapura', 'perpaduan kaum']
  },
  {
    id: 'sejarah-f5-ch7',
    chapter: 'Bab 7',
    topic: 'Membina Kesejahteraan Negara',
    keywords: ['kesejahteraan negara', 'perpaduan nasional', 'rukun negara', 'integrasi nasional']
  },
  {
    id: 'sejarah-f5-ch8',
    chapter: 'Bab 8',
    topic: 'Membina Kemakmuran Negara',
    keywords: ['kemakmuran negara', 'dasar ekonomi baru', 'deb', 'pembangunan ekonomi']
  },
  {
    id: 'sejarah-f5-ch9',
    chapter: 'Bab 9',
    topic: 'Dasar Luar Malaysia',
    keywords: ['dasar luar malaysia', 'hubungan antarabangsa', 'asean', 'pertubuhan bangsa-bangsa bersatu']
  },
  {
    id: 'sejarah-f5-ch10',
    chapter: 'Bab 10',
    topic: 'Kecemerlangan Malaysia di Persada Dunia',
    keywords: ['kecemerlangan malaysia', 'persada dunia', 'wawasan 2020', 'kelestarian global']
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

async function seedSejarahF5() {
  console.log('🧠 Starting Sejarah Form 5 seeding...');
  console.log('📚 Total chapters: 10');

  const pdfPath = path.join(__dirname, 'pdfs', 'sejarah-f5.pdf');

  if (!fs.existsSync(pdfPath)) {
    console.error('❌ sejarah-f5.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < SEJARAH_F5_CHAPTERS.length; i++) {
    const chapter = SEJARAH_F5_CHAPTERS[i];
    const nextChapter = SEJARAH_F5_CHAPTERS[i + 1] || null;

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
          subject: 'SEJARAH',
          form: 'FORM_5',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Sejarah Form 5 Textbook (KPM)'
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

seedSejarahF5()
  .catch(console.error)
  .finally(() => prisma.$disconnect());