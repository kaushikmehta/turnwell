import { DECK_RUNGS, DECK_CHEER } from "./constants";

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

/* ---- picture decks ---- */
const ph = (bg, label) => `https://placehold.co/1000x700/${bg}/FFFFFF?text=${label}`;

export const seedDecks = () => ([
  {
    id: "dk0", type: "deck", area: "Describing a scene", level: 2, approved: true,
    rung_labels: DECK_RUNGS, encouragement_every: 4, encouragement: DECK_CHEER,
    cards: [
      { theme: "cars", image_url: ph("BC7A45", "Red+race+car"), fill_blank: "The red car is ___ the race.", model_example: "A red race car is speeding around the track. The driver is winning the race, and the crowd is cheering." },
      { theme: "cars", image_url: ph("BC7A45", "Classic+vintage+car"), fill_blank: "This old car is ___.", model_example: "This is an old classic car. It is shiny and blue, and it looks very expensive." },
      { theme: "cars", image_url: ph("BC7A45", "Man+refuelling+car"), fill_blank: "The man is ___ his car.", model_example: "A man is filling his car with petrol. He is standing at the pump, and he looks like he is in a hurry." },
      { theme: "cars", image_url: ph("BC7A45", "Cars+in+a+traffic+jam"), fill_blank: "The cars are ___ in traffic.", model_example: "The cars are stuck in a traffic jam. Nothing is moving, and the drivers look frustrated." },
      { theme: "cars", image_url: ph("BC7A45", "Mechanic+under+the+bonnet"), fill_blank: "The mechanic is ___ the car.", model_example: "A mechanic is fixing the car. He is under the bonnet, checking the engine with his tools." },
    ],
  },
  {
    id: "dk1", type: "deck", area: "Describing a scene", level: 2, approved: true,
    rung_labels: DECK_RUNGS, encouragement_every: 4, encouragement: DECK_CHEER,
    cards: [
      { theme: "sport", image_url: ph("3E6B5E", "Footballer+at+goal"), fill_blank: "The player is ___ the ball.", model_example: "A footballer is kicking the ball towards the goal. He is trying to score, and the goalkeeper is diving to save it." },
      { theme: "sport", image_url: ph("3E6B5E", "Tennis+player+serving"), fill_blank: "The woman is ___ the ball.", model_example: "A woman is serving the ball in a tennis match. She has thrown the ball up high and is about to hit it hard." },
      { theme: "sport", image_url: ph("3E6B5E", "Fans+celebrating"), fill_blank: "The fans are ___.", model_example: "The fans are celebrating in the stadium. They are cheering and waving their scarves because their team just scored." },
      { theme: "sport", image_url: ph("3E6B5E", "Runner+at+finish+line"), fill_blank: "The runner is ___ the race.", model_example: "A runner is crossing the finish line. She has won the race, and she looks exhausted but happy." },
      { theme: "sport", image_url: ph("3E6B5E", "Basketball+player+shooting"), fill_blank: "The player is ___ the ball into the basket.", model_example: "A basketball player is shooting the ball. He has jumped high into the air, aiming for the basket." },
    ],
  },
  {
    id: "dk2", type: "deck", area: "Describing a scene", level: 3, approved: true,
    rung_labels: DECK_RUNGS, encouragement_every: 4, encouragement: DECK_CHEER,
    cards: [
      { theme: "film", image_url: ph("2E5245", "Cinema+and+popcorn"), fill_blank: "The man is ___ a film.", model_example: "A man is sitting in the cinema, watching a film. He is holding a big box of popcorn, and the screen is bright in front of him." },
      { theme: "film", image_url: ph("2E5245", "Actor+on+red+carpet"), fill_blank: "The actor is ___ on the red carpet.", model_example: "An actor is posing on the red carpet. Cameras are flashing everywhere, and she is smiling for the photographers." },
      { theme: "film", image_url: ph("2E5245", "Director+behind+camera"), fill_blank: "The director is ___ the scene.", model_example: "The director is filming a scene. He is sitting behind the camera, telling the actors what to do." },
      { theme: "film", image_url: ph("2E5245", "Bright+cinema+screen"), fill_blank: "The cinema screen is ___.", model_example: "The cinema screen is huge and bright. The room is dark, and everyone is watching quietly." },
      { theme: "film", image_url: ph("2E5245", "Clapperboard+on+set"), fill_blank: "They are ___ a movie.", model_example: "They are making a movie on set. Someone is holding a clapperboard, ready to start the next take." },
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
  {
    id: "knee-extension-evoke", title: "Knee extension — evoke (inner range)", kind: "initiation",
    instructions: "Supine with a rolled towel under the knee (slight bend), leg supported. One hand under the knee/roll; the other lightly over the quadriceps, or under the heel to feel it lift.",
    cues: [
      "Straighten your knee — press the back of it into the roll",
      "Make your leg long and straight",
      "Push the roll down and lift your heel",
    ],
    watchFor: "WORKING = quadriceps contraction / heel lift he starts, even a flicker. COMPENSATION = pushing the whole leg down from the hip without the knee straightening.",
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "ankle-dorsiflexion-evoke", title: "Ankle dorsiflexion — evoke", kind: "initiation",
    instructions: "Seated or supine, foot free of support. One hand resting lightly on top of the foot/shin — not guiding, just there to feel for movement.",
    cues: [
      "Pull your toes up towards your knee",
      "Lift the front of your foot, heel stays down",
      "Point your toes up towards the ceiling",
    ],
    watchFor: "WORKING = toes/foot lifting from the ankle, even a small flicker. COMPENSATION = the whole leg lifting from the hip, or the knee bending to substitute.",
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "seated-weight-shifts", title: "Seated weight-shifts", kind: "strength",
    instructions: "Seated on a firm surface, feet flat, hands resting on thighs. Sit beside or behind for light contact guarding at the hips.",
    cues: [
      "Shift your weight over to your right",
      "Now come back to the middle",
      "Shift over to your left, and back to the middle",
    ],
    watchFor: "WORKING = a controlled weight transfer through the pelvis with the trunk staying upright. COMPENSATION = leaning/collapsing sideways from the shoulders, or propping on the arms.",
    mediaUrl: "", defaultDualTask: true,
  },
  {
    id: "trunk-rotation-reach", title: "Trunk rotation — reach-outs", kind: "strength",
    instructions: "Seated, an object placed just outside reach to one side (e.g. the AC remote). Guard at the trunk if needed.",
    cues: [
      "Reach out and pick it up",
      "Turn and reach — keep your bottom on the seat",
      "Bring it back to the middle",
    ],
    watchFor: "WORKING = rotation through the trunk with a controlled reach and return. COMPENSATION = standing up to reach, or overbalancing without catching himself.",
    mediaUrl: "", defaultDualTask: true,
  },
  {
    id: "arm-reach-to-target", title: "Arm reach to target", kind: "strength",
    instructions: "Seated, a cup or object placed at arm's length. Support at the elbow if needed.",
    cues: [
      "Reach your hand out to the cup",
      "Stretch all the way — straighten your elbow",
      "Bring it back slowly",
    ],
    watchFor: "WORKING = a controlled reach-and-return with the elbow extending. COMPENSATION = the trunk leaning forward to substitute for arm reach.",
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "grip-squeeze", title: "Grip squeeze", kind: "strength",
    instructions: "A rolled towel or soft ball placed in the hand.",
    cues: [
      "Squeeze it as hard as you can",
      "Hold it",
      "Now let go slowly",
    ],
    watchFor: "WORKING = a full, sustained squeeze with a controlled release. COMPENSATION = using the other hand to help close the grip.",
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "tram-weight-bearing", title: "TRAM weight-bearing", kind: "strength",
    instructions: "In the TRAM, feet flat and hip-width apart, harness supporting his weight.",
    cues: [
      "Push down through both feet",
      "Stand up tall",
      "Hold — feel your legs taking the weight",
    ],
    watchFor: "WORKING = an active push through the legs with the knees not buckling. COMPENSATION = hanging in the harness with no active push.",
    mediaUrl: "", defaultDualTask: false,
  },
  {
    id: "tram-knee-lock", title: "TRAM knee-lock hold", kind: "initiation",
    instructions: "In the TRAM, standing supported.",
    cues: [
      "Straighten your knees",
      "Lock them — feel them go straight",
      "Hold it there",
    ],
    watchFor: "WORKING = active knee extension held without support. COMPENSATION = the knees staying bent, or buckling under load.",
    mediaUrl: "", defaultDualTask: false,
  },
];

export const seed = () => [...seedLines(), ...seedScenes(), ...seedDecks()];
