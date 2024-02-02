

import { fileds_map_common } from "src/output/module/constant-utils.js";
import { useMittEmit, MITT_TYPES  } from "src/core/mitt/index.js"
import LayOutMain_pc from "src/core/layout/index.js";
import BetViewDataClass from "./bet-view-data-class.js"
import { get_score_config,get_query_bet_amount_esports_or_vr,get_query_bet_amount_common,get_lastest_market_info } from "./bet-box-submit.js"
import { compute_value_by_cur_odd_type } from "src/core/format/project/module/format-odds-conversion-mixin.js"
import { getSeriesCountJointNumber } from "src/core/bet/common-helper/module/bet-single-config.js"
import { nextTick, ref } from "vue"
import lodash_ from "lodash"
import UserCtr from "src/core/user-config/user-ctr.js";
import { SessionStorage } from "src/core/utils/common/module/web-storage.js";
import betViewDataClass from "./bet-view-data-class.js";

let time_out = null

class BetData {
  constructor() {
  
  }
  init_core() {
    this.deviceType = 1  // 设备类型 "设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备"
    // 当前赔率
    this.cur_odd = "eu";
    // 投注项id集合
    // this.bet_list = [];
     // 是否预约
    this.is_bet_pre = false
    
    //是否接受更好赔率 
    this.bet_is_accept = false;
    // 接受更好赔率规则
    this.better_rules_show = false
    // 押注信息列表 投注项id
    this.bet_oid_list = [];
    // 押注扁平化对象扁平
    // this.bet_obj = {};
    // 串关投注列表
    this.bet_s_list = [];
    // 单关投注信息
    this.bet_single_list = [];
    // 单关串关切换 保留原值
    this.single_list_copy = []
    // true= 单关投注 false= 串关投注
    this.is_bet_single = true;
    // 投注金额 h5使用
    this.bet_amount = 0;
    // 投注记录数量
    this.bet_record_count = 0
    // 是否勾选常用金额
    this.is_regular_amount = true
    this.regular_amount = 0

    // 是否为合并模式
    this.is_bet_merge = false;
    // 是否正在处理投注
    this.is_handle = false;
    // 单关 是否正在处理投注
    this.is_single_handle = false;
    // 选择的选项
    this.menu_obj = {};
    // 投注模式 -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
    this.bet_mode = -1;
    // 是否锁住投注项不让点，默认为不锁住(针对新的投注流程)
    this.bet_item_lock = false;
    // 当前是否为虚拟投注
    this.is_virtual_bet = false;
    // 虚拟投注是否正在进行
    this.is_virtual_handle = false;
    // 处于活动的投注项子项
    this.active_index = 0
    // 复合串关类型
    this.special_type = false

    //==============================================投注之前 无注单ID=============
    // 虚拟投注对象  VR 菜单下的那种 
    this.vrtual_bet_obj = {
      // [betcustom_id]: {
      //   c_id, // 投注项id
      //   c_oid, // 投注项oid
      //   c_kid, // 坑位id
      //   c_mid, // 赛事id
      //   c_hid, //盘口id
      //   c_play_id, //玩法id
      //   c_csid, //球种
      //   c_mhs, //赛事盘口状态
      //   c_handicap_value, // 盘口
      //   c_hs, //盘口状态
      //   c_odds_value, //赔率
      //   c_os, // 投注项状态
      //   c_play_name, //玩法名称
      //   c_hsw, //支持的赔率转换模板
      //   c_obv, //断档赔率
      //   c_target_side, //T1,T2
      //   c_score_type,
      //   cmhid, // 主队id
      //   c_mhn, //主队
      //   c_home_score, // 主队得分
      //   c_maid, // 客队id
      //   c_man, //客队
      //   c_away_score, // 客队得分
      //   c_effect, // 是否有效
      //   c_full_bet, //是否满额投注，1：是，0：否
      //   c_money, // 投注额
      //   c_win_money, // 可赢额
      //   c_min_money: // 最大值
      //     c_max_money, // 最小值
      //   c_source,
      //   c_match_type, // 赛事类型
      //   c_market_type, // 盘口类型
      //   c_hv_ov_change, // 盘口值与赔率是否一起变化
      //   c_handle_time,
      //   c_serial_type, // 是否可以进行串关
      //   c_match_update
      // }
    }
    // 常规体育 含一部分电子赛事 
    this.common_bet_obj = {
      // [bet_custom_id]:{

      //  }
    };

    // 常规体育 含一部分电子赛事 
    this.guanjun_bet_obj = {
      // [bet_custom_id]:{

      //  }
    };
    // 常规体育 含一部分电子赛事 
    this.dianjing_bet_obj = {
      // [bet_custom_id]:{
      //   bs:{},cs:{}

      // }
    };

    //==============================================投注之后 有注单ID=============
    ///////////////////

    // 当前电竞查询的模式 false单关模式
    this.cur_esports_mode = false;
 
    this.bet_category = 1; // 投注类别 1= 普通赛事 2= 虚拟体育 3= 电竞
    // 最小串关数
    this.mix_min_count = 2;
    // 最大串关数
    this.mix_max_count = 10;
    // 当前预约投注项数据 
    this.bet_appoint_obj = {};
    // 预约投注项id 投注项中可以预约的
    this.bet_pre_list = []
    // 预约投注数据 点击投注时 合并到投注项中的内容
    this.bet_pre_obj = {}
    //需要预约的盘口
    /* this bet_appoint_odds_value= null;
this.bet_appoint_ball_head= null */
    //输入框最小值 备注 (预约投注用)
    this.pre_min_odd_value = -1;
    //聊天室来源跟单盘口状况eu
    this.chat_room_type = "";
    // 记录投注金额
    this.bet_current_money_obj = {};
   
    //自动化 测试
    this.auto_test_bet_info = {};
    //
    this.item_cs_id = 0;
    // 前端点击投注项立马生成的前端索引ID ，每个注单不论什么状态，只管用最初始的前端生成的ID 去参照对象内去转换
    this.bet_read_write_refer_obj = {};
    // 每一个投注对象 的视图控制对象
    this.all_bet_view_ctr_obj = {
      // [bet_custom_id]:new  BetViewData()
    }
    // 注单 到 自定义ID 的 反向映射 
    //当前视图的注单区域的  需要显示  自定义ID 数组 
    this.show_bet_custom_id_arr = [];
    //ids 变更  ， 用这个监听 或者 发事件  
    this.show_bet_custom_id_arr_change = 1
    // 从服务器拉取到的 赔率转换表
    this.odds_coversion_map = []
    // 版本变更
    this.bet_data_class_version = ref('123')
    this.show_merge_info = false
    // 投注状态 是否 在投注
    this.bet_flag = true
    // 预约投注最小值
    this.bet_pre_min_odd_value = 0
    // 投注栏拖拽配置
    this.bet_box_draggable = {
      x: window.innerWidth * 0.6,
      y: window.innerHeight * 0.7,
      isActive: false,
      draggable:true,
      show: false,
    }
    // 商户限额
    this.user_max_min_money = {}
    // console.error('window.innerWidth',window.innerWidth);
    // console.error('window.innerWidth',window.innerWidth);
    // 默认展开 投注弹窗
    this.bet_state_show = true
    // ---------------------------------- H5 ------------------------------------------------------------------------------------------
   //显示隐藏H5投注栏
    this.bet_box_h5_show = false
    
    this.bet_keyboard_config = {}
    // 键盘状态
    this.bet_keyboard_show = true;
    // 投注项 ID + 坑位
    this.bet_oid_obj = {}

    // 当前预约的投注项id
    this.bet_pre_appoint_id = ''

    // 获取缓存信息
    this.set_loacl_config()

   
  }

