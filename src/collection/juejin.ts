import request, { RequestCallback } from 'request'
const uri = 'https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed'
const juejin = function () {
  return new Promise((reslove, reject) => {
    const data: Array<string> = []
    let index = 0
    const callback: RequestCallback = function (error, response, body) {
      if (error) {
        reject(error)
      } else {
        try {
          body.data.map((item: any) => {
            try {
              const { article_id, title } = item.item_info.article_info
              index += 1
              data.push(`
                <dd style="list-style-type: none; margin: 0 0 10px 0; padding: 0;">
                  <span style="color: #999; font-size: 13px;">${index}. </span>
                  <a style="
                    color: #999;
                    font-weight: normal;
                    text-decoration: none;
                    font-size: 13px;"
                  href="https://juejin.cn/post/${article_id}" target="_blank">${title}</a>
                </dd>
              `)
            } catch (_) {
            }
          }) 
        } catch (_) {
        }
        reslove({
          name: '掘金',
          data
        })
      }
    }
    return request({
      method: 'POST',
      url: uri,
      json: true,
      body: {
        id_type: 2,
        client_type: 2608,
        sort_type: 200,
        cursor: '0',
        limit: 20
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
      }
    }, callback)
  })
}

export default juejin
