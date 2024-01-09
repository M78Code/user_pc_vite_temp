/*
 * @Author: hanmar
 * @Date: 2023-08-20 12:45:19
 * @Description: h5/pc赛事列表和赛事详情等所有赛事关联模块仓库数据管理(所有赛事信息数据共同处理)-实现快速检索,赛事数据合并逻辑,ws数据推送实时数据同步
 * 
 * h5和pc赛事列表使用
 * 
 * MatchDataWarehouseInstance.set_list(list); 更新列表数据
 * 
 * h5和pc赛事详情页面使用
 * MatchDataWarehouseInstance.set_match_details(match_details,[]); 更新赛事数据
 * 
 * 设置赛事为活动状态
 * MatchDataWarehouseInstance.set_active_mids(['233332'])
 * 
 * 设置赛事为非活动状态
 * MatchDataWarehouseInstance.set_inactive_mids(['233332'])
 * 
 * 删除指定赛事
 * MatchDataWarehouseInstance.remove_match(mid); 删除指定mid的赛事数据释放内存
 * 
 * 清除所有对象
 * MatchDataWarehouseInstance.clear(); 
 * 
 * 清除list赛事mid之外的无用数据
 * MatchDataWarehouseInstance.clear_list_other(list);
 * 
 * 获取快速查询对象中的指定mid赛事对象
 * get_quick_mid_obj(mid)
 * 
 * 强行发送C8赛事订阅命令(ws断开后重新链接使用,默认缓存上次的订阅数据)
 * scmd_c8_ws_reconnect()
 * 
 */
import MatchDataBaseWS from  "./match-ctr-ws.js"
import { reactive,toRef} from 'vue'
import {other_play_name_to_playid} from 'src/core/constant/project/module/data-class-ctr/other-play-id.js'
 
export default class MatchDataBase
{
  /**
   * @description: 构造函数
   * @return {undefined} undefined
   */
  constructor(params={})
  {

    let { name_code='' } = params
    if(!name_code){
      console.error('MatchDataBase -赛事数据仓库-必须有实例化名字标识---');
      return false
    }

    // 实例化名字标识
    this.name_code = name_code;

    
    // 设置ws数据通信实例
    this.ws_ctr = new MatchDataBaseWS(this);

    // 使用类型:类表-list,赛事详情-match,赛果-result
    this.type = '';

    this.str = { a: '123131' }

    // 初始化对象数据
    this._init_obj();
  }
  
  /**
   * @description: 设置赛事为活动状态
   * @param {Array} mids 赛事列表
   */
  set_active_mids(mids){
    if(mids){
      // 设置激活的赛事mids数组
      this.mids_ation = mids;
      mids.forEach(mid => {
        const match = lodash.get(this.list_to_obj, `mid_obj[${mid}_]`);
        if(match){
          match._action = true;
        }
      });
      // 不等于赛事详情时,赛事详情再设置数据时发送一次就行
      if('match' != this.type){
        // ws命令赛事订阅
        this.ws_ctr.scmd_c8(mids);
      }
    }
  }
  /**
   * @description: 设置赛事为非活动状态
   * @param {Array} mids 赛事列表
   */
  set_inactive_mids(mids){
    if(mids){
      mids.forEach(mid => {
        const match = lodash.get(this.list_to_obj, `mid_obj[${mid}_]`);
        if(match){
          match._action = false;
        }
      });
    }
  }

  /**
   * @description: 数据初始化
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  _init_obj(){
    // 方法：    set_list(match_list,config)
    //处于激活的赛事mids数组
    this.mids_ation = [];
    this.match_list = []
    // 所有赛事列表数据转obj对象
    this.list_to_obj = reactive({ 
      // 页面显示赛事投注项对象
      ol_obj:{},
      // 页面显示赛事盘口对象
      hl_obj:{},
      // 页面显示赛事坑位对象
      hn_obj:{},
      // 页面显示赛事赛事对象
      mid_obj:{},
    });
    // 赛事基本信息需要同步的时间
    this.MATCH_UPD_TIME_KEYS = ['mst','mc','mf','mct','ms','mhs','mess','mmp','mms','mat','mvs','tf','msc'];
      // mst: 赛事进行时间
      // mc: 赛事玩法总数
      // mf: 赛事是否收藏
      // mct: 当前是第几盘或者第几局
      // ms: 赛事状态 0 赛事未开始 1 进行中 2暂停 3结束 4关闭 5取消 6 放弃 7延迟 8未知  9延期 10中断
      // mhs: 赛事玩法状态
      // mess: mess 开始结束状态 1、start 0、stop（此字段只适用于特定事件编码）篮球暂停事件编码=time_start
      // mmp: 比赛阶段
      // mms: 视频状态  0:不可用 1:可用，暂未播放 2：可用，播放中''',
      // mat: 发球方  home 主队 away 客队
      // mvs: 动画状态  0:不可用 1:可用，暂未播放 2：可用，播放中',
      // tf: 联赛是否收藏
      // msc: 比分


    // 所有临时变量信息
    this.cache={
      // 赛事折叠状态
      // 联赛折叠状态
    };
    // 所有赛事基础信息动态数据时间更新
    this.cache_match={
      '23432234':{mmp:111111111111,ms:222222222}
    };
    // ws赛事属性key数据更新时间
    this.ws_match_key_upd_time_cache = {
      '23432234':{mmp:111111111,ms:22222222}
    };
    // 数据版本更新参数 reactive({ version: '123'})
    this.data_version = { version: '123'} ,
    // 所有投注项动态数据时间更新
    this.cache_oid={};
  }
  /**
   * @description: ws赛事属性key数据更新时间
   * @param {Array} matches 赛事列表
   * @param {Array} key 基本属性列表
   * @param {Number} time 时间戳
   */
  ws_match_key_upd_time_cache_set(matche, key, ctsp){
    let mid = lodash.get(matche,'mid');
    if( mid && key){
      lodash.set(this.ws_match_key_upd_time_cache,`[${mid}][${key}]`, ctsp);
    }
  }

  /**
   * @description: 获取ws赛事属性key数据更新时间差(单位毫秒)
   * @param {Array} matches 赛事列表
   * @param {Array} key 基本属性列表
   * @param {Number} time 时间戳
   */
  ws_match_key_upd_time_cache_get_time(matche, key){
    let res = 0;
    let mid = lodash.get(matche,'mid');
    if(mid && key){
      res = lodash.get(this.ws_match_key_upd_time_cache,`[${mid}][${key}]`, 0);
    }
    return res;
  }

/**
 * @description: 数据初始化
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
init(){
  // 仓库清除对象数据
  this.clear();
}

  /**
   * @description: 更新赛事的基本属性时间
   * @param {Array} matches 赛事列表
   * @param {Array} keys 基本属性列表
   * @param {Number} time 时间戳
   */
  set_match_upd_time_keys(matches, keys, time){
    if(matches && keys && time){
      // 遍历赛事列表
      matches.forEach(match => {
        // 获取赛事mid标识
        const mid = match.mid;
        // 遍历属性列表
        keys.forEach(key => {
          // 设置属性时间
          this.cache_match[mid][key] = time;
        });
      });
    }
  }

  /**
   * @description: 获取赛事的基本属性时间
   * @param {string} mid 赛事mid
   * @return {Object} 赛事基本属性时间对象
   */
  get_match_upd_time_keys(mid){
    let res = {};
    if(mid){
      res = this.cache_match[mid] || {};
    }
    return res
  }


  /**
   * @description: list转字典(key值为mid)
   * @param {Array} 赛事列表
   * @return {Object} 将list转换为对象
   */
  get_list_obj(list, timestap)
  {
    let obj = {};
    if(list && (list instanceof Array))
    {
      list.forEach(item => {
        if(item && item.mid)
        {
          obj[item.mid] = item;
        }
      });
      // 更新赛事的基本属性时间
      this.set_match_upd_time_keys(list, this.MATCH_UPD_TIME_KEYS, timestap);
    }
    return obj;
  }

