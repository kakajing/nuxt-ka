import koaBody from 'koa-bodyparser'

export const addBody = app => {
  app.use(koaBody())
}
