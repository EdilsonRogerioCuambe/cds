import { EnrollmentStatus, PaymentStatus, PrismaClient, Role, UserStatus } from "@prisma/client";



import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();

const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
  },
});

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const future = (days: number, hour = 19, min = 0) => {
  const d = new Date('2026-02-20T00:00:00Z');
  d.setDate(d.getDate() + days);
  d.setUTCHours(hour, min, 0, 0);
  return d;
};

// ─────────────────────────────────────────────────────────────
// QUIZ TEMPLATES
// ─────────────────────────────────────────────────────────────
const vocabularyQuiz = (words: any[]) =>
  words.map((w, i) => ({
    id: `q${i + 1}`,
    type: 'multiple_choice',
    question: `What is the meaning of "${w.word}"?`,
    options: w.options,
    correctAnswer: w.correct,
    explanation: w.explanation,
    points: 10,
  }));

const fillBlankQuiz = (sentences: any[]) =>
  sentences.map((s, i) => ({
    id: `q${i + 1}`,
    type: 'fill_blank',
    question: s.question,
    correctAnswer: s.answer,
    hint: s.hint || null,
    points: 10,
  }));

const listeningQuiz = (items: any[]) =>
  items.map((it, i) => ({
    id: `q${i + 1}`,
    type: 'listening',
    audioScript: it.script,
    question: it.question,
    options: it.options,
    correctAnswer: it.correct,
    points: 15,
  }));

const trueFalseQuiz = (items: any[]) =>
  items.map((it, i) => ({
    id: `q${i + 1}`,
    type: 'true_false',
    question: it.question,
    correctAnswer: it.answer,
    explanation: it.explanation,
    points: 10,
  }));

