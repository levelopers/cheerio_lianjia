const axios = require('axios')
const fs = require('fs')
var cheerio = require("cheerio")

const url = 'https://bj.lianjia.com/xiaoqu/'
const pageNumber = 30
async function run() {
    let result = []
    const request = []
    for (let i = 0; i < pageNumber; i++) {
        let _url = url + `pg${i}cro21/`
        request.push(getData(_url))
    }
    Promise.all(request).then(res => {
        console.log(res.length);
        writeFile(JSON.stringify(res.flat(1)))
    })
}
run()

async function getData(url) {
    const _result = []
    const res = await axios.get(url)
    var $ = cheerio.load(res.data)
    let list = $('li.xiaoquListItem')
    for (let i = 0; i < list.length; i++) {
        var li = list.eq(i)
        const title = query(li, '.title a')
        const address = query(li, '.positionInfo')
        const info = query(li, '.houseInfo')
        const totalPrice = query(li, '.totalPrice')
        const unitPrice = query(li, '.unitPrice')
        _result.push({ title, address, info, totalPrice, unitPrice })
    }
    return _result
}

function query(node, q) {
    return node.find(q).text().trim()
}

function writeFile(data) {
    fs.writeFileSync('./output.json', data)
}