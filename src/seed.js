import { DECK_RUNGS } from "./constants";

/* ---- sentences ---- */
export const seedLines = () => [
  // Everyday requests
  ["Everyday requests", "You're thirsty. Ask for a drink of water.", "I would like a glass of water.",
    ["I would like…", "I would like a glass of ___.", "It starts with /w/ — water."], 1, false],
  ["Everyday requests", "The room is warm. Ask someone to open the window.", "Please open the window.",
    ["Please open…", "Please open the ___.", "It starts with /w/ — window."], 1, false],
  ["Everyday requests", "You can't reach something. Ask for help.", "Can you help me, please?",
    ["Can you…", "Can you ___ me, please?", "It starts with /h/ — help."], 2, false],
  ["Everyday requests", "You need to take your medication. Ask for your tablets.", "Can I have my tablets, please?",
    ["Can I have…", "Can I have my ___, please?", "It starts with /t/ — tablets."], 1, false],
  ["Everyday requests", "Your back is hurting. Tell someone.", "My back is hurting.",
    ["My back is…", "My back is ___.", "It starts with /h/ — hurting."], 1, false],
  ["Everyday requests", "You want to know what time it is. Ask someone.", "What time is it, please?",
    ["What time…", "What time is it, ___?", "It ends with /p/ — please."], 1, false],
  // Out and about
  ["Out and about", "You're at a café. Order a coffee with milk.", "I'll have a coffee with milk, please.",
    ["I'll have…", "I'll have a coffee with ___, please.", "It starts with /m/ — milk."], 2, false],
  ["Out and about", "You want to know the price of something.", "How much does this cost?",
    ["How much…", "How much does this ___?", "It starts with /c/ — cost."], 2, false],
  ["Out and about", "You're paying. Ask to pay by card.", "Can I pay by card?",
    ["Can I…", "Can I pay by ___?", "It starts with /c/ — card."], 1, false],
  ["Out and about", "You're at the bus stop. Ask someone if the bus has come.", "Has the bus come yet?",
    ["Has the bus…", "Has the bus come ___?", "It starts with /y/ — yet."], 1, false],
  ["Out and about", "You want to sit down in a busy café. Ask if a seat is free.", "Is this seat free, please?",
    ["Is this seat…", "Is this seat ___, please?", "It starts with /f/ — free."], 1, false],
  // On the phone
  ["On the phone", "Call a shop. Ask if they're open today.", "Are you open today?",
    ["Are you…", "Are you ___ today?", "It starts with /o/ — open."], 1, false],
  ["On the phone", "Leave a message. Ask them to call you back.", "Please call me back.",
    ["Please call…", "Please call me ___.", "It starts with /b/ — back."], 1, false],
  ["On the phone", "You want to make a doctor's appointment. Ask to book one.", "I'd like to book an appointment, please.",
    ["I'd like…", "I'd like to book an ___, please.", "It starts with /a/ — appointment."], 2, false],
  ["On the phone", "You're calling back. Tell them you missed their call.", "Hello, I'm calling back — you rang me.",
    ["Hello, I'm calling…", "Hello, I'm calling back — you ___ me.", "It starts with /r/ — rang."], 2, false],
  // Talking about your day
  ["Talking about your day", "Tell me one thing you did this morning.", "This morning I made breakfast.",
    ["This morning I…", "This morning I ___.", "Think of one thing — what did you do first?"], 2, true],
  ["Talking about your day", "Tell me what you had for lunch.", "For lunch I had rice and chicken.",
    ["For lunch I…", "For lunch I had ___.", "Picture your plate — what was on it?"], 2, true],
  ["Talking about your day", "Tell me somewhere you'd like to go this week.", "I would like to go to the park.",
    ["I would like to go…", "I would like to go to the ___.", "Think of one place you enjoy."], 2, true],
  ["Talking about your day", "Tell me something you're looking forward to.", "I'm looking forward to the visit.",
    ["I'm looking forward…", "I'm looking forward to ___.", "Think of one thing coming up."], 2, true],
  ["Talking about your day", "Tell me how you slept last night.", "I slept well last night.",
    ["I slept…", "I slept ___ last night.", "Well? Badly? Just a little?"], 2, true],
  // People & family
  ["People & family", "Tell me about one person in your family.", "My brother lives in the city.",
    ["My brother…", "My ___ lives in the city.", "Think of one person — where do they live?"], 2, true],
  ["People & family", "Introduce yourself. Say your name.", "My name is …",
    ["My name…", "My name is ___.", "Just your first name."], 1, true],
  ["People & family", "Tell me about someone who visited you recently.", "My daughter came to visit yesterday.",
    ["My daughter…", "My daughter came to visit ___.", "It starts with /y/ — yesterday."], 2, true],
  ["People & family", "Tell me one thing you like about someone you love.", "I love spending time with him.",
    ["I love…", "I love ___ time with him.", "It starts with /sp/ — spending."], 2, true],
  // Describing a scene
  ["Describing a scene", "A man is waiting at the bus stop in the rain. Tell me what's happening.", "The man is waiting for the bus.",
    ["The man is…", "The man is waiting for the ___.", "It starts with /b/ — bus."], 2, false],
  ["Describing a scene", "Two people are cooking dinner in the kitchen. Tell me what they're doing.", "They are making dinner.",
    ["They are…", "They are making ___.", "It starts with /d/ — dinner."], 2, false],
  // Health & wellbeing
  ["Health & wellbeing", "Tell the doctor where it hurts.", "It hurts here, on my left side.",
    ["It hurts…", "It hurts here, on my ___ side.", "Left or right?"], 1, true],
  ["Health & wellbeing", "Tell the physio how your arm feels today.", "My arm feels stiff today.",
    ["My arm feels…", "My arm feels ___ today.", "It starts with /s/ — stiff."], 1, true],
  ["Health & wellbeing", "Ask how long the exercise should take.", "How long should I do this for?",
    ["How long…", "How long should I do this ___?", "It starts with /f/ — for."], 2, false],
  ["Health & wellbeing", "Tell someone you're feeling tired.", "I'm feeling quite tired today.",
    ["I'm feeling…", "I'm feeling quite ___ today.", "It starts with /t/ — tired."], 1, true],
].map((r, i) => ({
  id: "s" + i, type: "line", area: r[0], prompt: r[1], target: r[2], cues: r[3], level: r[4], personal: r[5], approved: true,
}));

