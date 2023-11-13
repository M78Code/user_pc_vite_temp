<!--
 * @Author: 
 * @Date: 2022-07-27 14:12:20
 * @Description: 预约投注提示
-->
<template>
    <div class="relative-position">
      <q-menu v-model="is_show"  anchor="bottom left" self="bottom right" 
      :offset="offset"
      :content-class="`tips-body-match  ${popup_class}`">
        <!-- 箭头 fifteen-arrow十五分钟单独加样式 夜间模式使用 -->
        <div class="direction fifteen-arrow"></div>
        <!-- 内容主体 -->
        <div class="tips-box  fifteen-content-main fifteen-bg" :class="{'fifteen': type === 'hps15Minutes', 'vi_content_width': lang == 'vi'}">
            <div class="tips-title fifteen-theme-title" >
                <!-- 标题 -->
                <span class="tip-before">{{tips_content.title}}</span>
            </div>
            <!-- 内容 -->
            <template>
              <div class="fifteen-content-main" :class="{'m-top-special': !idx}" v-for="(item, idx) in tips_content.content" :key="idx">
                <div class="fifteen-box-info" :class="{'en-line-height': ['en', 'vi', 'th','ad'].includes(lang)}">
                  <!-- <div class="fifteen-title">{{item.title}}</div> -->
                  <div class="fifteen-content">{{item.content}}</div>
                </div>
              </div>
            </template>
        </div>
    </q-menu>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      is_show:true,//显示说明开关
      popup_class:"style1"//
    };
  },
  props:{
    tipstatus: Boolean,
    // 提示类型  punish：罚牌   penalty:点球大战
    type:{
      type: String,
      default: 'punish'
    },
    offset:{
      type: Array
    }
  },
  created(){
    console.log(this.offset);
  },
  computed:{
    ...mapGetters({
      lang: "get_lang",
    }),
    // 提示内容
    tips_content(){
      // 15分钟
      return {
        title: this.$root.$t('list.hps_pre_tips'),
        content: this.$root.$t('list.hps_pre_tips_details')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tips-icon {
  margin-left: 28px;
  width: 14px;
  height: 14px;
  background-image: url("~public/image/yabo/svg/details_info.svg");
  background-size: 100%;
  &:hover {
    background-image: url("~public/image/yabo/svg/details_info_focus.svg");
  }
}
</style>
<style lang="scss">
.tips-body-match {
  overflow: unset;
  &.style1 {
    transform: translate(-15px, 12px);
    .direction {
      top: -12px;
    }
  }
  &.style2 {
    transform: translate(-15px, -12px);
    .direction {
      transform: rotate(180deg);
      bottom: -14px;
    }
  }
  /* 箭头 */
}
.direction {
  position: absolute;
  left: 14px;
  width: 14px;
  height: 14px;
  border: 7px solid transparent;
  z-index: 100;
  /* 箭头 */
  &:after {
    position: absolute;
    border-width: 0 5px 5px;
    border-style: solid;
    content: "";
    top: 2px;
    left: -5px;
    pointer-events: none;
  }
}
/* 说明容器 */
.tips-box {
  position: relative;
  width: 219px;
  border-radius: 4px;
  z-index: 99;
  font-family: PingFangSC-Regular;
  overflow: hidden; 
  top: 1px;
  /*15分钟弹层样式*/
  &.fifteen {
    width: 320px;
  }
  &.vi_content_width {
    width: 380px;
  }
  /* 说明标题 */
  .tips-title {
    padding-left: 23px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    font-size: 14px;
    margin-bottom: 9px;
    font-weight: 600;
    .tip-before {
      &::before {
        display: inline-block;
        position: relative;
        top: 2px;
        margin-right: 8px;
        width: 3px;
        height: 14px;
        border-radius: 1.5px;
        content: "";
      }
    }
  }
  /* 说明内容 */
  .tips-content {
    word-wrap: break-word;
    padding: 0 18px 10px 23px;
  }
  /* 15分钟说明 */
  .fifteen-content-main {
    .fifteen-box-info {
      width: 90%;
      margin: 0 auto;
      padding: 0 5px;
      display: flex;
      justify-content: space-between;
      line-height: 34px;
      .fifteen-content {
        text-indent:-12px;
        margin-left:12px;
      }
    }
    .en-line-height {
      line-height: 24px;
    }
    &:last-child div {
      border-bottom: none !important;
    }
    &.m-top-special {
      margin-top: -9px;
    }
  }
}
</style>
