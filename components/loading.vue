<template lang="pug">
  .loading-page(v-if='loading')
    p 加载中...
</template>

<script>
  export default {
    data () {
      return {
        loading: false
      }
    },
    methods: {
      start() {
        this.loading = true
      },
      finish() {
        this.loading = false
      }
    }
  }
</script>

<style scoped lang='sass'>
.loading-page 
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: rgba(255, 255, 255, 0.8)
  text-align: center
  padding-top: 200px
  font-size: 30px
  font-family: sans-serif
</style>