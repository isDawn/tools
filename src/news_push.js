const cmd = require("child_process").exec;

const cheerio = require('cheerio');

const dingToken = '1b0e55c4b5fa626763ca0ab4d9246bf1febf1f317f4c988b9327060db0e09767';

function sendDingtalk(text) {
    const date = new Date();
    cmd(`curl "https://oapi.dingtalk.com/robot/send?access_token=${dingToken}" \
        -H 'Content-Type: application/json' \
        -d '{
        "msgtype":"markdown",
        "markdown":{
            "title":"每日热门头条",
            "text":"![今日头条](https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20190121%2Fa7ff11acd1544c5d9090698e0009aa54.gif&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640071616&t=54a3ed6998824d8ddfe91f21237a6c2c)
            ${text}
            \n>${date}"
        }
    }'`)
}

function getData() {
    return new Promise((resolve,reject) => {
        cmd(`curl http://news.baidu.com/`, (error, res) => {
            if (error) {
               return reject(null);
            };
            const $ = cheerio.load(res);
            const data = [];
            $('div#pane-news ul li a').each((idx, ele) => {
                const news = {
                    title: $(ele).text(),
                    href: $(ele).attr('href')
                };
                data.push(news);
            });

            console.log('hotNews++++++++++++',data);
            if(data.length > 3) {
                data.length = 3
            }
            resolve(data);        
        })
    })
}

async function main() {
    const newsData = await getData();
    let talks = ``;
    console.log('newsData=====',newsData);
    newsData.forEach((item, index) => {
        talks += `\n#### **[${index+1}. ${item['title']}](${item['href']})**\n---
        `
    })
    console.log('talks======',talks);
    sendDingtalk(talks)
}

module.exports = main;

