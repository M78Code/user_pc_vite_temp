 

<template>
  <div
    class="slot_machine_scroll"
    :class="is_has_scroll && 'has-scroll'"
    @touchmove="handleTouch"
  >
    <!-- 关闭按钮 -->
    <img
      @click="$emit('close_compose')"
      :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/close_top.png`"
      alt=""
      class="close"
      width="38"
    />
    <div class="compose-content">
      <!-- 调试位置用 -->
      <!-- <div class="test">
        <div class="dayuan">
          <div class="xiaoyuan"></div>
        </div>
      </div> -->
      <div class="compose-bg">
        <div style="height: 4.6rem"></div>
        <div class="two_lottories_num">
          <!-- 合成材料名称和数量 -->
          <p>
            <img
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/normal_voucher.png`"
              alt=""
            />
            {{ currentSynthConfig.baseTicketName }}:
            {{ currentSynthConfig.ownBaseTicket }}
          </p>
          <!-- 幸运奖券 -->
          <p>
            <img
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/lucky_voucher.png`"
              alt=""
            />
            幸运奖券: {{ luckyTicket }}
          </p>
        </div>
        <!-- 中间奖券部 -->
        <div class="ring yb-flex-center" :class="ring_class">
          <!-- 灯 -->
          <div class="ring-lamp"></div>
          <div class="ring-content">
            <!-- 等待合成 -->
            <template v-if="step != 'synthSucc'">
              <div class="sp-card donghua">
                <img :src="lottery_obj[cur_select_card].img" alt="" />
              </div>
              <div class="synth-name">
                合成{{ lottery_obj[cur_select_card].name }}
              </div>
            </template>
            <!-- 合成成功 -->
            <template v-else-if="step == 'synthSucc'">
              <!-- 合白银 什么奖券都没有 -->
              <template
                v-if="
                  synthSucc.returnTicketNum == 0 &&
                  synthSucc.synthToken == 0 &&
                  synthSucc.returnTicketId == 1
                "
              >
                <div class="sp-card donghua2 two1">
                  <img :src="lottery_obj[cur_select_card].img" alt="" />
                </div>
                <div class="synth-number two1">+{{ synthSucc.synthToken }}</div>
                <div class="bitmap two"></div>
                <div class="synth-number two2">
                  +{{ synthSucc.returnTicketNum }}
                </div>
              </template>
              <!-- 合其他 什么奖券都没有 -->
              <div
                class="two-card"
                v-else-if="
                  synthSucc.returnTicketNum == 0 && synthSucc.synthToken == 0
                "
              >
                <div class="sp-card donghua2 two1">
                  <img :src="lottery_obj[cur_select_card - 1].img" alt="" />
                </div>
                <div class="synth-number two1">
                  +{{ synthSucc.returnTicketNum }}
                </div>
                <div class="sp-card donghua2 two2">
                  <img :src="lottery_obj[cur_select_card].img" alt="" />
                </div>
                <div class="synth-number two2">+{{ synthSucc.synthToken }}</div>
              </div>
              <!-- 单张普通奖券 -->
              <template
                v-else-if="
                  synthSucc.returnTicketId == 1 && synthSucc.synthToken == 0
                "
              >
                <div class="bitmap"></div>
                <div class="synth-number one-bitmap">
                  +{{ synthSucc.returnTicketNum }}
                </div>
              </template>
              <!-- 合成单张高级奖券 -->
              <template v-else-if="synthSucc.returnTicketNum == 0">
                <div class="sp-card donghua2">
                  <img :src="lottery_obj[cur_select_card].img" alt="" />
                </div>
                <div class="synth-number">+{{ synthSucc.synthToken }}</div>
              </template>
              <!-- 返回单张高级奖券 -->
              <template v-else-if="synthSucc.synthToken == 0">
                <div class="sp-card donghua2">
                  <img :src="lottery_obj[cur_select_card - 1].img" alt="" />
                </div>
                <div class="synth-number">+{{ synthSucc.returnTicketNum }}</div>
              </template>
              <!-- 高级奖券加普通奖券 -->
              <div class="two-card" v-else-if="synthSucc.returnTicketId == 1">
                <div class="sp-card donghua2 two1">
                  <img :src="lottery_obj[cur_select_card].img" alt="" />
                </div>
                <div class="synth-number two1">+{{ synthSucc.synthToken }}</div>
                <div class="bitmap two"></div>
                <div class="synth-number two2">
                  +{{ synthSucc.returnTicketNum }}
                </div>
              </div>
              <!-- 两张高级奖券 -->
              <div class="two-card" v-else>
                <div class="sp-card donghua2 two1">
                  <img :src="lottery_obj[cur_select_card - 1].img" alt="" />
                </div>
                <div class="synth-number two1">
                  +{{ synthSucc.returnTicketNum }}
                </div>
                <div class="sp-card donghua2 two2">
                  <img :src="lottery_obj[cur_select_card].img" alt="" />
                </div>
                <div class="synth-number two2">+{{ synthSucc.synthToken }}</div>
              </div>
            </template>
          </div>
        </div>
        <!-- 奖券列表 -->
        <lottery
          @select_card="select_card"
          :cur_select_card="cur_select_card"
          :is_show_card="is_show_card"
          :lotteryNum="lotteryNum"
          :lottery_obj="lottery_obj"
        />

        <!-- 滑动条部分 -->
        <div class="synthSlider" v-if="step == 'normal'">
          <div class="item">
            <div class="slider-number">
              {{
                currentSynthConfig.ownBaseTicket <
                currentSynthConfig.baseTicketNum
                  ? "0"
                  : "1"
              }}
            </div>
            <div class="add-btn dec" @click="set_volume(1)">-</div>
            <slider
              v-model:value="volume"
              @change_is_mousedown="is_mousedown = $event"
              :min="currentSynthConfig.ownBaseTicket == 0 ? 0 : 1"
              :max="
                currentSynthConfig.ownBaseTicket == 0 ? 0 : currentSynthMaxNum
              "
            />
            <div class="add-btn add" @click="set_volume(2)">+</div>
            <div class="slider-number">
              {{
                currentSynthConfig.ownBaseTicket == 0 ? 0 : currentSynthMaxNum
              }}
            </div>
          </div>
          <div class="action">
            <div class="consume">
              <p>
                {{ currentSynthConfig.baseTicketName }}消耗:
                {{ volume * (currentSynthConfig.baseTicketNum || 0) }}张
              </p>
              <p>成功率: {{ currentSynthConfig.syntheticRate }}%</p>
            </div>
            <div class="synthButtons">
              <span @click="get_synth_ticket(volume)"
                >开始合成{{ volume }}张</span
              >
              <span
                @click="
                  step =
                    currentSynthConfig.syntheticRate == 100
                      ? 'normal'
                      : 'toUpgrade'
                "
                :class="{ get_gray: currentSynthConfig.syntheticRate == 100 }"
                >合成提升</span
              >
            </div>
            <div class="tips">
              <p>
                <img
                  :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/msg.svg`"
                  alt=""
                />
                每消耗{{ currentSynthConfig.baseTicketNum }}张{{
                  currentSynthConfig.baseTicketName
                }}可以合成1张{{ currentSynthConfig.ticketName }}
              </p>
              <p>
                <img
                  :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/msg.svg`"
                  alt=""
                />
                每消耗{{
                  currentSynthConfig.syntheticImproveNumber
                }}张幸运奖券，即可提升{{
                  currentSynthConfig.syntheticImproveRate
                }}%的合成成功率
              </p>
            </div>
          </div>
        </div>
        <!-- 提升合成率 -->
        <div class="confirm" v-else-if="step == 'toUpgrade'">
          <p class="confirmTips">
            <span>确定提升？</span>
            您将消耗{{
              currentSynthConfig.syntheticImproveNumber
            }}张幸运奖券来换取{{
              currentSynthConfig.syntheticImproveRate
            }}%的合成成功率
          </p>
          <p class="confirmBtns">
            <span @click="get_improve_rate">确定</span>
            <span @click="step = 'normal'">取消</span>
          </p>
        </div>
        <!-- 合成率提升完成 -->
        <div class="upgrade" v-else-if="step == 'upgradeSucc'">
          <span>{{ currentSynthConfig.syntheticRate }}%</span>
          <img
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/top.svg`"
            alt=""
          />
          <span>提升完成！</span>合成成功率已提升到了{{
            currentSynthConfig.syntheticRate
          }}%
        </div>
        <div class="synthSucc" v-else>
          <p>
            <span class="msg">你已顺利合成完毕！</span><br />
            <span
              >获得{{ synthSucc.synthToken }}张{{
                currentSynthConfig.ticketName
              }}</span
            ><br />
            <span
              >返回{{ synthSucc.returnTicketNum }}张{{
                synthSucc.returnTicketName
              }}</span
            >
          </p>
          <p class="synthSuccBtns">
            <span
              @click="
                step = 'normal';
                is_show_card = true;
              "
              >再次合成</span
            >
            <span @click="$emit('close_compose')">返回</span>
          </p>
          <p class="tipsMsg">
            <img
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/msg.svg`"
              alt=""
            />
            每{{ currentSynthConfig.baseTicketNum }}张{{
              currentSynthConfig.baseTicketName
            }}可以合成1张{{ currentSynthConfig.ticketName }}
          </p>
        </div>
        <!-- 粒子扩散 -->
        <!-- <div class="particle-wrap">
          <div class="particle" v-for="(item,index) in particle_list" :key="index" :style="item"></div>
        </div> -->
      </div>
    </div>
    <!-- 选中卡片 -->
    <audio
      :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/media/selectedCard.mp3`"
      ref="selectedCard"
    ></audio>
    <!-- 卡片旋转展示 -->
    <audio
      :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/media/showCard.mp3`"
      ref="showCard"
    ></audio>
  </div>
</template>

<script>
import { api_activity } from "src/api/index.js";
import slider from "../slider/slider-h5.vue";
import lottery from "../lottery/lottery-h5.vue";
// 生成随机数
const random = function (minNum, maxNum) {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
};
//头部引入
import { LOCAL_COMMON_FILE_PREFIX } from "project_path/src/core/index.js";
import { rem, useMittEmit, MITT_TYPES } from "project_path/src/core/index.js";

export default {
  name: "compose",
  components: {
    lottery,
    slider,
  },
  props: {
    lotteryNum: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      LOCAL_COMMON_FILE_PREFIX: LOCAL_COMMON_FILE_PREFIX,
      currentSynthConfig: {}, // 合成页--当前选中的奖券配置
      volume: 0, // 合成页--提升合成率滑动条数字
      currentSynthMaxNum: 0, // 当前最高可合成的奖券张数
      currTicketId: null, // 当前要合成的奖券的id
      step: "normal", // 合成页当前流程节点 （控制不同状态下的操作按钮的显示和隐藏
      luckyTicket: 0, // 幸运奖券数量
      synthSucc: {}, // 合成奖券后返回的配置
      particle_list: [], // 粒子动画
      ring_class: "danshan1", // 圆灯类
      cur_select_card: 1, // 当前选中奖券
      is_show_card: false, // 是否显示卡片
      is_has_scroll: false, // 是否有滚动条
      is_mousedown: false, // 滑动条按钮是否按下
      // 奖券对象
      lottery_obj: {
        1: {
          type: 1,
          name: "白银奖券",
          img: `${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/silver_card.png`,
          key: "silver",
        },
        2: {
          type: 2,
          name: "黄金奖券",
          img: `${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/gold_card.png`,
          key: "gold",
        },
        3: {
          type: 3,
          name: "钻石奖券",
          img: `${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/diamond_card.png`,
          key: "diamond",
        },
      },
    };
  },
  watch: {
    step: {
      handler(n) {
        if (n == "normal") {
          this.get_lottory_merge();
        }
      },
    },
  },
  created() {
    this.is_has_scroll = innerHeight < rem(7);
    this.frame = 0;
    this.get_lottory_merge();
    this.create_particle();
  },
  mounted() {
    this.timer_id = setInterval(() => {
      this.animation();
    }, 16);

    this.timer_00 = setTimeout(() => {
      this.is_show_card = true;
    });
  },
  beforeUnmount() {
    clearInterval(this.timer_id);
    this.timer_id = null;

    clearTimeout(this.timer_00);
    this.timer_00 = null;

    clearTimeout(this.timer_01);
    this.timer_01 = null;
  },
  methods: {
    /**
     * 合成奖券配置
     */
    get_lottory_merge() {
      // this.$refs.showCard.play();
      this.$emit("play_show_card");
      api_activity
        .get_synth_config()
        .then((res) => {
          let { code, data } = { ...res };
          if (code == 200) {
            if (_.get(data, "synthConfig.length")) {
              // 所有奖券的配置
              this.synthConfig = data.synthConfig;
              // 当前选中的奖券的配置，默认选中白银
              let tokenNum = {};
              this.synthConfig.forEach((item) => {
                if (this.lottery_obj[item.type]) {
                  tokenNum[this.lottery_obj[item.type].key] = item.ticketNum;
                }
                if (item.type == this.cur_select_card) {
                  this.currentSynthConfig = item;
                }
              });
              this.$emit("update_slots_config", tokenNum);
              this.currTicketId = this.currentSynthConfig.ticketId;
              // 当前最高可合成的奖券数
              this.currentSynthMaxNum = Math.floor(
                Number(this.currentSynthConfig.ownBaseTicket) /
                  Number(this.currentSynthConfig.baseTicketNum)
              );
              // 幸运奖券数量
              this.luckyTicket = data.luckyTicket;
            }
          } else if (["0410505"].includes(code)) {
            // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
            useMittEmit(MITT_TYPES.EMIT_TO_MAINTENANCE);
            return;
          } else if (["0401038"].includes(code)) {
            const msg_nodata_22 = i18n_t("msg.msg_nodata_22");
            this.$toast(msg_nodata_22, 1500);
          } else {
            this.$toast(res.msg, 1500);
          }
          // 如果当前基础奖券数量可以合成一张以上上级奖券
          if (
            this.currentSynthConfig.ownBaseTicket >=
            this.currentSynthConfig.baseTicketNum
          ) {
            // 滑动条默认显示0
            this.volume = 1;
          } else {
            // 否则就是0
            this.volume = 0;
          }
        })
        .catch((err) => {
          console.error(err);
          this.$toast(err, 1500);
        });
    },
    /**
     * 合成页---选择要合成的奖券类型
     * @param {number} type
     */
    select_card(type) {
      // 用户选择的奖券的配置数据
      this.currentSynthConfig = this.synthConfig.find(
        (item) => item.type == type
      );
      this.currTicketId = this.currentSynthConfig.ticketId;
      this.cur_select_card = type;
      // 当前最高可合成的奖券数
      this.currentSynthMaxNum = Math.floor(
        this.currentSynthConfig.ownBaseTicket /
          this.currentSynthConfig.baseTicketNum
      );
      // 如果当前基础奖券数量不够就默认为0
      this.volume = this.currentSynthConfig.ownBaseTicket == 0 ? 0 : 1;
      // 防止短时间内切换，先重载再播放
      this.$refs.selectedCard.load();
      this.$refs.selectedCard.play();
    },
    /**
     * 提升合成成功率
     */
    get_improve_rate() {
      if (
        Number(this.luckyTicket) <
        Number(this.currentSynthConfig.syntheticImproveNumber)
      ) {
        this.$toast("当前幸运奖券数不足", 1500);
        return;
      }
      api_activity
        .get_improve_rate({ ticketId: this.currTicketId })
        .then((res) => {
          let { code, data } = { ...res };
          if (code == 200) {
            this.luckyTicket = data.luckyTicket;
            this.currentSynthConfig.syntheticRate = data.syntheticRate;
            this.step = "upgradeSucc";
            // 合成成功提示展示两秒后切回初始页面
            clearTimeout(this.timer_01);
            this.timer_01 = setTimeout(() => {
              this.step = "normal";
            }, 2000);
          } else if (["0410505"].includes(code)) {
            // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
            useMittEmit(MITT_TYPES.EMIT_TO_MAINTENANCE);
            return;
          } else {
            this.$toast(res.msg, 1500);
          }
        })
        .catch((err) => {
          console.error(err);
          this.$toast(err, 1500);
        });
    },
    /**
     * 合成奖券
     * synthCount 要合成的数量
     */
    get_synth_ticket(synthCount) {
      if (!synthCount) {
        this.$toast(`${this.currentSynthConfig.baseTicketName}数不足`, 1500);
        return;
      }
      let params = {
        synthCount, // 要合成的张数
        ticketId: this.currTicketId, // 要合成的奖券id
      };
      api_activity
        .get_synth_ticket(params)
        .then((res) => {
          let { code, data } = { ...res };
          if (code == 200) {
            // 合成成功隐藏卡片列表
            this.is_show_card = false;
            this.synthSucc = data;
            this.currentSynthConfig.baseTicketNum -= Number(
              data.reduceBaseTicketNum
            );
            this.currentSynthConfig.syntheticRate = data.syntheticRate;
            this.step = "synthSucc";
            this.$emit("update_slots_config");
            // 合成完成后更新数据
            this.get_lottory_merge();
          } else if (["0410505"].includes(code)) {
            // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
            useMittEmit(MITT_TYPES.EMIT_TO_MAINTENANCE);
            return;
          } else {
            this.$toast(res.msg, 1500);
          }
        })
        .catch((err) => {
          console.error(err);
          this.$toast(err, 1500);
        });
    },
    /**
     * @Description 合成数量自增自减
     * @param {undefined} undefined   type 1 减 2 加
     */
    set_volume(type) {
      let min = this.currentSynthConfig.ownBaseTicket == 0 ? 0 : 1;
      let max =
        this.currentSynthConfig.ownBaseTicket == 0
          ? 0
          : this.currentSynthMaxNum;
      if (type == 1 && this.volume > min) {
        this.volume--;
      } else if (type == 2 && this.volume < max) {
        this.volume++;
      }
    },
    /**
     * 阻止页面滚动
     * @param {*} e 事件对象
     */
    handleTouch(e) {
      let evt = e || window.event;
      // 有滚动条 才能滚动
      if (!this.is_has_scroll && !this.is_mousedown) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    },
    /**
     * @Description 动画
     * @param {undefined} undefined
     */
    animation() {
      this.frame++;
      let deng = parseInt(this.frame / 25) % 2;
      if (this.step == "synthSucc") {
        this.ring_class = deng == 0 ? "quanshan1" : "quanshan2";
      } else {
        this.ring_class = deng == 0 ? "danshan1" : "danshan2";
      }
    },
    /**
     * @Description 生成粒子
     * @param {undefined} undefined
     */
    create_particle() {
      // 生成粒子
      let width = innerWidth;
      let height = rem(4);
      let count = 20;

      let particle_list = [];
      for (let i = 0; i < count * 4; i++) {
        let p1 = (i % count) * (width / count);
        let p2 = (i % count) * (height / count);
        let t = random(1000, 2000) / 100;
        let t2 = random(1000, 2000) / 100;
        let size = random(3, 6);
        let style;
        if (i < count) {
          style = `width:${size}px;height:${size}px;transform: translate(${p1}px, 0px);animation-duration: ${t}s;animation-delay: ${-t2}s;`;
        } else if (i < count * 2) {
          style = `width:${size}px;height:${size}px;transform: translate(0px, ${p2}px);animation-duration: ${t}s;animation-delay: ${-t2}s;`;
        } else if (i < count * 3) {
          style = `width:${size}px;height:${size}px;transform: translate(${p1}px, ${height}px);animation-duration: ${t}s;animation-delay: ${-t2}s;`;
        } else {
          style = `width:${size}px;height:${size}px;transform: translate(${width}px, ${p2}px);animation-duration: ${t}s;animation-delay: ${-t2}s;`;
        }
        particle_list.push(style);
      }
      this.particle_list = particle_list;
    },
  },
};
</script>
<style lang="scss">
:root {
  --huoyan_size: 2rem;
  --s: calc(var(--huoyan_size) / 6);
  --bor: calc(var(--huoyan_size) / 30);
  --boxShadow: calc(var(--huoyan_size) / 12);
}

/* 大小圆旋转动画 */
@keyframes card_move {
  0% {
    transform: translateY(6px);
  }

  100% {
    transform: translateY(-6px);
  }
}

/* 旋转动画 */
@keyframes xuanzhuan {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
<style lang="scss" scoped>
.slot_machine_scroll {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  /*  覆盖住顶部标题栏，顶部标题栏 z-index 99 */
  width: 100%;
  height: 100%;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  overflow-x: hidden;
  touch-action: pan-y;
  /* 小米手机自带浏览器横向手势动作bug，指定touch方向为垂直方向 */

  &.has-scroll {
    display: block;
    overflow-y: auto;
  }

  .close {
    cursor: pointer;
    position: absolute;
    right: -0.04rem;
    top: -0.04rem;
    width: 0.5rem;
    z-index: 10;
  }
}

.compose-content {
  width: 100%;
  height: 7rem;
  position: relative;
}

.compose-bg {
  width: 100%;
  height: 6rem;
  position: relative;
  background-position: center center;
  background-image: var(--qq--com-img-bg-149);
  background-size: 9.6rem auto;

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;

    background: var(--qq--com-img-bg-150) no-repeat;
    background-position: center center;
    background-size: 5rem auto;
    animation: xuanzhuan 65s linear infinite;
  }
}

/* 粒子动画 */
@keyframes shoot {
  0% {
    transform: translate(1.87rem, 2rem);
    width: 2px;
    height: 2px;
  }

  19% {
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.particle-wrap {
  width: 100%;
  height: 4rem;
  position: absolute;
  left: 0;
  top: 1rem;
  border-radius: 30%;
  overflow: hidden;
}

.particle {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  animation: shoot 3s ease-out infinite;
  opacity: 0;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.5);
}

.two_lottories_num {
  position: absolute;
  top: 0.4rem;
  left: 0;
  height: 30px;
  display: flex;
  color: #fff;
  font-size: 0.14rem;
  text-shadow: 1px 1px 4px #05121e;

  p {
    margin-right: 0.15rem;
  }

  img {
    vertical-align: middle;

    width: 0.4rem;
  }
}

/*  发光的圆环 */
.ring {
  width: 1.8rem;
  height: 1.8rem;
  position: absolute;
  left: calc((3.75rem - 1.8rem) / 2);
  top: calc((6rem - 1.8rem) / 2);
  background: var(--qq--com-img-bg-151) no-repeat center center;
  background-size: 100% auto;
  z-index: 1;

  // 圆环背景
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--qq--com-img-bg-152) no-repeat center center;
    background-size: 1.62rem auto;
  }

  // 六角形
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: var(--qq--com-img-bg-153) no-repeat center center;
    background-size: 1.2rem auto;
    animation: xuanzhuan 5s linear infinite;
    opacity: 0.5;
  }

  &.danshan1 .ring-lamp {
    background-image: var(--qq--com-img-bg-154);
  }

  &.danshan2 .ring-lamp {
    background-image: var(--qq--com-img-bg-155);
  }

  &.quanshan1 .ring-lamp {
    background-image: var(--qq--com-img-bg-156);
  }

  &.quanshan2 .ring-lamp {
    background-image: var(--qq--com-img-bg-157);
  }

  // 灯
  .ring-lamp {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-position: center center;
    background-size: 1.93rem auto;
  }

  .ring-content {
    position: relative;
    z-index: 3;
  }

  .synth-name {
    font-size: 0.14rem;
    color: #fff;
    text-align: center;
  }

  /* 合成成功慢慢出来动画 */
  @keyframes card_donghua2 {
    0% {
      transform: scale(1.5);
      opacity: 0;
    }

    30% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  .bitmap {
    width: 0.8rem;
    height: 0.8rem;
    background: var(--qq--com-img-bg-158);
    background-size: 100% auto;
    animation: card_donghua2 2s;

    &.two {
      width: 0.55rem;
      height: 0.55rem;
      position: absolute;
      right: 0.1rem;
      bottom: 0px;
    }
  }

  .sp-card {
    width: 1.3rem;

    &.donghua {
      animation: card_move 1.5s ease-in-out infinite alternate;
    }

    &.donghua2 {
      animation: card_donghua2 2s;
    }

    img {
      width: 100%;
      transform: rotate(-15deg);
    }
  }

  .two-card {
    width: 1.3rem;
    height: 0.8rem;
    position: relative;

    .sp-card {
      width: 1.1rem;
      position: absolute;

      &.two1 {
        top: 0;
        left: 0;
      }

      &.two2 {
        right: 0;
        top: 0.25rem;
      }
    }
  }

  /* 合成数量缓慢移动动画 */
  @keyframes synth_number_move {
    30% {
      transform: translate(0px, 0px);
      opacity: 0;
    }

    99% {
      transform: translate(5px, -10px);
      opacity: 1;
    }

    100% {
      transform: translate(10px, -10px);
      opacity: 0;
    }
  }

  .synth-number {
    font-size: 0.15rem;
    color: #fff;
    position: absolute;
    left: 0.5rem;
    top: 0.8rem;
    font-weight: 700;
    animation: synth_number_move 3s ease;
    opacity: 0;
    font-style: italic;

    &.two1 {
      top: -0.1rem;
      left: 0.25rem;
    }

    &.two2 {
      top: 0.8rem;
      left: 0.7rem;
    }

    &.one-bitmap {
      top: 0.83rem;
      left: 0.3rem;
    }
  }
}

.synthSlider,
.confirm,
.upgrade,
.synthSucc {
  margin: 0 auto;
  color: #fff;
  font-size: 0.12rem;
  position: relative;
  z-index: 10;
}

.synthSlider {
  background: var(--qq--com-img-bg-159) no-repeat 0.07rem -0.8rem;
  background-size: contain;

  .item {
    margin: auto;
    width: 3.5rem;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    position: relative;

    .slider-number {
      width: 30px;
      height: 18px;
      background-image: linear-gradient(
        180deg,
        rgba(187, 187, 187, 0.89) 0%,
        #ffffff 99%
      );
      border: 2px solid rgb(159, 162, 198);
      border-radius: 9px;
      text-align: center;
      line-height: 14px;
      font-size: 12px;
      color: #20082d;
    }

    .add-btn {
      width: 30px;
      height: 30px;
      cursor: pointer;
      position: absolute;
      top: -20px;
      text-align: center;
      line-height: 30px;

      &.dec {
        left: 20px;
      }

      &.add {
        right: 20px;
      }
    }
  }

  .action {
    margin-bottom: 0.15rem;

    .consume,
    .synthButtons {
      display: flex;
      justify-content: center;

      & > * {
        &:nth-child(1) {
          margin-right: 0.15rem;
          text-align: center;
        }
      }
    }

    .consume {
      margin-bottom: 0.45rem;

      p:nth-child(1) {
        margin-right: 0.4rem;
      }
    }

    .synthButtons {
      margin-bottom: 0.15rem;

      span {
        display: block;
        width: 1.2rem;
        height: 0.34rem;
        line-height: 0.34rem;
        font-size: 0.12rem;
        text-align: center;
        border-radius: 0.17rem;
        background: #e89e43;

        &:nth-child(2) {
          padding-right: 0.15rem;
          margin-left: 0.15rem;

          &:after {
            content: "";
            display: block;
            width: 0.1rem;
            height: 0.1rem;
            clip-path: polygon(50% 40%, 0% 100%, 100% 100%);
            background: #fff;
            position: relative;
            top: -0.23rem;
            left: 0.82rem;
          }
        }
      }

      .get_gray {
        filter: grayscale(100%);
        cursor: not-allowed;
      }
    }

    .tips {
      padding-left: 0.35rem;
      font-size: 0.12rem;

      p {
        img {
          vertical-align: middle;
          width: 0.14rem;
        }
      }

      p:nth-child(1) {
        margin-right: 0.15rem;
        margin-bottom: 0.02rem;
      }
    }
  }
}

.confirm {
  .confirmTips {
    font-size: 0.14rem;
    text-align: center;

    span {
      display: block;
      margin: 0 auto 0.1rem;
      color: #ffb001;
      font-size: 0.18rem;
      font-weight: 600;
    }
  }

  .confirmBtns {
    display: flex;
    justify-content: center;
    margin-top: 0.55rem;

    span {
      display: inline-block;
      width: 1.2rem;
      height: 0.34rem;
      line-height: 0.34rem;
      text-align: center;
      border-radius: 0.17rem;
    }

    span:nth-child(1) {
      background-color: #e89e43;
      color: #fff;
      margin-right: 0.3rem;
    }

    span:nth-child(2) {
      background-color: #fff;
      color: #454242;
    }
  }
}

// 合成率提升成功
.upgrade {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.14rem;
  top: -0.8rem;

  img {
    width: 0.34rem;
    animation: card_move 1s ease-in-out infinite alternate;
  }

  span {
    &:nth-child(1) {
      font-size: 0.36rem;
    }

    &:nth-child(3) {
      color: #ffb001;
      font-size: 0.18rem;
      margin-bottom: 0.1rem;
    }
  }
}

.synthSucc {
  font-size: 0.14rem;

  p {
    text-align: center;

    .msg {
      font-size: 0.18rem;
      color: #ffb001;
      font-weight: 500;
      display: inline-block;
      margin-bottom: 0.07rem;
    }
  }

  .synthSuccBtns {
    display: flex;
    justify-content: center;
    margin: 0.45rem auto 0.2rem;
    font-size: 0.12rem;

    span {
      display: inline-block;
      width: 1.2rem;
      height: 0.34rem;
      line-height: 0.34rem;
      text-align: center;
      border-radius: 0.17rem;
    }

    span:nth-child(1) {
      background-color: #e89e43;
      color: #fff;
      margin-right: 0.3rem;
    }

    span:nth-child(2) {
      background-color: #fff;
      color: #454242;
    }
  }

  .tipsMsg {
    text-align: left;
    padding-left: 0.35rem;
    font-size: 0.12rem;

    img {
      width: 0.14rem;
      vertical-align: sub;
    }
  }
}
</style>
