/*
 * @Author: success
 * @Date: 2020-09-07 12:45:19
 * @Description:赛事详情页面信息操作类-实现快速检索,修改等功能
 */
export default class MatchInfoCtr
{
  /**
   * @description: 构造函数
   * @param {Object} view Vue实例
   * @return {undefined} undefined
   */
  constructor(view)
  {
    // 视图对象
    this.view = view;
    // 初始化数据
    this.init();
  }


  /**
   * @description: 数据初始化
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  init(){
    this.list = [];
    // 所有投注项对象
    this.ol_obj={};
    // 所有盘口对象
    this.hl_obj={};
    // 赛事对象
    this.match_obj={};
  }

  /**
   * @description: 增加/修改赛事信息
   * @param {obj} 赛事信息对象
   * @return {undefined} undefined
   */
  setMatchObj(obj){
    Object.assign(this.match_obj,obj);
    this.match_obj = lodash.cloneDeep(this.match_obj);
  }

  /**
   * @description: 设置list
   * @param {Array} list 赛事信息集合
   * @return {undefined} undefined
   */
  setList(list){
    if(list && (list instanceof Array) && list.length)
    {
      // 赛事信息集合
      // this.list = lodash.cloneDeep(list);
      let list_ = this.list;
      // 所有投注项对象
      let ol_obj_= this.ol_obj;
      // 所有盘口对象
      let hl_obj_ = this.hl_obj;

      let manyObj = this.listToManyObj(list);
      this.list = list;
      this.ol_obj = manyObj.ol_obj;
      this.hl_obj = manyObj.hl_obj;

      this.clear(manyObj);
      this.clear(list_);
      this.clear(ol_obj_);
      this.clear(hl_obj_);
    } else {
      this.clearData();
    }
  }

