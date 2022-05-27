import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { Telegraf } from 'telegraf';
import {
    getWhitebitPrice,
    getQmallPrice,
    getBinancePrice
} from './controllers/getLastPrice/exchange';
import {
    getBinanceC2CPrice,
    getHuobiC2CPrice,
    getBybitC2CPrice,
    getOkexC2CPrice
} from './controllers/getLastPrice/p2p';

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);

app.use(cors());

const getPrices = async () => {
    const whitebitPrice = await getWhitebitPrice();
    const qmallPrice = await getQmallPrice();
    const binancePrice = await getBinancePrice();
    const binanceC2CPrice = await getBinanceC2CPrice();
    const huobiC2CPrice = await getHuobiC2CPrice();
    const bybitC2CPrice = await getBybitC2CPrice();
    const okexC2CPrice = await getOkexC2CPrice();

    const result = {
        WhiteBIT: whitebitPrice,
        Qmall: qmallPrice,
        Binance: binancePrice,
        'Binance P2P': binanceC2CPrice,
        'Huobi P2P': huobiC2CPrice,
        'Bybit P2P': bybitC2CPrice,
        'Okex P2P': okexC2CPrice
    };
    return result;

    // console.log('WhiteBIT', whitebitPrice);
    // console.log('Qmall', qmallPrice);
    // console.log('Binance', binancePrice);
    // console.log('Binance P2P', binanceC2CPrice);
    // console.log('Huobi P2P', huobiC2CPrice);
    // console.log('Bybit P2P', bybitC2CPrice);
    // console.log('Okex P2P', okexC2CPrice);
};
const parsePricesToString = prices => {
    let parsedPrices = '';
    Object.keys(prices).forEach(key => {
        parsedPrices += `${key} -> ${typeof prices[key] === 'object' ? `buy - ${prices[key].buy}; sell - ${prices[key].sell}` : prices[key]}\n`;
    });

    return parsedPrices;
};

const reply_markup = {
    reply_markup: {
        inline_keyboard: [[{
            text: 'Load more...',
            callback_data: 'loadMore'
        }]]
    }
};

bot.start(async ctx => {
    const message = 'Hey bastard, there\'re some tasty prices for you. Get the fuck outta here and start trading right away if u don\'t wanna die...';
    ctx.reply(message);
    const prices = await getPrices();
    ctx.reply(parsePricesToString(prices), reply_markup);
});

bot.hears('location', ctx => {
    console.log(ctx.from);
});

bot.action('loadMore', async ctx => {
    const message = 'Fetching... Plz wait, fucker.';
    const reply = await ctx.reply(message);
    const prices = await getPrices();
    await ctx.telegram.deleteMessage(ctx.chat.id, reply.message_id - 1);
    await ctx.telegram.deleteMessage(ctx.chat.id, reply.message_id);
    ctx.reply(parsePricesToString(prices), reply_markup);
});

// app.listen(process.env.PORT, () => console.log(process.env.PORT));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))