const SHORT_FIXED = 4
const LONG_FIXED = 8

const secondsInADay = 86400
const secondsInAWeek = 7 * secondsInADay
const secondsInAMonth = 4 * secondsInAWeek + 2 * secondsInADay

const blockReward = {
    "BTC": {
        dailyReward: 0.0003,
        timePerBlock: 600,
        name: "Bitcoin",
        ticker: "BTC",
        icon: "btc.svg"
    },
    "DOGE": {
        dailyReward: 20,
        timePerBlock: 600,
        name: "Dogecoin",
        ticker: "DOGE",
        icon: "doge.svg"
    },
    "ETH": {
        dailyReward: 0.005,
        timePerBlock: 600,
        name: "Ethereum",
        ticker: "ETH",
        icon: "eth.svg"
    },
    "BNB": {
        dailyReward: 0.012,
        timePerBlock: 600,
        name: "Binancecoin",
        ticker: "BNB",
        icon: "bnb.svg"
    },
    "RLT": {
        dailyReward: 30,
        timePerBlock: 600,
        name: "Rollertoken",
        ticker: "RLT",
        icon: "rlt.svg"
    }
}

const unit = {
    "GH/s": 1000000000,
    "TH/s": 1000000000000,
    "PH/s": 1000000000000000,
    "EH/s": 1000000000000000000
}

function calculateRewardPerBlock(networkPower, blockReward, userPower) {
    return networkPower > 0? blockReward * userPower / networkPower : 0
}

function calculate () {
    let networkPowerSelected = document.getElementById("selectNetworkPower").value
    let inputNetworkPower = parseFloat(document.getElementById("inputNetworkPower").value || 0) * unit[networkPowerSelected]
    
    let userPowerSelected = document.getElementById("selectUserPower").value
    let inputUserPower = parseFloat(document.getElementById("inputUserPower").value || 0) * unit[userPowerSelected]
    
    let inputBlockReward = parseFloat(document.getElementById("inputBlockReward").value || 0)

    let { timePerBlock } = blockReward[document.getElementById("selectBlockReward").value]
    
    let rewardPerBlock = calculateRewardPerBlock(inputNetworkPower, inputBlockReward, inputUserPower)

    let expextedReward  = rewardPerBlock.toFixed(LONG_FIXED)
    let dailyReward     = (rewardPerBlock * secondsInADay / timePerBlock).toFixed(SHORT_FIXED)
    let weeklyReward    = (rewardPerBlock * secondsInAWeek / timePerBlock).toFixed(SHORT_FIXED)
    let monthlyReward   = (rewardPerBlock * secondsInAMonth / timePerBlock).toFixed(SHORT_FIXED)

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