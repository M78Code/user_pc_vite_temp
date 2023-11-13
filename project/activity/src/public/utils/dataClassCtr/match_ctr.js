/*
 * @Author: success
 * @Date: 2020-09-07 12:45:19
 * @Description: 专业版列表页面赛事信息操作类-实现快速检索,修改等功能 用于专业版: 热门推荐, 近期关注
 */
import MatchDataUpdTime from "src/public/utils/dataClassCtr/match_data_upd_time";
export default class MatchCtr
{
  /**
   * @description: 构造函数
   * @param {Object} view Vue实例
   * @return {undefined} undefined
   */
  constructor(view, moudle='hot_match')
  {
    // 视图对象
    this.view = view;
    this._moudle = moudle;
    // 赛事操后对应的字段时间戳对象
    this.upd_time_obj = new MatchDataUpdTime()
    // 初始化数据
    this.init();
  }


  /**
   * @description: 数据初始化
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  init(){
    // 赛事序列列表
    this.list = [];
    // 所有投注项对象
    this.ol_obj={};
    // 所有盘口对象
    this.hl_obj={};
    // 所有坑位对象
    this.hn_obj={};
    // 所有赛事对象
    this.mid_obj={};
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
          if(timestap) {
            // 设置赛事时间控制类
            let data_obj = this.upd_time_obj.get_need_upd_obj(item.mid, item, timestap);
            Object.assign(obj, data_obj.upd);
            this.upd_time_obj.set_match_obj(item.mid, data_obj.no_upd, timestap);
          }
        }
      });
    }
    return obj;
  }

  /**
   * @description: 
   * @param {Array} newList 新赛事列表
   * @param {Array} oldList 历史赛事列表
   * @return {Object}  返回比较结果对象
   */
  list_comparison(newList, oldList){
    let ret = {add:{}, del:{}, upd:{}}
    let oldObj = this.get_list_obj(oldList);
    let newObj = this.get_list_obj(newList);
    // console.log(JSON.stringify(oldObj))
    // console.log(JSON.stringify(newObj))
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
   * @description: 设置list
   * @param {Array} matchList 赛事列表集合
   * @return {Object} 返回操作后的列表
   */
  set_list(sortList, timestap){
    let ret = this.list_comparison(sortList, this.list);
    if(sortList && (sortList instanceof Array))
    {
      let list_old_obj = this.get_list_obj(this.list, timestap);
      let temp_obj = null;
      sortList.forEach(item => {
        if(item&& item.mid && list_old_obj[item.mid])
        {
          temp_obj = list_old_obj[item.mid];
          Object.assign(temp_obj, item);
          Object.assign(item, temp_obj);
        }
      });
      this.list = sortList;
    }
    // console.log(JSON.stringify(ret))
    //删除之前的垃圾数据
    for (const mid in ret.del) {
      if(mid)
      {
        this.clear_mid_obj(mid);
      }
    }

    for (const mid in ret.add) {
      if(mid)
      {
        // 虚拟滚所需参数
        let obj = {}
        obj.key = mid;
        // 是否已经加载过该选项
        obj._loaded = true;
        // h:子元素显示的高度
        obj._h = 0;
        // show:子元素是否显示(占位置,但是不渲染)
        obj._show = true;
        Object.assign(ret.add[mid], obj);
      }
    }
    return ret;
  }
  /**
   * @description: 返回list索引对应的赛事对象
   * @param {Number} index 赛事列表索引
   * @return {Object} 赛事对象
   */
  get_list_item(index){
    let ret = null;
    if(this.list && (this.list instanceof Array) && this.list[index] && this.list[index].mid)
    {
      let mid = this.list[index].mid;
      if(this.mid_obj && this.mid_obj[mid]){
        ret = this.mid_obj[mid];
      } else{
        ret = this.list[index];
      }
    }
    return ret;
  }

  /**
   * @description: 获取list索引对应的赛事对象属性值
   * @param {Number} index 赛事列表索引
   * @param {String} attr 属性字符串('name.age')
   * @return {String,Object,Number,Array} 返回的属性值
   */
  get_list_item_attr(index,attr){
    let ret = '';
    let match = this.get_list_item(index);
    if(match)
    {
      ret = _.get(match, attr);
    }
    return ret;
  }


  /**
   * @description: 设置list
   * @param {Array} matchList 需要设置的列表
   * @return {undefined} undefined
   */
  set_list_obj(matchList,timestap){
    if(matchList && (matchList instanceof Array) && matchList.length)
    {
      // 赛事信息集合
      // this.list = _.cloneDeep(matchList);
      // let list_ = this.list;
      // 所有投注项对象
      let ol_obj_ = this.ol_obj;
      let hn_obj_ = this.hn_obj;
      // 所有盘口对象
      let hl_obj_ = this.hl_obj;
      // 所有赛事对象
      let mid_obj_ = this.mid_obj;
      
      let manyObj = this.list_to_many_obj(matchList, timestap);
      this.list = matchList;
      this.ol_obj = manyObj.ol_obj;
      this.hn_obj = manyObj.hn_obj;
      this.hl_obj = manyObj.hl_obj;
      this.mid_obj = manyObj.mid_obj;
      
      this.clear(manyObj);
      //this.clear(list_);
      this.clear(ol_obj_);
      this.clear(hn_obj_);
      this.clear(hl_obj_);
      this.clear(mid_obj_);
    } else {
      this.clear_data();
    }
  }
  /**
   * @description: 将赛事详情对象转成多个对象,以便提高操作速度和效率
   * @param {Object} item 赛事对象
   * @param {Object} manyObj 数据叠加时使用的变量
   * @return {undefined} undefined
   */
  list_item_to_many_obj(item, manyObj){
    if(item && item.mid)
    {
      manyObj.mid_obj[item.mid] = item;
      if (item && item.hps && item.hps.length) {
        item.hps.forEach(item2 => {
          if (item2 && item2.hl && item2.hl.length) {
            item2.hl.forEach(item3 => {
              if (item3) {
                if (item3.hid) {
                  item3.mid = item.mid;
                  item3.hpid = item2.hpid;
                  item3.hsw = item2.hsw;
                  manyObj.hl_obj[item3.hid] = item3;
                }
                if (item3.ol && item3.ol.length) {
                  item3.ol.forEach(item4 => {
                    let ot = ''; // 处理ot是小数的情况
                    if(item4.ot && item4.ot.includes('.')) {
                      ot = item4.ot.replace('.','-');
                    } else {
                      ot = item4.ot;
                    }
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
                    manyObj.ol_obj[item4.oid] = item4;
                    if(_hn) {
                      manyObj.hn_obj[_hn] = item4;
                    }
                  });
                }
              }
            });
          }
        });
      }
     
      if (item && item.hpsAdd && item.hpsAdd.length) {
        item.hpsAdd.forEach(item2 => {
          if (item2 && item2.hl && item2.hl.length) {
            item2.hl.forEach(item3 => {
              if (item3) {
                if (item3.hid) {
                  item3.mid = item.mid;
                  item3.hpid = item2.hpid;
                  item3.hsw = item2.hsw;
                  manyObj.hl_obj[item3.hid] = item3;
                }
                if (item3.ol && item3.ol.length) {
                  item3.ol.forEach(item4 => {
                    let ot = ''; // 处理ot是小数的情况
                    if(item4.ot && item4.ot.includes('.')) {
                      ot = item4.ot.replace('.','-');
                    } else {
                      ot = item4.ot;
                    }
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
                    manyObj.ol_obj[item4.oid] = item4;
                    if(_hn) {
                      manyObj.hn_obj[_hn] = item4;
                    }
                  });
                }
              }
            });
          }
        });
      }

    }
  }

  /**
   * @description: 将list格式化成多个obj对象
   * @param {Array} list 赛事列表
   * @return {Object} 将赛事列表转成成对象,提高检索速度
   */
  list_to_many_obj(list, timestap){
    let manyObj = {ol_obj:{}, hl_obj:{}, hn_obj: {}, mid_obj:{}}
    if(list && (list instanceof Array))
    {
      list.forEach((item,i) => {
        if(item && item.mid && this.mid_obj[item.mid] && timestap) {
          // 设置赛事时间控制类
          let data_obj = this.upd_time_obj.get_need_upd_obj(item.mid, this.mid_obj[item.mid], timestap);
          Object.assign(item, data_obj.upd);
          this.upd_time_obj.set_match_obj(item.mid, data_obj.no_upd, timestap);
        }    
        this.list_item_to_many_obj(item,manyObj);
      });

      // this.list.forEach((item,i) => {
      //   this.mid_obj[item.mid] = item;
      //   if (item && item.hps && item.hps.length) {
      //     item.hps.forEach(item2 => {
      //       if (item2 && item2.hl && item2.hl.length) {
      //         item2.hl.forEach(item3 => {
      //           if (item3) {
      //             if (item3.hid) {
      //               item3.mid = item.mid;
      //               this.hl_obj[item3.hid] = item3;
      //             }
      //             if (item3.ol && item3.ol.length) {
      //               item3.ol.forEach(item4 => {
      //                 // 押注项设置盘口状态
      //                 Object.assign(item4, {
      //                   hs: (item3.hs ? item3.hs : 0),
      //                   ms: (item.mhs ? item.mhs : 0),
      //                   mid: item.mid,
      //                   hid: item3.hid,
      //                 });
      //                 this.ol_obj[item4.oid] = item4;
      //               });
      //             }
      //           }
      //         });
      //       }
      //     });
      //   }
      // });
    }
    return manyObj;
  }

  /**
   * @description: 修改赛事级别状态变化
   * @param {String,Number} mid 赛事mid
   * @param {Number} status  赛事级别状态
   * @return {undefined} undefined
   */
  set_match_mhs_status(mid,status){
    if(mid&&this.mid_obj[mid])
    {
      // 设置赛事级别状态
      Object.assign(this.mid_obj[mid],{mhs:status});
      if(this.mid_obj[mid].hps && (this.mid_obj[mid].hps instanceof Array))
      {
        this.mid_obj[mid].hps.forEach(item_hps => {
          if(item_hps && item_hps.hl && (item_hps.hl instanceof Array))
          {
            item_hps.hl.forEach(item_hl => {
              if(item_hl && item_hl.ol && (item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                  if(item_ol)
                  {
                    Object.assign(item_ol,{_mhs:status});
                  }
                });
              }
            });
          }
        });
      }
     
      if(this.mid_obj[mid].hpsAdd && (this.mid_obj[mid].hpsAdd instanceof Array))
      {
        this.mid_obj[mid].hpsAdd.forEach(item_hps => {
          if(item_hps && item_hps.hl && (item_hps.hl instanceof Array))
          {
            item_hps.hl.forEach(item_hl => {
              if(item_hl && item_hl.ol && (item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                  if(item_ol)
                  {
                    Object.assign(item_ol,{_mhs:status});
                  }
                });
              }
            });
          }
        });
      }
    }
  }
  /**
   * @description: 盘口类型设置
   * @param {String, Number} hid 盘口id
   * @param {Number} hmt
   */
  set_match_hmt(hid, hmt) {
    if(hid&&this.hl_obj[hid])
    {
      Object.assign(this.hl_obj[hid],{ hmt });
    }
  }
  /**
   * @description: 修改盘口级别状态变化
   * @param {String,Number} hid 盘口编号
   * @param {Number} status 盘口状态
   * @param {Array} ols 盘口所对应的投注项列表
   * @return {undefined} undefined
   */
  set_match_hs_status(hid,status,ols){
    if(hid&&this.hl_obj[hid])
    {
      // 设置赛事级别状态
      Object.assign(this.hl_obj[hid],{hs:status});

      if(ols && (ols instanceof Array))
      {
        // 设置新盘口信息(新增和修改)
        ols.forEach(item_ols => {
          if(item_ols&&item_ols.oid&&this.ol_obj[item_ols.oid])
          {
            // Object.assign(item_ols,{hs:status});
            Object.assign(this.ol_obj[item_ols.oid],item_ols);
          }
        });
      }

      if(this.hl_obj[hid] && this.hl_obj[hid].ol && (this.hl_obj[hid].ol instanceof Array))
      {
        this.hl_obj[hid].ol.forEach(item_ol => {
          if(item_ol)
          {
            Object.assign(item_ol,{_hs:status});   
          }
        });
      }
    }
  }
  /**
   * @description: 修改押注项级别状态变化
   * @param {String,Number} oid 投注项编号
   * @param {Number} status 投注项状态
   * @return {undefined} undefined
   */
  set_match_os_status(id,status){
    if(id&&this.ol_obj[id])
    {
      // 设置赛事级别状态
      Object.assign(this.ol_obj[id],{os:status});
      id = this.ol_obj[id]._hn;
      if(id) {
        Object.assign(this.hn_obj[id],{os:status});
      }
    }
    if(id&&this.hn_obj[id]) {
      Object.assign(this.hn_obj[id],{os:status});
      id = this.hn_obj[id].oid;
      Object.assign(this.ol_obj[id],{os:status});    
    }
  }

  /**
   * @description: 增加赛事信息
   * @param {Object} obj 赛事对象
   * @return {undefined} undefined
   */
  add_match_info(obj){
    // if(obj.mid&&obj.hpid&&this.mid_obj[obj.mid]&&this.mid_obj[obj.mid].hps&&(this.mid_obj[obj.mid].hps instanceof Array))
    if(obj.mid)
    {
      let item = _.cloneDeep(obj);
      // let hps_ = []
      // 增加新盘口和押注项对象
      if (item && item.hps && item.hps.length) {
        item.hps.forEach(item2 => {
          if (item2 && item2.hl && item2.hl.length) {
            item2.hl.forEach(item3 => {
              if (item3) {
                if (item3.hid) {
                  item3.mid = item.mid;
                  // 押注项设置盘口状态
                  this.hl_obj[item3.hid] = item3;
                }
                if (item3.ol && item3.ol.length) {
                  item3.ol.forEach(item4 => {
                    let ot = ''; // 处理ot是小数的情况
                    if(item4.ot && item4.ot.includes('.')) {
                      ot = item4.ot.replace('.','-');
                    } else {
                      ot = item4.ot;
                    }
                    let _hn = item3.hn?`${item.mid}_${item2.chpid}_${item3.hn}_${ot}`:'';
                    Object.assign(item4, {
                      _hpid: item2.hpid,
                      _hs: (item3.hs ? item3.hs : 0),
                      _mhs: (item.mhs ? item.mhs : 0),
                      _mid: item.mid,
                      _hid: item3.hid,
                      _hn
                    });
                    // 增加新押注项对象
                    this.ol_obj[item4.oid] = item4;
                    if(_hn) {
                      this.hn_obj[_hn] = item4;
                    }
                  });
                }
              }
            });
          }
        });
        // hps_ = item.hps;
        // delete item.hps;
      }

      if (item && item.hpsAdd && item.hpsAdd.length) {
        item.hpsAdd.forEach(item2 => {
          if (item2 && item2.hl && item2.hl.length) {
            item2.hl.forEach(item3 => {
              if (item3) {
                if (item3.hid) {
                  item3.mid = item.mid;
                  // 押注项设置盘口状态
                  this.hl_obj[item3.hid] = item3;
                }
                if (item3.ol && item3.ol.length) {
                  item3.ol.forEach(item4 => {
                    let ot = ''; // 处理ot是小数的情况
                    if(item4.ot && item4.ot.includes('.')) {
                      ot = item4.ot.replace('.','-');
                    } else {
                      ot = item4.ot;
                    }
                    let _hn = item3.hn?`${item.mid}_${item2.chpid}_${item3.hn}_${ot}`:'';
                    Object.assign(item4, {
                      _hpid: item2.hpid,
                      _hs: (item3.hs ? item3.hs : 0),
                      _mhs: (item.mhs ? item.mhs : 0),
                      _mid: item.mid,
                      _hid: item3.hid,
                      _hn
                    });
                    // 增加新押注项对象
                    this.ol_obj[item4.oid] = item4;
                    if(_hn) {
                      this.hn_obj[_hn] = item4;
                    }
                  });
                }
              }
            });
          }
        });
      }
      // 向指定位置增加赛事
      // this.list.splice(index, 0, item);
      if(this.mid_obj[obj.mid]){
        Object.assign(this.mid_obj[obj.mid],item);
      } else{
        this.mid_obj[obj.mid] = item;
      }
      // let hps_old = this.mid_obj[obj.mid].hps.splice(0,this.mid_obj[obj.mid].hps.length);
      // // 清除之前的盘口和押注项对象
      // if (hps_old && hps_old.length) {
      //   hps_old.forEach(item2 => {
      //     if (item2 && item2.hl && item2.hl.length) {
      //       item2.hl.forEach(item3 => {
      //         if (item3) {
      //           if (item3.hid) {
      //             // 清除之前的盘口对象
      //             delete this.hl_obj[item3.hid];
      //           }
      //           if (item3.ol && item3.ol.length) {
      //             item3.ol.forEach(item4 => {
      //               // 清除之前的押注项对象
      //               if(item4&&item4.oid)
      //               {
      //                 delete this.ol_obj[item4.oid];
      //               }
      //             });
      //           }
      //         }
      //       });
      //     }
      //   });
      // }
      // hps_.forEach(item__ => {
      //   this.mid_obj[obj.mid].hps.push(item__);
      // });
    }
  }

  /**
   * @description: 增加/修改赛事信息
   * @param {Object} obj 赛事信息对象
   * @return {undefined} undefined
   */
  upd_match_info(obj){
    // if(obj.mid&&obj.hpid&&this.mid_obj[obj.mid]&&this.mid_obj[obj.mid].hps&&(this.mid_obj[obj.mid].hps instanceof Array))
    if(obj && obj.mid&&this.mid_obj[obj.mid])
    {
      let item = _.cloneDeep(obj);

      let hps_old = this.mid_obj[obj.mid].hps.splice(0,this.mid_obj[obj.mid].hps.length);
      // 清除之前的盘口和押注项对象
      if (hps_old && hps_old.length) {
        hps_old.forEach(item2 => {
          if (item2 && item2.hl && item2.hl.length) {
            item2.hl.forEach(item3 => {
              if (item3) {
                if (item3.hid) {
                  // 清除之前的盘口对象
                  delete this.hl_obj[item3.hid];
                }
                if (item3.ol && item3.ol.length) {
                  item3.ol.forEach(item4 => {
                    // 清除之前的押注项对象
                    if(item4&&item4.oid)
                    {
                      delete this.ol_obj[item4.oid];
                      if(item4._hn && this.hn_obj[item4._hn]) {
                        delete this.hn_obj[item4._hn];
                      }
                    }
                  });
                }
              }
            });
          }
        });
      }

      var hps_ = [],hpsAdd_ =[];
      // 增加新盘口和押注项对象
      if (item && item.hps && item.hps.length) {
        item.hps.forEach(item2 => {
          if (item2 && item2.hl && item2.hl.length) {
            item2.hl.forEach(item3 => {
              if (item3) {
                if (item3.hid) {
                  item3.mid = item.mid;
                  item3.hpid = item2.hpid;
                  item3.hsw = item2.hsw;
                  // 押注项设置盘口状态
                  this.hl_obj[item3.hid] = item3;
                }
                if (item3.ol && item3.ol.length) {
                  item3.ol.forEach(item4 => {
                    let ot = ''; // 处理ot是小数的情况
                    if(item4.ot && item4.ot.includes('.')) {
                      ot = item4.ot.replace('.','-');
                    } else {
                      ot = item4.ot;
                    }
                    let _hn = item3.hn?`${item.mid}_${item2.chpid}_${item3.hn}_${ot}`:'';
                    Object.assign(item4, {
                      _hpid: item2.hpid,
                      _hs: (item3.hs ? item3.hs : 0),
                      _mhs: (item.mhs ? item.mhs : 0),
                      _mid: item.mid,
                      _hid: item3.hid,
                      _hn
                    });
                    // 增加新押注项对象
                    this.ol_obj[item4.oid] = item4;
                    if(_hn) {
                      this.hn_obj[_hn] = item4;
                    }
                  });
                }
              }
            });
          }
        });
        hps_ = item.hps;
        delete item.hps;
      }

      if (item && item.hpsAdd && item.hpsAdd.length) {
        item.hpsAdd.forEach(item2 => {
          if (item2 && item2.hl && item2.hl.length) {
            item2.hl.forEach(item3 => {
              if (item3) {
                if (item3.hid) {
                  item3.mid = item.mid;
                  item3.hpid = item2.hpid;
                  item3.hsw = item2.hsw;
                  // 押注项设置盘口状态
                  this.hl_obj[item3.hid] = item3;
                }
                if (item3.ol && item3.ol.length) {
                  item3.ol.forEach(item4 => {
                    let ot = ''; // 处理ot是小数的情况
                    if(item4.ot && item4.ot.includes('.')) {
                      ot = item4.ot.replace('.','-');
                    } else {
                      ot = item4.ot;
                    }
                    let _hn = item3.hn?`${item.mid}_${item2.chpid}_${item3.hn}_${ot}`:'';
                    Object.assign(item4, {
                      _hpid: item2.hpid,
                      _hs: (item3.hs ? item3.hs : 0),
                      _mhs: (item.mhs ? item.mhs : 0),
                      _mid: item.mid,
                      _hid: item3.hid,
                      _hn
                    });
                    // 增加新押注项对象
                    this.ol_obj[item4.oid] = item4;
                    if(_hn) {
                      this.hn_obj[_hn] = item4;
                    }
                  });
                }
              }
            });
          }
        });
        hpsAdd_ = item.hpsAdd;
        delete item.hpsAdd;
      }
      if(this.view) {
        let cur_match = _.get(this.mid_obj, `${obj.mid}`, {});
        if(!_.isEmpty(cur_match)) {
          Object.assign(this.mid_obj[obj.mid],item);      
          hps_.forEach(item__ => {
            this.mid_obj[obj.mid].hps.push(item__);
          }); 
    
          hpsAdd_.forEach(item__ => {
            this.mid_obj[obj.mid].hpsAdd.push(item__);
          });
        }
      }
    }
  }
  /**
   * @description: 设置赛事投注项信息
   * @param {Object} data 投注项信息
   * @return {undefined} undefined
   */
  set_match_ol_data(data) {
    if(data.oid && this.ol_obj[data.oid]) {
      let hn = this.ol_obj[data.oid]._hn;
      if(hn && !_.isEmpty(this.hn_obj[hn])) {
        Object.assign(this.hn_obj[hn], data);
      }
      Object.assign(this.ol_obj[data.oid], data);
    }
  }
  /**
   * @description: 增加/修改玩法信息
   * @param {Object} obj 赛事对象
   * @param {Object} addPlay 需要修改和增加的玩法信息对象
   * @return {undefined} undefined
   */
  upd_play(obj,addPlay){
    // obj= {
    //     "hpid": "173",
    //     "hl": [
    //         {
    //             "hid": "1240538134874726401",
    //             "hs": 0,
    //             "hv": "74.5",
    //             "hmt": 0,
    //             "ol": [
    //                 {
    //                     "oid": "1240538134925058049",
    //                     "os": 2,
    //                     "otd": 548,
    //                     "ot": "Over",
    //                     "ov": 289000,
    //                     "obv": 289000,
    //                     "on": "大 74.5",
    //                     "cds": "SR",
    //                     "ots": "T2"
    //                 },
    //                 {
    //                     "oid": "1240538134992166914",
    //                     "os": 3,
    //                     "otd": 547,
    //                     "ot": "Under",
    //                     "ov": 287000,
    //                     "obv": 287000,
    //                     "on": "小 74.5",
    //                     "cds": "SR",
    //                     "ots": "T1"
    //                 }
    //             ]
    //         }
    //     ],
    //     "hpon": 168,
    //     "hpn": "总分1",
    //     "mid": 363587,
    //     "hmm": 1,
    //     "hshow": "Yes",
    //     "hton": "0",
    //     "hpnb": "总分1",
    //     "title": [
    //         {
    //             "osn": "大 ",
    //             "otd": 548
    //         },
    //         {
    //             "osn": "小 ",
    //             "otd": 547
    //         }
    //     ],
    //     "hpt": 2,
    //     "hsw": "1,2,3,4,5,6"
    // }
    if(obj && obj.mid&&obj.hpid&&this.mid_obj[obj.mid]&&this.mid_obj[obj.mid].hps&&(this.mid_obj[obj.mid].hps instanceof Array))
    {
      let isFind = false;
      let hps = this.mid_obj[obj.mid].hps;
      let hpsAdd = this.mid_obj[obj.mid].hpsAdd;
      let play = null;
      for (let i = 0; i < hps.length; i++) {
        if(hps[i].hpid == obj.hpid)
        {
          play = hps[i];
          break;
        }
      }
      // 附加盘
      for (let i = 0; i < hpsAdd.length; i++) {
        if(hpsAdd[i].hpid == obj.hpid)
        {
          play = hpsAdd[i];
          break;
        }
      }

      if(play)
      {
        // 删除之前的盘口对象和投注项对象
        if(play&&play.hl&&(play.hl instanceof Array))
        {
          play.hl.forEach(item_hl => {
            if(item_hl){
              if(item_hl.ol&&(item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                  if(item_ol){
                    // 删除押注项
                    delete this.ol_obj[item_ol.oid];
                    if(item_ol._hn && this.hn_obj[item_ol._hn]) {
                      delete this.hn_obj[item_ol._hn];
                    }
                  }
                });
              }
              // 删除盘口对象
              delete this.hl_obj[item_hl.hid];
            }
          });
        }

        // let play_ = _.cloneDeep(obj);
        // 修改玩法信息
        if(obj&&obj.hl&&(obj.hl instanceof Array))
        {
          obj.hl.forEach(item_hl => {
            if(item_hl){
              if(item_hl.ol&&(item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                  if(item_ol){
                    let ot = ''; // 处理ot是小数的情况
                    if(item_ol.ot && item_ol.ot.includes('.')) {
                      ot = item_ol.ot.replace('.','-');
                    } else {
                      ot = item_ol.ot;
                    }
                    let _hn = item_hl.hn?`${obj.mid}_${obj.chpid ||obj.hpid}_${item_hl.hn}_${ot}`:'';
                    // 押注项对象增加mid,hid
                    Object.assign(item_ol, {
                      _hpid: obj.hpid,
                      _mid: obj.mid,
                      _hid: item_hl.hid,
                      _hs: (item_hl.hs ? item_hl.hs : 0),
                      _mhs: (this.mid_obj[obj.mid].mhs ? this.mid_obj[obj.mid].mhs : 0),
                      _hn
                    });
                  }
                });
              }
              // 盘口对象增加mid
              Object.assign(item_hl, {
                mid: obj.mid,
              });
            }
          });
        }
        let play_ = _.cloneDeep(obj);
        Object.assign(play,play_);
        play_.hl.forEach(item_hl => {
          if(item_hl){
            if(item_hl.ol&&(item_hl.ol instanceof Array))
            {
              item_hl.ol.forEach(item_ol => {
                if(item_ol){
                  this.ol_obj[item_ol.oid] = item_ol;
                }
              });
            }
            // 盘口对象增加mid
            this.hl_obj[item_hl.hid] = item_hl;
          }
        });

      } else if(addPlay){
        // 未发现玩法增加
        let play_ = obj;
        // 增加盘口对象
        if(play_&&play.hl&&(play_.hl instanceof Array))
        {
          play_.hl.forEach(item_hl => {
            if(item_hl){
              if(item_hl.ol&&(item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                  if(item_ol){
                    let ot = ''; // 处理ot是小数的情况
                    if(item_ol.ot && item_ol.ot.includes('.')) {
                      ot = item_ol.ot.replace('.','-');
                    } else {
                      ot = item_ol.ot;
                    }
                    let _hn = item_hl.hn?`${play_.mid}_${play_.hpid}_${item_hl.hn}_${ot}`:'';
                    // 增加押注项
                    Object.assign(item_ol, {
                      _hpid: play_.hpid,
                      _mid: obj.mid,
                      _hid: item_hl.hid,
                      _mhs: play_.mhs,
                      _hs: item_hl.hs,
                      _hn
                    });
                  }
                });
              }
              Object.assign(item_hl, {
                mid: obj.mid,
              });
            }
          });
        }
        play_ = _.cloneDeep(play_);
        if(play_&&play_.hl&&(play_.hl instanceof Array))
        {
          play_.hl.forEach(item_hl => {
            if(item_hl){
              if(item_hl.ol&&(item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                  if(item_ol){
                    let ot = ''; // 处理ot是小数的情况
                    if(item_ol.ot && item_ol.ot.includes('.')) {
                      ot = item_ol.ot.replace('.','-');
                    } else {
                      ot = item_ol.ot;
                    }
                    let _hn = item_hl.hn?`${play_.mid}_${play_.hpid}_${item_hl.hn}_${ot}`:'';
                    // 增加押注项
                    Object.assign(item_ol, {
                      _hpid: play_.hpid,
                      _mid: obj.mid,
                      _hid: item_hl.hid,
                      _mhs: play_.mhs,
                      _hs: item_hl.hs,
                      _hn
                    });
                    // 增加押注项
                    this.ol_obj[item_ol.oid] = item_ol;
                    if(_hn) {
                      this.hn_obj[_hn] = item_ol;
                    }
                  }
                });
              }
              this.hl_obj[item_hl.hid] = item_hl;
            }
          });
        }
        // 增加玩法对象
        hps.push(play_);
      }
    }
  }

