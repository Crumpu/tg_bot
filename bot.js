import { Bot, webhookCallback } from "grammy";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// 1. Инициализация базы данных
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// 2. Инициализация бота
const bot = new Bot(process.env.BOT_TOKEN);
const ADMIN_GROUP_ID_NUM = Number(process.env.ADMIN_GROUP_ID);

// =========================================================
// 3. СПИСКИ 100 НА 100 — МАКСИМАЛЬНАЯ МИЛОТА (10 000 комбинаций!)
// =========================================================
const adjectives = [
  "Плюшевый",
  "Зефирный",
  "Нежный",
  "Сонный",
  "Пушистый",
  "Мягкий",
  "Сахарный",
  "Карамельный",
  "Сладкий",
  "Теплый",
  "Уютный",
  "Ванильный",
  "Шоколадный",
  "Медовый",
  "Бархатный",
  "Шелковый",
  "Клубничный",
  "Мятный",
  "Черничный",
  "Малиновый",
  "Персиковый",
  "Кокосовый",
  "Банановый",
  "Ореховый",
  "Кремовый",
  "Игривый",
  "Ласковый",
  "Стеснительный",
  "Робкий",
  "Скромный",
  "Забавный",
  "Чуткий",
  "Добрый",
  "Крошечный",
  "Маленький",
  "Хрупкий",
  "Сонливый",
  "Бодрый",
  "Сияющий",
  "Звездный",
  "Лунный",
  "Солнечный",
  "Облачный",
  "Туманный",
  "Дождливый",
  "Снежный",
  "Весенний",
  "Летний",
  "Зефирковый",
  "Лавандовый",
  "Розовый",
  "Пастельный",
  "Мурчащий",
  "Сопящий",
  "Мечтательный",
  "Сказочный",
  "Магический",
  "Мудрый",
  "Любопытный",
  "Верный",
  "Честный",
  "Щедрый",
  "Тихий",
  "Спокойный",
  "Веселый",
  "Радостный",
  "Светлый",
  "Золотистый",
  "Серебристый",
  "Жемчужный",
  "Атласный",
  "Вельветовый",
  "Флисовый",
  "Махровый",
  "Кашемировый",
  "Ситцевый",
  "Кружевной",
  "Вафельный",
  "Пряничный",
  "Мармеладный",
  "Конфетный",
  "Глазированный",
  "Коричный",
  "Мускатный",
  "Имбирный",
  "Свежий",
  "Яблочный",
  "Сливовый",
  "Вишневый",
  "Абрикосовый",
  "Лимонадный",
  "Пуговчатый",
  "Бусинковый",
  "Бантиковый",
  "Шерстяной",
  "Вязаный",
  "Домашний",
  "Карманный",
  "Крохотный",
  "Любимый",
];

const nouns = [
  "Котёнок",
  "Енотик",
  "Пандочка",
  "Слоник",
  "Хомячок",
  "Лисичка",
  "Тигрёнок",
  "Медвежонок",
  "Пингвинёнок",
  "Коала",
  "Крольчонок",
  "Волчонок",
  "Белочка",
  "Бурундучок",
  "Выдрочка",
  "Бобрёнок",
  "Ленивец",
  "Попугайчик",
  "Фламинго",
  "Оленёнок",
  "Кексик",
  "Печенька",
  "Облачко",
  "Пончик",
  "Зефирка",
  "Пёсик",
  "Корги",
  "Сиба-Ину",
  "Котя",
  "Мурлыка",
  "Пушок",
  "Снежок",
  "Лучик",
  "Капелька",
  "Пуговка",
  "Бусинка",
  "Бантик",
  "Мотылёк",
  "Бабочка",
  "Пчёлка",
  "Шмель",
  "Светлячок",
  "Улиточка",
  "Ёжик",
  "Шиншилла",
  "Сурочек",
  "Белёк",
  "Котелок",
  "Совушка",
  "Воробушек",
  "Синичка",
  "Снегирёк",
  "Колибри",
  "Зайка",
  "Цыплёнок",
  "Утёнок",
  "Гусёнок",
  "Поросёнок",
  "Телёнок",
  "Ягнёнок",
  "Жеребёнок",
  "Кенгурёнок",
  "Дельфинчик",
  "Китёнок",
  "Ушестик",
  "Хвостик",
  "Лапка",
  "Носик",
  "Усик",
  "Сверчок",
  "Гномик",
  "Эльфик",
  "Ангелочек",
  "Пряничек",
  "Мармеладка",
  "Ириска",
  "Карамелька",
  "Пастила",
  "Суфлешка",
  "Пироженка",
  "Маффин",
  "Трюфелька",
  "Орешек",
  "Изюмка",
  "Клюковка",
  "Черничка",
  "Малинка",
  "Земляничка",
  "Ежевичка",
  "Морошка",
  "Булочка",
  "Пышка",
  "Круассанчик",
  "Багетик",
  "Баранка",
  "Сушечка",
  "Вафелька",
  "Пельмешек",
  "Пончик",
  "Тортик",
];

