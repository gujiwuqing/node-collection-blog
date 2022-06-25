## 前言
一直都有这个想法，只是没有去做，最近闲下来实现了一把，这样也省下了我每天不少的时间到处找文章看，岂不是美哉，开放出来也希望大家共同维护，也可以留下你的邮件我把你加进去你也可以每天收到推送的文章

## 项目结构


```js
|- package.json
|- README.md
|- tsconfig.json
|- src
    |- main.ts // 批量获取采集后的数据，并发送邮件
    |- email.ts // 配置邮件并定义发送邮件的方法
    |- render.ts // 渲染html的方法
    |- collection // 采集文章文件夹
       |- cnode.ts
       |- segmentfault.ts
       |- cloudTencent.ts
       ...
|- .github
    |-workflows
       |- deploy.yml # 这个自己自定义的
```

项目地址 https://github.com/tcly861204/node-collection-blog

## 简单熟悉一下项目使用到的前端库
+ 第一： nodemailer库的认识
node发送邮件的话主要就是靠这个库

```js
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs  = require('fs');
const path = require('path');

let transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用内置传输发送邮件 查看支持列表
  port: 465, // SMTP 端口
  secureConnection: true, // 使用 SSL
  auth: {
    user: 'xxxxxx@qq.com',
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: 'xxxxxx',
  }
});

let mailOptions = {
  from: '<xxxxx@qq.com>', // sender address
  to: 'xxxxxxxx@163.com', // list of receivers
  subject: 'Hello', // Subject line
  // 发送text或者html格式
  // text: 'Hello world?', // plain text body
  html: fs.createReadStream(path.resolve(__dirname, 'email.html')) // 流
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('');
});


```

+ 第二： request库的认识
这个库主要是服务端发送请求用的，把请求回来的接口拿到做一下代码的解析, 在这个项目里面只需要知道这一点就够了，详细的用法可以百度
```js
const request = require('request')
request.get('https://www.baidu.com/', (error, response, body) => {
  if (!err && response.statusCode == 200) { 
    console.log(body)
  }
})
```
+ 第三： cheerio
这个库的话就是node版本的jQuery，实在和
```js
const cheerio = require('cheerio'),
$ = cheerio.load('<h2 class = "title">Hello world</h2>');
$('h2.title').text('Hello there!');
$('h2').addClass('welcome');
$.html();
```

## 源码解析
先看如何去采集文章, 就拿cnode举例，这里没有拿接口去读，写完cnode不用封我的哈

```js
import request, { RequestCallback } from 'request'
import cheerio from 'cheerio'
const uri = 'https://cnodejs.org'
const cnode = function () {
  return new Promise((reslove, reject) => {
    const callback: RequestCallback = function (error, response, body) {
      if (error) {
        reject(error)
      } else {
        const $ = cheerio.load(body, {
          decodeEntities: false
        })
        const group = $('body').find('#topic_list').find('.cell')
        const data: Array<string> = []
        group.each(function(i) {
          if (i > 4 && i < 20) {
            let title = $(this).find('.topic_title_wrapper').html()
            title = title!.replace(/(\<span.*\<\/span\>)/g, '').trim()
            title = title.replace(/(?<=(href="))/, 'https://cnodejs.org').replace('class="topic_title"', `
              style="
                color: #999;
                font-weight: normal;
                text-decoration: none;
                font-size: 13px;"
            `)
            data.push(`\t<dl style="list-style-type: none; margin: 0 0 15px 0; padding: 0;">
              <span style="color: #999; font-size: 13px;">${i - 4}. </span>
              ${title}
            </dl>`)
          }
        })
        reslove({
          name: 'cnode',
          data
        })
      }
    }
    return request.get(uri, callback)
  })
}

export default cnode

```

配置邮件发送

```js
import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  // 发给QQ邮箱
  service: 'QQ',
  // 权限认证
  auth: {
    user: '356671808@qq.com',
    // !! 这里读的github里面的环境变量，是我本人的信息，本地跑的话一定需要改这里
    pass: process.env.QQ_PASS
  }
})

// 这里定义的接收邮件，需要邮件接收的留下邮件地址
const ACCOUNTS = [
  '356671808@qq.com',
  'tcly861204@hotmail.com'
]

const sendMail = function(options: string) {
  let mailOptions = {
    from: `"cobill"<356671808@qq.com>`, // 发邮件的账号
    to: ACCOUNTS.join(', '), // 收邮件的账号
    subject: '前端每日必看', // 邮件的标题
    html: `${options}`      // 邮寄的内容
  }
  transporter.sendMail(mailOptions, (err: any, info: any) => {
    if (!err) {
      console.log('邮件已经发送完成')
    }
  })
}
export default sendMail

```
最后就是github的配置了，不明白的话其实可以百度，讲的比我还详细
```yml
name: collection-blog
on:
  push:
    branches: [main]
  schedule:
    # 定时任务，在每天的5点推送信息到邮箱
    - cron: '0 21 * * *'

env:
    cache-name: note
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js v14.x
        uses: actions/setup-node@v1
        with:
          node-version: '14.x'
  
      - name: Cache nodemodules
        uses: actions/cache@v1
        env:
            cache-name: cache-node-modules
        with:
            # 需要缓存的文件的路径
            path: ./node_modules 
            # 对缓存的文件指定的唯一标识
            key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('./package.json') }} 
            # 用于没有再找目标key的缓存的backup选项
            restore-keys: |
                ${{ runner.os }}-build-${{ env.cache-name }}-
                ${{ runner.os }}-build-
                ${{ runner.os }}-

      - name: Install
        run: npm install # 安装依赖

      - name: Build
        env:
          ## QQ_PASS在github的Actions secrets 里面配置
          QQ_PASS: ${{secrets.QQ_PASS}}
        run: npm run build

```

## 项目总结
项目还是比较简单，然后把需要采集文章的地方都放在一块了，利用fs模块一次性读取，利用Promise回调拿到采集回来的数字，然后去发送邮件、

## 最终的样子
只展示部分，因为我采集了好几篇文章的
![采集邮件](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4e134da099248748340ff48a0db4d5a~tplv-k3u1fbpfcp-watermark.image?)