/* ---- scenes ---- */
export const seedScenes = () => ([
  {
    id: "sc0", type: "scene", area: "Out and about", level: 3, approved: true,
    setting: "You've just finished dinner at a restaurant with a friend. The plates have been cleared and you're ready to leave. The waiter is walking past your table.",
    steps: [
      { ask: "Get the waiter's attention and ask for the bill.", target: "Excuse me, could we have the bill, please?",
        cues: ["Excuse me…", "Excuse me, could we have the ___, please?", "It starts with /b/ — bill."] },
      { ask: "The bill comes to £40. Say you'd like to pay by card.", target: "I'd like to pay by card, please.",
        cues: ["I'd like…", "I'd like to pay by ___, please.", "It starts with /c/ — card."] },
      { ask: "Ask your friend if they'd like to split it.", target: "Shall we split the bill?",
        cues: ["Shall we…", "Shall we split the ___?", "It starts with /b/ — bill."] },
      { ask: "Without looking back — where were you, who were you with, and how did you pay?",
        target: "I was at a restaurant with a friend, and I paid by card.", personal: true, recall: true,
        cues: ["I was at…", "I was at a restaurant with ___.", "Three things: the place, the person, the payment."] },
    ],
  },
  {
    id: "sc1", type: "scene", area: "On the phone", level: 3, approved: true,
    setting: "You have a dentist appointment booked for Tuesday at 3 o'clock, but something has come up. You call the surgery to move it. The receptionist answers.",
    steps: [
      { ask: "Say who you are and why you're calling.", target: "Hello, this is [your name]. I need to change my appointment.", personal: true,
        cues: ["Hello, this is…", "Hello, this is ___. I need to change my appointment.", "Your name first, then your reason."] },
      { ask: "Tell them when your appointment is.", target: "It's booked for Tuesday at three o'clock.",
        cues: ["It's booked for…", "It's booked for ___ at three o'clock.", "The day, then the time."] },
      { ask: "Ask if there's anything on Friday instead.", target: "Do you have anything on Friday instead?",
        cues: ["Do you have…", "Do you have anything on ___ instead?", "It starts with /f/ — Friday."] },
      { ask: "From memory — what day and time was your original appointment, and which day did you ask for instead?",
        target: "It was Tuesday at three, and I asked for Friday.", personal: true, recall: true,
        cues: ["It was…", "It was ___ at three, and I asked for Friday.", "Original day and time, then the new day."] },
    ],
  },
  {
    id: "sc2", type: "scene", area: "Out and about", level: 3, approved: true,
    setting: "You've had a headache since this morning. You go into the pharmacy. There's a short queue, and then it's your turn at the counter.",
    steps: [
      { ask: "Greet the pharmacist and explain the problem.", target: "Hello, I've had a headache all day.",
        cues: ["Hello, I've…", "Hello, I've had a ___ all day.", "It starts with /h/ — headache."] },
      { ask: "Ask if they can recommend something for it.", target: "Can you recommend anything for it?",
        cues: ["Can you…", "Can you recommend anything for ___?", "Think of the word: recommend."] },
      { ask: "Ask how often you should take it.", target: "How often should I take it?",
        cues: ["How often…", "How often should I ___ it?", "It starts with /t/ — take."] },
      { ask: "From memory — what did you go in for, and what did you ask the pharmacist?",
        target: "I went in for a headache, and I asked what to take.", personal: true, recall: true,
        cues: ["I went in for…", "I went in for a ___.", "The problem, then your question."] },
    ],
  },
  {
    id: "sc3", type: "scene", area: "Out and about", level: 3, approved: true,
    setting: "You're at the supermarket. You've picked up bread, milk, and eggs. At the till, the card machine won't accept your card.",
    steps: [
      { ask: "Tell the cashier the card isn't working.", target: "I'm sorry, my card isn't working.",
        cues: ["I'm sorry, my…", "I'm sorry, my ___ isn't working.", "It starts with /c/ — card."] },
      { ask: "Ask if you can pay with your phone instead.", target: "Can I pay with my phone instead?",
        cues: ["Can I…", "Can I pay with my ___ instead?", "It starts with /p/ — phone."] },
      { ask: "From memory — what three things were you buying?", target: "I was buying bread, milk, and eggs.", personal: true, recall: true,
        cues: ["I was buying…", "I was buying bread, ___, and eggs.", "Three items — picture the basket."] },
    ],
  },
  {
    id: "sc4", type: "scene", area: "Talking about your day", level: 3, approved: true,
    setting: "A friend you haven't seen in a while asks how your weekend was. You did a few things — take a moment to think back over them.",
    steps: [
      { ask: "Tell them one thing you did on Saturday.", target: "On Saturday I went to the market.", personal: true,
        cues: ["On Saturday I…", "On Saturday I ___.", "One thing — morning or afternoon?"] },
      { ask: "Now tell them what you did on Sunday.", target: "On Sunday I visited my family.", personal: true,
        cues: ["On Sunday I…", "On Sunday I ___.", "A different day — what changed?"] },
      { ask: "Tell them which part you enjoyed most, and why.", target: "I enjoyed Sunday most, because I saw everyone.", personal: true,
        cues: ["I enjoyed … most, because…", "I enjoyed ___ most, because ___.", "Pick one part, then give a reason."] },
    ],
  },
  {
    id: "sc5", type: "scene", area: "Health & wellbeing", level: 3, approved: true,
    setting: "You have an appointment with the GP. You've been having headaches and some dizziness. The doctor calls you in and sits down to listen.",
    steps: [
      { ask: "Tell the doctor your main concern.", target: "I've been getting headaches and feeling dizzy.",
        cues: ["I've been getting…", "I've been getting headaches and feeling ___.", "It starts with /d/ — dizzy."], personal: true },
      { ask: "The doctor asks how long this has been happening. Tell them.", target: "It's been going on for about two weeks.",
        cues: ["It's been…", "It's been going on for about ___ weeks.", "How many weeks?"], personal: true },
      { ask: "Ask the doctor what you should do.", target: "What do you think I should do?",
        cues: ["What do you…", "What do you think I ___ do?", "It starts with /sh/ — should."] },
      { ask: "From memory — what did you tell the doctor, and what did you ask?",
        target: "I told them about the headaches and dizziness, and asked what to do.", personal: true, recall: true,
        cues: ["I told them…", "I told them about the ___, and asked what to do.", "What you told them, then what you asked."] },
    ],
  },
  {
    id: "sc6", type: "scene", area: "Out and about", level: 3, approved: true,
    setting: "You need a taxi to get to the hospital for an appointment at 2 o'clock. You call a local taxi company. The phone rings and someone answers.",
    steps: [
      { ask: "Say hello and ask if they can send a taxi.", target: "Hello, can I book a taxi, please?",
        cues: ["Hello, can I…", "Hello, can I book a ___, please?", "It starts with /t/ — taxi."] },
      { ask: "Give them the pick-up address.", target: "I'm at 14 Maple Street.",
        cues: ["I'm at…", "I'm at 14 ___ Street.", "What's the street name?"], personal: true },
      { ask: "Tell them what time you need it.", target: "I need it for half past one, please.",
        cues: ["I need it for…", "I need it for half past ___, please.", "Half past what? The appointment is at 2."] },
      { ask: "From memory — where were you going, and what time did you book the taxi for?",
        target: "I was going to the hospital, and I booked the taxi for half past one.", personal: true, recall: true,
        cues: ["I was going to…", "I was going to the ___, and I booked the taxi for half past one.", "Destination, then pick-up time."] },
    ],
  },
  {
    id: "sc7", type: "scene", area: "Talking about your day", level: 2, approved: true,
    setting: "A family member calls on video. They ask how you're doing. It's been a few days since you last spoke.",
    steps: [
      { ask: "Tell them how you're feeling today.", target: "I'm feeling okay today, a bit tired.",
        cues: ["I'm feeling…", "I'm feeling okay today, a bit ___.", "Think of how you actually feel."], personal: true },
      { ask: "Tell them one thing you've been doing this week.", target: "I've been doing my exercises every day.",
        cues: ["I've been…", "I've been doing my ___ every day.", "It starts with /e/ — exercises."], personal: true },
      { ask: "Ask them how they are.", target: "How are you doing?",
        cues: ["How are…", "How are you ___?", "It starts with /d/ — doing."] },
      { ask: "From memory — what did you tell them, and what did you ask?",
        target: "I told them I was doing my exercises, and asked how they were.", personal: true, recall: true,
        cues: ["I told them…", "I told them about my ___, and asked how they were.", "What you shared, then your question."] },
    ],
  },
  {
    id: "sc8", type: "scene", area: "Talking about your day", level: 3, approved: true,
    setting: "You watched a documentary last night about elephants in Africa. Someone asks you about it.",
    steps: [
      { ask: "Tell them what you watched.", target: "I watched a documentary about elephants.",
        cues: ["I watched…", "I watched a documentary about ___.", "What was it about?"], personal: true },
      { ask: "Tell them one thing that happened or that you remember.", target: "The elephants were travelling across the desert.",
        cues: ["The elephants…", "The elephants were ___ across the desert.", "It starts with /t/ — travelling."] },
      { ask: "Tell them if you enjoyed it, and why.", target: "I enjoyed it because it was beautiful.",
        cues: ["I enjoyed it because…", "I enjoyed it because it was ___.", "What word describes it?"], personal: true },
    ],
  },
  {
    id: "sc9", type: "scene", area: "People & family", level: 3, approved: true,
    setting: "Someone asks you about a good memory — somewhere you went, something you did, or someone you spent time with. Take a moment to think of a real memory.",
    steps: [
      { ask: "Start by saying when it was.", target: "A few years ago, we went to the sea.",
        cues: ["A few years ago…", "A few years ago, we went to the ___.", "Think of where you were."], personal: true },
      { ask: "Tell them who you were with.", target: "I was with my family.",
        cues: ["I was with…", "I was with my ___.", "Who came with you?"], personal: true },
      { ask: "Tell them one thing that made it special.", target: "It was special because the weather was beautiful.",
        cues: ["It was special because…", "It was special because ___.", "One detail you remember."], personal: true },
      { ask: "From memory — when was it, who were you with, and what made it special?",
        target: "It was a few years ago, I was with my family, and the weather was beautiful.", personal: true, recall: true,
        cues: ["It was a few years ago…", "It was a few years ago, I was with ___, and ___.", "When, who, and the special thing."] },
    ],
  },
]);

