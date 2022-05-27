import axios from 'axios';
import { DECIMALS } from '../../../constants';

const getLastPrice = async () => {
    try {
        const market = 'USDT_UAH';
        const url = `https://api.qmall.io/api/v1/public/ticker?market=${market}`;
        const { data: { result: { last } } } = await axios.get(url);

        return +Number(last).toFixed(DECIMALS);
    } catch(error) {
        console.log(error);
    }
};

export default getLastPrice;