/**
 * @description: 清空赛事对象
 * @param {String,Number} midAny 赛事mid
 * @return {undefined} undefined
 */
clear_mid_obj(midAny){
  let ret = null;
  let mid = midAny;
  if(midAny && _.isObject(midAny))
  {
    mid = midAny.mid;
  }
  // 所有赛事对象
  if(mid && this.mid_obj[mid])
  {
    var match = this.mid_obj[mid];
    // 删除对象中的所有盘口和投注项
    if(match.hps&&(match.hps instanceof Array))
    {
      match.hps.forEach(item_hps => {
        if(item_hps&&item_hps.hl&&(item_hps.hl instanceof Array))
        {
          item_hps.hl.forEach(item_hl => {
            if(item_hl)
            {
              if(item_hl.ol&&(item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                  if(item_ol&&item_ol.oid){
                    //删除对象中的赛事
                    delete this.ol_obj[item_ol.oid];
                    if(item_ol._hn && this.hn_obj[item_ol._hn]) {
                      delete this.hn_obj[item_ol._hn];
                    }
                  }
                });
              }
              //删除对象中的赛事
              delete this.hl_obj[item_hl.hid];
            }
          });
        }
      });      
    }
    // 附加盘
    if(match.hpsAdd&&(match.hpsAdd instanceof Array))
    {
      match.hpsAdd.forEach(item_hps => {
        if(item_hps&&item_hps.hl&&(item_hps.hl instanceof Array))
        {
          item_hps.hl.forEach(item_hl => {
            if(item_hl)
            {
              if(item_hl.ol&&(item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                  if(item_ol&&item_ol.oid){
                    //删除对象中的赛事
                    delete this.ol_obj[item_ol.oid];
                    if(item_ol._hn && this.hn_obj[item_ol._hn]) {
                      delete this.hn_obj[item_ol._hn];
                    }
                  }
                });
              }
              //删除对象中的赛事
              delete this.hl_obj[item_hl.hid];
            }
          });
        }
      });      
    }
    //删除对象中的赛事
    delete this.mid_obj[mid];
  }
  // 删除赛事列表中的赛事
  for (let i = 0; i < this.list.length; i++) {
    if(this.list[i]&&this.list[i].mid == mid)
    {
      ret = this.list.splice(i,1);
      break;
    }
  }
  return ret;
}

