export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MealVenue =
  | "home"
  | "cvs"
  | "breakfast-shop"
  | "lunchbox"
  | "restaurant"
  | "japanese"
  | "korean"
  | "hot-pot"
  | "brunch-cafe";

export interface Meal {
  id: string;
  emoji: string;
  name: string;
  mealTypes: MealType[];
  venues: MealVenue[];
  components: string[];
  estKcal: number;
  estProtein: number;
  notes?: string;
}

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
  snack: "點心",
};

export const VENUE_LABELS: Record<MealVenue, string> = {
  home: "自煮",
  cvs: "便利商店",
  "breakfast-shop": "早餐店",
  lunchbox: "便當店",
  restaurant: "外食",
  japanese: "日式",
  korean: "韓式",
  "hot-pot": "火鍋",
  "brunch-cafe": "早午餐 / 咖啡廳",
};

export const MEALS: Meal[] = [
  // ─────────────── BREAKFAST ───────────────
  {
    id: "bk-egg-roll",
    emoji: "🥞",
    name: "蛋餅 + 無糖豆漿組合",
    mealTypes: ["breakfast"],
    venues: ["breakfast-shop", "home"],
    components: [
      "蛋餅一份（不加美乃滋/玉米/起司）",
      "無糖豆漿 500ml",
      "茶葉蛋一顆（可加）",
    ],
    estKcal: 400,
    estProtein: 25,
    notes: "蛋餅本體還可以，地雷主要在醬料跟加料。",
  },
  {
    id: "bk-cvs",
    emoji: "🏪",
    name: "便利商店蛋白早餐",
    mealTypes: ["breakfast"],
    venues: ["cvs"],
    components: [
      "茶葉蛋 2 顆",
      "無糖優酪乳 / 無糖豆漿一瓶",
      "香蕉一根 或 蘋果一顆",
    ],
    estKcal: 380,
    estProtein: 22,
  },
  {
    id: "bk-oatmeal",
    emoji: "🥣",
    name: "燕麥莓果碗",
    mealTypes: ["breakfast"],
    venues: ["home"],
    components: [
      "燕麥 30g（鋼切或即食原味）",
      "無糖優格 150g",
      "莓果一小碗（藍莓/草莓/覆盆莓）",
      "一小把杏仁 / 核桃",
    ],
    estKcal: 420,
    estProtein: 22,
  },
  {
    id: "bk-veg-sandwich",
    emoji: "🥪",
    name: "蔬菜蛋三明治改造版",
    mealTypes: ["breakfast"],
    venues: ["breakfast-shop", "home"],
    components: [
      "全麥吐司 2 片（早餐店可請改全麥）",
      "蔬菜蛋（不加美乃滋，多生菜番茄）",
      "黑咖啡 / 無糖紅茶",
    ],
    estKcal: 400,
    estProtein: 22,
  },
  {
    id: "bk-protein-brunch",
    emoji: "🍳",
    name: "高蛋白早午餐",
    mealTypes: ["breakfast", "lunch"],
    venues: ["home", "brunch-cafe"],
    components: [
      "嫩煎雞胸 100g 或 水波蛋 2-3 顆",
      "全麥吐司 1 片 或 半碗糙米",
      "烤蔬菜（番茄、菇類、蘆筍）",
      "黑咖啡 / 無糖拿鐵",
    ],
    estKcal: 500,
    estProtein: 40,
  },
  {
    id: "bk-mantou",
    emoji: "🥟",
    name: "豆漿饅頭組合",
    mealTypes: ["breakfast"],
    venues: ["breakfast-shop", "home"],
    components: [
      "雜糧饅頭一個（或夾蛋）",
      "無糖豆漿 500ml",
      "茶葉蛋一顆",
    ],
    estKcal: 450,
    estProtein: 25,
  },

  // ─────────────── LUNCH ───────────────
  {
    id: "lu-buffet",
    emoji: "🥗",
    name: "自助餐減脂版",
    mealTypes: ["lunch", "dinner"],
    venues: ["lunchbox"],
    components: [
      "半碗白飯 或 一條地瓜",
      "蛋白質：烤雞腿（去皮）/ 蒸魚 / 滷豆腐 擇一",
      "燙青菜 × 3 種（不淋肉燥）",
      "滷蛋一顆",
    ],
    estKcal: 600,
    estProtein: 35,
  },
  {
    id: "lu-cvs",
    emoji: "🏪",
    name: "便利商店午餐",
    mealTypes: ["lunch"],
    venues: ["cvs"],
    components: [
      "即食雞胸一份",
      "生菜沙拉（油醋醬只用半包）",
      "無糖豆漿 / 茶葉蛋一顆",
      "香蕉或蘋果",
    ],
    estKcal: 500,
    estProtein: 35,
  },
  {
    id: "lu-lunchbox",
    emoji: "🍱",
    name: "便當店烤雞便當",
    mealTypes: ["lunch", "dinner"],
    venues: ["lunchbox"],
    components: [
      "烤雞腿便當（半碗飯，剩下分給菜）",
      "燙青菜不加肉燥",
      "湯不喝光",
    ],
    estKcal: 650,
    estProtein: 35,
    notes: "看到「炸 / 酥 / 排骨」直接 pass。",
  },
  {
    id: "lu-home-simple",
    emoji: "🍚",
    name: "簡易自煮午餐",
    mealTypes: ["lunch", "dinner"],
    venues: ["home"],
    components: [
      "雞胸 100g（嫩煎或舒肥）",
      "糙米半碗（80g 熟）",
      "蒸蔬菜 1.5 碗",
      "一顆水煮蛋（加蛋白）",
    ],
    estKcal: 550,
    estProtein: 45,
  },
  {
    id: "lu-japanese",
    emoji: "🐟",
    name: "日式烤魚定食",
    mealTypes: ["lunch", "dinner"],
    venues: ["japanese"],
    components: [
      "烤魚定食（鹽烤鯖魚 / 秋刀魚）",
      "白飯壓到半碗",
      "燙青菜 + 茶碗蒸",
      "味噌湯只喝幾口",
    ],
    estKcal: 550,
    estProtein: 35,
  },

  // ─────────────── DINNER ───────────────
  {
    id: "di-hot-pot",
    emoji: "🍲",
    name: "鴛鴦清湯火鍋",
    mealTypes: ["dinner"],
    venues: ["hot-pot"],
    components: [
      "湯底選清湯（昆布/鴛鴦）",
      "雞肉、海鮮、豆腐 為主蛋白",
      "蔬菜盤 × 2（菇類、葉菜）",
      "醬料：醬油 + 蔥蒜 + 蘿蔔泥",
      "不喝湯，不點冬粉/泡麵收尾",
    ],
    estKcal: 600,
    estProtein: 50,
  },
  {
    id: "di-korean",
    emoji: "🍱",
    name: "韓式石鍋拌飯減脂版",
    mealTypes: ["lunch", "dinner"],
    venues: ["korean"],
    components: [
      "石鍋拌飯（飯壓 1/3 碗，多挖蔬菜跟蛋）",
      "海帶湯",
      "泡菜小菜無限續",
    ],
    estKcal: 550,
    estProtein: 30,
  },
  {
    id: "di-fish-veg",
    emoji: "🐠",
    name: "蒸魚 + 燙青菜 + 地瓜",
    mealTypes: ["dinner"],
    venues: ["home"],
    components: [
      "蒸鱸魚 / 鮭魚 150g",
      "燙青菜（不淋油，淋一點醬油）",
      "蒸地瓜半條",
    ],
    estKcal: 450,
    estProtein: 35,
  },
  {
    id: "di-salad-bowl",
    emoji: "🥙",
    name: "高蛋白沙拉碗",
    mealTypes: ["lunch", "dinner"],
    venues: ["home", "restaurant"],
    components: [
      "大份生菜（羅蔓、菠菜、芝麻葉）",
      "雞胸 / 鮭魚 / 鮪魚 一份",
      "半顆酪梨 + 一顆水煮蛋",
      "油醋醬 1 小匙（不加凱薩/千島）",
    ],
    estKcal: 500,
    estProtein: 35,
  },
  {
    id: "di-stir-fry",
    emoji: "🥢",
    name: "高蛋白快炒晚餐",
    mealTypes: ["dinner"],
    venues: ["home"],
    components: [
      "雞胸 / 雞腿 / 蝦仁 + 蔬菜 快炒",
      "用 1 茶匙橄欖油，不勾芡",
      "半碗糙米飯",
    ],
    estKcal: 550,
    estProtein: 40,
  },
  {
    id: "di-light-restaurant",
    emoji: "🍽️",
    name: "外食輕食晚餐",
    mealTypes: ["dinner"],
    venues: ["restaurant"],
    components: [
      "主菜選蒸/烤/燉的蛋白質（蒸魚、烤雞、燉肉）",
      "蔬菜配菜 ×2",
      "白飯只吃半碗",
      "湯不喝勾芡的",
    ],
    estKcal: 600,
    estProtein: 35,
  },

  // ─────────────── SNACK ───────────────
  {
    id: "sn-eggs-nuts",
    emoji: "🥚",
    name: "蛋 + 堅果",
    mealTypes: ["snack"],
    venues: ["home", "cvs"],
    components: ["水煮蛋 2 顆", "一小把杏仁或核桃（10g）"],
    estKcal: 280,
    estProtein: 16,
    notes: "嘴饞時的標準解法。",
  },
  {
    id: "sn-yogurt",
    emoji: "🍓",
    name: "希臘優格碗",
    mealTypes: ["snack"],
    venues: ["home", "cvs"],
    components: [
      "無糖希臘優格 150g",
      "莓果一小碗",
      "1 小匙蜂蜜（想要甜的話）",
    ],
    estKcal: 200,
    estProtein: 15,
  },
  {
    id: "sn-soymilk-egg",
    emoji: "🥛",
    name: "豆漿 + 茶葉蛋",
    mealTypes: ["snack"],
    venues: ["cvs"],
    components: ["無糖豆漿 500ml", "茶葉蛋 1-2 顆"],
    estKcal: 280,
    estProtein: 22,
  },
  {
    id: "sn-fruit-nut",
    emoji: "🍎",
    name: "水果 + 堅果",
    mealTypes: ["snack"],
    venues: ["home", "cvs"],
    components: ["蘋果 / 芭樂 / 莓果 一份", "一小把堅果"],
    estKcal: 200,
    estProtein: 5,
  },
  {
    id: "sn-edamame",
    emoji: "🌱",
    name: "毛豆 + 海苔",
    mealTypes: ["snack"],
    venues: ["home", "cvs"],
    components: [
      "蒸毛豆一份（80g 去殼）",
      "無調味海苔片",
    ],
    estKcal: 180,
    estProtein: 12,
  },
];
