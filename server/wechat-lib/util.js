import xml2js from 'xml2js'
// import sha1 from 'sha1'

// xml转化json
function parseXML (xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, {trim: true}, (err, content) => {
            if (err) reject(err)
            else resolve(content)
        })
    })
}

export {parseXML}