const githubApi = 'https://api.github.com'
const owner = 'lmendev'
const repo = 'rollercoin-calculator'

const contributorsURL  = `${githubApi}/repos/${owner}/${repo}/contributors`
const latestReleaseURL = `${githubApi}/repos/${owner}/${repo}/releases/latest`
const latestCommitURL  = `${githubApi}/repos/${owner}/${repo}/commits/main`

export const getContributors = async () => {
  try{
    const response    = await fetch(contributorsURL)
    let contributors  = await response.json();
    contributors = contributors.map(({ login, avatar_url }) => { return { 'user': login, 'avatar': avatar_url } })
    
    return contributors;
  }catch(err){
    console.error(err); 
  }
}

export const getLatestRelease = async () => {
  try{
    const response    = await fetch(latestReleaseURL)
    let latestRelease  = await response.json();
    
    return latestRelease;
  }catch(err){
    console.error(err); 
  }
}

export const getLatestCommit = async () => {
  try{
    const response    = await fetch(latestCommitURL)
    let latestCommit  = await response.json();
    
    return latestCommit;
  }catch(err){
    console.error(err); 
  }
}