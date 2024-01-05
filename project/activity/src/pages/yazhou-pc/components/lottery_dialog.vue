<template>
  <q-dialog v-model="isShow">
    <q-layout view="Lhh lpR fff" container class="lottery">
      <img class="close" :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/dialog_close.png`"
           alt="" @click.stop="$emit('close_lottery_dialog')" width="30px">
      <div class="content">
        <p v-if="getLotterySuc" class="title text-orange text-center">恭喜您，获得<span>{{ getLotteryNum }}</span>张奖券
        </p>
        <p v-if="!getLotterySuc" class="title text-orange text-center">领取失败，请重新领取奖券</p>
        <img v-if="getLotterySuc"
             :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_lottery_suc.png`" alt="">
        <img v-if="!getLotterySuc"
             :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_lottery_fail.png`" alt="">
        <p v-if="getLotterySuc" class="go_lottery text-white text-center" @click="$emit('close_lottery_dialog')">
          我知道了</p>
        <p v-if="!getLotterySuc" class="reget text-white text-center" @click="getAgain">重新领取</p>
      </div>
    </q-layout>
  </q-dialog>
</template>

<script>
import {
  LOCAL_COMMON_FILE_PREFIX
} from 'project_path/src/core/index.js'
export default {
  props: {
    getLotterySuc: Boolean,
    getLotteryNum: String | Number,
    getLotteryAgain: {},
    getLotteryDialog: Boolean
  },
  data () {
    return {
      LOCAL_COMMON_FILE_PREFIX,
      isShow: false
    }
  },
  watch: {
    getLotteryDialog: {
      handler (e) {
        this.isShow = e
      }
    }
  },
  methods: {
    getAgain () {
      this.$emit('getLottery', this.getLotteryAgain)
      this.$emit('close_lottery_dialog')
    }
  }
}
</script>

<style lang="scss" scoped>
.lottery {
  box-shadow: none;
  width: 750px;
  max-width: 750px;
  height: 600px;
  background: var(--qq--activity-get-lottery-bg) no-repeat center;
  &:deep(.scroll){
    overflow: hidden;
  }


  .close {
    width: 30px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
    cursor: pointer;
  }

  .content {
    padding: 70px 0 0;
  }

  .title {
    font-family: PingFangSC-Medium;
    font-size: 32px;
    margin-bottom: 40px;
  }

  img {
    display: block;
    margin: 0 auto;
    margin-bottom: 30px;
  }

  .go_lottery {
    width: 240px;
    height: 46px;
    line-height: 46px;
    background-image: var(--qq--activity-tab-bg-img-active);
    border: 1px solid #ffffff;
    box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.17);
    border-radius: 33px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    margin: 0 auto;
    cursor: pointer;
  }

  .reget {
    width: 240px;
    height: 46px;
    line-height: 46px;
    background-image: linear-gradient(180deg, #ffe8bc 0%, #e79b40 99%);
    border: 1px solid #ffffff;
    box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.17);
    border-radius: 33px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    margin: 0 auto;
    cursor: pointer;
  }
}
</style>
