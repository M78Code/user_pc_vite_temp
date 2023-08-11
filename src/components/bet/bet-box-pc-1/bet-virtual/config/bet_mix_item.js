/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注项组件minxin
 */
import { mapGetters, mapActions } from "vuex";
import betting from "src/public/mixins/betting/betting2.js";
import play_mapping from "src/public/config/mapping/play_mapping.js";
import time_format from "src/public/mixins/common/time_format";
export default {
  name: "bet-mix-item",
  mixins: [betting,time_format],
  data() {
    return {
      //赛事栏目
      odds_change_up: false, // 赔率上升
      odds_change_down: false, // 赔率下降
      handicap_change: false, //盘口是否变化
      odds_status_change: false,
      mouseover_info: false,
      tn: '', // 联赛名称
      play_id: '',
      sport_id: '', //球种id
      play_name: '', // 玩法名称
      team_name: '', // 投注项名称
      season: '', // 联赛赛季名称
      no: '', //赛马=批次号+期 足球=第N轮
      batch_no: '', // 批次
      play_mapping: {},
      remote_time: 0, // 服务器时间
      mgt: 0, // 开赛时间
      match_update: false,
      type_name: '',
      timer_obj: {},
      home: '',
      away: ''
    };
  },
  created() {
    //  菜单类型
    this.type_name = _.get(this.vx_cur_menu_type,'type_name', '');  
    this.$root.$on(this.emit_cmd.EMIT_BET_MIX_ITEM_RESET_CMD, this.bet_mix_reset);
    this.$root.$on(this.emit_cmd.EMIT_UPDATE_HOME_AWAY_CMD, this.update_home_away);
    // 玩法id
    this.play_id = this.virtual_common.get_play_id(this);
    // 球种id
    this.sport_id = this.virtual_common.get_sport_id(this);
    // 映射
    this.play_mapping = play_mapping;
    this.update_home_away();
    if(this.match_update) {
      let self = this;
      clearTimeout(this.timer_obj[`created_${this.id}`]);
      this.timer_obj[`created_${this.id}`] = setTimeout(() => {
        self.match_update = false;
        let obj = _.cloneDeep(self.vx_get_virtual_bet_obj);
        obj.match_update = self.match_update;
        self.vx_virtual_bet_obj_add(obj);
      }, 3000);
    }
    // 虚拟体育设置
    if(this.type_name=='virtual_sport') {
      this.remote_time = this.mx_get_remote_time();
      this.mgt = _.get(this.vx_get_virtual_bet_obj,`${this.id}.bs.mgt`); 
      if (Number(this.mgt) < this.remote_time) {
        let mid = _.get(this.vx_get_virtual_bet_obj,`${this.id}.bs.mid`); 
        // 投注栏 投注项失效
        this.virtual_common.update_bet_item_status(this, {
          mid,
          status: 1,
        });
      } else {
        // 开启定时器
        this.start_time();
      }
    }
  },
  destroyed() {
    // 清除定时器
    for (const key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
    // 清除定时器对象
    this.timer_obj = {};
    this.$root.$off(this.emit_cmd.EMIT_BET_MIX_ITEM_RESET_CMD, this.bet_mix_reset);
    this.$root.$off(this.emit_cmd.EMIT_UPDATE_HOME_AWAY_CMD, this.update_home_away);
  },
  props: {
    // 视图控制对象
    view_ctr_obj: {
      type: Object,
      default: {}
    },
    // 投注项id
    id: {
      type: String | Object,
      default: () => {
        return "0"
      }
    },
    // 是否关闭
    is_close: {
      type: Boolean,
      default: true
    },
    // 投注项对象
    item_obj: {
      type: [Object, String],
      default: () => { }
    }
  },
  computed: {
    ...mapGetters({
      //虚拟体育投注列表
      vx_get_virtual_bet_list: "get_virtual_bet_list",
      // 虚拟体育投注对象
      vx_get_virtual_bet_obj: "get_virtual_bet_obj",
      // 当前菜单类型
      vx_cur_menu_type: "get_cur_menu_type",
      // 当前盘口
      vx_get_cur_odd: "get_cur_odd",
      // 当前语言
      vx_get_lang_change: "get_lang_change"
    }),
    /**
     * @description: 盘口和赔率是否一起变化
     * @param {undefined} undefined
     * @return {String}
     */
    hv_ov_change() {
      return this.virtual_common.get_hv_ov_change(this);
    },
    /**
     * @description: 赔率值
     * @param {undefined} undefined
     * @return {String} 赔率值
     */
    odds_value() {
      return this.virtual_common.get_odds_value(this);
    },
    /**
     * @description: 盘口id
     */
    handicap_id() {
      return this.virtual_common.get_handicap_id(this);
    },
    /**
     * @description: 盘口值
     * @param {undefined} undefined
     * @return {String} 盘口值
     */
    handicap() {
      return this.virtual_common.get_handicap(this);
    },
    /**
     * @description: 盘口名称
     * @param {*}
     * @return 对应的盘口名称信息
     */
    handicap_name() {
      let hsw = _.get(this.vx_get_virtual_bet_obj,`${this.id}.bs.hps[0].hsw`);
      // 盘口名称和盘口值映射
      if(hsw) {
        let odds_table = {
          EU: '1',
          HK: '2',
          MY: '3',
          GB: '4',
          US: '5',
          ID: '6'
        }
        // 盘口名称值存在
        if(hsw.includes(odds_table[this.vx_get_cur_odd])) {
          // 盘口类型
          return `[${this.$root.$t('odds')[this.vx_get_cur_odd]}]`;
        }
      }
      // 欧洲盘
      return `[${this.$root.$t('odds')['EU']}]`;
    },
    /**
     * @description: 是否有盘口值
     */
    has_handicap_value() {
      // 当前投注项对象
      let bet_obj = this.vx_get_virtual_bet_obj[this.id];
      if(bet_obj) {
        // 盘口值是否为空
        return _.trim(_.get(bet_obj, 'cs.handicap_value')) !== '';
      }
      return false;
    },
    /**
     * @description: 投注项状态
     * @param {undefined} undefined
     * @return {String} 投注项状态
     */
    active() {
      return this.virtual_common.get_active(this);;
    },
    /**
     * @description: tips icon的id
     */
    icon_id() {
      let icon_id_ = '';
      if(this.id && this.id.includes(':')) {
        icon_id_ = this.id.replace(/:/g, '_');
      } else {
        icon_id_ = this.id;
      }
      return icon_id_;
    },
    /**
     * serial: 0:不能进行串关 1:普通串关 2: 局内串关
     * @returns 
     */
    serial_type() {
      if($menu.menu_data.is_esports) {
        let serial_type_ = _.get(this.vx_get_virtual_bet_obj, `${this.id}.cs.serial_type`, 1);
        let len = _.get(this.vx_get_virtual_bet_list, 'length', 0);
        if(len>1 && serial_type_==0) {
          return serial_type_;
        }
       }      
      return 1;
    },
    /**
     * @description: 是否可以进行串关
     */
    is_serial() {
      let is_serial_ = this.virtual_common.get_serial(this);
      if(!is_serial_) {
        this.view_ctr_obj.error_code = "0400477";
        this.view_ctr_obj.error_message = this.$root.$t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg2;
      }
      return is_serial_;
    },
    bet_item_count() {
      return this.vx_get_virtual_bet_list.length || 0;
    }
  },
  watch: {
    /**
     * @description: 监控赔率是否切换(欧洲盘是否切换成其他盘)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    vx_get_cur_odd() {
      this.is_change_odds = true;
    },
    /**
     * @description: 监控当前赔率
     * @param {new_} 当前赔率
     * @param {old_} 上次的赔率
     * @return {undefined} undefined
     */
    odds_value(new_, old_) {
      if (!this.is_change_odds) {
        this.change_odds_value(new_, old_);
        if(this.view_ctr_obj.is_submit_result) return;
        this.view_ctr_obj.bet_data_change = true;
        let count = this.virtual_common.get_deactive_count(this); 
        if(count == 0 && !this.hv_ov_change){
          this.view_ctr_obj.error_code = "0402027"; // 表示赔率变更了
        }
        this.set_message(count);
        // console.log(`====odds_value===========22222=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);   
        // 重新计算最高可赢额
        this.$root.$emit(this.emit_cmd.EMIT_MAX_WIN_MONEY_CMD);
        // console.log(`====odds_value===========33333=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
      }   
    },
    /**
     * @description: 监控盘口id变化
     */
    handicap_id() {
      // 发送C2订阅
      this.$root.$emit(this.emit_cmd.EMIT_SCMD_C2_CMD);
      if(this.vx_get_virtual_bet_list.length>1) {
        // 获取最大最小值
        this.$root.$emit(this.emit_cmd.EMIT_MIN_MAX_MONEY_CMD);
      }    
      this.old_hv = null;
      this.new_hv = null;  
    },
    /**
     * @description: 监控盘口值变化
     * @param {String} new_ 最新的盘口值
     * @return {undefined} undefined
     */
    handicap(new_, old_) {
      this.old_hv = old_;
      this.new_hv = new_;
      if(!isNaN(Number(new_)) && new_!=old_) {
        this.handicap_change = true;
        if(this.view_ctr_obj.is_submit_result) return; 
        this.view_ctr_obj.bet_data_change = true;
        //console.log(`=====================11111======================handicap================`);
        let count = this.virtual_common.get_deactive_count(this); 
        if(count==0 && !this.hv_ov_change) {
          this.view_ctr_obj.error_code = "0402010"; //您所选投注项的盘口值已经产生变化
        }
        // 同步赛事列表,赛事详情中的数据(主要针对投注时,后台before接口拿到新数据后同步)        
        this.set_message(count);
        // console.log(`====handicap===========22222=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
      }
    },
    /**
     * @description: 监听投注项状态
     * @param {String} new_ 最新的注项状态
     * @return {undefined} undefined
     */
    active: {
      handler(new_){        
        let is_effect;
        if (new_ == 1 || new_ == 4) {
          is_effect = true;        
        } else {
          is_effect = false;
        } 
  
        let bet_obj = this.vx_get_virtual_bet_obj[this.id]; 
        let obj = _.cloneDeep(bet_obj);
        if(obj && obj.cs) {
          obj.cs.effect = is_effect;
          this.virtual_common.set_bet_obj_value(this, obj);
        }
  
        if(new_==1) { 
          //let check_result = false;
          clearTimeout(this.timer_obj[`timer_${this.id}`]);
          // 初始化提示信息
          this.virtual_common.init_message(this);
          // 赔率上升设置为false          
          this.odds_change_up = false;
          // 赔率下降设置为false
          this.odds_change_down = false;
          // 盘口变化设置为false
          this.handicap_change = false;
          // 赔率数据变化设置为true
          this.view_ctr_obj.bet_data_change = true;
        } else { 
          // console.log(`====active===========11111=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
          this.odds_status_change = true; 
          if(this.view_ctr_obj.is_submit_result) return; 
          this.view_ctr_obj.bet_data_change = true;
          let count = this.virtual_common.get_deactive_count(this);
          if(new_ == 4 && count==0) {
            this.view_ctr_obj.error_code = "M400004";
          }          
          // console.log(`============active=========count:${count}`);
          this.set_message(count);
          // console.log(`====active===========22222=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
        } 
      },
      immediate:true           
    },
    /**
     * @description: 监听盘口和赔率是否一起变化
     * @param {String} new_ 最新的变化标志
     * @return {undefined} undefined
     */
    hv_ov_change(new_) {
      if(new_) {
        this.view_ctr_obj.bet_data_change = true;
        this.handicap_change = true;
        let count = this.virtual_common.get_deactive_count(this);
        if(count==0) {
          this.view_ctr_obj.error_code = "0402028";
        }
        /* if(!this.odds_change_up && !this.odds_change_down && this.new_hv && this.old_hv) {
          if(this.new_hv > this.old_hv) {
            this.odds_change_up = true;
          } else if (this.new_hv < this.old_hv) {            
            this.odds_change_down = true;
          }
        } */       
        this.set_message(count);
      }
    },
    /**
     * @description: 当前错误码
     * @param {String} new_ 错误码
     * @return {undefined} undefined
     */
    "view_ctr_obj.error_code"(new_) {
      if (new_ && new_.startsWith('M') || new_=="") {
        this.odds_change_up = false; // 赔率上升
        this.odds_change_down = false; // 赔率下降
        this.handicap_change = false;
      }
    },
    /**
     * 语言变化时
     */
    vx_get_lang_change() {
      // 获取联赛名称
      this.season = this.virtual_common.get_season(this);
      // 获取玩法名称
      this.play_name = this.virtual_common.get_play_name(this);
      // 获取投注项名称
      this.team_name = this.virtual_common.get_team_name(this);
      // 获取期号
      this.no = this.virtual_common.get_no(this);
      // 获取批次号
      this.batch_no = this.virtual_common.get_batch_no(this);
    },
    /**
     * 串关类型发生变化
     */
    serial_type: {
      handler(new_) {
        let index = _.findIndex(this.vx_get_virtual_bet_list, (item)=> {
          let  type = _.get(this.vx_get_virtual_bet_obj,`${item}.cs.serial_type`, 1) * 1;
          return type !== 1;
        });
        if((new_==0) || (index > -1)) {
          this.view_ctr_obj.error_code = "M400014";
          this.set_message();
        }
      },
      immediate: true
    } 
  },
  methods: {
    ...mapActions({
      vx_virtual_bet_obj_del: "virtual_bet_obj_del",
      vx_virtual_bet_list_del: "virtual_bet_list_del",
    }),
    /**
     * @description: 删除投注项
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    del_bet_item() {
      if(this.id=="" || this.id==undefined) {        
        let index = _.findIndex(this.vx_get_virtual_bet_list,item => item==this.id);
        if(index>-1) {
          //移除对应的键值对
          this.vx_virtual_bet_obj_del(this.id);
          //移除对应的数据
          this.vx_virtual_bet_list_del(index);
        }
      } else {
        this.virtual_common.del_bet_item(this);
      }     
      if(this.vx_get_virtual_bet_list.length==0) {
        clearTimeout(this.timer_obj[`timer_${this.id}`]);
        // this.$root.$emit(this.emit_cmd.EMIT_MIX_INIT_VIEW_CMD,true);
      }      
    },
    /**
     * @description:赔率变化时设置标志
     * @param {Number} new_ 当前赔率
     * @param {Number} old_ 上次赔率
     * @return {undefined} undefined
     */
    change_odds_value(new_, old_) {
      if (new_ > old_) {
        // 设置赔率上升的样式
        this.odds_change_up = true;
        this.odds_change_down = false;
      } else if (new_ < old_) {
        // 设置赔率下降的样式
        this.odds_change_up = false;
        this.odds_change_down = true;
      }
    },
    /**
     * @description:设置提示信息
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    set_message(count=0) {
      // 处理串关冲突时，赔率或者盘口的变化样式持续时间
      if(["0400477","0400478"].includes(this.view_ctr_obj.error_code)) {
        let code;
        if(this.odds_change_up || this.odds_change_down) {
          code = "0402027"; // 赔率变化
        }
        if(this.handicap_change) {
          code = "0402010"; // 盘口变化
        }
        if(this.hv_ov_change) {
          code = "0402028"; // 赔率和盘口一起变化时
        }
        if(code) {
          this.bet_mix_reset_flag(code);
        }        
        return;
      }
      clearTimeout(this.timer_obj['message']);
      // console.log("==========================bet_mix_item=====================set_message=============");
      if(this.active!=2 && this.active!= 3 && count==0) {
        this.view_ctr_obj.error_message = this.$root.$t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg2;      
        let delay = this.error_mapping.ERROR_CODE_DELAY[this.view_ctr_obj.error_code];
        console.log(`===============333333333=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
        if(delay) {
          this.virtual_common.delay_reset_message(this, delay);
        }    
      } else if(this.active==2 || this.active==3){
        // console.log('====================111111==========================');
        if(!this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(this.view_ctr_obj.error_code)) {
          this.view_ctr_obj.error_code = "0402022";
        } else {
          this.view_ctr_obj.error_code = "0402049";
        }
        // console.log(`=============code:${this.view_ctr_obj.error_code}`);
        this.view_ctr_obj.error_message = this.$root.$t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg2;       
        this.timer_obj['message'] = setTimeout(() => {
          this.bet_mix_reset();
          if(this.view_ctr_obj.bet_fail_flag) {
            this.view_ctr_obj.order_confirm_complete = 0;
          }
        }, 3 * 1000);     
      } else {
        // console.log(`===============5555555=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
        this.timer_obj['message'] = setTimeout(() => {
          this.bet_mix_reset();
          if(this.view_ctr_obj.bet_fail_flag) {
            this.view_ctr_obj.order_confirm_complete = 0;
          }
        }, 3 * 1000);
      }    
    },
    /**
     * @description:重置串关投注项组件的标志
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    bet_mix_reset() {
      // 赔率下降设置为false  
      this.odds_change_up = false;
      // 赔率上升设置为false
      this.odds_change_down = false;
      // 盘口变化设置为false
      this.handicap_change = false;
      // 投注项状态变化设置为false
      this.odds_status_change = false;    
    },
    /**
     * @description: 根据code码重置串关投注项组件的标志
     * @param {*} code
     * @return {*}
     */
    bet_mix_reset_flag(code) {
      clearTimeout(this.timer_obj[`timer_${this.id}`]);
      let delay = this.error_mapping.ERROR_CODE_DELAY[code];
      this.timer_obj[`timer_${this.id}`] = setTimeout(() => {
        // console.log(`=========bet_mix_reset===========timer_:${this.timer_obj[`timer_${this.id}`]}`);
        this.bet_mix_reset();
        clearTimeout(this.timer_obj[`timer_${this.id}`]);
      }, delay);
    },
    /**
     * @description: 获取编码序号
     * @param {*}
     * @return {*}
     */
    get_numbers() {
      return this.virtual_common.get_numbers(this);
    },
    start_time() {  
      clearTimeout(this.timer_obj['start_time']);    
      this.timer_obj['start_time'] = setTimeout(() => {
        this.remote_time+=1000;
        let second = (Number(this.mgt) - this.remote_time)/1000;
        if (second < 10) {
          let mid = _.get(this.vx_get_virtual_bet_obj,`${this.id}.bs.mid`); 
          // 投注栏 投注项失效
          this.virtual_common.update_bet_item_status(this, {
            mid,
            status: 1,
          });
          return;
        }     
        this.start_time();
      }, 1000);
    },
    /**
     * @description:设置投注项对象
     * @param {String} k 投注项的key值
     * @param {String} v 投注项key值对应的值
     * @return {undefined} undefined
     */
    set_virtual_bet_obj_value(k, v) {
      if (!this.vx_get_virtual_bet_list.includes(this.id)) {
        return;
      }
      let bet_obj = this.vx_get_virtual_bet_obj && this.vx_get_virtual_bet_obj[this.id];
      if (bet_obj) {
        let obj = _.cloneDeep(bet_obj);
        obj.key = this.id;
        obj.cs[k] = v;
        this.vx_virtual_bet_obj_add(obj);
      }
    },
    /**
     * 更新主客队以及联赛名称(语言变化时调用)
     */
    update_home_away() {
      // 玩法名称
      this.play_name = this.virtual_common.get_play_name(this);
      // 投注项名称
      this.team_name = this.virtual_common.get_team_name(this);
      // 联赛名称
      this.season = this.virtual_common.get_season(this);
      // 期号
      this.no = this.virtual_common.get_no(this);
      // 批次号
      this.batch_no = this.virtual_common.get_batch_no(this);     
      let cs = _.get(this.vx_get_virtual_bet_obj,`${this.id}.cs`);
      if(_.isPlainObject(cs)) {
        this.match_update = cs.match_update;
        this.home = cs.home;
        this.away = cs.away;
      }
    }
  }
}