/**
 * @description: 清空盘口对象
 * @param {String,Number} hid 盘口编号
 * @return {undefined} undefined
 */
clear_hl_obj(hid){
  var isBreak = false;
  if(hid&&this.hl_obj[hid])
  {
    var mid = this.hl_obj[hid].mid;
    // 查找list中的列表数据
    if(mid&&this.mid_obj[mid]&&this.mid_obj[mid].hps)
    {
      if(this.mid_obj[mid].hps&&(this.mid_obj[mid].hps instanceof Array))
      {
        for (let j = 0; j < this.mid_obj[mid].hps.length; j++) {
          if(this.mid_obj[mid].hps[j]&&this.mid_obj[mid].hps[j].hl&&(this.mid_obj[mid].hps[j].hl instanceof Array))
          {
            const hl = this.mid_obj[mid].hps[j].hl;
            for (let i = 0; i < hl.length; i++) {
              if(hl[i]&&hl[i].hid == hid)
              {
                // 删除下面的所有押注项
                if(hl[i].ol&&(hl[i].ol instanceof Array))
                {
                  hl[i].ol.forEach(item_ol => {
                    if(item_ol&&item_ol.oid)
                    {
                      // this.clear_ol_obj(item_ol.oid);
                      delete this.ol_obj[item_ol.oid];
                      if(item_ol._hn && this.hn_obj[item_ol._hn]) {
                        delete this.hn_obj[item_ol._hn];
                      }
                    }
                  });
                }
                hl.splice(i,1);
                isBreak = true;
                break;
              }
            }
          }
          if(isBreak)
          {
            break;
          }
        }
      }
    }
    if(mid&&this.mid_obj[mid]&&this.mid_obj[mid].hpsAdd)
    {
      if(this.mid_obj[mid].hpsAdd&&(this.mid_obj[mid].hpsAdd instanceof Array))
      {
        for (let j = 0; j < this.mid_obj[mid].hpsAdd.length; j++) {
          if(this.mid_obj[mid].hpsAdd[j]&&this.mid_obj[mid].hpsAdd[j].hl&&(this.mid_obj[mid].hpsAdd[j].hl instanceof Array))
          {
            const hl = this.mid_obj[mid].hpsAdd[j].hl;
            for (let i = 0; i < hl.length; i++) {
              if(hl[i]&&hl[i].hid == hid)
              {
                // 删除下面的所有押注项
                if(hl[i].ol&&(hl[i].ol instanceof Array))
                {
                  hl[i].ol.forEach(item_ol => {
                    if(item_ol&&item_ol.oid)
                    {
                      // this.clear_ol_obj(item_ol.oid);
                      delete this.ol_obj[item_ol.oid];
                      if(item_ol._hn && this.hn_obj[item_ol._hn]) {
                        delete this.hn_obj[item_ol._hn];
                      }
                    }
                  });
                }
                hl.splice(i,1);
                isBreak = true;
                break;
              }
            }
          }
          if(isBreak)
          {
            break;
          }
        }
      }
    }
    // 删除盘口对象
    delete this.hl_obj[hid];
  }
}

