<template>
  <div class="tabs_content" @touchmove="handleTouch" @mousewheel="handleTouch">
    <div class="introduction text-666">
      <p>活动对象：<span class="text-orange">本场馆全体会员</span></p>
      <p class="activity-date-time">
        活动时间：
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
        活动内容：<span class="text-orange"
          >本场馆内完成任务获得的普通奖券，可在合成系统中向上合成为白银、黄金、钻石奖券，用以参加对应档次的老虎机抽奖</span
        >
      </p>
    </div>
    <div class="slot_machine_content">
      <!-- 老虎机主体 -->
      <div class="slot_machine relative-position">
        <div class="caijin">
          <!-- 彩金道具 -->
          <p :class="{ caijin_transfer: caijin_transfer }">
            {{
              _.get(
                currentSlotData[currentSlotIndex],
                "beforeGameResult.propName"
              ) || "惊喜道具"
            }}
          </p>
          <span class="dot dot_run"></span>
          <span class="dot dot_run_1"></span>
        </div>
        <!-- 老虎机主体图片 -->
        <img
          class="machine"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/machine_silver.png`"
          :style="{
            'z-index':
              _.get(currentSlotData[currentSlotIndex], 'slotId') == 1 ? 2 : 1,
          }"
          alt=""
        />
        <img
          class="machine"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/machine_gold.png`"
          :style="{
            'z-index':
              _.get(currentSlotData[currentSlotIndex], 'slotId') == 2 ? 2 : 1,
          }"
          alt=""
        />
        <img
          class="machine"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/machine_diamond.png`"
          :style="{
            'z-index':
              _.get(currentSlotData[currentSlotIndex], 'slotId') == 3 ? 2 : 1,
          }"
          alt=""
        />
        <!-- 今日抽奖剩余次数 -->
        <p class="draws_number">
          <span
            v-if="_.get(currentSlotData[currentSlotIndex], 'gameTimes') > -1"
          >
            今日抽奖剩余：
            {{ _.get(currentSlotData[currentSlotIndex], "gameTimes") }}
            次 | 0时重置
          </span>
        </p>
        <!-- 数字滚轮 -->
        <div class="scroller" ref="scroller">
          <NumberScroll
            :status="tiger_status"
            :result="tiger_result"
            :initArr="initNums"
            @stop="stop"
            ref="number_scroll"
          />
        </div>
        <!-- 两边的小三角形 -->
        <p class="triangles" v-if="triangle_fade > 0">
          <img
            class="left"
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/triangle_fade/0${triangle_fade}.png`"
            alt=""
          />
          <img
            class="right"
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/triangle_fade/0${triangle_fade}.png`"
            alt=""
          />
        </p>
        <p class="triangles" v-else>
          <img
            class="left"
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/triangle_run/0${triangle_run}.png`"
            alt=""
          />
          <img
            class="right"
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/triangle_run/0${triangle_run}.png`"
            alt=""
          />
        </p>

        <!-- 当前奖金 -->
        <p class="currentBonus">
          当前奖励:
          <span>{{
            _.get(
              currentSlotData[currentSlotIndex],
              "beforeGameResult.reward"
            ) || "0.00"
          }}</span>
        </p>
        <!-- 操作按钮 -->
        <div class="actionBtns">
          <!-- 重置 -->
          <p class="resetBtn">
            <img
              class="top"
              v-if="
                _.get(
                  currentSlotData[currentSlotIndex],
                  'beforeGameResult.propName'
                )
              "
              :class="runResetSlotAnim ? 'resetBtnAnim' : ''"
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/reset_btn_top.png`"
              alt=""
            />
            <img
              class="top"
              v-else
              :class="runResetSlotAnim ? 'resetBtnAnim' : ''"
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/reset_btn_top_gray.png`"
              alt=""
            />
            <img
              @click="resetSlot"
              class="btm"
              v-if="
                _.get(
                  currentSlotData[currentSlotIndex],
                  'beforeGameResult.propName'
                )
              "
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/reset_btn_btm.png`"
              alt=""
            />
            <img
              class="btm"
              v-else
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/reset_btn_btm_gray.png`"
              alt=""
            />
            <span
              >{{
                _.get(currentSlotData[currentSlotIndex], `resetTicketNumber`)
              }}张{{
                _.get(currentSlotData[currentSlotIndex], `resetTicketName`)
              }}</span
            >
          </p>
          <!-- 开始滚动 -->
          <p
            v-if="
              !_.get(currentSlotData[currentSlotIndex], 'beforeGameResult') ||
              !is_init
            "
            class="startScreen"
          >
            <!-- 置灰按钮 -->
            <img
              v-if="
                !is_init ||
                _.get(currentSlotData[currentSlotIndex], 'tokenNum') <
                  _.get(currentSlotData[currentSlotIndex], 'lotteryNum') ||
                Object.keys(beforeGameResult).length != 0 ||
                _.get(currentSlotData[currentSlotIndex], 'gameTimes') == 0
              "
              class="top"
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/start_btn_top_gray.png`"
              alt=""
            />
            <img
              v-else
              class="top"
              :class="runStartAnim ? 'startBtnAnim' : ''"
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/start_btn_top.png`"
              alt=""
            />
            <img
              class="btm"
              v-if="
                !is_init ||
                _.get(currentSlotData[currentSlotIndex], 'tokenNum') <
                  _.get(currentSlotData[currentSlotIndex], 'lotteryNum') ||
                Object.keys(beforeGameResult).length != 0 ||
                _.get(currentSlotData[currentSlotIndex], 'gameTimes') == 0
              "
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/start_btn_btm_gray.png`"
              alt=""
            />
            <img
              @click="start('start')"
              class="btm"
              v-else
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/start_btn_btm.png`"
              alt=""
            />
            <span
              >{{ _.get(currentSlotData[currentSlotIndex], "lotteryNum") }}张{{
                _.get(currentSlotData[currentSlotIndex], "ticketName")
              }}</span
            >
          </p>
          <!-- 确认领取 -->
          <p v-else class="confirm">
            <img
              class="top"
              :class="runStartAnim ? 'startBtnAnim' : ''"
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/confirm_btn_top.png`"
              alt=""
            />
            <img
              @click="start('confirm')"
              class="btm"
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/start_btn_btm.png`"
              alt=""
            />
          </p>
        </div>
        <!-- 摇杆 -->
        <div class="rocker">
          <img
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/rocker_${
              (_.get(currentSlotData[currentSlotIndex], 'slotId') || 1) - 1
            }/0${rocker_anim_index}.png`"
            alt=""
          />
        </div>
        <!-- 老虎机周围的装饰 -->
        <img
          class="goldmoney"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/goldmoney.png`"
          alt=""
        />
        <img
          class="footbaler"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/footbaler.png`"
          alt=""
        />
        <!-- 彩灯 -->
        <span
          v-for="(item, index) in 26"
          :key="index"
          class="normal_light"
          :class="[
            `normal_light_${index + 1}`,
            {
              light_run_pink: light_run_pink == index + 1,
              light_run_blue: light_run_blue == index + 1,
              light_run_yellow: light_run_yellow == index + 1,
            },
            { three_colors: spin_success },
          ]"
        ></span>
      </div>
      <!-- 切换老虎机的按钮 -->
      <div class="switch_slots" v-if="currentSlotData.length">
        <p
          @click="switch_slots(index)"
          v-for="(item, index) in currentSlotData"
          :key="index"
        >
          <img
            v-if="currentSlotIndex == index && index < 3"
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/rocker_${item.slotId}.png`"
          />
          <img
            v-else
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/grey_rocker.png`"
          />
          <span :class="currentSlotIndex == index ? 'active' : ''">
            <span>{{ item.slotName }}</span>
            <br />
            (奖券：{{ item.tokenNum }})
          </span>
        </p>
      </div>
      <!-- 合成奖券和游戏记录按钮 -->
      <div class="btns">
        <p class="synthetic_lottory" @click="is_show_compose = true">
          合成奖券
        </p>
        <p
          class="game_history"
          @click="get_activity_slot_get_game_record(1, 1)"
        >
          游戏记录
        </p>
      </div>
    </div>
    <div class="activity_rules text-gray">
      <div class="content_title">活动规则</div>
      <p>
        会员完成任务获得的普通奖券，可在合成系统中向上合成为白银、黄金、钻石奖券，用以参加对应档次的老虎机抽奖；
      </p>
      <p>每次抽奖获取随机奖金，并搭配随机道具享受奖金加乘；</p>
      <p>
        老虎机抽奖获得的奖金不可重置，道具可以消耗奖券重置，重置次数无上限；
      </p>
      <p>
        合成系统：
        <br /><span
          >a)
          4张普通奖券兑换1张白银奖券、4张白银奖券兑换1张黄金奖券、4张黄金奖券兑换1张钻石奖券，若合成失败有机会返还兑换前奖券；</span
        >
        <br /><span
          >b)
          合成后的奖券仅可用于老虎机抽奖或向上合成更高等级奖券，不可分解成低等级奖券。</span
        >
      </p>
      <p>
        老虎机抽奖：
        <br /><span
          >a)
          老虎机奖励=随机奖金*随机道具(幸运奖券为提升合成几率用道具，若抽取到此项道具，当次奖金默认为一倍)；</span
        >
        <br /><span
          >b) 随机道具可消耗老虎机对应档次的奖券进行重置，重置次数无上限；</span
        >
        <br /><span>c) 点击【确认领取】后，老虎机奖励将派发至本场馆钱包；</span>
        <br /><span
          >d)
          未点击【确认领取】，内容自使用当日起计算保留5天，保留期间仅可进行道具重置，不可使用其他档次的老虎机，若保留时间结束仍未点击【确认领取】，系统将默认当下结果派发奖金至本场馆钱包。</span
        >
      </p>
      <p>奖金实时派发至本场馆钱包，仅需在本场馆完成1倍流水即可取款；</p>
      <p>
        每位有效会员、每个手机号、每个电子邮箱、每张银行卡、每个IP地址、每台设备使用者，仅可享受1次优惠，如会员使用一切不正当投注、套利等违规行为，我们将保留无限期审核扣回奖金及所产生利润的权利；
      </p>
      <p>为避免文字理解差异，本场馆保留本活动最终解释权。</p>
    </div>

    <!-- 游戏记录弹窗 -->
    <q-dialog v-model="gameHistory">
      <q-layout view="Lhh lpR fff" container class="history">
        <img
          class="close"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/dialog_close.png`"
          alt=""
          @click="gameHistory = false"
          width="30px"
        />
        <div class="betting_history">
          <!-- <div class="content_title text-center text-333">
            游戏记录
          </div> -->
          <div class="tab_bar">
            <p
              v-for="(item, index) in historiesBar"
              :key="index"
              @click.stop="get_activity_slot_get_game_record(1, index + 1, 6)"
              :class="
                index + 1 == gameHistoryLists.params.type
                  ? 'active text-orange'
                  : ''
              "
            >
              {{ item }}
            </p>
          </div>
          <!-- 彩金记录 -->
          <div
            class="table table_history"
            v-if="gameHistoryLists.params.type == 1"
          >
            <div class="text-333 text-center">
              <span>滚轴奖金</span>
              <span>道具倍率</span>
              <span>总计彩金</span>
              <span>领取时间</span>
            </div>
            <load-data :state="historyDataState" :limit_height="360">
              <div
                class="text-666 text-center"
                v-for="(item, index) in gameHistoryLists.list"
                :key="index"
              >
                <span>{{ Number(item.award) / 100 || "-" }}</span>
                <span>{{
                  item.prop_times == undefined || item.prop_times == "--"
                    ? "--"
                    : `奖金${item.prop_times}倍卡`
                }}</span>
                <span>{{ Number(item.total_award) / 100 || "-" }}</span>
                <span>{{ new Date(+(item.create_time)).Format('yyyy-MM-dd hh:mm') || "-" }}</span>
              </div>
            </load-data>
          </div>
          <!-- 奖券合成 -->
          <div
            class="table table_history"
            v-else-if="gameHistoryLists.params.type == 2"
          >
            <div class="text-333 text-center">
              <span>消耗奖券数</span>
              <span>合成奖券数</span>
              <span>返还奖券数</span>
              <span>合成时间</span>
            </div>
            <load-data :state="historyDataState" :limit_height="360">
              <div
                class="text-666 text-center"
                v-for="(item, index) in gameHistoryLists.list"
                :key="index"
              >
                <span v-show="item.source_token + ''"
                  >{{ item.source_token }}张<br />{{
                    item.source_token_type
                  }}</span
                >
                <span v-show="item.target_token + ''"
                  >{{ item.target_token }}张<br />{{
                    item.target_token_type
                  }}</span
                >
                <span v-show="item.return_token + ''"
                  >{{ item.return_token }}张<br />{{
                    item.return_token_type
                  }}</span
                >
                <span v-show="item.source_token + ''">{{
                  new Date(+(item.create_time)).Format('yyyy-MM-dd hh:mm') || "-"
                }}</span>
              </div>
            </load-data>
          </div>
          <!-- 重置道具 -->
          <div class="table table_history" v-else>
            <div class="text-333 text-center">
              <span>道具名称</span>
              <span>奖券消耗</span>
              <span>奖券类型</span>
              <span>重置时间</span>
            </div>
            <load-data :state="historyDataState" :limit_height="360">
              <div
                class="text-666 text-center"
                v-for="(item, index) in gameHistoryLists.list"
                :key="index"
              >
                <span>{{ item.prop_type || "-" }}</span>
                <span>{{ item.use_token || "-" }}</span>
                <span>{{ item.use_token_type || "-" }}</span>
                <span>{{ new Date(+(item.create_time)).Format('yyyy-MM-dd hh:mm') || "-" }}</span>
              </div>
            </load-data>
          </div>
          <div class="pagination_wrap" v-if="gameHistoryLists.list.length > 0">
            <div class="pagination_with_input">
              <!-- <q-pagination
                class="pagination pager"
                v-model="gameHistoryLists.params.current"
                :max="gameHistoryLists.params.total"
                direction-links
                boundary-numbers
                :max-pages="10"
                @input="pagination_next"
              ></q-pagination> -->
              <q-pagination class="pagination pager"
                  :model-value="gameHistoryLists.params.current"
                  @update:model-value="pagination_next"
                  :max="pagenation_max"
                  boundary-numbers
                  :max-pages="10"
              ></q-pagination>

              <p class="goto_page text-666">
                <span
                  @click="goToHistoryPage(null)">
                  &nbsp;&nbsp;跳转至</span>&nbsp;&nbsp;
                <input type="number" 
                       v-model="page_temp"
                       :max="pagenation_max"
                       @keyup="goToHistoryPage($event)"
                >&nbsp;&nbsp;页
              </p>
<!--              <p class="goto_page text-666">-->
<!--                &nbsp;&nbsp;跳转至&nbsp;&nbsp;<input-->
<!--                  type="number"-->
<!--                  v-model="goToPage"-->
<!--                  :max="gameHistoryLists.params.total"-->
<!--                  :min="1"-->
<!--                  @keyup="get_activity_slot_get_game_record_go_to_page"-->
<!--                />&nbsp;&nbsp;页-->
<!--              </p>-->
            </div>
          </div>
        </div>
      </q-layout>
    </q-dialog>
    <!-- 合成页 -->
    <compose
      v-if="is_show_compose"
      @close_compose="is_show_compose = false"
      @update_slots_config="update_slots_config"
      :lotteryNum="lottery"
      @play_show_card="play_show_card"
    />
    <!-- 接口数据问题提示弹窗 -->
    <div class="toast_tips" v-if="activityTips.statu">
      {{ activityTips.message }}
    </div>
    <!-- 活动ui提示弹窗 -->
    <div class="activity_alert" v-if="activityTips.status">
      <p class="close" @click="closeActivityTips">+</p>
      <p class="title">奖券</p>
      <div class="content">
        <p class="msg">{{ activityTips.msg }}</p>
        <div class="btns">
          <span @click="closeActivityTips">关闭</span>
        </div>
      </div>
    </div>
    <!-- 背景音循环 -->
    <audio
      :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/media/slot_bg_loop.mp3`"
      ref="slot_bg_loop"
      autoplay
      loop
    />
    <!-- 开始滚动按钮按下 -->
    <audio
      :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/media/start_btn.mp3`"
      ref="audioStart"
    ></audio>
    <!-- 摇杆 -->
    <audio
      :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/media/after_start_btn.mp3`"
      ref="afterAudioStart"
    ></audio>
    <audio
      :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/media/showCard.mp3`"
      ref="showCard"
    ></audio>
    <!-- <Toast v-if="showToast" :text="i18n_t('common.limited')" /> -->
  </div>
</template>
<script>
import slot_machine_mixin from "project/activity/src/mixins/slot_machine/slot_machine.js";
import NumberScroll from "project/activity/src/components/number_scroll/number_scroll-pc.vue";
import compose from "project/activity/src/components/compose/compose-pc.vue";
import DataPager from "project/activity/src/components/data_pager/data_pager-pc.vue";
import ActiveCountDown from "project/activity/src/components/active_count_down/active_count_down-pc.vue";
export default {
  mixins: [slot_machine_mixin],
  components: {
    ActiveCountDown,
    NumberScroll,
    DataPager,
    compose,
  },
};
</script>



<style lang="scss">
.empty-wrap{
  .img{
    background: var(--qq--public-bg-image2);
    margin-bottom: 10px;
    background-size: 100%;
    background-repeat: no-repeat;
  }
}
</style>
<style lang="scss" scoped>
:deep(.bg-primary) {
  background: var(--qq--activity-bg-color-7) !important;
}
.tabs_content {
  .activity-date-time {
    span {
      color: var(--qq--activity-text-color-7);
    }
  }

  .scroll {
    ul {
      width: 320px;
      height: 100px;
      overflow: hidden;
      border: 1px solid var(--qq--activity-bd-color-7);
      border-radius: 6px;
      margin: 40px auto;
      position: relative;

      li {
        width: 60px;
        margin: 0 auto;
        list-style: none;
        position: absolute;
        bottom: 0;

        span {
          display: block;
          width: 50px;
          height: 70px;
          line-height: 70px;
          font-size: 20px;
          color: var(--qq--activity-text-color-2);
          border-bottom: 1px solid var(--qq--activity-bd-color-7);
          text-align: center;
        }
      }
    }
  }

  .slot_machine_content {
    background: url($SCSSPROJECTPATH + "/yazhou-pc/activity_imgs/imgs/slot_machine/slot_machine_bg.jpg")
      no-repeat top center;
    background-size: 105%;
    margin-top: 80px;

    /*  老虎机 */
    .slot_machine {
      width: 800px;
      height: 732px;
      margin: 0 auto;
      z-index: 1;

      .machine {
        position: absolute;
        right: -121px;
        height: 770px;

        transition: all 0.2s ease-in-out;
      }

      .scroller {
        position: absolute;
        top: 213px;
        left: 141px;
        z-index: 3;
        border-radius: 6px;
        overflow: hidden;
      }

      .draws_number {
        position: absolute;
        left: 117px;
        width: 542px;
        text-align: center;
        top: 165px;
        z-index: 3;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: var(--qq--activity-text-color-8);

        span {
          &::before {
            display: inline-block;
            content: "";
            width: 100px;
            height: 2px;
            background: var(--qq--activity-bg-color-8);
            box-shadow: inset 0px 1px 2px 0px rgba(0, 0, 0, 0.5);
            position: absolute;
            top: 15px;
            left: 35px;
          }

          &::after {
            display: inline-block;
            content: "";
            width: 100px;
            height: 2px;
            background: var(--qq--activity-bg-color-8);
            box-shadow: inset 0px 1px 2px 0px rgba(0, 0, 0, 0.5);
            position: absolute;
            top: 15px;
            right: 35px;
          }
        }
      }

      /*  两个三角形的定位 */
      .triangles {
        position: absolute;
        z-index: 3;
        width: 545px;
        height: 55px;
        bottom: 365px;
        left: 115px;

        img {
          width: 53px;
          position: absolute;

          &.left {
            left: 0;
          }
        }

        .right {
          right: 0;
          transform: rotateY(180deg);
        }
      }

      /*  当前奖金 */
      .currentBonus {
        font-size: 24px;
        color: var(--qq--activity-text-color-9);
        letter-spacing: 1.71px;
        text-shadow: 0 2px 2px var(--qq--activity-box-shadow-4);
        position: absolute;
        z-index: 3;
        bottom: 45px;
        left: 150px;

        & > span {
          font-size: 50px;
          text-shadow: var(--qq--activity-text-shadow-2);
          font-weight: 700;
        }
      }

      /*  老虎机上的操作按钮 */
      .actionBtns {
        position: absolute;
        z-index: 3;
        display: flex;
        justify-content: center;
        width: 600px;
        height: 100px;
        left: 85px;
        bottom: 155px;

        p {
          position: relative;
          color: var(--qq--activity-text-color-10);
          font-size: 14px;

          img {
            position: absolute;
            width: 100%;
            display: block;
            cursor: pointer;

            &.btm {
              bottom: 0;
            }
          }

          &.resetBtn {
            flex: 1;

            span {
              position: absolute;
              bottom: -9px;
              display: block;
              width: 200px;
              left: 50px;
              text-align: center;
            }

            img {
              width: 116px;
              margin-left: 50%;
              left: -53px;
            }

            .top {
              bottom: 30px;
            }

            .btm {
              bottom: 19px;
            }
          }

          &.startScreen,
          &.confirm {
            flex: 1;

            img {
              width: 200px;
            }

            .top {
              bottom: 14px;
            }

            .btm {
              bottom: 14px;
            }

            span {
              position: absolute;
              bottom: -8px;
              display: block;
              width: 200px;
              text-align: center;
            }
          }
        }
      }

      .rocker {
        position: absolute;
        right: -8px;
        top: 155px;
        width: 111px;
        height: 330px;
        z-index: 3;
      }

      /*  顶部彩金倍数显示区 */
      .caijin {
        width: 400px;
        text-align: center;
        position: absolute;
        z-index: 3;
        top: 34px;
        left: 189px;
        border-radius: 60px 60px 0 0;
        overflow: hidden;

        p {
          width: 300px;
          margin: 0 auto;
          text-align: center;
          font-family: Helvetica;
          font-size: 40px;
          color: var(--qq--activity-text-color-active);
          letter-spacing: 0;
          text-shadow: var(--qq--activity-text-shadow);
          font-weight: 400;
        }

        & > span.dot {
          display: block;
          position: absolute;

          &:nth-child(2) {
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: var(--qq--activity-bg-color-9);
            box-shadow: 0 0 2px 2px var(--qq--activity-box-shadow-3),
              100px -45px 2px 1px var(--qq--activity-box-shadow-3),
              120px -20px 2px 2px var(--qq--activity-box-shadow-3),
              160px -20px 2px 2px var(--qq--activity-box-shadow-3),
              200px -25px 2px 2px var(--qq--activity-box-shadow-3),
              300px -10px 2.5px 2px var(--qq--activity-box-shadow-3);
            left: 20px;
            bottom: 3px;
          }

          &:nth-child(3) {
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: var(--qq--activity-bg-color-9);
            box-shadow: 0px 0 2px 2px var(--qq--activity-box-shadow-3),
              50px -6px 2px 2px var(--qq--activity-box-shadow-3),
              100px -45px 2px 1px var(--qq--activity-box-shadow-3),
              250px -25px 2px 2px var(--qq--activity-box-shadow-3),
              300px -10px 2px 2px var(--qq--activity-box-shadow-3);
            left: 50px;
            bottom: -30px;
          }
        }
      }

      .goldmoney {
        position: absolute;
        z-index: 4;
        right: -94px;
        bottom: -30px;
      }

      .footbaler {
        position: absolute;
        bottom: 0;
        left: -110px;
        z-index: 1;
      }

      /*  彩灯 */
      .normal_light {
        display: inline-block;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-image: var(--qq--activity-bd-img-gradient-4);
        box-shadow: 0px 3px 0px 0px var(--qq--activity-box-shadow-4);
        position: absolute;
        z-index: 3;
      }

      .normal_light_1 {
        left: 65px;
        bottom: 16px;
      }

      .normal_light_2 {
        left: 52px;
        bottom: 78px;
      }

      .normal_light_3 {
        left: 41px;
        bottom: 139px;
      }

      .normal_light_4 {
        left: 56px;
        bottom: 201px;
      }

      .normal_light_5 {
        left: 66px;
        bottom: 264px;
      }

      .normal_light_6 {
        left: 70px;
        bottom: 326px;
      }

      .normal_light_7 {
        left: 74px;
        bottom: 388px;
      }

      .normal_light_8 {
        left: 78px;
        bottom: 452px;
      }

      .normal_light_9 {
        left: 83px;
        bottom: 515px;
      }

      .normal_light_10 {
        left: 92px;
        bottom: 578px;
      }

      .normal_light_11 {
        left: 174px;
        bottom: 587px;
      }

      .normal_light_12 {
        left: 256px;
        bottom: 587px;
      }

      .normal_light_13 {
        left: 338px;
        bottom: 587px;
      }

      .normal_light_14 {
        left: 420px;
        bottom: 587px;
      }

      .normal_light_15 {
        left: 502px;
        bottom: 587px;
      }

      .normal_light_16 {
        left: 584px;
        bottom: 587px;
      }

      .normal_light_17 {
        left: 666px;
        bottom: 578px;
      }

      .normal_light_18 {
        right: 108px;
        top: 197px;
      }

      .normal_light_19 {
        right: 104px;
        top: 261px;
      }

      .normal_light_20 {
        right: 100px;
        top: 325px;
      }

      .normal_light_21 {
        right: 96px;
        top: 386px;
      }

      .normal_light_22 {
        right: 92px;
        top: 449px;
      }

      .normal_light_23 {
        right: 81px;
        top: 511px;
      }

      .normal_light_24 {
        right: 65px;
        top: 574px;
      }

      .normal_light_25 {
        right: 77px;
        top: 638px;
      }

      .normal_light_26 {
        right: 91px;
        top: 700px;
      }

      /*  彩灯跑动颜色---粉色 */
      .light_run_pink {
        background-image: var(--qq--activity-bd-img-gradient-5);
        filter: drop-shadow(0px 0px 10px var(--qq--activity-drop-shadow));
      }

      .light_run_blue {
        background-image: var(--qq--activity-bd-img-gradient-6);
        filter: drop-shadow(0px 0px 10px var(--qq--activity-drop-shadow-2));
      }

      .light_run_yellow {
        background-image: var(--qq--activity-bd-img-gradient-7);
        filter: drop-shadow(0px 0px 10px var(--qq--activity-drop-shadow-3));
      }
    }

    /*  切换老虎机的按钮 */
    .switch_slots {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 35px;
      height: 90px;
      background-image: var(--qq--activity-bd-img-gradient-8);

      p {
        flex: 1;
        height: 60px;
        display: flex;
        justify-content: center;
        cursor: pointer;

        img {
          width: 60px;
          margin-right: 14px;
          top: -3px;
        }

        & > span {
          display: inline-block;
          padding-top: 5px;
          font-size: 20px;
          color: var(--qq--activity-text-color-3);

          span {
            font-size: 24px;
          }
        }

        .active {
          span {
            color: var(--qq--activity-text-color-4);
          }
        }

        &:nth-child(2) {
          position: relative;

          &::after {
            display: block;
            content: "";
            width: 1px;
            height: 54px;
            background: var(--qq--activity-bg-color-10);
            position: absolute;
            top: 3px;
            left: 0;
          }

          &::before {
            display: block;
            content: "";
            width: 1px;
            height: 54px;
            background: var(--qq--activity-bg-color-10);
            position: absolute;
            top: 3px;
            right: 0;
          }
        }
      }
    }

    /*  奖券合成按钮 */
    .btns {
      margin-top: 80px;
      display: flex;
      justify-content: center;

      p {
        width: 200px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
      }

      .synthetic_lottory {
        background-image: var(--qq--activity-bd-img-5);
        color: var(--qq--activity-text-color-active);
        margin-right: 80px;
      }

      .game_history {
        background-image: var(--qq--activity-bd-img-6);
        background-size: 100% 100%;
        color: var(--qq--activity-text-color-2);
      }
    }
  }

  :deep(.q-icon) {
    color: var(--qq--activity-text-color-6);
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
    background: var(--qq--activity-bg-color-7) !important;
  }

  :deep(.q-btn__wrappers) {
    width: 24px;
    height: 24px;
    padding-top: 0;
  }

  :deep(.q-btn__wrapper:before) {
    box-shadow: none;
    border: 0.5px solid var(--qq--activity-bd-color-6);
  }

  :deep(.text-white) {
    & .q-btn__wrapper:before {
      border: 0 none;
    }
  }
}

/*  游戏记录弹窗样式 */
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
    background: var(--qq--activity-bg-color);
    border: 1px solid var(--qq--activity-bd-color-2);
    box-shadow: var(--qq--activity-box-shadow-2);
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

    .tab_bar {
      display: flex;
      justify-content: left;
      margin: 50px 0 15px;

      p {
        font-size: 24px;
        color: var(--qq--activity-text-color-11);
        width: 100px;
        text-align: center;
        width: 160px;
        position: relative;
        cursor: pointer;

        &.active {
          color: var(--qq--activity-text-color-4);
        }

        &:nth-child(2)::before {
          display: block;
          content: "";
          width: 1px;
          height: 24px;
          border: 1px solid var(--qq--activity-bd-color-9);
          position: absolute;
          top: 6px;
        }

        &:nth-child(2)::after {
          display: block;
          content: "";
          width: 1px;
          height: 24px;
          border: 1px solid var(--qq--activity-bd-color-9);
          position: absolute;
          right: 0;
          top: 6px;
        }
      }
    }

    .table_history {
      .text-333 {
        border: 1px solid var(--qq--activity-bd-color-5);
        border-radius: 10px 10px 0 0;
        border-bottom: 0 none;
        display: flex;
        justify-content: space-between;
        height: 46px;
        line-height: 46px;
        background: var(--qq--activity-bg-color-4);
        font-size: 18px;
        color: var(--qq--activity-text-color-11);
        text-align: center;
        font-weight: 500;

        span {
          flex: 1;
        }
      }
    }

    .table {
      width: 1128px;
      border: 1px solid var(--qq--activity-bd-color-9);
      border-radius: 10px;
      margin: 0 auto;

      .text-white {
        height: 46px;
        line-height: 46px;
        background: var(--qq--activity-bg-color-4);
        font-family: PingFangSC-Medium;
        font-size: 16px;
      }

      .text-666 {
        height: 60px;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid var(--qq--activity-bd-color-5);

        &:not(:last-child) {
          border-bottom: 1px solid var(--qq--activity-bd-color-5);
        }

        &:nth-child(6) {
          border-bottom: 1px solid transparent !important;
          border-radius: 30px !important;
        }

        span {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          &:not(:last-child) {
            border-right: 1px solid var(--qq--activity-bd-color-5);
          }

          &:last-child {
            border-bottom: 1px solid transparent !important;
          }
        }

        &:nth-child(even) {
          background: var(--qq--activity-bg-color-5);
        }

        &:nth-child(odd) {
          background: var(--qq--activity-bg-color);
        }
      }
    }
  }
}

/*  翻页组件样式 */
.pagination_wrap {
  width: 880px;
  display: flex;
  justify-content: center;
  margin: 15px auto 40px;
  font-size: 12px;

  .pagination_with_input {
    display: flex;
    height: 30px;
    line-height: 30px;

    .goto_page {
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

/*  简易提示语弹窗 */
.toast_tips {
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 10px 20px;
  border-radius: 2px;
  text-align: center;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background: var(--qq--activity-bg-color-11);
  border-radius: 6px;
  color: var(--qq--activity-text-color-active);
}

/*  ui 样式的弹窗 */
.activity_alert {
  width: 376px;
  min-height: 155px;
  background-image: var(--qq--activity-bd-img-gradient-9);
  border-radius: 15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  font-size: 18px;
  padding: 2px;

  .close {
    width: 18px;
    height: 18px;
    background: var(--qq--activity-bg-color);
    border-radius: 50%;
    text-align: center;
    line-height: 18px;
    font-size: 16px;
    font-weight: 600;
    transform: rotate(45deg);
    color: var(--qq--activity-text-color-12);
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }

  .title {
    text-align: center;
    color: var(--qq--activity-text-color-13);
    height: 42px;
    line-height: 42px;
  }

  .content {
    width: 370px;
    min-height: 110px;
    background: var(--qq--activity-bg-color-12);
    box-shadow: var(--qq--activity-box-shadow-5);
    border-radius: 12px;
    margin: 0 auto;
    overflow: hidden;

    .msg {
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: var(--qq--activity-text-color-14);
      font-weight: 700;
      padding: 20px;
    }

    .btns {
      display: flex;
      justify-content: center;
      text-align: center;
      background: var(--qq--activity-bg-color);
      height: 42px;
      line-height: 42px;

      span {
        flex: 1;
        cursor: pointer;

        &:nth-child(1) {
          color: var(--qq--activity-text-color-15);
        }
      }
    }
  }
}

/*  动画相关---------------------------------------------- */
/*  重置按钮动画 */
.resetBtnAnim {
  animation-name: buttons1;
  animation-duration: 500ms;
  animation-iteration-count: 1;
}

.startBtnAnim {
  animation-name: buttons2;
  animation-duration: 500ms;
  animation-iteration-count: 1;
}

/*  彩金背景动效 */
.dot_run {
  animation-name: dotRun;
  animation-duration: 900ms;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
}

.dot_run_1 {
  animation-name: dotRun1;
  animation-duration: 700ms;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
}

/*  彩灯  三种颜色交替闪动 */
.three_colors {
  animation-name: lightsLight;
  animation-duration: 2200ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

/*  彩金文字缩放动效 */
.caijin_transfer {
  animation-name: scaleText;
  animation-duration: 800ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes buttons1 {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(9px);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes buttons2 {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(13px);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes dotRun {
  0% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(-70px);
  }
}

@keyframes dotRun1 {
  0% {
    transform: translateY(10px);
  }

  100% {
    transform: translateY(-70px);
  }
}

@keyframes lightsLight {
  0% {
    /*  白 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      var(--qq--activity-bg-color-14) 80%
    );
    box-shadow: 0px 3px 0px 0px var(--qq--activity-box-shadow-4);
  }

  8.3% {
    /*  红 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      var(--qq--activity-bg-color-15) 80%
    );
    filter: drop-shadow(0px 0px 10px var(--qq--activity-bg-color-15));
  }

  16.6% {
    /*  白 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      var(--qq--activity-bg-color-14) 80%
    );
    box-shadow: 0px 3px 0px 0px var(--qq--activity-box-shadow-4);
  }

  25% {
    /*  红 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      var(--qq--activity-bg-color-15) 80%
    );
    filter: drop-shadow(0px 0px 10px var(--qq--activity-bg-color-15));
  }

  33.2% {
    /*  白 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      var(--qq--activity-bg-color-14) 80%
    );
    box-shadow: 0px 3px 0px 0px var(--qq--activity-box-shadow-4);
  }

  41.4% {
    /*  黄 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      yellow 80%
    );
    filter: drop-shadow(0px 0px 10px yellow);
  }

  50% {
    /*  白 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      var(--qq--activity-bg-color-14) 80%
    );
    box-shadow: 0px 3px 0px 0px var(--qq--activity-box-shadow-4);
  }

  58.3% {
    /*  黄 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      yellow 80%
    );
    filter: drop-shadow(0px 0px 10px yellow);
  }

  66.6% {
    /*  白 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      var(--qq--activity-bg-color-14) 80%
    );
    box-shadow: 0px 3px 0px 0px var(--qq--activity-box-shadow-4);
  }

  75% {
    /*  蓝 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      deepskyblue 80%
    );
    filter: drop-shadow(0px 0px 10px deepskyblue);
  }

  83.3% {
    /*  白 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      var(--qq--activity-bg-color-14) 80%
    );
    box-shadow: 0px 3px 0px 0px var(--qq--activity-box-shadow-4);
  }

  91.6% {
    /*  蓝 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      deepskyblue 80%
    );
    filter: drop-shadow(0px 0px 10px deepskyblue);
  }

  100% {
    /*  白 */
    background-image: radial-gradient(
      at 50% 40%,
      var(--qq--activity-bg-color-13) 2px,
      var(--qq--activity-bg-color-14) 80%
    );
    box-shadow: 0px 3px 0px 0px var(--qq--activity-box-shadow-4);
  }
}

@keyframes scaleText {
  0% {
    transform: scale(1, 1);
  }

  50% {
    transform: scale(0.6, 0.6);
  }

  100% {
    transform: scale(1, 1);
  }
}
</style> 