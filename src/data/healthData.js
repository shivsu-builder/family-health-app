// Daily tips rotate based on day of year
const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);

export const momLungTips = [
  // Set 1
  [
    "Practice diaphragmatic breathing: Lie down, place one hand on chest and one on belly. Breathe in through nose for 4 seconds, feel belly rise. Exhale slowly through pursed lips for 6 seconds. Do 3 sets of 10.",
    "Steam inhalation therapy: Boil water, add 2 drops of eucalyptus oil. Cover head with towel and inhale steam for 10 minutes. This helps open airways and clear mucus. Do this morning and evening.",
    "Lung-strengthening walk: Take a brisk 20-minute walk today. Focus on breathing in through your nose for 4 steps and out through your mouth for 6 steps. Walking in fresh air boosts lung capacity naturally."
  ],
  // Set 2
  [
    "Balloon breathing exercise: Inflate a balloon 5 times. This creates back-pressure that opens small airways and strengthens respiratory muscles. Rest 30 seconds between each inflation.",
    "Humming breath (Bhramari): Sit comfortably, close eyes. Inhale deeply, then hum 'mmm' as you exhale slowly. The vibration helps open nasal passages and relaxes airways. Repeat 10 times.",
    "Posture check: Sit up straight and roll shoulders back. Good posture allows lungs to expand fully. Set hourly reminders to check your posture. Each correction gives your lungs 20% more room to breathe."
  ],
  // Set 3
  [
    "4-7-8 Breathing technique: Inhale through nose for 4 counts, hold for 7 counts, exhale through mouth for 8 counts. This strengthens the diaphragm and increases oxygen exchange. Do 4 cycles, twice daily.",
    "Chest expansion stretch: Stand tall, interlace fingers behind your back. Lift arms while opening chest and looking up. Hold for 15 seconds, breathing deeply. Repeat 5 times. Great for lung flexibility.",
    "Anti-inflammatory foods today: Add turmeric to your milk/tea, eat a handful of walnuts, and have green leafy vegetables. These reduce airway inflammation and support lung tissue repair."
  ],
  // Set 4
  [
    "Straw breathing: Get a straw and breathe out slowly through it for as long as you can. This creates resistance that strengthens your expiratory muscles. Do 10 breaths, 3 times today.",
    "Deep coughing exercise: Take a slow deep breath, hold for 3 seconds, then cough twice - first to loosen mucus, second to move it up. This helps keep airways clear. Do 3 sets morning and evening.",
    "Ginger-tulsi tea: Boil fresh ginger slices and 5-6 tulsi leaves in water for 10 minutes. Drink warm with honey. Both ginger and tulsi are excellent bronchodilators and support lung healing."
  ],
  // Set 5
  [
    "Segmental breathing: Place hands on lower ribs. Breathe in trying to push your hands apart. This targets lower lung segments that often don't get fully ventilated. Hold 3 seconds, exhale slowly. 10 reps.",
    "Arm raises with breathing: Stand tall. Raise arms overhead as you inhale (4 seconds). Lower arms as you exhale (6 seconds). This coordinates movement with breathing and expands rib cage. Do 15 reps.",
    "Add omega-3 rich foods: Have flaxseed (alsi) in your smoothie or on salads. Omega-3 fatty acids reduce lung inflammation and improve oxygen transfer. Aim for 1 tablespoon of ground flaxseed daily."
  ],
  // Set 6
  [
    "Counting breath: Inhale and count 1-2-3-4. Exhale and count 1-2-3-4-5-6-7-8. Making exhale twice as long as inhale strengthens respiratory muscles. Gradually increase counts over weeks.",
    "Rib stretch exercise: Stand upright, cross arms over chest. Twist gently to the right while exhaling, return to center while inhaling. Repeat to the left. 10 each side. Mobilizes rib cage for better breathing.",
    "Kitchen spice remedy: Add a pinch of black pepper and turmeric to warm milk before bed. Black pepper contains piperine which enhances turmeric absorption and both have powerful anti-inflammatory effects on airways."
  ],
  // Set 7
  [
    "Incentive spirometry: If you have a spirometer, use it 10 times every 2 hours. If not, blow up a balloon or blow through a straw into water to create bubbles. Visual feedback keeps you motivated!",
    "Lion's breath (Simhasana): Kneel, hands on thighs. Inhale through nose, then open mouth wide, stick tongue out, exhale forcefully with a 'haaa' sound. Releases tension in chest and throat. Do 5 times.",
    "Hydration for lungs: Drink at least 8-10 glasses of warm water today. Well-hydrated airways have thinner mucus that's easier to clear. Add lemon for vitamin C which helps repair lung tissue."
  ]
];

