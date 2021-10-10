import { blockReward } from './rollercoin.js'
import { LONG_FIXED, SHORT_FIXED, secondsInADay, secondsInAMonth, secondsInAWeek } from './constants.js'

const calculateRewardPerBlock = (networkPower, blockReward, userPower) => networkPower > 0? blockReward * userPower / networkPower : 0

export const calculateReward = ({ inputNetworkPower, inputUserPower, inputBlockReward, selectBlockReward }) => {    
    let rewardPerBlock = calculateRewardPerBlock(inputNetworkPower, inputBlockReward, inputUserPower)
    
    let { timePerBlock } = blockReward[selectBlockReward]
    
    let expextedReward  = rewardPerBlock.toFixed(LONG_FIXED)
    let dailyReward     = (rewardPerBlock * secondsInADay / timePerBlock).toFixed(SHORT_FIXED)
    let weeklyReward    = (rewardPerBlock * secondsInAWeek / timePerBlock).toFixed(SHORT_FIXED)
    let monthlyReward   = (rewardPerBlock * secondsInAMonth / timePerBlock).toFixed(SHORT_FIXED)

    return { expextedReward, dailyReward, weeklyReward, monthlyReward }
}