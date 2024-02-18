<template>
  <!-- 视频info说明 -->
  <div class="info-rules fullscreen" @click.self="change_show" @touchmove.prevent>
    <div class="content-box" :class="{'content-box2':get_is_hengping,'is_hd_sd':get_hd_sd_show}">
      <template v-if="!get_hd_sd_show">
        <!-- 文字头 -->
        <header>{{i18n_t("info_rules.auto")}}</header>
        <!-- 2条说明规则，有换行，文字颜色，多语言区分 -->
          <div v-for="(value,key) in rules" :key="key" v-html="value"></div>
        <!-- 按钮-我知道了 -->
        <footer @click="change_show">{{i18n_t("info_rules.i_know")}}</footer>
      </template>
      <div v-if="get_hd_sd_show" class="hd-sd-css">
        <!-- 文字头 -->
        <header>{{i18n_t("match_info.video") +'  '+ i18n_t("footer_menu.change_simple01")}}</header>
        <span @click="video_switching(0)" :class="[get_hd_sd == 0 && 'gaoliang']">{{i18n_t("common.SD")}}</span>
        <span @click="video_switching(1)" :class="[get_hd_sd == 1 && 'gaoliang']">{{i18n_t("common.HD")}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// #TODO vuex
// import { mapGetters, mapMutations } from "vuex";
import { reactive, computed, onMounted, onUnmounted, toRefs, defineComponent, ref } from "vue";
import { i18n_t } from "src/boot/i18n.js";;
import { useMittEmit, MITT_TYPES } from "src/output/index.js"
//国际化


export default defineComponent({
  name: "info_rules",

  setup(props, evnet) {
     //视频info说明
     const rules = ref(i18n_t("info_rules.rules"))
    //  todo 后续
     const get_is_hengping = ref(false)
     const get_hd_sd_show = ref(false)
     const get_hd_sd = ref(1)
    // #TODO vuex
    // computed: {
    //   // 是否显示info说明
    //   ...mapGetters([
    //     'get_info_show',
    //     'get_is_hengping',
    //     'get_hd_sd_show',
    //     'get_hd_sd',
    //   ])
    // },
    // #TODO vuex
    // methods: {
    // ...mapMutations(['set_info_show', 'set_iframe_onload', 'set_hd_sd_show']),
    /**
     *@description:  改变info显示状态
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    const change_show = () => {
      useMittEmit(MITT_TYPES.EMIT_VIDEO_DESCRIPTION_SHOW, false)
    };
    // 视频切换
    const video_switching = (n) => {
      // 先隐藏视频，2秒后 再显示视频
      set_iframe_onload(false);
      clearTimeout(timer1_)
      timer1_ = setTimeout(()=>{
        set_iframe_onload(true);
      },1000)
      useMittEmit(MITT_TYPES.EMIT_VIDEO_SWITCHING,n)
      change_show()
    };
    return {
      rules,
      i18n_t,
      change_show,
      video_switching,
      get_is_hengping,
      get_hd_sd_show,
      get_hd_sd
    }
  }
})
</script>
<style lang="scss" scoped>
/*************** 遮罩层开始 *************** -S*/
.info-rules {
  text-align: center;
  z-index: 8000 !important;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
}

/*************** 遮罩层结束 *************** -E*/

/*************** 内容父盒子开始 *************** -S*/
.content-box {
  background-color: var(--q-gb-bg-c-23);
  color: #414655;//var(--q-detials-color-6);
  border-radius: 0.16rem;
  width: 3.2rem;
  padding: 0.2rem 0;
  margin: auto;
}

/*************** 内容父盒子结束 *************** -S*/

/*************** 文字头开始 *************** -S*/
.content-box  header {
  font-size: 0.16rem;
  color: var(--q-analysis-text-color-20);
  // color:var(--q-color-com-fs-color-1);
  // color: #000000;// var(--q-color-fs-color-35);
  letter-spacing: 0;
  margin: 0 0.2rem 0.1rem 0.2rem;
  font-weight: 700;
}

/*************** 文字头结束 *************** -S*/

/*************** 规则说明开始 *************** -S*/
.content-box > div {
  margin: 0.12rem 0.2rem;
  color: #5a6074;// var(--q-detials-color-9);
  font-size: 0.14rem;
  text-align: left;
}

/*************** 规则说明结束 *************** -S*/

/*************** 我知道了 开始 *************** -S*/
.content-box > footer {
  font-size: 0.16rem;
  color: var(--q-gb-t-c-1);
  margin-bottom: -0.06rem;
  padding: 0.12rem 0.2rem 0;
  font-weight: 700;
  border-top: 1px solid var(--q-gb-bg-c-18);
}

/*************** 我知道了 结束 *************** -S*/
</style>
<style lang="scss">
/*************** 矩形叶开始 *************** -S*/
.rules-wet {
  // color: var(--q-gb-t-c-14);
  text-align: center;
  display: inline-block;
  width: 0.16rem;
  height: 0.16rem;
  line-height: 0.18rem;
  // background-color: var(--q-gb-bg-c-13);
  border-radius: 8px 0 8px 0;
}

/*************** 矩形叶结束 *************** -E*/
/*************** 字体加粗开始 *************** -S*/
.font-wet {
  // font-weight: 700;
  // color: var(--q-color-com-fs-color-1);
  // color: var(--q-color-fs-color-35);
}
.content-box{
  &.is_hd_sd{
    width: 2.8rem;
    .hd-sd-css{
      display: flex;
      flex-direction: column;
      align-items: center;
      >span{
        padding: .1rem .5rem;
        border: 1px solid var(--q-color-com-border-color-9);
        border-radius: .15rem;
        &:nth-child(2) {
          margin-bottom: 15px;
        }
        &.gaoliang{
          background-color: var(--q-color-com-bg-color-20);
          color: var(--q-color-fs-color-50);
        }
      }
    }
  }
}

/*************** 字体加粗结束 *************** -E*/
</style>