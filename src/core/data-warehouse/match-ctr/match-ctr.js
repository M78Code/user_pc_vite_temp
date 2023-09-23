/*
 * @Author: hanmar
 * @Date: 2023-08-20 12:45:19
 * @Description: h5/pc赛事列表和赛事详情等所有赛事关联模块仓库数据管理(所有赛事信息数据共同处理)-实现快速检索,赛事数据合并逻辑,ws数据推送实时数据同步
 * 
 * h5和pc赛事列表使用
 * 
 * MatchDataWarehouseInstance.set_list(list); 设置全部列表数据-初次使用
 * MatchDataWarehouseInstance.set_list(list,1); 同步更新全部列表数据(对部分赛事数据进行删除和更新数据合并逻辑操作)
 * MatchDataWarehouseInstance.set_quick_query_list(list); 设置快速查询对象列表数据-初次使用
 * MatchDataWarehouseInstance.set_quick_query_list(list,1); 同步更新快速查询对象列表数据(对部分赛事数据进行删除和更新数据合并逻辑操作)
 * 
 * 
 * h5和pc赛事详情页面使用
 * MatchDataWarehouseInstance.set_list_from_match_details(match_details); 设置赛事基本信息-初次使用
 * MatchDataWarehouseInstance.set_list_from_match_details(match_details,1); 同步更新赛事基本信息(对部分赛事数据进行删除和更新数据合并逻辑操作)
 * MatchDataWarehouseInstance.set_quick_query_list_from_match_details(match_details_odds_info) 设置赛事详情的所有玩法数据-初次使用
 * MatchDataWarehouseInstance.set_quick_query_list_from_match_details(match_details_odds_info,1) 同步更新赛事详情的所有玩法数据(对部分赛事数据进行删除和更新数据合并逻辑操作)
 * 
 * 删除指定赛事
 * MatchDataWarehouseInstance.remove_match(mid); 删除指定mid的赛事数据并从列表中移除,释放内存
 * 
 * 更新指定赛事数据
 * MatchDataWarehouseInstance.upd_match(match); 更新赛事数据-深度合并数据(有盘口信息合并时使用)
 * MatchDataWarehouseInstance.upd_match(match, 1); 更新赛事数据-简单合并数据(无盘口信息合并时使用)
 */
import MatchDataBaseWS from  "./match-ctr-ws.js"
class MatchDataBase
{
  /**
   * @description: 构造函数
   * @return {undefined} undefined
   */
  constructor(params={})
  {

    let { name_code='',set_list_to_obj } = params
    if(!name_code){
      console.error('MatchDataBase -赛事数据仓库-必须有实例化名字标识---');
      return false
    }

    // 实例化名字标识
    this.name_code = name_code;

    // 是否启动this.list转换this.list_to_obj
    this.set_list_to_obj = set_list_to_obj;
    
    // 设置ws数据通信实例
    this.ws_ctr = new MatchDataBaseWS(this);

    // 使用类型:类表-list,赛事详情-match
    this.type = '';

    // 初始化数据
    this.init();
  }


  /**
   * @description: 数据初始化
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  init(){
    // 所有赛事列表数据
    this.list = [];
    // 所有赛事列表数据转obj对象
    this.list_to_obj = {
      // 页面显示赛事投注项对象
      ol_obj:{},
      // 页面显示赛事盘口对象
      hl_obj:{},
      // 页面显示赛事坑位对象
      hn_obj:{},
      // 页面显示赛事赛事对象
      mid_obj:{},
    };
    // 页面显示的赛事列表数据,this.quick_query_list.list的部分数据
    this.quick_query_list = [];
    // 页面显示赛事快速查询对象
    this.quick_query_obj = {
      // 页面显示赛事投注项对象
      ol_obj:{},
      // 页面显示赛事盘口对象
      hl_obj:{},
      // 页面显示赛事坑位对象
      hn_obj:{},
      // 页面显示赛事赛事对象
      mid_obj:{},
    }
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
    // 所有投注项动态数据时间更新
    this.cache_oid={
    };
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
   * @description: list转字典
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
      this.assign_with(match_old, match_new);
    }
  }

  /**
   * @description: 赛事数据合并
   * @param {Object} match_old 旧赛事
   * @return {Object} match_new 新赛事
   */
  ol_obj_assign(ol_obj_old, ol_obj_new){
    if(ol_obj_old && ol_obj_new){
      this.assign_with(ol_obj_old, ol_obj_new);
    }
  }