const lessonContent = {
  // ── A1 ──────────────────────────────────────────────────────
  a1_greetings: `
# Greetings & Introductions

## Hello, World! 👋

Welcome to your first English lesson! Today we learn how to greet people and introduce ourselves.

---

## Basic Greetings

| Formal | Informal |
|--------|----------|
| Good morning | Hi / Hey |
| Good afternoon | Hello |
| Good evening | What's up? |
| How do you do? | How are you? |

**Responses:**
- I'm fine, thank you. / I'm good, thanks!
- Not bad. / Pretty good!
- Great! / Wonderful!

---

## Introducing Yourself

**Structure:**
> My name is [name]. / I'm [name].
> I'm from [country/city].
> I'm [age] years old.
> I'm a [job/student].

**Example dialogue:**
> **A:** Hi! My name is Ana. What's your name?
> **B:** Hello, Ana! I'm Carlos. Nice to meet you!
> **A:** Nice to meet you too! Where are you from?
> **B:** I'm from Brazil. And you?
> **A:** I'm from Portugal.

---

## Saying Goodbye

- Goodbye / Bye / Bye-bye
- See you later! / See you soon!
- Have a good day! / Have a nice day!
- Take care!
- Good night! (only when leaving at night OR before sleeping)

---

## 📝 Key Vocabulary

| English | Portuguese | Example |
|---------|-----------|---------|
| Hello | Olá | Hello, how are you? |
| My name is | Meu nome é | My name is Maria. |
| Nice to meet you | Prazer em conhecer | Nice to meet you, John! |
| Where are you from? | De onde você é? | Where are you from? |
| I'm from | Eu sou de | I'm from São Paulo. |
| How old are you? | Quantos anos você tem? | How old are you? |
| I'm ___ years old | Tenho ___ anos | I'm 25 years old. |

---

## 🗣️ Practice Dialogue

Read aloud and practice with a partner:

**Situation: First day of class**

> **Teacher:** Good morning, everyone! I'm Ms. Johnson. What's your name?
> **Student:** Good morning! My name is Pedro.
> **Teacher:** Nice to meet you, Pedro. Where are you from?
> **Student:** I'm from Rio de Janeiro.
> **Teacher:** Wonderful! How old are you, Pedro?
> **Student:** I'm 22 years old.
> **Teacher:** Great! Welcome to the class!

---

## ✅ Remember

- Use **"Good morning"** until 12:00 PM
- Use **"Good afternoon"** from 12:00 PM to 6:00 PM
- Use **"Good evening"** after 6:00 PM
- **"Good night"** is only for when you're going to sleep or leaving late at night
  `,

  a1_alphabet: `
# The English Alphabet & Pronunciation

## The 26 Letters

| Letter | Name | Sound example |
|--------|------|--------------|
| A | /eɪ/ | **A**pple |
| B | /biː/ | **B**all |
| C | /siː/ | **C**at |
| D | /diː/ | **D**og |
| E | /iː/ | **E**gg |
| F | /ɛf/ | **F**ish |
| G | /dʒiː/ | **G**irl |
| H | /eɪtʃ/ | **H**at |
| I | /aɪ/ | **I**ce |
| J | /dʒeɪ/ | **J**uice |
| K | /keɪ/ | **K**ing |
| L | /ɛl/ | **L**ion |
| M | /ɛm/ | **M**oon |
| N | /ɛn/ | **N**ight |
| O | /oʊ/ | **O**range |
| P | /piː/ | **P**en |
| Q | /kjuː/ | **Q**ueen |
| R | /ɑːr/ | **R**ain |
| S | /ɛs/ | **S**un |
| T | /tiː/ | **T**ree |
| U | /juː/ | **U**mbrella |
| V | /viː/ | **V**ase |
| W | /ˈdʌbljuː/ | **W**ater |
| X | /ɛks/ | **X**-ray |
| Y | /waɪ/ | **Y**ellow |
| Z | /ziː/ or /zɛd/ | **Z**ero |

## Vowels vs Consonants

**Vowels:** A, E, I, O, U (+ sometimes Y)
**Consonants:** All other letters

## Spelling Out Words

When you need to spell something:
> **A:** How do you spell your name?
> **B:** It's C-A-R-L-O-S.

> **A:** What's your email?
> **B:** It's pedro AT gmail DOT com — P-E-D-R-O at gmail dot com.

## Common English Spelling Patterns

| Pattern | Examples |
|---------|---------|
| -tion | nation, station, education |
| -ough | though, through, although |
| -igh | night, light, right |
| -ea | eat, read, tea |
| -ck | back, clock, duck |
  `,

  a1_numbers: `
# Numbers, Days & Dates

## Cardinal Numbers (1–100)

**1–20:**
1 = one, 2 = two, 3 = three, 4 = four, 5 = five
6 = six, 7 = seven, 8 = eight, 9 = nine, 10 = ten
11 = eleven, 12 = twelve, 13 = thirteen, 14 = fourteen, 15 = fifteen
16 = sixteen, 17 = seventeen, 18 = eighteen, 19 = nineteen, 20 = twenty

**Tens:**
30 = thirty, 40 = forty, 50 = fifty, 60 = sixty
70 = seventy, 80 = eighty, 90 = ninety, 100 = one hundred

**Compound numbers:**
21 = twenty-one, 35 = thirty-five, 99 = ninety-nine

## Ordinal Numbers

1st = first, 2nd = second, 3rd = third, 4th = fourth
5th = fifth, 6th = sixth, 7th = seventh, 8th = eighth
9th = ninth, 10th = tenth, 20th = twentieth, 21st = twenty-first

## Days of the Week

| Day | Abbreviation | Pronunciation |
|-----|-------------|--------------|
| Monday | Mon | /ˈmʌndeɪ/ |
| Tuesday | Tue | /ˈtjuːzdeɪ/ |
| Wednesday | Wed | /ˈwɛnzdeɪ/ |
| Thursday | Thu | /ˈθɜːrzdeɪ/ |
| Friday | Fri | /ˈfraɪdeɪ/ |
| Saturday | Sat | /ˈsætərdeɪ/ |
| Sunday | Sun | /ˈsʌndeɪ/ |

## Months of the Year

January, February, March, April, May, June,
July, August, September, October, November, December

## Dates

**American:** Month/Day/Year → February 20, 2026 = 02/20/2026
**British:** Day/Month/Year → 20 February 2026 = 20/02/2026

**Saying dates:**
> Today is **February twentieth, twenty twenty-six**.
> My birthday is on **March third**.
> The class starts on **January 1st** (January the first).
  `,

  a1_verb_to_be: `
# The Verb "To Be" — Present Simple

## What is "To Be"?

"To Be" is the most important verb in English. It means **ser/estar** in Portuguese.

## Full Conjugation

| Subject | To Be | Contraction | Portuguese |
|---------|-------|-------------|-----------|
| I | am | I'm | Eu sou/estou |
| You | are | You're | Você é/está |
| He | is | He's | Ele é/está |
| She | is | She's | Ela é/está |
| It | is | It's | (isso) é/está |
| We | are | We're | Nós somos/estamos |
| You | are | You're | Vocês são/estão |
| They | are | They're | Eles são/estão |

## Affirmative Sentences

> I **am** a student.
> She **is** from Canada.
> They **are** happy.
> It **is** cold today.

## Negative Sentences

Add **not** after to be:

| Full form | Contraction |
|-----------|-------------|
| I am not | I'm not |
| You are not | You aren't / You're not |
| He is not | He isn't / He's not |
| We are not | We aren't / We're not |

> I **am not** tired.
> He **isn't** at home.
> They **aren't** students.

## Questions with "To Be"

Invert the subject and verb:

> **Am** I late?
> **Are** you a teacher?
> **Is** she Brazilian?
> **Are** they friends?

**Short answers:**
> Are you ready? → **Yes, I am.** / **No, I'm not.**
> Is he happy? → **Yes, he is.** / **No, he isn't.**

## Uses of "To Be"

1. **Identity:** I am Maria. / He is the teacher.
2. **Nationality:** She is Italian. / They are Japanese.
3. **Age:** I am 25 years old.
4. **Profession:** We are engineers.
5. **State/Feeling:** I am tired. / She is happy.
6. **Location:** The book is on the table.
7. **Description:** The car is red.

## Practice

Complete with am, is, or are:
1. I ___ a student at this school.
2. She ___ my best friend.
3. They ___ from Argentina.
4. We ___ ready for the test.
5. It ___ a beautiful day.
  `,

  // ── A2 ──────────────────────────────────────────────────────
  a2_present_simple: `
# Present Simple Tense

## When to Use Present Simple

1. **Habits & routines:** I wake up at 7am every day.
2. **Facts & general truths:** The sun rises in the east.
3. **Permanent situations:** She lives in London.
4. **Schedules:** The train leaves at 9:15.

## Formation

### Affirmative

| Subject | Verb | Rule |
|---------|------|------|
| I / You / We / They | work | base form |
| He / She / It | work**s** | add -s |

**Special spelling rules for He/She/It:**
- Most verbs: add **-s** → work → works, play → plays
- End in -s, -ss, -sh, -ch, -x, -o: add **-es** → go → goes, watch → watches
- End in consonant + y: change y → **-ies** → study → studies, fly → flies

### Negative

> I **do not (don't)** like coffee.
> She **does not (doesn't)** work here.

### Questions

> **Do** you speak English?
> **Does** he live in New York?

## Time Expressions

| Always | Usually | Often | Sometimes | Rarely | Never |
|--------|---------|-------|-----------|--------|-------|
| 100% | 80% | 60% | 40% | 20% | 0% |

> She **always** drinks coffee in the morning.
> They **sometimes** eat out on weekends.
> He **never** smokes.

## Common Mistakes

❌ She don't like it. → ✅ She **doesn't** like it.
❌ Do she work here? → ✅ **Does** she work here?
❌ He work every day. → ✅ He work**s** every day.

## Example Text

> Maria is a nurse. She **works** at a hospital in São Paulo. She **wakes up** at 5:30am every day. She **doesn't have** breakfast at home — she **eats** at the hospital. She **starts** work at 7am and **finishes** at 3pm. In the evenings, she **studies** English online. She **loves** learning new languages!
  `,

  a2_shopping: `
# Shopping & Money

## At the Store — Key Phrases

**Customer:**
- Excuse me, how much is this?
- Do you have this in a different size/color?
- Can I try this on?
- I'll take it! / I'll buy this one.
- Do you accept credit cards?
- Can I have a receipt, please?

**Shop assistant:**
- Can I help you?
- What size are you looking for?
- We have it in blue, red, and black.
- The fitting room is over there.
- That'll be $45.99, please.
- Here's your change.

## Money Vocabulary

| Term | Meaning |
|------|---------|
| price | preço |
| discount / sale | desconto / promoção |
| receipt | recibo |
| cash | dinheiro |
| credit card | cartão de crédito |
| change | troco |
| bargain | pechincha / boa compra |
| expensive | caro |
| cheap / affordable | barato / acessível |
| refund | reembolso |

## Comparing Prices

- This one is **cheaper** than that one.
- The red bag is **more expensive** than the blue one.
- Which one is the **cheapest**?
- That's a **great deal**!

## Dialogue: Buying Clothes

> **Customer:** Excuse me! How much is this jacket?
> **Assistant:** It's $89.99.
> **Customer:** Do you have it in medium?
> **Assistant:** Yes, we do. Here you go.
> **Customer:** Can I try it on?
> **Assistant:** Of course! The fitting room is on your right.
> [after trying it on]
> **Customer:** I love it! I'll take it. Do you accept credit cards?
> **Assistant:** Yes, we do. That'll be $89.99.
> **Customer:** Here you go. Can I have a receipt?
> **Assistant:** Sure! Here's your receipt. Thank you!
  `,

  // ── B1 ──────────────────────────────────────────────────────
  b1_past_tenses: `
# Past Tenses in English

## 1. Past Simple

Used for **completed actions** at a specific time in the past.

**Regular verbs:** verb + -ed
> I **worked** yesterday.
> She **studied** for the exam.

**Irregular verbs:** (must memorize)
| Base | Past Simple | Past Participle |
|------|------------|----------------|
| go | went | gone |
| have | had | had |
| see | saw | seen |
| make | made | made |
| know | knew | known |
| take | took | taken |
| come | came | come |
| say | said | said |
| get | got | gotten/got |
| think | thought | thought |

**Negative:** didn't + base verb
> He **didn't go** to school.

**Questions:** Did + subject + base verb
> **Did** you see that movie?

## 2. Past Continuous

Used for **actions in progress** at a specific moment in the past.

> I **was watching** TV at 8pm.
> They **were sleeping** when I called.

**Formation:** was/were + verb-ing

**Common use — interrupted action:**
> I **was cooking** when the phone **rang**.
> While she **was reading**, he **arrived**.

## 3. Past Perfect

Used for an action that happened **before another past action**.

> By the time I arrived, she **had already left**.
> He **had never seen** snow before 2020.

**Formation:** had + past participle

## Time Expressions

| Past Simple | Past Continuous | Past Perfect |
|------------|----------------|-------------|
| yesterday | at 3pm (past) | by the time |
| last week | while | already |
| ago | when | never before |
| in 2010 | at that moment | just |

## Practice: Choose the Correct Tense

1. I _______ (watch) Netflix when my friend _______ (call) me.
2. By noon, she _______ (finish) all her homework.
3. We _______ (visit) Paris in 2019.
4. He _______ (never/travel) by plane before that trip.

**Answers:**
1. was watching / called
2. had finished
3. visited
4. had never travelled
  `,

  b1_conditionals: `
# Conditionals — If Clauses

## Overview of the 4 Conditionals

| Type | Time | Reality | Structure |
|------|------|---------|-----------|
| Zero | General/Always | Real fact | If + present, present |
| First | Future | Possible | If + present, will |
| Second | Present/Future | Unreal/Unlikely | If + past, would |
| Third | Past | Impossible | If + past perfect, would have |

## Zero Conditional — Facts & General Truths

> If you **heat** water to 100°C, it **boils**.
> If it **rains**, the grass **gets** wet.
> Water **freezes** if the temperature **drops** below 0°C.

✅ Both parts use **present tense**.

## First Conditional — Real Future Possibility

> If it **rains** tomorrow, I **will stay** home.
> She **will pass** the exam if she **studies** hard.
> If you **call** me, I **will answer**.

✅ IF + present simple → will + base verb

**Variations:** can, may, might instead of will
> If you practice every day, you **might** speak English fluently.

## Second Conditional — Unreal/Hypothetical

> If I **had** more money, I **would travel** around the world.
> She **would buy** a bigger house if she **won** the lottery.
> What **would** you **do** if you **lost** your job?

✅ IF + past simple → would + base verb

⚠️ Use "were" for all subjects (formal):
> If I **were** you, I would study more.

## Third Conditional — Regrets & Impossible Past

> If I **had studied** harder, I **would have passed** the exam.
> She **wouldn't have been** late if she **had woken** up earlier.
> They **would have won** if they **had practiced** more.

✅ IF + past perfect → would have + past participle

## Mixed Conditionals

**Past condition, present result:**
> If I **had studied** medicine, I **would be** a doctor now.

**Present condition, past result:**
> If she **weren't** so stubborn, she **would have accepted** the help.

## Common Mistakes

❌ If I will go... → ✅ If I **go**...
❌ If he would have → ✅ If he **had**...
❌ I would went → ✅ I **would go**...
  `,

  // ── B2 ──────────────────────────────────────────────────────
  b2_business_english: `
# Business English — Professional Communication

## Email Writing

### Structure of a Professional Email

1. **Subject line** — clear and concise
2. **Opening** — formal greeting
3. **Body** — main message (short paragraphs)
4. **Closing** — next steps / call to action
5. **Sign-off** — professional farewell

### Opening Phrases

| Formal | Semi-formal |
|--------|------------|
| Dear Mr./Ms. [Name], | Hi [Name], |
| Dear Sir or Madam, | Hello [Name], |
| To Whom It May Concern, | Good morning [Name], |

### Useful Phrases

**Purpose:**
> I am writing to inquire about...
> I am writing with regard to...
> Further to our conversation...
> I am following up on...

**Requests:**
> Could you please send me...?
> I would appreciate it if you could...
> Would it be possible to...?
> Please find attached...

**Providing information:**
> I would like to inform you that...
> Please be advised that...
> As per your request...

**Closing:**
> Please do not hesitate to contact me if you have any questions.
> I look forward to hearing from you.
> Thank you for your time and consideration.
> Best regards, / Yours sincerely, / Kind regards,

## Meetings & Presentations

### Presenting Data

> According to the latest figures...
> The data suggests that...
> As you can see from this chart...
> This represents an increase/decrease of 15%...
> Our Q4 results indicate that...

### Disagreeing Politely

> With all due respect, I think...
> I see your point, however...
> That's an interesting perspective, but...
> I'm afraid I have to disagree because...
> Could we consider an alternative approach?

### Asking for Clarification

> Could you elaborate on that?
> What exactly do you mean by...?
> Could you give us an example?
> I'm not quite sure I follow — could you explain?

## Business Vocabulary

| Term | Definition |
|------|-----------|
| ROI | Return on Investment |
| KPI | Key Performance Indicator |
| B2B | Business to Business |
| B2C | Business to Consumer |
| stakeholder | pessoa interessada no negócio |
| deadline | prazo final |
| agenda | pauta da reunião |
| minutes | ata da reunião |
| forecast | previsão |
| revenue | receita |
| budget | orçamento |
| pitch | apresentação de proposta |
  `,

  // ── C1 ──────────────────────────────────────────────────────
  c1_academic_writing: `
# Academic Writing & Advanced Discourse

## Features of Academic Writing

1. **Formal register** — no contractions, no slang
2. **Precise vocabulary** — technical terms used correctly
3. **Hedging language** — avoiding absolute statements
4. **Passive voice** — focus on research, not researcher
5. **Logical structure** — clear argumentation
6. **Evidence-based** — supported by data and sources

## Hedging Language

Academic writers avoid claiming 100% certainty:

| Strong claim | Hedged version |
|-------------|---------------|
| X causes Y | X may cause Y |
| This proves | This suggests |
| It is clear that | It appears that |
| Always | Typically / Generally |
| Obviously | Arguably |

**Hedging verbs:** suggest, indicate, appear, seem, tend to
**Hedging adverbs:** possibly, probably, generally, typically, largely
**Hedging phrases:** it is possible that, there is evidence to suggest

## Developing an Argument

### PEEL Paragraph Structure

**P**oint — make your claim
**E**vidence — provide data/examples
**E**xplain — analyse the evidence
**L**ink — connect to next point or thesis

**Example:**

> *[Point]* The widespread adoption of digital technology has fundamentally altered workplace communication patterns. *[Evidence]* According to a McKinsey Global Institute report (2023), over 70% of professional interactions now occur through digital platforms, compared to 25% in 2000. *[Explain]* This exponential shift indicates not merely a change in medium, but a restructuring of organizational hierarchies, as employees at all levels can now communicate directly across departments. *[Link]* This democratisation of communication, while beneficial, also introduces challenges regarding information overload and digital fatigue, which the following section examines.

## Cohesion & Coherence

### Linking Ideas

**Addition:** Furthermore, Moreover, In addition, Additionally
**Contrast:** However, Nevertheless, On the other hand, Conversely
**Cause/Effect:** Therefore, Consequently, As a result, Hence
**Concession:** Although, Even though, Despite, Whereas
**Illustration:** For instance, For example, Such as, Namely
**Emphasis:** Indeed, In fact, Above all, Notably

## Advanced Vocabulary in Context

| Simple | Advanced |
|--------|---------|
| show | demonstrate, illustrate, reveal |
| use | employ, utilize, apply |
| important | significant, crucial, paramount |
| help | facilitate, support, enable |
| big increase | substantial surge, exponential growth |
| wrong | erroneous, fallacious, misguided |
| start | initiate, commence, establish |
| change | transform, modify, alter |

## Essay Structure

**Introduction:**
- Hook / broad context
- Narrowing focus
- Thesis statement

**Body paragraphs (3-5):**
- PEEL structure
- Topic sentences
- Transition sentences

**Conclusion:**
- Restate thesis (different wording)
- Summarise key arguments
- Final thought / broader implication

---

## Critical Analysis Skills

When analysing a text or argument:

1. **Identify the claim** — What is the author asserting?
2. **Examine the evidence** — Is it credible, current, relevant?
3. **Look for assumptions** — What does the author take for granted?
4. **Consider counter-arguments** — What are opposing views?
5. **Evaluate the logic** — Are the inferences valid?
6. **Assess the conclusion** — Does it follow from the evidence?
  `,
};

