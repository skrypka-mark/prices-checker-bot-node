import axios from 'axios';
import { DECIMALS } from '../../../constants';

const getLastPrice = async () => {
    try {
        const url = `https://www.okx.com/v3/c2c/tradingOrders/books`;
        const params = {
            quoteCurrency: 'uah',
            baseCurrency: 'usdt',
            side: 'sell',
            paymentMethod: 'Monobank',
            userType: 'all',
            showTrade: false,
            showFollow: false,
            showAlreadyTraded: false,
            isAbleFilter: false
        };
        const headers = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:100.0) Gecko/20100101 Firefox/100.0' };
        const { data: { data: { sell: dataSell } } } = await axios.get(url, { params, headers });

        params.side = 'buy';
        const { data: { data: { buy: dataBuy } } } = await axios.get(url, { params, headers });

        const fewPricesSell = dataSell.slice(0, 5).map(({ price }) => price);
        const averagePriceSell = fewPricesSell.reduce((prev, cur) => prev + +cur, 0) / fewPricesSell.length;

        const fewPricesBuy = dataBuy.slice(0, 5).map(({ price }) => price);
        const averagePriceBuy = fewPricesBuy.reduce((prev, cur) => prev + +cur, 0) / fewPricesBuy.length;

        return {
            buy: +averagePriceBuy.toFixed(DECIMALS),
            sell: +averagePriceSell.toFixed(DECIMALS)
        };
    } catch(error) {
        console.log(error);
    }
};

export default getLastPrice;
