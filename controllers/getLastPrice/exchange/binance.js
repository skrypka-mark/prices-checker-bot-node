import axios from 'axios';
import { DECIMALS } from '../../../constants';

const getLastPrice = async () => {
    try {
        const symbol = 'USDTUAH';
        const url = `https://api.binance.com/api/v3/avgPrice?symbol=${symbol}`;
        const { data: { price } } = await axios.get(url);

        return +Number(price).toFixed(DECIMALS);
    } catch(error) {
        console.log(error);
    }
};

export default getLastPrice;
