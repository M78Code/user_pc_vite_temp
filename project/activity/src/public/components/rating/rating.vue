<!--
 * @Date: 2021-09-19 22:33:15
 * @FilePath: /user-pc1/src/public/components/rating/rating.vue
 * @Description: 五角星
 * @Author:
-->
<template>
  <div class="star">

    <template v-if="['theme01_y0', 'theme02_y0'].includes(get_theme)">
      <img
        v-for="(item,i) in icon_color"
        :key="`color-${i}`"
        :src="Number(star)-1>=i? '/image/yabo/svg/star_checked_y0.svg': '/image/yabo/svg/star.svg'" width="10" alt="">
    </template>
    <template v-else>
      <img
        v-for="(item,i) in icon_color"
        :key="`color-${i}`"
        :src="Number(star)-1>=i? '/image/yabo/svg/star_checked.svg': '/image/yabo/svg/star.svg'" width="10" alt="">
    </template>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      icon_color:["","","","",""]
    };
  },
  props:{
    star: String
  },
  computed:{
    project_name(){
      return process.env.config.FINAL_TARGET_PROJECT_NAME
    },
    ...mapGetters(['get_theme'])
  }
};
</script>

<style lang="scss" scoped>
.star {
  display: flex;
  img {
    height: 10px;
    margin-right: 7px;
    &:last-child {
      margin: 0;
    }
  }
}
</style>
