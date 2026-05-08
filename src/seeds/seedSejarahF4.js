require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const SEJARAH_F4_CHAPTERS = [
  {
    id: 'sejarah-f4-ch1',
    chapter: 'Bab 1',
    topic: 'Warisan Negara Bangsa',
    keywords: ['warisan negara bangsa', 'kesultanan melayu', 'melaka', 'sistem pemerintahan', 'undang-undang']
  },
  {
    id: 'sejarah-f4-ch2',
    chapter: 'Bab 2',
    topic: 'Kebangkitan Nasionalisme',
    keywords: ['kebangkitan nasionalisme', 'nasionalisme', 'kesedaran kebangsaan', 'persatuan melayu', 'gerakan nasionalisme']
  },
  {
    id: 'sejarah-f4-ch3',
    chapter: 'Bab 3',
    topic: 'Konflik Dunia dan Pendudukan Jepun di Negara Kita',
    keywords: ['perang dunia', 'pendudukan jepun', 'tentera jepun', 'pendudukan jepun di negara kita', 'kekalahan jepun']
  },
  {
    id: 'sejarah-f4-ch4',
    chapter: 'Bab 4',
    topic: 'Era Peralihan Kuasa British di Negara Kita',
    keywords: ['malayan union', 'pentadbiran tentera british', 'bma', 'peralihan kuasa british', 'penyerahan sarawak']
  },
  {
    id: 'sejarah-f4-ch5',
    chapter: 'Bab 5',
    topic: 'Persekutuan Tanah Melayu 1948',
    keywords: ['persekutuan tanah melayu 1948', 'perjanjian persekutuan', 'penggubalan perlembagaan', 'persekutuan tanah melayu']
  },
  {
    id: 'sejarah-f4-ch6',
    chapter: 'Bab 6',
    topic: 'Ancaman Komunis dan Perisytiharan Darurat',
    keywords: ['ancaman komunis', 'perisytiharan darurat', 'parti komunis malaya', 'pkm', 'darurat']
  },
  {
    id: 'sejarah-f4-ch7',
    chapter: 'Bab 7',
    topic: 'Usaha Ke Arah Kemerdekaan',
    keywords: ['usaha ke arah kemerdekaan', 'jawatankuasa hubungan antara kaum', 'sistem ahli', 'idea negara merdeka']
  },
  {
    id: 'sejarah-f4-ch8',
    chapter: 'Bab 8',
    topic: 'Pilihan Raya',
    keywords: ['pilihan raya', 'pilihan raya umum', 'suruhanjaya pilihan raya', 'pilihanraya majlis bandaran']
  },
  {
    id: 'sejarah-f4-ch9',
    chapter: 'Bab 9',
    topic: 'Perlembagaan Persekutuan Tanah Melayu 1957',
    keywords: ['perlembagaan persekutuan', 'suruhanjaya reid', 'perlembagaan 1957', 'hak asasi', 'raja berperlembagaan']
  },
  {
    id: 'sejarah-f4-ch10',
    chapter: 'Bab 10',
    topic: 'Pemasyhuran Kemerdekaan',
    keywords: ['pemasyhuran kemerdekaan', 'hari kemerdekaan', 'pengertian kemerdekaan', 'detik kemerdekaan', 'kesan kemerdekaan']
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

async function seedSejarahF4() {
  console.log('🧠 Starting Sejarah Form 4 seeding...');
  console.log('📚 Total chapters: 10');

  const pdfPath = path.join(__dirname, 'pdfs', 'sejarah-f4.pdf');

  if (!fs.existsSync(pdfPath)) {
    console.error('❌ sejarah-f4.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < SEJARAH_F4_CHAPTERS.length; i++) {
    const chapter = SEJARAH_F4_CHAPTERS[i];
    const nextChapter = SEJARAH_F4_CHAPTERS[i + 1] || null;

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
          form: 'FORM_4',
          chapter: chapter.chapter,
          topic: chapter.topic,
          title: `${chapter.chapter}: ${chapter.topic}`,
          body: chapterText,
          source: 'KSSM Sejarah Form 4 Textbook (KPM)'
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

seedSejarahF4()
  .catch(console.error)
  .finally(() => prisma.$disconnect());