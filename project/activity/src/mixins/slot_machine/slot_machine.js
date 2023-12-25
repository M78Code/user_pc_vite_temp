 
import {api_activity} from "src/api/index.js";

import common from "project/activity/src/mixins/common/common.js";
import formartmixin from 'project/activity/src/mixins/common/formartmixin.js';
import { UserCtr ,LOCAL_COMMON_FILE_PREFIX } from "project_path/src/core/index.js";
import {  format_time_zone_time } from "project_path/src/core/index.js"
import acticity_mixin from "project/activity/src/mixins/acticity_mixin/acticity_mixin";
import { throttle } from "lodash";

let machine_images_pc = [
  LOCAL_COMMON_FILE_PREFIX+'/activity/yazhou-pc/activity_imgs/imgs/slot_machine/machine_silver.png',
  LOCAL_COMMON_FILE_PREFIX+'/activity/yazhou-pc/activity_imgs/imgs/slot_machine/machine_gold.png',
  LOCAL_COMMON_FILE_PREFIX+'/activity/yazhou-pc/activity_imgs/imgs/slot_machine/machine_diamond.png'
];

let machine_images_h5 = [
  LOCAL_COMMON_FILE_PREFIX+'/activity/yazhou-h5/activity/slot_machine/machine_silver.png',
  LOCAL_COMMON_FILE_PREFIX+'/activity/yazhou-h5/activity/slot_machine/machine_gold.png',
  LOCAL_COMMON_FILE_PREFIX+'/activity/yazhou-h5/activity/slot_machine/machine_diamond.png'
];

