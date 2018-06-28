<template lang="pug">
.container
  .character-header
    img.background(v-if='character.images', :src='imag(character.images[character.images.length - 1])')
    .media
      img(v-if='character.profile', :src='prof(character.profile)')
      .desc
        .names
          p.cname {{character.cname}}
          p.name {{character.name}}

  .character-body
    .intro
      p(v-for='item in character.intro') {{item}}

      .stills
        img(v-for='(item, index) in character.images', :src='imag(item)', :key='index')

      .items(v-for='item in character.sections')
        .title {{item.title}}
        .body(v-for='text in item.content') {{text}}
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    head() {
      return {
        title: '团队成员详情'
      }
    },
    computed: {
      ...mapState({
        character: 'currentCharacter',
        imageCDN: 'imageCDN'
      })
    },
    beforeCreate() {
      let id = this.$route.query.id
      this.$store.dispatch('showCharacter', id)
    },
    methods: {
      prof(profile) {
        if (this.character) {
          profile = this.character.profile
          profile = this.imageCDN + "'" + profile + "'"
        }
        return profile
      },
      imag(img) {
        if (this.character.images) {
          // for (let i = 0; i < this.character.images.length; i++) {
          //   img = this.character.images[i]
          //   img = this.imageCDN + "'" + img + "'"
          // }
          for (let imagee of this.character.images) {
            imagee = this.imageCDN + "'" + imagee + "'"
            img = imagee
          }
        }
        return img
      }
    }
  }
</script>

<style scoped lang='sass' src='../../static/sass/character.sass'></style>