export const momYogaVideos = [
  { title: "Pranayama for Lung Health - Breathing Exercises", id: "WN7-yMlKOqE", duration: "15 min" },
  { title: "Yoga for Healthy Lungs - Chest Opening Poses", id: "sTANio_2E0Q", duration: "20 min" },
  { title: "Deep Breathing Exercises to Increase Lung Capacity", id: "8VwufJrUhic", duration: "12 min" },
  { title: "Anulom Vilom & Kapalbhati - Lung Cleansing", id: "9hYmctiSiRo", duration: "18 min" },
  { title: "Gentle Yoga for Respiratory Health", id: "Nz_gH-xR9VE", duration: "25 min" },
  { title: "Breathing Exercises for Beginners", id: "DbDoBrzFRzs", duration: "10 min" },
  { title: "Complete Pranayama Routine for Lung Strength", id: "SaEHzKgBke0", duration: "22 min" },
];

export const momMotivation = [
  "Every deep breath you take is rebuilding your lung capacity. You are stronger today than yesterday!",
  "Your lungs heal a little more each day with these exercises. Small consistent steps lead to big improvements!",
  "Studies show that lung exercises can improve capacity by 10-20% in just 4-8 weeks. You're on this journey!",
  "Think of each breathing exercise as a gift to your future self. Your dedication today means easier breathing tomorrow.",
  "You're not just exercising - you're remodeling your airways. Each practice session makes them stronger and more flexible.",
  "Remember: astronauts and athletes use these same breathing techniques. You're training your lungs like an athlete!",
  "Your body has an amazing ability to heal. By doing these exercises daily, you're activating your lungs' natural repair system."
];