  /**
   * @description: 返回两个列表对比结果
   * @param {Array} newList 新赛事列表
   * @param {Array} oldList 历史赛事列表
   * @return {Object}  返回比较结果对象 {add:{需要增加数据}, del:{需要删除数据}, upd:{需要更新数据}}
   */
  list_comparison(oldList,newList){
    let ret = {add:{}, del:{}, upd:{}}
    let oldObj = this.get_list_obj(oldList);
    let newObj = this.get_list_obj(newList);
    // console.error(JSON.stringify(oldObj))
    // console.error(JSON.stringify(newObj))
    let key_ = '';
    let id = 'mid';
    if(newList && (newList instanceof Array))
    {
      newList.forEach(item => {
        if(item && item[id])
        {
          key_ = item[id];
          if(oldObj[key_])
          {
            //修改的
            ret.upd[key_] = item;
          } else
          {
            //新增的
            ret.add[key_] = item;
          }
        }
      });
    }

    if(oldList && (oldList instanceof Array))
    {
      oldList.forEach(item => {
        if(item && item[id])
        {
          key_ = item[id];
          if(!newObj[key_])
          {
            // 需要删除的
            ret.del[key_] = item;
          }
        }
      });
    }
    return ret;
  }

  /**
   * @description: 赛事数据合并
   * @param {Object} match_old 旧赛事
   * @return {Object} match_new 新赛事
   */
  match_assign(match_old, match_new){
    if(match_old && match_new){
      // this.assign_with(match_old, match_new);
      this.match_assign_with_v1(match_old, match_new);
    }
  }

  /**
   * @description: 赛事数据一级根数据浅合并(都是赋值操作)
   * @param {Object} match_old 旧赛事
   * @return {Object} match_new 新赛事
   */
  match_assign_with_v1(match_old, match_new){
    if(match_old && match_new){
      for (const key in match_new) {
        match_old[key] = match_new[key];
      }
    }
  }

  /**
   * @description: 获取快速查询对象中的指定mid赛事对象
   * @param {String} mid 赛事mid
   * @return {TYPES.MatchDetail} 赛事
   */
  get_quick_mid_obj(mid){
    // 获取指定mid的赛事
    const key = this.get_list_to_obj_key(mid,mid, 'mid')
    return lodash.get(this.list_to_obj.mid_obj, key);
    // return this.list_to_obj.mid_obj[this.get_list_to_obj_key(mid,mid,'mid')];
  }
/**
   * @description: 获取快速查询对象中的指定mid赛事对象 ref对象
   * @param {String} mid 赛事mid
   * @return {TYPES.MatchDetail} 赛事
   */
get_quick_mid_obj_ref(mid){
    // 获取指定mid的赛事
    const key = this.get_list_to_obj_key(mid,mid, 'mid')
    return toRef(this.list_to_obj.mid_obj, key);
    // return this.list_to_obj.mid_obj[this.get_list_to_obj_key(mid,mid,'mid')];
  }

  /**
   * @description: 格式化比分数组(数组转对象)
   * @param {Object} msc 比分数据列表
   */
  serialized_score_obj(msc,is_init = false){
    let score_obj = {}
    if(is_init){
      score_obj = {
        S11:{
          home:'',
          away:''
        },
        S103:{
          home:'0',
          away:'0'
        },
        S5:{
          home:'',
          away:''
        },
        S10102:{
          home:'',
          away:''
        }
      }
    }
    try {
      // 遍历接口比分数据 转成比分对象
      msc && lodash.each(msc, score_str => {
        if(typeof(score_str) == 'string'){
          let [key,value] = score_str && score_str.split('|') || []
          if(value){
            let [home,away] = value.split(':')
            score_obj[key] = {home,away}
          }
        }
      })
    } catch (error) {
      console.error('serialized_score_obj msc:', msc);
      console.error('serialized_score_obj:',error);
    }
    return  score_obj
  }

  /**
   * @description: 保存历史tab玩法数据
   * @param {Object} match_new 新数据老数据
   * @param {Object} match_old 老数据老数据
   */
  set_sava_tab_play_data(match_new,match_old){
    if(!(match_new && match_old)){
      // 无效数据放弃设置
      return;
    }
    // tab菜单字段开关和数key据对应关系
    const TAB_KEY_DATA = {
      // 角球开关
      cosCorner: {
        play_name: '角球',
        field: "hpsCorner",
      },
      // 罚牌
      hpsPunish: {
        play_name: '罚牌',
        field: "hpsPunish",
      },
      // 冠军
      cosOutright: {
        play_name: '冠军',
        field: "hpsOutright",
      },
      // 晋级赛
      cosPromotion: {
        play_name: '晋级赛',
        field: "hpsPromotion",
      },
      // 加时赛
      cosOvertime: {
        play_name: '加时赛',
        field: "hpsOvertime",
      },
      // 点球大战
      cosPenalty: {
        play_name: 'hpsPenalty',
        field: "hpsPenalty",
      },
      // 15分钟玩法
      cos15Minutes: {
        play_name: '15分钟玩法',
        field: "hps15Minutes",
      },
      // 波胆
      cosBold: { 
        play_name: '波胆',
        field: "hpsBold" 
      },
      // 5分钟玩法 
      cos5Minutes: {
        play_name: '5分钟玩法',
        field: "hps5Minutes"
      },
    };

    // 设置历史数据
    for (const key in TAB_KEY_DATA) {
      const arr_name = TAB_KEY_DATA[key].field;
      // key-cos5Minutes , arr_name-hps5Minutes
      let has_data = lodash.get(match_new,`${arr_name}.length`);
      const upd_time = `_${arr_name}_upd_time`;
      if(!has_data && lodash.get(match_new,key) && lodash.get(match_old,key)){
        // 新赛事设置tab开关为开时,赛时数据中未发现数据时,从历史数据中获取最新数据
        const tab_data_old = lodash.get(match_old,arr_name,[]);
        // 给新赛事tab名称设置历史数据
        match_new[arr_name] = lodash.cloneDeep(tab_data_old);
        // 设置tab数据更新时间
        match_new[upd_time] = new Date().getTime();
      }
    }
  }
  /**
   * @description: 格式化列表数据(比分数组转对象)
   * @param {Object} list 所有列表数据
   */
  list_serialized_match_obj(list){
    if(lodash.get(list,'length')){
      // 格式化比分信息
      list.forEach(match => {
        // 保存历史tab玩法数据
        this.set_sava_tab_play_data(match,this.get_quick_mid_obj(match.mid));
        const score_obj = lodash.get(match, 'msc_obj');
        const msc = lodash.get(match, 'msc',[]);
        try {
          // 转换比分
          const msc_obj = this.serialized_score_obj(msc,true);
          // 数据赋值和合并逻辑
          if(score_obj){
            this.assign_with(score_obj, msc_obj)
          } else {
            match.msc_obj = msc_obj;
          }
        } catch (error) {
          console.error(error);
        }
        // 转换玩法
        const play_obj = lodash.get(match, 'play_obj');
        const hps_pns_arr = lodash.get(match, 'hpsPns',[]);
        const play_obj_temp = lodash.keyBy(hps_pns_arr, function(o) {
          let hpid = o && o.hpid || null
          let hSpecial = o && o.hSpecial || null
                                  let res = `hpid_${hpid}`;
                                  if(hSpecial){
                                    // res = res +`_${o.hSpecial}`;
                                  }
                                  return res;
                                });
        // 数据赋值和合并逻辑
        if(play_obj){
          // this.assign_with(play_obj, play_obj_temp)
          this.match_assign_with_v1(play_obj, play_obj_temp);
        } else {
          match.play_obj = play_obj_temp;
        }
        // 设置赛事默认数据
        this.set_match_default_data(match);
        // 赛事数据格式化
        match && this._list_to_many_obj([match]);
        // 设置赛事更新时间
        this.match_upd_time_ret_change(match);
      });
    }
  }
  /**
   * @Description 设置赛事更新时间
   * @param {object} match 赛事对象
  */
  match_upd_time_ret_change(match){
    if(match){
      match._upd_time = new Date().getTime();
    }
  }

