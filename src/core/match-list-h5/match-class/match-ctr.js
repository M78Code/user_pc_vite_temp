

/*
 * @Description:列表页面赛事信息操作类-实现快速检索,修改等功能   !!!! 废弃
 */
import { ref } from 'vue'
import lodash from 'lodash'
import { MATCH_LIST_TEMPLATE_CONFIG } from "../match-card/template/index"

class MatchCtr {
  /**
   * @description: 构造函数
   * @param {Object} view Vue实例
   * @return {undefined} undefined
   */
  constructor(view) {
    // 视图对象
    this.view = view;
    // 初始化数据
    this.init('first_init');
  }


  /**
   * @description: 数据初始化
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  init(type_click) {
    if (type_click) {
      // 赛事序列列表(分页)
      this.list = [];
    }
    // 赛事全序列列表
    this.match_list_data_sources = [];
    // 所有盘口对象
    this.hl_obj = {};
    // 所有赛事对象
    this.mid_obj = {};
    // 所有坑位对象
    this.hn_obj = {};
    this.match_data_version = ref(0);
  }

  // 设置 赛事版本
  set_match_data_version = lodash.debounce(() => {
    this.match_data_version.value = Date.now()
  }, 50)

  /**
   * @description: list转字典
   * @param {Array} 赛事列表
   * @return {Object} 将list转换为对象
   */
  getListObj(list) {
    let obj = {};
    if (list && (list instanceof Array)) {
      list.forEach(item => {
        if (item && item.mid) {
          obj[item.mid] = item;
        }
      });
    }
    return obj;
  }

  /**
   * @description: 比较新旧两个列表，区分新增、修改、删除数据
   * @param {Array} newList 新赛事列表
   * @param {Array} oldList 历史赛事列表
   * @return {Object}  返回比较结果对象
   */
  listComparison(newList, oldList) {
    let ret = { add: {}, del: {}, upd: {}, add_index_obj: {} }
    let oldObj = this.getListObj(oldList);
    let newObj = this.getListObj(newList);
    let key_ = '';
    let id = 'mid';
    if (newList && (newList instanceof Array)) {
      newList.forEach((item, i) => {
        if (item && item[id]) {
          key_ = item[id];
          if (oldObj[key_]) {
            //修改的
            ret.upd[key_] = item;
          } else {
            //新增的
            ret.add[key_] = item;
            ret.add_index_obj[item.mid] = i;
          }
        }
      });
    }

    if (oldList && (oldList instanceof Array)) {
      oldList.forEach(item => {
        if (item && item[id]) {
          key_ = item[id];
          if (!newObj[key_]) {
            // 需要删除的
            ret.del[key_] = item;
          }
        }
      });
    }
    return ret;
  }

  /**
   * @description: 更新数据源列表数据
   * @param {Array} data_list
   * @return {Object} 返回操作后的列表 {add:{}, del:{}, upd:{}}
   */
  set_source_list(sortList) {
    if (sortList && (sortList instanceof Array)) {
      // 数组先清零
      this.match_list_data_sources = null;
      //  把接口请求到的 数据，赋值到 数据仓库
      this.match_list_data_sources = sortList
      this.set_match_data_version()
    }
  }
  /**
   * @description: 设置冠军玩法折叠字典
   * @param {Array} data_list
   * @return {Object} 返回玩法折叠字典 {tid: {hid：0}}
   */
  set_champion_game_collapse_object(match_res_data) {
    let obj = {}
    match_res_data.map(item => {
      Object.assign(obj, { [item.tid]: {} })
      if (lodash.get(item, 'hps') && item.hps.length > 0 && item.hps[0].hid) {
        item.hps.map(_item => {
          Object.assign(obj[item.tid], { [_item.hid]: 0 })

        })
      }
    })
    return obj
    this.set_match_data_version()
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
      if (element && temp) {
        if (new_obj[temp]) {
          delete element.flex_index;
        } else {
          new_obj[temp] = 1;
        }
      }
      // new_str[element.mid] = element.flex_index;
    }
    // old_obj去重处理
    for (let i = 0; i < old_.length; i++) {
      const element = old_[i];
      let temp = (element.flex_index)
      if (temp) {
        if (old_obj[temp]) {
          delete element.flex_index;
        } else {
          old_obj[temp] = 1;
        }
      }
      // old_str[element.mid] = element.flex_index;
    }

