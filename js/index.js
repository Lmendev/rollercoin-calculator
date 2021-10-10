import { unit } from './modules/constants.js'
import { blockReward } from './modules/rollercoin.js'
import { calculateReward } from './modules/calculator.js'

function calculate () {
    let networkPowerSelected = document.getElementById("selectNetworkPower").value
    let inputNetworkPower = parseFloat(document.getElementById("inputNetworkPower").value || 0) * unit[networkPowerSelected]
    
    let userPowerSelected = document.getElementById("selectUserPower").value
    let inputUserPower = parseFloat(document.getElementById("inputUserPower").value || 0) * unit[userPowerSelected]
    
    let inputBlockReward = parseFloat(document.getElementById("inputBlockReward").value || 0)
    let selectBlockReward = document.getElementById("selectBlockReward").value

    const { expextedReward, dailyReward, weeklyReward, monthlyReward } = calculateReward({ inputNetworkPower, inputUserPower, inputBlockReward, selectBlockReward })

    document.getElementById("resultExpectedReward").innerHTML = expextedReward
    document.getElementById("resultDailyReward").innerHTML = dailyReward
    document.getElementById("resultWeeklyReward").innerHTML = weeklyReward
    document.getElementById("resultMonthlyReward").innerHTML = monthlyReward

    handleCoinIcon()
}

function handleCoinIcon () {
    let coin  = blockReward[document.getElementById("selectBlockReward").value]

    document.getElementById("coinIcon").src = "./img/" + coin.icon
    document.getElementById("coinIcon").alt = coin.name + " icon"
    document.getElementById("coinName").innerHTML = coin.name
    document.getElementById("coinTicker").innerHTML = coin.ticker
}

function handleBlockReward () {
    let blockRewardselected = document.getElementById("selectBlockReward").value
    let inputBlockReward = document.getElementById("inputBlockReward")
    
    inputBlockReward.value = blockReward[blockRewardselected].dailyReward
    
    handleCoinIcon()
}

function calculateBestCoinsToMine(){
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

handleBlockReward()
handleCoinIcon()
calculate()

document.getElementById('calculateButton').addEventListener('click', calculate)
document.getElementById('selectBlockReward').addEventListener('change', handleBlockReward)