export const dadDiabetesData = {
  currentHbA1c: 6.2,
  targetHbA1c: 5.6,
  progressPercent: Math.round(((6.2 - 5.6) / (7.0 - 5.6)) * 100),
  estimatedTimeMonths: 6,
  indianDietSuggestions: [
    {
      meal: "Breakfast (7:00-8:00 AM)",
      good: ["Moong dal chilla with vegetables", "Besan chilla with methi", "Oats upma with vegetables", "Ragi dosa with chutney", "Sprouts salad with lemon"],
      avoid: ["White bread/toast", "Cornflakes with milk", "Poha with excess potato", "Sweet lassi", "Fruit juice"],
      portion: "1-2 medium chillas or 1 cup upma"
    },
    {
      meal: "Mid-Morning Snack (10:30 AM)",
      good: ["A handful of almonds (6-8)", "1 small guava or apple", "Buttermilk (chaas) without sugar", "Cucumber & carrot sticks", "Roasted chana (1/4 cup)"],
      avoid: ["Biscuits/cookies", "Banana", "Mango", "Packaged fruit juice", "Samosa/kachori"],
      portion: "Keep snack under 100 calories"
    },
    {
      meal: "Lunch (12:30-1:30 PM)",
      good: ["2 small roti (multigrain/bajra/jowar) + dal + sabzi", "1 cup brown rice + sambar + vegetables", "Rajma/chole with 1 roti + salad", "Mixed vegetable curry + millet roti", "Palak paneer + 1 roti + raita"],
      avoid: ["White rice more than 1 cup", "Fried foods (pakora, vada)", "Excess potato in sabzi", "More than 2 rotis of white flour", "Sweet dal preparations"],
      portion: "Half plate vegetables, quarter protein, quarter carbs"
    },
    {
      meal: "Evening Snack (4:00-5:00 PM)",
      good: ["Green tea with 2-3 walnuts", "Sprout chaat with lemon", "Roasted makhana (1/4 cup)", "Dhokla (2 pieces)", "Vegetable soup"],
      avoid: ["Tea with sugar + biscuits", "Samosa/pakora", "Chakli/namkeen", "Sweet chai", "Bread pakora"],
      portion: "Light - under 100-150 calories"
    },
    {
      meal: "Dinner (7:00-8:00 PM)",
      good: ["Grilled paneer with vegetables", "Moong dal khichdi with ghee", "Vegetable soup + 1 multigrain roti", "Tofu/paneer bhurji + salad", "Methi thepla (2 small) + curd"],
      avoid: ["Heavy curries with cream", "White rice at night", "Naan/kulcha", "Late night eating after 9 PM", "Sweets/mithai"],
      portion: "Eat lighter than lunch, finish by 8 PM"
    }
  ],
  exercisePlan: [
    { activity: "Brisk Walking", duration: "30 min", frequency: "Daily", timing: "After dinner (30 min gap)", benefit: "Lowers blood sugar by 30-50 mg/dL post-meal" },
    { activity: "Light Yoga/Stretching", duration: "20 min", frequency: "Daily", timing: "Morning", benefit: "Reduces cortisol which raises blood sugar" },
    { activity: "Resistance Training", duration: "20 min", frequency: "3x/week", timing: "Alternate days", benefit: "Muscles use glucose better for 24-48 hours" },
    { activity: "Cycling/Swimming", duration: "30 min", frequency: "2-3x/week", timing: "Morning or evening", benefit: "Improves insulin sensitivity by 20-30%" },
  ],
  sugarTracker: {
    fasting: { target: "80-100 mg/dL", current: "110-125 mg/dL" },
    postMeal: { target: "<140 mg/dL", current: "160-180 mg/dL" },
    hba1c: { target: "5.6%", current: "6.2%" }
  }
};

