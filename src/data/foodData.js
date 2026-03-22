// Indian food GI (Glycemic Index) database
// GI: how fast food raises blood sugar (0-100, lower is better)
// servingCarbs: grams of carbs in one serving

export const indianFoods = {
  grains: [
    { id: 'white_rice',     name: 'White Rice',          gi: 73, servingCarbs: 45, unit: '1 cup cooked' },
    { id: 'brown_rice',     name: 'Brown Rice',          gi: 55, servingCarbs: 45, unit: '1 cup cooked' },
    { id: 'basmati_rice',   name: 'Basmati Rice',        gi: 58, servingCarbs: 45, unit: '1 cup cooked' },
    { id: 'white_roti',     name: 'White Roti',          gi: 62, servingCarbs: 15, unit: '1 medium' },
    { id: 'multigrain_roti',name: 'Multigrain Roti',     gi: 45, servingCarbs: 14, unit: '1 medium' },
    { id: 'bajra_roti',     name: 'Bajra Roti',          gi: 54, servingCarbs: 12, unit: '1 medium' },
    { id: 'jowar_roti',     name: 'Jowar Roti',          gi: 50, servingCarbs: 12, unit: '1 medium' },
    { id: 'ragi_roti',      name: 'Ragi Roti',           gi: 68, servingCarbs: 20, unit: '1 medium' },
    { id: 'oats',           name: 'Oats (cooked)',       gi: 55, servingCarbs: 27, unit: '1 cup' },
    { id: 'poha',           name: 'Poha',                gi: 76, servingCarbs: 35, unit: '1 cup' },
    { id: 'upma',           name: 'Upma (semolina)',     gi: 65, servingCarbs: 28, unit: '1 cup' },
    { id: 'idli',           name: 'Idli (2 pieces)',     gi: 70, servingCarbs: 30, unit: '2 pcs' },
    { id: 'dosa',           name: 'Plain Dosa',          gi: 67, servingCarbs: 28, unit: '1 medium' },
    { id: 'bread_white',    name: 'White Bread',         gi: 75, servingCarbs: 30, unit: '2 slices' },
    { id: 'paratha',        name: 'Plain Paratha',       gi: 62, servingCarbs: 30, unit: '1 medium' },
    { id: 'moong_chilla',   name: 'Moong Dal Chilla',    gi: 35, servingCarbs: 18, unit: '1 medium' },
    { id: 'besan_chilla',   name: 'Besan Chilla',        gi: 35, servingCarbs: 18, unit: '1 medium' },
  ],
  legumes: [
    { id: 'dal',            name: 'Dal (any)',           gi: 30, servingCarbs: 20, unit: '1 cup' },
    { id: 'moong_dal',      name: 'Moong Dal',           gi: 25, servingCarbs: 18, unit: '1 cup' },
    { id: 'rajma',          name: 'Rajma',               gi: 29, servingCarbs: 40, unit: '1 cup' },
    { id: 'chole',          name: 'Chole (Chickpeas)',   gi: 33, servingCarbs: 45, unit: '1 cup' },
    { id: 'sprouts',        name: 'Sprouts',             gi: 25, servingCarbs: 15, unit: '1 cup' },
    { id: 'sambar',         name: 'Sambar',              gi: 35, servingCarbs: 15, unit: '1 cup' },
    { id: 'kadhi',          name: 'Kadhi',               gi: 40, servingCarbs: 12, unit: '1 cup' },
  ],
  vegetables: [
    { id: 'potato',         name: 'Potato (aloo)',       gi: 78, servingCarbs: 15, unit: '1 medium' },
    { id: 'sweet_potato',   name: 'Sweet Potato',        gi: 63, servingCarbs: 20, unit: '1 medium' },
    { id: 'carrot',         name: 'Carrot (gajar)',      gi: 35, servingCarbs: 6,  unit: '1 medium' },
    { id: 'green_veg',      name: 'Green Leafy Veg',     gi: 15, servingCarbs: 3,  unit: '1 cup' },
    { id: 'bhindi',         name: 'Bhindi (Okra)',       gi: 20, servingCarbs: 7,  unit: '1 cup' },
    { id: 'brinjal',        name: 'Brinjal (Baingan)',   gi: 15, servingCarbs: 6,  unit: '1 cup' },
    { id: 'peas',           name: 'Peas (matar)',        gi: 48, servingCarbs: 14, unit: '1/2 cup' },
    { id: 'tomato',         name: 'Tomato',              gi: 15, servingCarbs: 4,  unit: '2 medium' },
    { id: 'corn',           name: 'Corn (bhutta)',       gi: 52, servingCarbs: 21, unit: '1 cob' },
  ],
  dairy: [
    { id: 'milk',           name: 'Milk (full fat)',     gi: 37, servingCarbs: 12, unit: '1 glass' },
    { id: 'milk_skim',      name: 'Milk (skimmed)',      gi: 32, servingCarbs: 12, unit: '1 glass' },
    { id: 'curd',           name: 'Curd / Yogurt',       gi: 36, servingCarbs: 12, unit: '1 cup' },
    { id: 'buttermilk',     name: 'Buttermilk (Chaas)',  gi: 35, servingCarbs: 5,  unit: '1 glass' },
    { id: 'paneer',         name: 'Paneer (100g)',       gi: 27, servingCarbs: 3,  unit: '100g' },
    { id: 'lassi_sweet',    name: 'Sweet Lassi',         gi: 60, servingCarbs: 30, unit: '1 glass' },
    { id: 'lassi_salted',   name: 'Salted Lassi',        gi: 35, servingCarbs: 8,  unit: '1 glass' },
  ],
  fruits: [
    { id: 'apple',          name: 'Apple (seb)',         gi: 36, servingCarbs: 21, unit: '1 medium' },
    { id: 'banana',         name: 'Banana (kela)',       gi: 52, servingCarbs: 27, unit: '1 medium' },
    { id: 'mango',          name: 'Mango (aam)',         gi: 55, servingCarbs: 22, unit: '1 cup' },
    { id: 'guava',          name: 'Guava (amrud)',       gi: 12, servingCarbs: 14, unit: '1 medium' },
    { id: 'papaya',         name: 'Papaya',              gi: 59, servingCarbs: 16, unit: '1 cup' },
    { id: 'orange',         name: 'Orange (santra)',     gi: 43, servingCarbs: 15, unit: '1 medium' },
    { id: 'grapes',         name: 'Grapes (angur)',      gi: 59, servingCarbs: 16, unit: '1 cup' },
    { id: 'watermelon',     name: 'Watermelon (tarbooz)',gi: 72, servingCarbs: 11, unit: '1 cup' },
    { id: 'pomegranate',    name: 'Pomegranate (anar)',  gi: 35, servingCarbs: 19, unit: '1/2 cup seeds' },
  ],
  snacks: [
    { id: 'samosa',         name: 'Samosa (1 pc)',       gi: 65, servingCarbs: 20, unit: '1 piece' },
    { id: 'pakora',         name: 'Pakora (3-4 pcs)',    gi: 58, servingCarbs: 18, unit: '3-4 pcs' },
    { id: 'roasted_chana',  name: 'Roasted Chana',      gi: 28, servingCarbs: 20, unit: '1/4 cup' },
    { id: 'makhana',        name: 'Makhana (lotus seed)',gi: 65, servingCarbs: 15, unit: '1/4 cup' },
    { id: 'dhokla',         name: 'Dhokla (2 pcs)',     gi: 35, servingCarbs: 20, unit: '2 pieces' },
    { id: 'almonds',        name: 'Almonds (10 pcs)',    gi: 0,  servingCarbs: 2,  unit: '10 nuts' },
    { id: 'walnuts',        name: 'Walnuts (5 halves)',  gi: 0,  servingCarbs: 2,  unit: '5 halves' },
    { id: 'peanuts',        name: 'Peanuts (handful)',   gi: 14, servingCarbs: 6,  unit: '1/4 cup' },
    { id: 'biscuits',       name: 'Biscuits (2 pcs)',    gi: 70, servingCarbs: 15, unit: '2 pieces' },
  ],
  sweets: [
    { id: 'sugar',          name: 'Sugar (1 tsp)',       gi: 65, servingCarbs: 5,  unit: '1 tsp' },
    { id: 'jaggery',        name: 'Jaggery (1 tsp)',     gi: 84, servingCarbs: 5,  unit: '1 tsp' },
    { id: 'mithai',         name: 'Mithai / Barfi (1 pc)',gi: 85, servingCarbs: 25, unit: '1 piece' },
    { id: 'kheer',          name: 'Kheer',               gi: 72, servingCarbs: 28, unit: '1 cup' },
    { id: 'halwa',          name: 'Halwa',               gi: 78, servingCarbs: 40, unit: '1/2 cup' },
    { id: 'rasgulla',       name: 'Rasgulla (1 pc)',     gi: 82, servingCarbs: 20, unit: '1 piece' },
    { id: 'gulab_jamun',    name: 'Gulab Jamun (1 pc)', gi: 80, servingCarbs: 22, unit: '1 piece' },
  ],
  protein: [
    { id: 'egg',            name: 'Egg (boiled)',        gi: 0,  servingCarbs: 0,  unit: '1 egg' },
    { id: 'chicken',        name: 'Chicken (100g)',      gi: 0,  servingCarbs: 0,  unit: '100g' },
    { id: 'fish',           name: 'Fish (100g)',         gi: 0,  servingCarbs: 0,  unit: '100g' },
    { id: 'tofu',           name: 'Tofu (100g)',         gi: 15, servingCarbs: 2,  unit: '100g' },
  ],
  drinks: [
    { id: 'chai_sugar',     name: 'Chai with Sugar',     gi: 65, servingCarbs: 10, unit: '1 cup' },
    { id: 'chai_nosug',     name: 'Chai no Sugar',       gi: 35, servingCarbs: 3,  unit: '1 cup' },
    { id: 'fruit_juice',    name: 'Fruit Juice (glass)',  gi: 68, servingCarbs: 26, unit: '1 glass' },
    { id: 'coconut_water',  name: 'Coconut Water',       gi: 54, servingCarbs: 9,  unit: '1 glass' },
    { id: 'green_tea',      name: 'Green Tea (no sugar)',gi: 0,  servingCarbs: 0,  unit: '1 cup' },
    { id: 'water',          name: 'Water',               gi: 0,  servingCarbs: 0,  unit: 'any' },
  ],
}