  set_user_max_min_money(){
    if (this.is_bet_single) {
      const { qon,qtw,qth,qfo,qfi,max='MAX' } = lodash_.get(UserCtr, 'user_info.cvo.single', { qon: 100, qtw: 200, qth: 500, qfo: 1000, qfi: 2000 })  
      this.user_max_min_money = {qon,qtw,qth,qfo,qfi,max} 
    } else {
      const {qon,qtw,qth,qfo,qfi,qsi } = lodash_.get(UserCtr, 'user_info.cvo.series', { qon: 10, qtw: 50, qth: 100, qfo: 200, qfi: 500, qsi: 1000 })
      this.user_max_min_money = {qon,qtw,qth,qfo,qfi,qsi}
    }
  }

  // 复合串关类型 
  set_special_type(val){
    this.special_type = val

    this.set_bet_data_class_version()
  }

  // 根据缓存信息 设置数据
  set_loacl_config(){
    // 获取数据缓存
    let session_info = SessionStorage.get('bet_data_class');
    if (!session_info) {
      return;
    }
    if (Object.keys(session_info).length) {
      for(let item in session_info){
        if(!['bet_data_class_version'].includes(item) ){
          this[item] = session_info[item]
        }
      }
    }
    this.set_bet_data_class_version()
  }

  set_bet_box_h5_show (value) {
    
    this.bet_box_h5_show = value
    this.set_bet_data_class_version()
  }

  // 通过  mount_point_key 计算 取值字段映射
  get_fields_map_by_mount_point_type(type) {
    let obj = fileds_map_common
    return obj
  }

  // 从单关预约投注中找到赔率相同的替换投注项id和赔率
  set_bet_single_list_obj(obj){
    this.bet_single_list.filter(item => {
      if( item.playOptionsId === obj.oid){
        item.playOptionsId = obj.oid
        item.pre_odds = obj.pre_odds
        item.pre_oddFinally = obj.pre_oddFinally
        item.pre_marketValue = obj.pre_marketValue
        item.pre_handicap = obj.pre_handicap
      }
    })
  }
  get_is_champion() {

  }
  //  /**
  //    * @description 是否是冠军
  //    * @param {Object} state 当前state
  //    * @param {Object} getters 
  //    * @return {Boolean} 是否是冠军
  //    */
  get_is_champion(state, getters) {
    return false;
    // let flag = getters.get_menu_type == 100 && ['matchList'].includes(val.$route.name)
    //   || getters.get_menu_type == 3000 && val.$route.name == 'matchList' && _.get(getters, 'get_current_menu.date_menu.menuType') == 100
    // return flag
  }
  /**
   * 设置 是否接受更好赔率
  */
  set_bet_is_accept(val) {
    this.bet_is_accept = val
    // BetViewDataClass.set_bet_before_message({code:'0402018',message:"bet.bet_upd"})

    // setTimeout(()=>{
    //   BetViewDataClass.set_bet_before_message({code:'',message:""})
    // },5000)

    this.set_bet_data_class_version()
  }

  /**
   * 设置 是否使用常用金额
   */
  set_is_regular_amount() {
    this.is_regular_amount = !this.is_regular_amount
    this.set_bet_data_class_version()
  }

  set_regular_amount(val) {
    this.regular_amount = val
  }

  /**
   * 更好赔率规则
  */
  set_accept_show(data) {
    this.better_rules_show = data
    this.set_bet_data_class_version()
  }

  // 设置投注栏的拖拽属性
  set_bet_box_draggable(val) {
    this.bet_box_draggable = {
      ...this.bet_box_draggable,
      ...val,
    }
    this.set_bet_data_class_version()
  }

  // 设置投注弹窗 开启 关闭
  set_bet_state_show(val) {
    this.bet_state_show = val
    this.bet_keyboard_show = true;
    this.set_bet_data_class_version()
  }

  /**
   *
   * 管道负责 读写 衔接  使用对象引用类型的 原理
   * 平坦化读写 ， 让逻辑层不关心挂载点
   *
   */
  /**
   * 通过前端 自定义 投注ID 获取 当前 ID 对应的 配置参照对象 ，也可能附加其他参照逻辑
   */
  get_refer_obj_by_bet_custom_id(bet_custom_id) {
    return this.bet_read_write_refer_obj[bet_custom_id];
  }
  /**
   * 通过前端 自定义 投注ID 获取数据对象
   */
  get_bet_obj_by_bet_custom_id(bet_custom_id) {
    let refer_obj = get_refer_obj_by_bet_custom_id(bet_custom_id);
    let {
      mount_point_key
    } = refer_obj["mount_point_key"];
    let real_bet_obj = this[mount_point_key][bet_custom_id];
    return real_bet_obj;
  }
  /**
   * 通过前端 自定义 投注ID 获取 当前 ID 对应的 配置参照对象 ，也可能附加其他参照逻辑
   */
  get_refer_obj_by_bet_custom_id(bet_custom_id) {
    return this.bet_read_write_refer_obj[bet_custom_id];
  }
  /**
   * 通过前端 自定义 投注ID 获取数据对象
   */
  get_bet_obj_by_bet_custom_id(bet_custom_id) {
    let refer_obj = get_refer_obj_by_bet_custom_id(bet_custom_id);
    let {
      mount_point_key
    } = refer_obj["mount_point_key"];
    let real_bet_obj = this[mount_point_key][bet_custom_id];
    return real_bet_obj;
  }
  /**
   * 通过前端 自定义 投注ID 写入/更新数据对象
   */
  set_bet_obj_by_bet_custom_id(bet_custom_id, obj) {
    let refer_obj = get_refer_obj_by_bet_custom_id(bet_custom_id);
    let {
      mount_point_key
    } = refer_obj["mount_point_key"];
    let real_bet_obj = this[mount_point_key][bet_custom_id];
    Object.assign(real_bet_obj, obj)
  }

