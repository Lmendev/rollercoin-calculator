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

function calculate () {
    let networkPowerSelected = document.getElementById("selectNetworkPower").value
    let inputNetworkPower = parseFloat(document.getElementById("inputNetworkPower").value || 0) * unit[networkPowerSelected]
    
    let userPowerSelected = document.getElementById("selectUserPower").value
    let inputUserPower = parseFloat(document.getElementById("inputUserPower").value || 0) * unit[userPowerSelected]
    
    let inputBlockReward = parseFloat(document.getElementById("inputBlockReward").value || 0)

    let { timePerBlock } = blockReward[document.getElementById("selectBlockReward").value]
    
    let rewardPerBlock = inputNetworkPower > 0? inputBlockReward * inputUserPower / inputNetworkPower : 0

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

handleBlockReward()
handleCoinIcon()
calculate()