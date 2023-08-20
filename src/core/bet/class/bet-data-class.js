// import MenuData from "src/core/menu-pc/menu-data-class.js";
// import PageSourceData from "src/core/page-source-h5/page-source-h5.js";
// import UserCtr from "src/core/user-config/user-ctr.js";
class BetData {
  constructor() {}
  init_core() {
    // 当前赔率
    this.cur_odd = "eu";
    // 投注项id集合
    this.bet_list = [];
    // 押注信息对象
    this.bet_obj = {};
    //是否接受更好赔率
    this.is_accept = false;
    // 是否串关
    this.is_mix = false;
    // 押注信息列表
    this.bet_list = [];
    // 押注扁平化对象扁平
    this.bet_obj = {};
    // 串关信息列表
    this.bet_s_list = [];
    // 串关对象扁平化
    this.bet_s_obj = {};
    this.bet_single_list = [];
    //单关投注对象
    this.bet_single_obj = {};
    this.is_bet_single = true; // true= 单关投注 false= 串关投注
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
    this.is_virtual_bet = true;
    // 虚拟投注是否正在进行
    this.is_virtual_handle = false;
 
    //==============================================投注之前 无注单ID=============
    // 虚拟投注对象  VR 菜单下的那种 
    this.virtual_bet_obj = {
      // [bet_custom_id]:{
         
      //  }
    };
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
 
    // 投注后的 
    this.orderNo_bet_obj = {
      // [bet_custom_id]:{
        
      // }
    };
   ///////////////////


 
 
    // 当前电竞查询的模式 false单关模式
    this.cur_esports_mode = false;
    // 是否为合并模式
    this.is_bet_merge = false;
    this.bet_category = 1; // 投注类别 1= 普通赛事 2= 虚拟体育 3= 电竞
    // 最小串关数
    this.mix_min_count = 2;
    // 最大串关数
    this.mix_max_count = 10;
    // 被预约的投注项id
    this.bet_appoint_obj = null;
    //需要预约的盘口
    /* this bet_appoint_odds_value= null;
this.bet_appoint_ball_head= null */
this.pre_bet_list = null;
    //输入框最小值 备注 (预约投注用)
    this.pre_min_odd_value = -1;
    //聊天室来源跟单盘口状况eu
    this.chat_room_type = "";
    // 记录投注金额
    this.bet_current_money_obj = {};
    // 投注金额
    this.bet_amount = 0;
    //自动化 测试
    this.auto_test_bet_info = {};
    //
    this.item_cs_id = 0;
    // 前端点击投注项立马生成的前端索引ID ，每个注单不论什么状态，只管用最初始的前端生成的ID 去参照对象内去转换
    this.bet_read_write_refer_obj = {

    //  [bet_custom_id]:{
      // mount_point_key:'virtual_bet_obj',
      // shuju_laiyuan: 'xiangqing',       //  
      // shuju_laiyuan_obj:  data_souce,       //  
      // c_csid,
      // c_tid,
      // c_mid,
      // c_hid,
      // c_oid,
      // c_kid,
      // c_hn,
      // c_topKey,
      // is_guanjun:1,  
      // is_dianjing:1,
      // is_common:1,
      // is_vr:1,   // 
      // virtual_bet_mode:1,  //操盘方 投注模式  -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
      // is_pre_bet,

      
    //  }

    };
    // 每一个投注对象 的视图控制对象
    this.all_bet_view_data_obj={
      // [bet_custom_id]:new  BetViewData()
    }
    // 注单 到 自定义ID 的 反向映射 
    //当前视图的注单区域的  需要显示  自定义ID 数组 

 
    this.show_bet_custom_id_arr=[];
    //ids 变更  ， 用这个监听 或者 发事件  
    this.show_bet_custom_id_arr_change=1



    const c_csid_map={
      common:'csid',
      dianjing:'csid',
      guanjun:'csid',
      vr_1:'csid',  //足蓝 
      vr_2:'csidxasxsax', //
    }
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
    let { mount_point_key } = refer_obj["mount_point_key"];
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
    let { mount_point_key } = refer_obj["mount_point_key"];
    let real_bet_obj = this[mount_point_key][bet_custom_id];
    return real_bet_obj;
  }
 /**
   * 通过前端 自定义 投注ID 写入/更新数据对象
   */
 set_bet_obj_by_bet_custom_id(bet_custom_id,obj) {
    let refer_obj = get_refer_obj_by_bet_custom_id(bet_custom_id);
    let { mount_point_key } = refer_obj["mount_point_key"];
    let real_bet_obj = this[mount_point_key][bet_custom_id];
    Object.assign(real_bet_obj,obj)
  }

  /* 
    设置 投注项立马生成的前端索引ID
  */
  set_bet_read_write_refer_obj(obj) {
    let custom_id = Date.now()
    console.error('sssss',obj)
    const bet_refer_obj = {
      // mount_point_key:'virtual_bet_obj',
      // shuju_laiyuan: 'xiangqing',       //  
      // shuju_laiyuan_obj:  data_souce,       //  
      c_csid: obj.csid,
      c_tid: obj.tid,
      c_mid: obj.mid,
      c_hid: obj.hid,
      c_kid: obj.kid,
      c_hn: obj.hn,
      c_topKey: obj.topKey,
      is_guanjun: obj.is_guanjun,
      is_dianjing: obj.is_dianjing,
      is_common: obj.is_common,
      is_vr: obj.is_vr,
      virtual_bet_mode: obj.virtual_bet_mode,//操盘方 投注模式  -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
    
    }

    this.bet_read_write_refer_obj[custom_id] = bet_refer_obj

    console.error(' this.bet_read_write_refer_obj', this.bet_read_write_refer_obj)
  }

  
 /**
   * 通过前端 自定义 投注ID 获取视图控制对象 BetViewData
   */
 get_bet_view_data_obj_by_bet_custom_id(bet_custom_id) {

  const mount_point_key ='all_bet_view_data_obj'
 
  let bet_view_data_obj = this[mount_point_key][bet_custom_id];
  return bet_view_data_obj;
}

set_show_bet_custom_id_arr(){

  this.show_bet_custom_id_arr=[]
  this.show_bet_custom_id_arr_change =Date.now()
}

/**
 * 获取当前 视图展示的 投注单数据列表
 */
get_current_show_bet_obj_arr(){
  //自己算 IDS 数组

  let ids=    this.show_bet_custom_id_arr=[];

  let arr=[]


  ids.map(x=>{
    arr.push(  this.get_bet_obj_by_bet_custom_id(x) )  
  })

  return arr
}



  http_upd_data() {}
  set_bet_amount(val) {
    this.bet_amount = val;
  }
  /**
   * @description: 删除投注对象
   * @param {*}BetData.
   * @param {*} key 需要删除对象的键值
   */
  bet_obj_remove_attr(key) {
    delete this.bet_obj[key];
  }
  /**
   * @description: 删除串关列表
   * @param {*}BetData.
   * @param {*} i 需要删除的id索引
   */
  bet_list_remove(i) {
    let temp = Object.assign([], this.bet_list);
    temp.splice(i, 1);
    this.bet_list = temp;
  }
  /**
   * @description: 添加投注串关输入对象
   * @param {*}BetData.
   * @param {*} obj 需要添加的对象
   */
  bet_s_obj_add_attr(obj) {
    if (obj.key) {
      this.bet_s_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
      this.bet_s_obj = _.cloneDeep(this.bet_s_obj);
    }
  }
}
export default new BetData();
