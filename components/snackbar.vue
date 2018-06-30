<template lang="pug">
  trasition(name=swing)
    .snakbar(v-if='open')
      .snackbar-content
        slot(name='body')
        slot(name='action', @click='$emit("update:opten", false)')
</template>

<script>
  export default {
    props: {
      open: {
        default: false
      }
    },
    watch: {
      open(newVal, oldVal) {
        if (newVal) {
          let timer = setTimeout(() => {
            this.$emit('update:open', false)
            clearTimeout(timer)
          }, 3000)
        }
      }
    }
  }
</script>

<style scoped lang='sass' src='../static/sass/snackbar.sass'></style>
