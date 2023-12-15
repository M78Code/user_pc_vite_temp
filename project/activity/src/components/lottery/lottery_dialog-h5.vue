<!--
 * @Date: 2022-07-06 14:36:46
 * @FilePath: /user-pc1/project/activity/src/pages/yazhou-pc/lottery_dialog.vue
 * @Description:
 * @Author:
-->

<template>
    <q-dialog v-model="daily_task_success">
      <div class="daily_task_dialog" @click.self="daily_task_success = false">
        <div class="task_success">
          <div class="title">
            {{
              pop_parameter.ticket >= 0
                ? `恭喜您，获得 ${pop_parameter.ticket} 张奖券`
                : "领取失败，请重新领取奖券"
            }}
          </div>
          <img
            :src="
              pop_parameter.ticket >= 0
                ? pop_parameter.success
                : pop_parameter.failure
            "
            alt=""
          />
          <div
            class="Go-to-lottery"
            :class="{ failure: pop_parameter.ticket < 0 }"
            @click="Reclaim"
          >
            {{ pop_parameter.ticket >= 0 ? "我知道了" : "重新领取" }}
          </div>
        </div>
        <img
          class="colse2"
          @click="daily_task_success = false"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/colse2.png`"
        />
      </div>
    </q-dialog>

</template>

<script>
export default {
  props: {
    getLotterySuc: Boolean,
    getLotteryNum: '' ,
    getLotteryAgain: {},
    getLotteryDialog: Boolean
  },
  data() {
    return {
      isShow: false,
    }
  },
  watch: {
    getLotteryDialog: {
      handler(e) {
        this.isShow = e;
      }
    }
  },
  methods: {
    getAgain() {
      this.$emit('getLottery', this.getLotteryAgain);
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
  background: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/get_lottery_bg.png")
    no-repeat center;
  :deep(.scroll) {
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
