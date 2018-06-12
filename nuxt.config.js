module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        src: 'http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js'
      },
      {
        src: 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js'
      }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    {
      src: 'static/sass/base.sass',
      lang: 'sass?indentedSyntax=true'
    },
    {
      src: 'swiper/dist/css/swiper.css'
    }
  ],
  /**
   * plugins配置 ， ssr：false 设置只在客户端使用
   */
  plugins: [
    {
      src: '~plugins/swiper.js', ssr: false
    }
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLINT on save
     */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
