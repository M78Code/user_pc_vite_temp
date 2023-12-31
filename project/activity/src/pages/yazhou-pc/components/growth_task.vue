<!--
 * @Date: 2021-06-28 00:27:00
 * @FilePath: /user-pc1/project/activity/src/pages/yazhou-pc/grow_up/index.vue
 * @Description: 成长任务
 * @Author: Echo
-->
<template>
  <div class="tabs_content">
    <div class="introduction text-666">
      <p>活动对象：<span class="text-orange">本场馆全体会员</span></p>
      <p class="activity-date-time">
        <span>活动时间：</span>
        <template v-if="get_user.activityList[activityIndex].period == 1">
          <span class="count_down_css">
            <span>距离活动开始还有</span>
            <ActiveCountDown
              :endTime="inStartTime"
              :noNeedCss="true"
            ></ActiveCountDown>
          </span>
        </template>
        <template v-else-if="get_user.activityList[activityIndex].period == 2">
          <template
            v-if="get_user.activityList[activityIndex].type == 2 && inEndTime"
          >
            <span class="count_down_css">
              <span>距离活动关闭还有</span>
              <ActiveCountDown
                :endTime="inEndTime"
                :noNeedCss="true"
              ></ActiveCountDown>
            </span>
          </template>
          <span v-else>活动长期有效</span>
        </template>
        <span v-else> 活动结束 </span>
      </p>
      <p>
        活动内容：
        <span class="text-orange">
          {{
            actId == 1
              ? "『每日』达成指定任务，即可获得对应数量的普通奖券，普通奖券可至『老虎机』进行合成并参与老虎机抽奖。"
              : "『每周/月』达成指定任务，即可获得对应数量的普通奖券，普通奖券可至『老虎机』进行合成并参与老虎机抽奖。"
          }}</span
        >
      </p>
    </div>
    <div class="activity_content">
      <div class="content_title">活动内容</div>
      <!-- 成长任务展示这个模块 -->
      <div v-if="actId == 2" class="betting_data text-center text-333">
        <div
          v-for="(item, i) in cumulative_betting_list"
          :key="i + '_iid'"
          :class="i == 1 ? `relative-position` : i + '_iid'"
        >
          <p class="relative-position">
            <span> {{ i == 1 ? "本周" : "本月" }}累计 {{ item.name2 }} </span>
            <span class="text-orange">
              {{ item.mBet != null ? item.mBet : "-" }}
            </span>
            <span>{{ i == 0 ? "天" : "元" }}</span>
          </p>
        </div>
      </div>
      <div class="table">
        <div class="table-header text-333">
          <p  v-if="actId === 1">每日任务</p>
          <p class="task-matters task-matters-title">任务事项</p>
          <p>状态</p>
          <p>奖券数量</p>
          <p>领取状态</p>
        </div>
        <load-data state="data">
          <div
            v-for="(v, i) in get_everyDay_list"
            :key="i + '_id_'"
            v-show="get_everyDay_list.length > 0"
            :class="{ 'last-row': i == get_everyDay_list.length - 1 }"
            class="table-body relative-position"
          >
          <p v-if="actId === 1" class="td-item text-left mission-name">{{v?.taskTittle}}</p>
            <p class="td-item td-item-taskName text-left task-matters task-matters-content" :class="`task-matters-text-${actId}`" v-html="v.taskName"></p>
            <p
              class="td-item"
              :class="{
                'to-be-completed': [2].includes(v.bonusType),
                completed: [1, 3].includes(v.bonusType),
              }"
            >
              <template v-if="[1, 3].includes(v.bonusType)">
                <span class="to-be-completed-stata">已完成</span>
                <img
                  class="completed"
                  :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_box${
                    get_theme.includes('y0') ? '_y0' : ''
                  }.svg`"
                  alt=""
                />
              </template>
              <template v-else> 未完成 </template>
            </p>
            <p class="td-item ticket-num">{{ v.ticketNum }}</p>

            <div class="td-item" v-if="v.bonusType == 1">已领取</div>
            <div v-else-if="v.bonusType == 2" class="td-item to-be-completed">
              待完成
            </div>
            <div
              v-else-if="v.bonusType == 3"
              class="td-item td-item-receive  flex align_items justify-center"
              :class="{ 'Ash-grey': isDuringDate(inStartTime, inEndTime) == 3 }"
              @click.stop="task_receive_btn(v.bonusId)"
            >
              <span class="receive">领取</span>
            </div>
          </div>
        </load-data>
      </div>
      <p class="text-center updateInteval">
        <span>每{{ actId == 1 ? "5分钟" : "小时" }}更新一次</span>
      </p>
      <p class="history text-center text-333" @click="show_dialog(1,1)">
        领取记录
      </p>
      <div class="task_intro">
        <p>
          您可每日按照指定任务进行完成，完成指定任务后可获得普通奖券，普通奖券可用于合成系统，参加老虎机抽奖。同时也可一键领取全部已完成任务，诚邀您的参与！
        </p>
        <p>
          <span class="text-orange text-center" @click="all_receive(null)"
            >一键领取</span
          >
        </p>
      </div>
    </div>
    <div class="activity_rules text-gray">
      <div class="content_title">活动规则</div>
      <p>
        {{
          actId == 1
            ? "会员每日达成指定任务，即可获得对应数量的普通奖券；"
            : "会员周期内达成指定任务，即可获得对应数量的普通奖券；"
        }}
      </p>
      <p v-if="actId == 1">
        每日在本场馆累计投注<span>≥100</span>元，即视为投注1天；
      </p>
      <p v-else>
        单笔注单投注<span>≥100</span>元，方可视为每日任务活动有效注单；
      </p>
      <p v-if="actId == 1">
        成长任务数据每小时更新一次，在下个自然周/自然月数据将自动清零重新计算，请会员于自然周期最后一天提前<span>一小时</span>完成任务并领取奖券，避免因数据延迟导致领取失败；
      </p>
      <p v-else>
        每日任务数据每<span>5</span>分钟更新一次，在次日数据将自动清零重新计算，请会员每日提前<span>30</span>分钟完成任务并领取奖券，避免因数据延迟导致领取失败；
      </p>
      <p v-if="actId == 1">
        成长任务活动有效注单以结算时间为准。任何低于欧洲盘<span>1.5</span>(香港盘<span>0.5</span>)水位、同场赛事中投注对等盘口、串关注单，皆不予计算；
      </p>
      <p v-else>
        每日任务活动有效注单以结算时间为准，且需满足单笔投注金额<span>≥100</span>元。任何低于欧洲盘<span>1.5</span>(香港盘<span>0.5</span>)水位、同场赛事中投注对等盘口、串关注单，皆不予计算；
      </p>
      <p>
        每位有效会员、每个手机号、每个电子邮箱、每张银行卡、每个IP地址、每台电脑使用者，仅可享受1次优惠，如会员使用一切不正当投注、套利等违规行为，我们将保留无限期审核扣回奖金及所产生利润的权利；
      </p>
      <p>为避免文字理解差异，本场馆保留本活动最终解释权。</p>
    </div>

    <!-- 历史记录弹框 -->
    <q-dialog v-model="history_alert">
      <q-layout view="Lhh lpR fff" container class="receiveHistory">
        <img
          class="close"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/dialog_close.png`"
          alt=""
          @click.self="history_alert = false"
          width="30px"
        />
        <div class="betting_history">
          <div class="content_title text-center text-333">领取记录</div>
          <div class="table table_history relative-position">
            <div class="records-header text-333 text-center">
              <p>任务</p>
              <p>奖券数量</p>
              <p>领取时间</p>
            </div>
            <load-data state="data">
              <div
                class="text-666 text-center table_content"
                v-for="(item, index) in history_records"
                :key="index"
              >
                <p class="p-tast-name" v-html="item.taskName">
                </p>
                <p class="td-item">
                  <span>{{ item.ticketNum }}</span>
                </p>
                <p class="td-item">
                  <span>{{ item.receiveTime }}</span>
                </p>
              </div>
            </load-data>
          </div>
          <div class="pagination_wrap" v-if="history_records.length > 0">
            <div class="pagination_with_input">
              <q-pagination class="pagination pager"
                            :model-value="result_page_info.current"
                            @update:model-value="changeCurrnet"
                            :max="pagenationMax"
                            boundary-numbers
                            :max-pages="10"
              ></q-pagination>
              <p class="goto_page text-666">
                <span @click="goToHistoryPage(null)">&nbsp;&nbsp;跳转至</span>&nbsp;&nbsp;<input type="number" v-model="page_temp" :max="pagenationMax" @keyup="goToHistoryPage($event)">&nbsp;&nbsp;页
              </p>
            </div>
          </div>
        </div>
      </q-layout>
    </q-dialog>
    <!-- 领取奖券弹窗 -->
    <!--    <q-dialog v-model="daily_task_success">-->
    <!--      <div class="daily_task_dialog" @click.self="daily_task_success = false">-->
    <!--        <div class="task_success">-->
    <!--          <div class="title">-->
    <!--            {{-->
    <!--              pop_parameter.ticket >= 0-->
    <!--                ? `恭喜您，获得 ${pop_parameter.ticket} 张奖券`-->
    <!--                : "领取失败，请重新领取奖券"-->
    <!--            }}-->
    <!--          </div>-->
    <!--          <img-->
    <!--            :src="-->
    <!--              pop_parameter.ticket >= 0-->
    <!--                ? pop_parameter.success-->
    <!--                : pop_parameter.failure-->
    <!--            "-->
    <!--            alt=""-->
    <!--          />-->
    <!--          <div-->
    <!--            class="Go-to-lottery"-->
    <!--            :class="{ failure: pop_parameter.ticket < 0 }"-->
    <!--            @click="Reclaim"-->
    <!--          >-->
    <!--            {{ pop_parameter.ticket >= 0 ? "我知道了" : "重新领取" }}-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <img-->
    <!--          class="colse2"-->
    <!--          @click="daily_task_success = false"-->
    <!--          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity/colse2.png`"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </q-dialog>-->
<!--    领取弹窗-->
    <LotteryDialog
      :getLotteryDialog="daily_task_success"
      :getLotteryNum="pop_parameter.ticket"
      :getLotterySuc="daily_task_success"
      :getLotteryAgain="getLotteryAgain"
      @getLottery="task_receive_btn"
      @close_lottery_dialog="Reclaim" />
  </div>
</template>

<script>
import DataPager from "project/activity/src/components/data_pager/data_pager-pc.vue";
import ActiveCountDown from "project/activity/src/components/active_count_down/active_count_down-pc.vue";
import growth_task_mixin from "project/activity/src/mixins/growth_task/growth_task.js";
import LotteryDialog from "project/activity/src/pages/yazhou-pc/components/lottery_dialog.vue";
export default {
  mixins: [growth_task_mixin],
  components: {
    DataPager,
    LotteryDialog,
    ActiveCountDown,
  },
};
</script>

<style lang="scss" scoped>
.betting_history{
  .records-header,.table_content{
    p:nth-child(1){
      flex: 2;
    }
    p:nth-child(2){
      flex: 1;
    }
    p:nth-child(3){
      flex: 1;
    }
  }
  .table_content{
    p:nth-child(2){
      //background: url("~public/image/activity_imgs/imgs/juan_red.png")
    }
  }
}
.tabs_content {
  .activity-date-time {
    span {
      color: var(--qq--activity-text-color-7);
    }
  }

  .activity_content {
    .table {
      width: 1000px;
      margin: 0 auto;
      overflow: hidden;
      font-size: 16px;

      .td-item {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        &.completed {
          display: flex;
          .completed {
            margin-left: 5px;
          }
        }
        .to-be-completed-stata{
          color: var(--qq--activity-text-color-4);
        }
        .receive{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 38px;
          margin-top: 11px;
          color: #fff;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          background-image: var(--qq--activity-btn-bg-img2);
          cursor: pointer;
        }
      }

      .task-matters{
            flex: 3 !important;
            justify-content: flex-start !important;
            text-align: left;
        }
        .task-matters-text-2 {
          padding-left: 20px !important;
        }
      .task-matters-title {
        text-align: center;
      }
      .task-matters-content {
        padding-left: 20px !important;
      }

      .table-header {
        background: var(--qq--activity-bg-color-4);
        height: 100%;
        width: 100%;
        height: 46px;
        line-height: 46px;
        display: flex;
        margin: 0;
        border-radius: 10px 10px 0 0;
        border: 1px solid var(--qq--activity-bd-color-5);
        border-bottom: 0 none;
      }

      :deep(.empty) {
        min-height: 200px;
      }

      div {
        display: flex;
        margin: 0;
        p {
          text-align: center;
          flex: 1;

          &.text-orange {
            background: var(--qq--activity-btn-bg-img1) no-repeat 130px center;
          }
        }

        p:nth-child(1) {
          flex: 1;
          justify-content: center;
        }

        &.table-body {
          min-height: 60px;
          border: 1px solid var(--qq--activity-bd-color-5);
          border-top: 0 none;

          &:nth-child(even) {
            background: var(--qq--activity-bg-color-5);
          }

          &:not(:last-child) {
            border-bottom: 1px solid var(--qq--activity-bd-color-5);
          }

          p:not(:last-child) {
            border-right: 1px solid var(--qq--activity-bd-color-5);
          }

          p:nth-child(odd) {
            color: var(--qq--activity-text-color-3);
          }

          p:nth-child(even) {
            color: var(--qq--activity-text-color-5);
          }

          p:nth-child(1) {
            text-align: left;
            // padding-left: 20px;
            display: flex;
            align-items: center;
          }

          p:not(:first-child) {
            //line-height: 60px;
          }

          .getLottery {
            span {
              display: block;
              width: 120px;
              height: 38px;
              line-height: 38px;
              background: var(--qq--activity-btn-bg-img2);
              font-size: 14px;
              font-family: PingFangSC-Medium;
              margin: 11px auto 0;
              cursor: pointer;
              position: relative;
            }

            .get_gray::after {
              content: "";
              display: block;
              position: absolute;
              width: 120px;
              height: 38px;
              top: 0;
              border-radius: 33px;
              cursor: auto;
              background: rgba(0, 0, 0, 0.2);
              -webkit-filter: grayscale(50%);
              filter: grayscale(50%);
            }
          }
        }
      }
    }

    .updateInteval {
      margin-top: 15px;

      span {
        position: relative;
        color: var(--qq--activity-text-color-7);
      }

      span::after {
        content: "";
        display: block;
        width: 6px;
        height: 6px;
        background: var(--qq--activity-bg-color-6);
        border-radius: 3px;
        position: absolute;
        left: -15px;
        top: 8px;
      }
    }

    .history {
      width: 200px;
      height: 60px;
      line-height: 60px;
      background-image: var(--qq--activity-bd-img-3);
      background-size: 100% 100%;
      margin: 15px auto 35px;
      border-radius: 30px;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      cursor: pointer;
      border: 1px solid var(--qq--activity-bd-color-3);
      font-weight: 600;
    }

    .task_intro {
      width: 1000px;
      background: var(--qq--activity-bg-color-2);
      border-radius: 10px;
      margin: 0 auto;
      display: flex;
      padding: 15px;

      p:nth-child(1) {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--qq--activity-text-color-3);
        flex: 2;
        line-height: 26px;
      }

      p:nth-child(2) {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: var(--qq--activity-text-color-active);
        flex: 1;
        display: flex;
        justify-content: space-evenly;
        padding-top: 8px;

        span {
          display: inline-block;
          width: 120px;
          height: 38px;
          line-height: 36px;
          border-radius: 15px;
          cursor: pointer;
          margin-left: 20px;
        }

        span:nth-child(1) {
          background-image: var(--qq--activity-bd-img-4);
        }
      }
    }

    .betting_data {
      width: 1000px;
      height: 110px;
      margin: 0 auto 35px;
      background-image: var(--qq--activity-bd-img-gradient-2);
      border: 1px solid var(--qq--activity-bd-color-4);
      border-radius: 30px;
      display: flex;

      div {
        flex: 1;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        font-weight: 600;
        padding-top: 20px;

        span:nth-child(1) {
          display: block;
        }

        span:nth-child(2) {
          font-family: DINPro-Medium;
          font-size: 34px;
          font-weight: 500;
          position: relative;
          top: 2px;
        }

        &:nth-child(2)::after {
          display: block;
          content: "";
          width: 1px;
          height: 60px;
          background: var(--qq--activity-bg-color-3);
          position: absolute;
          right: 0;
          top: 24px;
        }

        &:nth-child(2)::before {
          display: block;
          content: "";
          width: 1px;
          height: 60px;
          background: var(--qq--activity-bg-color-3);
          position: absolute;
          left: 1px;
          top: 24px;
        }
      }
    }
  }

  :deep(.scroll) {
    overflow: hidden !important;
    /*  分页器 */
  }

  :deep(.q-btn__wrapper) {
    width: 24px;
    height: 24px;
    padding-top: 0;
  }

  :deep(.q-btn__wrapper:before) {
    box-shadow: none;
    border: 0.5px solid var(--qq--activity-bd-color-6);
  }

  :deep(.q-icon) {
    color: var(--qq--activity-text-color-3);
    display: inline-block;
    font-size: 13px;
    width: 24px;
    min-width: 24px;
    height: 24px;
    line-height: 20px;
    border-radius: 2px;
  }

  :deep(.q-btn:not(.text-white)) {
    & > div {
      &:before {
        border: 0.5px solid var(--qq--activity-bd-color-6);
      }
    }
  }

  :deep(.q-btn) {
    min-width: 24px !important;
    width: 24px;
    height: 24px;
    font-size: 12px;

    & > div {
      height: 24px !important;
      min-height: 24px;
      line-height: 24px;

      div {
        height: 24px;
      }
    }

    &:not(:last-child) {
      margin-right: 5px;
    }

    &:last-child {
      margin-right: 5px;
    }
  }

  :deep(.bg-primary) {
    background: var(--qq--activity-bg-color-7) !important;
  }
}

.receiveHistory {
  width: 1300px;
  max-width: 1300px;
  max-height: 970px;
  border: 1px solid transparent;
  border-radius: 17px;
  position: relative;
  box-shadow: none;

  .close {
    position: absolute;
    right: 0;
    top: -50px;
    width: 30px;
    cursor: pointer;
    z-index: 99;
  }

  :deep(.absolute-full) {
    display: flex;
    align-items: center;
  }

  .scroll {
    overflow: hidden;
  }

  .betting_history {
    width: 1166px;
    margin: 50px auto 0;
    background: var(--qq--activity-bg-color);
    border: 1px solid var(--qq--activity-bd-color-2);
    box-shadow: var(--qq--activity-box-shadow-2);
    border-radius: 30px;
    height: 630px;
    .pagination_with_input{
      :deep(.bg-primary) {
        background: var(--qq--activity-bg-color-7) !important;
      }
    }

    .content_title {
      width: 260px;
      height: 62px;
      background-image: var(--qq--activity-bd-img-1);
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      line-height: 62px;
      font-family: PingFangSC-Medium;
      font-size: 24px;
      text-align: center;
      margin: 0 auto;
      position: relative;
      top: -24px;
      margin-bottom: 30px;
      color: var(--qq--activity-text-color-active);
    }

    .table_history {
      width: 1000px;
      overflow: hidden;
      top: -32px;
      margin: 0 auto;

      .text-333 {
        border: 1px solid var(--qq--activity-bd-color-5);
        border-radius: 10px 10px 0 0;
        border-bottom: 0 none;
      }

      .load-data-wrap{
        height: 420px;
        overflow-y: auto;
      }
      ::-webkit-scrollbar {
        display: none;
      }
      div {
        display: flex;
        justify-content: space-between;
        font-size: 16px !important;
        font-family: DINPro-Medium;

        p:nth-child(1) {
          flex: 1;
          justify-content: center;
          // padding-left: 20px;
        }
        // p:nth-child(2),
        // p:nth-child(3) {
        //   flex: 1;
        // }
      }

      .table_content {
        border: 1px solid var(--qq--activity-bd-color-5);
        border-top: 0 none;

        .td-item{
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .p-tast-name{
          justify-content: flex-start;
        }
        &:nth-child(odd) {
          background: var(--qq--activity-bg-color-5);
        }

        p:not(:last-child) {
          border-right: 1px solid var(--qq--activity-bd-color-5);
        }

        p:nth-child(1) {
          text-align: left;

          padding-left: 20px;
          font-family: PingFangSC-Regular;
          display: flex;
          align-items: center;
          line-height: normal;
        }

        p:nth-child(2) {
          background: url($SCSSPROJECTPATH + "/activity/yazhou-pc/activity_imgs/imgs/juan_red.png")
            no-repeat 75px center;
          background-size: 26px;
        }

        &:not(:last-child) {
          p {
            border-bottom: 1px solid var(--qq--activity-bd-color-5);
          }
        }
      }

      .text-333 {
        height: 46px;
        background: var(--qq--activity-text-color-6);
        font-family: PingFangSC-Medium;
        font-size: 16px;
      }

      .text-666 {
        min-height: 60px;
        line-height: 60px;
        font-size: 16px;
      }
    }
  }
}

.lottery {
  box-shadow: none;
  width: 750px;
  max-width: 750px;
  height: 600px;
  background: url($SCSSPROJECTPATH + "/activity/yazhou-pc/activity_imgs/imgs/get_lottery_bg.png")
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
    background-image: var(--qq--activity-bd-img-gradient-3);
    border: 1px solid var(--qq--activity-bd-color);
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
    background-image: var(--qq--activity-bg-img-active);
    border: 1px solid var(--qq--activity-bd-color);
    box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.17);
    border-radius: 33px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    margin: 0 auto;
    cursor: pointer;
  }
}

.pagination_wrap {
  width: 880px;
  display: flex;
  justify-content: center;
  margin: 0 auto 40px;
  font-size: 12px;

  .total_bonus {
    font-size: 20px;
    font-family: PingFangSC-Medium;
  }

  .pagination_with_input {
    display: flex;
    height: 30px;
    line-height: 30px;

    .goto_page {
      span {
        cursor: pointer;
      }

      input {
        margin-bottom: 0;
        border: 0.5px solid var(--qq--activity-bd-color-6);
        width: 32px;
        height: 24px;
        text-align: center;
        outline: none;
        border-radius: 2px;
      }
    }
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
 