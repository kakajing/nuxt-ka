<template lang="pug">
.container
  .product
    .swiper(v-swiper:mySwiper='swiperConfig')
      .swiper-wrapper
        .swiper-slide(v-for='item in product.images')
          img(:src='imageCDN2 + item')

      .swiper-pagination.swiper-pagination-bullets

    .content
      .price(v-if='product.price')
        span.main-price {{product.price.toFixed(2) - product.price.toFixed(2).substr(-3)}}
        span.other-price {{product.price.toFixed(2).substr(-3)}}

    .name {{product.name}}
    .intro {{product.intro}}
    .info
      cell(v-for='(item, index) in product.parameters' :key='index' :title='item.key' :content='item.value')
    .attentions
      .title 购物提示
      ol
        li(v-for='item in attentions') {{item}}
    
    .footer
      span(@click='buyProduct') 购买
</template>

<script>
  import cell from '../../components/cell.vue'
  import { mapState } from 'vuex'

  export default {
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
        ]
      }
    },
    methods: {
      buyProduct(item) {
        console.log(item)
      }
    },
    computed: {
      ...mapState({
        'product': 'currentProduct',
        'imageCDN2': 'imageCDN2'
      })
    },
    beforeCreate() {
      const id = this.$route.query.id
      this.$store.dispatch('showProduct', id)
    },
    components: {
      cell
    }
  }
</script>

<style scoped lang='sass' src='../../static/sass/deal.sass'></style>
