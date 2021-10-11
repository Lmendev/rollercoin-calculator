import { blockReward } from '../rollercoin.js'
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

export const calculateBestCoinsToMine = () => {
    let btc = parseFloat(document.getElementById("inputNetworkPowerBTC").value || 0) * unit[document.getElementById("selectNetworkPowerBTC").value]
    let doge = parseFloat(document.getElementById("inputNetworkPowerDOGE").value || 0) * unit[document.getElementById("selectNetworkPowerDOGE").value]
    let eth = parseFloat(document.getElementById("inputNetworkPowerETH").value || 0) * unit[document.getElementById("selectNetworkPowerETH").value]
	let bnb = parseFloat(document.getElementById("inputNetworkPowerBNB").value || 0) * unit[document.getElementById("selectNetworkPowerBNB").value]
    let rlt = parseFloat(document.getElementById("inputNetworkPowerRLT").value || 0) * unit[document.getElementById("selectNetworkPowerRLT").value]

    let userPower = parseFloat(document.getElementById("inputUserPower").value || 0) * unit[document.getElementById("selectUserPower").value]

    let networkPower = {btc, doge, eth, bnb, rlt}


    const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,dogecoin,ethereum,binancecoin&vs_currencies=usd"

    fetch(COINGECKO_URL)
    .then(res => res.json())
    .then(coingecko => {
        let newcoingecko = { ...coingecko, "rollertoken": { "usd": 1 }}
        let result = []

        for (ticker in blockReward) {
            let rewardPerBlock = calculateRewardPerBlock(networkPower[ticker.toLowerCase()], parseFloat(blockReward[ticker].dailyReward || 0), userPower)
            let { timePerBlock } = blockReward[ticker]

            let monthlyRewardUSD   = (rewardPerBlock * secondsInAMonth / timePerBlock * newcoingecko[blockReward[ticker].name.toLowerCase()].usd).toFixed(SHORT_FIXED)

            result.push({ 
                ...blockReward[ticker],
                monthlyRewardUSD 
            })
        }

        let resultSorted = result.sort((a, b) => b.monthlyRewardUSD - a.monthlyRewardUSD)

        let tbody = document.getElementById("result-table").getElementsByTagName("tbody")[0]
        tbody.innerHTML = ""

        for (coinResult in resultSorted){
            tbody.innerHTML += 
                `<tr>
                    <td>
                        <p>${resultSorted[coinResult].name}</p>
                    </td>
                    <td>
                        <p>$${resultSorted[coinResult].monthlyRewardUSD} / Month</p>
                    </td>
                </tr>`
        }
    })
    .catch(err => { throw err });
}