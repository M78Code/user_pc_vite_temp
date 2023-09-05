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
 * 
 */
import lodash from "lodash";
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
    console.error(JSON.stringify(oldObj))
    console.error(JSON.stringify(newObj))
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
      this.merge_with(match_old, match_new);
    }
  }

  /**
   * @description: 赛事数据合并
   * @param {Object} match_old 旧赛事
   * @return {Object} match_new 新赛事
   */
  ol_obj_assign(ol_obj_old, ol_obj_new){
    if(ol_obj_old && ol_obj_new){
      this.merge_with(ol_obj_old, ol_obj_new);
    }
  }

  /**
   * @description: 赛事数据合并
   * @param {Object} match_old 旧赛事
   * @return {Object} match_new 新赛事
   */
  hn_obj_assign(hn_obj_old, hn_obj_new){
    if(hn_obj_old && hn_obj_new){
      this.merge_with(hn_obj_old, hn_obj_new);
    }
  }

  /**
   * @description: 赛事数据合并
   * @param {Object} match_old 旧赛事
   * @return {Object} match_new 新赛事
   */
  hl_obj_assign(hl_obj_old, hl_obj_new){
    if(hl_obj_old && hl_obj_new){
      this.merge_with(hl_obj_old, hl_obj_new);
    }
  }
  /**
   * @description: 设置所有列表数据
   * @param {Object} list 所有列表数据
   * @return {Boolean} is_merge 是否进行合并数据同步(保证地址不变)
   */
  set_list(list,is_merge){
    let obj = this.list_comparison(this.list,list);

    if(is_merge){
      // {add:{}, del:{}, upd:{}}
      // 需要更新的
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const mid = item.mid;
        console.log('listlist', mid);
        if(obj.upd[mid]){
         // 需要更新的赛事
         const match = this.quick_query_obj.mid_obj(this.get_format_quick_query_key(mid,mid,'mid'));
         if(match){
          // 赛事信息合并
          this.match_assign(match,obj.upd[mid]);
          // list列表数据同步
          list[i] = match;
         } else if(obj.del[mid]){
          // 搜索索引
          let index = this.get_mid_index_form_list(mid,this.quick_query_list);
          console.error('000000ddddddddddddddddddd 1111   ',index);
          if(index != -1){
            // 删除快速搜索里面的赛事数据
            this.delete_match_from_quick_query_obj(mid,mid,'mid');
            // 同步删除快速查询列表中的数据
            this.quick_query_list.splice(index,1);
            // 赛事所有赛事里面的数据
            this.remove_match(mid);
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
      Object.assign(this.list,list);
      console.error('000000');
    } else {
      this.list.length = 0;
      Object.assign(this.list,list);
      console.error('1111111');
    }
    console.error('this.list',JSON.stringify(this.list));
    console.error('obj',JSON.stringify(obj));
    // 检测清除快速查询对象里面的垃圾挂载点
    for (const mid_ in obj.del) {
      if (mid_ && obj.del[mid_]) {
        // 删除已经结束的赛事数据
        this.remove_match(mid_);
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
         const match = this.quick_query_obj.mid_obj(this.get_format_quick_query_key(mid,mid,'mid'));
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
      console.error('list_to_quick_query_obj many_obj:',many_obj);
      this.match_assign(this.quick_query_obj.mid_obj, many_obj.mid_obj);
      this.ol_obj_assign(this.quick_query_obj.ol_obj, many_obj.ol_obj);
      this.hn_obj_assign(this.quick_query_obj.hn_obj, many_obj.hn_obj);
      this.hl_obj_assign(this.quick_query_obj.hl_obj, many_obj.hl_obj);
    }
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
                            _hn
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
                            _hn
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
      if(is_merge){
        // 合并模式时,获取赛事信息
        const match=lodash.get(this.list,'[0]');
        if(match){
          // 进行数据合并
          this.merge_with(match,match_details);
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
          this.merge_with(obj,odds_info);
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
   */
  delete_match_from_quick_query_obj(mid,id,type='mid'){
    if(mid) {
      const quick_query_str = this.get_format_quick_query_key(mid,id,type);
      //遍历快速查询对象
      for (const key in this.quick_query_obj) {
        const obj1 = this.quick_query_obj[key];
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
    }
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
      for (let i = 0; i < this.list.length; i++) {
        if(this.list[i].mid == mid){
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
 merge_with(old_obj, new_obj){
  let customizer = (old_value, new_value) => {
    let res = old_value;
    // 数据类型
    let type = typeof(old_value);
    console.error('old_value=',type);
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
      console.error('new_value=',new_value);
      // 为数组的操作
      new_value && old_value && (old_value.length = new_value.length)
      // 删除多余的数组项
      // old_value.splice(len,old_value.length-len);
    } else {
      // 普通类型不做处理
    }
  }
  lodash.mergeWith(old_obj, new_obj,customizer);
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
    this.clear_quick_query_obj(this.quick_query_obj);
    this.clear(this.quick_query_list);
    this.clear(this.list);
  }
}