export const dadHeartData = {
  calciumScore: 13.1,
  plaque: "20-40% soft plaque",
  medication: "40mg Atorvastatin",
  riskLevel: "Low-Moderate",
  doList: [
    "Take Atorvastatin at night consistently - statins work best when liver produces most cholesterol (during sleep)",
    "Eat heart-healthy fats: olive oil, avocado, walnuts, flaxseed, and fatty fish (salmon/mackerel twice a week)",
    "Exercise 150 minutes/week moderate intensity - walking, cycling, swimming - to raise HDL and lower LDL",
    "Eat fiber-rich foods: oats, barley, beans, fruits - soluble fiber binds cholesterol in the gut",
    "Manage stress with daily meditation or deep breathing - cortisol promotes plaque formation",
    "Monitor blood pressure regularly - keep below 130/80 with Valsartan and lifestyle",
    "Get 7-8 hours of quality sleep - poor sleep increases inflammatory markers that worsen plaque",
    "Eat 2-3 cloves of raw garlic daily (or aged garlic supplement) - shown to reduce plaque progression",
    "Add CoQ10 supplement (100-200mg) - statins deplete CoQ10 which is vital for heart energy",
    "Keep LDL cholesterol below 70 mg/dL with the statin + diet combination"
  ],
  dontList: [
    "Do NOT skip statin doses - consistent use is key to plaque stabilization",
    "Avoid trans fats completely - found in packaged snacks, margarine, fried foods",
    "Limit saturated fat - reduce ghee, butter, full-fat dairy, red meat",
    "No smoking or secondhand smoke exposure - damages artery walls and accelerates plaque",
    "Avoid excessive salt - keep under 1500mg/day to manage blood pressure",
    "Don't eat grapefruit - it interferes with Atorvastatin metabolism",
    "Avoid excessive alcohol - increases triglycerides and blood pressure",
    "Don't ignore symptoms like chest tightness, breathlessness, or unusual fatigue",
    "Avoid very heavy exercise (like heavy weightlifting) without doctor clearance",
    "Don't rely solely on medication - lifestyle changes are equally important"
  ],
  dailyTips: [
    "Heart Tip: Start meals with a salad. Eating vegetables first slows sugar absorption and reduces post-meal inflammation that can affect your arteries.",
    "Heart Tip: Take a 10-minute walk after each meal. Post-meal walking reduces blood sugar spikes that contribute to plaque formation.",
    "Heart Tip: Add 1 tablespoon of ground flaxseed to your morning meal. It's rich in omega-3 ALA which helps reduce arterial inflammation.",
    "Heart Tip: Practice the 4-7-8 breathing technique before bed. Reducing stress hormones helps prevent further plaque buildup.",
    "Heart Tip: Eat a handful of walnuts (7-8 halves) daily. Studies show they improve artery flexibility and reduce LDL cholesterol.",
    "Heart Tip: Have 2 cups of green tea daily. The catechins help prevent LDL oxidation which is a key step in plaque formation.",
    "Heart Tip: Include garlic in your cooking daily. Allicin in garlic has been shown to help dissolve soft plaque over time."
  ],
  weeklyPlan: {
    exercise: [
      { day: "Monday", activity: "Brisk walk 30 min + light yoga 15 min", focus: "Cardiovascular" },
      { day: "Tuesday", activity: "Swimming or cycling 30 min", focus: "Aerobic fitness" },
      { day: "Wednesday", activity: "Walk 30 min + resistance bands 20 min", focus: "Strength + cardio" },
      { day: "Thursday", activity: "Rest or gentle stretching 20 min", focus: "Recovery" },
      { day: "Friday", activity: "Brisk walk 30 min + pranayama 15 min", focus: "Heart + stress" },
      { day: "Saturday", activity: "Cycling or swimming 30 min + yoga 20 min", focus: "Full body" },
      { day: "Sunday", activity: "Family walk 30 min + meditation 15 min", focus: "Active recovery" }
    ],
    diet: {
      morning: "Warm lemon water + 2 soaked walnuts + 4 almonds",
      breakfast: "Oats with flaxseed OR Ragi dosa OR Moong dal chilla",
      midMorning: "Green tea + 1 fruit (apple/guava)",
      lunch: "Millet roti + dal + green vegetable + salad",
      snack: "Buttermilk OR roasted makhana OR sprouts",
      dinner: "Light khichdi OR vegetable soup + 1 roti (by 7:30 PM)",
      bedtime: "Turmeric milk (without sugar)"
    }
  }
};

