import { unit } from './constants.js'
import { blockReward } from '../rollercoin.js'
import { calculateRewardPerBlock, calculateReward, calculateBestCoinsToMine } from './ALU.js'

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
                this.handleTimePerBlock()
                this.calculate()
                break
            case 'bestCoinsToMine':
                break
        }
    }

    addEventListeners() {
        switch (this.page){
            case 'index':
                this.DOMElements.calculateButton.addEventListener('click', this.calculate.bind(this))
                this.DOMElements.selectBlockReward.addEventListener('change', this.handleBlockReward.bind(this))
                break
            case 'bestCoinsToMine':
                this.DOMElements.calculateButton.addEventListener('click', this.calculateBestCoins.bind(this))
                break
        }
    }

    async calculate () {
        let networkPowerSelected = this.DOMElements.selectNetworkPower.value
        let inputNetworkPower = parseFloat(this.DOMElements.inputNetworkPower.value || 0) * unit[networkPowerSelected]
        
        let userPowerSelected = this.DOMElements.selectUserPower.value
        let inputUserPower = parseFloat(this.DOMElements.inputUserPower.value || 0) * unit[userPowerSelected]
        
        let inputBlockReward = parseFloat(this.DOMElements.inputBlockReward.value || 0)
        let selectBlockReward = this.DOMElements.selectBlockReward.value

        let inputTimePerBlock = parseFloat(this.DOMElements.inputTimePerBlock.value || 0)
        let selectTimePerBlock = this.DOMElements.selectTimePerBlock.value
    
        const { 
            expextedReward, 
            dailyReward, 
            weeklyReward, 
            monthlyReward,
            expextedUsdReward, 
            dailyUsdReward, 
            weeklyUsdReward, 
            monthlyUsdReward
        } = await calculateReward({ 
            inputNetworkPower,
            inputUserPower,
            inputBlockReward,
            selectBlockReward,
            inputTimePerBlock, 
            selectTimePerBlock
        })

        this.DOMElements.resultExpectedReward.innerHTML = expextedReward
        this.DOMElements.resultDailyReward.innerHTML = dailyReward
        this.DOMElements.resultWeeklyReward.innerHTML = weeklyReward
        this.DOMElements.resultMonthlyReward.innerHTML = monthlyReward

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        this.DOMElements.resultExpectedUsdReward.innerHTML = formatter.format(expextedUsdReward)
        this.DOMElements.resultDailyUsdReward.innerHTML = formatter.format(dailyUsdReward)
        this.DOMElements.resultWeeklyUsdReward.innerHTML = formatter.format(weeklyUsdReward)
        this.DOMElements.resultMonthlyUsdReward.innerHTML = formatter.format(monthlyUsdReward)

        this.handleCoinIcon()
    }

    handleCoinIcon () {
        const reservedNames = ['', 'rollercoin-calculator', 'index.html']
        let prefix = window.location.pathname.split('/').filter(s => !reservedNames.includes(s)).pop()? '..' : '.'

        let coin  = blockReward[this.DOMElements.selectBlockReward.value]

        this.DOMElements.coinIcon.src = prefix + "/img/" + coin.icon
        this.DOMElements.coinIcon.alt = coin.name + " icon"
        this.DOMElements.coinName.innerHTML = coin.name
        this.DOMElements.coinTicker.innerHTML = coin.ticker
    }
    
    handleBlockReward () {
        let blockRewardselected = this.DOMElements.selectBlockReward.value
        let inputBlockReward = this.DOMElements.inputBlockReward

        inputBlockReward.value = blockReward[blockRewardselected].dailyReward

        this.handleTimePerBlock()
        this.handleCoinIcon()
    }

    handleTimePerBlock () {
        let blockRewardselected = this.DOMElements.selectBlockReward.value
        let inputTimePerBlock = this.DOMElements.inputTimePerBlock
        let selectTimePerBlock = this.DOMElements.selectTimePerBlock

        inputTimePerBlock.value = blockReward[blockRewardselected].timePerBlock
        selectTimePerBlock.value = "SECONDS"
    }

    async calculateBestCoins() {
        let btc = parseFloat(this.DOMElements.inputNetworkPowerBTC.value || 0)      * unit[this.DOMElements.selectNetworkPowerBTC.value]
        let doge = parseFloat(this.DOMElements.inputNetworkPowerDOGE.value || 0)    * unit[this.DOMElements.selectNetworkPowerDOGE.value]
        let eth = parseFloat(this.DOMElements.inputNetworkPowerETH.value || 0)      * unit[this.DOMElements.selectNetworkPowerETH.value]
        let bnb = parseFloat(this.DOMElements.inputNetworkPowerBNB.value || 0)      * unit[this.DOMElements.selectNetworkPowerBNB.value]
        let matic = parseFloat(this.DOMElements.inputNetworkPowerMATIC.value || 0)  * unit[this.DOMElements.selectNetworkPowerMATIC.value]
        let rlt = parseFloat(this.DOMElements.inputNetworkPowerRLT.value || 0)      * unit[this.DOMElements.selectNetworkPowerRLT.value]
        let sol = parseFloat(this.DOMElements.inputNetworkPowerSOL.value || 0)      * unit[this.DOMElements.selectNetworkPowerSOL.value]
        let trx = parseFloat(this.DOMElements.inputNetworkPowerTRX.value || 0)      * unit[this.DOMElements.selectNetworkPowerTRX.value]
        let ltc = parseFloat(this.DOMElements.inputNetworkPowerLTC.value || 0)      * unit[this.DOMElements.selectNetworkPowerLTC.value]

        let networkPower = {btc, doge, eth, bnb, rlt, matic, sol, trx, ltc}
    
        let userPower = parseFloat(this.DOMElements.inputUserPower.value || 0) * unit[this.DOMElements.selectUserPower.value]
    
        let bestCoinsToMine = await calculateBestCoinsToMine({ networkPower, userPower })
        
        if(bestCoinsToMine?.data) {
            let tbody = this.DOMElements.resultTableBody
            tbody.innerHTML = ""
    
            for (let coinResult in bestCoinsToMine.data){
                tbody.innerHTML += 
                    `<tr>
                        <td>
                            <p>${bestCoinsToMine.data[coinResult].name}</p>
                        </td>
                        <td>
                            <p>$${bestCoinsToMine.data[coinResult].monthlyRewardUSD} / Month</p>
                        </td>
                    </tr>`
            }
        }
    }
}
