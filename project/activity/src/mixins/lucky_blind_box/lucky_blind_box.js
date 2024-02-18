 
/**
 *  get_user.activityList[activityIndex].period  1 未开始  2 进行中   3 已结束
 */
import {api_activity} from "src/api/index.js";
let lh1 =  "activity/yazhou-h5/activity/lucky/lh1.png";
let lh2 =  "activity/yazhou-h5/activity/lucky/lh2.png";
let lh3 =  "activity/yazhou-h5/activity/lucky/lh3.png";
let gift1 =  "activity/yazhou-h5/activity/lucky/gift1.png";
let gift2 =  "activity/yazhou-h5/activity/lucky/gift2.png";
let gift3 =  "activity/yazhou-h5/activity/lucky/gift3.png";

import acticity_mixin from "project/activity/src/mixins/acticity_mixin/acticity_mixin.js";
import common from "project/activity/src/mixins/common/common.js";
import formartmixin from 'project/activity/src/mixins/common/formartmixin.js';
import { GATAG ,format_time_zone_time ,is_time_limit } from "project_path/src/core/index.js"
import { UserCtr } from "project_path/src/core/index.js";


export default {
  name: "lucky_blind_box",
  mixins: [acticity_mixin, common, formartmixin  ],
  props: {
    activityIndex: {
      type: Number  ,
      default: 2
    },
    // 活动开始时间
    inStartTime: {
      type: Number  ,
      default: 0
    },
    // 活动结束时间
    inEndTime: {
      type: Number ,
      default: 0
    },
    isIphoneX: Boolean
  },

  data() {
    return {
      lihe_list: [
        {name: '钻石盲盒', url: lh1},
        {name: '黄金盲盒', url: lh2},
        {name: '白银盲盒', url: lh3},
      ],
      // 当前选中的 礼盒
      lihe_index: -1,
      // 是否可以点击
      count_down_click: 5,
      btn_click: true,
      table_background_color: false,
      animate:false,
      //消息列表对应的数组
      lucky_top_50:[],
      turn_page:0, // 第几页
      // 历史记录分页
      result_page_info:{current: 1, pages: 1},
      // 榜单前50记录分页
      top50_page_info:{current: 1, pages: 1},
      // 历史记录
      history_records: [],
      history_alert: false,
      // 获奖的弹框
      gift_box_alert: false,
      // 礼盒初始状态
      get_Lucky_box: {
        tokenNum: '--',
        dailyLuckyBoxNumber:{diamonds:0, golds:0, silvers:0},
        timeRemaining:[]
      },
      prizes:{
        1:[],
        2:[],
        3:[]
      },
      lihe_name: {
        name: '白银盲盒',
        num_ber: '--', // 当前还剩下多少个礼盒
        box_type: 2,// 礼盒的类型
        Number_tokens_consumed: 12, // 拆礼盒消耗的奖券数量
      },
      // 中奖弹框的金额
      amount_of_winning: 0,
      gift_img: { gift1, gift2, gift3},
      // 当前时间，只要是 凌晨00:00:00 就刷新当前的初始化数据
      current_time: '',
      next_time: 0,
      lottery_loading: false,
      nextTimeToRelease: null, // 下一次派发盲盒的时间
      nextOpenTime: {
        h: 0,
        m: 0,
        s: 0
      },
      
    }
  },
  computed: {
    get_user() {
        return UserCtr.get_user();
    },
    get_theme() {
        return UserCtr.theme;
    },
    // 展示哪张背景图
    blind_box_url() {
      if (this.lihe_name.box_type == 3){
        return this.gift_img.gift1
      }else if (this.lihe_name.box_type == 2){
        return this.gift_img.gift2
      }else{
        return this.gift_img.gift3
      }
    },
    // 判断展示哪一个倒计时
    show_nextbox_countdown() {
      // 如果是有配置 盲盒距离下次派发时间的话，就显示
      if(this.get_Lucky_box.timeRemaining.length > 0 && this.get_Lucky_box.timeRemaining[this.lihe_name.box_type - 1].showRate > 0){
        this.next_time = (+new Date().getTime() + +this.get_Lucky_box.timeRemaining[this.lihe_name.box_type - 1].showRate)
        return true
      }else{
        return false
      }
    }
  },
  created() {
    // 延时器
    this.timer1_btn = 0;
    this.up_date_Info = 0;

    // 首次加载 盲盒数量 接口
    this.get_Lucky_box_init('first')
    // 榜单前50名统计 接口
    this.get_activity_lucky_box_top50()
    // 箭头00：00：00 点整时，调用初始化方法
    this.listen_for_time()

    // 获取服务器时间-----初始化倒计时
    let stime = this.get_now_server();
    let now = this.utc_to_gmt_no_8_ms2_(stime);
    // 判断倒计时是到中午12点还是晚上12点
    const curHours = now.h;
    this.nextTimeToRelease = new Date(new Date(`${now.y}-${now.m}-${now.d} ${now.h}:${now.mm}:${now.s}`).getTime()+(curHours <= 11 ? 12*60*60*1000-1 : (23 - curHours + 12)*60*60*1000-1)).getTime();
  },
  methods: {
    // 数据页变化
    data_page_changed($event){
      this.expand_history($event)
    },
    // 数据页变化
    top50_page_changed($event){
      this.turn_page = ($event - 1) * 5
    },
    // 箭头00：00：00 点整时，调用初始化方法
    listen_for_time() {
      this.up_date_Info = setInterval(() => {
        this.current_time = new Date().Format('hh:mm:ss')
        if(this.current_time == '12:00:00'){
          this.get_Lucky_box_init('first')
          clearInterval(this.up_date_Info);
        }
      }, 1000);
    },
    // 礼盒切换数量变更
    switch_method(i) {
      // diamonds 钻石盲盒 golds 黄金盲盒 silvers 白银盲盒
      if(i == 0){
        this.lihe_name.num_ber = this.get_Lucky_box.dailyLuckyBoxNumber.diamonds
        this.lihe_name.box_type = 3
        this.lihe_name.Number_tokens_consumed = this.get_Lucky_box.boxToken[2]
      }else if(i ==1){
        this.lihe_name.num_ber = this.get_Lucky_box.dailyLuckyBoxNumber.golds
        this.lihe_name.box_type = 2
        this.lihe_name.Number_tokens_consumed = this.get_Lucky_box.boxToken[1]
      }else if(i ==2){
        this.lihe_name.num_ber = this.get_Lucky_box.dailyLuckyBoxNumber.silvers
        this.lihe_name.box_type = 1
        this.lihe_name.Number_tokens_consumed = this.get_Lucky_box.boxToken[0]
      }
      // // 获取服务器时间
      let stime = this.get_now_server();
      let now = this.utc_to_gmt_no_8_ms2_(stime);
      // 判断倒计时是到中午12点还是晚上12点
      const curHours = now.h;
      this.nextTimeToRelease = new Date(new Date(`${now.y}-${now.m}-${now.d} ${now.h}:${now.mm}:${now.s}`).getTime()+(curHours <= 11 ? 12*60*60*1000-1 : (23 - curHours + 12)*60*60*1000-1)).getTime();
      this.$forceUpdate()
    },
    // 点击礼盒切换
    lihe_list_click(item, i, frequent_clicks){
      if(is_time_limit() || (this.lihe_index == i && frequent_clicks)) return //  防止调用多次接口
      this.lihe_index = i
      this.lihe_name.name = item.name
      if(!this.get_Lucky_box) return
      this.switch_method(i)
      this.get_Lucky_box_init()
    },
    // 初始化数据获取奖券
    async get_Lucky_box_init(Unboxing) {
      try {
        // diamonds 钻石盲盒 golds 黄金盲盒 silvers 白银盲盒
        let {code , data} = await api_activity.get_activity_lucky_box_info({userId: this.get_user.userId})
        if(code == 200 && Object.keys(data).length > 0) {
          // 处理下个盲盒的剩下时间
          let blind_box_time = []
          data.timeRemaining.forEach( (item,i)=> {
            if(item.boxType == 1){
              blind_box_time[0] = item
            }else if(item.boxType == 2) {
              blind_box_time[1] = item
            }else if(item.boxType == 3) {
              blind_box_time[2] = item
            }
          })
          data.timeRemaining = blind_box_time
          this.get_Lucky_box = data
          this.switch_method(this.lihe_index)
          // 如果是刚刚进页面时，首次加载
          if(Unboxing == 'first'){
            // 首次加载展示 盲盒奖品的数据
            this.prizes = {1:[], 2:[], 3:[]}
            data.lucky.forEach((item, i)=>{
              item.award = parseInt(item.award/100)
              if(item.boxType == 3) {
                this.prizes[1].push(item)
              }else if(item.boxType == 2) {
                this.prizes[2].push(item)
              }else if(item.boxType == 1) {
                this.prizes[3].push(item)
              }
            })
            // 首次加载显示哪个盲盒的 处理
            if(data.tokenNum >=this.get_Lucky_box.boxToken[2]){
              this.lihe_list_click(this.lihe_list[0],0)
            }else if(data.tokenNum>=this.get_Lucky_box.boxToken[1] && data.tokenNum<this.get_Lucky_box.boxToken[2]){
              this.lihe_list_click(this.lihe_list[1],1)
            }else{
              this.lihe_list_click(this.lihe_list[2],2)
            }
          }
        }
        else if ( ['0401038'].includes(code) ){
          const msg_nodata_22 = i18n_t('msg.msg_nodata_22')
          this.$toast(msg_nodata_22, 1500)
        }
      } catch (err) {
        console.error(err);
      }
    },
    // 拆礼盒，调用礼盒接口
    async Unpack_gift_box() {
      if(this.btn_click){
        if(this.get_user.activityList[this.activityIndex].period == 3) return this.$toast('活动已结束', 1000)
        if(this.lihe_name.num_ber <= 0) return this.$toast('盲盒已被抢完', 1000)
        if(this.get_Lucky_box.tokenNum < this.lihe_name.Number_tokens_consumed) {this.gift_box_alert = false; return this.$toast('奖券不足', 1000)}
        if(is_time_limit() || this.lottery_loading) return //  防止调用多次接口
        try {
          this.lottery_loading = true
          // boxType	盲盒类型，1：白银盲盒  2：黄金盲盒  3：钻石盲盒
          let {code , data, msg} = await api_activity.get_activity_open_lucky_box({boxType: this.lihe_name.box_type})
          if(code == 200 && Object.keys(data).length > 0) {
            // costTokenNum 消耗奖券数
            this.amount_of_winning = data.award
            this.gift_box_alert = true
            this.get_Lucky_box_init()
            .gtag_event_send('H5_luckybox_getAwardClick', 'H5_活动', 'H5_幸运盲盒', parseInt(data.award))
          } else if(['0410505'].includes(code)) { // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
            this.$emit('to_maintenance')
            return
          }else {
            this.$toast(msg, 1500)
            this.gift_box_alert = false
            this.get_Lucky_box_init()
          }
          this.lottery_loading = false
          this.btn_click = false
          this.timer1_btn = setInterval( () => {
            this.count_down_click--
            if(this.count_down_click == '-1'){
              this.count_down_click = 5
              this.btn_click = true
              clearInterval(this.timer1_btn)
            }
          }, 1000)
        } catch (err) {
          console.error(err);
          this.lottery_loading = false
          if (err.type == "openbox_cencel") {
            this.$toast(err.message, 1500)
          }else if(err.type == 'activity_page_unmounted'){
          } else {
            this.$toast("网络异常，请重新抽取", 1500)
          }
        }
      }else{
        return this.$toast('操作过于频繁，请稍后再试', 2000)
      }
    },
    // 历史记录接口
    async expand_history( cpn_number ) {
      //  防止调用多次接口
      if(is_time_limit()) return
      try {
        // 服务器时间
        // 查询最近90天的历史记录
        let stime = this.get_now_server();
        let nineDaysAgo = new Date(stime - 1000 * 60 * 60 * 24 * 90);
        nineDaysAgo = new Date(`${nineDaysAgo.getFullYear()}-${nineDaysAgo.getMonth() + 1}-${nineDaysAgo.getDate()}`);
        let parameter = {
          userId: this.get_user.userId,
          cps: 7,
          cpn: cpn_number,
          inEndTime: this.inEndTime ? this.inEndTime : null,
          activityId: this.get_user.activityList[this.activityIndex].activityId,
          inStartTime: nineDaysAgo.getTime()
        }
        let {code , data} = await api_activity.get_activity_lucky_box_history(parameter)
        if(code == 200 && data.records.length > 0) {
          this.history_records = data.records
          // this.$set(this.result_page_info, 'pages' , +data.total )
          this.history_alert = true
        }else if ( ['0401038'].includes(code) ){
          const msg_nodata_22 = i18n_t('msg.msg_nodata_22')
          this.$toast(msg_nodata_22, 1500)
        }
        else{
          this.$toast('暂无历史记录数据', 1500)
        }
      } catch (err) {
        console.error(err);
      }
    },
    // 排行榜前五十
    async get_activity_lucky_box_top50() {
      try {
        let parameter = {
          from: 'activity_task',
          inStartTime: this.inStartTime ? this.inStartTime : null,
          inEndTime: (this.get_user.activityList[this.activityIndex].period != 3 && this.inEndTime) ? this.inEndTime : null,
          activityId: this.get_user.activityList[this.activityIndex].activityId
        }
        let {code , data} = await api_activity.get_activity_lucky_box_top50(parameter)
        if(code == 200 && Object.keys(data).length > 0) {
          this.lucky_top_50 = data
          // this.$set(this.top50_page_info, 'pages' , +data.length )
        }
      } catch (err) {
        console.error(err);
      }
    },
    /**
     * 获取服务器时间的年月日时分秒
     */
    utc_to_gmt_no_8_ms2_(value) {
      if (!value) { return '' }
      let time =  format_time_zone_time(parseInt(value));
      let [y, m, d, h, mm, s] = this.format_date_base(time)
      return {y, m, d, h, mm, s}
    }
  },
  unmounted() {
    clearInterval(this.up_date_Info);
    this.up_date_Info = null;

    clearInterval(this.timer1_btn);
    this.timer1_btn = null;

    for (const key in this.$data) {
      this.$data[key] = null
    }
    // 抽奖的过程中取消上一次请求
    window.vue.blind_box_lottery_cancel && window.vue.blind_box_lottery_cancel()
  }
}
 
