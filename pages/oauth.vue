<template lang="pug">
  .container
</template>
<script>
// import { mapState } from 'vuex'

export default {
  asyncData({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },
  head() {
    return {
      title: `测试页面`
    }
  },
  // 组件安装之前拿到wx
  beforeMount() {
    const url = window.location.href

    this.$store.dispatch('getUserByOAuth', encodeURIComponent(url)).then(res => {
      if (res.data.success) {
        console.log(res.data)
        console.log('========')
      }
    })
  }
}
</script>