    for (let i = 0; i < new_.length; i++) {
      const element = new_[i];
      if (new_[i] && new_[i].mid && obj_[new_[i].mid]) {
        if (new_[i].mid == obj_[new_[i].mid].mid) {
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
      } else if (element) {
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
   * @description: 设置list
   * @param {Array} sortList 赛事列表集合
   * @return {Object} 返回操作后的列表 {add:{}, del:{}, upd:{}}
   */
  setList(sortList, is_append) {
    let temp = lodash.cloneDeep(this.list);
    if (sortList && (sortList instanceof Array)) {
      let old_mid_list = this.list.map(m => m.mid).join(',');
      let new_mid_list = sortList.map(m => m.mid).join(',');
      if (new_mid_list != old_mid_list) {
        this.flex_index(sortList, temp)
        this.list = lodash.cloneDeep(sortList);
      } else {
        this.list = lodash.cloneDeep(sortList);
      }
    }
    this.set_match_data_version()
  }
  /**
   * @description: 设置赛事默认盘口
   */
  // set_default_disk_port() {
  //   return this.list.map(t => {
  //     let main_disk_data_by_csid = lodash.get(MATCH_LIST_TEMPLATE_CONFIG, `template_${t.csid}_config.template_${t.csid}_main`)
  //     t.hps.forEach(l => {

  //     })
  //     let hps_data = main_disk_data_by_csid.map(l => {
  //       return {
  //         hpid: t.chpid,
  //         chpid: l.chpid,
  //         h1: [{ ol: l }]
  //       }
  //     })
  //     return {
  //       ...t,
  //       hps: default_disk_data_by_csid
  //     }
  //   })
  // }
  appendListObj(match_list) {
    let manyObj = this.listToManyObj(match_list);
    Object.keys(manyObj.hn_obj).forEach(hn_id => {
      this.hn_obj[hn_id] = manyObj.hn_obj[hn_id]
    });
    Object.keys(manyObj.hl_obj).forEach(hl_id => {
      this.hl_obj[hl_id] = manyObj.hl_obj[hl_id];
    });
    Object.keys(manyObj.mid_obj).forEach(mid => {
      this.mid_obj[mid] = manyObj.mid_obj[mid];
    });

  }
  /**
   * @description: 设置list
   * @param {Array} matchList 需要设置的列表
   * @return {undefined} undefined
   */
  setListObj(matchList) {
    if (matchList && (matchList instanceof Array) && matchList.length) {
      this.hn_obj = {};
      this.hl_obj = {};
      this.mid_obj = {};
      matchList.forEach(item => {
        this.mid_obj[item.mid] = item;
      })
    } else {
      this.clearData();
    }
    this.set_match_data_version()
  }
  /**
   * 更新数据源赛事列表和页面中的赛事列表
   * @param {Array} match_list 全量赛事列表数据
   */
  update_match_list(match_list) {
    let update_list = (old_list, new_list) => {
      old_list.forEach(old => {
        let new_ = null;
        for (let i = 0, len = new_list.length; i < len; i++) {
          new_ = new_list[i];
          if (old.mid == new_.mid) {
            break;
          }
        }
        if (new_) {
          // Object.assign(old,new_);
          this.updMatchInfoByMatch(new_, old);
        }
      });
    };
    update_list(this.match_list_data_sources, match_list);
    update_list(this.list, match_list);
    this.set_match_data_version()
  }
  /**
   * @description: 将赛事详情对象转成多个对象,以便提高操作速度和效率
   * @param {Object} item 赛事对象
   * @param {Object} manyObj 数据叠加时使用的变量
   * @return {undefined} undefined
   */
  listItemToManyObj(item, manyObj) {


    let get_ol_item = (item3, item, item2) => {
      if (item3) {
        if (item3.hid) {
          item3.mid = item.mid;
          manyObj.hl_obj[item3.hid] = item3;
        }
        if (item3.ol && item3.ol.length) {
          item3.ol.forEach(item4 => {
            // 押注项设置盘口状态
            Object.assign(item4, {
              hs: (item3.hs ? item3.hs : 0),
              ms: (item.mhs ? item.mhs : 0),
              mid: item.mid,
              hid: item3.hid,
              id_: item3.hn ? `${item.mid}_${item2 ? (item2.chpid || item2.hpid) : ''}_${item4.ot}_${item3.hn}` : item4.oid  //id_是坑位hn或者oid
            });
            manyObj.hn_obj[item4.id_] = item4;
          });
        }
      }
    };
    let get_hl_item = (item2, item) => {
      item2.hl.forEach(item3 => {
        get_ol_item(item3, item, item2);
      });
    };
    //
    let fun = (item, manyObj, get_ol_item, get_hl_item, type_name = 'hps') => {
      if (item && item.mid) {
        manyObj.mid_obj[item.mid] = item;
        if (item && item[type_name] && item[type_name].length) {
          item[type_name].forEach(item2 => {
            if (item2) {
              if (item2.hl && item2.hl.length) {
                //
                get_hl_item(item2, item);
              }
              else {
                // 兼容冠军玩法数据结构
                get_ol_item(item2, item);
              }
            }
          });
        }
      }
    };
    fun(item, manyObj, get_ol_item, get_hl_item);
    if (item.csid == 1) {
      // hpsCorner,hpsOvertime,hpsPenalty,hpsPromotion,,hpsOutright,hpsPunish
      fun(item, manyObj, get_ol_item, get_hl_item, 'hpsCorner');
      fun(item, manyObj, get_ol_item, get_hl_item, 'hpsOvertime');
      fun(item, manyObj, get_ol_item, get_hl_item, 'hpsPenalty');
      fun(item, manyObj, get_ol_item, get_hl_item, 'hps15Minutes');
      fun(item, manyObj, get_ol_item, get_hl_item, 'hps5Minutes');
      fun(item, manyObj, get_ol_item, get_hl_item, 'hpsPromotion');
      fun(item, manyObj, get_ol_item, get_hl_item, 'hpsOutright');
      fun(item, manyObj, get_ol_item, get_hl_item, 'hpsPunish');
      fun(item, manyObj, get_ol_item, get_hl_item, 'hpsBold');
    }
  }

  /**
   * @description: 将list格式化成多个obj对象
   * @param {Array} list 赛事列表
   * @return {Object} 将赛事列表转成成对象,提高检索速度
   */
  listToManyObj(list) {
    let manyObj = { hn_obj: {}, hl_obj: {}, mid_obj: {} }
    if (list && (list instanceof Array)) {
      list.forEach(item => {
        this.listItemToManyObj(item, manyObj);
      });
    }
    return manyObj;
  }

  /**
   * @description: 修改赛事级别状态变化
   * @param {String,Number} mid 赛事mid
   * @param {Number} status  赛事级别状态
   * @return {undefined} undefined
   */
  setMatchMsStatus(mid, status) {

    let fun = (mid, status, type_name = 'hps') => {
      if (mid && this.mid_obj[mid]) {
        // 设置赛事级别状态
        Object.assign(this.mid_obj[mid], { mhs: status });
        if (this.mid_obj[mid][type_name] && (this.mid_obj[mid][type_name] instanceof Array)) {
          this.mid_obj[mid][type_name].forEach(item_hps => {
            if (item_hps && item_hps.hl && (item_hps.hl instanceof Array)) {
              item_hps.hl.forEach(item_hl => {
                if (item_hl && item_hl.ol && (item_hl.ol instanceof Array)) {
                  item_hl.ol.forEach(item_ol => {
                    if (item_ol) {
                      Object.assign(item_ol, { ms: status, hs: status });
                    }
                  });
                }
              });
            }
          });
        }

        for (let i = 0; i < this.list.length; i++) {

          if (this.list[i].mid == mid) {
            Object.assign(this.list[i], { mhs: status });
            if (this.list[i][type_name] && (this.list[i][type_name] instanceof Array)) {
              this.list[i][type_name].forEach(item_hps => {
                if (item_hps && item_hps.hl && (item_hps.hl instanceof Array)) {
                  item_hps.hl.forEach(item_hl => {
                    if (item_hl && item_hl.ol && (item_hl.ol instanceof Array)) {
                      item_hl.ol.forEach(item_ol => {
                        if (item_ol) {
                          Object.assign(item_ol, { ms: status, hs: status });
                        }
                      });
                    }
                  });
                }
                //兼容冠军玩法
                else if (item_hps.ol && (item_hps.ol instanceof Array)) {

                  item_hps.ol.forEach(item_ol => {
                    if (item_ol) {
                      Object.assign(item_ol, { ms: status, hs: status });
                    }
                  });
                }
              });
            }
            break;
          }
        }

      }
    };
    fun(mid, status);
    if (mid && this.mid_obj[mid] && this.mid_obj[mid].csid == 1) {
      // hpsCorner,hpsOvertime,hpsPenalty,hpsPromotion,,hpsOutright,hpsPunish
      fun(mid, status, 'hpsCorner');
      fun(mid, status, 'hpsOvertime');
      fun(mid, status, 'hpsPenalty');
      fun(mid, status, 'hps15Minutes');
      fun(mid, status, 'hps5Minutes');
      fun(mid, status, 'hpsPromotion');
      fun(mid, status, 'hpsOutright');
      fun(mid, status, 'hpsPunish');
      fun(mid, status, 'hpsBold');
    }
    this.set_match_data_version()
  }
  /**
   * @description: ws C105更新列表中的赛事
   * @param {Object} skt_data ws C105推送的数据
   * @return {undefined} undefined
   */
  set_match_odd_list(skt_data) {
    let update_match = (m_list, type_name = 'hps') => {
      for (let i = 0; i < m_list.length; i++) {
        let match = m_list[i];
        if (match.mid == skt_data.mid) {
          // hls 判断为undefined 执行下次循环
          if (!skt_data.hls) break;
          skt_data = lodash.cloneDeep(skt_data)
          skt_data.hls.forEach(hl_ws => {
            if (!match[type_name]) return;
            // 更新盘口级别hs
            match[type_name].forEach(match_hp => {
              if (match_hp.hl) {
                match_hp.hl.forEach(hl => {
                  if (hl.hid == hl_ws.hid) {
                    hl.hs = hl_ws.hs
                    if (hl.hv && hl_ws.hv) {
                      hl.hv = hl_ws.hv
                    }
                  }
                });
              }
              else {
                if (match_hp.hid == hl_ws.hid) {
                  match_hp.hs = hl_ws.hs
                }
              }
            });

            // 更新投注项级别ol
            if (hl_ws.ol) {
              hl_ws.ol.forEach(ol_ws => {
                if (!match[type_name]) return;
                match[type_name].forEach(match_hp => {
                  if (match_hp.hl) {
                    match_hp.hl.forEach(hl => {
                      if (!hl.ol) return;
                      hl.ol.forEach(ol_item => {
                        if (ol_ws.oid == ol_item.oid) {
                          if (ol_item.onb && ol_item.on && ol_ws.on && !ol_ws.onb) {  //queryLatestMarketInfo 接口模拟触发需要跟新大小类玩法的 on 值
                            ol_ws.onb = ol_item.onb.replace(/\d+.*/, ol_ws.on)
                            ol_ws.on = ol_item.on.replace(/\d+.*/, ol_ws.on)
                          }
                          Object.assign(ol_item, ol_ws);
                        }
                      });
                    });
                  }
                  else {
                    let ol_list = match_hp.hl ? match_hp.hl.ol : match_hp.ol;
                    ol_list.forEach(ol_item => {
                      if (ol_ws.oid == ol_item.oid) {
                        Object.assign(ol_item, ol_ws);
                      }
                    });

                  }
                });
              });
            }

          });

          break;
        }
      }
    };

    if (skt_data.hls && skt_data.hls.length) {
      update_match(this.match_list_data_sources);
      update_match(this.list);
    }
    this.set_match_data_version()
  }
  /**
   * @description: 修改盘口级别状态变化
   * @param {String,Number} hid 盘口编号
   * @param {Number} status 盘口状态
   * @param {Array} ols 盘口所对应的投注项列表
   * @return {undefined} undefined
   */
  setMatchHsStatus(hid, status, ols) {
    if (hid && this.hl_obj[hid]) {
      // 设置赛事级别状态
      Object.assign(this.hl_obj[hid], { hs: status });
      if (ols && (ols instanceof Array)) {
        // 设置新盘口信息(新增和修改)
        ols = lodash.cloneDeep(ols)
        // ols.forEach(item_ols => {
        //   let ol_obj = this.ol_obj;
        //   if(item_ols && item_ols.oid && ol_obj[item_ols.oid])
        //   {
        //     delete item_ols.onb;
        //     delete item_ols.on;
        //     Object.assign(ol_obj[item_ols.oid],item_ols);
        //   }
        // });
      }

      if (ols && this.hl_obj[hid] && this.hl_obj[hid].ol && (this.hl_obj[hid].ol instanceof Array)) {
        this.hl_obj[hid].ol.forEach(item_ol => {
          if (item_ol) {
            let update_data = { hs: status };
            let ol_filter = ols.filter(ol_item => ol_item.oid == item_ol.oid)[0];
            if (ol_filter) {
              update_data.oid = ol_filter.oid;
              update_data.os = ol_filter.os;
              update_data.ot = ol_filter.ot;
              update_data.ov = ol_filter.ov;
            }
            Object.assign(item_ol, update_data);
          }
        });
      }
    }
    this.set_match_data_version()
  }
  /**
  * @description: 增加赛事信息
  * @param {Object} obj 赛事对象
  * @return {undefined} undefined
  */
  addMatchInfo(obj) {
    const _this = this;
    if (obj.mid) {
      this.hps_15_minutes_arr_format(obj);
      let item = lodash.cloneDeep(obj);
      // 增加新盘口和押注项对象
      let fun = (item, type_name = 'hps') => {
        if (item && item[type_name] && item[type_name].length) {
          item[type_name].forEach(item2 => {
            if (item2 && item2.hl && item2.hl.length) {
              item2.hl.forEach(item3 => {
                if (item3) {
                  if (item3.hid) {
                    item3.mid = item.mid;
                    // 押注项设置盘口状态
                    _this.hl_obj[item3.hid] = item3;
                  }
                  if (item3.ol && item3.ol.length) {
                    item3.ol.forEach(item4 => {
                      Object.assign(item4, {
                        hs: (item3.hs ? item3.hs : 0),
                        ms: (item.mhs ? item.mhs : 0),
                        mid: item.mid,
                        hid: item3.hid,
                        id_: item3.hn ? `${item.mid}_${item2.chpid || item2.hpid}_${item4.ot}_${item3.hn}` : item4.oid
                      });
                      // 增加新押注项对象
                      _this.hn_obj[item4.id_] = item4;
                    });
                  }
                }
              });
            }
          });
        }
      };
      fun(item);
      if (item.csid == 1) {
        // hpsCorner,hpsOvertime,hpsPenalty,hpsPromotion,,hpsOutright,hpsPunish
        fun(item, 'hpsCorner');
        fun(item, 'hpsOvertime');
        fun(item, 'hpsPenalty');
        fun(item, 'hps15Minutes');
        fun(item, 'hps5Minutes');
        fun(item, 'hpsPromotion');
        fun(item, 'hpsOutright');
        fun(item, 'hpsPunish');
        fun(item, 'hpsBold');
      }

      // 向指定位置增加赛事
      if (this.mid_obj[obj.mid]) {
        Object.assign(this.mid_obj[obj.mid], item);
      } else {
        this.mid_obj[obj.mid] = item;
      }
    }
    this.set_match_data_version()
  }

  /**
   * @description: 根据赛事时间 换算成特几时间
   * @param {number} msc 赛事进行时间值,秒
   * @return {Object} 计算后的场次 特一 特二 等
   */

  get_hSpecial_by_msc(mst) {
    //  时间秒数数组  分别对应场次 ,mst 是比赛进行时间秒数 不可能超过十万
    return [900, 1800, 2700, 3600, 4500, 100000].findIndex(i => mst < i) + 1;
  }



  /**
   * @description: 排序十五分钟内的数据 使其按照 hSpecial 从小到大, 独赢 让球 大小 的顺序
   * @param {Object} obj 新赛事
   * @return {Object} 排序后的赛事
   */
  hps_15_minutes_arr_format(match) {
    if (!(match && match.cos15Minutes)) {
      return match;
    }
    if (match.mid == 2250301) {
    }
    // 使用到的数据
    let ret_arr = [];
    // 获取15分钟玩法数据
    let arr = match.hps15Minutes;

    //  两组特几的场次数据
    let hSpecial_sort = []
    let arr_ = lodash.sortBy(arr, ['hSpecial']);
    let _msc_n = this.get_hSpecial_by_msc(Number(match.mst)); // 根据msc获取的正确的阶段 特几场次
    // 中场加时判断 mmp 是超时字段
    if (Number(match.mst) >= 1800 && (Number(match.mst) < 2700 || [6, 41].includes(Number(match.mmp)))) {
      _msc_n = 3
    }
    let n_ = Number(lodash.get(arr_, '[0].hSpecial'));
    if (n_ > _msc_n) { // 如果后端返回的数据中没有当前场次,只有+1场次
      hSpecial_sort = [_msc_n, n_]
    } else {
      hSpecial_sort = [_msc_n, _msc_n + 1]
    }

    // 1、客户端滚球盘只针对特三和特六进行隐藏不展示（不影响早盘数据及展示）
    // 2、特二阶段，展示特二和特四的时间和盘口玩法（需要提前获取特四数据）
    // 3、特三阶段，展示特四和特五的时间和盘口玩法（需要提前获取特五数据）
    // 4、特五阶段，只展示特五的时间和盘口玩法
    // 5、特六阶段，15分钟玩法tab及盘口投注项不展示
    //特四阶段，也展示特四和特五

    // 改动 根据上述需求,增加 在特二阶段改为 显示特三和特四  特三阶段 显示特四和特五 去除特六,特五只显示特五
    switch (_msc_n) {
      case 2: hSpecial_sort = [2, 4]; break;
      case 3: hSpecial_sort = [4, 5]; break;
    }

    // 特5阶段 只显示一组数据 或者大于5只显示特5以上的数据
    if (_msc_n >= 5) {
      hSpecial_sort = [5] // 直接赋值5 因为后端经常把别的数据也返回出来
      arr = arr_.filter(i => Number(i.hSpecial) == 5);
      match.hps15Minutes = arr; // hps15Minutes,arr 指向新的数组
    }

    // 特6容错,如果服务端返回了特六 直接设置为否
    if (match.cos15Minutes && _msc_n == 6) {
      match.cos15Minutes = false;
      match.hps15Minutes = [];
      return match;
    }

    // 快速负责使用到的数据
    let ret_arr_obj = {};
    // 玩法顺序
    let hpid_sort = [32, 33, 34]
    for (let i = 0; i < hSpecial_sort.length; i++) {
      let hSpecial = hSpecial_sort[i];
      for (let j = 0; j < hpid_sort.length; j++) {
        let hpid = hpid_sort[j];
        let obj = {
          "hSpecial": hSpecial + '',
          "mid": lodash.get(match, 'mid'),
          "hpid": hpid + '',
          "hpon": 0,
          "hshow": "No",
          "hpn": "",
          "hpnb": "",
          "hpt": 1,
          "hsw": "1,4,5",
          "hmm": 0,
          "hids": 0,
          "hl": []
        }
        ret_arr_obj[`${hSpecial}_${hpid}`] = obj;
        ret_arr.push(obj)
      }
    }
    // 合并数据
    if (arr && arr.length) {
      arr.forEach(item => {
        if (item && item.hSpecial && item.hpid) {
          let obj_item = ret_arr_obj[`${item.hSpecial}_${item.hpid}`];
          if (obj_item) {
            Object.assign(obj_item, item);
          }
        }
      });
    }
    if (ret_arr) {
      Object.assign(arr, ret_arr);
    }
    return match;
  }


  /**
   * @description: 增加/修改赛事信息
   * @param {Object} obj 新赛事
   * @param {Object} match 旧赛事
   * @return {undefined} undefined
   */
  updMatchInfoByMatch(obj, match) {
    const _this = this;

    let item = lodash.cloneDeep(this.hps_15_minutes_arr_format(obj));
    /**
     *
     * @param {Object} match_inner 旧赛事数据
     * @param {Object} item 新赛事数据拷贝
     * @param {string} type_name 盘口字段(hps,hpsCorner等)
     * @returns
     */
    function fun(match_inner, item, type_name = 'hps') {
      // if(item.mid == '2277882'){
      // }
      // 获取久的  盘口数据 hps 或者  其它玩法集
      let hps_old = [];
      // 如果老数据 有 盘口数据
      if (match_inner[type_name] && match_inner[type_name].length) {
        // 如果新数据有 盘口数据
        if (item && item[type_name] && item[type_name].length) {
          // 删掉老数据的  type_name [如 'hps', 'hpsCorner' 等 key] 的指
          hps_old = match_inner[type_name].splice(0, match_inner[type_name].length);
        }
      }
      // 清除之前久的  盘口和押注项对象,删掉 _this.hl_obj    _this.hn_obj  三个老的数据
      if (hps_old && hps_old.length) {
        hps_old.forEach(item2 => {
          if (item2 && item2.hl && item2.hl.length) {
            item2.hl.forEach(item3 => {
              if (item3) {
                if (item3.hid) {
                  // 清除之前的盘口对象
                  delete _this.hl_obj[item3.hid];
                }
                if (item3.ol && item3.ol.length) {
                  item3.ol.forEach(item4 => {
                    // 清除之前的押注项对象
                    if (item4 && item4.oid) {
                      delete _this.hn_obj[item4.id_];
                    }
                  });
                }
              }
            });
          }
        });
      }
      let hps_ = [];
      // 增加新盘口和押注项对象,(主要两个功能: 如下)
      // 一： 新增 _this.hl_obj    _this.hn_obj  三个数据
      // 二： 合并 hps 里边的  ol（投注项集合） 数据
      if (item && item[type_name] && item[type_name].length) {
        item[type_name].forEach(item2 => {
          if (item2 && item2.hl && item2.hl.length) {
            item2.hl.forEach(item3 => {
              if (item3) {
                if (item3.hid) {
                  item3.mid = item.mid;
                  // 押注项设置盘口状态
                  _this.hl_obj[item3.hid] = item3;
                }
                if (item3.ol && item3.ol.length) {
                  item3.ol.forEach(item4 => {
                    Object.assign(item4, {
                      hs: (item3.hs ? item3.hs : 0), // 赛事盘口状态 0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态
                      ms: (item.mhs ? item.mhs : 0), // 赛事状态 0 赛事未开始 1 进行中 110 即将开赛
                      mid: item.mid,                 // 赛事id
                      hid: item3.hid,                // 盘口id
                      hpid: item2.hpid,              // 玩法id
                      id_: item3.hn ? `${item.mid}_${item2.chpid || item2.hpid}_${item4.ot}_${item3.hn}` : item4.oid
                    });
                    // 增加新押注项对象
                    _this.hn_obj[item4.id_] = item4;
                  });
                }
              }
            });
          }
        });
        hps_ = item[type_name];
        delete item[type_name];

        return hps_;
      }
    };
    let hps__ = fun(match, item);
    let hpsAdd = fun(match, item, 'hpsAdd');
    let hpsCorner = null;
    let hpsOvertime = null;
    let hpsPenalty = null;
    let hpsPromotion = null;
    let hpsOutright = null;
    let hpsPunish = null;
    let hps15Minutes = null;
    let hps5Minutes = null;
    let hpsBold = null;

    if (item.csid == 1) { // 如果是足球
      // hpsCorner,hpsOvertime,hpsPenalty,hpsPromotion,,hpsOutright,hpsPunish
      hpsCorner = fun(match, item, 'hpsCorner');
      hpsOvertime = fun(match, item, 'hpsOvertime');
      hpsPenalty = fun(match, item, 'hpsPenalty');
      hpsPromotion = fun(match, item, 'hpsPromotion');
      hpsOutright = fun(match, item, 'hpsOutright');
      hps15Minutes = fun(match, item, 'hps15Minutes');
      hps5Minutes = fun(match, item, 'hps5Minutes');
      hpsPunish = fun(match, item, 'hpsPunish');
      hpsBold = fun(match, item, 'hpsBold');
    }
    delete item.hpsCorner;
    delete item.hpsOvertime;
    delete item.hpsPenalty;
    delete item.hpsPromotion;
    delete item.hpsOutright;
    delete item.hpsPunish;
    delete item.hps15Minutes;
    delete item.hps5Minutes;
    delete item.hpsAdd;
    delete item.hpsBold;
    Object.assign(match, item);
    let fun2 = (match, hps_, type_name = 'hps') => {
      if (hps_ && match[type_name]) {
        hps_.forEach(item__ => {
          match[type_name].push(item__);
        });
      }
    };
    fun2(match, hps__);
    fun2(match, hpsCorner, 'hpsCorner');
    fun2(match, hpsOvertime, 'hpsOvertime');
    fun2(match, hpsPenalty, 'hpsPenalty');
    fun2(match, hpsPromotion, 'hpsPromotion');
    fun2(match, hpsOutright, 'hpsOutright');
    fun2(match, hps15Minutes, 'hps15Minutes');
    fun2(match, hps5Minutes, 'hps5Minutes');
    fun2(match, hpsPunish, 'hpsPunish');
    fun2(match, hpsAdd, 'hpsAdd');
    fun2(match, hpsBold, 'hpsBold');
    this.set_match_data_version()
  }

  /**
   * @description: 更新赛事数据
   * @param {Object} new_match 新数据
   */
  updMatchInfo(new_match) {
    if (new_match && new_match.mid) {
      if (this.mid_obj[new_match.mid]) {
        this.updMatchInfoByMatch(new_match, this.mid_obj[new_match.mid]);
      }
      for (let i = 0; i < this.match_list_data_sources.length; i++) {
        let match = this.match_list_data_sources[i];
        if (match.mid == new_match.mid) {
          this.updMatchInfoByMatch(new_match, match);
          break;
        }
      }
      for (let i = 0; i < this.list.length; i++) {
        let match = this.list[i];
        if (match.mid == new_match.mid) {
          this.updMatchInfoByMatch(new_match, match);
          break;
        }
      }
    }
    this.set_match_data_version()
  }

  /**
   * @description: 增加/修改玩法信息
   * @param {Object} obj 赛事对象
   * @param {Object} addPlay 需要修改和增加的玩法信息对象
   * @return {undefined} undefined
   */
  updPlay(obj, addPlay) {
    let fun = (obj, addPlay, type_name = 'hps') => {
      if (obj && obj.mid && obj.hpid && this.mid_obj[obj.mid] && this.mid_obj[obj.mid][type_name] && (this.mid_obj[obj.mid][type_name] instanceof Array)) {
        let hps = this.mid_obj[obj.mid][type_name];
        let play = null;
        for (let i = 0; i < hps.length; i++) {
          if (hps[i].hpid == obj.hpid) {
            play = hps[i];
            break;
          }
        }

        if (play) {
          // 删除之前的盘口对象和投注项对象
          if (play && play.hl && (play.hl instanceof Array)) {
            play.hl.forEach(item_hl => {
              if (item_hl) {
                if (item_hl.ol && (item_hl.ol instanceof Array)) {
                  item_hl.ol.forEach(item_ol => {
                    if (item_ol) {
                      // 删除押注项
                      delete this.hn_obj[item_ol.id_];
                    }
                  });
                }
                // 删除盘口对象
                delete this.hl_obj[item_hl.hid];
              }
            });
          }

          // let play_ = lodash.cloneDeep(obj);
          // 修改玩法信息
          if (obj && obj.hl && (obj.hl instanceof Array)) {
            obj.hl.forEach(item_hl => {
              if (item_hl) {
                if (item_hl.ol && (item_hl.ol instanceof Array)) {
                  item_hl.ol.forEach(item_ol => {
                    if (item_ol) {
                      // 押注项对象增加mid,hid
                      Object.assign(item_ol, {
                        mid: obj.mid,
                        hid: item_hl.hid,
                        id_: item_hl.hn ? `${obj.mid}_${obj.chpid || obj.hpid}_${item_ol.ot}_${item_hl.hn}` : item_ol.oid,
                        hs: (item_hl.hs ? item_hl.hs : 0),
                        ms: (this.mid_obj[obj.mid].mhs ? this.mid_obj[obj.mid].mhs : 0)
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
          let play_ = lodash.cloneDeep(obj);
          Object.assign(play, play_);
          play_.hl.forEach(item_hl => {
            if (item_hl) {
              if (item_hl.ol && (item_hl.ol instanceof Array)) {
                item_hl.ol.forEach(item_ol => {
                  if (item_ol) {
                    this.hn_obj[item_ol.id_] = item_ol;
                  }
                });
              }
              // 盘口对象增加mid
              this.hl_obj[item_hl.hid] = item_hl;
            }
          });

        } else if (addPlay) {
          // 未发现玩法增加
          let play_ = obj;
          // 增加盘口对象
          if (play_ && play.hl && (play_.hl instanceof Array)) {
            play_.hl.forEach(item_hl => {
              if (item_hl) {
                if (item_hl.ol && (item_hl.ol instanceof Array)) {
                  item_hl.ol.forEach(item_ol => {
                    if (item_ol) {
                      // 增加押注项
                      Object.assign(item_ol, {
                        mid: obj.mid,
                        hid: item_hl.hid,
                        id_: item_hl.hn ? `${obj.mid}_${obj.chpid || obj.hpid}_${item_ol.ot}_${item_hl.hn}` : item_ol.oid,
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
          play_ = lodash.cloneDeep(play_);
          if (play_ && play_.hl && (play_.hl instanceof Array)) {
            play_.hl.forEach(item_hl => {
              if (item_hl) {
                if (item_hl.ol && (item_hl.ol instanceof Array)) {
                  item_hl.ol.forEach(item_ol => {
                    if (item_ol) {
                      // 增加押注项
                      this.hn_obj[item_ol.id_] = item_ol;
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
    };

    fun(obj, addPlay);
    if (item.csid == 1) {
      // hpsCorner,hpsOvertime,hpsPenalty,hpsPromotion,,hpsOutright,hpsPunish
      fun(obj, addPlay, 'hpsCorner');
      fun(obj, addPlay, 'hpsOvertime');
      fun(obj, addPlay, 'hpsPenalty');
      fun(obj, addPlay, 'hpsPromotion');
      fun(obj, addPlay, 'hpsOutright');
      fun(obj, addPlay, 'hps15Minutes');
      fun(obj, addPlay, 'hps5Minutes');
      fun(obj, addPlay, 'hpsPunish');
      fun(obj, addPlay, 'hpsBold');
    }
    this.set_match_data_version()
  }

  /**
   * @description: 清空赛事对象
   * @param {String,Number} midAny 赛事mid
   * @return {undefined} undefined
   */
  clearMidObj(midAny) {
    let mid = midAny;
    if (midAny && (typeof midAny) == 'object') {
      mid = midAny.mid;
    }
    // 所有赛事对象
    if (mid && this.mid_obj[mid]) {
      let match = this.mid_obj[mid];
      // 删除对象中的所有盘口和投注项
      let fun = (match, mid, type_name = 'hps') => {
        if (match[type_name] && (match[type_name] instanceof Array)) {
          match[type_name].forEach(item_hps => {
            if (item_hps && item_hps.hl && (item_hps.hl instanceof Array)) {
              item_hps.hl.forEach(item_hl => {
                if (item_hl) {
                  if (item_hl.ol && (item_hl.ol instanceof Array)) {
                    item_hl.ol.forEach(item_ol => {
                      if (item_ol && item_ol.oid) {
                        //删除对象中的赛事
                        delete this.hn_obj[item_ol.id_];
                      }
                    });
                  }
                  //删除对象中的赛事
                  delete this.hl_obj[item_hl.hid];
                }
              });
            }
          });
          //删除对象中的赛事
          delete this.mid_obj[mid];
        }
      };

      fun(match, mid);
      if (match.csid == 1) {
        // hpsCorner,hpsOvertime,hpsPenalty,hpsPromotion,,hpsOutright,hpsPunish
        fun(match, mid, 'hpsCorner');
        fun(match, mid, 'hpsOvertime');
        fun(match, mid, 'hpsPenalty');
        fun(match, mid, 'hps15Minutes');
        fun(match, mid, 'hps5Minutes');
        fun(match, mid, 'hpsPromotion');
        fun(match, mid, 'hpsOutright');
        fun(match, mid, 'hpsPunish');
        fun(match, mid, 'hpsBold');
      }

      let ret = null;
      // 删除赛事列表中的赛事
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i] && this.list[i].mid == mid) {
          ret = this.list.splice(i, 1);
          break;
        }
      }

      // 删除源赛事列表中的赛事
      for (let i = 0; i < this.match_list_data_sources.length; i++) {
        if (this.match_list_data_sources[i] && this.match_list_data_sources[i].mid == mid) {
          this.match_list_data_sources.splice(i, 1);
          break;
        }
      }
      return ret;
    }

    let found_tid = '';
    for (let i = 0; i < this.list.length; i++) {
      let match = this.list[i];
      if (match.mid == mid) {
        found_tid = match.tid;
        break;
      }
    }
    if (found_tid) {
      for (let i = 0; i < this.list.length; i++) {
        let match = this.list[i];
        if (match.tid == found_tid && match.mids) {
          this.list[i].mids = this.list[i].mids.replace(`${mid},`, '');
          this.list[i].mids = this.list[i].mids.replace(`,${mid}`, '');
          break;
        }
      }
    }

  }

  /**
   * 新增赛事到赛事列表
   * @param {Object} match 要插入的赛事
   * @param {Number} insert_i 要插入的下标
   */
  insertMatchToList(match, insert_i) {
    if (insert_i < this.match_list_data_sources.length) {
      this.match_list_data_sources.splice(insert_i, 0, match);
    }
    else {
      this.match_list_data_sources.push(match);
    }
    this.set_match_data_version()
  }

  /**
   * @description: 清空对象
   * @param {Object,Array} any 要清空的对象和列表
   * @return {undefined} undefined
   */
  clear(any) {
    if (any && (typeof any) == 'object') {
      if (any instanceof Array) {
        any.splice(0, any.length);
      } else {
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
  clearData() {
    this.clear(this.hn_obj);
    this.clear(this.hl_obj);
    this.clear(this.mid_obj);
    this.clear(this.list);
    this.clear(this.match_list_data_sources);
  }

  /**
   * @description: 销毁函数-清除所有数据和对象
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  destroy() {
    this.clear(this.hn_obj);
    this.clear(this.hl_obj);
    this.clear(this.mid_obj);
    this.clear(this.list);
    this.clear(this.match_list_data_sources);
    this.view = null;
  }
}

// export default new MatchCtr()

const MatchCtrResponsive = ref(new MatchCtr())
export default MatchCtrResponsive.value