  /**
   * @description: 赛事数据合并
   * @param {Object} match_old 旧赛事
   * @return {Object} match_new 新赛事
   */
  hn_obj_assign(hn_obj_old, hn_obj_new){
    if(hn_obj_old && hn_obj_new){
      this.assign_with(hn_obj_old, hn_obj_new);
    }
  }

  /**
   * @description: 赛事数据合并
   * @param {Object} match_old 旧赛事
   * @return {Object} match_new 新赛事
   */
  hl_obj_assign(hl_obj_old, hl_obj_new){
    if(hl_obj_old && hl_obj_new){
      this.assign_with(hl_obj_old, hl_obj_new);
    }
  }

  
  /**
   * @description: 获取快速查询对象中的指定mid赛事对象
   * @param {String} mid 赛事mid
   * @return {Object} 赛事
   */
  get_quick_mid_obj(mid){
    // 获取指定mid的赛事
    return this.quick_query_obj.mid_obj[this.get_format_quick_query_key(mid,mid,'mid')];
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
    // 遍历接口比分数据 转成比分对象
    lodash.each(msc, score_str => {
      let [key,value] = score_str && score_str.split('|') || []
      if(value){
        let [home,away] = value.split(':')
        score_obj[key] = {home,away}
      }
    })
    return  score_obj
  }
  /**
   * @description: 格式化列表数据(比分数组转对象)
   * @param {Object} list 所有列表数据
   */
  list_serialized_match_obj(list){
    if(lodash.get(list,'length')){
      // 格式化比分信息
      list.forEach(match => {
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
                                  let res = `hpid_${o.hpid}`;
                                  if(o.hSpecial){
                                    // res = res +`_${o.hSpecial}`;
                                  }
                                  return res;
                                });
        // 数据赋值和合并逻辑
        if(play_obj){
          this.assign_with(play_obj, play_obj_temp)
        } else {
          match.play_obj = play_obj_temp;
        }
        // 设置赛事默认数据
        this.set_match_default_data(match);
        // 赛事数据格式化
        match && this.list_to_many_obj([match]);

      });
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
   * @Description 设置赛事默认数据
   * @param {Object} match 赛事信息
   * @param {undefined} undefined
  */
   set_match_default_data(match){
    // api数据更新时间
    match.api_update_time = new Date().getTime();
    // 是否有附加盘1
    match.has_add1 = false
    // 是否有附加盘2
    match.has_add2 = false
    // 设置是否显示当前局玩法 // 组件显示时,组件内进行设置
    match.is_show_cur_handicap = false
    // 主客队名称后面是否显示上半场字符串
    match.up_half_text = '' // 组件显示时,组件内进行设置
    // 当前局盘口列表
    match.cur_handicap_list = [] // 特定模版才会使用(模版7)
    // 足球角球玩法tab
    // match.tab_play_keys = this.get_tab_play_keys(match);
    // 是否有其他玩法
    match.has_other_play = ((match.tab_play_keys || '').split(',')).length > 0; // 该值设置取决于match.tab_play_keys字段,可以删除
    // 默认比分数据
    // match.score_obj = utils.serialized_score([],true)
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

  /**
   * @description: 设置所有列表数据
   * @param {Object} list 所有列表数据
   * @param {Boolean} is_merge 是否进行合并数据同步(保证地址不变)
   */
  set_list(list,is_merge){
    if(list){
      // 设置使用类型:类表-list,赛事详情-match
      this.type = 'list';
      // 格式化列表赛事(部分数组转对象)
      this.list_serialized_match_obj(list);
      let obj = this.list_comparison(this.list,list);
      if(is_merge){
        // {add:{}, del:{}, upd:{}}
        // 需要更新的
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          const mid = item.mid;
          if(obj.upd[mid]){
          // 需要更新的赛事
          const match = this.quick_query_obj.mid_obj[this.get_format_quick_query_key(mid,mid,'mid')];
          if(match){
            // 赛事信息合并
            this.match_assign(match,obj.upd[mid]);
            // list列表数据同步
            list[i] = match;
          } else if(obj.del[mid]){
            // 搜索索引
            let index = this.get_mid_index_form_list(mid,this.quick_query_list);
            if(index != -1){
              // 删除快速搜索里面的赛事数据
              this.delete_match_from_quick_query_obj(mid,mid,'mid');
              // 同步删除快速查询列表中的数据
              this.quick_query_list.splice(index,1);
              // 赛事所有赛事里面的数据
              this.remove_match(mid);
              // 删除list_to_obj中无用垃圾数据
              this.delete_match_from_list_to_obj(mid, mid,'mid');
            }
          }
          }
        }

        // 释放快速查询列表中的无效数据
        for (let j = 0; j < this.quick_query_list.length; j++) {
          if(this.quick_query_list[j])
          {
            let mid_ = this.quick_query_list[j].mid;
            if(obj.del[mid_])
            {
              this.quick_query_list.splice(j,1);
              j--;
            }
          } else {
            this.quick_query_list.splice(j,1);
            j--;
          }
        }
        this.list.length = 0;
        this.assign_with_list(this.list,list);
      } else {
        this.list.length = 0;
        this.assign_with_list(this.list,list);
      }
      // console.error('this.list',JSON.stringify(this.list));
      // console.error('obj',JSON.stringify(obj));
      // 检测清除快速查询对象里面的垃圾挂载点
      for (const mid_ in obj.del) {
        if (mid_ && obj.del[mid_]) {
          // 删除已经结束的赛事数据
          this.remove_match(mid_);
          // 删除list_to_obj中无用垃圾数据
          this.delete_match_from_list_to_obj(mid_, mid_,'mid');
        }
      }
      if(this.set_list_to_obj){
        // 合并数据删除多余数据
        let list_to_obj = this.list_to_many_obj(this.list);
        this.assign_with(this.list_to_obj, list_to_obj);
        // 删除list_obj之前的无用赛事
      }
    }
  }

