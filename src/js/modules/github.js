const githubApi = 'https://api.github.com'
const owner = 'lmendev'
const repo = 'rollercoin-calculator'

const contributors  = `${githubApi}/repos/${owner}/${repo}/contributors`
const latestRelease = `${githubApi}/repos/${owner}/${repo}/releases/latest`
const latestCommit  = `${githubApi}/repos/${owner}/${repo}/commits/main`

const API_URL = contributors

async function fetchUsers() {
 try{
   const response = await fetch(API_URL)
   const users = await response.json();
   return users;
  }catch(err){
    console.error(err); 
  }
}

fetchUsers().then(users => {
  console.log(users); // fetched users
});

console.log(contributors)