  // 清除投注项中的不 问题数据
  set_bet_single_special_list() {
    this.bet_single_list = this.bet_single_list.filter(Boolean)
    this.bet_s_list = this.bet_s_list.filter(Boolean)
  }

  /* 
    设置 投注项立马生成的前端索引ID
  */
  set_bet_read_write_refer_obj(obj) {
    let custom_id = obj.playOptionsId
    const bet_refer_obj = {
      // mount_point_key:'virtual_bet_obj',
      // shuju_laiyuan: 'xiangqing',       //  
      // shuju_laiyuan_obj:  data_souce,       //  
      // c_csid: obj.csid,
      // c_tid: obj.tid,
      // c_mid: obj.mid,
      // c_hid: obj.hid,
      // c_kid: obj.kid,
      // c_hn: obj.hn,
      // c_topKey: obj.topKey,
      is_guanjun: false,
      is_dianjing: false,
      is_common: false,
      is_vr: false,
      is_serial:false,
      ...obj,
      // virtual_bet_mode: obj.virtual_bet_mode || -1, //操盘方 投注模式  -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球 bet后接口返回

    }
    // 是否虚拟投注
    let is_virtual_bet = false
    // 根据投注类型 设置投注分类
    switch (obj.bet_type) {
      // vr
      case 'vr_bet':
        this.set_vrtual_bet_obj({ custom_id, ...obj })
        bet_refer_obj.is_vr = true
        is_virtual_bet = true
        break;
      // 常规体育
      case 'common_bet':
        this.set_common_bet_obj({ custom_id, ...obj })
        bet_refer_obj.is_common = true
        break;
      // 冠军  
      case 'guanjun_bet':
        this.set_guanjun_bet_obj({ custom_id, ...obj })
        bet_refer_obj.is_guanjun = true
        break;
      // 电竞
      case 'esports_bet':
        this.set_dianjing_bet_obj({ custom_id, ...obj })
        bet_refer_obj.is_dianjing = true
        break;
    }
    this.set_bet_single_special_list()
    // 设置是否为 虚拟投注
    this.is_virtual_bet = is_virtual_bet
    // 设置 投注内容
    this.bet_read_write_refer_obj[custom_id] = bet_refer_obj

    // 串关投注中 有这个需要显示不支持串关投注 
    bet_refer_obj.is_serial = this.check_bet_option_special(bet_refer_obj)

    // 单关/串关 投注
    if (this.is_bet_single) {
      // 单关 不合并 只有一条 
      // 单关 合并 多条
      if (this.is_bet_merge) {
        // 单关合并 通盘口下只能选择一个
        let markert_obj = this.bet_single_list.find(item => item.marketId == bet_refer_obj.marketId) || {}
        if(markert_obj.marketId){
          // 必有的 
          let index_ = this.bet_single_list.findIndex(item => item.marketId == bet_refer_obj.marketId)
          // 删除指定投注项
          this.bet_single_list.splice(index_,1)
        }
        this.bet_single_list.push(bet_refer_obj)
        this.set_active_index( this.bet_single_list.length)
      } else {
        this.bet_single_list = [bet_refer_obj]
        this.set_active_index(0)
      }
      // 单关数据收集器
      this.single_list_copy.push(bet_refer_obj)
      
    } else {
      // 串关
      // 同场赛事不能串 部分数据源赛事不能串 
      if (this.bet_s_list.length) {
        let obj = this.bet_s_list.find(item => item.matchId == bet_refer_obj.matchId) || {}
        // 判断是否选择的同赛事投注项
        if (obj.matchId) {
          let bet_s_list = this.bet_s_list.map(item => {
            if (item.matchId == obj.matchId) {
              return {
                ...item,
                ...bet_refer_obj
              }
            } else {
              return item
            }
          })
          this.bet_s_list = bet_s_list
        } else {
          this.bet_s_list.push(bet_refer_obj)
        }
      } else {
        this.bet_s_list.push(bet_refer_obj)
      }
    }

    // 显示 投注信息窗口
    if (LayOutMain_pc.layout_left_show != 'bet_list') {
      LayOutMain_pc.set_layout_left_show('bet_list')
    }

    // 设置投注项id 页面选中
    this.set_bet_oid_list()

    this.set_options_state()

  }

  // 设置投注项id 页面选中
  set_bet_oid_list(){
    let list_query = []
    let bet_oid_obj = {}

    let bet_list = []
    if(this.is_bet_single){
      bet_list = lodash_.cloneDeep(this.bet_single_list)
     
    }else{
      bet_list = lodash_.cloneDeep(this.bet_s_list)
    }

    list_query = bet_list.map(item => {
      if(item.playOptionsId){
        if(item.placeNum){
          // 坑位 + 投注项id
          bet_oid_obj[`${item.playOptionsId}_${item.placeNum}`] = {
            oid: item.playOptionsId,
            hn: item.placeNum,
          }
        }
        return item.playOptionsId
      }
    })

    this.bet_oid_list = list_query
    this.bet_oid_obj = bet_oid_obj
  }

  // 替换投注项id
  set_bet_oid_obj(old_,new_) {
    // 获取oid在投注项id集合中的位置
    let index_ = this.bet_oid_list.findIndex(item => item == old_)
    if(index_ || index_ == 0){
      this.bet_oid_list.splice(index_,1)
      this.bet_oid_list.push(new_)
    }
    this.set_bet_data_class_version()
  }

  /*
    设置 vr 投注分类
  */
  set_vrtual_bet_obj(obj) {
    this.vrtual_bet_obj[obj.custom_id] = obj
  }

  /*
  设置 常规 投注分类
  */
  set_common_bet_obj(obj) {
    this.common_bet_obj[obj.custom_id] = obj
  }

  /*
  设置 冠军 投注分类
  */
  set_guanjun_bet_obj(obj) {
    this.guanjun_bet_obj[obj.custom_id] = obj
  }

  /*
  设置 电竞 投注分类
  */
  set_dianjing_bet_obj(obj) {
    this.dianjing_bet_obj[obj.custom_id] = obj
  }

