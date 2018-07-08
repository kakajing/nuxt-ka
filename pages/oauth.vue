<template lang="pug">
</template>
<script>
// import { mapState } from 'vuex'

// 获取参数
function getUrlParam (param) {
  const reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
  const result = window.location.search.substr(1).match(reg)

  return result ? decodeURIComponent(result[2]) : null
}

export default {
  head() {
    return {
      title: `loading`
    }
  },
  // 组件安装之前拿到wx
  async beforeMount() {
    const url = window.location.href
    const { data } = await this.$store.dispatch('getWechatOAuth', url)
    console.log(data)

    if (data.success) {
      await this.$store.dispatch('setAuthUser', data.data)
      const paramsArr = getUrlParam('state').split('_')
      const visit = paramsArr.length === 1 ? `/${paramsArr[0]}` : `/${paramsArr[0]}?id=${paramsArr[1]}`
      this.$router.replace(visit)
    } else {
      throw new Error('用户信息获取失败')
    }
  }
}
</script>
