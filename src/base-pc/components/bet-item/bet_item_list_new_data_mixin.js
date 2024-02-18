/*
 * @Author: Cable
 * @Date: 2021-08-04 17:14:23
 * @Description: 赛列表列投注项
 */
import BetData from "src/core/bet/class/bet-data-class.js";
import SetData from "src/core/bet/bet-data-ctr-class.js";
import MenuData from "src/core/menu-pc/menu-data-class.js";
// import store from "project/activity/store";

const bet_item = {
  inject:['match_list_data'], //子组件inject 接收数据
  props: {
    // 投注项数据  col.ols数据源
    ol_data:Object
  },

  data() {
    return {
      // 菜单数据
      menu_data: MenuData,
      // 赔率值
      match_odds: "",
      // 盘口状态 active:选中 lock:锁盘 seal:封盘 close:关盘
      odds_state: "",
      // 赔率升降 up:上升 down:下降
      odds_lift: "",
      // 是否红升绿降中
      odds_lift_show: false,
      timer_obj:{}, //定时器
      bet_tpl:'',
      is_mounted:false
    };
  },
  computed: {
    //玩法比分
    score() {
      let score = '';
      let {_hpid: hpid,ot = "",on} = this.ol_data
      // 比分玩法的显示
      if([7,20,74,341,342].includes(+hpid) && !_.isEmpty(ot)) {
        if(ot.includes(':')) {
          score = ot.replace(':', '-');
        } else if(_.toLower(ot) == 'other') {
          score = on
        }
      }
      return score
    }
  },
  watch: {
    /**
     * 监听状态变化
     */
    ol_data: {
      handler(cur_data, old_data) {
        if (cur_data) {
          let { _mhs, _hs, os } = cur_data;
          this.odds_state = this.get_odds_state(_mhs, _hs, os);
        }
      },
      deep: true
    },
    // 监听玩法ID变化 取消赔率升降
    'ol_data._hpid'() {
      this.clear_odds_lift()
    },
    // 监听oid 取消赔率升降
    'ol_data.oid'() {
      this.clear_odds_lift()
    },    
    // 监听赔率切换
    vx_get_cur_odd: {
      handler(cur) {
        // 投注项赔率值处理
        let ov = _.get(this.ol_data, "ov");
        let obv = _.get(this.ol_data, "obv");
        this.format_odds(ov, obv);
      },
      immediate: true
    },
    // 监听投注项赔率变化
    'ol_data.ov': {
      handler(cur, old) {
        // 赔率值处理
        this.format_odds(cur, 1);
        if (this.ol_data) {
          let { _mhs, _hs, os } = this.ol_data;
          this.odds_state = this.get_odds_state(_mhs, _hs, os);
        }
        // 红升绿降变化
        this.set_odds_lift(cur, old);
      }
    },
 

 

 
    vx_get_bet_category(new_) {
      if([2,3].includes(new_*1)) {
        BetData.set_is_virtual_bet(true);
      } else {
        BetData.set_is_virtual_bet(false);
      }
      BetData.virtual_bet_clear();
    },
    /**
     * 监听预约投注计算球头字段
     */
    "vx_get_bet_appoint_obj.computed_appoint_ball_head"() {
      return;
      let { _mhs, _hs, os } = this.ol_data;
      this.odds_state = this.get_odds_state(_mhs, _hs, os);
      // 如果为单关
      if(BetData.is_bet_single) {
        // 获取球头是否与盘口相等字段
        let is_head_eq_hadicap = _.get(BetData.bet_appoint_obj, 'is_head_eq_hadicap');
        // 当预约投注的球头与盘口值不相等并且此时投注项处于选中状态则取消选中
        if(!is_head_eq_hadicap && this.odds_state == "active") {
          this.odds_state = "";
        }
      }
    }
  },
  created() {
    // this.score_format()
    // this.DOM_ID_SHOW = window.BUILDIN_CONFIG.DOM_ID_SHOW
    this.DOM_ID_SHOW = _.get(window, 'env.config.DOM_ID_SHOW', false)
  },
  mounted(){
    // 异步设置组件是否挂载完成
    setTimeout(()=>{
      this.is_mounted = true
    })
  },
  methods: {

    /**
     * 取消赔率升降
     */
    clear_odds_lift(){
      nextTick(()=>{
        this.odds_lift = ''
      })
    },
    
    /**
     * 赔率转换
     * @param  {number} ov - 赔率值
     * @param  {number} obv - 断档赔率值
     * @return {undefined} undefined
     */
    format_odds(ov, obv) {
      // 列表取 hsw
      let hsw = this.ol_data._hsw
      let match_odds = this.compute_value_by_cur_odd_type(
        ov ,
       ov._hid,
        hsw,
        this.ol_data.csid
      );
      this.match_odds = this.format_odds_value(match_odds);
    },
    format_odds_value(val) {
      if(val=='' || val == undefined){
        return '';
      }
      val = (val || '0').toString();
      let ret = val;
      if (!this.$is_eports_csid(this.ol_data.csid) && val.includes('.')){
        if (val >= 100) {
          if (val.split('.')[1] == '00') {
            ret = val.split('.')[0];
          } else {
            let len = val.length;
            if(val.indexOf('.0') == (len-2)){
              ret = val.substring(0,len-2);
            } else {
              ret = val;
            }
          }
        } else if (val >= 10) {
          if (val.split('.')[1][1] == '0') {
            ret = val.slice(0,val.length-1);
          } else {
            ret = val;
          }
        }
      }
      return ret;
    },
    /**
     * 设置赔率升降
     * @param  {number} cur - 当前赔率值
     * @param  {number} old - 上次赔率值
     * @return {undefined} undefined
     */
    set_odds_lift(cur, old) {
      let _odds_lift = "";

      if (this.odds_state != "lock" && this.odds_state != "seal" && old && !this.is_odds_seal()) {
        if (cur > old) {
          _odds_lift = "up";
        } else if (cur < old) {
          _odds_lift = "down";
        }

        if (_odds_lift && !this.odds_lift_show) {
          /**清除定时器 */
          if(this.timer_obj['odds_lift']) {
            clearTimeout(this.timer_obj['odds_lift'])
            this.timer_obj['odds_lift'] =null
          }
          this.odds_lift_show = true;
          this.odds_lift = _odds_lift;

          this.timer_obj['odds_lift'] = setTimeout(() => {
            this.odds_lift = "";
            this.odds_lift_show = false;
          }, 3000);
        }
      }
    },

    /**
    * 当赔率对应的欧赔小于1.01时，强制转换成封盘的状态 对盘口加锁
    * @return {boolean}
    */
    is_odds_seal() {
      let ov = _.get(this.ol_data, "ov");
      let obv = _.get(this.ol_data, "obv");
      let _odds =  ov || obv
      return _odds < 101000
    },

    /**
     * @description 获得最新的盘口状态
     * @param  {number} mhs  赛事级 0：开 1：封 2：关 11：锁
     * @param  {number} hs   盘口级 0：开 1：封 2：关 11：锁
     * @param  {number} os  投注项级 1：开 2：封 3：关 4：锁
     * @return {undefined} undefined
     */
    get_odds_state(mhs, hs, os) {
      let _active = this.get_odds_active(mhs, hs, os);
      let id = _.get(this.ol_data, "_hn") || _.get(this.ol_data, "oid");
      let state = ""
      const STATE = {
        // 封盘
        2: "seal",
        // 关盘
        3: "close"
      };
      if (!id) {
        state = "disable";
      } else if (STATE[_active]) {
        state = STATE[_active];
      } else {
        let selected_class;
        if(BetData.is_virtual_bet) {
          selected_class = this.virtual_bet_item_select(id)
        } else {
          selected_class = this.bet_item_select(id)
        }
        state = selected_class ? "active" : "normal";
      }
      // 当赔率对应的欧赔小于1.01时 ！！！！！！！！！！！！！！！！并且当前不在关盘状态，强制转换成封盘的状态 对盘口加锁 
      return (this.is_odds_seal() && _active!==3) ? 'seal' : state
    },

    /**
     * @description 投注项点击
     * @return {undefined} undefined  组装投注项的数据
     */
    set_bet_obj_config() {
      // 新的投注流程确认中时不让点击
      if(!BetData.is_virtual_bet && BetData.bet_mode === 1 && BetData.bet_item_lock) {
        return;
      }
       //显示token失效弹窗
      // setTimeout(() => {
        if (this.show_fail_alert()) {
          return;
        }
        // 封盘状态不让选择
        if (["seal","close","disable"].includes(this.odds_state)) {
          return;
        }
        // 3301758_2_1_Over
        let id = _.get(this.ol_data, "_hn") || _.get(this.ol_data, "oid");
        // mid_3301758
        let match_info = this.match_list_data.mid_obj['mid_'+this.ol_data._mid] || {}
        // hid_141568357160089208
        let hl_obj = this.match_list_data.hl_obj['hid_'+this.ol_data._hid] || {}
        let play_obj;

        // tpl_id=18判断冠军
        if(match_info.tpl_id==18) {
          play_obj = match_info.play_obj['hid_'+this.ol_data._hid]
        }
        // 15分钟玩法
        else if(hl_obj.hSpecial) {
          play_obj = match_info.play_obj[`hpid_${this.ol_data._hpid}_${hl_obj.hSpecial}`]
        }else{
          // hpid_2
          play_obj = match_info.play_obj['hpid_'+this.ol_data._hpid]
          // hids: 1
          // hmm: 1
          // hpid: "2"
          // hpn: "全场大小"
          // hpnb: "全场大小"
          // hpon: 2
          // hpt: 5
          // hshow: "Yes"
          // hsw: "1,2,3,4,5,6"
          // mid: "3301758"
        }
        let {hpn, hpid, hsw, hids} = play_obj;
        let obj = {
          id,
          match_info: match_info,
          mid_obj: match_info,
          hl_obj: {
            ...hl_obj,
            _play:{
              hpn,
              hpid,
              hsw,
              hids
            }
          },
          ol_obj: this.ol_data,
          bet_source: 'match_list',
          row_index: -1
        };
        this.$send_zhuge_event("PC_首页_投注点击分类", {"详情区域": "中间列表"});
        // 判断是否为虚拟体育
        if(BetData.is_virtual_bet) {
          //点击押注按钮操作 (虚拟体育)
          this.virtual_bat_click(obj);
        } else {
          //点击押注按钮操作
          this.bat_click(obj);
        }
    },

  },
  beforeUnmount() {
    /**清除定时器 */
    for (const key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
      this.timer_obj[key] = null;
    }
  }
}

export default bet_item