  // 设置投注项其他属性
  set_custom_id_obj(custom_id,key,val){
    this.bet_read_write_refer_obj[custom_id].key = val
  }

  /*
  设置 是否接受更好赔率
  */
  set_is_accept(value) {
    value = Number(value)
    if (isNaN(value)) {
      this.is_accept = value == 1 ? 2 : 1
    } else {
      this.is_accept = value;
    }
    this.set_bet_data_class_version()
  }
  /*
  设置 赔率类型
  */
  set_cur_odd(cur_odd) {
    this.cur_odd = cur_odd;
    this.set_bet_data_class_version()
  }

  // 设置单关 串关 投注状态
  set_is_single_handle(val) {
    this.is_single_handle = val
  }
  // 设置 h5 串关 当前点击输入的投注项
  set_active_index(val) {
    this.active_index = val
    this.set_bet_data_class_version()
  }

  // 设置是否预约
  set_is_bet_pre(val) {
    this.is_bet_pre = val
    this.set_bet_data_class_version()
  }
  
  set_bet_appoint_obj_playOptionId(val) {
    this.bet_pre_appoint_id = val
    if(val){
      // 选中了预约单 清空投注金额
      this.bet_single_list.forEach(item=>{
        item.bet_amount = ''
      })
    }
    this.set_bet_data_class_version()
  }

  // 设置预约投注盘口信息
  set_bet_appoint_obj(val) {
    this.bet_appoint_obj = val
    this.set_bet_data_class_version()
  }

  // 设置可预约的投注项
  set_bet_pre_list(val) {
    this.bet_pre_list = val
    this.set_bet_data_class_version()
  }

  // 设置预约投注项内容 用于投注时合并
  set_bet_pre_obj(val){
    // custom_id 投注项id
    this.bet_pre_obj = val
    // console.error('sssss',this.bet_pre_obj)
  }
  
  // 设置 是否已投注
  set_bet_flag() {
    if (this.bet_mode == 0) {
      this.bet_flag = false;
    } else {
      this.bet_flag = this.bet_mode == -1 || (this.bet_mode == 1 && BetViewDataClass.order_confirm_complete != 2);
    }
    this.set_bet_data_class_version()
  }

  // 操盘方 投注模式  -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球 bet后接口返回
  set_bet_mode(val) {
    this.bet_mode = val
    this.set_bet_flag()
  }

  // 获取 赛事重复数量
  get_match_count(match_id_list){
    let obj = {}
    for(let id of match_id_list){
      obj[id] = (obj[id] +1 ) || 1
    }
    return obj
  }

  check_bet_option_special(obj){
    let is_serial = false
    // 串关逻辑 不支持串关的数据 增加标识 ，在页面上做提示
    // mbmty 2 or 4 为电子赛事  足球 篮球 C01 O01 不支持串关
    let foot_or_mbmty = [1,2].includes(Number(obj.sportId)) && [2,4].includes(Number(obj.mbmty)) && ['C01','O01'].includes(obj.dataSource) 
    // 电竞 ispo == 0 不支持串关
    let esports_bet_state = (obj.bet_type == 'esports_bet' && obj.ispo == 0)
    // 
    if( foot_or_mbmty || esports_bet_state ){
      // 串关投注中 有这个需要显示不支持串关投注 
      is_serial = true
    }

    return is_serial
  }

  // 检查串关中 是否可以 串关的数据
  check_bet_s_list_special(){
    let bet_s_list = lodash_.cloneDeep(this.bet_single_list)
    // 获取投注项中 有哪些赛事id是重复的 
    // 对重复的赛事id 加入不能串关的字段 
    let match_id_list = bet_s_list.map(item => item.matchId)
    let match_obj = this.get_match_count(match_id_list)

    let match_list = []
    for(let obj in match_obj){
      if(match_obj[obj] > 1){
        match_list.push(obj)
      }
    }

    bet_s_list.filter(item=> {
      // 重复的赛事不能串关 
      if(match_list.includes(item.matchId) || this.check_bet_option_special(item)){
        item.is_serial = true
      }
    })

    this.bet_s_list = lodash_.cloneDeep(bet_s_list)
  }

  // 设置 切换单关/串关切换
  set_is_bet_single(state) {
    // 单关 切换到串关  
    if (this.is_bet_single && !this.is_bet_merge) {
      // 串关数据 == 单关数据 // 同赛事不能大于一个投注项
      this.bet_s_list = lodash_.cloneDeep(this.bet_single_list)
      // 获取串关 参数显示
      getSeriesCountJointNumber((code, data) => {
        if (code == 200) {
          BetViewDataClass.set_bet_special_series(data)
          useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
        }
      })
    }
    // 合并 切换到 串关
    if (this.is_bet_single && this.is_bet_merge) {
      // 检查并设置不能串关的数据
      this.check_bet_s_list_special()

      getSeriesCountJointNumber((code, data) => {
        if (code == 200) {
          BetViewDataClass.set_bet_special_series(data)
          useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
        }
      })
    }
    // 串关 切换到 合并
    if (!this.is_bet_single && this.is_bet_merge) {
      this.bet_single_list = lodash_.cloneDeep(this.bet_s_list)
    }
    // 串关 切换到 单关
    if (!this.is_bet_single && !this.is_bet_merge) {
      this.bet_single_list = [lodash_.cloneDeep(this.bet_s_list)[0]]
      this.bet_oid_list = [this.bet_oid_list[0]]
    }

    let is_bet_single = !this.is_bet_single
    // 有设置值 则使用设置的值
    if(state){
      if(state == 'single'){
        is_bet_single = true
      }else{
        is_bet_single = false
      }
    }
    // true 单关 false 串关
    this.is_bet_single = is_bet_single
    this.set_is_bet_pre(false)
    // this.switch_bet_query_bet_amount()
    // this.set_bet_oid_list()
    this.set_bet_data_class_version()
  }


  // 设置单关/单关合并 切换
  set_is_bet_merge(merge) {
    // 设置 投注内容数据
    if (this.is_bet_merge) {
      // 不合并的状态下 取最后合并的最后一条数据作为投注内容
      this.bet_single_list = [this.bet_single_list.pop()]
      this.bet_oid_list = [this.bet_oid_list.pop()]
    }
    let is_merge = !this.is_bet_merge

    if(merge){
      if(merge == 'merge'){
        is_merge = true
      }else{
        is_merge = false
      }
    }
    this.is_bet_merge = is_merge

    // this.switch_bet_query_bet_amount()

    this.set_bet_data_class_version()
  }

