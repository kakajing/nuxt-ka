import koaBody from 'koa-bodyparser'
import session from 'koa-session'

export const addBody = app => {
  app.use(koaBody())
}

export const addSession = app => {
  // session的加密key
  app.keys = ['nuxtssr']

  const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    signed: true,
    rolling: false
  }
  app.use(session(CONFIG, app))
}