  /**
   * @Description 获取其他玩法tab标题
   * @param {object} match 赛事对象
  */
  get_tab_play_keys(match) {
    let tab_play_keys = []
    let play_keys = Object.keys(other_play_name_to_playid)
    lodash.each(play_keys,key=>{
      let status_key = 'cos'+key.slice(3)
      let status =  match[status_key]
      //15分钟次要玩法前端强制关闭
      let cos15min_status = !(status_key === 'cos15Minutes' && match.hSpecial == 6)
      //5分钟次要玩法前端强制关闭状态
      let cos5min_status = !(status_key === 'cos5Minutes' && match.hSpecial5min == 6)
      if( status && cos15min_status  && cos5min_status){
          tab_play_keys.push(key)
      }
    })
    // match.tab_play_keys = tab_play_keys.join(',')
    // // 是否有其他玩法
    // match.has_other_play = tab_play_keys.length > 0
    return  tab_play_keys.join(',');
  }


  /**
   * @Description 获取是否有附加盘数据
   * @param {Object} match 赛事信息
   * @return {Object} {has_add1:false,has_add2:false}
   */
  _get_has_add_n(match){
    let res = {has_add1:false,has_add2:false};
    try {
      // 获取附加盘数据 
      let hps_add_n_data = lodash.get(match,'hpsData[0].hpsAdd');
      // 获取玩法的最大坑位
      let main_fun = function(item){
        // 坑位
        let hn_obj = {hn:0,hpid:lodash.get(item,'hpid'),item};
        // 获取赔率信息数据
        let hl_arr = lodash.get(item,'hl');
        hl_arr && hl_arr.forEach(item2 => {
          // 检查是否有赔率数据
          const ol_length = lodash.get(item2,'ol.length');
          // 获取坑位
          const hn_ = lodash.get(item2,'hn',0);
          // 获取最大有效坑位
          if(hn_ && ((hn_*1)>hn_obj.hn))
          {
            hn_obj.hn = hn_*1;
          }
        });
        return hn_obj;
      }
      // 获取赛事的玩法的最大坑位
      let hn_max = 0;
      if(hps_add_n_data && Array.isArray(hps_add_n_data)){
        for (let i = 0; i < hps_add_n_data.length; i++) {
          const item = hps_add_n_data[i];
          // 获取最大坑位
          const hn_obj = main_fun(item);
          if(hn_obj.hn>hn_max){
            hn_max = hn_obj.hn;
          }
        }
      }

      // 附加盘1
      let has_add1 = false;
      // 附加盘2
      let has_add2 = false;
      
      // 根据最大坑位设置附加盘状态
      if(hn_max>=3){
        // 附加盘1
        has_add1 = true;
        // 附加盘2
        has_add2 = true;
      }else if(hn_max>=2){
        // 附加盘1
        has_add1 = true;
        // 附加盘2
        has_add2 = false;
      }
      // 设置是否有附加盘1
      res.has_add1 = has_add1;
      // 设置是否有附加盘2
      res.has_add2 = has_add2;
    } catch (error) {
      console.error('_set_has_add_n:',error);
    }
    return res;
  }
  

   /**
   * @Description 设置赛事默认数据
   * @param {Object} match 赛事信息
   * @param {undefined} undefined
  */
   set_match_default_data(match){
    // api数据更新时间
    this.match_upd_time_ret_change(match);
    // 获取是否有附加盘数据
    const has_add_n =this._get_has_add_n(match);
    // 是否有附加盘1
    match.has_add1 = has_add_n.has_add1;
    // 是否有附加盘2
    match.has_add2 = has_add_n.has_add2;

    // 设置是否显示当前局玩法 // 组件显示时,组件内进行设置
    match.is_show_cur_handicap = false
    // 主客队名称后面是否显示上半场字符串
    match.up_half_text = '' // 组件显示时,组件内进行设置
    // 当前局盘口列表
    match.cur_handicap_list = [] // 特定模版才会使用(模版7)
    // 足球角球玩法tab
    match.tab_play_keys = this.get_tab_play_keys(match);
    // 是否有其他玩法
    match.has_other_play = match.tab_play_keys&&String(match.tab_play_keys).split(',').length > 0; // 该值设置取决于match.tab_play_keys字段,可以删除
    match.other_handicap_list=[]
    // 默认比分数据
    // match.score_obj = serialized_score([],true)
    // 当前局比分 
    match.cur_score = { // 组件显示时,组件内进行设置
      home:'',
      away:''
    }
    // 主队比分
    match.home_score = '' // 组件显示时,组件内进行设置
    // 客队比分
    match.away_score = '' // 组件显示时,组件内进行设置
    // 历史比分列表
    match.score_list = []
    // 赛事比分总分
    match.total_score_str = ''
    // 15分钟玩法阶段
    match.hSpecial = 1
    // 5分钟玩法阶段
    match.hSpecial5min = 1
    // 赛事更新时间 match._upd_time
    // this.match_upd_time_ret_change(match);
    // tpl_21_hpids = ""
    // all_oid_arr = [] 可以移除,主要用于生成all_oids对象
    // all_oids="" //过期旧投注项ID列表 ,删除无用投注项数据使用
    
    // all_ol_data={} // 坑位数据操作使用 可以移除
    // all_hids="" // 快速修改数据时使用 可以移除
    
    // main_handicap_list = [] // 赛事显示时自行根据模版进行逻辑动态设置显示
    
    
    // play_current_index = 0
    // play_current_key = ''
    // other_handicap_list = []
    // add1_handicap_list = []
    // add2_handicap_list = []
    // 让球方
    // team_let_ball = ""
    // other_team_let_ball=""
    // 设置赛事logo
    match.match_logo = {
      home_1_logo:lodash.get(match,'mhlu[0]'),
      home_1_letter:lodash.get(match,'frmhn[0]'),
      home_2_logo:lodash.get(match,'mhlu[1]'),
      home_2_letter:lodash.get(match,'frmhn[1]'),
      away_1_logo:lodash.get(match,'malu[0]'),
      away_1_letter:lodash.get(match,'frman[0]'),
      away_2_logo:lodash.get(match,'malu[1]'),
      away_2_letter:lodash.get(match,'frman[1]'),
      is_double:lodash.get(match,'mhlu.length') > 1
    }

    // 历史比分处理(在各自组建显示时设置)
    // home_red_score = ""
    // away_red_score = ""
    // home_yellow_score = ""
    // away_yellow_score = ""

    // msc_format = [] // 代码中只有设置的地方,没有使用的地方,可以删除
    // send = "" //自定义属性send取值为my_self表示有用户模拟发送的指令, 可以删除

  }
  // 数据更新版本号
  upd_data_version(){
    this.data_version.version = Date.now();
  }

  /**
   * @description: 设置所有列表数据
   * @param {Object} list 所有列表数据
   * @param {Boolean} is_merge 是否进行合并数据同步(保证地址不变)
   */
  set_list(list, param={}){
    // 这个打印先别删
    // console.log('set_list', list,this.name_code)
    // list.forEach(match => {
    //   match_collect_status(match)        
    // })
    if(list){
      // 索引置换
      let temp = lodash.cloneDeep(this.match_list);
      let old_mid_list = this.match_list.map(m => m.mid).join(',');
      let new_mid_list = list.map(m => m.mid).join(',');
      if (new_mid_list != old_mid_list) {
        this.flex_index(list,temp)
        this.match_list = lodash.cloneDeep(list);
      } else{
        this.match_list = lodash.cloneDeep(list);
      }
      this.type = param.type || 'list';
      // 格式化列表赛事(部分数组转对象)
      this.list_serialized_match_obj(this.match_list);
      // 列表数据同步到快捷操作对象中
      this._list_to_obj_fun(this.match_list,this.list_to_obj)
      // set_active_mids 报错 DOMException: Failed to execute 'postMessage' on 'Window': Response object could not be clone 先放在这
      // this.set_active_mids(list.map(t => t.mid))
      // ws命令赛事订阅
      this.ws_ctr.scmd_c8();
      this.upd_data_version();
    }
  }

