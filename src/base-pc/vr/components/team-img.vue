<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页蓝色背景上的大型字母图标
-->
<template>
  <div class="team-img" :class="size == 22? 'team-img-s': ''">
    <!-- 字母图标 -->
    <img class="img-style" v-img="([(lodash.isArray(url)?url[0]:url), fr, csid])" :class="[size == 22 && `img-style-s`]" alt />
  </div>
</template>

<script>

export default {
  name: "team_img",

  props: {
    type: { // 0 主队  1 客队
      type: Number
    },
    url: {
      type: String || Array,
      default: ""
    },
    size: {
      type: Number,
      default: 44
    },
    fr: {
      type: String,
      default: ''
    },
    csid: { // 赛种
      type: String,
      default: ''
    }
  },
};
</script>

<style lang="scss" scoped>
.team-img {
  width: 0.44rem;
  height: 0.44rem;
  margin: 0 auto;
  position: relative;
}

.img-style {
  width: 0.44rem;
  height: 0.44rem;
  position: absolute;
  top: 0;
  left: 0;
}

.team-img-s {
  width: 0.3rem;
  height: 0.3rem;
  margin: 0 auto;
  display: inline-block;
}

.img-style-s {
  width: 0.3rem;
  height: 0.3rem;
}
</style>
