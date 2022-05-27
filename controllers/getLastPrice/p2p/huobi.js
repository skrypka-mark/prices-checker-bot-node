import axios from 'axios';
import { DECIMALS } from '../../../constants';

const getLastPrice = async () => {
    try {
        const url = `https://otc-api.trygofast.com/v1/data/trade-market`;
        const params = {
            coinId: 2,
            currency: 45,
            tradeType: 'sell',
            currPage: 1,
            payMethod: 49,
            acceptOrder: '',
            country: '',
            blockType: 'general',
            online: 1,
            range: 0,
            amount: '',
            isThumbsUp: false,
            isMerchant: false,
            isTraded: false,
            onlyTradable: false
        };
        const { data: { data: dataSell } } = await axios.get(url, { params });

        params.tradeType = 'buy';
        const { data: { data: dataBuy } } = await axios.get(url, { params });

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
