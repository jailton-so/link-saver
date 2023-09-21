const fs = require('fs')
const dbConnection = require('../backend/database')
const responseModel = require('../backend/models/websiteMetadataResponse')
const getWebPageOgMetaTags = require('../backend/utills/getWebPageOgMetaTags')

async function requestAll (url){
    let response = {...responseModel}
    try{
        const parsedUrl = new URL(url)
        response.url = parsedUrl.href
        response.host = parsedUrl.hostname
        response.ogMetaTags = await getWebPageOgMetaTags(parsedUrl.href)
        
    } catch (err){
        console.log(err)
        response.url = 'invalid url'
    }

    console.log(new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds())
    return response
}


async function run(url){
    const entries = await requestAll(url)
    console.log('start');
    await dbConnection`INSERT INTO webpages ("url", "host", "ogMetaTags")
    VALUES (
      ${entries.url},
      ${entries.host},
      ${JSON.stringify(entries.ogMetaTags)}
    );`.then(result => {
        console.log('db.end')
    }).catch(err => {
        console.log('error')
    })
    console.log('end\n')
}

let urls
fs.readFile('./wppAll.txt', (err, data) => {
    urls = data.toString().split(', ')
    async function test(){
        for(let i=0; i<urls.length; i++){
            await run(urls[i])
        }
    }
    test()
})

