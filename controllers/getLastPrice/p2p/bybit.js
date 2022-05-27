import axios from 'axios';
import { DECIMALS } from '../../../constants';

const getLastPrice = async () => {
    try {
        const url = `https://api2.bybit.com/spot/api/otc/item/list`;
        const params = {
            tokenId: 'USDT',
            currencyId: 'UAH',
            payment: 43,
            side: 0,
            page: 1,
            size: 5,
            amount: ''
        };
        const { data: { result: { items: dataBuy } } } = await axios.get(url, { params });

        params.side = 1;
        const { data: { result: { items: dataSell } } } = await axios.get(url, { params });

        const averagePriceBuy = dataBuy.map(({ price }) => price).reduce((prev, cur) => prev + +cur, 0) / dataBuy.length;
        const averagePriceSell = dataSell.map(({ price }) => price).reduce((prev, cur) => prev + +cur, 0) / dataSell.length;

        return {
            buy: +averagePriceBuy.toFixed(DECIMALS),
            sell: +averagePriceSell.toFixed(DECIMALS)
        };
    } catch(error) {
        console.log(error);
    }
};

export default getLastPrice;
