import axios from 'axios';
import { DECIMALS } from '../../../constants';

const getLastPrice = async () => {
    try {
        const url = `https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search`;
        const params = {
            asset: 'USDT',
            fiat: 'UAH',
            tradeType: 'SELL',
            payTypes: ['Monobank'],
            page: 1,
            rows: 5
        };
        const { data: { data: dataBuy } } = await axios.post(url, params);

        params.tradeType = 'BUY';
        const { data: { data: dataSell } } = await axios.post(url, params);

        const averagePriceBuy = dataBuy.map(({ adv: { price } }) => price).reduce((prev, cur) => prev + +cur, 0) / dataBuy.length;
        const averagePriceSell = dataSell.map(({ adv: { price } }) => price).reduce((prev, cur) => prev + +cur, 0) / dataSell.length;

        return {
            buy: +averagePriceBuy.toFixed(DECIMALS),
            sell: +averagePriceSell.toFixed(DECIMALS)
        };
    } catch(error) {
        console.log(error);
    }
};

export default getLastPrice;