// Flat list for easy lookup
export const allFoods = Object.values(indianFoods).flat()

export function getFoodById(id) {
  return allFoods.find(f => f.id === id)
}

// Estimate post-meal glucose peak
// fastingGlucose: baseline blood sugar in mg/dL
// returns { glycemicLoad, estimatedPeak, level, color }
export function estimatePostMealGlucose(foods, fastingGlucose = 110) {
  if (!foods || foods.length === 0) return null
  let totalGL = 0
  for (const item of foods) {
    const food = getFoodById(item.foodId)
    if (!food) continue
    const servings = item.servings || 1
    const gl = (food.gi / 100) * food.servingCarbs * servings
    totalGL += gl
  }
  // Empirical: 1 GL unit ≈ 1.5 mg/dL glucose rise (simplified model)
  const rise = Math.min(Math.round(totalGL * 1.6), 200)
  const peak = fastingGlucose + rise
  const level = peak < 140 ? 'good' : peak < 180 ? 'moderate' : 'high'
  const color = peak < 140 ? '#22c55e' : peak < 180 ? '#f59e0b' : '#ef4444'
  return { glycemicLoad: Math.round(totalGL), estimatedPeak: peak, level, color, rise }
}

// Estimate HbA1c from average glucose (ADAG formula)
// avgGlucose: average blood glucose in mg/dL
export function estimateHbA1c(avgGlucose) {
  if (!avgGlucose || isNaN(avgGlucose)) return null
  return ((avgGlucose + 46.7) / 28.7).toFixed(1)
}

// Glucose level descriptor
export function glucoseLabel(value, type = 'postMeal') {
  if (!value) return { text: 'Unknown', color: '#9ca3af' }
  if (type === 'fasting') {
    if (value < 100) return { text: 'Normal', color: '#22c55e' }
    if (value < 126) return { text: 'Pre-diabetic', color: '#f59e0b' }
    return { text: 'High', color: '#ef4444' }
  }
  if (value < 140) return { text: 'Good', color: '#22c55e' }
  if (value < 180) return { text: 'Elevated', color: '#f59e0b' }
  return { text: 'High', color: '#ef4444' }
}

export const exerciseTypes = [
  'Brisk Walking', 'Slow Walking', 'Jogging / Running', 'Cycling',
  'Swimming', 'Yoga', 'Pranayama / Breathing', 'Strength Training',
  'Stretching', 'Badminton', 'Cricket', 'Football', 'Dance',
  'Household work', 'Gardening', 'Other'
]
