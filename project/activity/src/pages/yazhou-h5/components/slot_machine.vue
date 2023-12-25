<template>
  <div class="tabs_content" @touchmove="handleTouch" @mousewheel="handleTouch" @click="handleTouch">
    <div class="introduction text-666">
      <div class="active-object">
        <div>
          <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''
            }.png`" alt="" />
          <div>
            <span>活动对象：</span>
            <span>本场馆全体会员</span>
          </div>
        </div>
        <div>
          <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''
            }.png`" alt="" />
          <div>
            <span>活动时间：</span>
            <template v-if="get_user.activityList[activityIndex].period == 1">
              <span class="count_down_css">
                <span>距离活动开始还有</span>
                <ActiveCountDown :endTime="inStartTime" :noNeedCss="true"></ActiveCountDown>
              </span>
            </template>
            <template v-else-if="get_user.activityList[activityIndex].period == 2">
              <template v-if="get_user.activityList[activityIndex].type == 2 && inEndTime
                ">
                <span class="count_down_css">
                  <span>距离活动关闭还有</span>
                  <ActiveCountDown :endTime="inEndTime" :noNeedCss="true"></ActiveCountDown>
                </span>
              </template>
              <span v-else>活动长期有效</span>
            </template>
            <span v-else> 活动结束 </span>
          </div>
        </div>
        <div>
          <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''
            }.png`" alt="" />
          <div>
            <span style="width: 1.91rem">活动内容：</span>
            <span>本场馆内完成任务获得的普通奖券，可在合成系统中向上合成为白银、黄金、钻石奖券，用以参加对应档次的老虎机抽奖</span>
          </div>
        </div>
      </div>
    </div>
    <div class="slot_machine_content">
      <!-- 老虎机主体 -->
      <div class="slot_machine relative-position">
        <!-- 彩金道具 -->
        <div class="caijin">
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
        <img class="machine"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/machine_diamond.png`" :style="{
            'z-index':
              _.get(currentSlotData[currentSlotIndex], 'slotId') == 3 ? 2 : 1,
          }" alt="" />
        <img class="machine"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/machine_gold.png`" :style="{
            'z-index':
              _.get(currentSlotData[currentSlotIndex], 'slotId') == 2 ? 2 : 1,
          }" alt="" />
        <img class="machine"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/machine_silver.png`" :style="{
            'z-index':
              _.get(currentSlotData[currentSlotIndex], 'slotId') == 1 ? 2 : 1,
          }" alt="" />
        <!-- 今日抽奖剩余次数 -->
        <p class="draws_number">
          <span v-if="_.get(currentSlotData[currentSlotIndex], 'gameTimes') > -1">今日抽奖剩余：{{
            _.get(currentSlotData[currentSlotIndex], "gameTimes")
          }}次 | 0时重置</span>
        </p>
        <!-- 数字滚轮 -->
        <div class="scroller" ref="scroller">
          <NumberScroll :status="tiger_status" :result="tiger_result" :initArr="initNums" @stop="stop"
            :config="slot_config" v-if="showNumScroll" ref="number_scroll" />
        </div>
        <!-- 两边的小三角形 -->
        <p class="triangles" v-if="triangle_fade > 0">
          <img class="left"
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/triangle_fade/0${triangle_fade}.png`"
            alt="" />
          <img class="right"
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/triangle_fade/0${triangle_fade}.png`"
            alt="" />
        </p>
        <p class="triangles" v-else>
          <img class="left"
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/triangle_run/0${triangle_run}.png`"
            alt="" />
          <img class="right"
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/triangle_run/0${triangle_run}.png`"
            alt="" />
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
          <p class="resetBtn" @click="resetSlot">
            <!-- <template> -->
              <img class="top" v-if="_.get(
                    currentSlotData[currentSlotIndex],
                    'beforeGameResult.propName'
                  )
                  " :class="runResetSlotAnim ? 'resetBtnAnim' : ''"
                :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/reset_btn_top.png`" alt="" />
              <img class="top" v-else :class="runResetSlotAnim ? 'resetBtnAnim' : ''"
                :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/reset_btn_top_gray.png`"
                alt="" />
            <!-- </template> -->
            <!-- <template> -->
              <img class="btm" v-if="_.get(
                currentSlotData[currentSlotIndex],
                'beforeGameResult.propName'
              )
                " :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/reset_btn_btm.png`"
                alt="" />
              <img class="btm" v-else
                :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/reset_btn_btm_gray.png`"
                alt="" />
            <!-- </template> -->
            <span>{{
              _.get(currentSlotData[currentSlotIndex], `resetTicketNumber`)
            }}张{{
              _.get(currentSlotData[currentSlotIndex], `resetTicketName`)
            }}</span>
          </p>
          <!-- 开始滚动 -->
          <p v-if="!_.get(currentSlotData[currentSlotIndex], 'beforeGameResult') ||
              !is_init
              " class="startScreen" @click="start('start')">
            <!-- <template> -->
            <!-- 置灰按钮 -->
            <img v-if="!is_init ||
              _.get(currentSlotData[currentSlotIndex], 'tokenNum') <
              _.get(currentSlotData[currentSlotIndex], 'lotteryNum') ||
              Object.keys(beforeGameResult).length != 0 ||
              _.get(currentSlotData[currentSlotIndex], 'gameTimes') == 0
              " class="top"
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/start_btn_top_gray.png`"
              alt="" />
            <img v-else class="top" :class="runStartAnim ? 'startBtnAnim' : ''"
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/start_btn_top.png`" alt="" />
            <!-- </template> -->
            <!-- <template> -->
            <img class="btm" v-if="!is_init ||
              _.get(currentSlotData[currentSlotIndex], 'tokenNum') <
              _.get(currentSlotData[currentSlotIndex], 'lotteryNum') ||
              Object.keys(beforeGameResult).length != 0 ||
              _.get(currentSlotData[currentSlotIndex], 'gameTimes') == 0
              " :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/start_btn_btm_gray.png`"
              alt="" />
            <img class="btm" v-else
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/start_btn_btm.png`" alt="" />
            <!-- </template> -->
            <span>{{ _.get(currentSlotData[currentSlotIndex], "lotteryNum") }}张{{
              _.get(currentSlotData[currentSlotIndex], "ticketName")
            }}</span>
          </p>
          <!-- 确认领取 -->
          <p v-else class="confirm" @click="start('confirm')">
            <img class="top" :class="runStartAnim ? 'startBtnAnim' : ''"
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/confirm_btn_top.png`" alt="" />
            <img class="btm"
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/start_btn_btm.png`" alt="" />
          </p>
        </div>
        <!-- 摇杆 -->
        <div class="rocker">
          <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/rocker_${(_.get(currentSlotData[currentSlotIndex], 'slotId') || 1) - 1
            }/0${rocker_anim_index}.png`" alt="" />
        </div>
        <!-- 老虎机周围的装饰 -->
        <img class="goldmoney" :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/goldmoney.png`"
          alt="" />
        <img class="footbaler" :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/footbaler.png`"
          alt="" />
        <!-- 彩灯 -->
        <span v-for="(item, index) in new Array(26)" :key="index" class="normal_light" :class="[
          `normal_light_${index + 1}`,
          {
            light_run_pink: light_run_pink == index + 1,
            light_run_blue: light_run_blue == index + 1,
            light_run_yellow: light_run_yellow == index + 1,
          },
          { three_colors: spin_success },
        ]"></span>
      </div>
      <!-- 切换老虎机的按钮 -->
      <div class="switch_slots" v-if="currentSlotData.length">
        <p @click="switch_slots(index)" v-for="(item, index) in currentSlotData" :key="index">
          <img v-if="currentSlotIndex == index && index < 3"
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/rocker_${item.slotId}.png`" />
          <img v-else :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/grey_rocker.png`" />
          <span :class="currentSlotIndex == index ? 'active' : ''">
            <span>{{ item.slotName }}</span>
            <br />
            (奖券：{{ item.tokenNum }})
          </span>
        </p>
      </div>
      <!-- 合成奖券和游戏记录按钮 -->
      <div class="btns">
        <p class="synthetic_lottory" @click="activityTips.status ? '' : (is_show_compose = true)">
          合成奖券
        </p>
        <p class="game_history" @click="get_activity_slot_get_game_record(1, 1)">
          游戏记录
        </p>
      </div>
    </div>
    <div class="activity-rules text-gray">
      <div class="title">活动规则</div>
      <p>
        会员完成任务获得的普通奖券，可在合成系统中向上合成为白银、黄金、钻石奖券，用以参加对应档次的老虎机抽奖；
      </p>
      <p>每次抽奖获取随机奖金，并搭配随机道具享受奖金加乘；</p>
      <p>
        老虎机抽奖获得的奖金不可重置，道具可以消耗奖券重置，重置次数无上限；
      </p>
      <p>
        合成系统：
        <br /><span>a)
          4张普通奖券兑换1张白银奖券、4张白银奖券兑换1张黄金奖券、4张黄金奖券兑换1张钻石奖券，若合成失败有机会返还兑换前奖券；</span>
        <br /><span>b)
          合成后的奖券仅可用于老虎机抽奖或向上合成更高等级奖券，不可分解成低等级奖券。</span>
      </p>
      <p>
        老虎机抽奖：
        <br /><span>a)
          老虎机奖励=随机奖金*随机道具(幸运奖券为提升合成几率用道具，若抽取到此项道具，当次奖金默认为一倍)；</span>
        <br /><span>b) 随机道具可消耗老虎机对应档次的奖券进行重置，重置次数无上限；</span>
        <br /><span>c) 点击【确认领取】后，老虎机奖励将派发至本场馆钱包；</span>
        <br /><span>d)
          未点击【确认领取】，内容自使用当日起计算保留5天，保留期间仅可进行道具重置，不可使用其他档次的老虎机，若保留时间结束仍未点击【确认领取】，系统将默认当下结果派发奖金至本场馆钱包。</span>
      </p>
      <p>奖金实时派发至本场馆钱包，仅需在本场馆完成1倍流水即可取款；</p>
      <p>
        每位有效会员、每个手机号、每个电子邮箱、每张银行卡、每个IP地址、每台设备使用者，仅可享受1次优惠，如会员使用一切不正当投注、套利等违规行为，我们将保留无限期审核扣回奖金及所产生利润的权利；
      </p>
      <p>为避免文字理解差异，本场馆保留本活动最终解释权。</p>
    </div>
    <!-- 游戏记录弹窗 -->
    <q-dialog v-model="gameHistory">
      <div class="history-dialog">
        <div class="history-record">
          <!-- <div class="content_title choice-title text-center text-333">
            游戏记录
          </div> -->
          <div class="tab_bar">
            <p v-for="(item, index) in historiesBar" :key="index"
              @click.stop="get_activity_slot_get_game_record(1, index + 1, 5)"
              :class="index + 1 == gameHistoryLists.params.type ? 'active' : ''">
              {{ item }}
            </p>
          </div>
          <!-- 彩金记录 -->
          <div class="table table_history" v-if="gameHistoryLists.params.type == 1">
            <div class="text-333 text-center">
              <span>滚轴奖金</span>
              <span>道具倍率</span>
              <span>总计彩金</span>
              <span>领取时间</span>
            </div>
            <!-- <load-data :state="historyDataState"> -->
            <div class="text-666 text-center" :class="{ 'last-row': index == gameHistoryLists.list.length - 1 }"
              v-for="(item, index) in gameHistoryLists.list" :key="index">
              <span>{{ Number(item.award) / 100 || "-" }}</span>
              <span>{{
                item.prop_times == undefined || item.prop_times == "--"
                ? "--"
                : `奖金${item.prop_times}倍卡`
              }}</span>
              <span>{{ Number(item.total_award) / 100 || "-" }}</span>
              <span>{{
                new Date(+item.create_time).Format("yyyy-MM-dd hh:mm") || "-"
              }}</span>
            </div>
            <div v-if="!_.get(gameHistoryLists.list, 'length')" class="no-data">
              暂无数据
            </div>
            <!-- </load-data> -->
          </div>
          <!-- 奖券合成 -->
          <div class="table table_history" v-else-if="gameHistoryLists.params.type == 2">
            <div class="text-333 text-center">
              <span>消耗奖券数</span>
              <span>合成奖券数</span>
              <span>返还奖券数</span>
              <span>合成时间</span>
            </div>
            <!-- <load-data :state="historyDataState"> -->
            <div class="text-666 text-center" :class="{ 'last-row': index == gameHistoryLists.list.length - 1 }"
              v-for="(item, index) in gameHistoryLists.list" :key="index">
              <span v-if="item.source_token != undefined">{{ item.source_token }}张<br />{{
                item.source_token_type
              }}</span><span v-else><br /></span>
              <span v-if="item.target_token != undefined">{{ item.target_token }}张<br />{{
                item.target_token_type
              }}</span><span v-else><br /></span>
              <span v-if="item.return_token != undefined">{{ item.return_token }}张<br />{{
                item.return_token_type
              }}</span><span v-else><br /></span>
              <span v-if="item.source_token != undefined">{{
                new Date(+item.create_time).Format("yyyy-MM-dd hh:mm")
              }}</span><span v-else><br /></span>
            </div>
            <div v-if="!_.get(gameHistoryLists.list, 'length')" class="no-data">
              暂无数据
            </div>
            <!-- </load-data> -->
          </div>
          <!-- 重置道具 -->
          <div class="table table_history" v-else>
            <div class="text-333 text-center">
              <span>道具名称</span>
              <span>奖券消耗</span>
              <span>奖券类型</span>
              <span>重置时间</span>
            </div>
            <!-- <load-data :state="historyDataState"> -->
            <div class="text-666 text-center" :class="{ 'last-row': index == gameHistoryLists.list.length - 1 }"
              v-for="(item, index) in gameHistoryLists.list" :key="index">
              <span>{{
                item.prop_type != undefined ? item.prop_type : ""
              }}</span>
              <span>{{
                item.use_token != undefined ? item.use_token : ""
              }}</span>
              <span>{{
                item.use_token_type != undefined ? item.use_token_type : ""
              }}</span>
              <span>{{
                item.prop_type != undefined
                ? new Date(+item.create_time).Format("yyyy-MM-dd hh:mm")
                : ""
              }}</span>
            </div>
            <div v-if="!_.get(gameHistoryLists.list, 'length')" class="no-data">
              暂无数据
            </div>
            <!-- </load-data> -->
          </div>
          <div class="pagination_wrap" v-if="gameHistoryLists.list.length > 0">
            <div class="pagination_with_input">
              <DataPager :key="gameHistoryLists.params.type" class="record-data-pager"
                :total="gameHistoryLists.params.total" :pageSize="5" @change="pagination_next" />
            </div>
          </div>
          <img class="close" @click="gameHistory = false"
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/lucky/close.png`" />
        </div>
      </div>
    </q-dialog>
    <!-- 合成页面弹窗 -->
    <compose v-if="is_show_compose" @close_compose="is_show_compose = false" @update_slots_config="update_slots_config"
      :lotteryNum="lottery" @play_show_card="play_show_card" />
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
    <audio :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/media/slot_bg_loop.mp3`"
      ref="slot_bg_loop" autoplay loop />
    <!-- 开始滚动按钮按下 -->
    <audio :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/media/start_btn.mp3`"
      ref="audioStart"></audio>
    <!-- 摇杆 -->
    <audio :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/media/after_start_btn.mp3`"
      ref="afterAudioStart"></audio>
    <audio :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/media/showCard.mp3`"
      ref="showCard"></audio>
  </div>
</template>

<script>
import slot_machine_mixin from "project/activity/src/mixins/slot_machine/slot_machine.js";
import NumberScroll from "project/activity/src/components/number_scroll/number_scroll-h5.vue";
import compose from "project/activity/src/components/compose/compose-h5.vue";
import DataPager from "project/activity/src/components/data_pager/data_pager-h5.vue";
import ActiveCountDown from "project/activity/src/components/active_count_down/active_count_down-h5.vue";
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
<style lang="scss" scoped>
@import "../../../css/activity.scss";

.tabs_content {
  .scroll {
    ul {
      width: 320px;
      height: 100px;
      overflow: hidden;
      border: 1px solid #999;
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
          color: #333;
          border-bottom: 1px solid #333;
          text-align: center;
        }
      }
    }
  }

  .slot_machine_content {
    background: var(--qq--com-img-bg-122) no-repeat top center;
    background-size: 120%;
    margin-top: 0.8rem;

    // 老虎机
    .slot_machine {
      width: 2.79rem;
      height: 3.2rem;
      margin: 0 auto;
      z-index: 1;

      .machine {
        position: absolute;
        left: -0.42rem;
        height: 3.08rem;

        transition: all 0.2s ease-in-out;
      }

      .draws_number {
        position: absolute;
        left: 0.2rem;
        width: 2.4rem;
        text-align: center;
        top: 0.63rem;
        z-index: 3;
        font-family: PingFangSC-Medium;

        color: #fee4b5;

        span {
          &::before {
            display: inline-block;
            content: "";
            width: 0.1rem;
            height: 0.02rem;
            background: #6b2200;
            box-shadow: inset 0 0.01rem 0.02rem 0 rgba(0, 0, 0, 0.5);
            position: absolute;
            top: 0.09rem;
            left: 0.25rem;
          }

          &::after {
            display: inline-block;
            content: "";
            width: 0.1rem;
            height: 0.02rem;
            background: #6b2200;
            box-shadow: inset 0 0.01rem 0.02rem 0 rgba(0, 0, 0, 0.5);
            position: absolute;
            top: 0.09rem;
            right: 0.25rem;
          }
        }
      }

      // 数字滚轮
      .scroller {
        position: absolute;
        z-index: 3;
        width: 71%;
        left: 0.4rem;
        top: 0.86rem;
      }

      // 两个三角形的定位
      .triangles {
        position: absolute;
        z-index: 3;
        width: 2.17rem;
        height: 0.22rem;
        bottom: 1.74rem;
        left: 0.31rem;

        img {
          width: 0.21rem;
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

      // 当前奖金
      .currentBonus {
        font-size: 0.1rem;
        color: #fffcf4;
        letter-spacing: 0.01rem;
        text-shadow: 0 0.02rem 0.02rem rgba(0, 0, 0, 0.3);
        position: absolute;
        z-index: 3;
        bottom: 0.42rem;
        left: 0.45rem;

        &>span {
          font-size: 0.2rem;
          text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
          font-weight: 700;
        }
      }

      // 老虎机上的操作按钮
      .actionBtns {
        position: absolute;
        z-index: 3;
        display: flex;
        justify-content: center;
        width: 2rem;
        height: 0.8rem;
        left: 0.38rem;
        bottom: 0.8rem;

        p {
          position: relative;

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
              bottom: -0.06rem;
              display: block;
              width: 100%;
              text-align: center;
              color: #3a3a3a;
            }

            img {
              width: 0.6rem;
              margin-left: 50%;
              left: -0.29rem;
            }

            .top {
              bottom: 0.13rem;
            }

            .btm {
              bottom: 0.13rem;
            }
          }

          &.startScreen,
          &.confirm {
            flex: 1;

            img {
              width: 1.02rem;
            }

            .top {
              bottom: 0.11rem;
            }

            .btm {
              bottom: 0.14rem;
            }

            span {
              position: absolute;
              bottom: -0.06rem;
              display: block;
              width: 100%;
              text-align: center;
              color: #3a3a3a;
            }
          }
        }
      }

      .rocker {
        position: absolute;
        right: -0.26rem;
        top: 0.8rem;
        width: 0.41rem;
        z-index: 3;

        img {
          width: 100%;
        }
      }

      // 顶部彩金倍数显示区
      .caijin {
        width: 1.63rem;
        text-align: center;
        position: absolute;
        z-index: 3;
        top: 0.13rem;
        left: 0.58rem;
        border-radius: 60px 60px 0 0;
        overflow: hidden;

        p {
          width: 1.4rem;
          margin: 0 auto;
          text-align: center;
          font-family: Helvetica;
          font-size: 0.16rem;
          color: #ffffff;
          letter-spacing: 0;
          text-shadow: 0 2px 4px #e50000, 0 -2px 3px #f0ff04;
          font-weight: 400;
        }

        &>span.dot {
          display: block;
          position: absolute;

          &:nth-child(2) {
            width: 0.02rem;
            height: 0.02rem;
            border-radius: 50%;
            background: lightyellow;
            box-shadow: 0 0 0.02rem 0.01rem lightyellow,
              0.6rem -0.15rem 0.02rem 0.01rem lightyellow,
              0.4rem -0.06rem 0.02rem 0.01rem lightyellow,
              0.1rem -0.15rem 0.02rem 0.02rem lightyellow,
              1rem -0.2rem 0.02rem 0.01rem lightyellow,
              1.3rem -0.2rem 0.02rem 0.02rem lightyellow,
              1.7rem -0.25rem 0.03rem 0.02rem lightyellow,
              2rem -0.1rem 0.03rem 0.02rem lightyellow,
              0.7rem -0.3rem 0.02rem 0.01rem lightyellow,
              0.8rem -0.45rem 0.02rem 0.01rem lightyellow,
              2.3rem 0 0.02rem 0.01rem lightyellow,
              2.4rem -0.1rem 0.03rem 0.02rem lightyellow;
            left: 0.2rem;
            bottom: 0.03rem;
          }

          &:nth-child(3) {
            width: 0.02rem;
            height: 0.02rem;
            border-radius: 50%;
            background: lightyellow;
            box-shadow: 0 0 0.02rem 0.01rem lightyellow,
              1.6rem -15rem 0.02rem 0.01rem lightyellow,
              1.4rem -0.06rem 0.03rem 0.02rem lightyellow,
              1.1rem -0.15rem 0.02rem 0.02rem lightyellow,
              1rem -0.2rem 0.03rem 0.02rem lightyellow,
              3.1rem -0.2rem 0.02rem 0.01rem lightyellow,
              2.7rem -0.25rem 0.03rem 0.02rem lightyellow,
              3rem -0.1rem 0.02rem 0.01rem lightyellow;
            left: 0.4rem;
            bottom: -0.3rem;
          }
        }
      }

      .goldmoney {
        position: absolute;
        z-index: 4;
        right: -0.4rem;
        bottom: 0.12rem;
        width: 1.24rem;
      }

      .footbaler {
        position: absolute;
        bottom: 0.3rem;
        left: -0.43rem;
        z-index: 1;
        width: 0.94rem;
      }

      // 彩灯
      .normal_light {
        display: inline-block;
        width: 0.072rem;
        height: 0.072rem;
        border-radius: 50%;
        background-image: radial-gradient(at 50% 40%, #fff 2px, #a9a9a9 80%);
        box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.3);
        position: absolute;
        z-index: 3;
      }

      .normal_light_1 {
        left: 0.11rem;
        bottom: 0.33rem;
      }

      .normal_light_2 {
        left: 0.057rem;
        bottom: 0.58rem;
      }

      .normal_light_3 {
        left: 0.014rem;
        bottom: 0.85rem;
      }

      .normal_light_4 {
        left: 0.072rem;
        bottom: 1.1rem;
      }

      .normal_light_5 {
        left: 0.11rem;
        bottom: 1.35rem;
      }

      .normal_light_6 {
        left: 0.13rem;
        bottom: 1.6rem;
      }

      .normal_light_7 {
        left: 0.15rem;
        bottom: 1.85rem;
      }

      .normal_light_8 {
        left: 0.165rem;
        bottom: 2.1rem;
      }

      .normal_light_9 {
        left: 0.18rem;
        bottom: 2.35rem;
      }

      .normal_light_10 {
        left: 0.225rem;
        bottom: 2.6rem;
      }

      .normal_light_11 {
        left: 0.54rem;
        bottom: 2.62rem;
      }

      .normal_light_12 {
        left: 0.865rem;
        bottom: 2.62rem;
      }

      .normal_light_13 {
        left: 1.2rem;
        bottom: 2.62rem;
      }

      .normal_light_14 {
        left: 1.52rem;
        bottom: 2.62rem;
      }

      .normal_light_15 {
        left: 1.85rem;
        bottom: 2.62rem;
      }

      .normal_light_16 {
        left: 2.18rem;
        bottom: 2.62rem;
      }

      .normal_light_17 {
        left: 2.49rem;
        bottom: 2.59rem;
      }

      .normal_light_18 {
        right: 0.19rem;
        top: 0.77rem;
      }

      .normal_light_19 {
        right: 0.17rem;
        top: 1.02rem;
      }

      .normal_light_20 {
        right: 0.15rem;
        top: 1.28rem;
      }

      .normal_light_21 {
        right: 0.13rem;
        top: 1.52rem;
      }

      .normal_light_22 {
        right: 0.12rem;
        top: 1.78rem;
      }

      .normal_light_23 {
        right: 0.1rem;
        top: 2.03rem;
      }

      .normal_light_24 {
        right: 0.03rem;
        top: 2.28rem;
      }

      .normal_light_25 {
        right: 0.07rem;
        top: 2.55rem;
      }

      .normal_light_26 {
        right: 0.12rem;
        top: 2.79rem;
      }

      // 彩灯跑动颜色---粉色
      .light_run_pink {
        background-image: radial-gradient(at 50% 40%, #fff 2px, #ff4040 80%);
        filter: drop-shadow(0px 0px 10px #ff4040);
      }

      .light_run_blue {
        background-image: radial-gradient(at 50% 40%,
            #fff 2px,
            deepskyblue 80%);
        filter: drop-shadow(0px 0px 10px deepskyblue);
      }

      .light_run_yellow {
        background-image: radial-gradient(at 50% 40%, #fff 2px, yellow 80%);
        filter: drop-shadow(0px 0px 10px yellow);
      }
    }

    // 切换老虎机的按钮
    .switch_slots {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.3rem;
      height: 0.5rem;
      background-image: linear-gradient(-88deg,
          #ffffff 0%,
          #f7f8f9 50%,
          #ffffff 100%);

      p {
        flex: 1;
        height: 0.5rem;
        display: flex;
        justify-content: center;
        cursor: pointer;

        img {
          width: 0.25rem;
          height: 0.25rem;
          margin-right: 0.1rem;
          margin-top: 0.12rem;
        }

        &>span {
          display: inline-block;
          padding-top: 0.07rem;
          text-align: center;
          color: #666;
          font-size: 0.12rem;

          span {
            font-size: 0.14rem;
          }
        }

        .active {
          span {
            color: #ff7000;
          }
        }

        &:not(:last-child) {
          position: relative;

          &::before {
            display: block;
            content: "";
            width: 0.01rem;
            height: 0.3rem;
            background: #d8d8d8;
            position: absolute;
            top: 0.12rem;
            right: 0;
          }
        }
      }
    }

    // 奖券合成按钮
    .btns {
      margin-top: 30px;
      display: flex;
      justify-content: center;

      p {
        width: 1.62rem;
        height: 0.34rem;
        line-height: 0.34rem;
        text-align: center;
        font-size: 0.12rem;
        cursor: pointer;
      }

      .synthetic_lottory {
        background-image: var(--qq--com-img-bg-117);
        background-size: cover;
        color: #fff;
        margin-right: 0.2rem;
      }

      .game_history {
        background-image: var(--qq--com-img-bg-118);
        background-size: cover;
        color: #333;
      }
    }
  }

  .activity-rules {
    .title {
      margin-bottom: 0.2rem;
    }

    p {
      background: var(--qq--img-bg-99) no-repeat left 0.07rem;
      padding-left: 0.17rem;
      background-size: 0.12rem;
      line-height: 27px;
      margin: 0 0.14rem 0.1rem 0.11rem;
      color: #666;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.theme01_y0,
.theme02_y0 {
  .activity-rules {
    p {
      background: var(--qq--com-img-bg-121) no-repeat left 0.07rem;
    }
  }

  .tabs_content {
    .slot_machine_content {
      .btns {
        .synthetic_lottory {
          background-image: var(--qq--com-img-bg-120);
        }
      }
    }
  }

  .history-dialog {
    .history-record {
      .tab_bar {
        p {
          &.active {
            color: #4987fb;
          }
        }
      }
    }
  }
}

// 游戏记录弹窗样式
.history-dialog {
  .history-record {
    top: 0;

    .tab_bar {
      display: flex;
      justify-content: left;
      width: 3.2rem;
      margin: 0.2rem auto 0.14rem auto;

      p {
        font-size: 0.14rem;
        color: #565656;
        flex: 1;
        text-align: center;

        position: relative;
        cursor: pointer;

        &.active {
          color: #ff7000;
        }

        &:nth-child(2)::before {
          display: block;
          content: "";
          width: 0.01rem;
          height: 0.14rem;
          background-color: #d9d9d9;
          position: absolute;
          top: 0.02rem;
        }

        &:nth-child(2)::after {
          display: block;
          content: "";
          width: 0.01rem;
          height: 0.14rem;
          background-color: #d9d9d9;
          position: absolute;
          right: 0;
          top: 0.02rem;
        }
      }
    }

    .table_history {
      .text-333 {
        border: 1px solid #e4e4e4;
        border-radius: 0.08rem 0.08rem 0 0;
        border-bottom: 0 none;
        display: flex;
        justify-content: space-between;
        height: 0.46rem;
        line-height: 0.46rem;
        background: #e7eaee;
        font-size: 0.12rem;
        color: #565656;
        text-align: center;
        font-weight: 500;

        span {
          flex: 1;
        }
      }
    }

    .table {
      width: 3.2rem;
      border: 0.01rem solid #d8d8d8;
      border-radius: 0.08rem;
      margin: 0 auto;

      .text-white {
        height: 0.46rem;
        line-height: 0.46rem;
        background: #e7eaee;
        font-family: PingFangSC-Medium;
        font-size: 16px;
      }

      .text-666 {
        height: 0.6rem;

        font-size: 0.12rem;
        display: flex;
        justify-content: space-between;

        &:not(:last-child) {
          border-bottom: 0.01rem solid #e4e4e4;
        }

        span {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;

          &:not(:last-child) {
            border-right: 0.01rem solid #e4e4e4;
          }
        }

        &:nth-child(even) {
          background: #fcfcfc;
        }

        &:nth-child(odd) {
          background: #fff;
        }
      }

      .last-row {
        border-radius: 0 0 0.08rem 0.08rem;

        span {
          &:first-child {
            border-radius: 0 0 0 0.08rem;
          }

          &:last-child {
            border-radius: 0 0 0.08rem 0;
          }
        }
      }

      .no-data {
        text-align: center;
        height: 0.5rem;
        line-height: 0.5rem;
      }
    }
  }
}

// 翻页组件样式
.pagination_wrap {
  display: flex;
  justify-content: center;
  margin: 0.2rem auto;
  font-size: 0.12rem;

  .pagination_with_input {
    display: flex;
    height: 0.3rem;
    line-height: 0.3rem;

    .goto_page {
      input {
        margin-bottom: 0;
        border: 0.01rem solid #d2d2d2;
        width: 0.32rem;
        height: 0.24rem;
        text-align: center;
        outline: none;
        border-radius: 0.02rem;
      }
    }
  }
}

.tabs_content {
  :deep(.text-primary) {
    color: #666 !important;
  }

  :deep(.q-icon){
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

  :deep(.fullscreen) {
    .q-dialog__inner {
      padding: 0.1rem;
    }
  }
}

// ui 样式的弹窗
.activity_alert {
  width: 3rem;
  min-height: 1.4rem;
  background-image: linear-gradient(268deg,
      #b05500 0%,
      #f8c90d 31%,
      #fff8de 50%,
      #f8c600 80%,
      #aa4b00 100%);
  border-radius: 0.15rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  font-size: 0.16rem;
  padding: 0.02rem;

  .close {
    width: 0.16rem;
    height: 0.16rem;
    background: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 0.16rem;
    font-size: 0.16rem;
    font-weight: 600;
    transform: rotate(45deg);
    color: #000;
    position: absolute;
    right: 0.07rem;
    top: 0.07rem;
    cursor: pointer;
  }

  .title {
    text-align: center;
    color: #de6f04;
    height: 0.32rem;
    line-height: 0.32rem;
  }

  .content {
    width: 100%;
    min-height: 0.9rem;
    background: rgba(255, 255, 255, 0.81);
    box-shadow: inset 0 0.01rem 0.08rem 0 rgba(189, 72, 72, 0.5),
      0 0.02rem 0.04rem 0 rgba(0, 0, 0, 0.27),
      0 0.02rem 0.07rem 0 rgba(0, 0, 0, 0.26),
      0 0.02rem 0.14rem 0 rgba(0, 0, 0, 0.05);
    border-radius: 0.15rem;
    margin: 0 auto;
    overflow: hidden;

    .msg {
      min-height: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.18rem;
      color: #171616;
      font-weight: 700;
      padding: 0.1rem;
    }

    .btns {
      display: flex;
      justify-content: center;
      text-align: center;
      background: #fff;
      height: 0.3rem;
      line-height: 0.3rem;

      span {
        flex: 1;
        cursor: pointer;

        &:nth-child(1) {
          color: #ff8b00;
        }
      }
    }
  }
}

// 动画相关----------------------------------------------
// 重置按钮动画
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

// 彩金背景动效
.dot_run {
  animation-name: dotRun;
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
}

.dot_run_1 {
  animation-name: dotRun1;
  animation-duration: 800ms;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
}

// 彩灯  三种颜色交替闪动
.three_colors {
  animation-name: lightsLight;
  animation-duration: 2200ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

// 数字滚动
.li1 {
  animation-name: scroll1;
  animation-duration: 3000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

// 彩金文字缩放动效
.caijin_transfer {
  animation-name: scaleText;
  animation-duration: 800ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes scroll1 {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(700px);
  }
}

/* 重置按钮动画 */
@keyframes buttons1 {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(0.04rem);
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
    transform: translateY(0.05rem);
  }

  100% {
    transform: translateY(0);
  }
}

/* 开始滚动 & 领取彩金 按钮动画 */
@keyframes dotRun {
  0% {
    transform: translateY(60px);
  }

  100% {
    transform: translateY(-3px);
  }
}

@keyframes dotRun1 {
  0% {
    transform: translateY(30px);
  }

  100% {
    transform: translateY(-60px);
  }
}

@keyframes lightsLight {
  0% {
    // 白
    background-image: radial-gradient(at 50% 40%, #fff 2px, #a9a9a9 80%);
    box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.3);
  }

  8.3% {
    // 红
    background-image: radial-gradient(at 50% 40%, #fff 2px, #ff4040 80%);
    filter: drop-shadow(0px 0px 10px #ff4040);
  }

  16.6% {
    // 白
    background-image: radial-gradient(at 50% 40%, #fff 2px, #a9a9a9 80%);
    box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.3);
  }

  25% {
    // 红
    background-image: radial-gradient(at 50% 40%, #fff 2px, #ff4040 80%);
    filter: drop-shadow(0px 0px 10px #ff4040);
  }

  33.2% {
    // 白
    background-image: radial-gradient(at 50% 40%, #fff 2px, #a9a9a9 80%);
    box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.3);
  }

  41.4% {
    // 黄
    background-image: radial-gradient(at 50% 40%, #fff 2px, yellow 80%);
    filter: drop-shadow(0px 0px 10px yellow);
  }

  50% {
    // 白
    background-image: radial-gradient(at 50% 40%, #fff 2px, #a9a9a9 80%);
    box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.3);
  }

  58.3% {
    // 黄
    background-image: radial-gradient(at 50% 40%, #fff 2px, yellow 80%);
    filter: drop-shadow(0px 0px 10px yellow);
  }

  66.6% {
    // 白
    background-image: radial-gradient(at 50% 40%, #fff 2px, #a9a9a9 80%);
    box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.3);
  }

  75% {
    // 蓝
    background-image: radial-gradient(at 50% 40%, #fff 2px, deepskyblue 80%);
    filter: drop-shadow(0px 0px 10px deepskyblue);
  }

  83.3% {
    // 白
    background-image: radial-gradient(at 50% 40%, #fff 2px, #a9a9a9 80%);
    box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.3);
  }

  91.6% {
    // 蓝
    background-image: radial-gradient(at 50% 40%, #fff 2px, deepskyblue 80%);
    filter: drop-shadow(0px 0px 10px deepskyblue);
  }

  100% {
    // 白
    background-image: radial-gradient(at 50% 40%, #fff 2px, #a9a9a9 80%);
    box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.3);
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
 