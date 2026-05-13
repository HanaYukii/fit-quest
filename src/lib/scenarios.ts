export interface ScenarioItem {
  name: string;
  note?: string;
}

export interface Scenario {
  id: string;
  emoji: string;
  title: string;
  oneliner: string;
  traps: ScenarioItem[];
  better: ScenarioItem[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "breakfast-shop",
    emoji: "🥚",
    title: "早餐店（美而美/麥味登/弘爺）",
    oneliner: "奶精 + 美乃滋 + 鐵板麵醬汁 = 早餐店三大油彈。",
    traps: [
      {
        name: "大冰奶 / 大紅茶",
        note: "奶精 = 反式脂肪 + 大量糖，一杯 ~250 kcal、糖 ~40g（10 顆方糖）",
      },
      { name: "鐵板麵套餐", note: "醬汁是太白粉勾芡油糊，套餐 ~700-800 kcal" },
      {
        name: "漢堡套餐（火腿/培根 + 美乃滋 + 起司）",
        note: "加工肉 + 醬料 + 玉米堅果，一個 ~600-900 kcal",
      },
    ],
    better: [
      { name: "蛋餅（不加美乃滋/玉米/起司）+ 無糖豆漿", note: "~400 kcal、蛋白質夠" },
      { name: "蔬菜蛋吐司（不加美乃滋，多生菜番茄）+ 黑咖啡" },
      { name: "想喝甜的：微糖鮮奶茶", note: "鮮奶 ≠ 奶精，是天差地遠的選擇" },
    ],
  },
  {
    id: "drink-shop",
    emoji: "🧋",
    title: "飲料店（手搖飲）",
    oneliner: "含糖手搖是減脂最快破功的地雷。換無糖純茶等於每週省 1-2 公斤的熱量赤字。",
    traps: [
      {
        name: "全糖珍奶（700ml）",
        note: "糖 ~55g（14 顆方糖）+ 珍珠 + 奶精 ≈ 600 kcal，等於一頓正餐",
      },
      { name: "奶蓋 / 起司奶蓋", note: "奶蓋本體 ~150 kcal，糖鹽脂三合一" },
      { name: "「奶茶」（非「鮮奶茶」）", note: "用奶精，反式脂肪累積心血管風險" },
    ],
    better: [
      { name: "無糖綠/紅/烏龍/青茶", note: "0 kcal" },
      { name: "鮮奶茶（不是奶茶）+ 微糖", note: "想喝奶就選這個" },
      { name: "配料一律拿掉", note: "特別是珍珠/椰果/布丁/奶蓋" },
    ],
  },
  {
    id: "convenience-store",
    emoji: "🏪",
    title: "便利商店（7-11/全家）",
    oneliner: "避開包裝麵包跟含糖飲料，就贏一半了。",
    traps: [
      { name: "菠蘿 / 巧克力 / 肉鬆麵包", note: "糖 + 精煉油，一個 ~400-500 kcal" },
      { name: "千島醬 / 凱薩醬", note: "一小包 ~100-150 kcal 純脂肪" },
      { name: "寶礦力 / 舒跑 / 能量飲", note: "包裝健康但糖量爆表，一瓶 ~100-300 kcal" },
      { name: "燕麥棒 / 果乾零食", note: "標示健康，糖量常常比餅乾還高" },
    ],
    better: [
      {
        name: "茶葉蛋（2 顆）+ 無糖豆漿 + 香蕉",
        note: "~400 kcal、蛋白質夠、飽足感久",
      },
      { name: "即食雞胸 + 生菜沙拉（醬少加）" },
      {
        name: "關東煮：白蘿蔔、米血、玉米、菇類、豆腐",
        note: "醬汁少加一半",
      },
      { name: "飲料只買水 / 無糖茶 / 黑咖啡" },
    ],
  },
  {
    id: "lunchbox",
    emoji: "🍱",
    title: "便當店 / 自助餐",
    oneliner: "看到「炸 / 酥 / 排骨」直接 pass，改成烤的就贏 300 kcal。",
    traps: [
      {
        name: "排骨 / 雞腿（炸的）便當",
        note: "光主菜就佔一半熱量，~900-1100 kcal",
      },
      {
        name: "滷肉飯",
        note: "肥肉碎滷汁淋白飯，一碗 ~500 kcal 但飽足感低",
      },
      { name: "燙青菜淋肉燥", note: "那一勺肉燥就 ~100 kcal 純油" },
    ],
    better: [
      { name: "烤雞腿 / 烤雞胸便當", note: "避開所有「酥」「炸」字" },
      {
        name: "自助餐：3 樣青菜 + 1 蛋白質（蒸魚/雞胸/滷蛋/豆腐）+ 半碗飯",
      },
      { name: "燙青菜不加肉燥，要醬油就要醬油" },
      { name: "滷蛋、白切肉、豆乾", note: "相對乾淨的蛋白質補充" },
    ],
  },
  {
    id: "night-market",
    emoji: "🌃",
    title: "夜市",
    oneliner: "能煮的選煮的、能烤的選烤的，避開所有「炸」字。",
    traps: [
      { name: "鹽酥雞一份", note: "~900-1200 kcal（油裹三層）" },
      { name: "大腸包小腸", note: "~500 kcal + 大量加工肉" },
      { name: "蚵仔煎", note: "太白粉吸油 + 甜醬，~500 kcal" },
    ],
    better: [
      { name: "烤雞肉串 / 烤香腸（1-2 串就好）" },
      { name: "蚵仔湯 / 魷魚羹 / 麵線（湯類）+ 一份燙青菜" },
      { name: "水果攤：芭樂、蓮霧、芒果（份量控制）" },
    ],
  },
  {
    id: "fast-food",
    emoji: "🍔",
    title: "連鎖速食（麥當勞 / 摩斯 / 肯德基 / Subway）",
    oneliner: "薯條+奶昔+大杯飲料是 +500 kcal 三件套，能拆就拆。",
    traps: [
      { name: "薯條（中份）", note: "~330 kcal 純油 + 鹽 + 精製澱粉" },
      { name: "奶昔 / 聖代", note: "~500-600 kcal 糖油組合" },
      { name: "套餐升級大杯", note: "飲料 + 薯條多 200-300 kcal" },
    ],
    better: [
      { name: "麥當勞：火腿蛋堡（去起司、去美乃滋）+ 黑咖啡" },
      { name: "摩斯：摩斯漢堡單點 / 雞腿米堡 / 沙拉（醬要少）" },
      {
        name: "Subway：6 吋全麥 + 雞胸 / 烤雞 + 蔬菜多 + 黃芥末或油醋",
      },
      { name: "肯德基：紙包雞 > 炸雞，配玉米 / 沙拉 > 薯條" },
    ],
  },
  {
    id: "hot-pot",
    emoji: "🍲",
    title: "火鍋",
    oneliner: "湯底 + 醬料 + 加工料是熱量三大來源，這三件處理好就夠了。",
    traps: [
      { name: "加工料盤（魚餃/燕餃/丸子）", note: "吸湯 + 本身高油，一盤 ~600 kcal" },
      { name: "沙茶 + 蛋黃醬", note: "一小碗 ~250 kcal 純油" },
      { name: "麻辣鍋湯底", note: "吸滿油的湯絕對不喝" },
      { name: "冬粉 / 泡麵收尾", note: "精製澱粉炸彈" },
    ],
    better: [
      { name: "湯底選鴛鴦或昆布清湯" },
      {
        name: "醬料：醬油 + 蔥蒜 + 蘿蔔泥 + 少許辣椒",
        note: "不要沙茶不要蛋黃",
      },
      { name: "主菜：肉片、海鮮、豆腐、菇類為主" },
      { name: "蔬菜先煮先吃；不喝湯（湯吸滿油鹽嘌呤）" },
    ],
  },
];
