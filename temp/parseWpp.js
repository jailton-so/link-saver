const fs = require('fs')

fs.readFile('./data.txt', (err, data) => {
    const parsed = data.toString().split('\r\n').join(', ')
    fs.writeFile('./dataParsed.txt', parsed, () => {})
})