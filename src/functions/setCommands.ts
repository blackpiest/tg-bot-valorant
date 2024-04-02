import { bot } from "../config/config";

const commands = [
  { command: 'go', description: 'Присоединиться или собрать пати в валик' },
  { command: 'agent', description: 'Выбрать рандомного агента' },
  { command: 'stop', description: 'Остановить набор в валик' },
]

bot.setMyCommands(commands);