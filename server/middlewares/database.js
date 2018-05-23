import mongoose from 'mongoose'
import config from '../config'
import {resolve} from 'path'
import fs from 'fs'

const models = resolve(__dirname, '../database/schema') 

// 同步读入模型文件
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*js$/))
    .forEach(file => require(resolve(models, file)))

export const database = app => {
    mongoose.set('debug', true)

    mongoose.connect(config.db)

    // 连接中断
    mongoose.connection.on('disconnected', () => {
        mongoose.connect(config.db)
    })
    // 出错
    mongoose.connection.on('error', err => {
        console.error(err)
    })
    // 打开
    mongoose.connection.on('open', async => {
        console.log('Connected to MongoDB ', config.db)
    })
}