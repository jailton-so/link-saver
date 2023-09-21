const path = require('path');
const postgres = require('postgres')
require('dotenv').config({path: path.join(__dirname, '.env')})

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`

module.exports = postgres(URL, { ssl: 'require' })

// async function getPgVersion() {
//   const result = await sql`select version()`
//   console.log(result)
// }

// getPgVersion();