   /**
   * @description: 用户修正组件中的key值
   * @param {*} new_ 新列表
   * @param {*} old_ 旧列表
   * @return {*}
   */
   flex_index(new_, old_) {
    let flg = []
    // 最多支持99个动态key值
    for (let i = 1; i < 100; i++) {
      flg.push(i)
    }
    let obj_ = {};
    old_.forEach(element => {
      obj_[element.mid] = element;
    });

    let new_obj = {};
    let old_obj = {};
    // new_obj去重处理
    for (let i = 0; i < new_.length; i++) {
      const element = new_[i];
      let temp = (element.flex_index)
      if(element && temp){
        if(new_obj[temp]){
          delete element.flex_index;
        } else {
          new_obj[temp]=1;
        }
      }
      // new_str[element.mid] = element.flex_index;
    }
    // old_obj去重处理
    for (let i = 0; i < old_.length; i++) {
      const element = old_[i];
      let temp = (element.flex_index)
      if(temp){
        if(old_obj[temp]){
          delete element.flex_index;
        } else {
          old_obj[temp]=1;
        }
      }
      // old_str[element.mid] = element.flex_index;
    }

    for (let i = 0; i < new_.length; i++) {
      const element = new_[i];
      if (new_[i] && new_[i].mid && obj_[new_[i].mid]) {
        if(new_[i].mid == obj_[new_[i].mid].mid){
            new_[i].flex_index = obj_[new_[i].mid].flex_index;
            for (let k = 0; k < flg.length; k++) {
            if (flg[k] == obj_[new_[i].mid].flex_index) {
                flg.splice(k, 1);
                break;
            }
            }
        } else {
            element.flex_index = 0;
        }
      } else if(element) {
        element.flex_index = 0;
      }
    }
    for (let i = 0; i < new_.length; i++) {
      const element = new_[i];
      if ((!new_[i].flex_index)) {
        if (flg.length) {
          new_[i].flex_index = flg[0];
          flg.splice(0, 1);
        }
      }
    }

  }

  /**
   * @description: 列表数据同步到快捷操作对象中
   * @param {Object} list 页面显示列表数据
   * @param {Boolean} is_merge 是否进行合并数据同步(保证地址不变)
   * @param {Number} timestap 时间戳
   */
  _list_to_obj_fun(list,list_to_obj){
    if(list){
      let obj = {};
      // 将list格式化成多个obj对象
      const many_obj = this._list_to_many_obj(list);
       // 快速检索对象数据累加和赋值
      this._assign_with_list_to_obj(list_to_obj, many_obj);
    }
  }
  // 快速检索对象数据累加和赋值
  _assign_with_list_to_obj(old_obj, new_obj){
    // // 页面显示赛事投注项对象
    // ol_obj:{},
    // // 页面显示赛事盘口对象
    // hl_obj:{},
    // // 页面显示赛事坑位对象
    // hn_obj:{},
    // // 页面显示赛事赛事对象
    // mid_obj:{},

    // 对象赋值操作
    const set_obj_fun = function(key, obj_old, obj_new){
      if(obj_old && obj_new){
        for (const key in obj_new) {
          const obj =  lodash.get(obj_new,key)
           if(key && obj){
            obj_old[key] = obj;
           }
        }
      }
    }
    // 遍历对象一级层级
    for (const key in old_obj) {
      const obj_v_1_old =  lodash.get(old_obj,key);
      const obj_v_1_new =  lodash.get(new_obj,key);
      // // 对象赋值操作
      set_obj_fun(key, obj_v_1_old, obj_v_1_new)
    }
  }
  /**
   * @description: 获取快速查询的key值
   * @param {String} mid 赛事标识
   * @param {String} id 精准查询使用到的id
   * @param {String} type 精准查询id类型(mid/ol/hl/hn)
   * @return {String} 快速查询的组合key值
   */
  get_list_to_obj_key(mid,id,type){
    let res = id;
    switch (type) {
      case 'mid':
        res = mid+'_';
        break;
      case 'ol':
      case 'hl':
      case 'hn':
        res = mid+'_'+id;
        break;
      default:
        res = id;
        break;
    }
    return res;
  }