/* ---- picture decks ----
   Images live in public/decks/<theme>/<n>.jpg — see public/decks/README.md
   for the naming convention. A missing file just falls back to the theme
   label (DeckStage handles the 404), so decks work before photos are added. */
const deckImg = (theme, n) => `${import.meta.env.BASE_URL}decks/${theme}/${n}.jpg`;

export const seedDecks = () => ([
  {
    id: "dk0", type: "deck", area: "Describing a scene", level: 2, approved: true,
    rung_labels: DECK_RUNGS,
    cards: [
      { theme: "cars", image_url: deckImg("cars", 1), fill_blank: "The red car is ___ the race.", model_example: "A red race car is speeding around the track. The driver is winning the race, and the crowd is cheering." },
      { theme: "cars", image_url: deckImg("cars", 2), fill_blank: "This old car is ___.", model_example: "This is an old classic car. It is shiny and blue, and it looks very expensive." },
      { theme: "cars", image_url: deckImg("cars", 3), fill_blank: "The man is ___ his car.", model_example: "A man is filling his car with petrol. He is standing at the pump, and he looks like he is in a hurry." },
      { theme: "cars", image_url: deckImg("cars", 4), fill_blank: "The cars are ___ in traffic.", model_example: "The cars are stuck in a traffic jam. Nothing is moving, and the drivers look frustrated." },
      { theme: "cars", image_url: deckImg("cars", 5), fill_blank: "The mechanic is ___ the car.", model_example: "A mechanic is fixing the car. He is under the bonnet, checking the engine with his tools." },
    ],
  },
  {
    id: "dk1", type: "deck", area: "Describing a scene", level: 2, approved: true,
    rung_labels: DECK_RUNGS,
    cards: [
      { theme: "sport", image_url: deckImg("sport", 1), fill_blank: "The player is ___ the ball.", model_example: "A footballer is kicking the ball towards the goal. He is trying to score, and the goalkeeper is diving to save it." },
      { theme: "sport", image_url: deckImg("sport", 2), fill_blank: "The woman is ___ the ball.", model_example: "A woman is serving the ball in a tennis match. She has thrown the ball up high and is about to hit it hard." },
      { theme: "sport", image_url: deckImg("sport", 3), fill_blank: "The fans are ___.", model_example: "The fans are celebrating in the stadium. They are cheering and waving their scarves because their team just scored." },
      { theme: "sport", image_url: deckImg("sport", 4), fill_blank: "The runner is ___ the race.", model_example: "A runner is crossing the finish line. She has won the race, and she looks exhausted but happy." },
      { theme: "sport", image_url: deckImg("sport", 5), fill_blank: "The player is ___ the ball into the basket.", model_example: "A basketball player is shooting the ball. He has jumped high into the air, aiming for the basket." },
    ],
  },
  {
    id: "dk2", type: "deck", area: "Describing a scene", level: 3, approved: true,
    rung_labels: DECK_RUNGS,
    cards: [
      { theme: "film", image_url: deckImg("film", 1), fill_blank: "The man is ___ a film.", model_example: "A man is sitting in the cinema, watching a film. He is holding a big box of popcorn, and the screen is bright in front of him." },
      { theme: "film", image_url: deckImg("film", 2), fill_blank: "The actor is ___ on the red carpet.", model_example: "An actor is posing on the red carpet. Cameras are flashing everywhere, and she is smiling for the photographers." },
      { theme: "film", image_url: deckImg("film", 3), fill_blank: "The director is ___ the scene.", model_example: "The director is filming a scene. He is sitting behind the camera, telling the actors what to do." },
      { theme: "film", image_url: deckImg("film", 4), fill_blank: "The cinema screen is ___.", model_example: "The cinema screen is huge and bright. The room is dark, and everyone is watching quietly." },
      { theme: "film", image_url: deckImg("film", 5), fill_blank: "They are ___ a movie.", model_example: "They are making a movie on set. Someone is holding a clapperboard, ready to start the next take." },
    ],
  },
]);

