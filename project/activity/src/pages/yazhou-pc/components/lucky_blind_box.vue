<template>
  <div class="tabs_content">
    <div class="introduction text-666">
      <p>活动对象：<span class="text-orange">本场馆全体会员</span></p>

      <p class="activity-date-time">
        <span>活动时间：</span>
        <template v-if="get_user.activityList[activityIndex].period == 1">
          <span class="count_down_css">
            <span>距离活动开始还有</span>
            <ActiveCountDown :endTime="inStartTime" :noNeedCss="true"></ActiveCountDown>
          </span>
        </template>
        <template v-else-if="get_user.activityList[activityIndex].period == 2">
          <template v-if="get_user.activityList[activityIndex].type == 2 && inEndTime">
            <span class="count_down_css">
              <span>距离活动关闭还有</span>
              <ActiveCountDown :endTime="inEndTime" :noNeedCss="true"></ActiveCountDown>
            </span>
          </template>
          <span v-else>活动长期有效</span>
        </template>
        <span v-else> 活动结束 </span>
      </p>
      <p>
        活动内容：<span class="text-orange">本场馆内满足任务条件的会员可以获得奖券，消耗奖券可以兑换不同等级的盲盒，并抽取盲盒的随机奖金，每个盲盒100%中奖，让您的奖金收获不停刺激不断！</span>
      </p>
    </div>
    <div class="activity_content">
      <div class="content_title">活动内容</div>
      <div class="lucky_box content text-666">
        <div class="showGifts relative-position">
          <!-- <load-data :state="isLoading" v-if="isLoading != 'data'"> </load-data> -->
          <!-- 非活动结束状态 -->
          <p class="text-center text-666 drawTime" v-show="get_user.activityList[activityIndex].period != 3">
            每天 <span class="text-orange">12:00:00</span> 开抢
          </p>
          <p class="text-center title">
            <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/text-left.svg`" alt="" />
            &nbsp;&nbsp;大奖等您拿&nbsp;&nbsp;
            <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/text-right.svg`" alt="" />
          </p>

          <div class="gifts text-333">
            <div v-for="(item, i) in lihe_list" :key="i + 'i'" @click="lihe_list_click(item, i, 'frequent_clicks')">
              <img :class="{
                'animate-bounce-up': lihe_index == i,
                ' opacity_': lihe_index != i,
              }" :src="item.url" alt="" style="z-index: unset" />
              <span>{{ item.name }}</span>
              <p @click.stop="changeBox(3, true)">
                <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/lucky/gift1.png`" class=""
                  alt="" :class="current_open_box.currentBox == 3
                      ? 'animate-bounce-up'
                      : 'opacity '
                    " />
                <span>钻石盲盒</span>
              </p>
              <p @click.stop="changeBox(2, true)">
                <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/lucky/gift2.png`" class=""
                  alt="" :class="current_open_box.currentBox == 2
                      ? 'animate-bounce-up'
                      : 'opacity '
                    " />
                <span>黄金盲盒</span>
              </p>
              <p @click.stop="changeBox(1, true)">
                <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/lucky/gift3.png`" class=""
                  alt="" :class="current_open_box.currentBox == 1
                      ? 'animate-bounce-up'
                      : 'opacity'
                    " />
                <span>白银盲盒</span>
              </p>
            </div>
          </div>
          <!-- 活动未开始 -->
          <div v-if="get_user.activityList[activityIndex].period == 1">
            <p class="timer text-center text-666">
              <span class="text-orange">{{ day || "00" }} </span>天&nbsp;
              <span class="text-orange">{{ hr || "00" }} </span>时&nbsp;
              <span class="text-orange">{{ min || "00" }} </span>分&nbsp;
              <span class="text-orange">{{ sec || "00" }} </span>秒
            </p>
            <p class="timer_title text-center text-666">距离活动开始还有</p>
            <p class="timer_btn text-white text-center">敬请期待</p>
          </div>
          <!-- 活动已开始并且当前盲盒数量为0 -->

          <!-- 活动已开始 -->
          <div class="active_start" v-if="get_user.activityList[activityIndex].period == 2">
            <p class="text-center title">
              今日剩余<span class="text-orange">{{
                current_open_box.boxNum
              }}</span>个<span>{{
  current_open_box.currentBox == 3
  ? "钻石"
  : current_open_box.currentBox == 2
    ? "黄金"
    : "白银"
}}</span>盲盒
            </p>
            <div class="btns">
              <p class="text-orange text-center btn_blue">
                <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/juan_red.png`" alt="" />
                奖券：{{ tokenNum }}
              </p>
              <!-- 倒计时已结束，可以直接开盲盒 -->
              <p class="text-white text-center btn_red" v-if="openBoxTime <= 0" :class="{
                get_gray:
                  tokenNum < current_open_box.token ||
                  current_open_box.boxNum == 0,
              }" @click="openBox">
                拆盒1次 <br />
                <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/juan_white.png`" alt="" />
                x <span>{{ current_open_box.token }}</span>
              </p>
              <!-- 倒计时未结束，需等待倒计时结束才可继续开盲盒 -->
              <p v-if="openBoxTime > 0" @click="openBox" class="text-white text-center btn_red"
                :class="{ btn_timer: openBoxTime > 0 }" style="line-height: 66px; padding-top: 0">
                {{ openBoxTime }}秒后再次拆盒
              </p>
              <p class="text-666 text-center btn_gray" @click="getBettingHistory">
                历史记录
              </p>
            </div>
          </div>

          <!-- 活动已结束 -->
          <div class="active_end" v-if="get_user.activityList[activityIndex].period == 3">
            <p class="text-orange text-center">活动已结束</p>
            <p class="bettingHistory text-666 text-center" @click="getBettingHistory">
              历史记录
            </p>
          </div>
          <p class="text-center title bonus_list_title text-white" v-if="lucky_top_50.length > 0 &&
            get_user.activityList[activityIndex].period > 1
            ">
            幸运盲盒拆盒榜
          </p>
          <div class="bonus_list table text-center table_top50" v-if="lucky_top_50.length > 0 &&
            get_user.activityList[activityIndex].period > 1
            ">
            <div class="text-333">
              <span>{{ top50.account }}</span>
              <span>{{ top50.bonus }}</span>
              <span>{{ top50.time }}</span>
            </div>
            <div class="scroll_up" ref="scrollUp">
              <div v-for="(item, i) in lucky_top_50" :key="i">
                <span>{{ item ? item.userName : "-" }}</span>
                <span v-if="item && item.remark">{{ item.remark }}</span>
                <span v-if="item && !item.remark">{{
                  item ? item.awardStr : "-"
                }}</span>
                <span>{{ item ? item.createTime : "-" }}</span>
              </div>
            </div>
          </div>
          <div class="pagination_wrap pagination_top50" v-if="lucky_top_50.data.length > 0 &&
            get_user.activityList[activityIndex].period > 1
            ">
            <div class="pagination_with_input">
              <DataPager class="record-data-pager" :total="top50_page_info.pages" :pageSize="5"
                @change="top50_page_changed" />
            </div>
          </div>
          <!-- 盲盒奖品展示列表 -->
          <p v-if="luckyBonus.length > 0" class="text-center title bonus_title text-white">
            盲盒奖品
          </p>
          <div v-if="luckyBonus.length > 0" class="bonus_list bonusList table text-center text-666">
            <p class="text-333">
              <span>钻石盲盒</span>
              <span>黄金盲盒</span>
              <span>白银盲盒</span>
            </p>
            <div class="bonus_list_body">
              <div>
                <span v-for="(v, i) in prizes[1]" :key="i + 'pid'">{{
                  v.name
                }}</span>
              </div>
              <div>
                <span v-for="(v, i) in prizes[2]" :key="i + 'rid'">{{
                  v.name
                }}</span>
              </div>
              <div>
                <span v-for="(v, i) in prizes[3]" :key="i + 'zid'">{{
                  v.name
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 活动规则 -->
    <div class="activity_rules text-gray">
      <div class="content_title">活动规则</div>
      <p>
        会员可根据完成任务获得的奖券数量，抽取三种不同等级盲盒，每种盲盒皆为100%中奖；
      </p>
      <p>
        盲盒数量将于每日12:00、15:00、18:00、21:00、00:00添加数量，先抽先得，如抽完后需待下次更新时间；
      </p>
      <p>盲盒奖励实时派发，仅需在本场馆完成1倍流水即可出款；</p>
      <p>
        本活动仅计算有效注单，且所有注单皆以结算时间为准，任何低于欧洲盘<span color="#ff7000">1.5</span>或香港盘<span
          color="#ff7000">0.5</span>水位、同一赛事中同时投注对等盘口、提前结算以及串关注单，将不予计算（不包含串关注单）；
      </p>
      <p>
        每位有效会员、每个手机号、每个电子邮箱、每张银行卡、每个IP地址、每台电脑使用者，在活动期间仅可享受1次优惠，如会员使用一切不正当投注、套利等违规行为，我们将保留无限期审核扣回彩金及所产生利润的权利；
      </p>
      <p>为避免文字理解差异，本场馆保留本活动最终解释权。</p>
    </div>
    <!-- 历史记录弹框 -->
    <q-dialog v-model="history_alert">
      <div class="history-dialog" :class="{ isIphoneX: isIphoneX }" @click.self="history_alert = false">
        <div class="history-record">
          <div class="choice-title">历史记录</div>
          <div class="history-content">
            <div class="blind-table Member-Ranking">
              <p class="text-white">
                <span>盲盒类型</span><span>奖券消耗数</span><span>奖励</span><span>拆盒时间</span>
              </p>
              <p v-for="(v, i) in history_records" :key="i + 'vip'">
                <span>{{
                  v.boxType == 1
                  ? "白银盲盒"
                  : v.boxType == 2
                    ? "黄金盲盒 "
                    : v.boxType == 3
                      ? "钻石盲盒"
                      : "---"
                }}</span>
                <span>{{ v.useToken }}</span>
                <span :class="{ 'ellipsis-2-lines': v.remark }">
                  <div>{{ v.remark || v.awardStr }}</div>
                </span>
                <span>{{
                  new Date(+v.createTime).Format("yyyy-MM-dd hh:mm")
                }}</span>
              </p>
            </div>
          </div>
          <DataPager class="record-data-pager" :total="result_page_info.pages" :pageSize="7"
            @change="data_page_changed" />
          <img class="close" @click="history_alert = false"
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity/lucky/close.png`" />
        </div>
      </div>
    </q-dialog>
    <!-- 点击获奖的弹框 -->
    <q-dialog v-model="gift_box_alert">
      <div class="gift_box_dialog">
        <img class="gift-img" :src="blind_box_url" alt="" />
        <div class="money">
          <span>{{ amount_of_winning }}</span>
          元
        </div>
        <span>恭喜获得</span>
        <div class="gift-btn" v-if="false">
          <p>再拆1次</p>
          <div class="flex align_items justify-center">
            <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity/diamond1.png`" alt="" />
            <span>x {{ lihe_name.Number_tokens_consumed }}</span>
          </div>
        </div>
        <div class="get-more-tokens" v-else @click="gift_box_alert = false">
          我知道了
        </div>
        <img class="close-img" @click="gift_box_alert = false"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity/lucky/close.png`" alt="" />
      </div>
    </q-dialog>

    <Alert :is_show="showAlert" :text="bettingMsg" :isMaintaining="isMaintaining" />
    <img v-if="activityObj.period == 2"
      :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/silver_box.png`" alt=""
      style="display: none" />
    <img v-if="activityObj.period == 2"
      :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/gold_box.png`" alt=""
      style="display: none" />
    <img v-if="activityObj.period == 2"
      :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/diamond_box.png`" alt=""
      style="display: none" />
    <Toast v-if="showToast" :text="i18n_t('common.limited')" />
  </div>
</template>
<script>
import DataPager from "project/activity/src/components/data_pager/data_pager-pc.vue";
import ActiveCountDown from "project/activity/src/components/active_count_down/active_count_down-pc.vue";
import lucky_blind_box_mixin from "project/activity/src/mixins/lucky_blind_box/lucky_blind_box.js";
export default {
  mixins: [lucky_blind_box_mixin],
  components: {
    DataPager,
    ActiveCountDown,
  },
};
</script>
<style lang="scss" scoped>
.lucky_box {
  .relative-position {
    .full-width {
      .load-data-wrap {
        .loading-wrap {
          margin-top: 0;
        }
      }
    }
  }

  .showGifts {
    margin: 20px auto 0;
    position: relative;

    .load-data-wrap {
      position: absolute;
      width: 100%;
      height: 700px;
      min-height: 400px;
      z-index: 1;
      top: 0;
      background: rgba(255, 255, 255, 0.4);
      display: flex;
      align-items: center;
    }

    p.drawTime {
      font-size: 30px !important;
    }

    .title {
      font-size: 24px !important;
      height: 30px;
      line-height: 30px;

      img {
        display: inline-block;
        vertical-align: bottom;
        width: auto;
        height: auto;
        position: relative;
        top: -10px;
      }
    }

    .timer {
      background-image: linear-gradient(180deg,
          #ffffff 0%,
          #e7e7e7 49%,
          #ffffff 100%);
      box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.17);
      border-radius: 33px;
      width: 260px;
      height: 52px;
      line-height: 52px;
      margin: 0 auto 5px;
      font-size: 14px !important;

      span {
        font-size: 20px !important;
      }
    }

    .timer_title {
      font-size: 18px !important;
      margin: 0 auto 25px;
    }

    .timer_btn {
      background-image: url($SCSSPROJECTPATH + "/activity/yazhou-pc/activity_imgs/imgs/waiting.svg");
      width: 200px;
      height: 60px;
      line-height: 60px;
      margin: 0 auto;
      font-size: 18px !important;
      font-family: PingFangSC-Medium;
    }

    .gifts {
      display: flex;
      justify-content: center;
      margin-top: 40px;
      margin-bottom: 60px;

      p {
        font-size: 22px !important;

        &:nth-child(2) {
          margin: 0 70px;
        }

        img {
          width: 220px;
        }

        span {
          display: block;
          width: 220px;
          text-align: center;
          font-size: 18px !important;
          font-family: PingFangSC-Regular;
        }
      }
    }

    /*  活动开始 */
    .active_start {
      margin-top: 40px;

      .title {
        font-family: PingFangSC-Regular;
        font-size: 18px !important;
      }

      .btns {
        display: flex;
        justify-content: center;
        margin-top: 20px;

        p {
          border-radius: 29px;
          display: inline-block;
          width: 200px;
          height: 60px;
          line-height: 60px;
          cursor: pointer;
          font-size: 18px;
        }

        .btn_blue {
          background-image: url($SCSSPROJECTPATH + "/activity/yazhou-pc/activity_imgs/imgs/lottery.svg");
          cursor: auto;

          img {
            width: 32px;
            position: relative;
            top: 10px;
          }
        }

        .btn_red {
          background-image: url($SCSSPROJECTPATH + "/activity/yazhou-pc/activity_imgs/imgs/waiting.svg");
          line-height: 8px;
          padding-top: 15px;
          margin: 0 35px;
          position: relative;

          img {
            width: 25px;
            position: relative;
            top: 8px;
          }
        }

        .get_gray::after {
          content: "";
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          border-radius: 33px;
          cursor: auto;
          background: rgba(0, 0, 0, 0.2);
          -webkit-filter: grayscale(50%);
          filter: grayscale(50%);
        }

        .btn_timer::after {
          content: "";
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          border-radius: 33px;
          cursor: auto;
          background: rgba(255, 255, 255, 0.4);
          -webkit-filter: grayscale(50%);
          filter: grayscale(50%);
        }

        /*  按钮置灰 */
        .btn_gray {
          background-image: url($SCSSPROJECTPATH + "/activity/yazhou-pc/activity_imgs/imgs/history_list_bg.svg");
        }
      }
    }

    /*  活动结束的展示内容 */
    .active_end {
      margin-top: 20px;

      .text-orange {
        font-size: 24px !important;
        font-family: PingFangSC-Medium;
        margin-bottom: 20px;
      }

      .bettingHistory {
        background-image: url($SCSSPROJECTPATH + "/activity/yazhou-pc/activity_imgs/imgs/history_list_bg.svg");
        border-radius: 30px;
        font-size: 18px !important;
        font-family: PingFangSC-Medium;
        width: 200px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
        margin: 0 auto;
      }
    }

    .bonus_list_title {
      width: 234px;
      height: 56px;
      line-height: 48px;
      font-family: PingFangSC-Medium;
      font-size: 18px !important;
      background-image: url($SCSSPROJECTPATH + "/activity/yazhou-pc/activity_imgs/imgs/btn_bg.png");
      margin: 70px auto 50px;
    }

    .bonus_title {
      width: 234px;
      height: 56px;
      line-height: 48px;
      background-image: url($SCSSPROJECTPATH + "/activity/yazhou-pc/activity_imgs/imgs/btn_bg.png");
      font-family: PingFangSC-Medium;
      font-size: 18px;
      margin: 40px auto 30px;
    }

    /*  幸运盲盒拆盒榜 */
    .bonus_list {
      width: 1000px;
      border: 0 none;
      border-bottom: 1px solid #d8d8d8;
      border-radius: 10px 10px 0 0;

      p {
        margin-bottom: 0;
        display: flex;
        justify-content: space-between;
        height: 60px;
        line-height: 60px;

        &:nth-child(odd) {
          background: #fcfcfc;
        }

        &:nth-child(1) {
          background: #e7eaee;
          border-radius: 10px 10px 0 0;
          font-family: PingFangSC-Medium;
          font-size: 16px !important;
          height: 46px;
          line-height: 46px;

          span {
            border: 0 none;
          }
        }

        span:nth-child(1) {
          flex: 1;
        }

        span:nth-child(2) {
          flex: 1;
        }

        span:nth-child(3) {
          flex: 1;
        }

        &:not(:first-child) {
          span {
            &:nth-child(1) {
              border-left: 1px solid #d8d8d8;
            }
          }
        }
      }
    }

    /*  奖品展示列表 */
    .bonusList {
      border-bottom: 0;

      .bonus_list_body {
        display: flex;
        border: 1px solid #d8d8d8;

        .text-666 {
          height: auto;
          flex: 1;
          display: block;
          background: #fff;
          border-bottom: 0 none;
          border-radius: 0;

          &:not(:last-child) {
            border-right: 1px solid #d8d8d8;
          }

          &:nth-child(1) {
            span {
              line-height: 60px;
            }
          }

          &:nth-child(3) {
            span {
              border-left: 0 none !important;
            }
          }

          span {
            display: block;
            width: 100%;
            height: 60px;
            border-left: 0 none !important;

            &:not(:last-child) {
              border-bottom: 1px solid #d8d8d8;
            }

            &:first-child {
              border-bottom: 1px solid #d8d8d8;
            }
          }
        }
      }
    }

    .tabs {
      height: 70px;
      border: 1px solid #f3c482;
      border-radius: 35px;
      background-image: linear-gradient(180deg, #fdfbf8 1%, #fff4e6 100%);
      display: flex;
      justify-content: space-around;
      width: 1000px;
      margin: 30px auto;
      padding: 3px;

      .tab-item {
        display: inline-block;
        flex: 1;
        line-height: 66px;
        font-size: 26px !important;
        text-align: center;
        cursor: pointer;
        border-radius: 30px;
        transition: all 0.2s;
        color: #666;

        .tips {
          position: absolute;
          width: 84px;
          top: -30px;
          right: 15px;
        }
      }

      .activity {
        background-image: linear-gradient(180deg, #ffe8bc 0%, #e79b40 99%);
        text-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
        color: #fff;
      }
    }
  }
}

.table {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #ced5f4;
  width: 980px;
  margin: 0 auto;

  .text-white,
  .text-333 {
    height: 44px;
    line-height: 44px;
    margin-bottom: 0;
    display: flex;
    justify-content: flex-end;
    font-size: 16px !important;
    font-family: SourceHanSansSC-Medium;

    span {
      display: inline-block;
      flex: 1;

      &:not(:nth-child(1)) {
        border-left: 1px solid #ced5f4;
      }
    }
  }

  &.table_bonus,
  &.table_history,
  .scroll_up {
    position: relative;
    border-top: 1px solid #d8d8d8;

    div,
    .table div {
      height: 60px;
      line-height: 60px;
      margin-bottom: 0;
      display: flex;
      justify-content: flex-end;
      font-size: 16px !important;
      font-family: DINPro-Medium;

      &:not(:last-child) {
        border-bottom: 1px solid #d8d8d8;
      }

      span {
        display: inline-block;
        flex: 1;

        &:not(:nth-child(1)) {
          border-left: 1px solid #d8d8d8;
        }

        &:nth-child(1) {
          border-left: 1px solid #d8d8d8;
        }

        &:nth-child(3) {
          border-right: 1px solid #d8d8d8;
        }
      }

      &:nth-child(even) {
        background: #fcfcfc;
      }
    }
  }
}

.table_history {
  border: 0 none !important;

  .load-data-wrap {
    height: auto !important;
  }

  .text-333 {
    background: #e7eaee;
    height: 46px !important;
    line-height: 46px !important;
    font-family: PingFangSC-Medium;

    span {
      border-left: 0 none !important;
      border-right: 0 none !important;
    }
  }

  .text-666 {
    span {
      border-right: 0 none !important;

      &:last-child {
        border-right: 1px solid #d8d8d8 !important;
      }
    }

    &:last-child {
      span {
        border-bottom: 1px solid #d8d8d8;
      }

      span:last-child {
        border-right: 1px solid #d8d8d8 !important;
        border-radius: 0 0 20px 0;
      }

      span:first-child {
        border-radius: 0 0 0 20px;
      }
    }
  }
}

.table_top50 {
  position: relative;
  max-height: 348px;
  z-index: 1;
  border-radius: 20px 20px 0 0;

  .text-333 {
    position: relative;
    z-index: 1;
    height: 46px;
    line-height: 46px;
    background: #e7eaee;
    border-radius: 10px 10px 0 0;
    font-family: PingFangSC-Medium;
    font-size: 16px !important;

    &>span {
      border: 0 none !important;
    }
  }
}

.history {
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
    justify-content: center;
  }

  .scroll {
    overflow: hidden;
  }

  .betting_history {
    width: 1166px;
    margin: 50px auto 0;
    background: #ffffff;
    border: 1px solid #fec59e;
    box-shadow: 0 2px 40px 0 rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    height: 630px;

    .content_title {
      width: 260px;
      height: 62px;
      background-image: url($SCSSPROJECTPATH + "/activity/yazhou-pc/activity_imgs/imgs/title_bg.svg");
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
    }

    .table_history {
      .text-333 {
        border: 1px solid #e4e4e4;
        border-radius: 10px 10px 0 0;
        border-bottom: 0 none;
      }
    }

    .table {
      width: 880px;
      border: 1px solid #d8d8d8;
      border-radius: 10px 10px 0 0;
      top: -32px;

      .text-white {
        height: 46px;
        line-height: 46px;
        background: #e7eaee;
        font-family: PingFangSC-Medium;
        font-size: 16px;
      }

      .text-666 {
        height: 60px;
        line-height: 60px;
        font-size: 16px;

        &:nth-child(even) {
          background: #fcfcfc;
        }

        &:nth-child(odd) {
          background: #fff;
        }
      }
    }
  }
}

.opacity {
  opacity: 0.5;
}

.pagination_wrap {
  width: 880px;
  display: flex;
  justify-content: center;
  margin: 0 auto 40px;
  font-size: 12px;

  .pagination_with_input {
    display: flex;
    height: 30px;
    line-height: 30px;

    .goto_page {
      input {
        margin-bottom: 0;
        border: 0.5px solid #d2d2d2;
        width: 32px;
        height: 24px;
        text-align: center;
        outline: none;
        border-radius: 2px;
      }
    }
  }
}

.pagination_top50 {
  margin-top: 20px;
  /*  开盒成功弹窗 */
}

.lottery {
  box-shadow: none;
  width: 380px;
  max-width: 380px;
  height: 500px;
  padding-top: 50px;

  .close {
    width: 16px;
    position: absolute;
    right: 25px;
    top: 25px;
    z-index: 1;
    cursor: pointer;
  }

  .content {
    padding: 250px 0 0;

    .money {
      font-size: 60px;
      font-family: DIN-Medium;

      span:nth-child(2) {
        font-size: 16px;
      }
    }
  }

  .title {
    font-family: PingFangSC-Regular;
    max-width: 90%;
    font-size: 16px;
    margin: 0 auto 28px;
  }

  img {
    display: block;
    margin: 0 auto;
    margin-bottom: 30px;
  }

  .get_once_more {
    width: 200px;
    height: 60px;
    line-height: 60px;
    background-image: url($SCSSPROJECTPATH + "/activity/yazhou-pc/activity_imgs/imgs/waiting.svg");
    border-radius: 28px;
    font-size: 18px;
    margin: 0 auto;
  }
}

.tabs_content {

  /*  分页按钮样式 */
  :deep(.q-icon) {
    color: #666;
    display: inline-block;
    font-size: 16px;
    width: 24px;
    min-width: 24px;
    height: 24px;
    line-height: 19px;
    border-radius: 2px;
  }

  :deep(.q-btn) {
    min-width: 24px !important;
    width: 24px;
    height: 24px;
    font-size: 12px;
    border-radius: 2px;

    &>div {
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

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 5px;
    }
  }

  :deep(.scroll) {
    overflow: hidden;
  }

  :deep(.bg-primary) {
    background: #f77000 !important;
  }

  :deep(.q-btn__wrapper) {
    width: 24px;
    height: 24px;
    padding-top: 0;
  }

  :deep(.q-btn__wrapper:before) {
    box-shadow: none;
    border: 0.5px solid #d2d2d2;
  }

  :deep(.text-white) {
    & .q-btn__wrapper:before {
      border: 0 none;
    }
  }

  :deep(.fixed-full) {
    position: absolute !important;
  }

  :deep(.q-dialog__inner) {
    position: absolute !important;
  }
}

.load-data-wrap .text-center {
  font-size: 16px;
}

.load-data-wrap .lucky_box .showGifts .active_start .btns .btn_blue img {
  width: 32px;
  height: auto;
}

.load-data-wrap .text-center img {
  height: auto;
}
</style>
<style scoped>
.scroll_up:hover {
  animation-play-state: paused;
}

.table_bonus .text-gray:nth-child(odd) {
  background-color: #eff1fe;
}

.scroll_up .text-gray:nth-child(odd) {
  background-color: #eff1fe;
}

@keyframes upAnimation {
  0% {
    transform: rotate(0deg);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  10% {
    transform: rotate(-10deg);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  20% {
    transform: rotate(10deg);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  28% {
    transform: rotate(-8deg);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  36% {
    transform: rotate(8deg);
    transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
  }

  42% {
    transform: rotate(-6deg);
    transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
  }

  48% {
    transform: rotate(6deg);
    transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
  }

  52% {
    transform: rotate(-4deg);
    transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
  }

  56% {
    transform: rotate(4deg);
    transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
  }

  60% {
    transform: rotate(0deg);
    transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
  }

  100% {
    transform: rotate(0deg);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
}

.animate-bounce-up {
  animation-name: upAnimation;
  transform-origin: center bottom;
  animation-duration: 2s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
  animation-delay: 0.5s;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>