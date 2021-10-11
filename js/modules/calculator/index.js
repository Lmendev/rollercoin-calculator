import { unit } from './constants.js'
import { blockReward } from '../rollercoin.js'
import { calculateReward } from './ALU.js'

export class Calculator {
    constructor({page, DOMElements}) {
        this.page = page
        this.DOMElements = DOMElements
    }

    init() {
        this.beforeAddEventListeners()
        this.addEventListeners()
    }

    beforeAddEventListeners() {
        switch (this.page){
            case 'index':
                this.handleBlockReward()
                this.handleCoinIcon()
                this.calculate()
                break
            case 'best-coins-to-mine':
                break
        }
    }

    addEventListeners() {
        switch (this.page){
            case 'index':
                this.DOMElements.calculateButton.addEventListener('click', this.calculate.bind(this))
                this.DOMElements.selectBlockReward.addEventListener('change', this.handleBlockReward.bind(this))
                break
            case 'best-coins-to-mine':
                break
        }
    }

    calculate () {
        let networkPowerSelected = this.DOMElements.selectNetworkPower.value
        let inputNetworkPower = parseFloat(this.DOMElements.inputNetworkPower.value || 0) * unit[networkPowerSelected]
        
        let userPowerSelected = this.DOMElements.selectUserPower.value
        let inputUserPower = parseFloat(this.DOMElements.inputUserPower.value || 0) * unit[userPowerSelected]
        
        let inputBlockReward = parseFloat(this.DOMElements.inputBlockReward.value || 0)
        let selectBlockReward = this.DOMElements.selectBlockReward.value
    
        const { expextedReward, dailyReward, weeklyReward, monthlyReward } = calculateReward({ inputNetworkPower, inputUserPower, inputBlockReward, selectBlockReward })
    
        this.DOMElements.resultExpectedReward.innerHTML = expextedReward
        this.DOMElements.resultDailyReward.innerHTML = dailyReward
        this.DOMElements.resultWeeklyReward.innerHTML = weeklyReward
        this.DOMElements.resultMonthlyReward.innerHTML = monthlyReward
        
        this.handleCoinIcon()
    }

    handleCoinIcon () {
        let coin  = blockReward[this.DOMElements.selectBlockReward.value]
    
        this.DOMElements.coinIcon.src = "./img/" + coin.icon
        this.DOMElements.coinIcon.alt = coin.name + " icon"
        this.DOMElements.coinName.innerHTML = coin.name
        this.DOMElements.coinTicker.innerHTML = coin.ticker
    }
    
    handleBlockReward () {
        let blockRewardselected = this.DOMElements.selectBlockReward.value
        let inputBlockReward = this.DOMElements.inputBlockReward
        
        inputBlockReward.value = blockReward[blockRewardselected].dailyReward
        
        this.handleCoinIcon()
    }

    calculateBestCoinsToMine() {
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
}