  // 设置 投注版本
  set_bet_data_class_version = lodash_.debounce(() => {
    this.bet_data_class_version.value = Date.now()
    nextTick(()=>{
      SessionStorage.set('bet_data_class',this)
    })
    // console.error('set_bet_data_class_version',JSON.parse(JSON.stringify(this)))
  }, 5)

  // 投注成功后 不保留投注项 需要清空投注数据 
  set_clear_bet_info() {
    this.bet_s_list = []
    this.single_list_copy = []
    this.bet_single_list = []
    this.bet_read_write_refer_obj = {}
    this.bet_oid_list = []
    this.bet_oid_obj = {}
    this.set_bet_amount(0)
    this.set_bet_data_class_version()
    this.set_is_bet_pre(false)
    this.set_bet_appoint_obj_playOptionId(0)
  }

  /**
   * 通过前端 自定义 投注ID 获取视图控制对象 BetViewData
   */
  get_bet_view_data_obj_by_bet_custom_id(bet_custom_id) {

    const mount_point_key = 'all_bet_view_ctr_obj'

    let bet_view_data_obj = this[mount_point_key][bet_custom_id];
    return bet_view_data_obj;
  }

  set_show_bet_custom_id_arr() {

    this.show_bet_custom_id_arr = []
    this.show_bet_custom_id_arr_change = Date.now()
  }

  /**
   * 获取当前 视图展示的 投注单数据列表
   */
  get_current_show_bet_obj_arr() {
    //自己算 IDS 数组

    let ids = this.show_bet_custom_id_arr = [];

    let arr = []


    ids.map(x => {
      arr.push(this.get_bet_obj_by_bet_custom_id(x))
    })

    return arr
  }



  http_upd_data() { }

  // 设置投注金额
  set_bet_amount(val) {
    this.bet_amount = val;
    this.set_bet_data_class_version()
  }

  // 设置投注项的投注金额
  set_bet_obj_amount(val,oid){
    if(this.is_bet_single){
      this.bet_single_list.filter(item => {
        if(item.playOptionsId == oid){
          item.bet_amount = val
        }
      })
    }else{
      this.bet_s_list.filter(item => {
        if(item.playOptionsId == oid){
          item.bet_amount = val
        }
      })
    }
    this.set_bet_data_class_version()
  }
  /**
   * @description: 删除投注对象
   * @param {*}BetData.
   * @param {*} key 需要删除对象的键值
   */
  bet_obj_remove_attr(key) {
    delete this.bet_read_write_refer_obj[key];
    this.set_bet_data_class_version()
  }
  /**
   * @description: 删除单关串关列表
   * @param {*}BetData.
   * @param {*} i 需要删除的id索引
   */
  bet_list_remove(custom_id) {
    let index = 0
    let query = []
    // 单关 
    if (this.is_bet_single) {
      // 合并
      if (this.is_bet_merge) {
        query = this.bet_single_list
      } else {
        this.bet_single_list = []
      }
      
      // 指定删除的数据
      index = lodash_.findIndex(this.bet_single_list, (item) => { return item.playOptionsId == custom_id });
    } else {
      // 串关
      query = this.bet_s_list
      // 指定删除的数据
      index = lodash_.findIndex(this.bet_s_list, (item) => { return item.playOptionsId == custom_id });

    }

    let temp = Object.assign([], query);
    // 指定删除
    temp.splice(index, 1);

    // 单串关赋值
    if (this.is_bet_single) {
      this.bet_single_list = temp
    } else {
      this.bet_s_list = temp
    }
    // 数量为 0 切换到菜单页面
    if (!temp.length) {
      LayOutMain_pc.set_layout_left_show('menu')
    }
    // 删除投注项内容
    this.bet_obj_remove_attr(custom_id)
  }
  /**
   * @description: 添加投注串关输入对象
   * @param {*}BetData.
   * @param {*} obj 需要添加的对象
   */
  bet_s_obj_add_attr(obj) {
    if (obj.key) {
      this.bet_s_obj[obj.key] = {
        cs: obj.cs,
        bs: obj.bs
      };
      this.bet_s_obj = _.cloneDeep(this.bet_s_obj);
    }
  }

  /**
   * @description: 存储最高可赢额
   * @param {*}win_money 存储字段
   * @param {*} value 需要存储的值
   */
  set_bet_s_obj(win_money, value) {
    this.bet_s_obj[win_money] = value
  }
  /**
  * @description: 存储 赔率转换表
  * @param {*} value 需要存储的值
  */
  set_odds_coversion_map(value) {
    this.odds_coversion_map = value
  }


  /**
  * @description: 根据oid或者坑位id获取投注项id
  * @param {String} okid oid或者坑位id
  * @return {String} 投注项id
  */
  get_id(okid) {
  }
  /**
   * @description: 根据投注项id获取投注项的oid
   * @param {String} id 投注项id
   * @return {String} 投注项oid
   */
  get_oid(id) {
  }
  /**
   * @description: 根据投注项id获取投注项的坑位id(kid)
   * @param {String} id 投注项id
   * @return {String} 投注项坑位id(kid)
   */
  get_kid(id) {
  }
  /**
   * @description: 根据投注项id,获取投注项对象
   * @param {String} id 投注项id
   * @return {Object} 投注项
   */
  get_bet_obj(id) {

  }
  /**
   * @description: 获取玩法id
   * @return {String} 玩法名称
   */
  get_play_id() {

  }
  /**
   * @description: 获取玩法名称
   * @return {String} 玩法名称
   */
  get_play_name() {

  }

  /**
   * @description: 设置设备类型
   * @return {String} 设备类型
   */
  set_device_type(val) {
    // 设备类型 "设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备"
    this.deviceType = val
  }

  //设置输入框最小值
  set_pre_min_odd_value(val){
    this.bet_pre_min_odd_value = val
    this.set_bet_data_class_version()
  }

  // 设置键盘状态
  set_bet_keyboard_show(val){
    if(val == this.bet_keyboard_show){
      return
    }
    this.bet_keyboard_show = val
   
    this.set_bet_data_class_version()
  }

  // 设置键盘信息 
  // 限额 /
  set_bet_keyboard_config(val) {
    this.bet_keyboard_config = val
    this.set_bet_data_class_version()
  }

  // 获取投注记录数量
  set_bet_record_count(count) {
    this.bet_record_count = count
    this.set_bet_data_class_version()
  }

