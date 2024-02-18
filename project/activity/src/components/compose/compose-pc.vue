<!--
 * 合成奖券页面
 * @Author: Cable
 * @Date: 2022-03-03 11:57:09
-->
<template>
  <q-scroll-area class="compose-wrap slot_machine_scroll">
    <!--  -->
    <div class="compose-bg row">
      <div class="compose-content" ref="composeContent">
        <!-- 火焰 -->
        <div class="circle"></div>
        <svg>
          <filter id="wavy">
            <feTurbulence
              x="0"
              y="0"
              baseFrequency="0.009"
              numOctaves="5"
              speed="2"
            >
              <animate
                attributeName="baseFrequency"
                dur="60s"
                values="0.02; 0.005; 0.02"
                repeatCount="indefinite"
              ></animate>
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              scale="30"
            ></feDisplacementMap>
          </filter>
        </svg>

        <!-- 关闭按钮 -->
        <img
          @click="$emit('close_compose')"
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/close.svg`"
          alt=""
          class="close"
          width="38"
        />

        <!-- 奖券数量 -->
        <div class="two_lottories_num">
          <!-- 合成材料名称和数量 -->
          <p>
            <img
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/normal_voucher.png`"
              alt=""
              width="58"
            />
            {{ currentSynthConfig.baseTicketName }}:
            {{ currentSynthConfig.ownBaseTicket }}
          </p>
          <!-- 幸运奖券 -->
          <p>
            <img
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/lucky_voucher.png`"
              alt=""
              width="56"
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
                <span class="num">{{
                  volume * (currentSynthConfig.baseTicketNum || 0)
                }}</span
                >张
              </p>
              <p>
                成功率:
                <span class="num">{{ currentSynthConfig.syntheticRate }}%</span>
              </p>
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
                  :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/msg.svg`"
                  alt=""
                  width="18"
                />
                每消耗{{ currentSynthConfig.baseTicketNum }}张{{
                  currentSynthConfig.baseTicketName
                }}可以合成1张{{ currentSynthConfig.ticketName }}
              </p>
              <p>
                <img
                  :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/msg.svg`"
                  alt=""
                  width="18"
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
          <span class="head-odds">{{ currentSynthConfig.syntheticRate }}%</span>
          <img
            :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/top.svg`"
            alt=""
          />
          <span class="finish">提升完成！</span>
          <span class="footer-odds"
            >合成成功率已提升到了{{ currentSynthConfig.syntheticRate }}%</span
          >
        </div>
        <!-- 合成成功 synthSucc -->
        <div class="synthSucc" v-else>
          <p>
            <span class="msg">你已顺利合成完毕！</span>
            <span
              >获得 {{ synthSucc.synthToken }} 张{{
                currentSynthConfig.ticketName
              }}</span
            >
            <span
              >，返回 {{ synthSucc.returnTicketNum }} 张{{
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
          <p>
            <img
              :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/msg.svg`"
              alt=""
              width="18"
            />
            每 {{ currentSynthConfig.baseTicketNum }} 张{{
              currentSynthConfig.baseTicketName
            }}可以合成 1 张{{ currentSynthConfig.ticketName }}
          </p>
        </div>

        <!-- 粒子扩散 -->
        <div
          class="particle"
          v-for="(item, index) in particle_list"
          :key="index"
          :style="item"
        ></div>
      </div>
    </div>
    <div class="toast_tips" v-if="tips.statu">{{ tips.message }}</div>
    <!-- 登录失效/维护提示一类的弹窗 -->
    <Alert
      :is_show="showAlert"
      :text="noticeMsg"
      :isMaintaining="isMaintaining"
    />
    <!-- 选中卡片 -->
    <audio
      :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/media/selectedCard.mp3`"
      ref="selectedCard"
    ></audio>
    <!-- 卡片旋转展示 -->
    <audio
      :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/media/showCard.mp3`"
      ref="showCard"
    ></audio>
  </q-scroll-area>
</template>

<script>
import { api_activity } from "src/api/index.js";
import slider from "../slider/slider-pc.vue";
import lottery from "../lottery/lottery-pc.vue";
import Alert from "project/activity/src/components/public_alert/public_alert.vue";
//头部引入
import {
  useMittOn,
  useMittEmit,
  LOCAL_COMMON_FILE_PREFIX,
  MITT_TYPES} from "project/activity/src/core/index.js";
import _ from 'lodash'
// 生成随机数
const random = function (minNum, maxNum) {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
};

export default {
  components: {
    slider,
    lottery,
    Alert,
  },
  props: {
    lotteryNum: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      LOCAL_COMMON_FILE_PREFIX:LOCAL_COMMON_FILE_PREFIX,
      currentSynthConfig: {}, // 合成页--当前选中的奖券配置
      synthSucc: {}, // 合成奖券后返回的配置
      luckyTicket: 0, // 幸运奖券数量
      currentSynthMaxNum: 0, // 当前最高可合成的奖券张数
      volume: 0, // 合成页--提升合成率滑动条数字
      step: "normal", // 合成页当前流程节点 （控制不同状态下的操作按钮的显示和隐藏    synthSucc: 合成成功   normal：等待合成  toUpgrade：提成合成率  upgradeSucc：合成率提成完成
      ring_class: "danshan1", // 圆灯类
      // 奖券样式
      particle_list: [], // 粒子动画
      cur_select_card: 1, // 当前选中奖券
      is_show_card: false, // 是否显示卡片
      timeout_obj: {}, // 定时器ID
      tips: {
        statu: false,
        message: "",
      },
      showAlert: false, // 展示notice提示
      isMaintaining: false, // 当前是否是维护状态
      noticeMsg: "",
      // 奖券对象
      lottery_obj: {
        1: {
          type: 1,
          name: "白银奖券",
          img: `${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/silver_card.png`,
          key: "silver",
        },
        2: {
          type: 2,
          name: "黄金奖券",
          img: `${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/gold_card.png`,
          key: "gold",
        },
        3: {
          type: 3,
          name: "钻石奖券",
          img: `${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/diamond_card.png`,
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
    // 动画帧数
    this.frame = 0;
    // 当前奖券背景索引
    this.card_index = 0;
    this.get_lottory_merge();
    this.create_particle();
    // 定时器id
    this.timer_tips = null;
    window.addEventListener("resize", this.scale_func);
  },
  mounted() {
    this.timer_id = setInterval(() => {
      this.animation();
    }, 16);
    this.is_show_card = true;
    this.scale_func();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.scale_func);
    clearInterval(this.timer_id);
  },
  methods: {
    // 元素缩放
    scale_func() {
      // dom的高度
      let d_height = this.$refs.composeContent.offsetHeight;
      // 窗口的高度
      let win_height = window.innerHeight;
      // 缩放的比例
      let scaleNum = win_height / d_height;
      // margintop的值
      let margin_top = win_height - (win_height * scaleNum + 44);
      const scalDom = document.querySelector(".compose-wrap");

      console.log(
        "resize",
        margin_top,
        win_height,
        d_height,
        window.innerHeight
      );
      if (scaleNum < 1) {
        scalDom.style.setProperty("--qq--activity-scale", scaleNum);
        scalDom.style.setProperty(
          "--qq--activity-margin-top",
          `-${margin_top}px`
        );
        scalDom.style.setProperty(
          "--qq--activity-bg-margin-top",
          `-${margin_top - 44}px`
        );
      } else {
        scalDom.style.setProperty("--qq--activity-scale", 1);
        scalDom.style.setProperty("--qq--activity-margin-top", `0px`);
        scalDom.style.setProperty("--qq--activity-bg-margin-top", `0px`);
      }
    },
    /**
     * 合成奖券配置
     * ownBaseTicket 当前奖券的下一级奖券的数量（基础奖券）
     * baseTicketNum 合成一张当前奖券需要耗费的下级奖券数量
     * ticketId 当前类型奖券的 id
     * syntheticRate 合成成功率
     */
    get_lottory_merge() {
      this.$emit("play_show_card");
      api_activity
        .get_synth_config()
        .then((res) => {
          let { code } = res;
          if (code == "0401038") {
            this.toast(i18n_t("common.limited"));
            return;
          }

          if ((code == 200 || code == '0000000') && _.get(res, "data.synthConfig.length")) {
            // 所有奖券的配置
            this.synthConfig = _.get(res, "data.synthConfig");
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
            // 更新老虎机配置
            this.$emit("update_slots_config", tokenNum);
            this.currTicketId = this.currentSynthConfig.ticketId;
            // 当前最高可合成的奖券数
            this.currentSynthMaxNum = Math.floor(
              Number(this.currentSynthConfig.ownBaseTicket) /
                Number(this.currentSynthConfig.baseTicketNum)
            );
            // 幸运奖券数量
            this.luckyTicket = _.get(res, "data.luckyTicket");
          } else if (code == "0410505") {
            this.isMaintaining = true;
            this.showAlert = true;
            this.noticeMsg = "活动现已维护，感谢您的支持";
          } else {
            this.$toast(res.msg || res.message, 1500);
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
            setTimeout(() => {
              this.step = "normal";
            }, 2000);
          } else if (code == "0410505") {
            this.isMaintaining = true;
            this.showAlert = true;
            this.noticeMsg = "活动现已维护，感谢您的支持";
            // 其他情况的接口提示
          } else {
            this.$toast(res.msg || res.message, 1500);
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
        this.toast(`${this.currentSynthConfig.baseTicketName}数不足`, 1500);
        return;
      }
      let params = {
        synthCount, // 要合成的张数
        ticketId: this.currTicketId, // 要合成的奖券id
      };
      api_activity
        .get_synth_ticket(params)
        .then((res) => {
          let { code, data } = res;
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
            this.toast(res.message, 1500);
          }
        })
        .catch((err) => {
          console.error(err);
          this.toast(err, 1500);
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
      let width = 1200;
      let height = 860;
      let count = 30;

      let particle_list = [];
      for (let i = 0; i < count * 4; i++) {
        let p1 = (i % count) * (width / count);
        let p2 = (i % count) * (height / count);
        let t = random(1000, 2000) / 100;
        let t2 = random(1000, 2000) / 100;
        let size = random(5, 8);
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
    /**
     * notice 提示
     * 由于该弹窗自带的隐藏动画比较诡异切暂时没有找到相关处理接口，所以在执行隐藏动画前手动关闭
     * @param {*} msg 要提示的信息，默认展示 1500ms,给 1800ms 是因为后面 300ms 是关闭动画
     */
    warningNotice(msg, time = 1800) {
      useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, msg);
      // 手动隐藏提示弹窗
      if (this.timeout_obj.timer2) {
        clearTimeout(this.timeout_obj.timer2);
      }
      this.timeout_obj.timer2 = setTimeout(() => {
        let n = document.getElementsByClassName("q-notification");
        for (let i = 0; i < n.length; i++) {
          n[i].style.opacity = "0";
        }
      }, time - 300);
    },
    /**
     * @description: 自定义提示
     * @param {String} message 提示语
     */
    toast(message) {
      /**清除定时器 */
      clearTimeout(this.timer_tips);
      this.timer_tips = null;
      this.tips = {
        statu: true,
        message: message,
      };
      this.timer_tips = setTimeout(() => {
        this.tips.statu = false;
      }, 2000);
    },
    $toast(message){
      this.toast(message)
    },
  },
};
</script>
<style lang="scss">
:root {
  --huoyan_size: 500px;
  --s: calc(var(--huoyan_size) / 6);

  --bor: 5px;
  --boxShadow: calc(var(--huoyan_size) / 12);
}

/*  大小圆旋转动画 */
@keyframes card_move {
  0% {
    transform: translateY(10px);
  }

  100% {
    transform: translateY(-10px);
  }
}

/*  旋转动画 */
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
/*  粒子动画 */
@keyframes shoot {
  0% {
    transform: translate(600px, 430px);
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

/*  火焰动画 */
.circle {
  position: absolute;
  left: 50%;
  top: 70px;
  margin-left: -375px;
  width: 750px;
  height: 750px;
  filter: url(#wavy) blur(1px);
  animation: xuanzhuan 50s linear infinite;
}

.circle:before,
.circle:after {
  content: "";
  position: absolute;
  top: var(--s);
  left: var(--s);
  right: var(--s);
  bottom: var(--s);
  border-radius: 50%;
  border: var(--bor) solid #fff;
}

svg {
  width: 0;
  height: 0;
}

.compose-wrap {
  position: fixed !important;
  width: 100%;
  min-width: 1200px;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.6);

  :deep(.scroll) {
    overflow: auto;
  }
}

.compose-bg {
  width: 100%;
  position: relative;
  min-height: 960px;
  background-position: center top;
  background-image: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/bg.png");
  background-size: 1920px auto;

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: -68px;
    background-position: center center;
    background-image: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/bg2.png");
    background-size: 1000px auto;
    background-repeat: no-repeat;
    transform: scale(var(--qq--activity-scale));
    margin-top: var(--qq--activity-bg-margin-top);
  }
}

.compose-content {
  width: 1200px;
  margin: auto;
  position: relative;
  padding-top: 20px;
  transform: scale(var(--qq--activity-scale));
  margin-top: var(--qq--activity-margin-top);

  /*  关闭按钮 */
  .close {
    cursor: pointer;
    position: absolute;
    right: 30px;
    top: 100px;
  }

  /*  奖券数量 */
  .two_lottories_num {
    display: flex;
    justify-content: flex-end;
    margin-right: 80px;

    display: flex;
    color: #fff;
    font-size: 20px;
    text-shadow: 1px 1px 4px #05121e;

    p {
      margin-right: 15px;
    }

    img {
      vertical-align: middle;
      margin-right: 10px;
    }
  }

  /*  发光的圆环 */
  .ring {
    width: 440px;
    height: 440px;
    position: absolute;
    left: 380px;
    top: 225px;
    background: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/star_bg.png")
      no-repeat center center;
    background-size: 100% auto;

    /*  圆环背景 */
    &:before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/ring.png")
        no-repeat center center;
      background-size: 371px auto;
    }

    /*  六角形 */
    &:after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/star.png")
        no-repeat center center;
      animation: xuanzhuan 5s linear infinite;
      opacity: 0.5;
    }

    &.danshan1 .ring-lamp {
      background-image: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/danshan1.png");
    }

    &.danshan2 .ring-lamp {
      background-image: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/danshan2.png");
    }

    &.quanshan1 .ring-lamp {
      background-image: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/quanshan1.png");
    }

    &.quanshan2 .ring-lamp {
      background-image: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/quanshan2.png");
    }

    /*  灯 */
    .ring-lamp {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    .ring-content {
      position: relative;
      z-index: 3;
    }

    .synth-name {
      font-size: 18px;
      color: #fff;
      text-align: center;
    }

    /*  合成成功慢慢出来动画 */
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
      width: 190px;
      height: 190px;
      background: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/bitmap.png");
      background-size: 100% auto;
      animation: card_donghua2 2s;

      &.two {
        width: 150px;
        height: 150px;
        position: absolute;
        right: 30px;
        bottom: 10px;
      }
    }

    .sp-card {
      width: 300px;

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
      width: 300px;
      height: 200px;
      position: relative;

      .sp-card {
        width: 230px;
        position: absolute;

        &.two1 {
          top: 0;
          left: 0;
        }

        &.two2 {
          right: 0;
          top: 80px;
        }
      }
    }

    /*  合成数量缓慢移动动画 */
    @keyframes synth_number_move {
      30% {
        transform: translate(0px, 0px);
        opacity: 0;
      }

      99% {
        transform: translate(5px, -20px);
        opacity: 1;
      }

      100% {
        transform: translate(10px, -20px);
        opacity: 0;
      }
    }

    .synth-number {
      font-size: 30px;
      color: #fff;
      position: absolute;
      left: 150px;
      top: 170px;
      font-weight: 700;
      animation: synth_number_move 3s ease;
      opacity: 0;
      font-style: italic;

      &.two1 {
        top: -10px;
        left: 70px;
      }

      &.two2 {
        top: 200px;
        left: 130px;
      }

      &.one-bitmap {
        top: 180px;
        left: 100px;
      }
    }
  }
}

/*  滑动条部分 */
.synthSlider,
.confirm,
.upgrade,
.synthSucc {
  width: 900px;
  margin: 0 auto;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin-top: 695px;
  position: relative;
  z-index: 6;
}

.synthSlider {
  .item {
    margin: auto;
    width: 768px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    position: relative;

    .slider-number {
      width: 47px;
      height: 30px;
      background-image: linear-gradient(
        180deg,
        rgba(187, 187, 187, 0.89) 0%,
        #ffffff 99%
      );
      border: 2px solid rgb(159, 162, 198);
      border-radius: 15px;
      text-align: center;
      line-height: 26px;
      font-size: 18px;
      color: #20082d;
    }

    .add-btn {
      width: 20px;
      height: 20px;
      cursor: pointer;
      position: absolute;
      top: -20px;
      text-align: center;
      line-height: 20px;

      &.dec {
        left: 35px;
      }

      &.add {
        right: 35px;
      }
    }
  }

  .action {
    margin-bottom: 20px;

    /*  合成奖券箭头背景  */
    &::before {
      content: "";
      position: absolute;
      top: 20px;
      width: 900px;
      height: 133px;
      background-image: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/synthesis_bg.png");
      background-size: 550px;
      background-repeat: no-repeat;
      background-position: center -145px;
      z-index: -1;
    }

    .consume,
    .synthButtons {
      display: flex;
      justify-content: center;

      & > * {
        &:nth-child(1) {
          margin-right: 100px;
          text-align: center;
        }
      }
    }

    .consume {
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 400;

      .num {
        font-size: 18px;
      }
    }

    .synthButtons {
      margin: 50px auto 25px;

      span {
        display: block;
        width: 188px;
        height: 52px;
        line-height: 52px;
        font-size: 18px;
        text-align: center;
        border-radius: 26px;
        background: #e89e43;
        cursor: pointer;
        padding-right: 15px;

        &:nth-child(2) {
          &:after {
            content: "";
            display: block;
            width: 13px;
            height: 10px;
            clip-path: polygon(50% 30%, 0% 100%, 100% 100%);
            background: #fff;
            position: relative;
            top: -34px;
            left: 130px;
          }
        }
      }

      .get_gray {
        filter: grayscale(100%);
        cursor: not-allowed;
      }
    }

    .tips {
      display: flex;
      justify-content: center;
      font-size: 16px;
      font-weight: 500;

      p {
        img {
          vertical-align: sub;
        }
      }

      p:nth-child(1) {
        margin-right: 20px;
      }
    }
  }
}

.confirm {
  p {
    text-align: center;
  }

  .confirmTips {
    font-size: 18px;
    font-weight: 500;

    span {
      font-size: 24px;
      color: #ff7000;
      display: block;
      margin: 0 auto 5px;
    }
  }

  .confirmBtns {
    margin-top: 25px;

    span {
      display: inline-block;
      width: 188px;
      height: 52px;
      line-height: 52px;
      text-align: center;
      border-radius: 26px;
      cursor: pointer;
    }

    span:nth-child(1) {
      background-color: #e89e43;
      color: #fff;
      margin-right: 100px;
    }

    span:nth-child(2) {
      background-color: #fff;
      color: #454242;
    }
  }
}

/*  合成率提升完成 */
.upgrade {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: -160px;

  .head-odds {
    font-size: 68px;
    color: #ffffff;
    font-weight: 600;
    padding-left: 15px;
  }

  img {
    width: 70px;
    animation: card_move 1s ease-in-out infinite alternate;
  }

  .finish {
    font-size: 24px;
    color: #ff7000;
    text-align: center;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .footer-odds {
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    font-weight: 500;
  }
}

/*  合成成功 */
.synthSucc {
  p {
    text-align: center;

    .msg {
      display: block;
      font-size: 24px;
      color: #ff7000;
      font-weight: 500;
    }

    &:nth-child(1) {
      font-weight: 500;
    }

    &:nth-child(3) {
      font-weight: 500;
      font-size: 16px;

      img {
        vertical-align: sub;
      }
    }
  }

  .synthSuccBtns {
    display: flex;
    justify-content: center;
    margin: 30px auto;

    span {
      display: inline-block;
      width: 188px;
      height: 52px;
      line-height: 52px;
      text-align: center;
      border-radius: 26px;
    }

    span:nth-child(1) {
      background-color: #e89e43;
      color: #fff;
      margin-right: 100px;
    }

    span:nth-child(2) {
      background-color: #fff;
      color: #454242;
    }
  }
}

/*  合成材料数滑动条 */
.q-item__section--side {
  display: inline-block;

  padding: 5px;
  height: 34px;
  line-height: 34px;
  background: #fff;
  color: #333;

  &:nth-child(1) {
    margin-right: 15px;
  }

  &:nth-child(3) {
    margin-left: 15px;
  }
}

.toast_tips {
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 10px 20px;
  border-radius: 2px;
  text-align: center;
  transform: translate(-50%, -50%);
  z-index: 10011;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 6px;
  color: #fff;
}
</style>