  /**
   * @description: 将赛事详情对象转成多个对象,以便提高操作速度和效率
   * @param {Object} item 赛事对象
   * @param {Object} many_obj 数据叠加时使用的变量
   * @return {undefined} undefined
   */
  _list_item_to_many_obj(item, many_obj){
    if(lodash.get(item,'mid'))
    {
      // 快速查询对象mid_obj增加数据
      many_obj.mid_obj[this.get_list_to_obj_key(item.mid,item.mid,'mid')] = item;
      // 需要解析的投注项赛事基础数据的路径
      const hps_key_arr = ['hps','hpsAdd','hpsData[0].hps','hpsData[0].hpsAdd',"hpsBold","hpsOvertime","hps15Minutes","hps5Minutes","hpsCorner","hpsPunish","hpsPenalty","hpsPromotion","hpsOutright","odds_info"];
      // 角球开关----------------------hpsCorner
      // 罚牌开关----------------------hpsPunish
      // 冠军开关----------------------hpsOutright
      // 晋级赛开关--------------------hpsPromotion
      // 加时赛开关--------------------hpsOvertime
      // 点球大战开关------------------hpsPenalty
      // 15分钟开关--------------------hps15Minutes
      // 5分钟开关 ----------------------hps5Minutes                              
      // 波胆开关-----------------------hpsBold
      // 主盘口------------------------hps
      // 副盘口------------------------hpsAdd
      // 赛事详情,所有投注数据----------odds_info

      // 投注项赛事列表数据
      let hps_data_arr = null
      hps_key_arr.forEach(hps_key_str => {
        // 设置投注项赛事列表数据
        hps_data_arr = lodash.get(item, hps_key_str)
        switch (hps_key_str) {
          // 主玩副盘口数据时
          case 'hpsData[0].hpsAdd':
          case 'hps':
          case 'hpsAdd':
          // 赛事详情所有玩法数据时
          case 'odds_info':
            if (lodash.get(hps_data_arr, 'length') && Array.isArray(hps_data_arr)) {
              // 遍历玩法数据
              hps_data_arr.forEach(item2 => {
                const fun = (item2)=>{
                  if(!lodash.get(item2,'hsw')){
                    item2.hsw = lodash.get(item,`play_obj.hpid_${item2.hpid}.hsw`);
                  }
                  // 玩法对象补偿
                  let play_obj_key = `hpid_${item2.chpid?item2.chpid:item2.hpid}`;
                  if(!lodash.get(item,`play_obj[${play_obj_key}]`)){
                    if(!item.play_obj){
                      item.play_obj = {};
                    }
                    const obj_temp = {};
                    for (const key in item2) {
                      if(!['hl','ol'].includes(key)){
                        obj_temp[key] = item2[key];
                      }
                    }
                    item.play_obj[play_obj_key] = obj_temp;
                  }
                  // 检查是否有盘口数据
                  if (lodash.get(item2,'hl.length') || lodash.get(item2,'ol.length')) {
                    let item_arr = [];
                    if(lodash.get(item2,'ol.length')){
                      item_arr = [item2]
                    } else{
                      item_arr = item2.hl;
                    }
                    // 遍历盘口数据
                    item_arr.forEach(item3 => {
                      if (item3) {
                        if (item3.hid) {
                          // 增加玩法信息到盘口级别
                          item3.mid = item.mid;
                          item3.hpid = item2.hpid;
                          item3.hsw = item2.hsw;
                          // 快速查询对象hl_obj增加数据
                          many_obj.hl_obj[this.get_list_to_obj_key(item.mid,item3.hid,'hl')] = item3;
                        }
                        if (lodash.get(item3, 'ol.length')) {
                          // 遍历投注项数据
                          item3.ol.forEach(item4 => {
                            // 处理ot是小数的情况,进行数据修正
                            let ot = ''; 
                            
                            if(item4.ot && item4.ot.includes('.')) {
                              ot = item4.ot.replace('.','-');
                            } else {
                              ot = item4.ot;
                            }
                            // 设置坑位信息
                            let _hn = item3.hn?`${item.mid}_${item2.chpid}_${item3.hn}_${ot}`:'';
                            // 押注项设置盘口状态
                            Object.assign(item4, {
                              _hpid: item2.hpid,
                              _chpid: item2.chpid,
                              _hs: (item3.hs ? item3.hs : 0),
                              _mhs: (item.mhs ? item.mhs : 0),
                              _mid: item.mid,
                              _hid: item3.hid,
                              _hn,
                              _hsw:item2.hsw,
                              _hipo:item3.hipo,
                              _csid:item.csid,
                              _ispo:item2.ispo || item.ispo,
                              os:Object.hasOwnProperty.call(item4,'os')?item4.os:1,
                            });
                            // 快速查询对象ol_obj增加数据
                            many_obj.ol_obj[this.get_list_to_obj_key(item.mid,item4.oid,'ol')] = item4;
                            if(_hn) {
                              // 快速查询对象hn_obj增加数据
                              many_obj.hn_obj[this.get_list_to_obj_key(item.mid,_hn,'hn')] = item4;
                            }
                          });
                        }
                      }
                    });
                  }
                }
                if(hps_key_str =='odds_info' && lodash.get(item2,'plays')){
                  const plays =lodash.get(item2,'plays');
                  plays.forEach(plays_items => {
                    fun(plays_items);
                  });
                }
                fun(item2);
              });
            }
            break;
          default:
            if (lodash.get(hps_data_arr, 'length') && Array.isArray(hps_data_arr)) {
              // 遍历玩法数据
              hps_data_arr.forEach(item2 => {
                if(!lodash.get(item2,'hsw')){
                  item2.hsw = lodash.get(item,`play_obj.hpid_${item2.hpid}.hsw`);
                }
                // 玩法对象补偿
                let play_obj_key = `hpid_${item2.chpid?item2.chpid:item2.hpid}`;
                if(!lodash.get(item,`play_obj[${play_obj_key}]`)){
                  if(!item.play_obj){
                    item.play_obj = {};
                  }
                  const obj_temp = {};
                  for (const key in item2) {
                    if(!['hl','ol'].includes(key)){
                      obj_temp[key] = item2[key];
                    }
                  }
                  item.play_obj[play_obj_key] = obj_temp;
                }
                // 检查是否有盘口数据
                if (lodash.get(item2,'hl.ol.length') || lodash.get(item2,'hl[0].ol.length')) {
                  // if(item2.hl.ol.forEach(item3 => {
                  if(lodash.get(item2,'hl')){
                    let item3 = lodash.get(item2,'hl[0]') || lodash.get(item2,'hl');
                    if (item3) {
                      if (item3.hid) {
                        // 增加玩法信息到盘口级别
                        item3.mid = item.mid;
                        item3.hpid = item2.hpid;
                        item3.hsw = item2.hsw;
                        // 快速查询对象hl_obj增加数据
                        many_obj.hl_obj[this.get_list_to_obj_key(item.mid,item3.hid,'hl')] = item3;
                      }
                      if (lodash.get(item3, 'ol.length')) {
                        // 遍历投注项数据
                        item3.ol.forEach(item4 => {
                          // 处理ot是小数的情况,进行数据修正
                          let ot = '';
                          if(!item4){
                            return
                          }
                          if(item4.ot && item4.ot.includes('.')) {
                            ot = item4.ot.replace('.','-');
                          } else {
                            ot = item4.ot;
                          }
                          // 设置坑位信息
                          let _hn = item3.hn?`${item.mid}_${item2.chpid}_${item3.hn}_${ot}`:'';
                          // 押注项设置盘口状态
                          Object.assign(item4, {
                            _hpid: item2.hpid,
                            _chpid: item2.chpid,
                            _hs: (item3.hs ? item3.hs : 0),
                            _mhs: (item.mhs ? item.mhs : 0),
                            _mid: item.mid,
                            _hid: item3.hid,
                            _hn,
                            _hsw:item2.hsw,
                            _hipo:item3.hipo,
                            _csid:item.csid,
                            _ispo:item2.ispo || item.ispo,
                            os:Object.hasOwnProperty.call(item4,'os')?item4.os:1,
                          });
                          // 快速查询对象ol_obj增加数据
                          many_obj.ol_obj[this.get_list_to_obj_key(item.mid,item4.oid,'ol')] = item4;
                          if(_hn) {
                            // 快速查询对象hn_obj增加数据
                            many_obj.hn_obj[this.get_list_to_obj_key(item.mid,_hn,'hn')] = item4;
                          }
                        });
                      }
                    }
                  }
                }
              });
            } 
            break;
        }
      });
    }
  }
   /**
   * @description: 获取将赛事详情非坑位对象,以便提高操作速度和效率
   * @param {String} mid 赛事对象
   * @param {Array} key_arr 需要获取的值key ["hpsBold","hpsOvertime"]等
   * @return {undefined} undefined
   */
   get_match_to_map_obj(mid,key_arr){
    const item= this.get_quick_mid_obj(mid)
    let map_obj={}
    if(item)
    {
      try {
        // 需要解析的投注项赛事基础数据的路径
        const hps_key_arr =key_arr?key_arr:
        ['hps','hpsAdd','hpsData[0].hps','hpsData[0].hpsAdd',"hpsBold","hpsOvertime","hps15Minutes","hps5Minutes","hpsCorner","hpsPunish","hpsPenalty","hpsPromotion","hpsOutright","odds_info"];
        // 角球开关----------------------hpsCorner
        // 罚牌开关----------------------hpsPunish
        // 冠军开关----------------------hpsOutright
        // 晋级赛开关--------------------hpsPromotion
        // 加时赛开关--------------------hpsOvertime
        // 点球大战开关------------------hpsPenalty
        // 15分钟开关--------------------hps15Minutes
        // 5分钟开关 ----------------------hps5Minutes                              
        // 波胆开关-----------------------hpsBold
        // 主盘口------------------------hps
        // 副盘口------------------------hpsAdd
        // 赛事详情,所有投注数据----------odds_info

        // 投注项赛事列表数据
        let hps_data_arr = null
        hps_key_arr.forEach(hps_key_str => {
          // 设置投注项赛事列表数据
          hps_data_arr = lodash.get(item, hps_key_str)
          switch (hps_key_str) {
            // 主玩副盘口数据时
            case 'hpsData[0].hpsAdd':
            case 'hps':
            case 'hpsAdd':
            // 赛事详情所有玩法数据时
            case 'odds_info':
              if (lodash.get(hps_data_arr, 'length') && Array.isArray(hps_data_arr)) {
                // 遍历玩法数据
                hps_data_arr.forEach(item2 => {
                  const fun = (item2)=>{
                    if(!lodash.get(item2,'hsw')){
                      item2.hsw = lodash.get(item,`play_obj.hpid_${item2.hpid}.hsw`);
                    }
                    // 玩法对象补偿
                    let play_obj_key = `hpid_${item2.chpid?item2.chpid:item2.hpid}`;
                    if(!lodash.get(item,`play_obj[${play_obj_key}]`)){
                      if(!item.play_obj){
                        item.play_obj = {};
                      }
                      const obj_temp = {};
                      for (const key in item2) {
                        if(!['hl','ol'].includes(key)){
                          obj_temp[key] = item2[key];
                        }
                      }
                      item.play_obj[play_obj_key] = obj_temp;
                    }
                    // 检查是否有盘口数据
                    if (lodash.get(item2,'hl.length') || lodash.get(item2,'ol.length')) {
                      let item_arr = [];
                      if(lodash.get(item2,'ol.length')){
                        item_arr = [item2]
                      } else{
                        item_arr = item2.hl;
                      }
                      // 遍历盘口数据
                      item_arr.forEach(item3 => {
                        if (item3) {
                          if (item3.hid) {
                            // 增加玩法信息到盘口级别
                            item3.mid = item.mid;
                            item3.hpid = item2.hpid;
                            item3.hsw = item2.hsw;
                          }
                          if (lodash.get(item3, 'ol.length')) {
                            // 遍历投注项数据
                            item3.ol.forEach(item4 => {
                              // 处理ot是小数的情况,进行数据修正
                              let ot = ''; 
                              if(item4.ot && item4.ot.includes('.')) {
                                ot = item4.ot.replace('.','-');
                              } else {
                                ot = item4.ot;
                              }
                              // 设置坑位信息
                              if(!item3.hn) {
                              let _hn = `${item.mid}_${item2.hpid}_1_${ot}`;
                                // 押注项设置盘口状态
                                Object.assign(item4, {
                                  _hpid: item2.hpid,
                                  _chpid: item2.chpid,
                                  _hs: (item3.hs ? item3.hs : 0),
                                  _mhs: (item.mhs ? item.mhs : 0),
                                  _mid: item.mid,
                                  _hid: item3.hid,
                                  _hn,
                                  _hsw:item2.hsw,
                                  _hipo:item3.hipo,
                                  _csid:item.csid,
                                  _ispo:item2.ispo || item.ispo,
                                  os:Object.hasOwnProperty.call(item4,'os')?item4.os:1,
                                });
                                // 快速查询对象hn_obj增加数据
                                map_obj[this.get_list_to_obj_key(item.mid,_hn,'hn')] = item4;
                              }
                            });
                          }
                        }
                      });
                    }
                  }
                  if(hps_key_str =='odds_info' && lodash.get(item2,'plays')){
                    const plays =lodash.get(item2,'plays');
                    plays.forEach(plays_items => {
                      fun(plays_items);
                    });
                  }
                  fun(item2);
                });
              }
              break;
            default:
              if (lodash.get(hps_data_arr, 'length') && Array.isArray(hps_data_arr)) {
                // 遍历玩法数据
                hps_data_arr.forEach(item2 => {
                  if(!lodash.get(item2,'hsw')){
                    item2.hsw = lodash.get(item,`play_obj.hpid_${item2.hpid}.hsw`);
                  }
                  // 玩法对象补偿
                  let play_obj_key = `hpid_${item2.chpid?item2.chpid:item2.hpid}`;
                  if(!lodash.get(item,`play_obj[${play_obj_key}]`)){
                    if(!item.play_obj){
                      item.play_obj = {};
                    }
                    const obj_temp = {};
                    for (const key in item2) {
                      if(!['hl','ol'].includes(key)){
                        obj_temp[key] = item2[key];
                      }
                    }
                    item.play_obj[play_obj_key] = obj_temp;
                  }
                  // 检查是否有盘口数据
                  if (lodash.get(item2,'hl.ol.length')  || lodash.get(item2,'hl[0].ol.length')) {
                    // if(item2.hl.ol.forEach(item3 => {
                    if(lodash.get(item2,'hl')){
                      let item3 = lodash.get(item2,'hl[0]') || lodash.get(item2,'hl');
                      if (item3) {
                        if (item3.hid) {
                          // 增加玩法信息到盘口级别
                          item3.mid = item.mid;
                          item3.hpid = item2.hpid;
                          item3.hsw = item2.hsw;
                        }
                        if (lodash.get(item3, 'ol.length')) {
                          // 遍历投注项数据
                          item3.ol.forEach(item4 => {
                            // 处理ot是小数的情况,进行数据修正
                            let ot = '';
                            if(item4.ot && item4.ot.includes('.')) {
                              ot = item4.ot.replace('.','-');
                            } else {
                              ot = item4.ot;
                            }
                            // 设置非坑位信息
                            if(!item3.hn) {
                            let _hn =`${item.mid}_${item2.hpid}_1_${ot}`;
                              // 押注项设置盘口状态
                            Object.assign(item4, {
                              _hpid: item2.hpid,
                              _chpid: item2.chpid,
                              _hs: (item3.hs ? item3.hs : 0),
                              _mhs: (item.mhs ? item.mhs : 0),
                              _mid: item.mid,
                              _hid: item3.hid,
                              _hn,
                              _hsw:item2.hsw,
                              _hipo:item3.hipo,
                              _csid:item.csid,
                              _ispo:item2.ispo || item.ispo,
                              os:Object.hasOwnProperty.call(item4,'os')?item4.os:1,
                            });
                              // 快速查询对象hn_obj增加数据
                              map_obj[this.get_list_to_obj_key(item.mid,_hn,'hn')] = item4;
                            }
                          });
                        }
                      }
                    }
                  }
                });
              } 
              break;
          }
        });
      } catch (error) {
          console.error('get_match_to_map_obj',error)
      }
    }
    return map_obj;
  }
  /**
   * @description: 赛事详情模块设置赛事信息数据
   * @param {Object} match_details 赛事对象
   * @param {Array} 列表 赛事列表
   * @param {Object} param 是否数据合并
   * @return
   */
  set_match_details(match_details, odds_info, param={}){
    if(!match_details){
      const mid = lodash.get(odds_info,'[0].mid') || lodash.get(odds_info, '[0].plays[0].mid');
      if(mid){
        match_details = this.get_quick_mid_obj(mid);
      } else {
        return;
      }
    }
    if(match_details){
      this.type = param.type || 'match';
      // 格式化列表赛事(部分数组转对象)
      this.list_serialized_match_obj([match_details]);
      if(odds_info){
        // 设置赔率
        match_details.odds_info = odds_info;
      }
      // 列表数据同步到快捷操作对象中
      this._list_to_obj_fun([match_details], this.list_to_obj);
      // 设置激活的赛事mids数组
      this.mids_ation=[match_details.mid];
      // ws命令赛事订阅
      this.ws_ctr.scmd_c8();
      this.upd_data_version();
    }
  }

