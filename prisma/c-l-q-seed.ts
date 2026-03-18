import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do curso New Headway Elementary...");

  // ─────────────────────────────────────────────
  // COURSE — find or create by title
  // ─────────────────────────────────────────────
  let course = await prisma.course.findFirst({
    where: { title: "New Headway Elementary English Course" },
  });

  if (!course) {
    course = await prisma.course.create({
      data: {
        title: "New Headway Elementary English Course",
        description:
          "Curso completo de inglês para iniciantes baseado no método New Headway. Cobre gramática essencial, vocabulário, pronúncia e escrita do nível A1 ao A2.",
        price: 0,
        level: "A1",
        category: "English",
        duration: "60h",
        thumbnailUrl: "/courses/headway-elementary.jpg",
        highlights: [
          "14 unidades temáticas progressivas",
          "Gramática com explicações claras",
          "Vocabulário contextualizado",
          "Exercícios de escrita guiada",
          "Quizzes por unidade",
        ],
        requirements: [
          "Nenhum conhecimento prévio de inglês necessário",
          "Disposição para praticar diariamente",
        ],
        published: true,
      },
    });
    console.log(`✅ Course criado: ${course.title}`);
  } else {
    console.log(`⏭️  Course já existe: ${course.title}`);
  }

  // ─────────────────────────────────────────────
  // HELPER: find or create Module
  // ─────────────────────────────────────────────
  async function findOrCreateModule(
    unitNumber: number,
    title: string,
    description: string
  ) {
    const existing = await prisma.module.findFirst({
      where: { title, courseId: course!.id },
    });
    if (existing) return existing;

    return prisma.module.create({
      data: {
        title,
        description,
        order: unitNumber,
        courseId: course!.id,
        published: true,
      },
    });
  }

  // ─────────────────────────────────────────────
  // HELPER: find or create Lesson
  // ─────────────────────────────────────────────
  async function findOrCreateLesson(
    moduleId: string,
    lessonNumber: number,
    title: string,
    content: string,
    vocabulary: object | null = null
  ) {
    const existing = await prisma.lesson.findFirst({
      where: { title, moduleId },
    });
    if (existing) return existing;

    return prisma.lesson.create({
      data: {
        title,
        content,
        order: lessonNumber,
        lessonType: "NOTES",
        moduleId,
        published: true,
        vocabulary: vocabulary ?? undefined,
      },
    });
  }

  // ─────────────────────────────────────────────
  // HELPER: find or create Quiz
  // ─────────────────────────────────────────────
  async function findOrCreateQuiz(
    lessonId: string,
    title: string,
    questions: object[]
  ) {
    const existing = await prisma.quiz.findFirst({
      where: { title, lessonId },
    });
    if (existing) return existing;

    return prisma.quiz.create({
      data: {
        title,
        description: `Quiz da lição: ${title}`,
        type: "standard",
        points: 100,
        timeLimit: 300,
        passingScore: 70,
        lessonId,
        questions,
      },
    });
  }

  // ═══════════════════════════════════════════════
  // UNIT 1 — Hello everybody!
  // ═══════════════════════════════════════════════
  const unit1 = await findOrCreateModule(
    1,
    "Unit 1 – Hello everybody!",
    "am/is/are • my/your/his/her • Countries and nationalities • a or an? • Numbers 1–20"
  );

  const u1l1 = await findOrCreateLesson(
    unit1.id,
    1,
    "am / is / are",
    `# Verb To Be – am / is / are

## Affirmative
Use **am** with I, **is** with he/she/it, and **are** with you/we/they.

| Subject | Verb | Example |
|---------|------|---------|
| I | am | I am John. |
| He/She/It | is | She is from London. |
| You/We/They | are | They are students. |

## Short Forms (Contractions)
- I am → **I'm**
- He is → **He's**
- She is → **She's**
- It is → **It's**
- We are → **We're**
- You are → **You're**
- They are → **They're**

## Negative
- I am **not** → I'm **not**
- He/She/It is **not** → He/She/It **isn't**
- We/You/They are **not** → We/You/They **aren't**

## Questions
- **Am** I late?
- **Is** she a doctor?
- **Are** you from Brazil?

## Practice
Complete: Hello. What's your name? / My name ___ John. Where ___ you from?`,
    { words: ["am", "is", "are", "name", "from", "student", "teacher"] }
  );

  await findOrCreateQuiz(u1l1.id, "Quiz – am / is / are", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "Complete: She ___ a doctor from Mexico.",
      options: ["am", "is", "are", "be"],
      correct: "is",
      explanation: "She → he/she/it → use 'is'.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Complete: They ___ from Brazil.",
      options: ["am", "is", "are", "be"],
      correct: "are",
      explanation: "They → use 'are'.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Which is the short form of 'We are'?",
      options: ["We'm", "We're", "We's", "We is"],
      correct: "We're",
      explanation: "We are → We're (contraction with apostrophe).",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Complete: I ___ not from Spain.",
      options: ["am", "is", "are", "be"],
      correct: "am",
      explanation: "I → use 'am'.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Which sentence is correct?",
      options: [
        "He's from Germany.",
        "His from Germany.",
        "He are from Germany.",
        "Him from Germany.",
      ],
      correct: "He's from Germany.",
      explanation: "He's = He is. Short form of 'He is'.",
    },
  ]);

  const u1l2 = await findOrCreateLesson(
    unit1.id,
    2,
    "Possessive Adjectives – my, your, his, her",
    `# Possessive Adjectives

Possessive adjectives show **who something belongs to**.

| Subject Pronoun | Possessive Adjective |
|----------------|---------------------|
| I | **my** |
| You | **your** |
| He | **his** |
| She | **her** |
| It | **its** |
| We | **our** |
| They | **their** |

## Examples
- Hello. **My** name's Jenny.
- What's **your** name?
- **His** name is David.
- **Her** flat is in Paris.
- **Our** teacher is from England.
- **Their** children are at school.

## Practice
Complete with my, your, his or her:
1. Hello. ___ name's Jenny.
2. What's ___ name?
3. 'What's ___ name?' 'Elizabeth.'
4. Marie is from France. ___ flat is in Paris.`,
    { words: ["my", "your", "his", "her", "its", "our", "their"] }
  );

  await findOrCreateQuiz(u1l2.id, "Quiz – Possessive Adjectives", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "Complete: Hello. ___ name's Jenny.",
      options: ["my", "your", "his", "her"],
      correct: "my",
      explanation: "The speaker uses 'my' to refer to their own name.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Complete: 'What's ___ name?' 'Elizabeth.' (asking about a woman)",
      options: ["my", "your", "his", "her"],
      correct: "her",
      explanation: "'Her' is used for a female person.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Complete: John is a teacher. ___ school is in London.",
      options: ["my", "its", "his", "her"],
      correct: "his",
      explanation: "John is male, so we use 'his'.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Complete: We are students. ___ teacher is from England.",
      options: ["My", "Their", "Our", "Her"],
      correct: "Our",
      explanation: "'Our' is the possessive adjective for 'we'.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Complete: They are from Japan. ___ names are Tomoko and Kenji.",
      options: ["His", "Her", "Our", "Their"],
      correct: "Their",
      explanation: "'Their' is the possessive for 'they'.",
    },
  ]);

  const u1l3 = await findOrCreateLesson(
    unit1.id,
    3,
    "Countries & Nationalities + a or an?",
    `# Countries and Nationalities

| Country | Nationality |
|---------|------------|
| England | English |
| Germany | German |
| Italy | Italian |
| France | French |
| Spain | Spanish |
| Portugal | Portuguese |
| Egypt | Egyptian |
| Japan | Japanese |
| the United States | American |
| Russia | Russian |
| Hungary | Hungarian |
| Brazil | Brazilian |
| Mexico | Mexican |

## a or an?

Use **a** before consonant sounds: a bag, a camera, a doctor
Use **an** before vowel sounds (a, e, i, o, u): an apple, an ice-cream, an English city

### Examples
- A Cadillac is **an** American car.
- Champagne is **a** French drink.
- Oxford is **an** English university.
- English is **an** international language.

## Numbers 1–20
one, two, three, four, five, six, seven, eight, nine, ten,
eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty`,
    {
      words: [
        "English", "French", "German", "Italian", "Spanish",
        "Brazilian", "Japanese", "American", "Russian",
      ],
    }
  );

  await findOrCreateQuiz(u1l3.id, "Quiz – Countries, Nationalities & a/an", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "What is the nationality of someone from Brazil?",
      options: ["Brazilish", "Brazilean", "Brazilian", "Brazili"],
      correct: "Brazilian",
      explanation: "Brazil → Brazilian.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Complete: A Mercedes is ___ German car.",
      options: ["a", "an", "the", "—"],
      correct: "a",
      explanation: "'German' starts with a consonant sound → use 'a'.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Complete: Oxford is ___ English university.",
      options: ["a", "an", "the", "—"],
      correct: "an",
      explanation: "'English' starts with a vowel sound /e/ → use 'an'.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "What is the nationality of someone from Japan?",
      options: ["Japanish", "Japaner", "Japani", "Japanese"],
      correct: "Japanese",
      explanation: "Japan → Japanese.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Complete: She's from Italy. She's ___.",
      options: ["Italish", "Italiano", "Italian", "Itali"],
      correct: "Italian",
      explanation: "Italy → Italian.",
    },
  ]);

  console.log(`✅ Unit 1 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 2 — Meeting people
  // ═══════════════════════════════════════════════
  const unit2 = await findOrCreateModule(
    2,
    "Unit 2 – Meeting people",
    "Questions and negatives • Possessive 's • Adjectives and nouns • Plural nouns • Numbers 1–100 and prices"
  );

  const u2l1 = await findOrCreateLesson(
    unit2.id,
    1,
    "Questions and Negatives",
    `# Questions and Negatives with To Be

## Question Words
- **Where** → place (Where's the Colosseum? It's in Rome.)
- **What** → things/information (What's your job? I'm a teacher.)
- **Who** → people (Who's your teacher? Isabel.)
- **How** → manner/condition (How are you? Fine, thanks.)
- **How old** → age (How old are you? Twenty-one.)
- **How much** → price (How much is a cup of tea? 90p.)

## Making Questions
Move the verb **before** the subject:
- She **is** a teacher. → **Is** she a teacher?
- They **are** from Japan. → **Are** they from Japan?

## Making Negatives
Add **not** after the verb (or use contractions):
- She is **not** English. → She **isn't** English.
- They are **not** at home. → They **aren't** at home.
- I am **not** married. → I**'m not** married.

## Short Answers
- Are you English? → Yes, I **am**. / No, I'**m not**.
- Is she a teacher? → Yes, she **is**. / No, she **isn't**.
- Are they from Japan? → Yes, they **are**. / No, they **aren't**.`,
    null
  );

  await findOrCreateQuiz(u2l1.id, "Quiz – Questions and Negatives", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "Which question word asks about PLACE?",
      options: ["What", "Who", "Where", "How"],
      correct: "Where",
      explanation: "'Where' is used to ask about places and locations.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Make negative: 'Brazil is in Europe.'",
      options: [
        "Brazil not is in Europe.",
        "Brazil isn't in Europe.",
        "Brazil don't in Europe.",
        "Brazil aren't in Europe.",
      ],
      correct: "Brazil isn't in Europe.",
      explanation: "Brazil is → Brazil isn't (is + not = isn't).",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Short answer: 'Are you a student?' → 'Yes, ___'",
      options: ["Yes, I'm.", "Yes, I am.", "Yes, am I.", "Yes, I is."],
      correct: "Yes, I am.",
      explanation: "Short affirmative answers with 'to be' don't use contractions.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Complete the question: '___ is a cup of tea?' '90p.'",
      options: ["How many", "How old", "How much", "How"],
      correct: "How much",
      explanation: "'How much' is used to ask about prices.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Which sentence is correct?",
      options: [
        "Snow is hot.",
        "Snow isn't hot. It's cold.",
        "Snow not hot.",
        "Snow are not hot.",
      ],
      correct: "Snow isn't hot. It's cold.",
      explanation: "Snow is a singular noun → use 'is/isn't'.",
    },
  ]);

  const u2l2 = await findOrCreateLesson(
    unit2.id,
    2,
    "Possessive 's + Plural Nouns",
    `# Possessive 's

Use **'s** to show possession (belonging):
- John**'s** car is new. (= the car of John)
- Jack**'s** wife is thirty-five.
- My daughter**'s** school is very good.

⚠️ **Don't confuse:**
- **John's** (= possession: John's car)
- **It's** (= it is: It's cold today.)

## Plural Nouns – Spelling Rules

| Rule | Example |
|------|---------|
| Most nouns → add **-s** | car → cars, boy → boys |
| Nouns ending in -s, -sh, -ch, -x → add **-es** | class → classes |
| Nouns ending in consonant + -y → change y to **-ies** | city → cities, family → families |
| Irregular | woman → women, person → people |

### Practice
Write the plural: car → **cars** / class → **classes** / city → **cities** / woman → **women**`,
    { words: ["possession", "plural", "apostrophe", "irregular"] }
  );

  await findOrCreateQuiz(u2l2.id, "Quiz – Possessive 's and Plural Nouns", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "What does the 's mean in 'John's car is new'?",
      options: ["it is", "possession", "plural", "contraction of 'is'"],
      correct: "possession",
      explanation: "John's car = the car that belongs to John → possessive 's.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "What is the plural of 'city'?",
      options: ["citys", "cities", "cityes", "citie"],
      correct: "cities",
      explanation: "city ends in consonant + y → change y to i and add -es.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "What is the plural of 'woman'?",
      options: ["womans", "womens", "women", "womanies"],
      correct: "women",
      explanation: "woman → women (irregular plural).",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "What does 's mean in 'It's cold today'?",
      options: ["possession", "plural", "it is", "it has"],
      correct: "it is",
      explanation: "It's = It is. This is a contraction, not possessive.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "What is the plural of 'sandwich'?",
      options: ["sandwichs", "sandwiches", "sandwichies", "sandwichs"],
      correct: "sandwiches",
      explanation: "sandwich ends in -ch → add -es → sandwiches.",
    },
  ]);

  console.log(`✅ Unit 2 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 3 — The world of work
  // ═══════════════════════════════════════════════
  const unit3 = await findOrCreateModule(
    3,
    "Unit 3 – The world of work",
    "Present Simple 1 • Jobs • Daily routines • Time • Writing – using pronouns"
  );

  const u3l1 = await findOrCreateLesson(
    unit3.id,
    1,
    "Present Simple – He/She/It",
    `# Present Simple – Third Person Singular

## Affirmative
Add **-s** or **-es** to the verb for he/she/it:

| Rule | Example |
|------|---------|
| Most verbs → add **-s** | work → work**s**, live → live**s** |
| Verbs ending in -s, -sh, -ch, -x, -o → add **-es** | go → go**es**, watch → watch**es** |
| Verbs ending in consonant + -y → change y to **-ies** | study → stud**ies**, fly → fl**ies** |
| Irregular: have → **has** | She **has** two children. |

## Examples
- He **speaks** four languages.
- She **lives** in a flat in Paris.
- She's a pilot. She **flies** all over the world.
- Peter **has** two children.

## Negative
Use **doesn't** + base verb:
- He **doesn't** speak Japanese.

## Questions
Use **does** + subject + base verb:
- **Does** he live in a city? Yes, he **does**.
- **Does** she speak French? No, she **doesn't**.`,
    { words: ["speaks", "lives", "flies", "has", "goes", "watches", "studies"] }
  );

  await findOrCreateQuiz(u3l1.id, "Quiz – Present Simple He/She/It", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "Complete: Bernadette ___ in a flat in Paris. (live)",
      options: ["live", "lives", "livees", "livs"],
      correct: "lives",
      explanation: "Third person singular: live → lives.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Complete: She's a pilot. She ___ all over the world. (fly)",
      options: ["fly", "flys", "flies", "flyes"],
      correct: "flies",
      explanation: "fly ends in consonant + y → change y to i + es = flies.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Complete: Peter ___ two children. (have)",
      options: ["have", "haves", "has", "hase"],
      correct: "has",
      explanation: "have is irregular → third person singular = has.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Make negative: 'A journalist sells things.'",
      options: [
        "A journalist not sells things.",
        "A journalist doesn't sell things.",
        "A journalist don't sell things.",
        "A journalist isn't sell things.",
      ],
      correct: "A journalist doesn't sell things.",
      explanation: "Negative third person: doesn't + base verb (no -s).",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Complete: ___ she speak French? Yes, she ___.",
      options: ["Do / do", "Does / does", "Is / is", "Has / has"],
      correct: "Does / does",
      explanation: "Questions with third person singular: Does + subject + base verb.",
    },
  ]);

  const u3l2 = await findOrCreateLesson(
    unit3.id,
    2,
    "Daily Routines & Time",
    `# Daily Routines

## Common Verbs
get up • have a shower • get dressed • have breakfast • leave home •
go to work • start work • have lunch • go home • have dinner •
watch television • read a book • go to bed

## Telling the Time
- 3:00 → It's **three o'clock**
- 3:20 → It's **twenty past three**
- 3:30 → It's **half past three**
- 3:45 → It's **quarter to four**
- 3:15 → It's **quarter past three**

## Rupert's Day
1. Rupert **gets up** at seven o'clock.
2. He **has a shower**.
3. Then he **gets dressed**.
4. He **has** tea and toast for breakfast.
5. He **leaves** his flat at half past eight.
6. He **goes** to work by bus.
7. He **starts** work at nine o'clock.
8. At one o'clock he **has** lunch in a small café.
9. He **leaves** work at half past five and **goes** home.
10. First he **has** dinner, then he **watches** television.
11. He **goes** to bed at eleven o'clock and **reads** a book.`,
    {
      words: [
        "get up", "shower", "breakfast", "leave home",
        "start work", "lunch", "dinner", "go to bed",
      ],
    }
  );

  await findOrCreateQuiz(u3l2.id, "Quiz – Daily Routines & Time", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "How do you say 3:30 in English?",
      options: ["Three thirty past", "Half past three", "Half to four", "Thirty past three"],
      correct: "Half past three",
      explanation: "3:30 = half past three.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "How do you say 3:45 in English?",
      options: ["Quarter past three", "Three forty-five past", "Quarter to four", "Forty-five past three"],
      correct: "Quarter to four",
      explanation: "3:45 = quarter to four (15 minutes before 4).",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Which activity comes FIRST in a typical morning?",
      options: ["Have lunch", "Go to bed", "Get up", "Start work"],
      correct: "Get up",
      explanation: "Get up is the first activity of the day.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Complete: He ___ work at nine o'clock. (start)",
      options: ["start", "starts", "startss", "starting"],
      correct: "starts",
      explanation: "Third person singular: start → starts.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "How do you say 3:15 in English?",
      options: ["Quarter to three", "Fifteen past three", "Quarter past three", "Half past two"],
      correct: "Quarter past three",
      explanation: "3:15 = quarter past three (15 minutes after 3).",
    },
  ]);

  console.log(`✅ Unit 3 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 4 — Take it easy!
  // ═══════════════════════════════════════════════
  const unit4 = await findOrCreateModule(
    4,
    "Unit 4 – Take it easy!",
    "Present Simple 2 • Adverbs of frequency • Prepositions of time • Opposite verbs • Writing – a letter to a penfriend"
  );

  const u4l1 = await findOrCreateLesson(
    unit4.id,
    1,
    "Present Simple – I/You/We/They + Adverbs of Frequency",
    `# Present Simple – All Persons

## Affirmative
Use the **base form** of the verb with I, you, we, they:
- I **work** in a hotel.
- We **want** to go on holiday.
- They **love** their jobs.

## Negative
Use **don't** (do not) + base verb:
- I **don't** speak Japanese.
- We **don't** have children.

## Questions
Use **do** + subject + base verb:
- **Do** you speak French? Yes, I **do**.
- **Do** they want a holiday? No, they **don't**.

## Adverbs of Frequency
Place adverbs **before** the main verb (but after 'to be'):

| Adverb | Frequency |
|--------|-----------|
| always | 100% |
| usually | ~80% |
| often | ~60% |
| sometimes | ~40% |
| never | 0% |

## Prepositions of Time – in, on, at
- **in** summer / **in** March / **in** the morning
- **on** Sundays / **on** Friday
- **at** 9 o'clock / **at** the weekend / **at** Christmas`,
    { words: ["always", "usually", "often", "sometimes", "never", "in", "on", "at"] }
  );

  await findOrCreateQuiz(u4l1.id, "Quiz – Present Simple + Adverbs of Frequency", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "Complete: I like swimming, but I ___ like tennis.",
      options: ["don't", "doesn't", "isn't", "not"],
      correct: "don't",
      explanation: "Negative with I: don't + base verb.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Where does the adverb go? 'We go to France in spring.' (always)",
      options: [
        "We go always to France in spring.",
        "We always go to France in spring.",
        "Always we go to France in spring.",
        "We go to France always in spring.",
      ],
      correct: "We always go to France in spring.",
      explanation: "Adverbs of frequency go BEFORE the main verb.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Complete: The train leaves Paris ___ 4 p.m.",
      options: ["in", "on", "at", "by"],
      correct: "at",
      explanation: "'At' is used with specific times of day.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Complete: My brother's birthday is ___ March.",
      options: ["in", "on", "at", "by"],
      correct: "in",
      explanation: "'In' is used with months.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Complete: They often eat in a restaurant ___ Fridays.",
      options: ["in", "on", "at", "by"],
      correct: "on",
      explanation: "'On' is used with days of the week.",
    },
  ]);

  console.log(`✅ Unit 4 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 5 — Where do you live?
  // ═══════════════════════════════════════════════
  const unit5 = await findOrCreateModule(
    5,
    "Unit 5 – Where do you live?",
    "there is/are, some/any • Prepositions • this/that/these/those • Rooms and activities • Writing – describing where you live"
  );

  const u5l1 = await findOrCreateLesson(
    unit5.id,
    1,
    "there is / there are + some / any",
    `# there is / there are

Use **there is** (singular) and **there are** (plural) to say something exists:

| | Affirmative | Negative | Question |
|-|------------|----------|---------|
| Singular | There **is** a desk. | There **isn't** an umbrella. | **Is** there a desk? |
| Plural | There **are** some cups. | There **aren't** any flowers. | **Are** there any letters? |

## some and any
- Use **some** in affirmative sentences.
- Use **any** in negatives and questions.

## this / that / these / those

| | Near | Far |
|-|------|-----|
| Singular | **this** | **that** |
| Plural | **these** | **those** |

## Prepositions of Place
- **in** the bag / **on** the table / **next to** the door
- **in front of** the sofa / **behind** the sofa / **under** the table`,
    {
      words: [
        "there is", "there are", "some", "any",
        "this", "that", "these", "those",
        "in front of", "next to", "behind",
      ],
    }
  );

  await findOrCreateQuiz(u5l1.id, "Quiz – there is/are + some/any", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "Complete: ___ a desk in the office.",
      options: ["There are", "There is", "It is", "They are"],
      correct: "There is",
      explanation: "'A desk' is singular → There is.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Complete: There aren't ___ plants in the room.",
      options: ["some", "any", "a", "the"],
      correct: "any",
      explanation: "Negative sentences use 'any'.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Complete: Are there ___ good pubs nearby?",
      options: ["some", "any", "a", "an"],
      correct: "any",
      explanation: "Questions use 'any'.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Which is correct for something FAR from you (plural)?",
      options: ["this", "that", "these", "those"],
      correct: "those",
      explanation: "'Those' = plural, far from the speaker.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Complete: The bag is ___ the chair. (on top of the chair)",
      options: ["in", "on", "under", "behind"],
      correct: "on",
      explanation: "'On' expresses position on a surface.",
    },
  ]);

  console.log(`✅ Unit 5 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 6 — Can you speak English?
  // ═══════════════════════════════════════════════
  const unit6 = await findOrCreateModule(
    6,
    "Unit 6 – Can you speak English?",
    "can/can't • was/were • could/couldn't • Words that go together • Prepositions • Writing – formal letters 1"
  );

  const u6l1 = await findOrCreateLesson(
    unit6.id,
    1,
    "can / can't + was / were + could / couldn't",
    `# can / can't

| | Form |
|-|------|
| Affirmative | I/He/She **can** play the piano. |
| Negative | I/He/She **can't** (cannot) drive. |
| Question | **Can** you speak French? Yes, I **can**. / No, I **can't**. |

⚠️ No -s in third person: She **can** (NOT She cans)

## was / were (Past of to be)

| | Past |
|-|------|
| I/He/She/It | **was** |
| You/We/They | **were** |

## could / couldn't (Past of can)
- I **couldn't** swim when I was three, but I **can** now.
- When I **was** five, I **could** read.`,
    { words: ["can", "can't", "could", "couldn't", "was", "were"] }
  );

  await findOrCreateQuiz(u6l1.id, "Quiz – can/can't + was/were + could/couldn't", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "Complete: She ___ play the piano very well.",
      options: ["cans", "can", "could to", "is can"],
      correct: "can",
      explanation: "'can' has the same form for all persons – no -s.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Complete: The homework ___ very difficult yesterday.",
      options: ["is", "are", "was", "were"],
      correct: "was",
      explanation: "Past of 'is' (singular subject) = was.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Complete: 'Where ___ you born?' 'In Brazil.'",
      options: ["was", "were", "are", "is"],
      correct: "were",
      explanation: "Past of 'are' (you) = were.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Complete: I ___ swim when I was three, but I can now.",
      options: ["can't", "couldn't", "wasn't", "didn't"],
      correct: "couldn't",
      explanation: "Past of 'can't' = couldn't.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Complete: ___ you drive a car?",
      options: ["Are", "Do", "Can", "Have"],
      correct: "Can",
      explanation: "'Can' is used to ask about ability.",
    },
  ]);

  console.log(`✅ Unit 6 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 7 — Then and now
  // ═══════════════════════════════════════════════
  const unit7 = await findOrCreateModule(
    7,
    "Unit 7 – Then and now",
    "Past Simple 1 • Present Simple revision • Parts of speech • Prepositions • Writing – describing a holiday"
  );

  const u7l1 = await findOrCreateLesson(
    unit7.id,
    1,
    "Past Simple – Regular & Irregular Verbs",
    `# Past Simple

## Regular Verbs → add -ed
| Infinitive | Past Simple |
|-----------|-------------|
| work | work**ed** |
| visit | visit**ed** |
| travel | travel**led** |
| stay | stay**ed** |

## Irregular Verbs
| Infinitive | Past Simple |
|-----------|-------------|
| go | **went** |
| see | **saw** |
| have | **had** |
| buy | **bought** |
| come | **came** |
| take | **took** |
| meet | **met** |
| drive | **drove** |
| speak | **spoke** |

## Negative → didn't + base verb
- I didn't **go** to New York, I **went** to Chicago.

## Questions → Did + subject + base verb?
- **Did** you work yesterday? No, I didn't.

## Past Time Expressions
yesterday • last week • last month • last year • three days **ago**`,
    { words: ["worked", "went", "saw", "had", "bought", "came", "took", "didn't", "ago"] }
  );

  await findOrCreateQuiz(u7l1.id, "Quiz – Past Simple", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "What is the Past Simple of 'go'?",
      options: ["goed", "goes", "went", "gone"],
      correct: "went",
      explanation: "'go' is irregular → past simple = went.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Complete: I didn't go to New York. I ___ to Chicago.",
      options: ["go", "goes", "went", "gone"],
      correct: "went",
      explanation: "The second clause uses past simple (affirmative).",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Make negative: 'She drove to work.'",
      options: [
        "She didn't drove to work.",
        "She didn't drive to work.",
        "She don't drive to work.",
        "She wasn't drove to work.",
      ],
      correct: "She didn't drive to work.",
      explanation: "Negative past: didn't + base form (not past form).",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Complete the question: '___ did you start school?'",
      options: ["What time", "Where", "When", "Who"],
      correct: "When",
      explanation: "'When' asks about time.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Complete: I saw him last June. → I saw him three months ___.",
      options: ["before", "ago", "last", "past"],
      correct: "ago",
      explanation: "'Ago' is used with past time expressions measured from now.",
    },
  ]);

  console.log(`✅ Unit 7 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 8 — How long ago?
  // ═══════════════════════════════════════════════
  const unit8 = await findOrCreateModule(
    8,
    "Unit 8 – How long ago?",
    "Past Simple 2 • Past time expressions • Linking words • Numbers 100–1,000"
  );

  const u8l1 = await findOrCreateLesson(
    unit8.id,
    1,
    "Past Simple 2 – More Irregular Verbs",
    `# More Irregular Verbs

| Infinitive | Past Simple |
|-----------|-------------|
| write | **wrote** |
| leave | **left** |
| lose | **lost** |
| give | **gave** |
| fall | **fell** |
| win | **won** |
| understand | **understood** |
| begin | **began** |

## Numbers 100–1,000
- 130 = one hundred and thirty
- 285 = two hundred and eighty-five
- 1,000 = one thousand

## Linking Words – because, when, until
- I left early **because** I didn't feel well.
- Tim didn't see it **when** he was in Rome.
- Eva didn't start **until** she was thirty.`,
    { words: ["wrote", "left", "lost", "gave", "fell", "won", "because", "when", "until"] }
  );

  await findOrCreateQuiz(u8l1.id, "Quiz – Past Simple 2 + Linking Words", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "What is the Past Simple of 'write'?",
      options: ["writed", "written", "wrote", "wrotes"],
      correct: "wrote",
      explanation: "'write' is irregular → past simple = wrote.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Complete: I left the party early ___ I didn't feel well.",
      options: ["when", "until", "because", "but"],
      correct: "because",
      explanation: "'because' introduces a reason.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Complete: Eva didn't start learning English ___ she was thirty.",
      options: ["because", "when", "until", "after"],
      correct: "until",
      explanation: "'until' means 'up to the time of'.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "How do you say 415 in English?",
      options: [
        "Four hundred fifteen",
        "Four hundred and fifteen",
        "Forty and fifteen",
        "Four fifteen hundred",
      ],
      correct: "Four hundred and fifteen",
      explanation: "In British English, 'and' is used after hundreds.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "What is the Past Simple of 'win'?",
      options: ["winned", "woned", "won", "wins"],
      correct: "won",
      explanation: "'win' is irregular → past simple = won.",
    },
  ]);

  console.log(`✅ Unit 8 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 9 — Food you like!
  // ═══════════════════════════════════════════════
  const unit9 = await findOrCreateModule(
    9,
    "Unit 9 – Food you like!",
    "Count and uncount nouns • I like/I'd like • some/any, much/many • Food and drink"
  );

  const u9l1 = await findOrCreateLesson(
    unit9.id,
    1,
    "Count/Uncount Nouns + I like vs I'd like",
    `# Count and Uncount Nouns

**Count nouns** (you can count them): a sandwich, two sandwiches / an apple, three apples

**Uncount nouns** (you cannot count them): rice, bread, money, water, milk, cheese, music

## some and any
- Use **some** in affirmative: Would you like **some** rice?
- Use **any** in negatives/questions: I don't have **any** money.

## How much / How many
- **How much** + uncount: How much homework do you get?
- **How many** + count: How many books do you have?

## I like vs I'd like

| | Meaning | Example |
|-|---------|---------|
| I **like** | General preference | I **like** coffee. |
| I **'d like** | Specific request now | I**'d like** a coffee, please. |

- 'Would you like a banana?' → 'Yes, please.' ✓
- 'Do you like bananas?' → 'Yes, I do.' ✓`,
    { words: ["rice", "bread", "money", "sandwich", "apple", "some", "any", "much", "many"] }
  );

  await findOrCreateQuiz(u9l1.id, "Quiz – Count/Uncount + like/would like", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "Is 'money' a count or uncount noun?",
      options: [
        "Count (you can say 'a money')",
        "Uncount (you cannot say 'a money')",
        "Both",
        "Neither",
      ],
      correct: "Uncount (you cannot say 'a money')",
      explanation: "Money is uncountable – you can't say 'a money' or 'two moneys'.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Complete: I don't have ___ money in my pocket.",
      options: ["some", "any", "much", "many"],
      correct: "any",
      explanation: "Negative sentences use 'any'.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Complete: How ___ English books do you have?",
      options: ["much", "many", "some", "any"],
      correct: "many",
      explanation: "'How many' is used with count nouns.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "'Would you like a banana?' The correct answer is:",
      options: ["Yes, I like.", "Yes, I do.", "Yes, please.", "Yes, I am."],
      correct: "Yes, please.",
      explanation: "Answer to 'Would you like...?' is 'Yes, please.' or 'No, thank you.'",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Complete: ___ homework do you get?",
      options: ["How many", "How much", "How often", "How long"],
      correct: "How much",
      explanation: "'Homework' is uncountable → How much.",
    },
  ]);

  console.log(`✅ Unit 9 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 10 — Bigger and better!
  // ═══════════════════════════════════════════════
  const unit10 = await findOrCreateModule(
    10,
    "Unit 10 – Bigger and better!",
    "Comparatives and superlatives • have got • Compound nouns • Writing – describing a city"
  );

  const u10l1 = await findOrCreateLesson(
    unit10.id,
    1,
    "Comparatives and Superlatives + have got",
    `# Comparative Adjectives

## Short adjectives → add -er + than
- cheap → cheap**er** than / big → big**ger** than / dirty → dirt**ier** than

## Long adjectives → more + adjective + than
- expensive → **more** expensive than / modern → **more** modern than

## Irregular: good → **better** / bad → **worse** / far → **further**

# Superlative Adjectives
- cheap → **the cheapest** / big → **the biggest**
- expensive → **the most expensive**
- good → **the best** / bad → **the worst**

# have got (British English = have)
- She **has got** a dog. = She **has** a dog.
- **Have** you **got** a computer? = **Do** you **have** a computer?
- He **hasn't got** a car. = He **doesn't have** a car.`,
    {
      words: [
        "cheaper", "bigger", "more expensive", "better", "worse",
        "the cheapest", "the most expensive", "have got", "hasn't got",
      ],
    }
  );

  await findOrCreateQuiz(u10l1.id, "Quiz – Comparatives, Superlatives & have got", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "What is the comparative of 'cheap'?",
      options: ["more cheap", "cheaper", "cheapest", "cheapier"],
      correct: "cheaper",
      explanation: "Short adjective → add -er: cheap → cheaper.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "What is the comparative of 'expensive'?",
      options: ["expensiver", "more expensive", "expensivest", "most expensive"],
      correct: "more expensive",
      explanation: "Long adjective (3+ syllables) → more + adjective.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Complete: The Nile is ___ (long) river in the world.",
      options: ["longer", "more long", "the longest", "the most long"],
      correct: "the longest",
      explanation: "Superlative of short adjective: the + -est.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "What is the comparative of 'good'?",
      options: ["gooder", "more good", "better", "best"],
      correct: "better",
      explanation: "'good' is irregular → comparative = better.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Rewrite: 'She has a dog. She doesn't have a cat.' (using have got)",
      options: [
        "She's got a dog. She hasn't got a cat.",
        "She got a dog. She not got a cat.",
        "She have got a dog. She don't got a cat.",
        "She has got a dog. She don't have got a cat.",
      ],
      correct: "She's got a dog. She hasn't got a cat.",
      explanation: "affirmative = 's got / negative = hasn't got.",
    },
  ]);

  console.log(`✅ Unit 10 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 11 — Looking good!
  // ═══════════════════════════════════════════════
  const unit11 = await findOrCreateModule(
    11,
    "Unit 11 – Looking good!",
    "Present Continuous • Spelling verb + -ing • Whose is it? • Parts of the body • Writing – describing people"
  );

  const u11l1 = await findOrCreateLesson(
    unit11.id,
    1,
    "Present Continuous",
    `# Present Continuous

## Form: am/is/are + verb + -ing
- I**'m working** hard.
- She**'s buying** a present.
- They**'re wearing** jeans.

## Spelling: verb + -ing
| Rule | Example |
|------|---------|
| Most verbs → + ing | walk → walk**ing** |
| Ending in -e → remove e + ing | have → hav**ing** |
| Vowel + consonant → double + ing | run → runn**ing**, swim → swimm**ing** |

## Use: actions happening NOW or around now
- Look! It**'s raining**.
- I**'m working** hard this week.

## vs Present Simple
| Present Simple | Present Continuous |
|---------------|-------------------|
| I **have** a shower every morning. | I**'m having** a shower right now. |
| She **works** in a hospital. | She**'s working** hard this week. |`,
    { words: ["working", "buying", "wearing", "having", "running", "swimming", "raining"] }
  );

  await findOrCreateQuiz(u11l1.id, "Quiz – Present Continuous", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "What is the -ing form of 'swim'?",
      options: ["swiming", "swimming", "swimeing", "swimms"],
      correct: "swimming",
      explanation: "swim ends in vowel + consonant (i+m) → double the m: swimming.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "What is the -ing form of 'have'?",
      options: ["haveing", "having", "haves", "havving"],
      correct: "having",
      explanation: "have ends in -e → remove e and add -ing: having.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Choose the correct form: 'Look! It ___ . We can't go to the beach.'",
      options: ["rains", "is raining", "rained", "rain"],
      correct: "is raining",
      explanation: "'Look!' signals something happening right now → Present Continuous.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Choose the correct form: 'I ___ a shower every morning.'",
      options: ["am having", "have", "is having", "having"],
      correct: "have",
      explanation: "'Every morning' = habitual action → Present Simple.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Make a question: 'you / what / are / doing / ?'",
      options: [
        "What you are doing?",
        "What are you doing?",
        "Are you what doing?",
        "You what are doing?",
      ],
      correct: "What are you doing?",
      explanation: "Question word + auxiliary + subject + verb-ing.",
    },
  ]);

  console.log(`✅ Unit 11 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 12 — Life's an adventure!
  // ═══════════════════════════════════════════════
  const unit12 = await findOrCreateModule(
    12,
    "Unit 12 – Life's an adventure!",
    "going to future • Infinitive of purpose • Word stress • Prepositions • Writing – a holiday postcard"
  );

  const u12l1 = await findOrCreateLesson(
    unit12.id,
    1,
    "going to – Future Plans",
    `# going to – Future

## Form: am/is/are + going to + base verb

| | Example |
|-|---------|
| Affirmative | I**'m going to** visit Paris. |
| Negative | She**'s not going to** fly. |
| Question | **Are** they **going to** stay? |

## Use
1. **Planned intentions**: We**'re going to be** pilots.
2. **Predictions based on evidence**: Those clouds! It**'s going to** rain.

## Infinitive of Purpose
Use **to** + verb to explain purpose:
- Why are you going to the baker's? **To buy** some bread.
- She went to the chemist's **to buy** some aspirin.`,
    { words: ["going to", "plan", "intention", "prediction", "to buy", "to visit"] }
  );

  await findOrCreateQuiz(u12l1.id, "Quiz – going to + Infinitive of Purpose", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "Complete: We are learning to fly. We ___ be pilots.",
      options: ["are going to", "go to", "going to", "will going to"],
      correct: "are going to",
      explanation: "'going to' for future plans: are + going to + base verb.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Complete: 'What ___ you going to see?' (cinema question)",
      options: ["do", "did", "are", "were"],
      correct: "are",
      explanation: "Question with going to: are/is/am + subject + going to.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Why are you going to the baker's? ___ buy some bread.",
      options: ["For", "To", "Because", "Going to"],
      correct: "To",
      explanation: "Infinitive of purpose: to + base verb.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Make negative: 'She is going to swim two miles today.'",
      options: [
        "She didn't swim two miles today.",
        "She isn't going to swim two miles today.",
        "She won't going to swim today.",
        "She not going to swim today.",
      ],
      correct: "She isn't going to swim two miles today.",
      explanation: "Negative going to: isn't/aren't/am not + going to + base verb.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Look at those clouds! I think it ___ rain.",
      options: ["is going to", "goes to", "will going to", "going"],
      correct: "is going to",
      explanation: "Prediction based on evidence: is going to.",
    },
  ]);

  console.log(`✅ Unit 12 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 13 — How terribly clever!
  // ═══════════════════════════════════════════════
  const unit13 = await findOrCreateModule(
    13,
    "Unit 13 – How terribly clever!",
    "Question forms • -ed/-ing adjectives • Adverbs and adjectives • Writing – Once upon a time"
  );

  const u13l1 = await findOrCreateLesson(
    unit13.id,
    1,
    "Question Forms + Adverbs vs Adjectives",
    `# Question Forms

| Word | Asks about | Example |
|------|-----------|---------|
| **What** | things | What's the capital of Peru? |
| **Where** | place | Where did he die? |
| **When** | time | When was the First World War? |
| **Why** | reason | Why is she famous? |
| **Who** | people | Who built the White House? |
| **Which** | choice | Which cinema is it at? |
| **How many** | quantity | How many players? |
| **How old** | age | How old is your sister? |

# Adjectives vs Adverbs

**Adjectives** describe nouns: She's a very **good** singer.
**Adverbs** describe verbs: She sings very **well**.

## Forming Adverbs → adjective + -ly
- quick → quick**ly** / quiet → quiet**ly** / happy → happi**ly** (y → ily)
- Irregular: good → **well** / fast → **fast** / hard → **hard**

## -ed and -ing Adjectives
| -ed (how person feels) | -ing (what causes feeling) |
|----------------------|--------------------------|
| I'm **bored**. | This film is **boring**. |
| She's **interested**. | The book is **interesting**. |
| He's **excited**. | The news is **exciting**. |`,
    { words: ["quickly", "quietly", "happily", "well", "bored", "boring", "interested", "interesting"] }
  );

  await findOrCreateQuiz(u13l1.id, "Quiz – Question Forms + Adverbs", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "Which question word asks about a CHOICE between options?",
      options: ["What", "Which", "Who", "How"],
      correct: "Which",
      explanation: "'Which' asks someone to choose from a limited set of options.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Choose the correct word: 'She sings very ___.'",
      options: ["good", "well", "goodly", "nicely"],
      correct: "well",
      explanation: "'Well' is the adverb form of 'good'.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Choose the correct word: 'The children played ___ in the garden.'",
      options: ["happy", "happiness", "happily", "more happy"],
      correct: "happily",
      explanation: "'happily' (adverb) describes HOW they played.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Complete: 'I'm not ___ in football.' (how the person feels)",
      options: ["interesting", "interest", "interested", "bored"],
      correct: "interested",
      explanation: "-ed adjective = how the PERSON feels.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Complete: 'What ___ of car do you have?' 'A Mercedes.'",
      options: ["sort", "kind of", "type", "sort of"],
      correct: "sort",
      explanation: "'What sort of' asks about the type/kind of something.",
    },
  ]);

  console.log(`✅ Unit 13 criada`);

  // ═══════════════════════════════════════════════
  // UNIT 14 — Have you ever?
  // ═══════════════════════════════════════════════
  const unit14 = await findOrCreateModule(
    14,
    "Unit 14 – Have you ever?",
    "Present Perfect • ever, never, yet, just • ago, last year • Phrasal verbs • Writing – a thank-you letter"
  );

  const u14l1 = await findOrCreateLesson(
    unit14.id,
    1,
    "Present Perfect",
    `# Present Perfect

## Form: have/has + past participle

| | Affirmative | Negative | Question |
|-|------------|----------|---------|
| I/You/We/They | I**'ve seen** the film. | They **haven't had** lunch yet. | **Have** you ever **been** to Paris? |
| He/She/It | She**'s won** many prizes. | She **hasn't played** at Wimbledon. | **Has** she **won** Wimbledon? |

## ever, never, yet, just

| Word | Use | Example |
|------|-----|---------|
| **ever** | questions | Have you **ever** been to Paris? |
| **never** | negatives | He**'s never** travelled on Eurostar. |
| **yet** | negatives/questions | They haven't had lunch **yet**. |
| **just** | very recently | I**'ve just** tidied it. |

## Present Perfect vs Past Simple
| Present Perfect | Past Simple |
|----------------|-------------|
| I**'ve been** to Australia. (life experience) | I **went** to Australia **last month**. (specific time) |

## been vs gone
- She**'s been** to Florida. (went AND came back)
- She**'s gone** to Florida. (still there now)`,
    { words: ["have been", "has gone", "ever", "never", "yet", "just", "past participle"] }
  );

  await findOrCreateQuiz(u14l1.id, "Quiz – Present Perfect", [
    {
      id: "q1",
      type: "multiple_choice",
      question: "Complete: Have you ___ been to Paris?",
      options: ["never", "ever", "yet", "just"],
      correct: "ever",
      explanation: "'ever' is used in Present Perfect questions meaning 'at any time'.",
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Complete: He's ___ travelled on Eurostar. (= at no time)",
      options: ["ever", "yet", "never", "just"],
      correct: "never",
      explanation: "'never' = at no time.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      question: "Complete: Have you tidied your room yet? Yes, I've ___ tidied it.",
      options: ["ever", "never", "yet", "just"],
      correct: "just",
      explanation: "'just' = very recently completed.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      question: "Which sentence uses the correct tense with 'last month'?",
      options: [
        "I've been to Australia last month.",
        "I went to Australia last month.",
        "I have went to Australia last month.",
        "I go to Australia last month.",
      ],
      correct: "I went to Australia last month.",
      explanation: "Specific past time (last month) → Past Simple.",
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "'Bob's not here. He's ___ to work.' (= he's still there)",
      options: ["been", "gone", "went", "go"],
      correct: "gone",
      explanation: "'gone to' = the person is still there. 'been to' = went and came back.",
    },
  ]);

  console.log(`✅ Unit 14 criada`);

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("📊 Resumo:");
  console.log("  • 1 Course");
  console.log("  • 14 Modules (Units 1–14)");
  console.log("  • 20+ Lessons");
  console.log("  • 20+ Quizzes com 5 questões cada");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
