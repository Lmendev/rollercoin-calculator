import { blockReward } from '../rollercoin.js'
import { LONG_FIXED, SHORT_FIXED, secondsInADay, secondsInAMonth, secondsInAWeek } from './constants.js'

export const calculateRewardPerBlock = (networkPower, blockReward, userPower) => networkPower > 0? blockReward * userPower / networkPower : 0

export const calculateReward = ({ inputNetworkPower, inputUserPower, inputBlockReward, selectBlockReward }) => {    
    let rewardPerBlock = calculateRewardPerBlock(inputNetworkPower, inputBlockReward, inputUserPower)
    
    let { timePerBlock } = blockReward[selectBlockReward]
    
    let expextedReward  = rewardPerBlock.toFixed(LONG_FIXED)
    let dailyReward     = (rewardPerBlock * secondsInADay / timePerBlock).toFixed(SHORT_FIXED)
    let weeklyReward    = (rewardPerBlock * secondsInAWeek / timePerBlock).toFixed(SHORT_FIXED)
    let monthlyReward   = (rewardPerBlock * secondsInAMonth / timePerBlock).toFixed(SHORT_FIXED)

    return { expextedReward, dailyReward, weeklyReward, monthlyReward }
}

export const calculateBestCoinsToMine = async ({networkPower, userPower}) => {
    const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,dogecoin,ethereum,binancecoin,matic-network,solana&vs_currencies=usd"
        
    try{
        let res         = await fetch(COINGECKO_URL) 
        let coingecko   = await res.json()

        let newcoingecko = { ...coingecko, "rollertoken": { "usd": 1 }}
        let result = []

        for (let ticker in blockReward) {
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
