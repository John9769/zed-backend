const prisma = require('../lib/prisma');

// ============================================================
// EXTRACT KEYWORDS FROM STUDENT MESSAGE
// ============================================================

const extractKeywords = (message) => {
  // Remove common filler words
  const stopWords = [
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'shall', 'can',
    'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through',
    'about', 'above', 'after', 'before', 'between', 'out', 'off',
    'over', 'under', 'again', 'then', 'once', 'and', 'but', 'or',
    'so', 'yet', 'both', 'not', 'nor', 'just', 'this', 'that',
    'these', 'those', 'what', 'how', 'why', 'when', 'where', 'who',
    'which', 'nak', 'apa', 'macam', 'mana', 'boleh', 'tak', 'ada',
    'saya', 'kita', 'dia', 'mereka', 'satu', 'dua', 'tiga', 'yang',
    'untuk', 'dengan', 'dalam', 'ini', 'itu', 'juga', 'atau', 'dan',
    'la', 'lah', 'eh', 'ah', 'oh', 'okay', 'ok', 'please', 'help',
    'faham', 'explain', 'tolong', 'cuba', 'tell', 'me', 'my', 'i',
    'you', 'we', 'us', 'it', 'its', 'he', 'she', 'they', 'them'
  ];

  const words = message
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));

  // Return unique keywords
  return [...new Set(words)];
};

// ============================================================
// SEARCH SUBJECT CONTENT
// Full-text search using PostgreSQL ILIKE
// ============================================================

const searchSubjectContent = async (subject, keywords, limit = 3) => {
  if (!keywords || keywords.length === 0) return [];

  try {
    // Build OR conditions for each keyword
    const results = await prisma.subjectContent.findMany({
      where: {
        subject,
        OR: keywords.map(keyword => ({
          OR: [
            { body: { contains: keyword, mode: 'insensitive' } },
            { title: { contains: keyword, mode: 'insensitive' } },
            { topic: { contains: keyword, mode: 'insensitive' } },
            { chapter: { contains: keyword, mode: 'insensitive' } }
          ]
        }))
      },
      take: limit,
      orderBy: { updatedAt: 'desc' }
    });

    return results;
  } catch (error) {
    console.error('searchSubjectContent error:', error.message);
    return [];
  }
};

// ============================================================
// SEARCH PAST YEAR QUESTIONS
// ============================================================

const searchPastYearQuestions = async (subject, keywords, limit = 2) => {
  if (!keywords || keywords.length === 0) return [];

  try {
    const results = await prisma.pastYearQuestion.findMany({
      where: {
        subject,
        OR: keywords.map(keyword => ({
          OR: [
            { question: { contains: keyword, mode: 'insensitive' } },
            { markingScheme: { contains: keyword, mode: 'insensitive' } }
          ]
        }))
      },
      take: limit,
      orderBy: { year: 'desc' }
    });

    return results;
  } catch (error) {
    console.error('searchPastYearQuestions error:', error.message);
    return [];
  }
};

// ============================================================
// BUILD RAG CONTEXT BLOCK
// This gets injected into Zed's system prompt
// ============================================================

const buildRagContext = async (subject, message) => {
  const keywords = extractKeywords(message);

  if (keywords.length === 0) {
    return '';
  }

  const [contentResults, questionResults] = await Promise.all([
    searchSubjectContent(subject, keywords),
    searchPastYearQuestions(subject, keywords)
  ]);

  if (contentResults.length === 0 && questionResults.length === 0) {
    return '';
  }

  let ragBlock = `\n--- SPM REFERENCE MATERIAL ---\n`;
  ragBlock += `(Use this content to answer accurately. Always align with SPM syllabus.)\n`;

  if (contentResults.length > 0) {
    ragBlock += `\n📚 SYLLABUS CONTENT:\n`;
    contentResults.forEach((content, index) => {
      ragBlock += `\n[${index + 1}] ${content.chapter} — ${content.topic}\n`;
      ragBlock += `${content.body.substring(0, 500)}...\n`; // limit to 500 chars per chunk
    });
  }

  if (questionResults.length > 0) {
    ragBlock += `\n📝 RELATED SPM PAST YEAR QUESTIONS:\n`;
    questionResults.forEach((q, index) => {
      ragBlock += `\n[SPM ${q.year}${q.questionNo ? ` — ${q.questionNo}` : ''}]\n`;
      ragBlock += `Question: ${q.question.substring(0, 300)}\n`;
      ragBlock += `Marking Scheme: ${q.markingScheme.substring(0, 300)}\n`;
    });
  }

  ragBlock += `\n--- END REFERENCE MATERIAL ---\n`;

  return ragBlock;
};

module.exports = { buildRagContext, extractKeywords };