   /**
   * @description: 按照玩法顺序排序(原来地址顺序发生变化)
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  listSort(){
    if(this.list && (this.list instanceof Array))
    {
      this.list.sort(function(a, b){
        return a.hpon-b.hpon;
      });
    }
  }

  /**
   * @description: 冒泡排序(原来地址顺序不发生变化---保持原来的顺序不变,返回新的列表但是子项使用原来的地址)
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  listSortNew(){
    let list = this.list;
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
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  listSortNormal(){
    let list = this.list;
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
   * @description: 将赛事详情对象转成多个对象,以便提高操作速度和效率
   * @param {Object} item 赛事对象
   * @param {Object} manyObj 数据叠加时使用的变量
   * @return {undefined} undefined
   */
  listItemToManyObj(item, manyObj){
    let flag = this.view && this.view.$route.name == 'match_result'; // 赛果页的 mhs 固定给 0
    if(!this.match_obj.mid)
    {
      this.match_obj.mid = item.mid;
    }
    if(item && item.mid == this.match_obj.mid)
    {
      let mhs = 0;
      if(this.view && this.match_obj.mid == this.view.get_detail_data.mid){
        mhs = this.view.get_detail_data.mhs;
      }
      if (item && item.hl && item.hl.length) {
        item.hl.forEach(item3 => {
          if (item3) {
            if (item3.hid) {
              item3.mid = item.mid;
              manyObj.hl_obj[item3.hid] = item3;
            }
            if (item3.ol && item3.ol.length) {
              item3.ol.forEach(item4 => {
                // 押注项设置盘口状态
                Object.assign(item4, {
                  _hs: (item3.hs ? item3.hs : 0),
                  // ms: (item.mhs ? item.mhs : mhs),
                  _mhs: (flag ? 0 : item.mhs ? item.mhs : 0),
                  _mid: item.mid,
                  hid: item3.hid,
                  id_: item3.hn ? `${item.mid}_${item.chpid || item.hpid}_${item4.ot}_${item3.hn}`: item4.oid,
                  os:item4.result != undefined ? 1 : item4.os,  //赛果接口没有里层的os，需要拼一个
                });
                manyObj.ol_obj[item4.oid] = item4;
              });
            }
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
  listToManyObj(list){
    let manyObj = {ol_obj:{}, hl_obj:{}}
    if(list && (list instanceof Array))
    {
      // list.forEach((item,i) => {
        list.forEach((item) => {
        this.listItemToManyObj(item,manyObj);
      });
    } else {

    }
    return manyObj;
  }

  /**
   * @description: 修改赛事级别状态变化
   * @param {String,Number} mid 赛事mid
   * @param {Number} status  赛事级别状态
   * @return {undefined} undefined
   */
  setMatchMsStatus(status){
    // 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
    if(this.match_obj && this.match_obj.mid)
    {
      let mid = this.match_obj.mid;
      // 设置赛事状态
      Object.assign(this.match_obj, {mhs:status, hs:status})
      // 设置投注项状态
      if(this.list && (this.list instanceof Array))
      {
        this.list.forEach(item_hps => {
          if(item_hps && item_hps.hl && (item_hps.hl instanceof Array))
          {
            item_hps.hl.forEach(item_hl => {
              if(item_hl && item_hl.ol && (item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                  if(item_ol)
                  {
                    Object.assign(item_ol,{ms:status});
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
   * @description: 修改盘口级别状态变化
   * @param {String,Number} hid 盘口编号
   * @param {Number} status 盘口状态
   * @param {Array} ols 盘口所对应的投注项列表
   * @return {undefined} undefined
   */
  setMatchHsStatus(hid,status,ols){
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
            Object.assign(item_ol,{hs:status});
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
  // setMatchOsStatus(oid,status){
  //   if(oid&&this.ol_obj[oid])
  //   {
      // 设置赛事级别状态
  //     Object.assign(this.ol_obj[oid],{os:status});
  //   }
  // }

  // /**
  //  * @description: 向指定位置增加赛事信息
  //  * @param {Object} obj 赛事对象
  //  * @param {Number} index 插入的位置
  //  * @return {undefined} undefined
  //  */
  // insert_match_obj(obj,index){
  //   // if(obj.mid&&obj.hpid&&this.match_obj&&this.match_obj.hps&&(this.match_obj.hps instanceof Array))
  //   if(obj.mid)
  //   {
  //     let item = lodash.cloneDeep(obj);
  //     // let hps_ = []
  //     // 增加新盘口和押注项对象
  //     if (item && item.hps && item.hps.length) {
  //       item.hps.forEach(item2 => {
  //         if (item2 && item2.hl && item2.hl.length) {
  //           item2.hl.forEach(item3 => {
  //             if (item3) {
  //               if (item3.hid) {
  //                 item3.mid = item.mid;
  //                 // 押注项设置盘口状态
  //                 this.hl_obj[item3.hid] = item3;
  //               }
  //               if (item3.ol && item3.ol.length) {
  //                 item3.ol.forEach(item4 => {
  //                   Object.assign(item4, {
  //                     hs: (item3.hs ? item3.hs : 0),
  //                     ms: (item.mhs ? item.mhs : 0),
  //                     mid: item.mid,
  //                     hid: item3.hid,
  //                   });
  //                   // 增加新押注项对象
  //                   this.ol_obj[item4.oid] = item4;
  //                 });
  //               }
  //             }
  //           });
  //         }
  //       });
  //       // hps_ = item.hps;
  //       // delete item.hps;
  //     }
  //     // 向指定位置增加赛事
  //     this.list.splice(index, 0, item);
  //     if(this.match_obj){
  //       Object.assign(this.match_obj,this.list[index]);
  //     } else{
  //       this.match_obj = this.list[index];
  //     }
  //   }
  // }

  /**
   * @description: 获取当前玩法
   * @param {String}} hpid 玩法编号  示例  hpid: "2,38,39,216,57"
   * @return {Array} 玩法对象集合
   */
  getPlayInfo(hpid){
    let play = [];
    if(hpid)
    {
      let arr_hpid = hpid.split(',');
      for (let i = 0; i < this.list.length; i++) {
        for (const item of arr_hpid) {
          if(this.list[i].hpid == item)
          {
            // play = this.list[i];
            play.push(this.list[i])
            // break;
          }
        }
      }
    }
    return play;
  }

  /**
   * @description: 增加/修改玩法信息
   * @param {Array} obj_arr 赛事对象集合
   * @param {Object} addPlay 需要修改和增加的玩法信息对象
   * @return {undefined} undefined
   */
  updPlay(obj_arr,addPlay){
    if(obj_arr.length && Array.isArray(obj_arr)){   //以前是对象，现在是数组，所以要在外层循环一次
      for (const obj of obj_arr) {

        if(obj && this.match_obj && this.match_obj.mid == obj.mid && this.list &&(this.list instanceof Array))
        {
          // let isFind = false;
          let hps = this.list;
          let play = null;
          for (let i = 0; i < hps.length; i++) {
            if((!obj.topKey && hps[i].hpid == obj.hpid) || (hps[i].hpid == obj.hpid && hps[i].topKey == obj.topKey))
            {
              play = hps[i];
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
            if(obj&&obj.hl&&(obj.hl instanceof Array))
            {
              obj.hl.forEach(item_hl => {
                if(item_hl){
                  if(item_hl.ol&&(item_hl.ol instanceof Array))
                  {
                    item_hl.ol.forEach(item_ol => {
                      if(item_ol){
                        // 押注项对象增加mid,hid
                        Object.assign(item_ol, {
                          mid: obj.mid,
                          hid: item_hl.hid,
                          hs: (item_hl.hs ? item_hl.hs : 0),
                          ms: (this.match_obj.mhs ? this.match_obj.mhs : 0),
                          id_: item_hl.hn ? `${obj.mid}_${obj.chpid || obj.hpid}_${item_ol.ot}_${item_hl.hn}` : item_ol.oid
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
                        // 增加押注项
                        Object.assign(item_ol, {
                          mid: obj.mid,
                          hid: item_hl.hid,
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
            if(play_&&play_.hl&&(play_.hl instanceof Array))
            {
              play_.hl.forEach(item_hl => {
                if(item_hl){
                  if(item_hl.ol&&(item_hl.ol instanceof Array))
                  {
                    item_hl.ol.forEach(item_ol => {
                      if(item_ol){
                        // 增加押注项
                        this.ol_obj[item_ol.oid] = item_ol;
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
    }
  }

/**
 * @description: 清空盘口对象
 * @param {String,Number} hid 盘口编号
 * @return {undefined} undefined
 */
clearHlObj(hid){
  // var isBreak = false;
  if(hid&&this.hl_obj[hid])
  {
    // 查找list中的列表数据
    if(this.hl_obj[hid].ol && (this.hl_obj[hid].ol instanceof Array))
    {
      // 删除下面的所有押注项
      this.hl_obj[hid].ol.forEach(item_ol => {
        if(item_ol&&item_ol.oid)
        {
          // this.clearOlObj(item_ol.oid);
          delete this.ol_obj[item_ol.oid];
        }
      });
    }
    // 删除盘口对象
    delete this.hl_obj[hid];
    //删除列表中盘口对象
    if(this.list && (this.list instanceof Array))
    {
      let hl_list = null;
      let ret = false;
      for (let i = 0; i < this.list.length; i++) {
        hl_list = this.list[i];
        if(hl_list && hl_list.hl && (hl_list.hl instanceof Array))
        {
          for (let j = 0; j < hl_list.hl.length; j++) {
            if(hl_list.hl[j] && hl_list.hl[j].hid && hl_list.hl[j].hid == hid)
            {
              hl_list.hl.splice(j, 1);
              ret = true;
              break;
            }
          }
        }
        if(ret)
        {
          break;
        }
      }
    }
  }
}

/**
 * @description: 清空投注项对象
 * @param {String,Number} oid 投注项编号
 * @return {undefined} undefined
 */
// clearOlObj(oid){
//   if(oid&&this.ol_obj[oid])
//   {
//     var hid = this.ol_obj[oid].hid;
//     // 查找list中的列表数据
//     if(hid&&this.hl_obj[hid])
//     {
//       var ol = this.hl_obj[hid].ol;
//       if(ol&& ol.length)
//       {
//         for (let i = 0; i < ol.length; i++) {
//           if(ol[i]&&ol[i].oid == oid)
//           {
//             ol.splice(i,1);
//             break;
//           }
//         }
//       }
//     }
//     // 删除押注项对象
//     delete this.ol_obj[oid];
//   }
// }

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
  clearData(){
    this.clear(this.ol_obj);
    this.clear(this.hl_obj);
    this.clear(this.match_obj);
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
    this.clear(this.match_obj);
    this.clear(this.list);
    this.view = null;
  }
}
