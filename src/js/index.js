import { DOMElements } from './modules/DOMElements.js'
import { Calculator } from './modules/calculator/index.js'

const app = new Calculator({
    page: document.body.id,
    DOMElements
})

app.init()