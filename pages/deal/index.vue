<template lang="pug">
.container
  .product
    .imgs
      img(v-for='(item, index) in product.images', :src='imageCDN2 + item', :key='index')

    .content
      .price(v-if='product.price')
        span.main-price {{product.price}}

    .name {{product.name}}
    .intro {{product.intro}}
    .info
      cell(v-for='(item, index) in product.parameters' :key='index' :title='item.key' :content='Number(item.value)')
    .attentions
      .title 购物提示
      ol
        li(v-for='item in attentions') {{item}}
    
  .footer
    span(@click='showInfo = true') 购买
  transition(name='slide-top')
    payment-modal(v-if='showInfo')
      .payment-modal-header
        span 准备购买
        span(@click='showInfo = false') 取消
      .payment-modal-body
        .info-item
          img(:src='imageCDN2 + product.images[0]')
          div
            p {{ product.title }}
            p 价格 ￥{{ product.price }}
        .info-item
          span 收件人
          input(v-model.trim='info.name' placeholder='你的名字')
        .info-item
          span 电话
          input(v-model.trim='info.phoneNumber' type='tel' placeholder='你的电话')
        .info-item
          span 地址
          input(v-model.trim='info.address' type='tel' placeholder='收货地址是？')
      .payment-modal-footer(@click='handPayment') 确认支付
  transition(name='fade')
    span.modal(v-if='modal.visible') {{ modal.content}}
</template>

<script>
  import cell from '../../components/cell.vue'
  import { mapState } from 'vuex'
  import wechat from '../../static/mixins/wechat.js'

  // 控制modal
  function toggleModal(obj, content) {
    clearTimeout(obj.timer)
    obj.visible = true
    obj.content = content
    obj.timer = setTimeout(() => {
      obj.visible = fade
    }, 1500)
  }

  export default {
    // middleware: 'wechat-auth',
    mixins: [wechat],
    head() {
      return {
        title: '购买页面'
      }
    },
    data() {
      return {
        swiperConfig: {
          autoplay: 4000,
          direction: 'horizontal',
          loop: true,
          pagination: '.swiper-pagination'
        },
        attentions: [
          '商品和服务的差异',
          '清关服务',
          '物流服务',
          '需要更多帮助，请联系管理员'
        ],
        // 是否弹出信息框
        showInfo: false,
        info: {
          name: '',
          phoneNumber: '',
          address: ''
        },
        modal: {
          visible: false,
          content: '成功',
          timer: null
        }
      }
    },
    methods: {
      async handPayment(item) {
        const that = this
        const { name, address, phoneNumber } = this.info

        if (!name || !address || !phoneNumber) {
          toggleModal(this.modal, '收获信息忘填了哦~')
          return
        }

        // 创建订单
        const res = await this.$store.dispatch('createOrder', {
          productId: this.product.id,
          name: name,
          address: address,
          phoneNumber: phoneNumber
        })

        const data = res.data

        if (!data || !data.success) {
          toggleModal(this.modal, '服务器异常，请等待后重新尝试')
          return
        }

        // 调用微信支付
        window.wx.chooseWXPay({
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success: (response) => {
            try {
              window.WeixinJSBridge.log(response.err_msg)
            } catch (e) {
              console.error(e)
            }

            // 支付成功
            if (response.err_msg === 'get_brand_wcpay_request:ok') {
              toggleModal(that.modal, '支付成功')
            }
          }
        })
      },
    },
    computed: {
      ...mapState({
        'product': 'currentProduct',
        'imageCDN2': 'imageCDN2'
      })
    },
    async beforeMount() {
      const id = this.$route.query.id
      // const url = window.location.href
      this.$store.dispatch('showProduct', id)
    },
    components: {
      cell
    }
  }
</script>

<style scoped lang='sass' src='../../static/sass/deal.sass'></style>