  // 全局替换数据
  set_bet_single_special(list=[]) {
    if(this.is_bet_single){
      this.bet_single_list = lodash_.cloneDeep(list)
    }else{
      this.bet_s_list = lodash_.cloneDeep(list)
    }
    // 重新设置投注项
    this.set_bet_oid_list()

    this.set_bet_data_class_version()
  }

  // ws推送 更新赔率数据
  set_ws_message_bet_info(obj){
    let reg_index = 0
    // 投注后 ws推送不进行更新
    if(BetViewDataClass.bet_order_status == 1) {
      // console.log('这里！', this.bet_single_list, this.bet_s_list, obj)
      let single_list = []
      let single_name = ''
      // 单关 切 有投注项
      if(this.is_bet_single){
        single_list = this.bet_single_list || []
        single_name = 'bet_single_list'
      } else {
        single_list = this.bet_s_list || []
        single_name = 'bet_s_list'
      }

      reg_index = single_list.findIndex(i => i.playOptionsId === obj.playOptionsId)
    
      if(reg_index || reg_index == 0){
        single_list[reg_index] = obj
        this[single_name] = single_list
      }

      this.set_options_state()
    }
  }

  // 切换单关、串关、合并时调用获取限额
  switch_bet_query_bet_amount() {
    // 单关且有数据 才能去请求限额
    if(this.is_bet_single && this.bet_single_list.length) {
      let obj = this.bet_single_list.find(item => ["C01","B03","O01"].includes(item.dataSource)) || {}
      // 合并投注 多项
      if(this.is_bet_merge){
        get_query_bet_amount_common()
      }else {
        // 电子赛事 走这个接口
        if(obj.dataSource){
          get_query_bet_amount_esports_or_vr()
        }else{
          get_query_bet_amount_common()
        }
      }
    }
    // 串关要大于1条才能去请求限额
    if(!this.is_bet_single && (this.bet_s_list.length > 1)){
      let obj = this.bet_s_list.find(item => ['esports_bet','vr_bet'].includes(item.bet_type)) || {}
      // 串关 在vr或者电竞里面 
      if(obj.bet_type){
        get_query_bet_amount_esports_or_vr()
      }else{
        get_query_bet_amount_common()
      }
    }
    this.set_options_state()
  }

  // 删除投注项
  // oid 投注项id  index 投注项下标
  set_delete_bet_info(oid,index) {
    let single = false
    let single_list = []
    let cur_index = 0
    // 删除投注项中的数据
    if(this.is_bet_single){
      single = true
      cur_index = this.bet_single_list.findIndex(i => i.playOptionsId == oid)
      if (cur_index < 0) return
      this.bet_single_list.splice(index,1)
      single_list = this.bet_single_list
    }else{
      cur_index = this.bet_s_list.findIndex(i => i.playOptionsId == oid)
      if (cur_index < 0) return
      this.bet_s_list.splice(index,1)
      single_list = this.bet_s_list
    }
    
    // 获取oid在投注项id集合中的位置
    let index_ = this.bet_oid_list.findIndex(item => item == oid)
    if(index_ != -1){
      this.bet_oid_list.splice(index_,1)
    }
    this.set_bet_data_class_version()
    // 删除后的数据 是否可以去获取限额
    let single_length = single_list.length
    
    // 单关且有数据 才能去请求限额
    if(single && single_length) {
      let obj = single_list.find(item => ["C01","B03","O01"].includes(item.dataSource)) || {}
      // 合并投注 多项
      if(this.is_bet_merge ){
        get_query_bet_amount_common()
      }else {
        // 电子赛事 走这个接口
        if(obj.dataSource){
          get_query_bet_amount_esports_or_vr()
        }else{
          get_query_bet_amount_common()
        }
      }
    }
    
    // pc 端无投注项时，恢复菜单状态
    if(!single_length) {
      // 数量为 0 切换到菜单页面
      LayOutMain_pc.set_layout_left_show('menu')
    }

    // 串关要大于1条才能去请求限额
    if(!single && single_length > 1){
      let obj = single_list.find(item => ['esports_bet','vr_bet'].includes(item.bet_type)) || {}
      // 串关 在vr或者电竞里面 
      if(obj.bet_type){
        get_query_bet_amount_esports_or_vr()
      }else{
        get_query_bet_amount_common()
      }
    }
    //如果只有一条数据时 设置投注输入框激活index为0 
    if (this.bet_single_list.length === 1){
      this.set_active_index(0) 
    }
    // 数据删除后 重新设置 选中投注项id 
    this.set_bet_oid_list()
    // 设置 投注项状态
    this.set_options_state()
    
  }

  // 投注项赔率变动
  // 盘口变动  每次回来 都需要用投注项盘口去数据仓库中 找到对应的盘口；要是找不到就直接判断为投注项失效 ；找到了 再进行 投注项筛选
  set_bet_c106_change( obj={} ) {
    // ws 每次推送的 mid只有一个 
    let mid = lodash_.get(obj,'mid')
    // 多盘口
    let hls = lodash_.get(obj,'hls',[])
    // 投注项赛事id
    let mid_list = []
    // 投注项盘口id
    let market_list = []

    let single_list = []
    // 单关 切 有投注项
    if(this.is_bet_single){
      single_list = this.bet_single_list || []
    } else {
      single_list = this.bet_s_list || []
    }

    if(single_list.length){
      // 获取单关下的赛事id 多个（单关合并）
      mid_list = single_list.map(item => item.matchId) || []
      // console.error('mid_list',mid_list, '------',mid)
      // 投注项中有 推送的数据 那么就会对盘口和投注项id进行比对筛选 
      if( mid_list.includes(mid)){
        // 投注项盘口id 多个（单关合并）
        market_list = single_list.map(item => item.marketId) || []
        // 查询投注项中的 投注项id 
        // this.bet_single_list.forEach((item,ol_index) => {
        //    // 匹配盘口是否健在
        //   if(!get_market_is_show(item)){
        //     // 设置 投注项状态  1：开 2：封 3：关 4：锁
        //     item.ol_os = 3
        //     // 更新投注项内容
        //     this.set_ws_message_bet_info(item,ol_index)
        //   }
        // });
      
        // 获取ws推送中的 盘口项 进行筛选匹配
        // 对比盘口和投注项
        hls.forEach(item => {
          if(market_list.includes(item.hid)){
            // console.error('market_list',market_list, '------',item.hid)
            // 查询投注项中的 投注项id
            let ol_obj = single_list.find(obj => obj.marketId == item.hid) || {}
            // let ol_obj_index = single_list.findIndex(obj => obj.marketId == item.hid) || 0
            // 查询ws投注项 中 匹配到的投注项id 
            let ws_ol_obj = (item.ol||[]).find(obj => ol_obj.playOptionsId == obj.oid ) || {}
            // WS推送中包含 投注项中的投注项内容
            // console.error('推送码：',obj.cmd)
            console.error('ws-坑位',item.hn, '------ 投注项坑位',ol_obj.placeNum)
            console.error('ws-盘口 状态',item.hs, 'ws-投注项 状态',ws_ol_obj.os)
            console.error('ws-投注项 赔率',ws_ol_obj.ov, '------ 投注项赔率',ol_obj.odds )
            // console.error('定时器',time_out)
            clearTimeout(time_out)
            // console.error('清除定时器',time_out)
            // 有坑位 并且 坑位变更 
            if(item.hn != ol_obj.placeNum && ol_obj.placeNum){
              // console.error('坑位变化',item.hn,ol_obj.placeNum)
              // 获取最新的盘口值
              get_lastest_market_info()
              // 有坑位的数据 对 坑位 和 投注项类型 进行定位 取值 页面渲染
              ws_ol_obj = (item.ol||[]).find(obj => ol_obj.ot == obj.ot ) || {}
              // 更新 投注项 数据
              if(ws_ol_obj.ov){
                this.set_ws_change_odds_info(item,ws_ol_obj,ol_obj)
              }
              return
            }
            // 盘口状态，玩法级别 0：开 1：封 2：关 11：锁
            if(item.hs != 0 ) {
              // console.error('盘口失效',item.hs)
              // 直接更新状态 设置关盘
              ol_obj.hl_hs = item.hs
              ol_obj.red_green = ''
              this.set_ws_message_bet_info(ol_obj)
              return
            }
            // 更新 投注项 数据
            if(ws_ol_obj.ov){
              this.set_ws_change_odds_info(item,ws_ol_obj,ol_obj)
            }
          }
        })
      }
    }
  }