  /**
   * @description: 将list格式化成多个obj对象
   * @param {Array} list 赛事列表
   * @param {Number} timestap 时间戳
   * @return {Object} 将赛事列表转成成对象,提高检索速度
   */
  _list_to_many_obj(list, timestap){
    let many_obj = {ol_obj:{}, hl_obj:{}, hn_obj: {}, mid_obj:{}}
    if(list && (list instanceof Array))
    {
      list.forEach((item,i) => {
        this._list_item_to_many_obj(item,many_obj);
      });
    }
    return many_obj;
  }


  /**
   * @description: 获取赛事列表中的赛事mid索引位置
   * @param {String} mid 赛事标识
   * @param {String} list 赛事列表数据
   * @return {String}  指定赛事列表中的位置
   */
  get_mid_index_form_list(mid, list){
    let res = -1;
    if(mid && list) {
      for (let i = 0; i < list.length; i++) {
        if(list[i].mid == mid){
          res = i;
          break;
        }
      }
    }
    return res;
  }
  /**
   * @description: 删除赛事(释放赛事的所有数据,并从关联的列表)
   * @param {String} mid 赛事标识
   * @param {String} list 赛事列表数据
   * @return {String}  指定赛事列表中的位置
   */
  remove_match(mid){
    let mid_obj_key = this.get_list_to_obj_key(mid, mid,'mid');
    // 快速赛事对象查找赛事
    if(mid && this.list_to_obj.mid_obj[mid_obj_key]){
      // 清除赛事的所有数据
      this._clear_obj(this.list_to_obj.mid_obj[mid_obj_key]);
    }
    // 删除快速查询对象中指定赛事的所有赛事关联的挂载点
    this.delete_match_from_quick_query_obj(mid, mid,'mid');
  }

  /**
   * @description: 删除快速查询中指定赛事和编号的挂载点(不清空赛事数据)
   * @param {String} mid 赛事标识
   * @param {String} id 精准查询使用到的id
   * @param {String} type 精准查询id类型(mid/ol/hl/hn)
   * @param {Array} arr 需求清除的对象数组,默认为快速检索对象数组
   */
  delete_match_from_quick_query_obj(mid,id,type='mid',arr=[this.list_to_obj]){
    if(mid) {
      const quick_query_str = this.get_list_to_obj_key(mid,id,type);
      //遍历快速查询对象
      arr.forEach(obj_temp => {
        for (const key in obj_temp) {
          const obj1 = obj_temp[key];
          if (obj1) {
            //遍历快速查询中的二级对象
            for (const key2 in obj1) {
              const obj2 = obj1[key2];
              // 找到指定赛事的对象
              if (key2 && key2.startsWith(quick_query_str)) {
                // 删除其中的挂载点
                delete obj1[key2];
              }
            }
            
          }
        }
      });
    }
  }



