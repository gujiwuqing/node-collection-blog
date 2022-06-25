import request, { RequestCallback } from 'request'
import cheerio from 'cheerio'
const uri = 'https://segmentfault.com/channel/frontend'
const segmentfault = function () {
  return new Promise((reslove, reject) => {
    const callback: RequestCallback = function (error, response, body) {
      if (error) {
        reject(error)
      } else {
        const $ = cheerio.load(body, {
          decodeEntities: false
        })
        const group = $('body').find('.list-group').find('.list-group-item')
        const data: Array<string> = []
        group.each(function(i) {
          if (i > 0 && i < 20) {
            let title = $(this).find('.content').html()
               title = title!.replace(/\<div(.*)\/div\>/, '')
               title = title!.replace(/\<(\/)?h5\>/g, '')
               title = title!.replace(/(?<=(href="))/, 'https://segmentfault.com').replace('class="title text-body"', `
               style="
                  color: #999;
                  font-weight: normal;
                  text-decoration: none;
                  font-size: 13px;"
               `)
               data.push(`\t<dd style="list-style-type: none; margin: 0 0 10px 0; padding: 0;">
                <span style="color: #999; font-size: 13px;">${i}. </span>
                ${title}
               </dd>`)
          }
        })
        reslove({
          name: 'segmentfault',
          data
        })
      }
    }
    return request.get(uri, callback)
  })
}

export default segmentfault
