import xml2js from 'xml2js'
import template from './tpl'

// xml转化json
function parseXML (xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, {trim: true}, (err, content) => {
            if (err) reject(err)
            else resolve(content)
        })
    })
}

// xml转化成Object
function formatMessage (result) {
    let message = {}

    if (typeof result === 'object') {
        const keys = Object.keys(result)

        for (let i = 0; i < keys.length; i++) {
            let item = result[keys[i]]
            let key = keys[i]

            if (!(item instanceof Array) || item.length === 0) {
                continue
            }

            if (item.length === 1) {
                let val = item[0]

                if (typeof val === 'object') {
                   message[key] = formatMessage(val)
                } else {
                    message[key] = (val || '').trim()
                }
            } else {
                message[key] = []
                for (let j = 0; j < item.length; j++) {
                    message[key].push(formatMessage(item(j)))
                }
            }
        }
    }
    return message
}

/**
 * 微信消息解析
 * @param {conten} 回复内容
 * @param {message} 解析后的消息  
 */
function tpl (content, message) {
    let type = 'text'

    if (Array.isArray(content)) {
        type = 'news'
    }

    if (content && content.type) {
        type = content.type
    }

    let info = Object.assign({}, {
        content: content,
        createTime: new Date().getTime(),
        msgType: type,
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName
    })

    return template(info)
}


export {parseXML, formatMessage, tpl}