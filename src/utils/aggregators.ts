
import axios from 'axios';
import rateLimit from 'axios-rate-limit';
const httpOneInch = rateLimit(axios.create(), { maxRequests: 1, perMilliseconds: 1000, maxRPS: 1 })
const paraSwap = rateLimit(axios.create(), { maxRPS: 0.5 })
const env = import.meta.env;

export async function fetchPrice(inToken: string, outToken: string, amount: string) {
    const url = `https://api.1inch.exchange/v3.0/137/quote?fromTokenAddress=${inToken}&toTokenAddress=${outToken}&amount=${amount}`;
    try {

        let res = await httpOneInch.get(url);
        return {
            srcUSD: res.data.srcUSD,
            dstUSD: res.data.dstUSD,
            gasCostUSD: res.data.gasCostUSD,
        }
    } catch (e) {
        console.log(e);
        return {}
    }
}

export async function fetchParaPrice(inToken: string, outToken: string, amount: string) {
    outToken = outToken === '0x0000000000000000000000000000000000000000' ? env.VITE_WRAPPED_MATIC : outToken;
    inToken = inToken === '0x0000000000000000000000000000000000000000' ? env.VITE_WRAPPED_MATIC : inToken;

    const url = `https://apiv5.paraswap.io/prices/?srcToken=${inToken}&destToken=${outToken}&amount=${amount}&srcDecimals=18&destDecimals=18&side=SELL&network=137`;
    // const wrapped = `http://doroxy.com.global.prod.fastly.net/?target=${encodeURIComponent(url)}`;
    try {
        let res = await paraSwap.get(url);
        return {
            // srcUSD: res.data.priceRoute.srcUSD,
            // destUSD: res.data.priceRoute.destUSD,
            // gasCostUSD: res.data.priceRoute.gasCostUSD,
            ...res.data.priceRoute
        }
    } catch (e) {
        console.log(e);
        return {
            srcUSD: 0,
            destUSD: 0,
            gasCostUSD: 0,
        }
    }
}