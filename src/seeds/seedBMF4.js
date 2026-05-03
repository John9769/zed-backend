require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Part 1 (78 pages) covers Tema 1-4 only
// Tema 5-16 pending — need bm-f4-part2.pdf
const BM_F4_TEMAS = [
  {
    id: 'bm-f4-tema1',
    tema: 'Tema 1',
    topic: 'Merealisasikan Impian',
    keywords: ['kitalah juara', 'menawan samudera', 'jutawan sukan', 'lautan api kurenangi', 'menyusuri pulau inspirasi']
  },
  {
    id: 'bm-f4-tema2',
    tema: 'Tema 2',
    topic: 'Insan Terdidik, Negara Sejahtera',
    keywords: ['nutrien untuk minda', 'bahasa melayu di persada dunia', 'evolusi pembelajaran sepanjang hayat', 'malaysia membaca', 'jelajah bahasa']
  },
  {
    id: 'bm-f4-tema3',
    tema: 'Tema 3',
    topic: 'Memetik Bintang',
    keywords: ['kerjaya di awan biru', 'saksi senyap rungkai misteri', 'dari titik ke titik', 'menjulang potensi diri', 'harapan setinggi gunung']
  },
  {
    id: 'bm-f4-tema4',
    tema: 'Tema 4',
    topic: 'Menjulang Harapan di Bumi Bertuah',
    keywords: ['semerah rozel', 'terbaik dari kolam', 'realisasikan impian', 'serikandi berjasa', 'penternak jaya']
  }
];

const MIN_CHUNK_LENGTH = 500;

const extractTemaText = (fullText, tema, nextTema) => {
  const text = fullText.toLowerCase();
  const searchFrom = 8000;

  const allHits = [];
  for (const keyword of tema.keywords) {
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
    if (nextTema) {
      for (const keyword of nextTema.keywords) {
        const idx = text.indexOf(keyword.toLowerCase(), startIdx + 100);
        if (idx !== -1 && idx < endIdx) {
          endIdx = idx;
        }
      }
    }

    const temaText = fullText.substring(startIdx, endIdx).trim();

    if (temaText.length < MIN_CHUNK_LENGTH) {
      console.log(`   ⚡ Skipped short hit at ${startIdx} (${temaText.length} chars) — likely TOC`);
      continue;
    }

    return temaText.substring(0, 4000);
  }

  return null;
};

async function seedBMF4() {
  console.log('🧠 Starting BM Form 4 seeding...');
  console.log('📚 Part 1 covers Tema 1-4 (78 pages)');

  const pdfPath = path.join(__dirname, 'pdfs', 'bm-f4-part1.pdf');

  if (!fs.existsSync(pdfPath)) {
    console.error('❌ bm-f4-part1.pdf not found in src/seeds/pdfs/');
    process.exit(1);
  }

  console.log('📄 Reading PDF...');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const fullText = pdfData.text;
  console.log(`✅ PDF parsed. Total characters: ${fullText.length}`);

  let seeded = 0;
  let failed = 0;

  for (let i = 0; i < BM_F4_TEMAS.length; i++) {
    const tema = BM_F4_TEMAS[i];
    const nextTema = BM_F4_TEMAS[i + 1] || null;

    const temaText = extractTemaText(fullText, tema, nextTema);

    if (!temaText) {
      console.log(`⚠️  Could not extract: ${tema.tema} — ${tema.topic}`);
      failed++;
      continue;
    }

    try {
      await prisma.subjectContent.upsert({
        where: { id: tema.id },
        update: { body: temaText, updatedAt: new Date() },
        create: {
          id: tema.id,
          subject: 'BM',
          form: 'FORM_4',
          chapter: tema.tema,
          topic: tema.topic,
          title: `${tema.tema}: ${tema.topic}`,
          body: temaText,
          source: 'KSSM Bahasa Melayu Tingkatan 4 (KPM)'
        }
      });
      console.log(`✅ Seeded: ${tema.tema} — ${tema.topic} (${temaText.length} chars)`);
      seeded++;
    } catch (err) {
      console.error(`❌ Failed: ${tema.tema}:`, err.message);
      failed++;
    }
  }

  console.log(`\n🎉 Done!`);
  console.log(`✅ Seeded: ${seeded}/4 tema`);
  console.log(`❌ Failed: ${failed}/4 tema`);
  console.log(`\n⚠️  Tema 5-16 pending — need bm-f4-part2.pdf`);
  console.log(`Zed now knows BM Form 4 Part 1! 🧠`);
}

seedBMF4()
  .catch(console.error)
  .finally(() => prisma.$disconnect());