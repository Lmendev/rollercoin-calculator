import { DOMElements } from './modules/DOMElements.js'
import { Calculator } from './modules/calculator/index.js'
import { getContributors, getLatestRelease, getLatestCommit } from './modules/github.js'

const app = new Calculator({
    page: document.body.id,
    DOMElements
})

app.init()

getContributors().then(contributors => {
    console.log(contributors)
})

getLatestRelease().then(lastestRelease => {
    document.getElementById("lastestRelease").innerHTML = lastestRelease.tag_name
})

getLatestCommit().then(latestCommit => {
    const lastUpdate = new Date(latestCommit.commit.committer.date)
    
    let year  = lastUpdate.getFullYear()
    let month = lastUpdate.getMonth() + 1
    let day   = lastUpdate.getDate()
    
    month = month < 10? '0'+month: month
    day   = day < 10? '0'+day: day

    document.getElementById("dateForLastUpdate").innerHTML = 'Last update: ' + year + '-' + month + '-' + day
    console.log(new Date(latestCommit.commit.committer.date))
})