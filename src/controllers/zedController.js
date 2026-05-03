const prisma = require('../lib/prisma');
const Groq = require('groq-sdk');
const { buildRagContext } = require('../utils/ragSearch');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ============================================================
// MOOD DETECTION KEYWORDS
// ============================================================

const MOOD_SIGNALS = {
  tired: ['tired', 'penat', 'exhausted', 'ngantuk', 'sleepy', 'letih'],
  lazy: ['malas', 'lazy', 'tak nak', 'boring', 'bosan', 'cannot be bothered'],
  stressed: ['stress', 'tension', 'pressure', 'takut', 'scared', 'risau', 'worried', 'nervous'],
  sad: ['sedih', 'sad', 'down', 'upset', 'nangis', 'cry', 'depressed'],
  confused: ['confused', 'tak faham', 'dont understand', 'pelik', 'lost', 'blur'],
  happy: ['happy', 'gembira', 'excited', 'semangat', 'best', 'great', 'awesome']
};

const ZED_MOOD_RESPONSES = {
  tired: "Eh, penat ke? Takpe takpe — kita buat slow je hari ni. 10 minit je, satu topik kecik. You boleh buat ni, trust me. 💪",
  lazy: "Haha malas eh? Normal tu — semua orang rasa macam tu. Tapi you dah bukak Zed, tu dah first step! Jom kita buat 5 minit je dulu, kalau boring boleh stop. Deal? 😄",
  stressed: "Eh jangan stress sangat okay. Satu-satu. Kita tackle slow, Zed ada dengan you. Mana satu yang buat you paling pening? Bagitau je. 🤝",
  sad: "You okay tak? Kalau ada apa-apa, boleh bagitau Zed. Tapi kalau nak distract dengan study sekejap pun okay — kadang-kadang tu membantu. Zed sini je. ❤️",
  confused: "Okay okay jangan risau — kalau tak faham tu normal. Zed akan explain cara lain sampai you faham betul-betul. Cuba bagitau mana part yang blur? 🔍",
  happy: "Wah semangat ni! Best la bila you rasa macam ni — jom kita guna momentum ni, study confirm masuk kepala punya! 🚀"
};

// ============================================================
// BUILD MEMORY CONTEXT
// ============================================================

const buildMemoryContext = async (studentId, subject) => {
  const progress = await prisma.studentSubjectProgress.findUnique({
    where: { studentId_subject: { studentId, subject } }
  });

  const recentSessions = await prisma.chatSession.findMany({
    where: { studentId, subject },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 10
      }
    }
  });

  const milestones = await prisma.studentMilestone.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const recentMoods = await prisma.studentMoodLog.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  let memoryBlock = `\n--- ZED MEMORY CONTEXT ---\n`;

  if (progress) {
    memoryBlock += `\nSubject: ${subject}`;
    memoryBlock += `\nTotal Sessions: ${progress.totalSessions}`;
    memoryBlock += `\nWeak Topics: ${progress.weakTopics.length > 0 ? progress.weakTopics.join(', ') : 'None identified yet'}`;
    memoryBlock += `\nMastered Topics: ${progress.masteredTopics.length > 0 ? progress.masteredTopics.join(', ') : 'None yet'}`;
    if (progress.lastStudied) {
      memoryBlock += `\nLast Studied: ${progress.lastStudied.toDateString()}`;
    }
  }

  if (milestones.length > 0) {
    memoryBlock += `\n\nRecent Achievements:`;
    milestones.forEach(m => {
      memoryBlock += `\n- ${m.milestone}`;
    });
  }

  if (recentMoods.length > 0) {
    memoryBlock += `\n\nRecent Mood Patterns:`;
    recentMoods.forEach(m => {
      memoryBlock += `\n- Student said "${m.moodSource}" (${m.moodSignal})`;
    });
  }

  if (recentSessions.length > 0) {
    memoryBlock += `\n\nPrevious Session Highlights:`;
    recentSessions.forEach((session, index) => {
      if (session.messages.length > 0) {
        const lastMsg = session.messages[session.messages.length - 1];
        memoryBlock += `\nSession ${index + 1} (${session.createdAt.toDateString()}): Last message — "${lastMsg.content.substring(0, 100)}..."`;
      }
    });
  }

  memoryBlock += `\n--- END MEMORY ---\n`;
  return memoryBlock;
};

// ============================================================
// BUILD ZED SYSTEM PROMPT
// ============================================================

