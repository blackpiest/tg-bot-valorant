import moment from "moment";
import { bot } from "../config/config";
import { PartyRooms } from "../types";

const rooms: PartyRooms = {};
const timeoutMin = 10;

const partyCommands = () => {
  bot.onText(/\/go/, async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;

    if (!rooms[chatId]) {
      rooms[chatId] = {
        count: 1,
        isStart: true,
        finalTime: moment().add(timeoutMin, 'm').unix(),
        users: [username],
      }

      await bot.sendMessage(chatId, `Внимание! @${username} начал набор в валик! Если хочешь присоединиться, \nпиши "/go" в чат.`);
      return;
    };

    if (rooms[chatId].users?.includes(username)) {
      await bot.sendMessage(chatId, `@${username}, ты уже и так записан. Успокойся!`);
      return
    };

    if (rooms[chatId].count < 5 && rooms[chatId].isStart) {
      rooms[chatId].count += 1;
      rooms[chatId].finalTime = moment().add(timeoutMin, 'm').unix(),
        rooms[chatId].users = [...rooms[chatId].users, msg.from.username];
      const answer = `Игрок#${rooms[chatId].count} @${username} подтвердил участие.`;

      await bot.sendMessage(chatId, answer);

      if (rooms[chatId].count === 5) {
        await bot.sendMessage(chatId, `Состав нагибаторов набран!`);
        delete rooms[chatId];
      }
    }

  });

  bot.onText(/\/stop/, async (msg) => {
    const chatId = msg.chat.id;

    if (!rooms[chatId] || !rooms[chatId]?.isStart) {
      await bot.sendMessage(chatId, 'Тебя и так никто никуда и не звал.');
      return;
    }

    delete rooms[chatId];

    await bot.sendMessage(chatId, 'Набор в валик отменён, школьники могут играть спокойно.');
  });

  setInterval(function () {
    if ((Object.keys(rooms).length === 0)) return;

    Object.keys(rooms).forEach(async (item) => {
      if (!rooms[item].isStart) return;

      const curDate = moment().unix();
      const finalTime = rooms[item].finalTime;
      console.log(curDate, finalTime);

      if (curDate >= finalTime && rooms[item].count > 1) {
        await bot.sendMessage(item, `Расчёт окончен. В валик идут: ${rooms[item].users.map(name => `@${name}`).join(', ')}.`);
        delete rooms[item];
        return;
      }

      if (curDate >= finalTime) {
        await bot.sendMessage(item, `Набор в валик отменён, никто не захотел c @${rooms[item].users[0]} раскидывать нубов.`);
        delete rooms[item];
      }
    })

  }, 5000);
}

export default partyCommands;