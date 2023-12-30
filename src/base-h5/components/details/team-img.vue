<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页蓝色背景上的大型字母图标
-->
<template>
  <div class="team-img"  :style="sizeStyle" :class="size == 22? 'team-img-s': ''">
    <div v-if="url"
      :style="[compute_css_obj({key:'pc-team-logo-image',position:[url,fr,csid,type]}),sizeStyle]"
      :class="[size == 22 && `img-style-s`]"
      class="img-style"
    ></div>
    <!-- <div v-else :class="[size == 22 && `img-style-s`]"
      class="img-style" :style="'background-image: url(' + backgroundImage + ')'">
    </div> -->
    <div class="img-style" v-else :class="[size == 22 && `img-style-s`]" :style="compute_css_obj({key: 'h5-home-icon'})"></div>
  </div>
</template>

<script>
import { compute_css_obj } from "src/output/index.js";
import { team_mhlu_url_app_h5,team_malu_url_app_h5 } from "src/base-h5/core/utils/local-image.js"
export default {
  name: "team_img",
  data(){
    return {
      compute_css_obj
    }
  },
  props: {
    type: { // 0 主队  1 客队
      type: Number
    },
    url: {
      type: String,
      default: ""
    },
    size: {
      type: Number,
      default: 18
    },
    fr: {
      type: String,
      default: ''
    },
    csid: { // 赛种
      type: [String, Number],
      default: ''
    }
  },
  computed:{
    sizeStyle(){
      return  {
        width:"0."+this.size+'rem',
        height:"0."+this.size+'rem',
      }
    },
    backgroundImage(){
      return !!this.type ? team_malu_url_app_h5 : team_mhlu_url_app_h5
    }
  }
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
  background-repeat: no-repeat;
  background-position-y: center !important;
  background-size: cover;
}

.team-img-s {
  width: 0.3rem !important;
  height: 0.3rem!important;
  margin: 0 auto;
  display: inline-block;
}

.img-style-s {
  width: 0.3rem!important;
  height: 0.3rem!important;
}

.team-image{
  width: 0.44rem;
  height: 0.44rem;
  // margin-top: 0.11rem;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &-icon{
    width: 0.44rem;
    height: 0.44rem;
  }
}
</style>