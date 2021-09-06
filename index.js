const axios = require('axios')
const fs = require('fs')
var cheerio = require("cheerio")

const url = 'https://bj.lianjia.com/xiaoqu/'
const pageNumber = 30

const xiaoqu = [
    'dongcheng',
    'xicheng',
    'chaoyang',
    'haidian',
    'fengtai',
    'shijingshan',
    'tongzhou',
    'changping',
    'daxing',
    'yizhuangkaifaqu',
    'shunyi',
    'fangshan',
    'mentougou',
    'pinggu',
    'huairou',
    'miyun',
    'yanqing'
]

async function run() {
    const request = []
    for (let i = 0; i < xiaoqu.length; i++) {
        for (let j = 0; j < pageNumber; j++) {
            let _url = url + `${xiaoqu[i]}/pg${j + 1}cro21/`
            request.push(getData(_url))
        }
    }

    Promise.all(request).then(res => {
        console.log(res.flat(1).length);
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
        const totalSellCount = query(li, '.totalSellCount')
        _result.push({ title, address, info, totalPrice, totalSellCount, unitPrice })
    }
    return _result
}

function query(node, q) {
    return node.find(q).text().trim()
}

function writeFile(data) {
    fs.writeFileSync('./output.json', data)
}