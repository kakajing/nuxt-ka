<template lang="pug">
.container
  .user(v-if='user')
    .user-header
      .text {{user.nickname}}
      img(:src='imageCDN + user.avatar')
    .user-address
      cell(title='收获地址')
      .user-content {{user.address}}
    
    .user-phone
      cell(title='电话')
      .user-content {{user.phoneNumber}}

    .user-name
      cell(title='姓名')
      .user-content {{user.name}}

    .user-order(v-if='user.orders')
      cell(title='我的订单')
      .user-order-items(v-for='item in user.orders')
        img(:src='imageCDN + item.images[0]')
        .user-order-intro
          .title {{item.product.title}}
          .content {{item.product.intro}}

        .user-order-price
          span ￥{{item.product.price}}
</template>

<script>
  import { mapState } from 'vuex'
  import cell from '../../components/cell.vue'

  export default {
    head() {
      return {
        title: '个人中心'
      }
    },
    computed: {
      ...mapState([
        'user',
        'imageCDN'
      ])
    },
    beforeCreate() {
      this.$store.dispatch('fetchUserAndOrders')
    },
    components: {
      cell
    }
  }
</script>

<style scoped lang='sass' src='../../static/sass/user.sass'></style>
