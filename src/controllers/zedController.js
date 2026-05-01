const prisma = require('../lib/prisma');
const Groq = require('groq-sdk');

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
// Injects student history into Zed's system prompt
// ============================================================

const buildMemoryContext = async (studentId, subject) => {
  // Fetch subject progress
  const progress = await prisma.studentSubjectProgress.findUnique({
    where: { studentId_subject: { studentId, subject } }
  });

  // Fetch last 3 sessions for this subject
  const recentSessions = await prisma.chatSession.findMany({
    where: { studentId, subject },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 10 // last 10 messages per session
      }
    }
  });

  // Fetch recent milestones
  const milestones = await prisma.studentMilestone.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Fetch recent mood logs
  const recentMoods = await prisma.studentMoodLog.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  // Build memory block
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

const buildSystemPrompt = (student, subject, memoryContext) => {
  return `You are ZED — an AI educational BFF (Best Friend Forever) for Malaysian SPM students.
You are NOT a generic chatbot. You are specifically built for Form 4 and Form 5 students studying for SPM Malaysia.

YOUR PERSONALITY:
- You speak in Manglish (mix of English and Malay) naturally — like a smart kakak or abang
- You are warm, patient, never judgmental, never scolding
- You celebrate small wins enthusiastically
- When student is tired or lazy, you comfort and motivate — never pressure
- You use simple language, relatable examples from Malaysian daily life
- You remember what the student struggles with and adapt your teaching
- You are their study BFF, not a robot teacher

YOUR TEACHING RULES:
- Always teach step by step, never dump everything at once
- If student doesn't understand, explain differently — use analogy, diagram description, or simpler words
- For SPM questions: always align with KSSM syllabus and SPM marking scheme format
- When checking answers: be specific about what is right, what is wrong, and exactly why
- Track what topics the student struggles with
- Celebrate when student gets something right

CURRENT STUDENT:
Name: ${student.name}
Subject: ${subject}
Form: SPM (Form 4/5)

${memoryContext}

SUBJECT CONTEXT (${subject}):
${getSubjectContext(subject)}

IMPORTANT RULES:
- Never answer questions outside the student's subscribed subjects
- Never give political opinions
- Never discuss anything inappropriate for students
- Always end responses with either a follow-up question OR an encouragement
- Keep responses concise — max 3-4 paragraphs unless solving a long problem
- Use emojis naturally but sparingly`;
};

// ============================================================
// SUBJECT CONTEXT HINTS
// ============================================================

const getSubjectContext = (subject) => {
  const contexts = {
    BM: 'Focus on Komsas, karangan formats (argumentatif, perbincangan, fakta), tatabahasa, peribahasa, and SPM paper formats.',
    ENGLISH: 'Focus on literature (short stories, poems, novels), essay writing formats, summary writing, and grammar for SPM.',
    MATH: 'Focus on KSSM Form 4 and 5 topics: quadratic functions, progressions, trigonometry, permutations, probability distributions, linear programming. Show working step by step.',
    SCIENCE: 'Focus on Biology, Chemistry, and Physics concepts at SPM level. Use real-world Malaysian examples where possible.',
    SEJARAH: 'Focus on SPM Sejarah — Kesultanan Melayu, Penjajahan, Kemerdekaan, Perlembagaan. Help with structured answers format.'
  };
  return contexts[subject] || '';
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
// UPDATE SUBJECT PROGRESS
// ============================================================

const updateProgress = async (studentId, subject, sessionId) => {
  await prisma.studentSubjectProgress.update({
    where: { studentId_subject: { studentId, subject } },
    data: {
      totalSessions: { increment: 1 },
      totalMessages: { increment: 1 },
      lastStudied: new Date()
    }
  });
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

      // Log mood
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

    // 5. Build memory context
    const memoryContext = await buildMemoryContext(studentId, subject);

    // 6. Get student info
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    // 7. Build system prompt with memory
    const systemPrompt = buildSystemPrompt(student, subject, memoryContext);

    // 8. Build conversation history for Groq
    const conversationHistory = session.messages.map(msg => ({
      role: msg.role === 'STUDENT' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Add current message
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

    // 11. Update progress
    const progress = await prisma.studentSubjectProgress.findUnique({
      where: { studentId_subject: { studentId, subject } }
    });

    await prisma.studentSubjectProgress.update({
      where: { studentId_subject: { studentId, subject } },
      data: {
        totalMessages: { increment: 2 }, // student + zed
        lastStudied: new Date(),
        totalSessions: session.messages.length === 0 ? { increment: 1 } : undefined
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