import fs from 'fs'
import path from 'path'
import render, { Style } from "./render"
import sendMail from "./email"
(async() => {
  const root = path.resolve(__dirname, 'collection')
  const files = fs.readdirSync(root)
  const data: String[] = []
  await Promise.all(
    files.map(item => require(path.resolve(root, item)).default())
  ).then(result => {
    result.forEach(item => {
      data.push(`
      <section class="groups" style="margin-bottom: 10px">
        <dl style="background: #fff;">
          <dt style="list-style-type: none; margin: 0 0 16px 0;">
            <span style="${Style}">${item.name}</span>
          </dt>
          ${(item.data as Array<string>).join('')}
        </dl>
      </section>
      `)
    })
  })
  try {
    sendMail(data.join('\n'))
    // 写入html文件
    const html = render(data.join('\n'))
    fs.mkdirSync(path.resolve(__dirname, '../dist'))
    const indexHtmlPath = path.resolve(__dirname, '../dist/index.html')
    fs.access(indexHtmlPath, (err) => {
      if (err) {
        fs.appendFileSync(indexHtmlPath, html)
      } else {
        fs.writeFileSync(
          indexHtmlPath,
          html,
          'utf8'
        )
      }
    })
  } catch (error) {
    console.log(error)
  }
})()