/**
 * @description: 清空投注项对象
 * @param {String,Number} oid 投注项编号
 * @return {undefined} undefined
 */
clear_ol_obj(oid){
  if(oid&&this.ol_obj[oid])
  {
    var hid = this.ol_obj[oid].hid;
    // 查找list中的列表数据
    if(hid&&this.hl_obj[hid])
    {
      var ol = this.hl_obj[hid].ol;
      if(ol&& ol.length)
      {
        for (let i = 0; i < ol.length; i++) {
          if(ol[i]&&ol[i].oid == oid)
          {
            ol.splice(i,1);
            break;
          }
        }
      }
    }
    // 删除押注项对象
    delete this.ol_obj[oid];
  }
}

/**
 * @description: 清空对象
 * @param {Object,Array} any 要清空的对象和列表
 * @return {undefined} undefined
 */
  clear(any){
    if(any&&(typeof any) == 'object')
    {
      if(any instanceof Array){
        any.splice(0,any.length);
      } else{
        for (const key in any) {
          delete any[key]
        }
      }
    }
  }


  /**
   * @description: 清除所有数据
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  clear_data(){
    this.clear(this.ol_obj);
    this.clear(this.hl_obj);
    this.clear(this.hn_obj);
    this.clear(this.mid_obj);
    this.clear(this.list);
  }

  /**
   * @description: 销毁函数-清除所有数据和对象
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  destroy(){
    this.clear(this.ol_obj);
    this.clear(this.hl_obj);
    this.clear(this.hn_obj);
    this.clear(this.mid_obj);
    this.clear(this.list);
    this.view = null;
  }
}
