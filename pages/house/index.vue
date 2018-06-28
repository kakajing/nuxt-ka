<template lang="pug">
.container
  .house-media
    img(v-if='house.name' :src='imageCDN + house.name + ".jpg"')
    .desc
      .words {{house.words}}
      .name {{house.name}}

  .house-body
    .title {{house.cname}}
    .body {{house.intro}}
    .title 主要角色
    .body(v-for='(item, index) in house.swornMembers' :key="index")
      .members(v-if='item.character')
        img(:src='imag(item.character.profile)' @click='showCharacter(item)')
        .desc
          .cname {{item.character.cname}}
          .intro {{item.text}}
  
    .house-history(v-for='history in house.sections' :key='history.index')
      .title {{history.title}}
      .content(v-for='text in history.content') {{text}}
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    head() {
      return {
        title: '团队详情'
      }
    },
    computed: {
      ...mapState({
        house: 'currentHouse',
        imageCDN: 'imageCDN'
      })
    },
    // mounted() {
    //   if (this.house.swornMembers) {
    //     for (let swornMembers of this.house.swornMembers) {
    //       let profile = swornMembers.character.profile
    //       profile = this.imageCDN + "'" + profile + "'"
    //       console.log(profile)
    //     }
    //   }
    // },
    beforeCreate() {
      let id = this.$route.query.id
      this.$store.dispatch('showHouse', id)
    },
    methods: {
      showCharacter(item) {
        this.$router.push({
          path: '/character',
          query: {
            id: item._id
          }
        })
      },
      imag(profile) {
        if (this.house.swornMembers) {
          for (let swornMembers of this.house.swornMembers) {
            profile = swornMembers.character.profile
            profile = this.imageCDN + "'" + profile + "'"
          }
          return profile
        }
      }
    }
  }
</script>

<style scoped lang='sass' src='../../static/sass/house.sass'></style>
