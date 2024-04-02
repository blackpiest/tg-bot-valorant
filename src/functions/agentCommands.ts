import moment from "moment";
import { bot } from "../config/config";
import { AgentRooms } from "../types";
import { getRandomInteger } from "../utils";
import { agentList } from "../helpers";

const rooms:AgentRooms = {};
const limitCount = 4;
const timeoutMinutes = 20;
const hourInMs = 3600 * 1000;

const agentCommands = () => {
  bot.onText(/\/agent/, async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;

    const usedAgents = rooms[chatId]?.map(item => item.agent) || [];
    const uniqAgents = agentList.filter(item => !usedAgents.includes(item.name));

    // Проверка на пустой масссив доступных агентов
    if (uniqAgents.length === 0) {
      await bot.sendMessage(chatId, `@${username}, сорри, все агенты уже разобраны. Попробуй позже`);
      return;
    }

    const randomIndex = getRandomInteger(0, uniqAgents.length - 1);
    const agent = uniqAgents[randomIndex].name;
    const currentDate = moment().unix();

    // Если комнаты с чатом нет
    if (!rooms[chatId]) {
      rooms[chatId] = [{ username, agent, date: currentDate, count: 1 }];
      await bot.sendMessage(chatId, `@${username}, может сыграешь за ${agent}?`);
      return;
    };

    const currentUser = rooms[chatId].find(item => item.username === username);

    // Если юзера ещё нет в комнате
    if (!currentUser) {
      rooms[chatId].push({ username, agent, date: currentDate, count: 1 });
      await bot.sendMessage(chatId, `@${username}, может сыграешь за ${agent}?`);
      return;
    }

    // Если счётчик выбора агента привышает limitCount
    if (currentUser?.count > limitCount) {
      const limitDate = moment(currentUser.date * 1000).add(timeoutMinutes, 'm').unix();
      const countMinutes = moment(limitDate * 1000).diff(currentDate * 1000, 'minute');

      if (countMinutes > 0) {
        await bot.sendMessage(chatId, `@${username}, ты адекватный? Играй на ${currentUser.agent}! Сможешь сменить агента через ${countMinutes + 1}мин.`);
      } else {
        rooms[chatId] = rooms[chatId].map(item => item.username === username ? { ...item, agent, date: currentDate, count: 1 } : item);
        await bot.sendMessage(chatId, `@${username}, может сыграешь за ${agent}?`);
      }

      return;
    };

    if (currentUser?.count === limitCount) {
      rooms[chatId] = rooms[chatId].map(item => item.username === username ? { ...item, agent, count: item.count + 1 } : item);
      await bot.sendMessage(chatId, `@${username}, всё ты достал, играй на ${agent}!`);
      return;
    }

    if (currentUser.count < limitCount) {
      rooms[chatId] = rooms[chatId].map(item => item.username === username ? { ...item, agent, count: item.count + 1 } : item);
      await bot.sendMessage(chatId, `@${username}, тогда поиграй за ${agent}!`);
      return;
    }
  });

  setInterval(function () {
    if (Object.keys(rooms).length === 0) return;
    const curDate = moment().unix();
    const lifeHourCount = 1;
    
    Object.keys(rooms).forEach((item) => {
      if (!rooms[item]) return;

      // Очистка выбранного агента у юзера спустя lifeHourCount
      rooms[item].forEach((user, ind) => {
        if (!user) return;
        const timeToClear = moment(user.date * 1000).add(lifeHourCount, 'h').unix();
        if (curDate >= timeToClear) {
          rooms[item] = [...rooms[item].filter((_usr, currentIndex) => currentIndex !== ind)];
          console.log(`Произошла очистка выбранного агента у ${user.username}.`);
          return;
        }
      });
    });

  }, 5000);
}

export default agentCommands;