function getAnonymousName(userId) {
  const hash = crypto.createHash("md5").update(userId.toString()).digest();
  const seed = (hash[hash.length - 1] << 8) | hash[hash.length - 2];

  const adjIndex = seed % adjectives.length;
  const nounIndex = Math.floor(seed / adjectives.length) % nouns.length;

  return `${adjectives[adjIndex]} ${nouns[nounIndex]}`;
}
// =========================================================

// 4. Команда /start
bot.command("start", async (ctx) => {
  if (ctx.chat.type === "private") {
    await ctx.reply(
      "Добро пожаловать в наш уютный уголок тайной комнаты. 🌿\n\n" +
        "Здесь можно быть собой 😈\n\n" +
        "Если у тебя есть вопросы по выбору игрушек 🔞 или ты хочешь доверить нам свою историю — пиши прямо сюда ✍️\n\n" +
        "Твои сообщения приходят администраторам полностью анонимно 🙈\n\n" +
        "Мы увидим только текст 👀, но не будем знать кто его отправил 🤷‍♀️ \n\n" +
        "Чувствуй себя как дома 😇",
    );
  }
});

// 5. Обработчик сообщений
bot.on("message", async (ctx) => {
  if (ctx.chat.type === "private") {
    if (ctx.message.text && ctx.message.text.startsWith("/")) return;

    try {
      const anonymousName = getAnonymousName(ctx.from.id);

      const headerMsg = await ctx.api.sendMessage(
        ADMIN_GROUP_ID_NUM,
        `📥 **Сообщение от: ${anonymousName}**`,
        { parse_mode: "Markdown" },
      );

      const copiedMsg = await ctx.copyMessage(ADMIN_GROUP_ID_NUM);
      const msgId = copiedMsg.message_id || copiedMsg;

      const { error: dbError } = await supabase.from("message_links").insert([
        {
          message_id: Number(headerMsg.message_id),
          user_id: Number(ctx.from.id),
        },
        { message_id: Number(msgId), user_id: Number(ctx.from.id) },
      ]);

      if (dbError) {
        console.error("Ошибка сохранения в базу данных:", dbError.message);
      }

      await ctx.reply("🚀 Отправлено! Мы скоро изучим твое сообщение.");
    } catch (error) {
      console.error("Ошибка при пересылке админам. Код:", error.error_code);
      await ctx.reply("❌ Не удалось отправить. Попробуй позже.");
    }
    return;
  }

  // --- ЛОГИКА АДМИН -> ПОЛЬЗОВАТЕЛЬ ---
  if (ctx.chat.id === ADMIN_GROUP_ID_NUM && ctx.message.reply_to_message) {
    try {
      const { data, error: fetchError } = await supabase
        .from("message_links")
        .select("user_id")
        .eq("message_id", ctx.message.reply_to_message.message_id)
        .single();

      if (fetchError || !data) {
        await ctx.reply("⚠️ Не удалось найти автора в базе данных.");
        return;
      }

      await ctx.copyMessage(data.user_id);
      await ctx.reply("✅ Ответ доставлен.");
    } catch (error) {
      console.error("Ошибка при ответе:", error.description);
      await ctx.reply("❌ Ошибка доставки.");
    }
  }
});

// 6. НАСТРОЙКА EXPRESS ДЛЯ ВЕБХУКОВ
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
app.use("/secret-path", webhookCallback(bot, "express"));

app.listen(PORT, async () => {
  console.log(`🌍 Сервер слушает порт ${PORT}`);
  try {
    const webhookUrl = process.env.WEB_HOOK_URL;
    await bot.api.setWebhook(webhookUrl);
    console.log(`🤖 Вебхук успешно установлен на: ${webhookUrl}`);
  } catch (err) {
    console.error("❌ Ошибка установки вебхука:", err);
  }
});