export const dadMedications = {
  current: [
    { name: "Atorvastatin", dose: "40mg", timing: "Night", purpose: "Cholesterol/plaque management" },
    { name: "Valsartan", dose: "80mg", timing: "Morning", purpose: "Blood pressure control" },
    { name: "Metamucil/Psyllium Husk", dose: "1 tsp", timing: "Before bed with water", purpose: "Constipation relief + cholesterol binding" }
  ],
  suggestedSupplements: [
    { name: "CoQ10 (Ubiquinol)", dose: "100-200mg", timing: "With breakfast", reason: "Statins deplete CoQ10; vital for heart energy and muscle health", priority: "High" },
    { name: "Omega-3 Fish Oil", dose: "1000-2000mg EPA+DHA", timing: "With meals", reason: "Reduces triglycerides, inflammation, and supports heart health", priority: "High" },
    { name: "Magnesium Glycinate", dose: "200-400mg", timing: "Evening/bedtime", reason: "Supports heart rhythm, blood pressure, blood sugar control, and helps with constipation", priority: "High" },
    { name: "Vitamin D3", dose: "2000-4000 IU", timing: "With breakfast (fat-containing meal)", reason: "Most Indians are deficient; supports heart, bones, and immune health", priority: "High" },
    { name: "Vitamin K2 (MK-7)", dose: "100-200mcg", timing: "With Vitamin D3", reason: "Directs calcium to bones and away from arteries - critical for reducing calcification", priority: "High" },
    { name: "B-Complex", dose: "1 tablet", timing: "Morning", reason: "Supports energy, nerve health, and helps metabolize homocysteine (heart risk factor)", priority: "Medium" },
    { name: "Berberine", dose: "500mg", timing: "Before meals, 2x daily", reason: "Natural blood sugar reducer, shown to lower HbA1c by 0.5-1% in studies", priority: "Medium" },
    { name: "Aged Garlic Extract", dose: "600-1200mg", timing: "With meals", reason: "Studies show it can reduce soft plaque and lower blood pressure", priority: "Medium" },
    { name: "Psyllium Husk (Isabgol)", dose: "1-2 tsp", timing: "Before bed with warm water", reason: "Already taking - helps constipation AND reduces cholesterol absorption by 5-10%", priority: "Current" },
    { name: "Probiotics", dose: "10-20 billion CFU", timing: "Morning, empty stomach", reason: "Gut health affects heart health and helps with constipation", priority: "Medium" }
  ],
  importantNotes: [
    "Always consult your doctor before starting any new supplement, especially with existing medications",
    "Take CoQ10 at least 2 hours apart from Atorvastatin for best absorption",
    "Vitamin K2 is essential when taking Vitamin D3 to prevent calcium depositing in arteries",
    "Berberine should not be taken with Metformin if prescribed in future (similar mechanism)",
    "Monitor for muscle pain/weakness - a known side effect of statins, CoQ10 helps prevent this"
  ]
};

export const dadYoutubeVideos = [
  { title: "Heart Health: Reversing Plaque Build-up", id: "WDnCfpJFpIk", duration: "14 min" },
  { title: "Best Exercises for Heart Health", id: "njeZ29umqVE", duration: "20 min" },
  { title: "Indian Diet Plan for Diabetes Control", id: "yotYZGJqMbM", duration: "15 min" },
  { title: "Yoga for Heart Health - Complete Routine", id: "tEmt1Znux58", duration: "25 min" },
  { title: "How to Lower HbA1c Naturally", id: "5NlEGOCdPBo", duration: "12 min" },
  { title: "Coronary Calcium Score Explained", id: "2VKYQ8-6Kds", duration: "10 min" },
  { title: "Managing Blood Pressure Naturally", id: "K-TW2Chpz4k", duration: "18 min" },
];