  /**
   * @description: 获取list_to_obj中的赛事
   * @param {Array} mids 赛事mid集合
   * @param {String} type 返回的类型(Object/Array)
   * @return {Object/Array} 赛事信息集合
   */
  get_match_object_form_list_to_obj(mids, type='Object'){
    let res = null;
    if(type=='Array'){
      res = [];
    } else {
      res = {};
    }
    try {
      mids.forEach(mid => {
        const temp = lodash.get(this.list_to_obj,`mid_obj[${mid}_]`);
        if(type=='Array'){
          res.push(temp);
        } else {
          res[mid] = temp;
        }
      });
    } catch (error) {
      console.error('_get_match_arr_form_list_to_obj:',error);
    }
    return res;
  }

  /**
   * @description: 快速检索数据对象合并逻辑
   * @param {Object} many_obj_old 老数据对象
   * @param {Object} many_obj_new 新数据对象
   * @param {Array} mids 赛事mid数组(为空时表示取obj所有key值)
   * @param {Boolean} gc 是否回收垃圾
   * @return 
   */
  _quick_query_obj_assign(many_obj_old, many_obj_new, mids, gc=true){
    // 获取老数据对象keys
    let old_ol_obj_keys = this._get_quick_query_obj_obj_keys(many_obj_old.ol_obj, mids);
    let old_hn_obj_keys = this._get_quick_query_obj_obj_keys(many_obj_old.hn_obj, mids);
    let old_hl_obj_keys = this._get_quick_query_obj_obj_keys(many_obj_old.hl_obj, mids);

    // 获取新数据对象keys
    let new_ol_obj_keys = this._get_quick_query_obj_obj_keys(many_obj_new.ol_obj, mids);
    let new_hn_obj_keys = this._get_quick_query_obj_obj_keys(many_obj_new.hn_obj, mids);
    let new_hl_obj_keys = this._get_quick_query_obj_obj_keys(many_obj_new.hl_obj, mids);
    // 快速检索对象数据合并
    this.match_assign(many_obj_old.mid_obj, many_obj_new.mid_obj);
    this.ol_obj_assign(many_obj_old.ol_obj, many_obj_new.ol_obj);
    this.hn_obj_assign(many_obj_old.hn_obj, many_obj_new.hn_obj);
    this.hl_obj_assign(many_obj_old.hl_obj, many_obj_new.hl_obj);
    if(gc){
      // 获取无用数据
      let ol_obj_keys = lodash.difference(old_ol_obj_keys, new_ol_obj_keys);
      let hn_obj_keys = lodash.difference(old_hn_obj_keys, new_hn_obj_keys);
      let hl_obj_keys = lodash.difference(old_hl_obj_keys, new_hl_obj_keys);
      // 删除无用数据
      ol_obj_keys.forEach(keys => {
        delete many_obj_old.ol_obj[keys];
      });
      hn_obj_keys.forEach(keys => {
        delete many_obj_old.hn_obj[keys];
      });
      hl_obj_keys.forEach(keys => {
        delete many_obj_old.hl_obj[keys];
      });
    }
  }

  /**
   * @description: 获取快速检索对象中指定赛事的所以对象key值
   * @param {Object} obj 快速检索对象
   * @param {Array} mids 赛事mids(为空时表示取obj所有key值)
   * @return {Array} key值列表
   */
  _get_quick_query_obj_obj_keys(obj,mids){
    let res = [];
    if(obj){
      if(mids){
        mids.forEach(item => {
          const mid = item+'_';
          for (const key in obj) {
            const element = obj[key];
            if(key && key.startsWith(mid)) {
              res.push(key)
            }
          }
        });
      } else {
        res = Object.keys(obj);
      }
    }
    return res;
  }

  /**
   * @description: 删除列表之外赛事数据(不同步数据)
   * @param {Array} list 赛事列表
   */
  clear_list_other(list){
    // 获取mids列表
    const list_keys = Object.keys(this.list_to_obj.mid_obj);
    // 模拟组装空列表
    const list_mid_obj = [];
    list_keys.forEach(item => {
      if(item)
      {
        const mid = item.replace('_','');
        list_mid_obj.push({mid});
      }
    });
    // 比对列表
    let obj = this.list_comparison(list_mid_obj, list);
    // 删除赛事逻辑
    for (const key in obj.del) {
      if (key) {
        const mid = key.replace('_','');
        // 删除指定赛事
        this.remove_match(mid);
      }
    }
  }
  /**
   * @description: 清空赛事对象
   * @param {String,Number} midAny 赛事mid
   * @return {undefined} undefined
   */
  clear_mid_obj(mid){
    this.delete_match_from_quick_query_obj(mid,mid,'mid');
  }

  /**
   * @description: 清空盘口对象
   * @param {String,Number} hid 盘口编号
   * @return {undefined} undefined
   */
  clear_hl_obj(mid,hid){
    this.delete_match_from_quick_query_obj(mid,hid,'hl');
  }

  /**
   * @description: 清空投注项对象
   * @param {String,Number} oid 投注项编号
   * @return {undefined} undefined
   */
  clear_ol_obj(mid,oid){
    this.delete_match_from_quick_query_obj(mid,oid,'ol');
  }

  /**
   * @description: 清空坑位投注项对象
   * @param {String,Number} hn 坑位投注项编号
   * @return {undefined} undefined
   */
  clear_hn_obj(mid,hn){
    this.delete_match_from_quick_query_obj(mid,hn,'hn');
  }

  /**
   * @description: 清空对象
   * @param {Object,Array} any 要清空的对象和列表
   * @return {undefined} undefined
   */
  _clear_obj(any) {
    if(typeof (any) == "object")
    {
      // 对象时
      for (const key in any) {
        // 进入递归检测
        this._clear_obj(any[key]);
        // 删除挂载点
        delete any[key];
      }
      if(Array.isArray(any))
      {
        // 数组时清空数组
        any.length = 0;
      }
    }
  }

  /**
   * @description: 数据合并优化版函数
   * @param {*} old_obj 旧数据
   * @param {*} new_obj 新数据
   */
  assign_with(old_obj, new_obj){
    let customizer = (old_value, new_value) => {
      let res = old_value;
      // 数据类型
      let type = typeof(old_value);
      // console.error('old_value=',type);
      if('object' == type){
        if(Array.isArray(old_value)){
          type = 'array';
        }
      }
      // console.error(type,'=====>',old_value);
      // 根据数据类型进行逻辑处理
      if('object' == type){
        // 为对象的操作
        if(!new_value){
          res = new_value;
        } else {
          for (const key in old_value) {
            if (old_value[key]) {
              if(new_value[key] == undefined){
                // 删除右侧没有的对象key数据
                delete old_value[key]
              } else {
                // if(typeof(old_value[key]) == 'object'){
                //   // this.mergeWith2(old_value[key], new_value[key],0);
                // }
              }
            }
          }
        }
      } else if('array' == type){
        // console.error('new_value=',new_value);
        // 为数组的操作
        new_value && old_value && (old_value.length = new_value.length)
        // console.error('old_value===',JSON.stringify(old_value));
        // console.error('new_value===',JSON.stringify(new_value));
        for (let i = 0; i < new_value.length; i++) {
          const item = new_value[i];
          let type2 = typeof(item);
          if('object' == type2){
            if(Array.isArray(item)){
              type2 = 'array';
            }
          }
          // console.error(i,'-old_value=item==',JSON.stringify(old_value[i]));
          // console.error(i,'-new_value=item==',JSON.stringify(item));
          if('object' == type2){
            if(item){
              this.assign_with(old_value[i],item);
            } else {
              old_value[i] = new_value[i];
            }
          } else if('array' == type2){
            item && this.assign_with(old_value[i],item);
          }else {
            /** #TODO:  数据没有被合并的问题 */
            old_value[i] = new_value[i]
          }
          // console.error(i,'-old_value=item=>>>=',JSON.stringify(old_value[i]));
          // console.error(i,'-new_value=item=>>>=',JSON.stringify(item));
        }
        return old_value;
      } else {
        // 普通类型不做处理
      }
    }
    lodash.assignWith(old_obj, new_obj,customizer);
  }

