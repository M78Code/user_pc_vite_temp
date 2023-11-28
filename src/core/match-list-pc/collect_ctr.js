/*
 * @Author: hanmar
 * @Description: 赛事收藏和联赛收藏计算逻辑
 */
import {post_fetch_collect_list_high_light } from "src/public/api/module/match/match_api.js"
// 收藏api
const get_collect_matches_api = post_fetch_collect_list_high_light;
// 全局赛事收藏信息
const match_collect_data = {data:null};


/**
* @Description:设置全局收藏数据格式化数据 obj为http://api.sportxxxvo3.com/yewu11/v1/w/collectMatchesPB接口返回数据
* param{object} obj 收藏数据,操作后的对象: {"1":{"tids":{"6666":1},"mids":{"3544337":1},"exclude":{"822459":{"tids":"822459","mids":{"222":1}}}}}
*/
export const set_global_collect_data = (obj) =>{
    // {
    //   "code": "0000000",
    //   "data": {
    //     "1": {
    //       "tids": [],
    //       "mids": [
    //         "3544337"],
    //       "exclude": [{
    //         "tids": "822459",
    //         "mids": ['222']
    //       }]
    //     }
    //   },
    //   "msg": "成功",
    //   "ts": 1696755846704
    // }
    // 列表转对象
    const fun_list2obj = function(list) {
      const obj = {};
      if(list){
        try {
          list.forEach(item => {
            if(item){
              obj[item] = 1;
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
      return obj;
    }
    if(obj){
      obj = _.cloneDeep(obj);
      // 所有列表转对象
      for (const key in obj) {
        const temp = obj[key];
        if (temp) {
          // tids所有列表转对象
          const tids = _.get(temp,'tids');
          temp.tids= fun_list2obj(tids);
          // mids所有列表转对象
          const mids = _.get(temp,'mids');
          temp.mids = fun_list2obj(mids);
          // exclude所有列表转对象
          const exclude = _.get(temp,'exclude');
          if(exclude){
            const obj = {};
            exclude.forEach(item => {
              const tids =  _.get(item,'tids');
              const mids =  _.get(item,'mids');
              if(tids && mids){
                item.mids = fun_list2obj(mids);
                obj[tids] = item;
              }
            });
            temp.exclude = obj;
          }
        }
      }
      match_collect_data.data = obj;
    }
  }
  
  /**
  * @Description: 根据赛事信息返回赛事类型 1：常规，2：冠军，3：电竞, 99:虚拟体育
  */
  const match_collect_type = (match)=>{
    let res = '1';
    // 获取是否冠军赛事
    let champion = _.get(match,'tpl_id', 0);
    let menu_type = _.get(match,'menu_type', 0);
    if(champion == 18 || menu_type == 100){
      res =  '2';
    } else {
      // 获取赛种
      let csid = _.get(match,'csid', 0)*1;
      if(csid>=1000){
        // 虚拟体育
        res =  '99';
      } else if(csid>=100){
        // 电竞赛事
        res =  '3';
      } else {
        // 常规赛事
        res =  '1';
      }
    }
    return res;
  }
  
  /**
  * @Description:获取赛事收藏信息并设置赛事mf和联赛tf收藏信息
  * param{Object} obj 赛事数据(元数据直接操作) {tid:'888',mid:'222'}
  * param{Object} obj 收藏数据对象 {"1":{"tids":{"6666":1},"mids":{"3544337":1},"exclude":{"822459":{"tids":"822459","mids":{"222":1}}}}}
  * param{String} type 赛事类型 // 1：常规，2：冠军，3：电竞
  * return {Object} 收藏信息 {tf:false,mf:false}
  */
  export const match_collect_status = (match, obj, type=-1) =>{
    // match={tid:'888',mid:'222'};
    // obj= {"1":{"tids":{"888":1},"mids":{"222":1},"exclude":{"888":{"tids":"888","mids":{"2221":1}}}}}
    if(!obj){
      obj = match_collect_data.data;
    }
    let res = {tf:false,mf:false};
    if(match && obj){
      try {
        let tid = _.get(match,'tid', 0);
        let mid = _.get(match,'mid', 0);
        //0:全部，1：常规，2：冠军，3：电竞
        if(type==-1){
          type = match_collect_type(match);
        }
        let data = _.get(obj,`${type}`);
        if(data){
          const tids = _.get(data,'tids');
          const exclude = _.get(data,'exclude');
          // tids联赛里面有
          if(tids && tids[tid])
          {
            res.tf=true;
            res.mf = true;
            // exclude检测还发有
            if(exclude){
              const temp_mid = _.get(exclude,`${tid}.mids.${mid}`);
              // if(_.get(exclude,`${tid}`)){
              //   res.tf = false;
              // }
              if(temp_mid){
                res.mf = false;
              }
            }
          }
          // 赛事收藏检测
          const mids = _.get(data,'mids');
          if(mids && mids[mid]){
            res.mf = true;
          } else {
            if(!mid){
              res.mf = false;
            }
          }
        }
        //0:全部，1：常规，2：冠军，3：电竞
        if(type==2 && res.mf){
          res.tf = true;
        }
      } catch (error) {
        console.error(error);
      }
    }
    // console.error(type,'赛-事收藏信息:',match, res);
    // 数据合并
    Object.assign(match, res);
    return res;
  }

  /**
* @Description:通过网络获取数据用户收藏数据
* param{object} param 请求参数 {matchType:0,cuid:'22222332'}
*/
export const get_collect_matche_data_form_net = (param,callback)=> {
  if(param){
    get_collect_matches_api(param).then(res => {
      if(_.get(res,'data.code') == 200){
        const data = _.get(res,'data.data');
        set_global_collect_data(data)
          callback && callback({status:1, data})
      } else {
        callback && callback({status:0})
      }
    }).catch((error)=> {
      callback&& callback({status:0})
      console.error(error);
    })
  }
}
  