export const daughterData = {
  age: 14,
  heightGrowth: {
    tips: [
      "Sleep 8-10 hours every night - Growth hormone (GH) is released primarily during deep sleep, especially between 10 PM and 2 AM",
      "Maintain excellent posture - Slouching can make you appear shorter and compress your spine. Practice standing tall against a wall for 5 min daily",
      "Do stretching exercises daily - Hanging from a bar, cobra pose, and cat-camel stretch help decompress the spine",
      "Swimming is excellent for height - The horizontal position reduces gravitational compression on the spine and stretches the whole body",
      "Eat protein-rich foods - Protein provides amino acids essential for growth hormone production and bone development",
      "Get adequate Vitamin D - Spend 15-20 min in morning sunlight. Vitamin D is crucial for calcium absorption and bone growth",
      "Stay active with sports - Basketball, volleyball, skipping rope, and badminton involve jumping which stimulates growth plates"
    ],
    foods: [
      { category: "Protein-Rich", items: ["Eggs (2/day)", "Paneer/Tofu", "Dal & Lentils", "Chicken/Fish", "Greek Yogurt", "Sprouts"], why: "Building blocks for growth hormone and bones" },
      { category: "Calcium-Rich", items: ["Milk (2 glasses)", "Curd/Yogurt", "Cheese", "Ragi", "Sesame seeds", "Almonds"], why: "Essential for bone density and growth" },
      { category: "Vitamin D", items: ["Morning sunlight", "Egg yolks", "Fortified milk", "Mushrooms", "Fatty fish"], why: "Enables calcium absorption" },
      { category: "Zinc-Rich", items: ["Pumpkin seeds", "Cashews", "Chickpeas", "Dark chocolate", "Oats"], why: "Zinc deficiency stunts growth" },
      { category: "Vitamin A & C", items: ["Carrots", "Sweet potato", "Oranges", "Amla", "Bell peppers", "Mangoes"], why: "Support bone growth and immune health" }
    ],
    supplements: [
      { name: "Vitamin D3", dose: "1000-2000 IU", note: "Most teenagers are deficient, get levels checked" },
      { name: "Calcium", dose: "500-1000mg", note: "If dietary calcium is insufficient" },
      { name: "Multivitamin", dose: "Age-appropriate", note: "Fills nutritional gaps during growth phase" },
      { name: "Zinc", dose: "8-11mg", note: "Important for growth hormone production" },
      { name: "Ashwagandha", dose: "300mg", note: "Studies suggest it may support growth in adolescents (consult doctor)" }
    ],
    exercises: [
      { name: "Hanging exercises", duration: "3-5 min", frequency: "Daily", description: "Hang from a pull-up bar. Decompresses spine and stretches muscles." },
      { name: "Skipping/Jump rope", duration: "15 min", frequency: "Daily", description: "Jumping stimulates growth plates in legs." },
      { name: "Swimming", duration: "30-45 min", frequency: "3-4x/week", description: "Full body stretch in zero gravity environment." },
      { name: "Cobra stretch", duration: "5 min", frequency: "Daily", description: "Lie face down, push upper body up. Stretches spine." },
      { name: "Basketball/Volleyball", duration: "30 min", frequency: "3-4x/week", description: "Jumping sports excellent for growth stimulation." }
    ]
  },
  mentalFocus: {
    meditationGuide: [
      { name: "Mindful Breathing", duration: "5 min", description: "Sit comfortably, focus only on your breath. When mind wanders, gently bring attention back. Start with 5 min, build to 15 min." },
      { name: "Body Scan", duration: "10 min", description: "Lie down, mentally scan from toes to head, noticing sensations. Releases tension and builds body awareness." },
      { name: "Trataka (Candle Gazing)", duration: "5 min", description: "Stare at a candle flame without blinking for 1-2 min, then close eyes and visualize. Improves concentration dramatically." },
      { name: "Gratitude Meditation", duration: "5 min", description: "Think of 3 things you're grateful for. Visualize each one. This rewires the brain for positivity and focus." },
    ],
    focusTips: [
      "Use the Pomodoro technique: Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a 15-minute break.",
      "Remove phone from study area. Even a phone face-down reduces cognitive capacity by 10%.",
      "Practice single-tasking: Do one thing at a time. Multitasking reduces IQ by 10-15 points temporarily.",
      "Exercise before study sessions - even 10 minutes of jumping jacks increases focus for 2 hours.",
      "Eat brain foods: Walnuts, blueberries, dark chocolate, and eggs contain nutrients that boost concentration.",
      "Stay hydrated - even mild dehydration (1-2%) reduces attention span and memory by 10%.",
      "Use the 'two-minute rule': If something takes less than 2 minutes, do it immediately instead of procrastinating."
    ],
    apps: [
      { name: "Headspace", purpose: "Guided meditation designed for teens" },
      { name: "Forest", purpose: "Stay focused by growing virtual trees (no phone use)" },
      { name: "Insight Timer", purpose: "Free meditation timer with guided sessions" }
    ]
  }
};

