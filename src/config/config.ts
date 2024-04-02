import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

const token = process.env.TG_TOKEN || 'WHERE_MY_TOKEN_?';
export const bot = new TelegramBot(token, { polling: true });
