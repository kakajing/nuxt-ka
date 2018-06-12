<template lang="pug">
.container
  .shopping
    .title 商城周边
    .list
      .items(v-for='(item, index) in products' :key='index' @click='showProduct(item)')
        img(:src='item.images[0]')
        .body
          .title {{item.title}}
          .content {{item.intro}}
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    head() {
      return {
        title: '周边手办'
      }
    },
    computed: {
      ...mapState([
        'products'
      ])
    },
    beforeCreate() {
      this.$store.dispatch('fetchProducts')
    },
    methods: {
      showProduct(item) {
        this.$router.push({
          path: '/deal',
          query: {id: item._id}
        })
      }
    }
  }
</script>

<style scoped lang='sass' src='../../static/sass/product.sass'></style>