export const sonData = {
  age: 8,
  heightGrowth: {
    tips: [
      "Ensure 10-11 hours of sleep every night - Growth hormone peaks during deep sleep. Bedtime by 8:30-9:00 PM is ideal.",
      "Make physical play a priority - Running, jumping, climbing, and playing actively for at least 60 minutes daily stimulates growth plates.",
      "Good nutrition is the foundation - A balanced diet with adequate protein, calcium, and vitamins is essential during this rapid growth phase.",
      "Limit screen time to 1-2 hours - Excessive sitting slows growth. Encourage active play instead.",
      "Regular stretching and yoga - Simple poses like mountain pose, tree pose, and forward bends promote good posture and flexibility.",
      "Outdoor play in sunlight - Natural vitamin D from 20-30 minutes of sunlight daily is crucial for bone growth.",
      "Stay well-hydrated - Water supports all growth processes. Aim for 5-6 glasses of water daily."
    ],
    dailyRoutine: {
      morning: [
        "7:00 AM - Wake up, drink warm water",
        "7:15 AM - Simple stretches: reach for sky (10x), touch toes (10x), jump in place (20x)",
        "7:30 AM - Nutritious breakfast with protein + calcium",
      ],
      afterSchool: [
        "4:00 PM - Healthy snack (fruit + nuts)",
        "4:30 PM - Active outdoor play: running, cycling, sports (45-60 min)",
        "5:30 PM - Homework time",
      ],
      evening: [
        "7:00 PM - Dinner with family (balanced meal)",
        "7:30 PM - Light activity or family walk (15 min)",
        "8:00 PM - Reading/quiet time, warm milk with turmeric",
        "8:30 PM - Bedtime (10+ hours sleep target)"
      ]
    },
    foods: [
      { category: "Must-Have Daily", items: ["2 glasses milk", "1-2 eggs", "Curd/yogurt", "1 fruit", "Green vegetables"], emoji: "star" },
      { category: "Protein Power", items: ["Dal/lentils", "Paneer", "Chicken/fish", "Sprouts", "Soy chunks", "Peanut butter"], emoji: "muscle" },
      { category: "Bone Builders", items: ["Ragi porridge", "Cheese", "Almonds", "Sesame seeds (til)", "Broccoli", "Oranges"], emoji: "bone" },
      { category: "Energy Foods", items: ["Banana", "Sweet potato", "Oats", "Whole wheat roti", "Brown rice", "Dry fruits"], emoji: "energy" },
      { category: "Brain & Growth", items: ["Walnuts", "Ghee (moderate)", "Flaxseeds", "Amla", "Spinach", "Carrots"], emoji: "brain" }
    ],
    funActivities: [
      { name: "Monkey Bars / Hanging", benefit: "Stretches spine and shoulders", duration: "5-10 min daily" },
      { name: "Skipping Rope", benefit: "Leg bone stimulation through jumping", duration: "10-15 min daily" },
      { name: "Swimming", benefit: "Full body stretch in water", duration: "30 min, 2-3x/week" },
      { name: "Basketball/Badminton", benefit: "Jumping and reaching movements", duration: "30 min, 3-4x/week" },
      { name: "Cycling", benefit: "Leg strengthening and endurance", duration: "20-30 min daily" },
      { name: "Stretching Games", benefit: "Flexibility and posture", duration: "10 min daily" }
    ],
    supplements: [
      { name: "Multivitamin (kids)", dose: "1 gummy/tablet daily", note: "Fills nutritional gaps" },
      { name: "Vitamin D3", dose: "600-1000 IU", note: "Essential for bone growth, especially in winter" },
      { name: "Calcium", dose: "500mg", note: "If not getting enough dairy" },
      { name: "DHA/Omega-3", dose: "200-300mg", note: "Supports brain development and overall growth" }
    ]
  }
};

export const getTodayTipIndex = () => dayOfYear % momLungTips.length;
export const getTodayVideoIndex = () => dayOfYear % momYogaVideos.length;
export const getTodayMotivation = () => momMotivation[dayOfYear % momMotivation.length];
export const getTodayHeartTip = () => dadHeartData.dailyTips[dayOfYear % dadHeartData.dailyTips.length];
export const getTodayDadVideo = () => dadYoutubeVideos[dayOfYear % dadYoutubeVideos.length];

