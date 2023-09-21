const express = require('express')
const getWebPageOgMetaTags = require('../utills/getWebPageOgMetaTags')
const ogMetaTagsModel = require('../models/websiteMetadataResponse')
const dbConnection = require('../database')

const router = express.Router()

router.get('/', async (req, res) => {
    let response = {...ogMetaTagsModel}
    console.log('received an request: '+req.originalUrl)
    if(typeof req.query['targeturl'] !== 'undefined'){
        try{
            const parsedUrl = new URL(req.query['targeturl'])
            response.url = parsedUrl.href
            response.host = parsedUrl.hostname
            response.ogMetaTags = await getWebPageOgMetaTags(parsedUrl.href)
            
        } catch (err){
            console.log(err)
            response.url = 'invalid url'
        }

    } else {
        console.log('invalid targeturl param in the request query parameters')
        response.url = 'invalid url'
    }

    console.log(new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+' sended json response:')
    console.log(response)
    res.json(response)

    // save on database:
    console.log('saving on database...')
    dbConnection`INSERT INTO webpages ("url", "host", "ogMetaTags")
    VALUES (
      ${response.url},
      ${response.host},
      ${JSON.stringify(response.ogMetaTags)}
    );`.then(result => {
        console.log('saved on database')
    }).catch(err => {
        console.log(err)
    })
})


router.get('/retrieve_all', async (req, res) => {
    if(req.query['pw'] === '0521'){
        console.log('fetching all data...')
        const response = await dbConnection`SELECT "url", "host", "ogMetaTags"::json as "ogMetaTags" FROM ${ dbConnection('webpages')} ORDER BY id DESC` // add LIMIT 10 at end
        const parsedDataArray = response.map((item) => {
            let parsedItem = { ...item }; // Create a copy of the original object
            parsedItem.ogMetaTags = JSON.parse(item.ogMetaTags); // Parse the JSON string
            return parsedItem; // Return the updated object
        })
        console.log('fetching all data complete')
        res.json(parsedDataArray)
    } else {
        res.status(400).send("Bad Request: Invalid query string.")
        console.log('invalid password')
    }
})

module.exports = router