  /**
   * @description: 列表数据合并优化版函数
   * @param {*} old_list 旧数据
   * @param {*} new_list 新数据
   */
  assign_with_list(old_list, new_list){
    if(old_list && new_list && Array.isArray(new_list)){
      // 设置长度
      old_list.length = new_list.length;
      for (let i = 0; i < old_list.length; i++) {
        const item_new = old_list[i];
        // 判断类型
        let type = typeof(item_new);
        if('object' == type){
          if(Array.isArray(item_new)){
            type = 'array';
          }
        }
        // 当确认是对象时
        if('object' == type){
          // 数据合并
          this.assign_with(item_new, new_list[i]);
        } else if('array' == type){
          // 数据合并
          this.assign_with_list(item_new, new_list[i]);
        } else {
          old_list[i] = new_list[i];
        }
      }
    }
  }
  /**
   * @description: 更新赛事ms状态
   * @param {Object} mid 赛事状态信息 {mid:'',hid:'',oid:'', mhs:0, hs:0, os:0};
   */
  upd_match_all_status(obj){
    if(obj && Object.hasOwnProperty.call(obj, 'mid')){
      const mid = obj.mid;
      // mhs更新
      if(Object.hasOwnProperty.call(obj, 'mhs')){
        this._quick_query_obj_upd_status_mhs(this.list_to_obj, mid, obj.mhs);
      }
      // hs更新
      if(Object.hasOwnProperty.call(obj, 'hid') && Object.hasOwnProperty.call(obj, 'hs')){
        this._quick_query_obj_upd_status_hs(this.list_to_obj, mid, obj.hid, obj.hs);
      }

      // os更新
      if(Object.hasOwnProperty.call(obj, 'oid') && Object.hasOwnProperty.call(obj, 'os')){
        this._quick_query_obj_upd_status_os(this.list_to_obj, mid, obj.oid, obj.os);
      }
    }
  }

  /**
   * @description:快速检索对象赛事mhs值更新
   * @param {Object} quick_query_obj 快速检索对象
   * @param {String} mid 赛事mid
   * @param {Number} mhs 赛事mhs值
   * @return {undefined} undefined
   */
  _quick_query_obj_upd_status_mhs(quick_query_obj, mid, mhs){
    if(quick_query_obj && mid){
      let mid_str = this.get_list_to_obj_key(mid,mid,'mid');
      // mid_obj对象数据同步
      let match = quick_query_obj.mid_obj[mid_str];
      if(match){
        match.mhs = mhs;
      }
      // ol_obj对象数据同步
      let object = quick_query_obj.ol_obj;
      for (const key in object) {
        if (key && key.startsWith(mid_str) && object[key]) {
          object[key]._mhs = mhs;
        }
      }

      // hn_obj对象数据同步
      object = quick_query_obj.hn_obj;
      for (const key in object) {
        if (key && key.startsWith(mid_str) && object[key]) {
          object[key]._mhs = mhs;
        }
      }
    }
  }

  /**
   * @description:快速检索对象赛事玩法hs值更新
   * @param {Object} quick_query_obj 快速检索对象
   * @param {String} hid 玩法盘口hid
   * @param {Number} hs 赛事hs值
   * @return {undefined} undefined
   */
  _quick_query_obj_upd_status_hs(quick_query_obj, mid, hid, hs){
    if(quick_query_obj && hid){
      let id_str = this.get_list_to_obj_key(mid,hid,'hl');
      // 快速获取数据
      let obj = quick_query_obj.hl_obj[id_str];
      if(obj){
        // 设置盘口级别状态
        obj.hs = hs;
        let obj_ol = obj.ol;
        if(obj_ol){
          obj_ol.forEach(item => {
            // 设置投注项级别状态
            item && (item._hs = hs);
          });
        }
      }
    }
  }

  /**
   * @description:快速检索对象赛事玩法os值更新
   * @param {Object} quick_query_obj 快速检索对象
   * @param {String} oid 投注项oid
   * @param {Number} os 赛事os值
   * @return {undefined} undefined
   */
  _quick_query_obj_upd_status_os(quick_query_obj,mid, oid, os){
    if(quick_query_obj && oid){
      let id_str = this.get_list_to_obj_key(mid,oid,'ol');
      // 快速获取数据
      let obj = quick_query_obj.ol_obj[id_str];
      if(obj){
        // 设置盘口级别状态
        obj.os = os;
      }
    } 
  }

  /**
   * @description: 清除所有数据
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  _clear_quick_query_obj(quick_query_obj){
    this._clear_obj(quick_query_obj.ol_obj);
    this._clear_obj(quick_query_obj.hl_obj);
    this._clear_obj(quick_query_obj.hn_obj);
    this._clear_obj(quick_query_obj.mid_obj);
  }

  /**
   * @description: 仓库清除对象数据
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  clear(){
    // 清除快速检索对象
    this._clear_quick_query_obj(this.list_to_obj);
    this.mids_ation = [];
    this._clear_obj(this.cache_match);
    this.cache_match = {};
    this._clear_obj(this.ws_match_key_upd_time_cache);
    this.ws_match_key_upd_time_cache = {};
  }

  /**
   * @description: 销毁函数-清除所有数据和对象
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  destroy(){
    // ws命令赛事订阅删除
    this.ws_ctr.scmd_c8('del');
    this._clear_quick_query_obj(this.list_to_obj);
    this._clear_obj(this.list_to_obj);
    this._clear_obj(this.MATCH_UPD_TIME_KEYS);
    this._clear_obj(this.cache);
    this._clear_obj(this.cache_match);
    this._clear_obj(this.ws_match_key_upd_time_cache);
    this._clear_obj(this.cache_oid);
    this.mids_ation = [];
    // 销毁ws数据通信实例
    this.ws_ctr && this.ws_ctr.destroy();
  }
  /**
   * @description: 冒泡排序(原来地址顺序不发生变化---保持原来的顺序不变,返回新的列表但是子项使用原来的地址)
   * @param {mid} 赛事id
   * @return {undefined} undefined
   */
  listSortNew(mid){
    let list = this.get_quick_mid_obj(mid)?.odds_info;
    var list_ = [];
    if(list && (list instanceof Array))
    {
      for (let i = 0; i < list.length; i++) {
        if(list[i].hton!=0)
        {
          list_.push(list[i]);
        }
      }
      if(list_.length)
      {
        var len = list_.length-1;
        var t = '';
        for (let i = 0; i < len; i++) {
          for (let k = 0; k < len-i; k++) {
            if(parseInt(list_[k].hton) < parseInt(list_[k+1].hton)){
                t = list_[k];
                list_[k] = list_[k+1];
                list_[k+1] = t;
            }
          }
        }
      }
    }
    // 虚拟赛马/赛狗/摩托车/泥地摩托车详情页所有投注--热门需固定置顶在首位
    list_.sort((a, b) => {
      let a_ = a.team?1:0;
      let b_ = b.team?1:0;
      return b_- a_;
    });
    return list_;
  }
   /**
   * @description: 非置顶的玩法项冒泡排序
   * @param @param {mid} 赛事id
   * @return {undefined} undefined
   */
  listSortNormal(mid){
   let list = this.get_quick_mid_obj(mid)?.odds_info;
   var list_normal = [];
   if(list && (list instanceof Array))
   {
     for (let i = 0; i < list.length; i++) {
       if(list[i].hton == 0)
       {
         list_normal.push(list[i]);
       }
     }
     if(list_normal.length)
     {
       var len = list_normal.length-1;
       var t = '';
       for (let i = 0; i < len; i++) {
         for (let k = 0; k < len-i; k++) {
           if(parseInt(list_normal[k].hpon) > parseInt(list_normal[k+1].hpon)){
               t = list_normal[k];
               list_normal[k] = list_normal[k+1];
               list_normal[k+1] = t;
           }
         }
       }
     }
   }
   return list_normal;
  }
  /**
   * @description: 强行发送C8赛事订阅命令(ws断开后重新链接使用,默认缓存上次的订阅数据)
   */
  scmd_c8_ws_reconnect(){
    // 发送C8赛事订阅命令
    this.ws_ctr.scmd_c8();
  }
}