// Chatbot knowledge base
export const healthFAQ = [
  { q: "lung exercise", a: "For lung health, the best exercises are: 1) Diaphragmatic breathing - breathe from your belly, 2) Pursed-lip breathing - inhale through nose, exhale slowly through pursed lips, 3) Pranayama - especially Anulom Vilom and Kapalbhati, 4) Cardiovascular exercise like brisk walking. Practice these for 15-20 minutes daily." },
  { q: "diabetes diet indian", a: "For managing diabetes with an Indian diet: Replace white rice with brown rice or millets (bajra, jowar, ragi). Use multigrain atta instead of maida. Include methi (fenugreek) in rotis. Eat plenty of green vegetables, dal, and salads. Avoid: sugar, white bread, potato-heavy dishes, fruit juices, and sweets." },
  { q: "hba1c reduce", a: "To reduce HbA1c from 6.2 to 5.6: 1) Follow a low glycemic index diet, 2) Exercise daily - 30 min walking after meals, 3) Reduce refined carbs, 4) Increase fiber intake, 5) Manage stress, 6) Get quality sleep, 7) Consider supplements like berberine and cinnamon. This typically takes 3-6 months of consistent effort." },
  { q: "calcium score plaque", a: "A calcium score of 13.1 is low and manageable. Combined with 20-40% soft plaque, the approach should be: 1) Continue Atorvastatin religiously, 2) Keep LDL below 70, 3) Take Vitamin K2 (directs calcium away from arteries), 4) Exercise regularly, 5) Anti-inflammatory diet, 6) Manage stress and sleep well." },
  { q: "height growth teen", a: "For teenage height growth: 1) Sleep 8-10 hours (growth hormone releases during sleep), 2) Eat protein-rich foods and calcium, 3) Exercise - hanging, swimming, jumping sports, 4) Good posture, 5) Vitamin D from sunlight, 6) Stay hydrated, 7) Avoid junk food that may have hormonal effects." },
  { q: "height growth child", a: "For children's height growth: 1) 10-11 hours sleep, 2) Active play 60+ min daily, 3) Balanced nutrition with milk, eggs, fruits, 4) Outdoor play for Vitamin D, 5) Limit screen time, 6) Swimming and jumping activities, 7) Regular health check-ups to track growth trajectory." },
  { q: "meditation focus", a: "For improving mental focus: 1) Start with 5 min mindful breathing daily, gradually increase, 2) Try Trataka (candle gazing) for concentration, 3) Use Pomodoro technique for study, 4) Remove distractions, 5) Exercise before study sessions, 6) Eat brain foods - walnuts, blueberries, dark chocolate, 7) Stay hydrated." },
  { q: "blood pressure valsartan", a: "Valsartan 80mg is an ARB that blocks angiotensin II to relax blood vessels. To support it: 1) Reduce sodium to <1500mg/day, 2) Eat potassium-rich foods (banana, coconut water), 3) Exercise regularly, 4) Manage stress, 5) Limit caffeine, 6) Monitor BP at home regularly. Never skip doses." },
  { q: "constipation psyllium", a: "For constipation management: 1) Continue psyllium husk daily (1-2 tsp in warm water before bed), 2) Drink 8-10 glasses of water daily, 3) Add magnesium glycinate at night, 4) Eat fiber: fruits, vegetables, whole grains, 5) Regular exercise stimulates bowel motility, 6) Try probiotic foods like curd and yogurt." },
  { q: "supplements vitamins", a: "Key supplements for overall health: 1) Vitamin D3 (2000-4000 IU) - most Indians are deficient, 2) Omega-3 fish oil, 3) Magnesium glycinate, 4) CoQ10 (especially with statin use), 5) Vitamin K2 (with D3 for calcium direction), 6) B-Complex, 7) Probiotics. Always consult your doctor before starting." },
];
