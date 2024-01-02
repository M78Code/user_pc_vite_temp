<!--
 * @Author: Supermark
 * @Date: 2020-12-23 17:24:17
 * @Description: 虚拟体育详情页头部区域
-->
<template>
  <div class="video-main">
    <div class="row title justify-between items-center">
      <div class="row">
        <div @click="detail_back" class="detail-pad"><div class="detail_back"></div></div>
        <span class="text-style">{{get_current_league.name}}</span>
      </div>
      <div :class="get_is_show_settle_tab ? 'have-single' : 'no-single'"  @click="open('bottom')"></div>
    </div>
    <!-- 虚拟时针 -->
    <template>
      <div class="row justify-center items-center time-down">
        <virtual-sports-timer></virtual-sports-timer>
      </div>
    </template>

    <!-- 虚拟体育注单记录 -->
    <template>
      <q-dialog v-model="dialog" :position="position">
        <settle-dialog @close_="change_settle_status"></settle-dialog>
      </q-dialog>
    </template>
  </div>
</template>

<script>
import settleDialog from "src/base-h5/components/footer-bar/settle-dialog.vue";
import virtualSportsTimer from "src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports_timer.vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
export default {
  name:'virtual_sports_videos',
  data(){
    return {
      dialog:false,
      position: 'top',
    }
  },
  computed: {
    // ...mapGetters([
    //   'get_is_show_settle_tab',
    //   "get_current_league"
    // ])
    get_is_show_settle_tab(){return 0},
    get_current_league(){return VR_CTR.state.current_league},
  },
  components: {
    settleDialog,
    virtualSportsTimer,
  },
  methods: {
    // ...mapMutations([
    //   'set_settle_dialog_bool'
    // ]),
    set_settle_dialog_bool(data){},
    /**
     *@description: 虚拟体育详情页返回
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    detail_back(){
      this.$router.push({name: 'matchList'});
    },
    /**
     *@description: 点击注单icon显示注单历史
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    open(){
      useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, true);
    },
    /**
     *@description: 关闭投注记录显示
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    change_settle_status(){
      this.set_settle_dialog_bool(false)
      this.dialog = false
    },
  },
}
</script>

<style lang="scss" scoped>
/*************** 视频父盒子开始 *************** -S*/
.video-main {
  min-width: 3.75rem;
  min-height: 2.11rem;
  background-color: #000;
  background-image: var(--q-color-com-img-bg-96);
  background-size: 100% 100%;
}

/*************** 视频父盒子结束 *************** -E*/
/*************** 头部返回title开始 *************** -S*/
.title {
  height: 0.44rem;
  line-height: 0.44rem;
}

/*************** 头部返回title结束 *************** -E*/
/*************** 返回按钮弹性盒开始 *************** -S*/
.detail-pad {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.15rem;
}

/*************** 返回按钮弹性盒结束 *************** -E*/
/*************** 返回按钮开始 *************** -S*/
.detail_back {
  width: 0.1rem;
  height: 0.18rem;
  background-image: var(--q-color-com-img-bg-3);
  background-size: 100% 100%;
}

/*************** 返回按钮结束 *************** -E*/
/*************** 联赛名开始 *************** -S*/
.text-style {
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: 0;
}

/*************** 联赛名结束 *************** -E*/
/*************** 无注单开始 *************** -S*/
.no-single {
  width: 0.18rem;
  height: 0.2rem;
  background-image: var(--q-color-com-img-bg-95);
  background-size: 100% 100%;
  margin-right: 0.21rem;
}

/*************** 无注单结束 *************** -E*/
/*************** 有注单开始 *************** -S*/
.have-single {
  width: 0.18rem;
  height: 0.2rem;
  background-image: var(--q-color-com-img-bg-85);
  background-size: 100% 100%;
  margin-right: 0.21rem;
}

/*************** 有注单结束 *************** -E*/
/*************** 倒计时开始 *************** -S*/
.time-down {
  margin-top: 0.1rem;
}

/*************** 倒计时结束 *************** -E*/
</style>