/* ---- physio/OT exercise drills (live session runner) ----
   Drawn from the Therapist Field Guide (cognitive therapist's session structure)
   and the whiteboard session notes — lower-limb initiation, trunk/weight-shifts,
   arms, and TRAM standing.

   mediaUrl is a slot only — this repo deploys to a PUBLIC GitHub Pages site, so
   NEVER commit photos or GIFs of Akki to it. Leave mediaUrl empty; if a private
   host exists later, point the string at that URL, not at anything in this repo. */
export const seedPhysioExercises = () => [
  /* ---- Rung 2 — trunk ---- */
  {
    id: "seated-perturbation", title: "Seated perturbation — rhythmic nudges",
    rung: 2, tool: "perturbation", unit: "catches",
    instructions: "Supported sitting, you seated beside or behind him with hands at the pelvis or lower ribs. Small, controlled, unpredictable nudges — front/back, then side/side, to a beat. This is the primary route into trunk: trunk control is brainstem-driven, not cortical, so no verbal command reaches the postural system — the nudge has to do the asking.",
    cues: [
      "I'm going to nudge you — stay with me",
      "Small nudge, front then back",
      "Now side to side, with the beat",
    ],
    watchFor: "WORKING = a righting reaction, head and trunk correcting back toward midline, however small. COMPENSATION = toppling into your hands with no correction, or bracing with the right arm before the nudge lands.",
    quickStretch: "lateral trunk, both sides", isStanding: false,
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "seated-reach-limits", title: "Reach to the edge of balance",
    rung: 2, tool: "target", unit: "reaches",
    instructions: "Object placed just beyond comfortable reach, at increasing distance as tolerance grows. Right arm leads. Guard at the trunk.",
    cues: [
      "Reach for it — right arm leads",
      "Stretch a little further than feels easy",
      "Bring it back to the middle",
    ],
    watchFor: "WORKING = trunk travelling with the reach and returning under control. COMPENSATION = the reach coming entirely from the shoulder with a static trunk, or overbalancing without catching.",
    quickStretch: "", isStanding: false,
    mediaUrl: "", defaultDualTask: true,
  },
  {
    id: "cross-midline-reach", title: "Cross-midline reach",
    rung: 2, tool: "target", unit: "reaches",
    instructions: "Object placed across the body on the opposite side, so reaching drives rotation and loads the far hip. Right arm reaches across.",
    cues: [
      "Reach across to it with your right arm",
      "Turn and reach — let your hip take the weight",
      "Bring it back to the middle",
    ],
    watchFor: "WORKING = rotation through the trunk with weight arriving on the opposite buttock. COMPENSATION = the whole body swivelling from the hips, or the bottom lifting off the seat.",
    quickStretch: "", isStanding: false,
    mediaUrl: "", defaultDualTask: true,
  },
  {
    id: "seated-weight-shift-beat", title: "Seated weight shift — to a beat",
    rung: 2, tool: "rhythm", unit: "shifts",
    instructions: "Metronome running. You rock him side to side with the pulse, easing your support as the rhythm carries. Do not ask him to shift — the beat and your hands do the initiating.",
    cues: [
      "Feel the beat — here we go",
      "Over to the right with the beat",
      "Back to the middle, and over left",
    ],
    watchFor: "WORKING = weight arriving over each buttock with the trunk staying tall, and any sign of him travelling with the beat rather than being moved by it. COMPENSATION = leaning from the shoulders, or propping on an arm.",
    quickStretch: "", isStanding: false,
    mediaUrl: "", defaultDualTask: true,
  },
  {
    id: "sitting-tolerance", title: "Supported sitting — tolerance",
    rung: 2, tool: "loading", unit: "minutes",
    instructions: "Sitting upright with support, feet flat and loaded. Build duration. Cognitive work runs on top of this — it's the natural slot for conversation and recall.",
    cues: [
      "Feet flat, weight through the soles",
      "Sit tall towards the ceiling",
      "Stay with me a little longer",
    ],
    watchFor: "WORKING = an upright trunk maintained without progressive collapse. COMPENSATION = sliding into a slump, or holding position only through your support.",
    quickStretch: "", isStanding: false,
    mediaUrl: "", defaultDualTask: true,
  },

  /* ---- Rung 3 — loading ---- */
  {
    id: "tram-weight-bearing", title: "TRAM weight-bearing",
    rung: 3, tool: "loading", unit: "minutes",
    instructions: "In the TRAM, feet flat and hip-width apart, harness supporting his weight. Pressure through the foot sole drives reticulospinal and vestibulospinal extension — brainstem systems that bypass the damaged frontal cortex entirely. This is why standing is both the goal and the treatment.",
    cues: [
      "Push down through both feet",
      "Stand up tall towards the ceiling",
      "Push, ease, push again — keep pushing with the beat",
    ],
    watchFor: "WORKING = an active push through the legs re-driven on each beat. COMPENSATION = hanging in the harness, or knees snapping back into hyperextension.",
    quickStretch: "quads and calf, both legs, before he takes the load", isStanding: true,
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "tram-arm-drive", title: "TRAM loading + right-arm drive",
    rung: 3, tool: "irradiation", unit: "minutes",
    instructions: "Loaded in the TRAM while he pushes or pulls hard against your hands with the right arm, in a diagonal, to the beat. The arm effort is the point — it spills facilitation into the legs (irradiation).",
    cues: [
      "Push hard against my hands — right arm",
      "Push, ease, push again with the beat",
      "Feel your legs while your arm works",
    ],
    watchFor: "WORKING = leg activity rising while the arm works — more push through the feet during arm effort than without it. COMPENSATION = the arm working while the legs stay passive (note it, it's still useful data).",
    quickStretch: "", isStanding: true,
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "sit-to-stand-supported", title: "Supported sit-to-stand",
    rung: 3, tool: "loading", unit: "reps",
    instructions: "Nose-over-toes forward translation with facilitation at the pelvis. A target to reach toward on the way up, rather than an instruction to stand.",
    cues: [
      "Nose over toes, lean forward",
      "Reach for it as you come up",
      "Feel your feet the whole way",
    ],
    watchFor: "WORKING = forward weight transfer with hips extending. COMPENSATION = pulling up on your arms, or the head staying back over the hips.",
    quickStretch: "quads and glutes", isStanding: false,
    mediaUrl: "", defaultDualTask: false,
  },

  /* ---- Rung 4 — extensor response (the milestone watch) ---- */
  {
    id: "extensor-probe", title: "Extensor response probe",
    rung: 4, tool: "stretch", unit: "attempts",
    instructions: "Under load in the TRAM: quick stretch, then rhythm, then right-arm effort, then observe whether the legs answer the load rather than just receiving it. This is a probe, not a drill — you are looking for the day the legs push back. Score involvement honestly: a 1 recorded accurately is worth more than a generous 2.",
    cues: [
      "Quick stretch first — quads and calf",
      "Feel the beat, then push with your right arm",
      "Now — do your legs push back?",
    ],
    watchFor: "WORKING = extensor activity arriving after the stretch that wasn't there before it — even a flicker. COMPENSATION = a whole-body stiffening rather than graded leg extension.",
    quickStretch: "quads and calf, immediately before each attempt", isStanding: true,
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "tram-knee-drive", title: "TRAM knee drive",
    rung: 4, tool: "loading", unit: "attempts",
    instructions: "In the TRAM, standing supported.",
    cues: [
      "Straighten your knees towards straight",
      "Feel them lock as they go straight",
      "Straighten, soften, straighten again — with the count",
    ],
    watchFor: "WORKING = active knee extension he re-drives each beat. COMPENSATION = knees buckling under load, or locking back and resting on the joint.",
    quickStretch: "quads, both legs", isStanding: true,
    mediaUrl: "", defaultDualTask: false,
  },

  /* ---- Rung 5–6 — dormant. Shown greyed in setup until Rung 4 lands. ---- */
  {
    id: "tram-weight-shift", title: "TRAM weight shift",
    rung: 5, tool: "loading", unit: "shifts",
    instructions: "Standing in the TRAM, shifting weight side to side. The gateway to stepping: walking is standing on one leg while the other travels.",
    cues: [], watchFor: "",
    quickStretch: "", isStanding: true,
    dormant: true, unlocksAt: "Rung 4 — legs pushing back",
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "tram-single-limb-load", title: "Single-limb loading",
    rung: 6, tool: "loading", unit: "minutes",
    instructions: "Tolerating load through one leg. If this can't happen, stepping cannot happen.",
    cues: [], watchFor: "",
    quickStretch: "", isStanding: true,
    dormant: true, unlocksAt: "Rung 5 — controlled weight shift in standing",
    mediaUrl: "", defaultDualTask: false,
  },

  /* ---- Arm and general ---- */
  {
    id: "arm-reach-to-target", title: "Arm reach to target",
    rung: null, tool: "target", unit: "reaches",
    instructions: "Seated, a cup or object placed at arm's length. Support at the elbow if needed.",
    cues: [
      "Reach your hand out to it",
      "Stretch all the way to it — straighten your elbow",
      "Bring it back slowly",
    ],
    watchFor: "WORKING = a controlled reach-and-return with the elbow extending. COMPENSATION = the trunk leaning forward to substitute for arm reach.",
    quickStretch: "triceps", isStanding: false,
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "grip-squeeze", title: "Grip squeeze",
    rung: null, tool: "target", unit: "reps",
    instructions: "A rolled towel or soft ball placed in the hand.",
    cues: [
      "Squeeze it as hard as you can",
      "Squeeze again on my count — one, two, three",
      "Now let go slowly",
    ],
    watchFor: "WORKING = a full, sustained squeeze with a controlled release. COMPENSATION = using the other hand to help close the grip.",
    quickStretch: "finger flexors — open the hand briskly first", isStanding: false,
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "real-object-task", title: "Real-object task",
    rung: null, tool: "automatic", unit: "task",
    instructions: "Movement embedded in a real, meaningful, familiar action — drinking from a cup, a grooming step, handling a personal object. Automatic and volitional movement dissociate: movement that won't appear on command frequently appears inside a real action, because it recruits different circuitry. Log anything spontaneous.",
    cues: [
      "Go ahead and do it as you normally would",
      "Take your time — no rush",
      "Tell me if anything felt easier than usual",
    ],
    watchFor: "WORKING = movement appearing inside the task that doesn't appear on request. COMPENSATION = the task being completed entirely by the facilitator.",
    quickStretch: "", isStanding: false,
    mediaUrl: "", defaultDualTask: false,
  },

  /* ---- Probe-only. Weekly measurement, not daily training. ---- */
  {
    id: "knee-extension-probe", title: "Knee extension — probe (inner range)",
    rung: null, tool: "stretch", unit: "attempts", probeOnly: true,
    instructions: "Supine with a rolled towel under the knee (slight bend), leg supported. One hand under the knee/roll; the other lightly over the quadriceps, or under the heel to feel it lift. This is a weekly measurement of whether anything is appearing on command, not daily training. Expect a 0 or 1 for now — that's information, not failure.",
    cues: [
      "Straighten your knee — press the back of it into the roll",
      "Make your leg long and straight",
      "Push the roll down and lift your heel",
    ],
    watchFor: "WORKING = quadriceps contraction / heel lift he starts, even a flicker. COMPENSATION = pushing the whole leg down from the hip without the knee straightening.",
    quickStretch: "quads, just above the knee", isStanding: false,
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "ankle-dorsiflexion-probe", title: "Ankle dorsiflexion — probe",
    rung: null, tool: "stretch", unit: "attempts", probeOnly: true,
    instructions: "Seated or supine, foot free of support. One hand resting lightly on top of the foot/shin — not guiding, just there to feel for movement. This is a weekly measurement of whether anything is appearing on command, not daily training. Expect a 0 or 1 for now — that's information, not failure.",
    cues: [
      "Pull your toes up towards your knee",
      "Lift the front of your foot, heel stays down",
      "Point your toes up towards the ceiling",
    ],
    watchFor: "WORKING = toes/foot lifting from the ankle, even a small flicker. COMPENSATION = the whole leg lifting from the hip, or the knee bending to substitute.",
    quickStretch: "calf — brisk lengthen into dorsiflexion", isStanding: false,
    mediaUrl: "", defaultDualTask: false,
  },
];