// ─────────────────────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting English School Seed...\n');

  // Helper to ensure user exists via Better Auth
  const ensureUser = async (data: any) => {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      console.log(`User ${data.email} already exists, updating...`);
      return await prisma.user.update({
        where: { email: data.email },
        data: {
          ...data,
          emailVerified: true, // Force verified for test accounts
        }
      });
    }

    console.log(`Creating user ${data.email} via Better Auth...`);
    const password = "password123"; // Default password for all seeded accounts
    try {
      const result = await auth.api.signUpEmail({
        body: {
          ...data,
          password,
        }
      });

      // signUpEmail doesn't set emailVerified to true by default or other fields
      // sometimes, let's force update after creation
      return await prisma.user.update({
        where: { email: data.email },
        data: {
          ...data,
          emailVerified: true,
        }
      });
    } catch (e: any) {
      console.error(`Failed to create user ${data.email}:`, e.message);
      throw e;
    }
  };

  // ── 1. USERS ─────────────────────────────────────────────────
  console.log('👤 Handling users...');

  const admin = await ensureUser({
    email: 'admin@englishpro.com',
    name: 'Admin EnglishPro',
    role: Role.ADMIN,
    status: UserStatus.ACTIVE,
    termsAccepted: true,
    termsAcceptedAt: new Date('2026-01-01').toISOString(),
  });

  // EXISTING TEACHER requirement
  const existingTeacherEmail = 'eddyrogerioyuran@gmail.com';
  let teacher1 = await prisma.user.findUnique({ where: { email: existingTeacherEmail } });

  if (!teacher1) {
    // If for some reason they don't exist in a fresh DB, create them
    teacher1 = await ensureUser({
      email: existingTeacherEmail,
      name: 'Sarah Johnson (Main Teacher)',
      role: Role.TEACHER,
      status: UserStatus.ACTIVE,
      bio: 'Native English speaker from New York. MA in Applied Linguistics. 10+ years teaching English as a Second Language.',
      expertise: ['Business English', 'Academic Writing', 'Grammar'],
      termsAccepted: true,
      termsAcceptedAt: new Date('2026-01-01').toISOString(),
    });
  } else {
    // Update existing one to ensure they have the right info
    teacher1 = await prisma.user.update({
      where: { email: existingTeacherEmail },
      data: {
        role: Role.TEACHER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        bio: 'Native English speaker from New York. MA in Applied Linguistics. 10+ years teaching English as a Second Language.',
        expertise: ['Business English', 'Academic Writing', 'Grammar'],
      }
    });
  }

  const teacher2 = await ensureUser({
    email: 'james.miller@englishpro.com',
    name: 'James Miller',
    role: Role.TEACHER,
    status: UserStatus.ACTIVE,
    bio: 'British English teacher from London. CELTA and DELTA certified. 8 years teaching experience.',
    expertise: ['British English', 'Pronunciation', 'Conversation', 'TOEFL'],
    termsAccepted: true,
    termsAcceptedAt: new Date('2026-01-01').toISOString(),
  });

  const student1 = await ensureUser({
    email: 'ana.silva@email.com',
    name: 'Ana Silva',
    role: Role.STUDENT,
    status: UserStatus.ACTIVE,
    currentLevel: 'A1',
    points: 0,
    streak: 0,
    xp: 0,
    termsAccepted: true,
    termsAcceptedAt: new Date('2026-02-15').toISOString(),
  });

  const student2 = await ensureUser({
    email: 'carlos.mendes@email.com',
    name: 'Carlos Mendes',
    role: Role.STUDENT,
    status: UserStatus.ACTIVE,
    currentLevel: 'B1',
    points: 1240,
    streak: 14,
    xp: 3800,
    termsAccepted: true,
    termsAcceptedAt: new Date('2026-01-10').toISOString(),
  });

  const student3 = await ensureUser({
    email: 'julia.costa@email.com',
    name: 'Julia Costa',
    role: Role.STUDENT,
    status: UserStatus.ACTIVE,
    currentLevel: 'A2',
    points: 560,
    streak: 7,
    xp: 1800,
    termsAccepted: true,
    termsAcceptedAt: new Date('2026-01-20').toISOString(),
  });

  console.log('✅ Users handled\n');

  // ── 2. COURSES ───────────────────────────────────────────────
  console.log('📚 Creating courses...');

  const courseA1 = await prisma.course.create({
    data: {
      title: 'English for Absolute Beginners — A1',
      description: 'Start your English journey from zero! Master the basics of grammar, vocabulary, and daily conversation.',
      price: 199.90,
      level: 'A1',
      category: 'General English',
      duration: '40 hours',
      thumbnailUrl: null,
      highlights: ['Basic Greetings', 'Verb To Be', 'Numbers & Alphabet', 'Daily Routines'],
      requirements: ['No prior knowledge required', 'A passion for learning'],
      published: true,
      teacherId: teacher1!.id, // Main Teacher
    },
  });

  const courseA2 = await prisma.course.create({
    data: {
      title: 'Elementary English — A2',
      description: 'Take your English to the next level. Learn to describe your life, shop, and handle travel situations.',
      price: 249.90,
      level: 'A2',
      category: 'General English',
      duration: '50 hours',
      thumbnailUrl: null,
      highlights: ['Past Simple', 'Shopping & Directions', 'Future Plans', 'Health & Body'],
      requirements: ['Completion of A1 or basic knowledge'],
      published: true,
      teacherId: teacher1!.id, // Main Teacher
    },
  });

  const courseB1 = await prisma.course.create({
    data: {
      title: 'Intermediate English — B1',
      description: 'Move beyond the basics. Express opinions, handle complex social situations, and improve your fluency.',
      price: 299.90,
      level: 'B1',
      category: 'General English',
      duration: '60 hours',
      thumbnailUrl: null,
      highlights: ['Perfect Tenses', 'Conditionals', 'Passive Voice', 'Social Media English'],
      requirements: ['English A2 level'],
      published: true,
      teacherId: teacher2.id,
    },
  });

  const courseB2 = await prisma.course.create({
    data: {
      title: 'Upper Intermediate English — B2',
      description: 'Fluency is within reach. Master business communication and complex grammar structures.',
      price: 349.90,
      level: 'B2',
      category: 'Business English',
      duration: '70 hours',
      thumbnailUrl: null,
      highlights: ['Modal Verbs', 'Business Meetings', 'Negotiation Skills', 'Advanced Listening'],
      requirements: ['English B1 level'],
      published: true,
      teacherId: teacher2.id,
    },
  });

  const courseC1 = await prisma.course.create({
    data: {
      title: 'Advanced English — C1',
      description: 'Master English for academic and professional purposes. Think and speak like a native.',
      price: 449.90,
      level: 'C1',
      category: 'Academic English',
      duration: '80 hours',
      thumbnailUrl: null,
      highlights: ['Academic Writing', 'Nuanced Vocabulary', 'Idiomatic Expressions', 'Critical Analysis'],
      requirements: ['English B2 level'],
      published: true,
      teacherId: teacher1!.id, // Main Teacher
    },
  });

  console.log('✅ Courses created\n');

  // ── 3. MODULES ───────────────────────────────────────────────
  console.log('📦 Creating modules...');

  // A1 Modules
  const modA1_1 = await prisma.module.create({
    data: {
      title: 'Module 1 — First Steps',
      description: 'Your very first steps in English. Greetings, the alphabet, and basic pronunciation.',
      order: 1,
      courseId: courseA1.id,
      published: true,
    },
  });

  const modA1_2 = await prisma.module.create({
    data: {
      title: 'Module 2 — My Life',
      description: 'Numbers, family, and describing your immediate environment.',
      order: 2,
      courseId: courseA1.id,
      published: true,
    },
  });

  // A2 Modules
  const modA2_1 = await prisma.module.create({
    data: {
      title: 'Module 1 — Daily Life',
      description: 'Routine, habits, and the simple present tense in depth.',
      order: 1,
      courseId: courseA2.id,
      published: true,
    },
  });

  const modA2_2 = await prisma.module.create({
    data: {
      title: 'Module 2 — Exploring the World',
      description: 'Shopping, money, and travel basics.',
      order: 2,
      courseId: courseA2.id,
      published: true,
    },
  });

  // B1 Modules
  const modB1_1 = await prisma.module.create({
    data: {
      title: 'Module 1 — Telling Stories',
      description: 'Mastering the past tenses to narrate events and experiences.',
      order: 1,
      courseId: courseB1.id,
      published: true,
    },
  });

  const modB1_2 = await prisma.module.create({
    data: {
      title: 'Module 2 — What If?',
      description: 'Dealing with hypothetical situations and the complex world of conditionals.',
      order: 2,
      courseId: courseB1.id,
      published: true,
    },
  });

  // B2 Modules
  const modB2_1 = await prisma.module.create({
    data: {
      title: 'Module 1 — Professional Edge',
      description: 'Advanced business communication, email writing, and formal meetings.',
      order: 1,
      courseId: courseB2.id,
      published: true,
    },
  });

  // C1 Modules
  const modC1_1 = await prisma.module.create({
    data: {
      title: 'Module 1 — The Academic Mind',
      description: 'Advanced discourse, critical analysis, and academic writing proficiency.',
      order: 1,
      courseId: courseC1.id,
      published: true,
    },
  });

  console.log('✅ Modules created\n');

  // ── 4. LESSONS & QUIZZES ─────────────────────────────────────
  console.log('📝 Creating lessons and quizzes...');

  // --- A1 LESSONS ---
  const lesA1_1_1 = await prisma.lesson.create({
    data: {
      title: 'Welcome to English!',
      content: lessonContent.a1_greetings,
      order: 1,
      lessonType: 'VIDEO',
      duration: 900,
      moduleId: modA1_1.id,
      published: true,
      vocabulary: {
        words: [
          { word: 'Hello', translation: 'Olá', audioUrl: null },
          { word: 'Name', translation: 'Nome', audioUrl: null },
          { word: 'Teacher', translation: 'Professor(a)', audioUrl: null },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      title: 'Greetings Quiz',
      description: 'Test your knowledge of basic English greetings and introductions.',
      type: 'standard',
      points: 100,
      lessonId: lesA1_1_1.id,
      questions: vocabularyQuiz([
        { word: 'Hello', options: ['Oi/Olá', 'Adeus', 'Obrigado', 'Por favor'], correct: 'Oi/Olá' },
        { word: 'Nice to meet you', options: ['Bom dia', 'Prazer em conhecer', 'De onde você é?', 'Até logo'], correct: 'Prazer em conhecer' },
      ]),
    },
  });

  const lesA1_1_2 = await prisma.lesson.create({
    data: {
      title: 'The English Alphabet',
      content: lessonContent.a1_alphabet,
      order: 2,
      lessonType: 'VIDEO',
      duration: 1200,
      moduleId: modA1_1.id,
      published: true,
    },
  });

  await prisma.quiz.create({
    data: {
      title: 'Alphabet Challenge',
      description: 'Can you spell these common names and words?',
      type: 'challenge',
      points: 150,
      lessonId: lesA1_1_2.id,
      questions: fillBlankQuiz([
        { question: 'How do you spell "Apple"? (A - _ - P - L - E)', answer: 'P', hint: 'The second letter' },
        { question: 'My name is Carlos. C - A - R - _ - O - S', answer: 'L' },
      ]),
    },
  });

  // --- A2 LESSONS ---
  const lesA2_1_1 = await prisma.lesson.create({
    data: {
      title: 'My Daily Routine',
      content: lessonContent.a2_present_simple,
      order: 1,
      lessonType: 'VIDEO',
      duration: 1500,
      moduleId: modA2_1.id,
      published: true,
    },
  });

  await prisma.quiz.create({
    data: {
      title: 'Daily Routine Check',
      description: 'Verify your understanding of common daily activities.',
      type: 'standard',
      points: 100,
      lessonId: lesA2_1_1.id,
      questions: trueFalseQuiz([
        { question: 'We use Present Simple for habits and routines.', answer: 'true' },
        { question: '"She wake up at 7" is correct.', answer: 'false', explanation: 'It should be "She wakes up" (third person -s).' },
      ]),
    },
  });

  const lesA2_2_1 = await prisma.lesson.create({
    data: {
      title: 'Shopping for Clothes',
      content: lessonContent.a2_shopping,
      order: 1,
      lessonType: 'VIDEO',
      duration: 1800,
      moduleId: modA2_2.id,
      published: true,
    },
  });

  await prisma.quiz.create({
    data: {
      title: 'At the Mall',
      description: 'Listen and answer questions about shopping interactions.',
      type: 'standard',
      points: 120,
      lessonId: lesA2_2_1.id,
      questions: listeningQuiz([
        { script: 'Assistant: Hi! Can I help you? Customer: Yes, I am looking for a blue shirt. Assistant: What size? Customer: Medium, please.', question: 'What is the customer looking for?', options: ['Red shoes', 'Blue shirt', 'Black pants'], correct: 'Blue shirt' },
      ]),
    },
  });

  // --- B1 LESSONS ---
  const lesB1_1_1 = await prisma.lesson.create({
    data: {
      title: 'The Story of My Life',
      content: lessonContent.b1_past_tenses,
      order: 1,
      lessonType: 'VIDEO',
      duration: 2100,
      moduleId: modB1_1.id,
      published: true,
    },
  });

  await prisma.quiz.create({
    data: {
      title: 'Past Tenses Mastery',
      description: 'Test your ability to use Past Simple, Continuous, and Perfect.',
      type: 'standard',
      points: 150,
      lessonId: lesB1_1_1.id,
      questions: vocabularyQuiz([
        { word: 'Yesterday', options: ['Ontem', 'Hoje', 'Amanhã', 'Semana passada'], correct: 'Ontem' },
      ]),
    },
  });

  const lesB1_2_1 = await prisma.lesson.create({
    data: {
      title: 'Hypothetical Situations',
      content: lessonContent.b1_conditionals,
      order: 1,
      lessonType: 'VIDEO',
      duration: 2400,
      moduleId: modB1_2.id,
      published: true,
    },
  });

  await prisma.quiz.create({
    data: {
      title: 'Conditional Challenge',
      description: 'Apply the correct conditional form to different scenarios.',
      type: 'challenge',
      points: 200,
      lessonId: lesB1_2_1.id,
      questions: fillBlankQuiz([
        { question: 'If it rains, I _____ (stay) at home.', answer: 'will stay' },
        { question: 'If I _____ (be) you, I would study more.', answer: 'were' },
      ]),
    },
  });

  // --- B2 LESSONS ---
  const lesB2_1_1 = await prisma.lesson.create({
    data: {
      title: 'Professional Correspondence',
      content: lessonContent.b2_business_english,
      order: 1,
      lessonType: 'VIDEO',
      duration: 2700,
      moduleId: modB2_1.id,
      published: true,
    },
  });

  await prisma.quiz.create({
    data: {
      title: 'Business Email Quiz',
      description: 'Write professional emails using appropriate register and vocabulary.',
      type: 'standard',
      points: 150,
      lessonId: lesB2_1_1.id,
      questions: trueFalseQuiz([
        { question: '"Best regards" is a formal sign-off.', answer: 'true' },
        { question: 'You should use contractions in formal business emails.', answer: 'false' },
      ]),
    },
  });

  // --- C1 LESSONS ---
  const lesC1_1_1 = await prisma.lesson.create({
    data: {
      title: 'Advanced Academic Writing',
      content: lessonContent.c1_academic_writing,
      order: 1,
      lessonType: 'VIDEO',
      duration: 3600,
      moduleId: modC1_1.id,
      published: true,
    },
  });

  await prisma.quiz.create({
    data: {
      title: 'Academic Discourse Check',
      description: 'Identify hedging and advanced argumentative structures.',
      type: 'standard',
      points: 250,
      lessonId: lesC1_1_1.id,
      questions: vocabularyQuiz([
        { word: 'Hedging', options: ['Cerca viva', 'Linguagem cautelosa', 'Gíria', 'Abreviatura'], correct: 'Linguagem cautelosa', explanation: 'Hedging is the use of cautious language in academic writing.' },
      ]),
    },
  });

  // ── 5. ENROLLMENTS & PROGRESS ────────────────────────────────
  console.log('🔗 Connecting students to courses...');

  await prisma.enrollment.createMany({
    data: [
      { userId: student1.id, courseId: courseA1.id, status: EnrollmentStatus.ACTIVE },
      { userId: student2.id, courseId: courseB1.id, status: EnrollmentStatus.COMPLETED },
      { userId: student3.id, courseId: courseA2.id, status: EnrollmentStatus.ACTIVE },
    ],
  });

  await prisma.progress.createMany({
    data: [
      { userId: student1.id, lessonId: lesA1_1_1.id, watchTime: 900, lastPosition: 900, completed: true },
      { userId: student2.id, lessonId: lesB1_1_1.id, watchTime: 2100, lastPosition: 2100, completed: true },
    ],
  });

  // ── 6. PAYMENTS ──────────────────────────────────────────────
  console.log('💰 Adding payment history...');

  const payments = [
    { userId: student1.id, amount: 199.90, currency: 'BRL', status: PaymentStatus.APPROVED, method: 'PIX', mercadoPagoId: 'MP_001_ANA_A1' },
    { userId: student2.id, amount: 299.90, currency: 'BRL', status: PaymentStatus.APPROVED, method: 'CREDIT_CARD', mercadoPagoId: 'MP_002_CARLOS_B1' },
    { userId: student3.id, amount: 249.90, currency: 'BRL', status: PaymentStatus.PENDING, method: 'PIX', mercadoPagoId: 'MP_003_JULIA_A2' },
  ]

  for (const payment of payments) {
    if (payment.mercadoPagoId) {
      await prisma.payment.upsert({
        where: { mercadoPagoId: payment.mercadoPagoId },
        update: {},
        create: payment
      })
    }
  }

  // ── 7. CERTIFICATES ──────────────────────────────────────────
  console.log('📜 Issuing certificates...');

  const certificates = [
    { userId: student2.id, verificationCode: 'EP-B1-2026-CARLOS-001', pdfUrl: '/certificates/ep-b1-2026-carlos-001.pdf', issueDate: new Date('2026-02-10') },
  ]

  for (const cert of certificates) {
    await prisma.certificate.upsert({
      where: { verificationCode: cert.verificationCode },
      update: {},
      create: cert
    })
  }

  // ── 8. STUDY LOGS ────────────────────────────────────────────
  console.log('📅 Adding study logs...');

  const logs = [
    { date: '2026-02-10', mins: 45 },
    { date: '2026-02-11', mins: 30 },
    { date: '2026-02-12', mins: 60 },
    { date: '2026-02-13', mins: 20 },
    { date: '2026-02-14', mins: 40 },
  ];

  for (const d of logs) {
    await prisma.studyLog.upsert({
      where: { userId_date: { userId: student2.id, date: d.date } },
      update: {},
      create: { userId: student2.id, date: d.date, minutes: d.mins },
    });
  }


  // 9. Seed Achievements
  console.log("Seeding Achievements...")
  const achievements = [
    { slug: "first-step", name: "First Step", description: "Complete your first lesson", icon: "footprints" },
    { slug: "week-warrior", name: "Week Warrior", description: "7-day streak", icon: "flame" },
    { slug: "quiz-master", name: "Quiz Master", description: "Score 100% on 5 quizzes", icon: "trophy" },
    { slug: "word-collector", name: "Word Collector", description: "Learn 500 vocabulary words", icon: "book-open" },
    { slug: "grammar-pro", name: "Grammar Pro", description: "Complete all Grammar modules in B1", icon: "check-circle" },
    { slug: "polyglot", name: "Polyglot", description: "Reach C1 level", icon: "globe" },
  ]

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { slug: ach.slug },
      update: {},
      create: ach
    })
  }

  // 10. Seed Student Data (Activity & Achievements)
  console.log("Seeding Student Data...")
  const studentEmail = "edilson@example.com"
  const student = await prisma.user.findUnique({ where: { email: studentEmail } })

  if (student) {
    // Award specific achievements
    const earnedSlugs = ["first-step", "week-warrior", "quiz-master", "word-collector"]
    const dbAchievements = await prisma.achievement.findMany({
      where: { slug: { in: earnedSlugs } }
    })

    for (const ach of dbAchievements) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId: student.id,
            achievementId: ach.id
          }
        },
        update: {},
        create: {
          userId: student.id,
          achievementId: ach.id,
          earnedAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30) // Random time in last 30 days
        }
      })
    }

    // Create Recent Activity
    // Clean up old logs first
    await prisma.activityLog.deleteMany({ where: { userId: student.id } })

    // Find a real lesson to link to
    const someLesson = await prisma.lesson.findFirst();
    const lessonId = someLesson ? someLesson.id : null;

    await prisma.activityLog.createMany({
      data: [
        {
          userId: student.id,
          type: "LESSON_COMPLETE",
          title: "Past Perfect Continuous",
          xpEarned: 25,
          metadata: lessonId ? { lessonId } : undefined,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
          userId: student.id,
          type: "QUIZ_COMPLETE",
          title: "Vocabulary Quiz: Travel",
          xpEarned: 40,
          metadata: lessonId ? { lessonId } : undefined,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
        },
        {
          userId: student.id,
          type: "FORUM_POST",
          title: "Posted in Grammar Help",
          xpEarned: 10,
          // metadata: { postId: ... } // Future
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
        }
      ]
    })
  }

  // --- STANDALONE CHALLENGES ---
  console.log('\n🚀 Seeding standalone challenges...');

  await prisma.quiz.create({
    data: {
      title: 'Desafio de Vocabulário A1',
      description: 'Teste seus conhecimentos básicos de palavras do dia a dia.',
      type: 'standard',
      level: 'A1',
      points: 200,
      questions: vocabularyQuiz([
        { word: 'Water', options: ['Fogo', 'Água', 'Terra', 'Ar'], correct: 'Água' },
        { word: 'Bread', options: ['Pão', 'Massa', 'Arroz', 'Feijão'], correct: 'Pão' },
        { word: 'Morning', options: ['Noite', 'Tarde', 'Manhã', 'Madrugada'], correct: 'Manhã' },
        { word: 'Friend', options: ['Inimigo', 'Colega', 'Amigo', 'Professor'], correct: 'Amigo' },
        { word: 'Book', options: ['Caneta', 'Lápis', 'Livro', 'Caderno'], correct: 'Livro' },
      ]),
    }
  });

  await prisma.quiz.create({
    data: {
      title: 'Gramática Essencial A2',
      description: 'Desafio focado em Present Simple e rotinas diárias.',
      type: 'standard',
      level: 'A2',
      points: 250,
      questions: trueFalseQuiz([
        { question: 'O plural de "Child" é "Children".', answer: 'true' },
        { question: 'Usamos "do" para frases afirmativas com "He/She/It".', answer: 'false', explanation: 'Para He/She/It usamos o verbo com -s (ex: He plays).' },
        { question: '"I am doctor" está gramaticalmente correto.', answer: 'false', explanation: 'Deveria ser "I am A doctor".' },
      ]),
    }
  });

  await prisma.quiz.create({
    data: {
      title: 'Compreensão Auditiva B1',
      description: 'Ouça o diálogo e responda sobre a viagem de férias.',
      type: 'listening',
      level: 'B1',
      points: 300,
      questions: listeningQuiz([
        {
          script: 'A: Where are you going for Christmas? B: I am thinking about Norway. A: That sounds cold! B: Yes, I want to see the Aurora Borealis.',
          question: 'Para onde o personagem B quer viajar?',
          options: ['Brasil', 'Noruega', 'EUA', 'Portugal'],
          correct: 'Noruega'
        },
        {
          script: 'A: Is it expensive? B: A bit, but I have been saving for a year.',
          question: 'Há quanto tempo ele está economizando?',
          options: ['Um mês', 'Um ano', 'Dois anos', 'Seis meses'],
          correct: 'Um ano'
        },
      ]),
    }
  });

  await prisma.quiz.create({
    data: {
      title: 'Mastering Conditionals B2',
      description: 'O desafio definitivo sobre o Second e Third Conditional.',
      type: 'challenge',
      level: 'B2',
      points: 400,
      questions: fillBlankQuiz([
        { question: 'If I ___ (be) you, I would take the job.', answer: 'were', hint: 'Second conditional for advice' },
        { question: 'If she had studied, she ___ (pass) the exam.', answer: 'would have passed', hint: 'Third conditional' },
      ]),
    }
  });

  console.log('\n✨ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
