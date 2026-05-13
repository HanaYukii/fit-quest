import { UserProfile, CONSTRAINT_LABELS } from "../types";

const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export interface CoachAnswer {
  ok: true;
  text: string;
}

export interface CoachError {
  ok: false;
  reason:
    | "no-key"
    | "invalid-key"
    | "rate-limited"
    | "network"
    | "blocked"
    | "empty"
    | "unknown";
  message: string;
}

export type CoachResult = CoachAnswer | CoachError;

function profileBlock(profile: UserProfile | null): string {
  if (!profile) return "（使用者尚未填寫個人檔案）";
  const constraints = profile.constraints
    .map((c) => CONSTRAINT_LABELS[c])
    .join("、");
  return [
    `暱稱：${profile.nickname}`,
    profile.heightCm && `身高：${profile.heightCm} cm`,
    profile.startWeightKg && `起始體重：${profile.startWeightKg} kg`,
    profile.currentWeightKg && `目前體重：${profile.currentWeightKg} kg`,
    profile.targetWeightKg && `目標體重：${profile.targetWeightKg} kg`,
    profile.wakeTime && `平常起床：${profile.wakeTime}`,
    profile.sleepTime && `平常睡覺：${profile.sleepTime}`,
    constraints && `身體狀況：${constraints}`,
    profile.notes && `自述：${profile.notes}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildSystemPrompt(profile: UserProfile | null): string {
  return [
    "你是 fit-quest app 內建的減脂教練。使用者狀況如下：",
    profileBlock(profile),
    "",
    "回答原則：",
    "1. 直接給 2-3 個具體選項，包含熱量估算（不要說「視情況而定」）",
    "2. 排序：最推薦 → 折衷 → 避免，並用 1 句話點出每個選項的權衡",
    "3. 不說教、不審判、不加免責聲明",
    "4. 繁體中文（台灣），口語化但具體",
    "5. 短：5 段以內，避免超過 5 個選項（會癱瘓）",
    "6. 如果使用者狀況有相關限制（例如膝蓋、糖尿病），優先考量",
    "",
    "不要：",
    "- 用「您」「請問」這種疏離語氣",
    "- 推銷意志力",
    "- 給長篇大論",
  ].join("\n");
}

export async function askCoach(
  apiKey: string | undefined,
  question: string,
  profile: UserProfile | null
): Promise<CoachResult> {
  if (!apiKey) {
    return {
      ok: false,
      reason: "no-key",
      message: "需要先在設定頁加 Gemini API key。",
    };
  }
  const systemPrompt = buildSystemPrompt(profile);

  try {
    const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: question }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        reason: "invalid-key",
        message: "API key 無效或權限不足。到設定頁確認一下？",
      };
    }
    if (res.status === 429) {
      return {
        ok: false,
        reason: "rate-limited",
        message: "今天用量到上限了，明天再試。",
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        reason: "unknown",
        message: `Gemini 回 ${res.status}，再試一次。`,
      };
    }

    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
      promptFeedback?: { blockReason?: string };
    };

    if (json.promptFeedback?.blockReason) {
      return {
        ok: false,
        reason: "blocked",
        message: "Gemini 拒絕回答這個問題（內容過濾）。換個方式問。",
      };
    }

    const text = json.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim();

    if (!text) {
      return {
        ok: false,
        reason: "empty",
        message: "Gemini 回了空回答，再問一次。",
      };
    }

    return { ok: true, text };
  } catch {
    return {
      ok: false,
      reason: "network",
      message: "連線失敗。檢查網路或稍後再試。",
    };
  }
}

export const COACH_TEMPLATES: { label: string; prompt: string }[] = [
  {
    label: "我在飲料店",
    prompt:
      "我現在在飲料店，想喝有甜味的東西。給我 3 個排序選擇（最推薦到避免），含熱量估算。",
  },
  {
    label: "我在便利商店",
    prompt:
      "我現在在便利商店，要買一頓晚餐。預算 150 元內，希望吃飽不破功。給我 3 個組合。",
  },
  {
    label: "我餓了想吃零食",
    prompt:
      "我下午很想吃零食，不確定是真餓還是嘴饞。教我怎麼判斷，再給 3 個如果真的要吃的選擇。",
  },
  {
    label: "今晚外食怎麼選",
    prompt:
      "今天晚上要跟朋友外食，可能去日式、義式或火鍋。哪個對減脂最好處理？分別給點餐策略。",
  },
  {
    label: "破功了怎麼辦",
    prompt:
      "我剛破功吃了不該吃的，現在很自責也想繼續吃。給我具體做什麼能止損 + 怎麼回到狀態。",
  },
];