  // ws变更 带来的 投注项数据的变更
  set_ws_change_odds_info(item,ws_ol_obj,ol_obj) {
    // console.error('------------ 来了 ---------------')
    if(ws_ol_obj.ov){
      // "odds": item.odds,  // 赔率 万位
      // "oddFinally": compute_value_by_cur_odd_type(item.odds, '', '', item.sportId),  //赔率
      //  红升绿降
      ol_obj.red_green = 'red_up'
      if(ol_obj.odds > ws_ol_obj.ov ){
        ol_obj.red_green = 'green_down'
      }

      // 投注项和状态一致不更新数据 
      if(ol_obj.odds == ws_ol_obj.ov && ws_ol_obj.os == ol_obj.ol_os && item.hs == ol_obj.hl_hs ){
        // console.error('------------ 赔率没变 ------------ ')
        ol_obj.red_green = ''
        this.set_ws_message_bet_info(ol_obj)
       return
      }
      // console.error('------------ 设置投注项数据 ------------ ')
      // 重新设置赔率
      ol_obj.odds = parseFloat(ws_ol_obj.ov) ? ws_ol_obj.ov*1 : ol_obj.odds
      
      // 设置 投注项状态  1：开 2：封 3：关 4：锁
      ol_obj.ol_os = ws_ol_obj.os
      // 盘口状态，玩法级别 0：开 1：封 2：关 11：锁
      ol_obj.hl_hs = item.hs

      // 盘口变更中 需要显示盘口变更的状态
      if(item.hs == 11 && ws_ol_obj.os == 1){
        this.set_bet_is_accept('mark_change')
      }

      // 获取新的基准分
      ol_obj.mark_score = get_score_config(ol_obj)
      // 赔率数据
      ol_obj.oddFinally = compute_value_by_cur_odd_type(ws_ol_obj.ov*1, ol_obj.playId, ol_obj.odds_hsw, ol_obj.sportId)
      // 更新投注项内容
      this.set_ws_message_bet_info(ol_obj)
      // 清除数据 不然会用前面的数据 重新更新
      ol_obj.time_out = Date.now()
      // console.error('1-----time_out----------', ol_obj.time_out,time_out)
      // 3秒后清除 红升绿降
      time_out = setTimeout(()=>{
      // setTimeout(()=>{
        ol_obj.red_green = ''
        // console.error('3秒后清除----------', ol_obj.time_out)
        this.set_ws_message_bet_info(ol_obj)
      },3000)
      // console.error('2-----time_out----------',time_out)
    }
  }

  // 赛事级别盘口状态
  set_bet_c104_change( obj={} ) {
    // ws 每次推送的 mid只有一个 
    let mid = lodash_.get(obj,'mid')
    // 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
    let mhs = lodash_.get(obj,'ms')
    // 单关/串关 属性名
    let single_name = ''
    // 单关/串关 属性值
    let array_list = []
    // 单关/串关 赛事列表
    let mid_list = []
    if(this.is_bet_single){
      single_name = 'bet_single_list'
    } else {
      single_name = 'bet_s_list'
    }
    array_list = lodash_.cloneDeep(lodash_.get(this,single_name))
    // 获取单关下的赛事id 多个（单关合并）
    mid_list = array_list.map(item => item.matchId) || []

    // 判断赛事级别盘口状态 中是否包含 投注项中的赛事
    if(mid_list.includes(mid)){
      array_list.filter(item => {
        // 在赛事盘口状态下的 投注项 设置 对应的赛事级别 用于 失效投注项
        if(item.matchId == mid){
          item.mid_mhs = mhs 
        }
      })

      this[single_name] = array_list

      this.set_bet_oid_list()

      this.set_options_state()
    }
  }

  /**
   * C101 数据
   * `mid` 赛事Id
   * `ms` 赛事状态 0:未开赛 1:赛事进行中  2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
   * @description: 赛事状态
   * @param {Object} obj socket推送的消息体
   * @return {undefined} undefined
   */
  set_bet_c101_change( obj={} ) {
    let ms = lodash_.get(obj,'ms', '')

    // 赛事状态为 3:结束 4:关闭 5:取消 6:比赛放弃 8:未知 赛事进行关盘处理
    if(![3,4,5,6,8].includes(ms*1)){
      return
    }
    let mid = lodash_.get(obj,'mid', '')
    this.set_bet_list_deactivated(mid)
  }