export const seed = () => [...seedLines(), ...seedScenes(), ...seedDecks()];

/* ---- reading & comprehension ----
   Increasing difficulty: level 1 is one literal sentence, level 4 asks for a
   light inference across a short sequence. Each question carries its own
   escalating cues (starter → fill-in → re-read the relevant line). */
export const seedReadingPassages = () => [
  {
    id: "r0", level: 1,
    text: "Priya made tea and gave a cup to her father.",
    questions: [
      { q: "Who did Priya give the tea to?", target: "Her father",
        cues: ["Think about who else is in the sentence with Priya.", "She gave it to her ___.", "Let's re-read: “…gave a cup to her father.”"] },
    ],
  },
  {
    id: "r1", level: 1,
    text: "The dog ran into the garden and barked at the cat.",
    questions: [
      { q: "What did the dog bark at?", target: "The cat",
        cues: ["Think about what else was in the garden.", "The dog barked at the ___.", "Let's re-read: “…barked at the cat.”"] },
    ],
  },
  {
    id: "r2", level: 2,
    text: "Rahul went to the market to buy vegetables. He forgot to buy onions.",
    questions: [
      { q: "Where did Rahul go?", target: "The market",
        cues: ["Think about the place mentioned first.", "Rahul went to the ___.", "Let's re-read: “Rahul went to the market…”"] },
      { q: "What did Rahul forget to buy?", target: "Onions",
        cues: ["Think about the second sentence.", "He forgot to buy ___.", "Let's re-read: “He forgot to buy onions.”"] },
    ],
  },
  {
    id: "r3", level: 2,
    text: "Meera's phone rang while she was cooking. She turned off the stove before answering it.",
    questions: [
      { q: "What was Meera doing when the phone rang?", target: "Cooking",
        cues: ["Think about the first sentence.", "She was ___ when it rang.", "Let's re-read: “…while she was cooking.”"] },
      { q: "What did she do before answering the phone?", target: "Turned off the stove",
        cues: ["Think about what happened right before she answered.", "She turned off the ___.", "Let's re-read: “She turned off the stove before answering it.”"] },
    ],
  },
  {
    id: "r4", level: 3,
    text: "It had been raining all morning, so Meera decided to carry an umbrella. By the time she reached the bus stop, the rain had stopped.",
    questions: [
      { q: "Why did Meera carry an umbrella?", target: "Because it had been raining all morning",
        cues: ["Think about the weather that morning.", "She carried it because it had been ___ all morning.", "Let's re-read: “It had been raining all morning, so Meera decided to carry an umbrella.”"] },
      { q: "Was it still raining when she reached the bus stop?", target: "No, it had stopped",
        cues: ["Think about the second sentence.", "By the bus stop, the rain had ___.", "Let's re-read: “…the rain had stopped.”"] },
    ],
  },
  {
    id: "r5", level: 3,
    text: "Arjun's train was delayed by twenty minutes. He used the extra time to call his sister and tell her he'd be late.",
    questions: [
      { q: "How long was the train delayed?", target: "Twenty minutes",
        cues: ["Think about the number mentioned.", "It was delayed by ___ minutes.", "Let's re-read: “…delayed by twenty minutes.”"] },
      { q: "Why did Arjun call his sister?", target: "To tell her he would be late",
        cues: ["Think about what he needed to tell her.", "He called to say he'd be ___.", "Let's re-read: “…tell her he'd be late.”"] },
    ],
  },
  {
    id: "r6", level: 4,
    text: "The children had been playing in the park all afternoon. When the sky turned grey, their mother called them inside, just before the first drops of rain fell.",
    questions: [
      { q: "Why did their mother call them inside?", target: "Because the sky turned grey and rain was coming",
        cues: ["Think about what changed in the sky.", "She called them in because the sky turned ___.", "Let's re-read: “When the sky turned grey, their mother called them inside.”"] },
      { q: "What happened right after they went inside?", target: "It started to rain",
        cues: ["Think about the very last part of the passage.", "Just after, the first drops of ___ fell.", "Let's re-read: “…just before the first drops of rain fell.”"] },
    ],
  },
  {
    id: "r7", level: 1,
    text: "Sameer picked up his umbrella before leaving the house.",
    questions: [
      { q: "What did Sameer pick up before leaving?", target: "His umbrella",
        cues: ["Think about what he took with him.", "He picked up his ___.", "Let's re-read: “…picked up his umbrella…”"] },
    ],
  },
  {
    id: "r8", level: 1,
    text: "The kettle whistled loudly on the stove.",
    questions: [
      { q: "What was making the loud whistle?", target: "The kettle",
        cues: ["Think about what was on the stove.", "The ___ whistled loudly.", "Let's re-read: “The kettle whistled loudly…”"] },
    ],
  },
  {
    id: "r9", level: 2,
    text: "Nina packed her lunch box and left it on the kitchen table. She forgot to take it to work.",
    questions: [
      { q: "Where did Nina leave her lunch box?", target: "On the kitchen table",
        cues: ["Think about where she put it down.", "She left it on the ___.", "Let's re-read: “…left it on the kitchen table.”"] },
      { q: "Did she take it to work?", target: "No, she forgot it",
        cues: ["Think about the second sentence.", "She forgot to ___ it.", "Let's re-read: “She forgot to take it to work.”"] },
    ],
  },
  {
    id: "r10", level: 2,
    text: "The children lined up outside the classroom. Their teacher opened the door and let them in.",
    questions: [
      { q: "Where were the children waiting?", target: "Outside the classroom",
        cues: ["Think about the first sentence.", "They lined up outside the ___.", "Let's re-read: “The children lined up outside the classroom.”"] },
      { q: "Who opened the door?", target: "Their teacher",
        cues: ["Think about who let them in.", "Their ___ opened the door.", "Let's re-read: “Their teacher opened the door…”"] },
    ],
  },
  {
    id: "r11", level: 3,
    text: "Deepa had a headache all afternoon, so she went to bed early. By morning, she felt much better.",
    questions: [
      { q: "Why did Deepa go to bed early?", target: "Because she had a headache all afternoon",
        cues: ["Think about how she was feeling that afternoon.", "She went to bed early because of her ___.", "Let's re-read: “Deepa had a headache all afternoon, so she went to bed early.”"] },
      { q: "How did she feel by morning?", target: "Much better",
        cues: ["Think about the last sentence.", "By morning she felt much ___.", "Let's re-read: “By morning, she felt much better.”"] },
    ],
  },
  {
    id: "r12", level: 3,
    text: "The power went out just as Karan was cooking dinner. He finished cooking by candlelight.",
    questions: [
      { q: "What happened while Karan was cooking?", target: "The power went out",
        cues: ["Think about the first sentence.", "The ___ went out.", "Let's re-read: “The power went out just as Karan was cooking dinner.”"] },
      { q: "How did he finish cooking?", target: "By candlelight",
        cues: ["Think about how he managed without power.", "He finished cooking by ___.", "Let's re-read: “He finished cooking by candlelight.”"] },
    ],
  },
  {
    id: "r13", level: 4,
    text: "Leela had saved money for months to buy a new bicycle. When she finally went to the shop, her favourite colour was sold out, so she chose a different one.",
    questions: [
      { q: "Why couldn't Leela buy her favourite colour?", target: "Because it was sold out",
        cues: ["Think about what had happened to that colour.", "Her favourite colour was ___.", "Let's re-read: “…her favourite colour was sold out…”"] },
      { q: "What did she do instead?", target: "She chose a different colour",
        cues: ["Think about the end of the sentence.", "So she chose a ___ one.", "Let's re-read: “…so she chose a different one.”"] },
    ],
  },
  {
    id: "r14", level: 4,
    text: "Vikram noticed dark clouds gathering as he set off for his walk. He turned back home before it started pouring.",
    questions: [
      { q: "Why did Vikram turn back home?", target: "Because he noticed dark clouds and rain was coming",
        cues: ["Think about what he saw in the sky.", "He turned back because of the dark ___.", "Let's re-read: “Vikram noticed dark clouds gathering…”"] },
      { q: "Did it rain before or after he got home?", target: "After — he got back before it started pouring",
        cues: ["Think about the order the two things happened in.", "He got home ___ it started pouring.", "Let's re-read: “He turned back home before it started pouring.”"] },
    ],
  },
  {
    id: "r15", level: 5,
    text: "Ananya had been saving for a trip to the mountains for over a year. Two weeks before she was due to leave, her manager asked her to lead an urgent project at work. She decided to postpone the trip until the project was finished.",
    questions: [
      { q: "Why did Ananya postpone her trip?", target: "Because her manager asked her to lead an urgent project",
        cues: ["Think about what came up two weeks before she was due to leave.", "She postponed it because of an urgent ___ at work.", "Let's re-read: “…her manager asked her to lead an urgent project at work.”"] },
      { q: "How long had she been saving for the trip?", target: "Over a year",
        cues: ["Think about the very first sentence.", "She had been saving for over a ___.", "Let's re-read: “Ananya had been saving for a trip to the mountains for over a year.”"] },
    ],
  },
  {
    id: "r16", level: 5,
    text: "The bridge near Farhan's house had been closed for repairs since Monday. On Thursday, he had to take a much longer route to reach the market, which made him late for an appointment.",
    questions: [
      { q: "Why did Farhan take a longer route on Thursday?", target: "Because the bridge was closed for repairs",
        cues: ["Think about what had happened to the bridge.", "He took a longer route because the bridge was ___.", "Let's re-read: “The bridge near Farhan's house had been closed for repairs since Monday.”"] },
      { q: "What was the effect of taking the longer route?", target: "He was late for an appointment",
        cues: ["Think about the end of the passage.", "It made him ___ for an appointment.", "Let's re-read: “…which made him late for an appointment.”"] },
    ],
  },
  {
    id: "r17", level: 1,
    text: "Farida turned off the lights before going to sleep.",
    questions: [
      { q: "What did Farida turn off?", target: "The lights",
        cues: ["Think about what she switched off.", "She turned off the ___.", "Let's re-read: “Farida turned off the lights…”"] },
    ],
  },
  {
    id: "r18", level: 2,
    text: "Amit filled the water bottles and put them in the fridge. He left one on the counter by mistake.",
    questions: [
      { q: "Where did Amit put most of the water bottles?", target: "In the fridge",
        cues: ["Think about the first sentence.", "He put them in the ___.", "Let's re-read: “…put them in the fridge.”"] },
      { q: "Where was the one he left by mistake?", target: "On the counter",
        cues: ["Think about the second sentence.", "He left one on the ___.", "Let's re-read: “He left one on the counter by mistake.”"] },
    ],
  },
  {
    id: "r19", level: 3,
    text: "Sunita's alarm didn't go off, so she woke up late. She skipped breakfast to reach the office on time.",
    questions: [
      { q: "Why did Sunita wake up late?", target: "Because her alarm didn't go off",
        cues: ["Think about what didn't happen that morning.", "Her ___ didn't go off.", "Let's re-read: “Sunita's alarm didn't go off, so she woke up late.”"] },
      { q: "What did she skip because of this?", target: "Breakfast",
        cues: ["Think about the second sentence.", "She skipped ___.", "Let's re-read: “She skipped breakfast to reach the office on time.”"] },
    ],
  },
  {
    id: "r20", level: 3,
    text: "The library closed early for a holiday. Rohit had to return his books the next day instead.",
    questions: [
      { q: "Why did the library close early?", target: "For a holiday",
        cues: ["Think about the first sentence.", "It closed early for a ___.", "Let's re-read: “The library closed early for a holiday.”"] },
      { q: "When did Rohit return his books?", target: "The next day",
        cues: ["Think about when he ended up going instead.", "He returned them the ___ day.", "Let's re-read: “Rohit had to return his books the next day instead.”"] },
    ],
  },
  {
    id: "r21", level: 4,
    text: "Priya's plants were wilting because she had been away for a week. She watered them as soon as she got home, and by the next day they looked fresh again.",
    questions: [
      { q: "Why were Priya's plants wilting?", target: "Because she had been away for a week and hadn't watered them",
        cues: ["Think about why nobody had watered them.", "She had been ___ for a week.", "Let's re-read: “…wilting because she had been away for a week.”"] },
      { q: "How did they look the next day?", target: "Fresh again",
        cues: ["Think about the end of the passage.", "By the next day they looked ___ again.", "Let's re-read: “…by the next day they looked fresh again.”"] },
    ],
  },
  {
    id: "r22", level: 4,
    text: "Yusuf's flight was moved to an earlier time. He had to leave for the airport before finishing his lunch.",
    questions: [
      { q: "Why did Yusuf leave before finishing lunch?", target: "Because his flight was moved to an earlier time",
        cues: ["Think about what changed about his flight.", "His flight was moved ___.", "Let's re-read: “Yusuf's flight was moved to an earlier time.”"] },
      { q: "What was he doing when he had to leave?", target: "Having lunch",
        cues: ["Think about what he hadn't finished.", "He hadn't finished his ___.", "Let's re-read: “…before finishing his lunch.”"] },
    ],
  },
  {
    id: "r23", level: 5,
    text: "Kavya had promised to help her neighbour move furniture on Saturday. On Friday night, she came down with a fever, so she called to apologise and reschedule for the following week.",
    questions: [
      { q: "Why couldn't Kavya help her neighbour on Saturday?", target: "Because she came down with a fever on Friday night",
        cues: ["Think about what happened the night before.", "She came down with a ___.", "Let's re-read: “On Friday night, she came down with a fever…”"] },
      { q: "What did she do instead of helping?", target: "She called to apologise and reschedule",
        cues: ["Think about what she did about the promise.", "She called to ___ and reschedule.", "Let's re-read: “…she called to apologise and reschedule for the following week.”"] },
    ],
  },
  {
    id: "r24", level: 6,
    text: "The office had been unusually quiet all week because most people were away for a festival. Ravi used the quiet time to finish a report that had been delayed for months. When his manager returned on Monday, she was surprised to see it already on her desk.",
    questions: [
      { q: "Why was the office quiet all week?", target: "Because most people were away for a festival",
        cues: ["Think about why fewer people were around.", "Most people were away for a ___.", "Let's re-read: “…because most people were away for a festival.”"] },
      { q: "Why was the manager surprised?", target: "Because the delayed report was already finished and on her desk when she got back",
        cues: ["Think about what she found waiting for her.", "She was surprised to see the report already ___.", "Let's re-read: “…she was surprised to see it already on her desk.”"] },
    ],
  },
];
