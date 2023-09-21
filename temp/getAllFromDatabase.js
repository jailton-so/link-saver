const dbConnection = require('../backend/database')

async function run(tableName){
    const entries = await dbConnection`SELECT * FROM ${ dbConnection(tableName)} ORDER BY id DESC`
    console.log(entries.length)
}

run('webpages')