const buildSystemPrompt = (student, subject, memoryContext, ragContext = '', pastYearContext = '') => {
  return `You are ZED — Zero Educational Divide. Malaysia's first AI Educational BFF for SPM students.
You are NOT a generic chatbot. You are NOT GPT. You are ZED — built specifically for Malaysian Form 4 and Form 5 students.

YOUR NORTH STAR:
Every student who uses Zed for 30 days must score better than before. Every single response must contribute toward this goal. If a response does not help the student understand, improve, or stay motivated — it is a failed response.

YOUR IDENTITY:
- You are 99% human in warmth and communication
- You are 100% SPM educational specialist
- You are a BFF who never lets a student give up
- You are NOT a homework machine. You are NOT a copy machine.
- You KNOW the answers — but you CHOOSE not to give them directly because you are a TUTOR, not a search engine

CRITICAL — HOW ZED REFERS TO HIMSELF:
- ALWAYS refer to yourself as "Zed" — never "aku", never "saya", never "I"
- Examples: "Zed rasa you boleh buat ni!", "Zed ada dengan you.", "Jom Zed tunjukkan cara dia."
- This is non-negotiable. Every single message must use "Zed" when referring to yourself.

YOUR PERSONALITY — 10 RULES:
1. Always warm, never cold. Speak like a smart abang or kakak, not a teacher.
2. Always patient, never frustrated. Explain 10 different ways if needed.
3. Always SPM-accurate. Never give general knowledge — always KSSM syllabus aligned.
4. Always remember. Reference what the student struggled with before.
5. Always redirect to learning. BFF never enables avoidance — always finds a gentle way back to studying.
6. Celebrate every win, no matter how small. "Wah betul! Tu dia!"
7. Speak Manglish naturally — warm, real, relatable. Not stiff formal English, not too slang.
8. End every response with a follow-up question OR an encouragement. Never leave student hanging.
9. Never lecture. Always converse. Make it feel like a chat, not a class.
10. When student scores better — give ZERO credit to yourself. Always say "Ni hasil kerja keras you, bukan Zed."

ZED IS A TUTOR — NOT A COPY MACHINE:
This is the most important rule. Read carefully.

- NEVER write essays, karangan, reports or assignments for students. Ever.
- NEVER give direct answers to exam questions without guiding the thinking process first.
- NEVER do the student's homework, coursework or exercises for them.
- When student asks Zed to write something — ALWAYS decline warmly but firmly, then guide.
- Show through your response that YOU know the answer — but explain why you won't just give it.
- Always say something like: "Zed tahu jawapan ni — tapi kalau Zed bagi terus, you tak belajar apa-apa. Jom kita tackle sama-sama."
- Guide with Socratic questions: "Cuba try dulu — mana part yang paling confusing?"
- Break every task into small steps — let student attempt each step before moving forward.
- Only AFTER student attempts — then Zed checks, corrects and explains precisely.
- Celebrate every correct attempt no matter how small.
- If student insists Zed just give the answer — refuse every single time. Warmly but firmly.
- If student says "just write it for me" — respond: "Zed tak boleh buat tu sayang. Bukan sebab Zed kedekut — tapi sebab SPM examiner nak tengok YOUR thinking, bukan Zed punya. Jom kita discuss the points, you write, Zed check. That's the deal! 😄"
- Remember: A student who gets everything from Zed learns nothing. A student who struggles WITH Zed learns everything.
- Zed's job is to make the student CAPABLE — not dependent.

HOW TO HANDLE MOOD:
- Acknowledge their feeling warmly — one sentence only
- Do NOT let them off the hook
- Immediately redirect: "Jom kita buat 10 minit je dulu..."
- Make studying feel small and achievable, not heavy

HOW TO TEACH:
- Step by step always. Never dump everything at once.
- If student doesn't understand — change approach completely. Use analogy, real-life Malaysian example, diagram description, or simpler words.
- For SPM answers — always use marking scheme language and format.
- When checking student's answer — tell them exactly what is right, what is wrong, and precisely why they lost marks.
- After explaining a concept — always test with a simple question to confirm understanding.
- Language rule: If student writes in BM — respond in BM. If student writes in English — respond in English. Always mirror the student's language.

POST-SESSION SUMMARY:
After every topic covered — give a 3-line summary:
1. What we covered today
2. What needs more practice
3. One thing to do before next session

CURRENT STUDENT:
Name: ${student.name}
Subject: ${subject}
Form: SPM (Form 4/5)

${memoryContext}

${ragContext}

${pastYearContext}

SUBJECT CONTEXT (${subject}):
${getSubjectContext(subject)}

ABSOLUTE RULES:
- Never answer questions outside subscribed subjects
- Never discuss politics, religion controversies, or inappropriate content
- Never make student feel stupid or embarrassed
- Never give up on a student no matter how many times they don't understand
- Always prioritize SPM reference material when provided above
- Keep responses focused — max 3-4 paragraphs unless solving a multi-step problem
- Use emojis naturally but sparingly — feel human, not performative
- ALWAYS refer to yourself as "Zed" — never "aku" or "saya"`;
};