  /**
   * C102 数据
   * `mid` 赛事Id
   * `mmp` 赛事阶段 999 结束
   * @description: 赛事状态
   * @param {Object} obj socket推送的消息体
   * @return {undefined} undefined
   */
  set_bet_c102_change( obj={} ) {
    let mmp = lodash_.get(obj,'mmp', '')

    // 赛事阶段 999 结束
    if(mmp != '999'){
      return
    }
    let mid = lodash_.get(obj,'mid', '')
    this.set_bet_list_deactivated(mid)
  }

  // 设置投注的赛事 进行关盘处理
  set_bet_list_deactivated(mid){
    // 单关/串关 属性名
    let single_name = ''
    // 单关/串关 属性值
    let array_list = []
    // 单关/串关 赛事列表
    let mid_list = []
    if(this.is_bet_single){
      single_name = 'bet_single_list'
    } else {
      single_name = 'bet_s_list'
    }
    array_list = lodash_.cloneDeep(lodash_.get(this,single_name))
    // 获取单关下的赛事id 多个（单关合并）
    mid_list = array_list.map(item => item.matchId) || []

    // 判断赛事级别盘口状态 中是否包含 投注项中的赛事
    if(mid_list.includes(mid)){
      array_list.filter(item => {
        // 在赛事盘口状态下的 投注项 设置 对应的赛事级别 用于 失效投注项
        if(item.matchId == mid){
          // 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
          item.mid_mhs = 2 
        }
      })
      this[single_name] = array_list

      // this.set_bet_oid_list()

      this.set_options_state()
    }
  }

  // 订单状态
  set_bet_c201_change( obj={} ) {
    // 订单id
    // 订单状态 订单状态(1:投注成功 2:投注失败)
    let status = lodash_.get(obj,'status', 0)
    // console.error('BetViewDataClass.set_bet_c201_change',BetViewDataClass.is_finally)
    // 订单已经完成 不需要去设置 用户点击了 保留选项 或者投注的确定
    if(!BetViewDataClass.is_finally){
      if(this.is_bet_single){
        // 单关 单注 简单 粗暴 其他的后面做
        if(status == 1){
          BetViewDataClass.set_bet_before_message({code:200,message:"bet_message.success"})
          BetViewDataClass.set_bet_order_status(3)
        }
        if(status == 2){
          BetViewDataClass.set_bet_before_message({code:'0402018',message:"bet_message.error"})
          BetViewDataClass.set_bet_order_status(4)
        }

        if(this.is_bet_single && [1,2].includes(status*1)){
          BetViewDataClass.orderNo_bet_obj_config({orderNo: obj.orderNo,status: obj.status})
        }
      } else {
        BetViewDataClass.set_orderNo_bet_single_obj_item({orderNo: obj.orderNo, status: obj.status})
      }
    }
  }

  // 设置投注项状态
  set_options_state() {
    // 需要筛选出 某些状态不需要再去做投注项状态的改版
    // 目前 7 8 为预约投注后
    if ([7, 8].includes(betViewDataClass.bet_order_status)) {
      return
    }
    let single_name = ''
    if(this.is_bet_single){
      single_name = 'bet_single_list'
    } else {
      single_name = 'bet_s_list'
    }
    
    const array_list = lodash_.cloneDeep(lodash_.get(this,single_name))
    // ol_os: ol_obj.os, // 投注项状态 1：开 2：封 3：关 4：锁
    // hl_hs: hl_obj.hs || ol_obj._hs, // 盘口状态，玩法级别 0：开 1：封 2：关 11：锁
    // mid_mhs: ol_obj._mhs, // 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
    // 预期行为:
    // 锁盘: 投注单上跳出: 赔率更新中 提示文字
    // 封盘: 投注单上跳出: 投注项目不存在 提示文字 且投注按钮反灰
    // 关盘: 投注单上跳出: 投注项目不存在 提示文字 且投注按钮反灰

    // 锁盘
    let obj = array_list.find( item => item.mid_mhs == 11 || item.hl_hs == 11 || item.ol_os == 4 ) || {}
    // console.error('锁盘---------',obj.mid_mhs,obj.hl_hs,obj.ol_os)
    if(obj.playOptionsId){
      BetViewDataClass.set_bet_expired(false)
      BetViewDataClass.set_bet_before_message({code:200, message:"bet.bet_upd"})
      this[single_name] = array_list
      this.set_bet_data_class_version()
      return
    }

    // 封盘 关盘
    let obj_ = array_list.find( item => [1,2].includes(item.mid_mhs *1) || [1,2].includes(item.hl_hs *1) || [2,3].includes(item.ol_os *1) ) || {}
    // console.error('封盘 关盘---------',obj_.mid_mhs,obj_.hl_hs,obj_.ol_os)
    if(obj_.playOptionsId){
      BetViewDataClass.set_bet_expired(true)
      BetViewDataClass.set_bet_before_message({code:"0402001", message:"bet_message.m_0402001"})
      this[single_name] = array_list
      this.set_bet_data_class_version()
      return
    }

    // 开盘
    let obj_o = array_list.find( item => item.mid_mhs == 0 && item.hl_hs == 0 && item.ol_os == 1 ) || {}
    // console.error('开盘---------',obj_o.mid_mhs,obj_o.hl_hs,obj_o.ol_os)
    if(obj_o.playOptionsId){
      BetViewDataClass.set_bet_expired(false)
      BetViewDataClass.set_bet_before_message({})
      this[single_name] = array_list
      this.set_bet_data_class_version()
      // 投注项更新后 需要通知页面
      useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY_UPDATE)
      return
    }
  }

  set_bet_c103_change(obj) {
    let msc = lodash_.get(obj,'msc', '')

    // 没有比分 
    if(!msc.length){
      return
    }
    let mid = lodash_.get(obj,'mid', '')

    // 单关/串关 属性名
    let single_name = ''
    // 单关/串关 属性值
    let array_list = []
    // 单关/串关 赛事列表
    let mid_list = []
    if(this.is_bet_single){
      single_name = 'bet_single_list'
    } else {
      single_name = 'bet_s_list'
    }
    array_list = lodash_.cloneDeep(lodash_.get(this,single_name))
    // 获取单关下的赛事id 多个（单关合并）
    mid_list = array_list.map(item => item.matchId) || []

    // 判断赛事级别盘口状态 中是否包含 投注项中的赛事
    if(mid_list.includes(mid)){
      array_list.filter(item => {
        // 在赛事盘口状态下的 投注项 设置 对应的赛事级别 用于 更新比分
        if(item.matchId == mid){
          // 更新 基准分
          item.mark_score = get_score_config(item)
        }
      })
      this[single_name] = array_list

      // this.set_bet_oid_list()

      this.set_options_state()
    }
    
  }
}
export default new BetData();