export default {
  inject: ['is_mobile'],
  setup(props) {
  },
  name: 'slot_machine',
  mixins: [common, formartmixin,acticity_mixin],
  emits:['to_maintenance'],
  data() {
    return {

      is_init: false, // 老虎机是否已经初始化
      animationClass: [], //3个抽奖模块对应的动画属性,方便后来对应添加和移除该class样式
      currentSlotIndex: 0, // 当前显示的老虎机下标 0白银 1黄金 2钻石
      activityTime: "", //活动时间
      historiesBar: [
        '彩金记录',
        '合成记录',
        '重置记录'
      ],
      currentSlotData: [], // 三个老虎机的配置和数据
      notStart: true, //是否显示开始滚动按钮
      runResetSlotAnim: false, // 开始重置按钮动画
      runStartAnim: false,
      currentSlotId: '', // 当前老虎机id
      showNotice: false, // 展示notice提示
      noticeMsg: '', // notice 提示内容
      timeout_obj: {}, // 计时器
      rocker_anim_index: 1, // 摇杆动画序列初始帧值
      triangle_fade: 0, // 三角形闪动
      triangle_run: 1, // 三角形光走动
      // 彩灯跑动
      light_run_pink: 1,
      light_run_blue: 1,
      light_run_yellow: 1,
      spin_success: false, // 展示抽奖成功后的彩灯闪动效果
      gameHistory: false, // 是否展示游戏记录弹窗
      historyDataState: 'data',
      gameHistoryLists: {
        list: [],
        params: {
          total: 0,
          type: 1, // 1、彩金记录 2、合成记录 3、重置记录
          current: 1, // 分页，当前第几页
          size: 5, //每页多少条数据，默认5条
        }
      },
      goToPage: 1,
      // 老虎机状态
      tiger_status:'stop',
      // 老虎机结果
      tiger_result:[6,6,6,6],
      slot_config: {},
      caijin_transfer: false, // 展示彩金文字缩放特效
      player: null,
      start_video: 0, // 合成开始动效
      showMerge: false, // 合成弹窗
      maximizedToggle: true,
      selectedCard: '', // 合成页--已选中的奖券的图片地址
      currentSynthConfig: {}, // 合成页--当前选中的奖券配置
      volume: 0, // 合成页--提升合成率滑动条数字
      currentSynthMaxNum: 0, // 当前最高可合成的奖券张数
      currTicketId: null, // 当前要合成的奖券的id
      step: 'normal', // 合成页当前流程节点 （控制不同状态下的操作按钮的显示和隐藏
      luckyTicket: 0, // 幸运奖券数量
      synthSucc: {}, // 合成奖券后返回的配置
      beforeGameResult: {}, // 前一次的抽奖结果
      currentAwardSlotId: '', // 当前需要领彩金的老虎机id
      showNumScroll: false, // 展示数字滚轮
      is_show_compose: false, // 展示合成页
      slotCurrentResult: {}, // 老虎机现在的开奖结果
      initNums: [], // 数字滚动自定义结果
      lottery: { // 三种奖券的数量
        silver: 0,
        gold: 0,
        diamond: 0
      },
      activityTips: { // 提示弹窗
        status: false,
        msg: ""
      },
      isFirstTime: false, // 是否是首次提示
      page_temp:'',
    }
  },
  computed: {
    machine_images(){
    return this.is_mobile?machine_images_h5 :machine_images_pc

    },
    pagenation_max(){
      return Math.ceil(this.gameHistoryLists.params.total / this.gameHistoryLists.params.size);
    },
    get_user() {
        return UserCtr.get_user();
    },
    get_theme() {
        return UserCtr.theme ||"";
    },
  },
 
  props: {
    startTime: '' ,
    slotActivityTime:  '',
    slotTimeStamp: '',
    period:  '', // 1 未开始 2 进行中 3 已结束
    activityIndex: '', 
    // 活动开始时间
    inStartTime: '',  
    // 活动结束时间
    inEndTime: '', 
    isIphoneX:false
  },
  created() {
    this.triangle_run_interval_timer=0; // q 三角形帧动画定时器id
    this.triangle_fade_timer=0;
    this.morningTimer=0;
    this.lights_run_timer={ // 跑马灯跑动动效
        pink_run: 0,
        blue_run: 0,
        yellow_run: 0
      },
    this.timerPlayVideo = null;
    this.get_activity_slot_config()
    // 老虎机操作请求需要节流
    this.resetSlot =  throttle(this.resetSlot, 800)
    this.start =   throttle(this.start, 800)
    setTimeout(() => {
      // let width = 800
      let width = this.$refs.scroller.clientWidth
      width = Math.ceil(width / 4)

      this.slot_config = {
          // 老虎机列数
          col:4,
          // 老虎机行数
          row:10,
          // 每列宽度
          col_width: width,
          // 每列高度
          col_height:96,
          // 单个数字宽度
          item_width:44,
          // 单个数字高度
          item_height:48,
          // 初始数字
          init_number:[10,10,10,10],
          speed:80
        }
        this.showNumScroll = true
    }, 100);
    // 每天0点重新获取老虎机配置
    this.morningTimer = setInterval(() => {
      // 服务器时间戳
      let stime = this.get_now_server();
      let _now = this.utc_to_gmt_no_8_ms2_(stime);
      if (_now.h == '00' && _now.mm == '00' && _now.s == '00') {
        this.get_activity_slot_config()
      }
    }, 1000)

    // 合成页面的三种奖券的配置
    this.synthConfig = null;
    // 一些初始化动画处理
    this.init();
    document.addEventListener('visibilitychange', this.isHidden)
  },
  methods: {
    goToHistoryPage(e){
      if(e){
        if(!e.target.value){
          this.page_temp = e.target.value;
          return;
        }
        if(e.target.value=='0'){
          this.page_temp = '';
          return;
        }
        let val = Math.min(+e.target.value, this.pagenation_max)
        if(val>this.pagenation_max){
          val = this.pagenation_max;
        }
        this.page_temp = val;
        this.gameHistoryLists.params.current = val
        this.get_activity_slot_get_game_record(val,this.gameHistoryLists.params.type, this.gameHistoryLists.params.size)
      }
    },
    // lodash debounce防抖函数和throttle节流函数功能cancel函数调用
    debounce_throttle_cancel(fun) {
      if (fun && fun.cancel && typeof fun.cancel == "function") {
        fun.cancel();
      }
    },
 

    /**
     * 初始化动画处理
     */
    init() {
      // 初始化一下动效
      this.spin_success = false;
      clearInterval(this.triangle_fade_timer);
      clearInterval(this.triangle_run_interval_timer)
      Object.keys(this.lights_run_timer).forEach(item => clearInterval(this.lights_run_timer[item]))
      clearTimeout(this.timer1)
      clearTimeout(this.timer2)
      this.triangle_run = 1;
      this.light_run_pink = 1;
      this.light_run_blue = 1;
      this.light_run_yellow = 1;
      // 老虎机小三角形[光走动]帧动画
      this.triangle_run_interval_timer = setInterval(() => {
        this.triangle_run += 1;
        if (this.triangle_run > 3) {
          this.triangle_run = 1;
        }
      }, 200)
      // 三色灯跑动效果
      this.lights_run_timer.pink_run = setInterval(() => {
        this.light_run_pink += 1;
        if (this.light_run_pink > 26) {
          this.light_run_pink = 1;
        }
      }, 300);
      this.timer1 = setTimeout(() => {
        this.lights_run_timer.blue_run = setInterval(() => {
          this.light_run_blue += 1;
          if (this.light_run_blue > 26) {
            this.light_run_blue = 1;
          }
        }, 300)
      }, 1000);
      this.timer2 = setTimeout(() => {
        this.lights_run_timer.yellow_run = setInterval(() => {
          this.light_run_yellow += 1;
          if (this.light_run_yellow > 26) {
            this.light_run_yellow = 1;
          }
        }, 300)
      }, 2000);
    },
    play_show_card() {
      this.$refs.showCard.play()
    },
    /**
     * 获取老虎机配置
     * * type 0默认情况，不做特殊处理 1抽奖后的调用，不需要判断是否有需要领取的结果
     */
    get_activity_slot_config(type = 0) {
      api_activity.get_activity_slot_config().then(res => {
        let {code, data} = {...res}
        if (code == 200 && _.get(data, 'length')) {
          this.currentSlotData = data;
          let beforeGameResult = {}
          data.forEach((item, index) => {
            // 获取三种奖券的数量
            if (item.slotId == 1) {
              this.lottery.silver = item.tokenNum
            } else if (item.slotId == 2) {
              this.lottery.gold = item.tokenNum
            } else if (item.slotId == 3) {
              this.lottery.diamond = item.tokenNum
            }
            // 判断是否有未领取的奖金
            if (item.beforeGameResult != null) {
              beforeGameResult = item.beforeGameResult
              beforeGameResult.reward = this.format_float(Number(beforeGameResult.reward) / 100)
              this.currentAwardSlotId = item.slotId;
              if (index == 0) {
                this.initNums = beforeGameResult.slotResult
              }
              if (type == 0) {
                this.notStart = false
              }
            }
            // 用户是否有超过5天未领取的奖金，有就展示提示窗
            if (item.gameResultMsg) {
              this.activityTips = {
                status: true,
                msg: "您的彩金由于长时间未领取，系统已自动派发至您的账户中"
              }
              this.isFirstTime = true;
            }
          })
          this.beforeGameResult = beforeGameResult
          this.is_init = true
        } else if(['0410505'].includes(code)) { // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
          this.$emit('to_maintenance')
          return
        }
        else if ( ['0401038'].includes(code) ){
          const msg_nodata_22 = i18n_t('msg.msg_nodata_22')
          this.$toast(msg_nodata_22, 1500)
        }
        else {
          this.$toast(res.msg, 1500)
        }
      }).catch(err => {
        console.error(err)
        this.$toast(err, 1500)
      })
    },
    /**
     * @Description 更新奖券数量
     * @param {undefined} undefined
    */
    update_slots_config(obj){
      if(obj){
        Object.assign(this.lottery,obj)
      }else{
        this.get_activity_slot_config()
      }
    },
    /**
     * 游戏记录
     */
    get_activity_slot_get_game_record(current = 1,type = 1, size = 5) {
      if (this.activityTips.status) {return}
      if(this.gameHistoryLists.params.type !=  Number(type)){
        this.gameHistoryLists.list = [];
      }
      const params = {
        type,
        current,
        size
      }
      // 获取当前历史记录的配置信息
      this.gameHistoryLists.params.type = Number(type);
      this.gameHistoryLists.params.current = Number(current);
      this.historyDataState = 'loading';
      api_activity.get_activity_slot_get_game_record(params).then(res => {
        let {code, data} = {...res}
        if (code == 200 && _.get(data, 'records')) {
          this.gameHistory = true;
          this.gameHistoryLists.params.total = Number(data.total);
          if (_.get(data, 'records.length')) {
            this.historyDataState = 'data';
            this.gameHistoryLists.list = data.records;
          } else {
            this.gameHistoryLists.list = [];
            // 没数据就显示【暂无数据】
            this.historyDataState = 'empty';
          }
        } else if(['0410505'].includes(code)) { // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
          this.$emit('to_maintenance')
          this.historyDataState = 'data';
          return
        }else if ( ['0401038'].includes(code) ){
          const msg_nodata_22 = i18n_t('msg.msg_nodata_22')
          this.$toast(msg_nodata_22, 1500)
          this.historyDataState = 'empty';
        } else {
          this.gameHistoryLists.list = [];
          // 没数据就显示【暂无数据】
          this.historyDataState = 'empty';
          this.$toast(res.msg, 1500)
        }
      }).catch(err => {
        this.gameHistoryLists.list = [];
        // 没数据就显示【暂无数据】
        this.historyDataState = 'empty';
        console.error(err)
        this.$toast(err, 1500)
      })
    },
    /**
     * 分页组件分页方法
     * @param {*} e 分页组件当前页
     */
    pagination_next(e) {
      // 此写法是为了解决 quasar1.X版本 q-pagination 组件接收分页值时会自动触发方法的问题
      if (new Date().getTime() - this.totalTime < 100) {
        return;
      } else {
        this.get_activity_slot_get_game_record(e,this.gameHistoryLists.params.type);
      }
    },
    /**
     * 切换老虎机
     * @param {*} number 0 白银 1黄金 2钻石
     */
    switch_slots(number) {
      // 数字滚轮不是停止状态或者当前有弹窗提示的时候不允许切换
      if (number > 3 || this.tiger_status != 'stop' || this.activityTips.status) return
      this.currentSlotIndex = number;
      if (_.get(this.currentSlotData[this.currentSlotIndex], 'beforeGameResult')) {
        this.initNums = _.get(this.currentSlotData[this.currentSlotIndex], 'beforeGameResult.slotResult')
      } else {
        this.initNums = [10, 10, 10, 10];
      }
      this.init()
    },
    /**
     * 重置按钮
     */
    resetSlot() {
      // 如果当前没有道具则不允许重置  或者当前正在显示弹窗提示，不允许点击
      if (!_.get(this.currentSlotData[this.currentSlotIndex], 'beforeGameResult.propName') || this.activityTips.status) {return}
      this.runResetSlotAnim = true;
      let timer = setTimeout(() => {
        this.runResetSlotAnim = false;
        clearTimeout(timer)
      }, 800);
      api_activity.get_activity_slot_resetprop({slotId: this.currentSlotData[this.currentSlotIndex].slotId}).then(res => {
        let {code, data} = {...res}
        if (code == 200) {
          // 新的道具名字
          this.currentSlotData[this.currentSlotIndex].beforeGameResult.propName = data.propName;
          // 新的金额
          this.beforeGameResult.reward = this.format_float(Number(data.reward) / 100)
          // 道具栏动画
          this.caijin_transfer = true
          setTimeout(() => {
            this.caijin_transfer = false
          }, 3000);
          // 重置成功后更新奖券
          this.get_activity_slot_config()
        } else if(['0410505'].includes(code)) { // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
          this.$emit('to_maintenance')
          return
        } else {
          this.$toast(res.msg, 1500)
        }
      }).catch(err => {
        console.error(err)
        this.$toast(err, 1500)
      })
    },
    /**
     * 开始滚动/确认领取
     * @param {*} type start 开始滚动 confirm 确认领取
     */
    start(type) {
      // 老虎机未初始化或者当前有弹窗提示，不允许触发
      if(!this.is_init || this.activityTips.status || this.tiger_status != 'stop'){
        return
      }
      // 按钮动画
      this.runStartAnim = true;
      let timer = setTimeout(() => {
        this.runStartAnim = false;
        clearTimeout(timer)
      }, 500);
      let api_;
      if (type == 'start') {
        // 是否提示 尚有奖励未领取，不可滚动,阻止摇杆操作
        if(_.get(this.currentSlotData[this.currentSlotIndex], 'gameTimes') == 0){
          // 抽奖数量不足时
          return;
        } else if(_.get(this.currentSlotData[this.currentSlotIndex], 'tokenNum') < _.get(this.currentSlotData[this.currentSlotIndex], 'lotteryNum')){
          // 奖券数不够抽奖一次时
          return;
        } else if(Object.keys(this.beforeGameResult).length != 0){
          // 有奖励未领取的场景
          this.$toast("尚有奖励未领取，不可滚动");
          return;
        }
        this.$refs.audioStart.play();
        // 摇杆动画按钮延迟0.5s
        setTimeout(() => {
          let rocker = setInterval(() => {
            this.rocker_anim_index += 1;
            if (this.rocker_anim_index > 8) {
              clearInterval(rocker)
              this.rocker_anim_index = 1;
            }
          }, 15);
          this.$refs.afterAudioStart.play()
        }, 500);

        // 滚轮开始滚动
        if (this.tiger_status == 'stop') {
          this.tiger_status = 'runing'
        }
        api_ = api_activity.get_activity_slot_spin({slotId: this.currentSlotData[this.currentSlotIndex].slotId})
      } else {
        api_ = api_activity.get_activity_slot_get_award({slotId: this.currentAwardSlotId})
      }
      api_.then(res => {
        let {code, data} = {...res}
        if (code == 200) {
          if (type == 'start') {
            // 抽奖成功后处理动画
            this.slot_spin_end()
            // 获取抽奖结果,停止老虎机滚动
            if (_.get(data, 'slotResult.length')) {
              data.slotResult.forEach(item => {
                if (item == 0) {
                  item == 10;
                }
              })
              this.slotCurrentResult = data;
              this.stopping(data.slotResult);
            }
          } else {
            this.beforeGameResult = {};
            this.notStart = true;
            this.$toast('领取彩金成功', 1500)
            this.initNums = [10, 10, 10, 10];
            // 初始化一下动效
            this.init()
            this.get_activity_slot_config()
          }
        } else if(['0410505'].includes(code)) { // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
          this.$emit('to_maintenance')
          return
        } else {
          this.$refs.number_scroll.force_stop()
          this.$toast(res.msg, 1500)
          this.get_activity_slot_config()
        }
      }).catch(err => {
        console.error(err)
        this.$refs.number_scroll.force_stop()
        this.$toast("服务无响应，请稍后再试", 1500)
      })
    },
    /**
     * 已收到返回结果，开始减速滚动
     */
    stopping(result = [10, 10, 10, 10]){
      // 运行状态才能停止老虎机
      if(this.tiger_status == 'runing'){
        // 抽奖结果
        this.tiger_result = result
        this.tiger_status = 'stopping'
      }
    },
    /**
     * 滚轮完全停止
     */
    stop(){
      this.tiger_status = 'stop'
      // 抽奖成功后展示领取按钮
      this.notStart = false;
      // 抽奖金额
      if (this.beforeGameResult.reward) {
        this.beforeGameResult.reward = this.format_float(Number(this.slotCurrentResult.reward) / 100)
      }
      // 道具名字
      if (!this.currentSlotData[this.currentSlotIndex].beforeGameResult) {
        this.currentSlotData[this.currentSlotIndex].beforeGameResult = {propName: this.slotCurrentResult.propName}
      } else {
        this.currentSlotData[this.currentSlotIndex].beforeGameResult['propName'] = this.slotCurrentResult.propName;
      }
      // 道具栏动画
      this.caijin_transfer = true
      setTimeout(() => {
        this.caijin_transfer = false
      }, 3000);

      this.get_activity_slot_config(1)
    },
    /**
     *
     * @param {*} num 要格式化的数字
     */
    format_float(num) {
      if (!num) {return}
      let reg = /\./;
      let str = String(num);
      if (reg.test(str)) {
        if (str.substring(str.indexOf('.')).length < 3) {
          return str + '0';
        } else {
          return str.substring(0, str.indexOf('.') + 2)
        }
      } else {
        return num + '.00'
      }
    },
    /**
     * 抽奖成功后的动画处理
     */
    slot_spin_end() {
      // 从亮到暗的次数
      let count1 = 1;
      clearInterval(this.triangle_run_interval_timer)
      // 三角形闪动
      this.triangle_fade_timer = setInterval(() => {
        this.triangle_fade += 1;
        if (this.triangle_fade > 7) {
          count1 += 1;
          this.triangle_fade = 1;
          if (count1 > 10) {
            clearInterval(this.triangle_fade_timer)
          }
        }
      }, 30);
      // 跑马灯从跑动变为三色灯光闪动
      // 停止跑动动效
      Object.keys(this.lights_run_timer).forEach(item => clearInterval(this.lights_run_timer[item]))
      this.spin_success = true;
    },
    /**
     * 获取服务器时间的年月日时分秒
     */
    utc_to_gmt_no_8_ms2_(value) {
      if (!value) { return '' }
      let time = format_time_zone_time(parseInt(value));
      let [y, m, d, h, mm, s] = this.format_date_base(time)
      return {y, m, d, h, mm, s}
    },
    /***
     * 关闭弹窗
     */
    closeActivityTips() {
      this.activityTips = {
        status: false,
        msg: ""
      }
      if (this.isFirstTime) {
        this.isFirstTime = false;
        this.get_activity_slot_config()
      }
    },
    /**
     * 阻止页面滚动
     * @param {*} e 事件对象
     */
    handleTouch(e) {
      let evt = e || window.event;
      // 弹窗显示的时候不允许滚动页面
      if (this.activityTips.status) {
        evt.preventDefault()
        evt.stopPropagation();
      }
    },

    /**
     * 页面是否处于后台运行
     */
    isHidden() {
      // 页面在后台运行时关掉音效
      if (document.visibilityState == 'hidden') {
        this.$refs.slot_bg_loop.pause()
        this.$refs.audioStart.pause()
        this.$refs.afterAudioStart.pause()
        this.$refs.showCard.pause()
      } else {
        this.$refs.slot_bg_loop.load()
        this.$refs.audioStart.load()
        this.$refs.afterAudioStart.load()
        this.$refs.showCard.load()
      }
    },
    /**
     * 批量清除定时器
     */
    clear_timer() {
      // timeout定时器列表
      const timeout_timer_arr = [
        'timer1',
        'timer2',
      ]

      // 批量清除timeout定时器
      for (const timer of timeout_timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
      }

      // interval定时器列表
      const interval_timer_arr = [
        'triangle_run_interval_timer',
        'triangle_fade_timer',
        'morningTimer',
      ]

      // 批量清除interval定时器
      for (const timer of interval_timer_arr) {
        clearInterval(this[timer])
        this[timer] = null
      }

      // 跑马灯定时器清除
      Object.keys(this.lights_run_timer).forEach(item => {
        clearInterval(this.lights_run_timer[item])
        this.lights_run_timer[item] = null
      })
    }
  },
 
  beforeUnmount() {
    this.clear_timer()
    this.debounce_throttle_cancel(this.resetSlot)
    this.debounce_throttle_cancel(this.start)
    document.removeEventListener('visibilitychange', this.isHidden)
  }
}
 