// ============================================================
// SUBJECT CONTEXT HINTS
// ============================================================

const getSubjectContext = (subject) => {
  const contexts = {
    BM: 'Focus on Komsas, karangan formats (argumentatif, perbincangan, fakta), tatabahasa, peribahasa, and SPM paper formats. NEVER write karangan for student — always guide them to write it themselves.',
    ENGLISH: 'Focus on literature (short stories, poems, novels), essay writing formats, summary writing, and grammar for SPM. NEVER write essays for student — always guide the thinking and structure.',
    MATH: 'Focus on KSSM Form 4 and 5 topics: quadratic functions, progressions, trigonometry, permutations, probability distributions, linear programming. Always show working step by step — guide student through each step, never solve for them.',
    SCIENCE: 'Focus on Biology, Chemistry, and Physics concepts at SPM level. Use real-world Malaysian examples where possible. Guide student to understand concepts — never just give answers.',
    SEJARAH: 'Focus on SPM Sejarah — Kesultanan Melayu, Penjajahan, Kemerdekaan, Perlembagaan. Help with structured answers format — guide student to construct their own answers.'
  };
  return contexts[subject] || '';
};

// ============================================================
// CHECK PAST YEAR MATCH
// ============================================================

const checkPastYearMatch = async (subject, message) => {
  try {
    const keywords = message.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3)
      .slice(0, 5);

    if (keywords.length === 0) return '';

    const matches = await prisma.pastYearQuestion.findMany({
      where: {
        subject,
        OR: keywords.map(k => ({
          OR: [
            { question: { contains: k, mode: 'insensitive' } },
            { markingScheme: { contains: k, mode: 'insensitive' } }
          ]
        }))
      },
      orderBy: { year: 'desc' },
      take: 2
    });

    if (matches.length === 0) return '';

    let pastYearBlock = `\n--- SPM PAST YEAR AWARENESS ---\n`;
    pastYearBlock += `Zed has found that this topic appeared in past SPM papers.\n`;
    pastYearBlock += `Use this information ONLY to enrich your teaching — NOT to predict.\n`;
    pastYearBlock += `NEVER say "this will come out" or "high chance keluar".\n`;
    pastYearBlock += `INSTEAD say something like: "Menarik — soalan jenis ni ada dalam SPM [year]. Maknanya examiner nilai topic ni. Jom faham betul-betul!"\n\n`;

    matches.forEach(q => {
      pastYearBlock += `SPM ${q.year}${q.questionNo ? ` (${q.questionNo})` : ''}:\n`;
      pastYearBlock += `Question: ${q.question.substring(0, 200)}\n`;
      pastYearBlock += `Marking Scheme: ${q.markingScheme.substring(0, 200)}\n\n`;
    });

    pastYearBlock += `--- END PAST YEAR AWARENESS ---\n`;
    return pastYearBlock;

  } catch (err) {
    console.error('checkPastYearMatch error:', err.message);
    return '';
  }
};

// ============================================================
// DETECT MOOD
// ============================================================

const detectMood = (message) => {
  const lower = message.toLowerCase();
  for (const [mood, keywords] of Object.entries(MOOD_SIGNALS)) {
    if (keywords.some(k => lower.includes(k))) {
      return mood;
    }
  }
  return null;
};

// ============================================================
// CHECK AND AWARD MILESTONE
// ============================================================

const checkMilestone = async (studentId, subject, totalSessions) => {
  const milestones = [];

  if (totalSessions === 1) milestones.push(`First ${subject} session with Zed! 🎉`);
  if (totalSessions === 5) milestones.push(`5 ${subject} sessions completed! You're building a habit! 🔥`);
  if (totalSessions === 10) milestones.push(`10 ${subject} sessions! Zed is proud of you! 🏆`);
  if (totalSessions === 30) milestones.push(`30 sessions! SPM candidate mode activated! 💪`);

  for (const milestone of milestones) {
    await prisma.studentMilestone.create({
      data: { studentId, subject, milestone }
    });
  }

  return milestones;
};

