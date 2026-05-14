export interface FoodItem {
  name: string;
  note?: string;
}

export interface FoodGroup {
  category: string;
  emoji: string;
  items: FoodItem[];
}

export const GOOD_FOODS: FoodGroup[] = [
  {
    category: "蛋白質",
    emoji: "🥚",
    items: [
      { name: "雞胸肉（無皮）", note: "熟 100g ≈ 30g 蛋白、~165 kcal" },
      { name: "雞腿肉（去皮）", note: "比胸略油但口感佳，~190 kcal/100g" },
      { name: "雞蛋", note: "一顆 ≈ 6g 蛋白、~75 kcal" },
      { name: "鮭魚 / 鯖魚 / 秋刀魚", note: "蛋白 + omega-3，建議每週 2-3 次" },
      { name: "蝦 / 花枝 / 海鮮", note: "低脂高蛋白，蝦 100g ≈ 20g 蛋白" },
      { name: "無糖豆漿", note: "200ml ≈ 7g 蛋白；500ml 約一份蛋白" },
      { name: "板豆腐", note: "100g ≈ 8g 蛋白，比嫩豆腐密度高" },
      { name: "毛豆", note: "100g（去殼）≈ 11g 蛋白 + 大量纖維" },
      { name: "希臘優格（無糖）", note: "100g ≈ 10g 蛋白，普通優格的 2 倍" },
    ],
  },
  {
    category: "蔬菜",
    emoji: "🥬",
    items: [
      { name: "深綠葉菜", note: "菠菜、地瓜葉、青江、空心菜、芥蘭" },
      { name: "十字花科", note: "花椰菜、青花菜、高麗菜、白菜、蘿蔔" },
      { name: "番茄", note: "茄紅素 + 低熱量" },
      { name: "甜椒（紅/黃）", note: "維他命 C 含量比柳橙還高" },
      { name: "菇類", note: "香菇、金針、杏鮑、舞菇等；纖維高熱量低" },
      { name: "海藻", note: "海帶、紫菜、海帶芽，幾乎零熱量" },
      { name: "小黃瓜 / 胡蘿蔔 / 芹菜", note: "點心型蔬菜，可生吃" },
    ],
  },
  {
    category: "原型澱粉",
    emoji: "🌾",
    items: [
      { name: "糙米 / 五穀米", note: "比白飯纖維多 3-4 倍，血糖升得慢" },
      { name: "地瓜", note: "纖維 + 抗性澱粉，飽足感比白米強" },
      { name: "燕麥（鋼切/即食原味）", note: "30g 乾燕麥 ≈ 一份澱粉 + 5g 蛋白" },
      { name: "全麥麵包 / 全麥吐司", note: "看成分前 3 名要有「全麥」字樣" },
      { name: "馬鈴薯（蒸/烤）", note: "蒸烤的馬鈴薯飽足感很強；炸的是另一回事" },
      { name: "南瓜 / 山藥", note: "升糖比白飯慢，纖維足" },
    ],
  },
  {
    category: "好油",
    emoji: "🥑",
    items: [
      { name: "橄欖油（特級初榨）", note: "適合涼拌、低溫烹調" },
      { name: "苦茶油 / 酪梨油", note: "穩定性高，可用於中高溫烹調" },
      { name: "堅果類", note: "杏仁、核桃、腰果、夏威夷果；每天一小把（10g）" },
      { name: "種子類", note: "奇亞籽、亞麻仁籽，含 omega-3 + 纖維" },
      { name: "酪梨", note: "好油 + 纖維，但熱量也不低（一顆 ~250 kcal）" },
      { name: "魚油 / 深海魚", note: "omega-3 抗發炎，減脂者特別需要" },
    ],
  },
  {
    category: "飲品",
    emoji: "☕",
    items: [
      { name: "白開水 / 氣泡水", note: "最便宜也最有效的飲品" },
      { name: "無糖茶", note: "綠/紅/烏龍/普洱皆可" },
      { name: "黑咖啡", note: "無糖、不加奶精；少量奶或植物奶可" },
      { name: "美式咖啡 / 拿鐵（無糖、鮮奶）", note: "拿鐵記得是鮮奶不是奶精" },
      { name: "無糖豆漿", note: "順便補蛋白" },
    ],
  },
  {
    category: "輕零食",
    emoji: "🌰",
    items: [
      { name: "水煮蛋", note: "便利商店茶葉蛋也算" },
      { name: "無調味堅果", note: "一小把（10-15g）就好" },
      { name: "毛豆（蒸/水煮）", note: "蛋白 + 纖維，當點心很實用" },
      { name: "新鮮水果", note: "蘋果、芭樂、莓果、橘子；別榨汁" },
      { name: "海苔（無調味）", note: "幾乎零熱量但要看鹽分" },
      { name: "豆乾 / 雞胸條", note: "高蛋白即食零食" },
      { name: "無糖優格", note: "搭配莓果或堅果" },
    ],
  },
];

