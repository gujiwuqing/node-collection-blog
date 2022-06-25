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
            data.push(`\t<dd style="list-style-type: none; margin: 0 0 15px 0; padding: 0;">
              <span style="color: #999; font-size: 13px;">${i - 4}. </span>
              ${title}
            </dd>`)
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