  set_quick_query_list(list,is_merge){
    let obj = this.list_comparison(this.quick_query_list,list);
    if(is_merge){
      // {add:{}, del:{}, upd:{}}
      // 需要更新的
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const mid = item.mid;
        if(obj.upd[mid]){
         // 需要更新的赛事
         const match = this.quick_query_obj.mid_obj[this.get_format_quick_query_key(mid,mid,'mid')];
         if(match){
          // 赛事信息合并
          this.match_assign(match,obj.upd[mid]);
          // list列表数据同步
          list[i] = match;
         } else if(obj.del[mid]){
          // 搜索索引
          let index = this.get_mid_index_form_list(mid,this.quick_query_list);
          if(index != -1){
            // 删除快速搜索里面的赛事数据
            this.delete_match_from_quick_query_obj(mid,mid,'mid');
            // 同步删除快速查询列表中的数据
            this.quick_query_list.splice(index,1);
          }
         }
        }
      }
      this.quick_query_list.length = 0;
      // 将要显示的赛事同步到快捷操作对象中
      this.list_to_quick_query_obj(list,is_merge);
    } else {
      this.quick_query_list.length = 0;
      Object.assign(this.quick_query_list,list);
      // 将要显示的赛事同步到快捷操作对象中
      this.list_to_quick_query_obj(list,is_merge);
    }
    // 检测清除快速查询对象里面的垃圾挂载点
    this.syn_del_quick_query_obj();
    // ws命令赛事订阅
    this.ws_ctr.scmd_c8();
  }
  /**
   * @description: 同步清除赛事快捷操作对象中的无用赛事数据挂载
   */
  syn_del_quick_query_obj(){
    // 快捷查询的赛事mid集合
    let mids = [];
    this.quick_query_list.forEach(item_temp => {
      if(item_temp && item_temp.mid){
        mids.push(item_temp.mid);
      }
    });
    //遍历快速查询对象
    for (const key in this.quick_query_obj) {
      const obj1 = this.quick_query_obj[key];
      if (obj1) {
        //遍历快速查询中的二级对象
        for (const key2 in obj1) {
          const obj2 = obj1[key2];
          // 找到指定赛事的对象
          if (key2) {
            // 拆分获取赛事mid
            const key2_arr = key2.split('_');
            if(key2_arr && key2_arr.length){
              if(!mids.includes(key2_arr[0])){
                // 快速查询对象中的赛事对象不在快速查询列表中时,删除其中的挂载点
                delete obj1[key2];
              }
            }
          }
        }
        
      }
    }
  }


  /**
   * @description: 将要显示的赛事同步到快捷操作对象中
   * @param {Object} list 页面显示列表数据
   * @param {Boolean} is_merge 是否进行合并数据同步(保证地址不变)
   * @param {Number} timestap 时间戳
   */
  list_to_quick_query_obj(list,is_merge,timestap){
    if(list){
      let obj = {};
      if(is_merge){
        // 比较差分
        obj = this.list_comparison(list,this.quick_query_list);
      } else {
        
      }
      if (this.quick_query_list !== list) {
        // 清空页面显示赛事数据
        this.quick_query_list.length = 0;
        // 设置页面显示赛事数据
        Object.assign(this.quick_query_list, list);
      }
      const many_obj = this.list_to_many_obj(list, timestap);
      // 快速检索对象数据合并
      this._quick_query_obj_assign(this.quick_query_obj, many_obj);
      // this.match_assign(this.quick_query_obj.mid_obj, many_obj.mid_obj);
      // this.ol_obj_assign(this.quick_query_obj.ol_obj, many_obj.ol_obj);
      // this.hn_obj_assign(this.quick_query_obj.hn_obj, many_obj.hn_obj);
      // this.hl_obj_assign(this.quick_query_obj.hl_obj, many_obj.hl_obj);
    }
    console.error('this.quick_query_obj',this.quick_query_obj)
  }
  /**
   * @description: 获取快速查询的key值
   * @param {String} mid 赛事标识
   * @param {String} id 精准查询使用到的id
   * @param {String} type 精准查询id类型(mid/ol/hl/hn)
   * @return {String} 快速查询的组合key值
   */
  get_format_quick_query_key(mid,id,type){
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
  list_item_to_many_obj(item, many_obj){
    if(lodash.get(item,'mid'))
    {
      // 快速查询对象mid_obj增加数据
      many_obj.mid_obj[this.get_format_quick_query_key(item.mid,item.mid,'mid')] = item;
      // 需要解析的投注项赛事基础数据的路径
      const hps_key_arr = ['hps','hpsAdd','hpsData[0].hps','hpsData[0].hpsAdd',"hpsBold","hpsOvertime","hps15Minutes","hps5Minutes","hpsCorner","hpsPunish","hpsPenalty","hpsPromotion","odds_info"];
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
                if(!lodash.get(item2,'hsw')){
                  item2.hsw = lodash.get(item,`play_obj.hpid_${item2.hpid}.hsw`);
                }
                // 检查是否有盘口数据
                if (lodash.get(item2,'hl.length')) {
                  // 遍历盘口数据
                  item2.hl.forEach(item3 => {
                    if (item3) {
                      if (item3.hid) {
                        // 增加玩法信息到盘口级别
                        item3.mid = item.mid;
                        item3.hpid = item2.hpid;
                        item3.hsw = item2.hsw;
                        // 快速查询对象hl_obj增加数据
                        many_obj.hl_obj[this.get_format_quick_query_key(item.mid,item3.hid,'hl')] = item3;
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
                            _hs: (item3.hs ? item3.hs : 0),
                            _mhs: (item.mhs ? item.mhs : 0),
                            _mid: item.mid,
                            _hid: item3.hid,
                            _hn,
                            _hsw:item2.hsw,
                            _hipo:item3.hipo,
                          });
                          // 快速查询对象ol_obj增加数据
                          many_obj.ol_obj[this.get_format_quick_query_key(item.mid,item4.oid,'ol')] = item4;
                          if(_hn) {
                            // 快速查询对象hn_obj增加数据
                            many_obj.hn_obj[this.get_format_quick_query_key(item.mid,_hn,'hn')] = item4;
                          }
                        });
                      }
                    }
                  });
                }
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
                // 检查是否有盘口数据
                if (lodash.get(item2,'hl.ol.length')) {
                  // if(item2.hl.ol.forEach(item3 => {
                  if(lodash.get(item2,'hl')){
                    let item3 = item2.hl;
                    if (item3) {
                      if (item3.hid) {
                        // 增加玩法信息到盘口级别
                        item3.mid = item.mid;
                        item3.hpid = item2.hpid;
                        item3.hsw = item2.hsw;
                        // 快速查询对象hl_obj增加数据
                        many_obj.hl_obj[this.get_format_quick_query_key(item.mid,item3.hid,'hl')] = item3;
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
                            _hs: (item3.hs ? item3.hs : 0),
                            _mhs: (item.mhs ? item.mhs : 0),
                            _mid: item.mid,
                            _hid: item3.hid,
                            _hn,
                            _hsw:item2.hsw,
                            _hipo:item3.hipo,
                          });
                          // 快速查询对象ol_obj增加数据
                          many_obj.ol_obj[this.get_format_quick_query_key(item.mid,item4.oid,'ol')] = item4;
                          if(_hn) {
                            // 快速查询对象hn_obj增加数据
                            many_obj.hn_obj[this.get_format_quick_query_key(item.mid,_hn,'hn')] = item4;
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
   * @description: 赛事详情模块设置赛事信息数据
   * @param {Object} match_details 赛事对象
   * @param {Boolean} is_merge 是否数据合并
   * @return
   */
  set_list_from_match_details(match_details, is_merge){
    if(match_details){
      // 设置使用类型:类表-list,赛事详情-match
      this.type = 'match';
      // 格式化列表赛事(部分数组转对象)
      this.list_serialized_match_obj([match_details]);
      if(is_merge){
        // 合并模式时,获取赛事信息
        const match=lodash.get(this.list,'[0]');
        if(match){
          // 进行数据合并
          this.assign_with(match,match_details);
          // 将要显示的赛事同步到快捷操作对象中
          this.list_to_quick_query_obj(this.list);
        }
      } else {
        this.list.length = 0
        Object.assign(this.list,[match_details])
        // 将要显示的赛事同步到快捷操作对象中
        this.list_to_quick_query_obj(this.list);
      }
    }
  }
  /**
   * @description: 赛事详情模块设置赛事玩法信息数据
   * @param {Array} odds_info 赛事玩法信息数据
   * @param {Boolean} is_merge 是否数据合并
   * @return
   */
  set_quick_query_list_from_match_details(odds_info, is_merge){
    if(odds_info){
      if(is_merge){  // 合并模式时
        const obj = lodash.get(this.quick_query_list,'[0].odds_info');
        if(obj){
          this.assign_with(obj,odds_info);
          // 将要显示的赛事同步到快捷操作对象中
          this.list_to_quick_query_obj(this.quick_query_list);
        }
      } else {
        const obj = lodash.get(this.quick_query_list,'[0]');
        if(obj){
          obj.odds_info = odds_info;
          // 将要显示的赛事同步到快捷操作对象中
          this.list_to_quick_query_obj(this.quick_query_list);
        }
      }
    }
  }

  /**
   * @description: 将list格式化成多个obj对象
   * @param {Array} list 赛事列表
   * @param {Number} timestap 时间戳
   * @return {Object} 将赛事列表转成成对象,提高检索速度
   */
  list_to_many_obj(list, timestap){
    let many_obj = {ol_obj:{}, hl_obj:{}, hn_obj: {}, mid_obj:{}}
    if(list && (list instanceof Array))
    {
      list.forEach((item,i) => {
        this.list_item_to_many_obj(item,many_obj);
      });
    }
    return many_obj;
  }

   /**
   * @description: 删除快速查询中指定赛事和编号的挂载点(不清空赛事数据)
   * @param {String} mid 赛事标识
   * @param {String} id 精准查询使用到的id
   * @param {String} type 精准查询id类型(mid/ol/hl/hn)
   * @param {Array} arr 需求清除的对象数组,默认为快速检索对象数组
   */
  delete_match_from_quick_query_obj(mid,id,type='mid',arr=[this.quick_query_obj]){
    if(mid) {
      const quick_query_str = this.get_format_quick_query_key(mid,id,type);
      //遍历快速查询对象
      // const arr = [this.quick_query_obj,this.list_to_obj];
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
   * @description: 删除list_to_ob中指定赛事和编号的挂载点(不清空赛事数据)
   * @param {String} mid 赛事标识
   * @param {String} id 精准查询使用到的id
   * @param {String} type 精准查询id类型(mid/ol/hl/hn)
   */
  delete_match_from_list_to_obj(mid,id,type='mid'){
    this.delete_match_from_quick_query_obj(mid,id,type,[this.list_to_obj]);
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
    let mid_obj_key = this.get_format_quick_query_key(mid, mid,'mid');
    // 获取总列表中的位置
    let index = this.get_mid_index_form_list(mid, this.list);
    if(index != -1){
      // 从列表中移除赛事
      this.list.splice(index,1);
    }

    // 获取页面显示列表中的位置
    index = this.get_mid_index_form_list(mid, this.quick_query_list);
    if(index != -1){
      // 从页面显示列表中移除赛事
      this.quick_query_list.splice(index,1);
    }
    
    // 快速赛事对象查找赛事
    if(mid && this.quick_query_obj.mid_obj[mid_obj_key]){
      // 清除赛事的所有数据
      this.clear(this.quick_query_obj.mid_obj[mid_obj_key]);
    }
    // 删除快速查询对象中指定赛事的所有赛事关联的挂载点
    this.delete_match_from_quick_query_obj(mid, mid,'mid');
  }

   /**
   * @description: 更新赛事数据(也可更新部分数据)
   * @param {Object} match 需要更新的赛事信息
   * @param {Boolean} is_merge 是否数据合并
   */
   upd_match(match, is_merge){
    let mid = lodash.get(match,'mid');
    if(mid){
      let mid_obj_key = this.get_format_quick_query_key(mid, mid,'mid');
      // 快速赛事对象查找赛事
      if(this.quick_query_obj.mid_obj[mid_obj_key]){
        if(is_merge){
          // 数据合并模式
          this.assign_with(this.quick_query_obj.mid_obj[mid_obj_key], match);
        } else {
          this.assign_with(this.quick_query_obj.mid_obj[mid_obj_key], match);
          const many_obj = this.list_to_many_obj([match]);

          
          // 快速检索对象数据合并
          this._quick_query_obj_assign(this.quick_query_obj, many_obj, [mid]);
          // this.match_assign(this.quick_query_obj.mid_obj, many_obj.mid_obj);
          // this.ol_obj_assign(this.quick_query_obj.ol_obj, many_obj.ol_obj);
          // this.hn_obj_assign(this.quick_query_obj.hn_obj, many_obj.hn_obj);
          // this.hl_obj_assign(this.quick_query_obj.hl_obj, many_obj.hl_obj);
        }
      }
    }
  }
  /**
   * @description: 快速检索数据对象合并逻辑
   * @param {Object} many_obj_old 老数据对象
   * @param {Object} many_obj_new 新数据对象
   * @param {Array} mids 赛事mid数组(为空时表示取obj所有key值)
   * @return 
   */
  _quick_query_obj_assign(many_obj_old, many_obj_new, mids){
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
  clear(any) {
    if(typeof (any) == "object")
    {
      // 对象时
      for (const key in any) {
        // 进入递归检测
        this.clear(any[key]);
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
        this._quick_query_obj_upd_status_mhs(this.quick_query_obj, mid, obj.mhs);
      }
      // hs更新
      if(Object.hasOwnProperty.call(obj, 'hid') && Object.hasOwnProperty.call(obj, 'hs')){
        this._quick_query_obj_upd_status_hs(this.quick_query_obj, mid, obj.hid, obj.hs);
      }

      // os更新
      if(Object.hasOwnProperty.call(obj, 'oid') && Object.hasOwnProperty.call(obj, 'os')){
        this._quick_query_obj_upd_status_os(this.quick_query_obj, mid, obj.oid, obj.os);
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
      let mid_str = this.get_format_quick_query_key(mid,mid,'mid');
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
      let id_str = this.get_format_quick_query_key(mid,hid,'hl');
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
      let id_str = this.get_format_quick_query_key(mid,oid,'ol');
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
  clear_quick_query_obj(quick_query_obj){
    this.clear(quick_query_obj.ol_obj);
    this.clear(quick_query_obj.hl_obj);
    this.clear(quick_query_obj.hn_obj);
    this.clear(quick_query_obj.mid_obj);
    this.clear(quick_query_obj);
  }

  /**
   * @description: 销毁函数-清除所有数据和对象
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  destroy(){
    // ws命令赛事订阅删除
    this.ws_ctr.scmd_c8('del');
    this.clear_quick_query_obj(this.quick_query_obj);
    this.clear(this.quick_query_list);
    this.clear(this.list);
    this.clear(this.list_to_obj);
    // 销毁ws数据通信实例
    this.ws_ctr && this.ws_ctr.destroy();
  }
}

export default new MatchDataBase()