export const BAD_FOODS: FoodGroup[] = [
  {
    category: "加工肉",
    emoji: "🌭",
    items: [
      { name: "香腸、培根、火腿、熱狗", note: "亞硝酸鹽 + 高鈉 + 油脂" },
      { name: "貢丸、魚丸、燕餃、餛飩", note: "看似健康，多是肥肉碎 + 太白粉" },
      { name: "肉鬆、肉乾、肉脯", note: "高糖、高鈉、密度高熱量" },
      { name: "罐頭肉類", note: "鈉含量爆表" },
    ],
  },
  {
    category: "含糖飲料",
    emoji: "🥤",
    items: [
      { name: "全糖手搖", note: "一杯 ~50g 糖 = 14 顆方糖" },
      { name: "罐裝果汁 / 鮮榨果汁", note: "纖維被打掉只剩糖，跟可樂差不多" },
      { name: "汽水、可樂、運動飲料", note: "純糖水；運動飲料只在運動 1hr+ 才需要" },
      { name: "瑪奇朵、摩卡、白巧克力咖啡", note: "一杯 300-500 kcal" },
      { name: "蜂蜜檸檬、加糖茶", note: "「健康」包裝下的糖水" },
    ],
  },
  {
    category: "精緻澱粉",
    emoji: "🥖",
    items: [
      { name: "白吐司、菠蘿、可頌、奶酥麵包", note: "升糖快 + 通常含油糖組合" },
      { name: "蛋糕、餅乾、餡餅、布朗尼", note: "麵粉 + 糖 + 奶油的三重組合" },
      { name: "白米飯大量", note: "本身不壞，但份量是重點" },
      { name: "白麵、烏龍麵、米粉", note: "精製碳水，飽足感低" },
      { name: "鬆餅、瑪芬、Donut", note: "通常含部分氫化油（反式脂肪）" },
    ],
  },
  {
    category: "反式脂肪 / 精煉油",
    emoji: "🍟",
    items: [
      { name: "奶精（咖啡奶精、奶茶用奶精）", note: "通常是部分氫化油，反式脂肪重災區" },
      { name: "植物性奶油 / 酥油 / 起酥油", note: "傳統反式脂肪來源" },
      { name: "炸雞、薯條、鹽酥雞、天婦羅", note: "麵衣吸油，反覆使用油更糟" },
      { name: "速食套餐", note: "薯條 + 奶昔 + 漢堡 = 三大反式脂肪源" },
      { name: "微波爆米花、洋芋片", note: "部分品牌含氫化油，看成分表" },
    ],
  },
  {
    category: "隱形糖陷阱",
    emoji: "🍬",
    items: [
      { name: "燕麥棒 / 能量棒", note: "標榜健康，糖量常常比餅乾還高" },
      { name: "「無糖」優格", note: "確認是「無添加糖」還是「人工甜味劑」" },
      { name: "醬料：番茄醬、烤肉醬、沙茶、千島", note: "一小包 ~50-150 kcal 純糖油" },
      { name: "果乾", note: "葡萄乾、芒果乾的糖密度遠超新鮮水果" },
      { name: "早餐穀片 / 玉米片", note: "盒裝穀片很多有添加糖，看成分前 3 名" },
      { name: "麥片飲、芝麻糊（即食包）", note: "通常是糖打底" },
      { name: "養樂多 / 優酪乳（一般版）", note: "糖量比可樂少一點而已" },
    ],
  },
];
