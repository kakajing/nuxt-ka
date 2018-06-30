import api from '../api'
import { controller, get, post, del, put } from '../decorator/router'
import xxs from 'xxs'
import R from 'ramda'

@controller('/api')
export class ProductController {
  // 获取商品
  @get('/products')
  async getProducts (ctx, next) {
    let { limit = 50 } = ctx.query
    const data = await api.product.getProducts(limit)
      
    ctx.body = {
      data: data,
      sucess: true
    }
  }

  @get('/products/:_id')
  async getProduct (ctx, next) {
    const { params } = ctx
    const { _id } = params

    if (!_id) return (ctx.body = {sucess: false, err: '_id is required'})

    const data = await api.product.getProduct(_id)
      
    ctx.body = {
      data: data,
      sucess: true
    }
  }

  // 增加商品
  @post('/products')
  async postProducts (ctx, next) {
    let product = ctx.request.body
    console.log(ctx.request)

    product = {
      title: xxs(product.title),
      price: xxs(product.price),
      intro: xxs(product.intro),
      images: R.map(xxs)(product.images),
      parameters: R.map(
        item => ({
          key: xxs(item.key),
          value: xxs(item.value)
        })
      )(product.parameters)
    }

    try {
      product = await api.product.save(product)
      ctx.body = {
        success: true,
        data: product
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }

  // 修改商品
  @put('/products')
  async getCharacter (ctx, next) {
    let body = ctx.request.body
    const { _id } = body

    if (!_id) {
      return (ctx.body = {success: false, err: '_id is required'})
    }

    let product = await api.product.getProduct(_id)


    if(!product) {
      return (ctx.body = {
        success: false,
        err: 'product not exist'
      })
    }

    product.title = xxs(body.title)
    product.price = xxs(body.price)
    product.intro = xxs(body.intro)
    product.images = R.map(xxs)(body.images)
    product.parameters = R.map(
      item => ({
        key: xxs(item.key),
        value: xxs(item.value)
      })
    )(product.parameters)

    try {
      product = await api.product.update(product)
      ctx.body = {
        success: true,
        data: product
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }

  // 删除某一个商品
  @del('products/:id')
  async delProducts (ctx, next) {
    const params = ctx.params
    const {_id} = params

    if (!_id) return (ctx.body = {success: false, err: '_id is required'})

    let product = await api.product.getProduct(_id)

    if (!product) return (ctx.body = {success: false, err: 'product is required'})

    try {
      product = await api.product.del(product)
      ctx.body = {
        success: true
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }

}
