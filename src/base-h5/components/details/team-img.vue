<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页蓝色背景上的大型字母图标
-->
<template>
  <div class="team-img"  :style="sizeStyle" :class="size == 22? 'team-img-s': ''">
    <!-- 字母图标 -->
    <!-- {{url}}{{fr}}{{csid}} -->
    <!-- <img class="img-style" v-img="([url, fr, csid])" :class="[size == 22 && `img-style-s`]" alt /> -->
          <div
              :style="[compute_css_obj({key:'pc-team-logo-image',position:[url,fr, csid, ]}),sizeStyle]"  
              :class="[size == 22 && `img-style-s`]"
              class="img-style"
            ></div>
            <!-- []({
                  position: [
                    fr,
                    lodash.get(match_info, 'frmhn[0]'),
                    csid,
                  ],
                  theme: lodash.get(UserCtr,'theme'),
                }) -->
  </div>
</template>

<script>
import { compute_css_obj } from "src/output/index.js";
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
</style>