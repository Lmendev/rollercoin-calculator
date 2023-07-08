import { blockReward } from '../rollercoin.js'
import { LONG_FIXED, SHORT_FIXED, secondsInADay, secondsInAMonth, secondsInAWeek, TIME_UNIT } from './constants.js'

const getTimePerBlock = (inputTimePerBlock, selectTimePerBlock) => inputTimePerBlock * TIME_UNIT[selectTimePerBlock]

export const calculateRewardPerBlock = (networkPower, blockReward, userPower) => networkPower > 0? blockReward * userPower / networkPower : 0

export const calculateReward = async ({ inputNetworkPower, inputUserPower, inputBlockReward, selectBlockReward, inputTimePerBlock, selectTimePerBlock }) => { 
    const COINGECKO_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${blockReward[selectBlockReward].coinGeckoId}&vs_currencies=usd`
    let usdPrice = 0

    try{
        let res         = await fetch(COINGECKO_URL)
        let coingecko   = await res.json()

        usdPrice = Object.values(coingecko)[0].usd
    }catch(warn) { 
        console.warn(warn)
    }

    let rewardPerBlock = calculateRewardPerBlock(inputNetworkPower, inputBlockReward, inputUserPower)
    
    let timePerBlock = getTimePerBlock(inputTimePerBlock, selectTimePerBlock)
    
    let expextedReward  = rewardPerBlock.toFixed(LONG_FIXED)
    let dailyReward     = (rewardPerBlock * secondsInADay / timePerBlock).toFixed(SHORT_FIXED)
    let weeklyReward    = (rewardPerBlock * secondsInAWeek / timePerBlock).toFixed(SHORT_FIXED)
    let monthlyReward   = (rewardPerBlock * secondsInAMonth / timePerBlock).toFixed(SHORT_FIXED)

    const expextedUsdReward = expextedReward    * usdPrice
    const dailyUsdReward    = dailyReward       * usdPrice
    const weeklyUsdReward   = weeklyReward      * usdPrice
    const monthlyUsdReward  = monthlyReward     * usdPrice

    return { expextedReward, dailyReward, weeklyReward, monthlyReward, expextedUsdReward, dailyUsdReward, weeklyUsdReward, monthlyUsdReward}
}

export const calculateBestCoinsToMine = async ({networkPower, userPower}) => {
    const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,dogecoin,ethereum,binancecoin,matic-network,solana,tron,litecoin&vs_currencies=usd"
        
    try{
        let res         = await fetch(COINGECKO_URL) 
        let coingecko   = await res.json()

        let newcoingecko = { ...coingecko, "rollertoken": { "usd": 1 }}
        let result = []

        for (let ticker in blockReward) {
            if (blockReward[ticker].ticker === undefined) continue

            let rewardPerBlock = calculateRewardPerBlock(networkPower[ticker.toLowerCase()], parseFloat(blockReward[ticker].dailyReward || 0), userPower)
            let { timePerBlock } = blockReward[ticker]

            let monthlyRewardUSD   = (rewardPerBlock * secondsInAMonth / timePerBlock * (newcoingecko[blockReward[ticker].name.toLowerCase()] || newcoingecko[blockReward[ticker].ticker] ).usd).toFixed(SHORT_FIXED)

            result.push({ 
                ...blockReward[ticker],
                monthlyRewardUSD 
            })
        }

        let resultSorted = result.sort((a, b) => b.monthlyRewardUSD - a.monthlyRewardUSD)

        return { data: resultSorted }
    }catch(err) { 
        throw err 
    }
}
