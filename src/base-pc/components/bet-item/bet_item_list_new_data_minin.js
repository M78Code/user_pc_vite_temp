//  @Description:红升绿降








// watch(() => [props.ol_data._hpid, props.ol_data.oid], (v, o) => {
//     if (v[0] != o[0] || v[1] != o[1]){ //地址可能会变  但是oid不一定
//       clear_odds_lift()
//     }
//   })
//   // 监听投注项赔率变化
//   watch(() => props.ol_data.ov, (cur, old) => {
//     if (cur == old) return
//     // 红升绿降变化
//     set_odds_lift(cur, old);
//   }, { deep: true })

//   onUnmounted(() => {
//     // 清除定时器
//     clearTimeout(tid)
//   });

/*
 * @Author: Cable
 * @Date: 2021-08-04 17:14:23
 * @Description: 赛列表列投注项
 */

import SetData from "src/core/bet/bet-data-ctr-class.js";
import MenuData from "src/core/menu-pc/menu-data-class.js";
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import lodash from 'lodash'
const bet_item = {
  props : {
    ol_data: {
      type: [Object, Array],
      default: () => {},
    },
    match_data_type: {
      type: String,
      default: () => 'MatchDataWarehouse_PC_List_Common'
    },
  },
  data() {
    return {
    // 盘口状态 active:选中 lock:锁盘 seal:封盘 close:关盘
     odds_state: "",
    // 赔率值
     match_odds: "",
    // 赔率升降 up:上升 down:下降
     odds_lift: "",
    //定时器
        tid:null,
     is_mounted:true
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
  },
  mounted(){
    // 异步设置组件是否挂载完成
    setTimeout(()=>{
      this.is_mounted = true
    })
  },
  methods: {

/**
 * 设置赔率升降
 * @param  {number} cur - 当前赔率值
 * @param  {number} old - 上次赔率值
 * @return {undefined} undefined
 */
 set_odds_lift : (cur, old) => {
    if (!["lock", 'seal'].includes(this.odds_state) && old && !is_odds_seal()
    ) {
      if (cur > old) {
        this.odds_lift = 'up'
      }
      else if (old > cur) {
        this.odds_lift = 'down'
      }
      clearTimeout(tid)
      tid = setTimeout(() => {
        this.odds_lift = "";
      }, 3000);
    }
  },
  

/**
 * 取消赔率升降
 */
 clear_odds_lift : () => {
    clearTimeout(tid)
    this.odds_lift = "";
  },
  
  /**
   * 当赔率对应的欧赔小于1.01时，强制转换成封盘的状态 对盘口加锁
   * @return {boolean}
   */
   is_odds_seal : () => {
    let ov = lodash.get(props.ol_data, "ov");
    let obv = lodash.get(props.ol_data, "obv");
    let _odds = ov || obv;
    return _odds < 101000;
  },
  /**
 * @description 投注项点击
 * @return {undefined} undefined  组装投注项的数据
 */
  bet_click_ol : () => {
    if (!this.ol_data.oid || this.odds_state == "lock" || this.odds_state == "seal") return
    const { oid, _hid, _hn, _mid } = props.ol_data
    let params = {
      oid, // 投注项id ol_obj
      _hid, // hl_obj 
      _hn,  // hn_obj
      _mid,  //赛事id mid_obj
    }
    let other = {
          is_detail: false,
          // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
          // 根据赛事纬度判断当前赛事属于 那种投注类型
          bet_type: 'common_bet',
          // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
          device_type: 2,
          // 数据仓库类型
          match_data_type: props.match_data_type, // h5_detail
          // match_data_type: "h5_list", // h5_detail
      }
    set_bet_obj_config(params, other )
  }
/**
 * @description 投注项点击
 * @return {undefined} undefined  组装投注项的数据
 */
//  const bet_click_ol = () => {
//   if (!props.ol_data.oid || odds_state.value == "lock" || odds_state.value == "seal") return
//   const { oid, _hid, _hn, _mid } = props.ol_data
//   let params = {
//     oid, // 投注项id ol_obj
//     _hid, // hl_obj 
//     _hn,  // hn_obj
//     _mid,  //赛事id mid_obj
//   }
//   let other = {
//         is_detail: false,
        // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
        // 根据赛事纬度判断当前赛事属于 那种投注类型
        // bet_type: 'common_bet',
        // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
        // device_type: 2,
        // 数据仓库类型
        // match_data_type: props.match_data_type, // h5_detail
        // match_data_type: "h5_list", // h5_detail
    // }
  // //点击后再次点击，取消选中状态
  // const current_id = `${_mid}${oid}`;
  // if (props.active_score === current_id) {
  //   emit('update_score', '')
  // } else {
  //   emit('update_score', current_id)
  // }
  // set_bet_obj_config(params, other )
  // BetData.set_bet_state_show(true)
// };
  
// 监听oid 取消赔率升降
// 监听玩法ID变化 取消赔率升降 
// 监听oid 取消赔率升降
// 监听玩法ID变化 取消赔率升降 

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
