import qiniu from 'qiniu'
import config from '../config'
import { exec } from 'shelljs'

const bucket = 'kaka'
const bucket2 = 'vueapp'

// qiniu.conf.ACCESS_KEY = config.qiniu.AK
// qiniu.conf.SECRET_KEY = config.qiniu.SK

const ak = config.qiniu.AK
const sk = config.qiniu.SK
const mac = new qiniu.auth.digest.Mac(ak, sk)

let options = {
  scope: bucket2
}

export const fetchImage = async (url, key) => {
  return new Promise((resolve, reject) => {
    const bash = `qshell fetch ${url} ${bucket} '${key}'`
    const child = exec(bash, {async: true})

    child.stdout.on('data', data => {
      // console.log(data)
      resolve(data)
    })
  })
}

export const uptoken = (key) => {
  let putPolicy = new qiniu.rs.PutPolicy(options)
  let uploadToken = putPolicy.uploadToken(mac)
  return uploadToken
}