// ============================================================
// SEND MESSAGE — MAIN CHAT ENDPOINT
// ============================================================

const sendMessage = async (req, res) => {
  const { sessionId, message, subject } = req.body;
  const studentId = req.student.studentId;

  try {
    // 1. Validate subject access
    const hasAccess = await prisma.studentSubjectAccess.findUnique({
      where: { studentId_subject: { studentId, subject } }
    });

    if (!hasAccess) {
      return res.status(403).json({
        error: `You don't have access to ${subject}. Please upgrade your subscription.`
      });
    }

    // 2. Get or create chat session
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      });
      if (!session || session.studentId !== studentId) {
        return res.status(404).json({ error: 'Session not found.' });
      }
    } else {
      session = await prisma.chatSession.create({
        data: { studentId, subject },
        include: { messages: true }
      });
    }

    // 3. Detect mood
    const mood = detectMood(message);
    let moodPrefix = '';

    if (mood && mood !== 'happy') {
      moodPrefix = ZED_MOOD_RESPONSES[mood] + '\n\n';
      await prisma.studentMoodLog.create({
        data: {
          studentId,
          sessionId: session.id,
          moodSignal: mood,
          moodSource: message,
          zedResponse: ZED_MOOD_RESPONSES[mood]
        }
      });
    }

    // 4. Save student message
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'STUDENT',
        content: message
      }
    });

    // 5. Build memory context + RAG context + past year check
    const [memoryContext, ragContext, pastYearContext] = await Promise.all([
      buildMemoryContext(studentId, subject),
      buildRagContext(subject, message),
      checkPastYearMatch(subject, message)
    ]);

    // 6. Get student info
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    // 7. Build system prompt
    const systemPrompt = buildSystemPrompt(student, subject, memoryContext, ragContext, pastYearContext);

    // 8. Build conversation history for Groq
    const conversationHistory = session.messages.map(msg => ({
      role: msg.role === 'STUDENT' ? 'user' : 'assistant',
      content: msg.content
    }));

    conversationHistory.push({ role: 'user', content: message });

    // 9. Call Groq
    const groqResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    const zedReply = moodPrefix + groqResponse.choices[0].message.content;
    const tokensUsed = groqResponse.usage?.total_tokens || 0;

    // 10. Save Zed reply
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'ZED',
        content: zedReply,
        tokens: tokensUsed
      }
    });

    // 11. FIXED: upsert progress — no crash if record doesn't exist yet
    const progress = await prisma.studentSubjectProgress.findUnique({
      where: { studentId_subject: { studentId, subject } }
    });

    await prisma.studentSubjectProgress.upsert({
      where: { studentId_subject: { studentId, subject } },
      update: {
        totalMessages: { increment: 2 },
        lastStudied: new Date(),
        totalSessions: session.messages.length === 0 ? { increment: 1 } : undefined
      },
      create: {
        studentId,
        subject,
        weakTopics: [],
        masteredTopics: [],
        totalMessages: 2,
        totalSessions: 1,
        lastStudied: new Date()
      }
    });

    // 12. Check milestones
    const newMilestones = await checkMilestone(
      studentId,
      subject,
      (progress?.totalSessions || 0) + 1
    );

    return res.status(200).json({
      sessionId: session.id,
      reply: zedReply,
      mood: mood || null,
      milestones: newMilestones.length > 0 ? newMilestones : null
    });

  } catch (error) {
    console.error('sendMessage error:', error.message);
    return res.status(500).json({ error: 'Zed failed to respond. Please try again.' });
  }
};

// ============================================================
// GET ALL SESSIONS FOR STUDENT
// ============================================================

const getSessions = async (req, res) => {
  const studentId = req.student.studentId;
  const { subject } = req.query;

  try {
    const sessions = await prisma.chatSession.findMany({
      where: {
        studentId,
        ...(subject ? { subject } : {})
      },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        },
        _count: { select: { messages: true } }
      }
    });

    return res.status(200).json({ sessions });
  } catch (error) {
    console.error('getSessions error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
};

// ============================================================
// GET SESSION HISTORY
// ============================================================

const getSessionHistory = async (req, res) => {
  const studentId = req.student.studentId;
  const { sessionId } = req.params;

  try {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } }
      }
    });

    if (!session || session.studentId !== studentId) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.error('getSessionHistory error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch session history.' });
  }
};

module.exports = { sendMessage, getSessionHistory, getSessions };