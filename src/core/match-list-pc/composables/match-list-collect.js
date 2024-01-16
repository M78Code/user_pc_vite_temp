import { ref, nextTick } from "vue";
import lodash from "lodash";

import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/output/module/match-data-base.js";
import { MenuData }  from "src/output/project/index.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import PageSourceData from "src/core/page-source/page-source.js";
import MatchListCard from "src/core/match-list-pc/match-card/match-list-card-class.js";
import { league_list_obj } from './match-list-processing.js';
import { api_common, api_match } from "src/api/index.js";
// 全局赛事收藏信息
const match_collect_data = { data: null };


// import MatchListData from "src/core/match-list-pc/match-data/match-list-data-class.js";
// 前端控制是否禁用收藏功能   ENABLE_COLLECT_API
const enable_collect_api = ref(false);
// 收藏数量
const collect_count = ref(0);
// 服务器端设置的 三级服务开关
const collect_switch = ref(true);
/**
 * @description 赛事收藏数量
 * @param  {object} data 设置参数
 * @return {undefined} undefined
 */
const mx_collect_count = (data) => {
  // 串关|虚拟体育|滚球电子竞技|全局收藏开关关闭时 不请求收藏数量
  // 前端开    后台开       >开
  // 前端开    后台关       >关
  // 前端关    后台开       >关
  // 前端关    后台关       >关
  if (
    !enable_collect_api.value ||
    !collect_switch.value ||
    MenuData.is_vr() ||
    PageSourceData.page_source == "search" ||
    (PageSourceData.page_source == "play" && MenuData.is_esports())
  ) {
    return;
  }
  if (typeof data == "object") {
    set_collect_count(data);
    return;
  }
  let api;
  let match_list_api_config = MenuData.match_list_api_config.match_list;
  let _params = lodash.clone(match_list_api_config.params) || {};
  // 电竞
  if (MenuData.is_esports()) {
    api = api_match.post_collect_count_es;
  } else {
    api = api_match.post_fetch_collect_count;
    // 热门赛事
    if (_params.euid == 30199) {
      _params.hotMatches = 1;
    }
  }
  // 冠军聚合页
  if (PageSourceData.page_source == "winner_top") {
    _params.outrightMatches = 1;
    // _params.sportId = ""
  }
  delete _params.cps;
  delete _params.cpn;
  api(_params).then((res) => {
    let code = lodash.get(res, "data.code");
    if (code == 200) {
      let count = lodash.get(res, "data.data", 0);
      set_collect_count({
        type: "set",
        count,
      });
    }
  });
};

/**
 * @description 更新收藏数据
 * @param  {object} params  {type:操作类型}
 * @return {undefined} undefined
 */
const update_collect_data = (params) => {
  // 全局收藏开关关闭时不更新收藏数量
  // 前端开    后台开       >开
  // 前端开    后台关       >关
  // 前端关    后台开       >关
  // 前端关    后台关       >关
  if (!enable_collect_api.value || !collect_switch.value) {
    return;
  }
  switch (params.type) {
    // 更新收藏数
    case "remove":
      if (params.match && params.match.mf) {
        mx_collect_count();
      }
      break;
    // 重新收藏赛事
    case "bet":
      if (lodash.isArray(params.mids)) {
        let mids = params.mids;
        for (let i = 0; i < mids.length; i++) {
          let mid = mids[i];
          let match = MatchListData.list_to_obj.mid_obj[mid + "_"] || {};
          //冠军联赛收藏
          if (MenuData.is_kemp()) {
            MatchListCard.update_league_collect_data(mid);
          } else {
            match.mf = 1;
          }
        }
      }
      mx_collect_count();
      break;
    // 设置收藏状态
    case "set_status":
      let match = MatchListData.list_to_obj.mid_obj[`${params.mid}_`] || {};
      if (match.mid) {
        match.mf = params.mf;
        set_collect_count({ type: "inc", count: params.mf ? 1 : -1 });
      }
      break;
  }
};
/**
 * @Description 设置收藏数量
 * @param {object} data data.type 设置类型 set 直接赋值，inc 递增，dec 递减；   data.count  数量
 * @param {undefined} undefined
 */
const set_collect_count = (data) => {
  let count = Number(data.count);
  switch (data.type) {
    case "set":
      collect_count.value = count;
      break;
    case "inc":
      collect_count.value += count;
      break;
    case "dec":
      count = collect_count.value - count;
      collect_count.value = Math.max(0, count);
      break;
  }
};
// 数据请求状态
const load_data_state = ref("loading");

/**
 * @description 赛事收藏
 * @param  {object} match  单场赛事信息
 * @return {undefined} undefined
 */
const mx_collect_match = (match) => {
  // 前端开    后台开       >开
  // 前端开    后台关       >关
  // 前端关    后台开       >关
  // 前端关    后台关       >关
  if (!enable_collect_api.value || !collect_switch.value) {
    // 临时注释，参数可能又问题 会return
    // return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("msg.msg_09"));
  }

  let cur_collect_state = Number(!match.mf);
  let _params = {
    mid: match.mid,
    cuid: UserCtr.get_uid(),
    cf: cur_collect_state,
  };
  api_common.add_or_cancel_match(_params).then((res) => {
    let code = lodash.get(res, "code");
    let data = lodash.get(res, "data");
    if (code == 200 && data == 1) {
      // 在收藏列表页 移除收藏
      if (
        (PageSourceData.page_source == "collect" || MenuData.is_collect) &&
        !cur_collect_state
      ) {
        // 移除赛事
        MatchListCard.remove_match(match.mid, {
          length_0_fn,
        });
      } else {
        match.mf = cur_collect_state;
      }
      set_collect_count({
        type: cur_collect_state ? "inc" : "dec",
        count: 1,
      });
      //通知热门推荐收藏状态变化
      useMittEmit(MITT_TYPES.EMIT_MATCH_TO_HOT_COLLECT, {
        mid: _params.mid,
        mf: cur_collect_state,
      });
    }
  });
};

const length_0_fn = () => {
  // 跳转到首页
  let obj = {
    root: 0,
    filter_tab: 1001,
  };
  MenuData.set_is_collect(false);
  MenuData.set_menu_root(0);
  MenuData.set_left_menu_result({});
  MenuData.set_mid_menu_result(obj);
  MenuData.set_current_ball_type(0);
  nextTick(() => {
    useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE, 0);
  });
};

/**
  * @Description: 根据赛事信息返回赛事类型 1：常规，2：冠军，3：电竞, 99:虚拟体育
  */
const match_collect_type = (match) => {
  let res = '1';
  // 获取是否冠军赛事
  let champion = lodash.get(match, 'tpl_id', 0);
  let menu_type = lodash.get(match, 'menu_type', 0);
  if (champion == 18 || menu_type == 100) {
    res = '2';
  } else {
    // 获取赛种
    let csid = lodash.get(match, 'csid', 0) * 1;
    if (csid >= 1000) {
      // 虚拟体育
      res = '99';
    } else if (csid >= 100) {
      // 电竞赛事
      res = '3';
    } else {
      // 常规赛事
      res = '1';
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
export const match_collect_status = (match, is_set) => {
  let type = -1
  //冠军
  if (MenuData.is_kemp() || MenuData.is_collect_kemp() || MenuData.is_common_kemp() || MenuData.is_esports_champion()) {
    type = 2
  } else if (MenuData.is_esports()) {
    type = 3//电竞
  }
  let res = { tf: false, mf: false };
  if (match&&match_collect_data.data) {
    try {
      let tid = lodash.get(match, 'tid', 0);
      let mid = lodash.get(match, 'mid', 0);
      //0:全部，1：常规，2：冠军，3：电竞
      if (type == -1) {
        type = match_collect_type(match);
      }
      let data = lodash.get(match_collect_data.data, `${type}`);
      if (data) {
        const tids = lodash.get(data, 'tids');
        const exclude = lodash.get(data, 'exclude');
        // tids联赛里面有
        if (tids && tids[tid]) {
          res.tf = true;
          res.mf = true;
          // exclude检测还发有
          if (exclude) {
            const temp_mid = lodash.get(exclude, `${tid}.mids.${mid}`);
            // if(lodash.get(exclude,`${tid}`)){
            //   res.tf = false;
            // }
            if (temp_mid) {
              res.mf = false;
            }
          }
        }
        // 赛事收藏检测
        const mids = lodash.get(data, 'mids');
        if (mids && mids[mid]) {
          res.mf = true;
        } else {
          if (!mid) {
            res.mf = false;
          }
        }
      }
      //0:全部，1：常规，2：冠军，3：电竞
      if (type == 2 && res.mf) {
        res.tf = true;
      }
    } catch (error) {
      console.error(error);
    }
  }
  // 数据合并
  Object.assign(match, res);
  is_set&&res.mf&&set_collect_count({type:'inc',count:1})
  return res;
}
/**
 * @Description 本地统计收藏数量并设置
 * @param {undefined} undefined
 */
// function local_statistics_collect_count() {
//   let match_list_len = lodash.get(this.match_list_data, "match_list.length", 0);
//   if (match_list_len) {
//     let count_mf = 0;
//     this.match_list_data.match_list.forEach((match) => {
//       // 设置收藏信息
//       match_collect_status(match);
//       // 计算收藏数量
//       match.mf && count_mf++;
//     });
//     this.set_collect_count({
//       type: "set",
//       count: count_mf,
//     });
//   } else {
//     let all_league_list = [];
//     all_league_list.push(
//       ...lodash.get(this.match_list_data, "league_list_obj.livedata", [])
//     );
//     all_league_list.push(
//       ...lodash.get(this.match_list_data, "league_list_obj.nolivedata", [])
//     );
//     let count_mf = 0;
//     try {
//       // 组装所有赛事,检测赛事收藏,算总共的收藏赛事数量
//       all_league_list.forEach((item) => {
//         let mids_ = lodash.get(item, "mids", "").split(",");
//         mids_.forEach((mid_) => {
//           // 组装所有赛事
//           const temp_match = { mid: mid_, csid: item.csid, tid: item.tid };
//           // 设置收藏信息
//           match_collect_status(temp_match);
//           // 计算收藏数量
//           temp_match.mf && count_mf++;
//         });
//       });
//       this.set_collect_count({
//         type: "set",
//         count: count_mf,
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   }
// }

/**
 * @description 联赛收藏
 * @param  {object} match  单场赛事信息
 * @param  {boolean} is_champion  是否冠军收藏
 * @return {undefined} undefined
 */
const mx_collect_leagues = async (match, is_champion) => {
  let cur_collect_state = Number(!match.tf);
  let _params = {
    tid: match.tid,
    cuid: UserCtr.get_uid(),
    cf: cur_collect_state,
  };
  //冠军收藏
  if (is_champion) {
    _params = {
      mid: match.mids,
      cuid: UserCtr.get_uid(),
      cf: cur_collect_state,
    };
  }
  await api_common.add_or_cancel_tournament(_params);
  // .then((res) => {
  // let code = lodash.get(res, "code");
  // let data = lodash.get(res, "data");
  // console.log('ddd', res, data, code);

  // if ( code == 200 && data == 1) {
  // 不等接口，先更新收藏状态
  match.tf = cur_collect_state;
  //更新常规赛事不同分类的联赛收藏状态 并 获取所有同联赛下的赛事ID
  let mids_arr =
    MatchListCard.update_league_collect_data_and_get_mids(
      match.tid,
      cur_collect_state
    ) || [];
  //跟新原数据联赛收藏状态
  // MatchListData.set_league_list_collect(
  //   match.tid,
  //   cur_collect_state,
  //   [1, 3].includes(
  //     MatchListCard.get_match_list_mapping_relation_obj_type()
  //   )
  // );
  
  mids_arr.forEach((mid) => {
    let match_item = MatchListData.list_to_obj.mid_obj[mid + "_"] || {};
    match_item.tf = cur_collect_state;
    match_item.mf = cur_collect_state;
    // 在收藏列表页 移除收藏
    if (
      (PageSourceData.page_source == "collect" || MenuData.is_collect) &&
      !cur_collect_state
    ) {
      // 移除联赛卡片
      MatchListCard.remove_league(match.tid, {
        length_0_fn,
      });
      let match_length;
      if (MenuData.is_esports()) {
        match_length =
          lodash.get(league_list_obj.value, "livedata.length", 0) +
          lodash.get(league_list_obj.value, "nolivedata.length", 0);
      } else {
        match_length = MatchListData.match_list.length;
      }
      // 赛事数量为0 设置暂无数据
      if (match_length == 0) {
        // load_data_state.value = "empty";
      }
    }
  });
  // 通过网络获取数据用户收藏数据
  // get_collect_matche_data_form_net({ matchType: 0, cuid: _params.cuid }, () => {
  //   local_statistics_collect_count();
  // });
  // } else {
  //   useMittEmit(
  //     MITT_TYPES.EMIT_SHOW_TOAST_CMD,
  //     i18n_t("common.collect_toast")
  //   );
  // }
  // 获取列表最新的收藏数量
  mx_collect_count();
  await fethc_collect_match()
  // })
  // .catch((err) => {
  //   console.error(err)
  //   useMittEmit(
  //     MITT_TYPES.EMIT_SHOW_TOAST_CMD,
  //     i18n_t("common.collect_toast")
  //   );
  // });
};

/**
 * @description 收藏联赛、赛事
 * @param  {object} params {type:"match||leagues",match:"单前赛事信息",matc_index"当前赛事在列表中的 index"}
 * @return {undefined} undefined
 */
const mx_collect = ({ type = "match", match, match_index }) => {
  // 前端开    后台开       >开
  // 前端开    后台关       >关
  // 前端关    后台开       >关
  // 前端关    后台关       >关
  if (!enable_collect_api.value || !collect_switch.value) {
    // 临时注释，参数可能又问题 会return
    // return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("msg.msg_09"));
  }
  if (MenuData.is_kemp()) {
    type = "champion";
  }
  // 联赛收藏
  if (type == "leagues") {
    mx_collect_leagues(match);
    // 冠军收藏
  } else if (type == "champion") {
    mx_collect_leagues(match, true);
    // 赛事收藏
  } else {
    mx_collect_match(match, match_index);
  }
};

/**
* @Description:设置全局收藏数据格式化数据 obj为http://api.sportxxxvo3.com/yewu11/v1/w/collectMatchesPB接口返回数据
* param{object} obj 收藏数据,操作后的对象: {"1":{"tids":{"6666":1},"mids":{"3544337":1},"exclude":{"822459":{"tids":"822459","mids":{"222":1}}}}}
*/
export const set_global_collect_data = (obj) => {
  // 列表转对象
  const fun_list2obj = function (list) {
    const obj = {};
    if (list && list.length && typeof list != 'string') {
      try {
        list.forEach(item => {
          if (item) {
            obj[item] = 1;
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
    return obj;
  }
  if (obj) {
    obj = lodash.cloneDeep(obj);
    // 所有列表转对象
    for (const key in obj) {
      const temp = obj[key];
      if (temp) {
        // tids所有列表转对象
        const tids = lodash.get(temp, 'tids');
        temp.tids = fun_list2obj(tids);
        // mids所有列表转对象
        const mids = lodash.get(temp, 'mids');
        temp.mids = fun_list2obj(mids);
        // exclude所有列表转对象
        const exclude = lodash.get(temp, 'exclude');
        if (exclude) {
          const obj = {};
          exclude.forEach(item => {
            const tids = lodash.get(item, 'tids');
            const mids = lodash.get(item, 'mids');
            if (tids && mids) {
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

// 请求当前收藏的数据
function fethc_collect_match() {
  let matchType = 0;
  api_match
    .post_fetch_collect_list_high_light({ matchType, cuid: UserCtr.get_cuid() })
    .then((res) => {
      if (res.code == 200) {
        let data = lodash.get(res, 'data');
        // 格式化接口返回的收藏对象
        set_global_collect_data(data);
      }
    });
}
useMittOn(MITT_TYPES.EMIT_MX_COLLECT_COUNT_CMD, update_collect_data)
useMittOn(MITT_TYPES.EMIT_MX_COLLECT_COUNT2_CMD, mx_collect_count)
useMittOn(MITT_TYPES.EMIT_MX_COLLECT_MATCH, mx_collect_match)
export {
  // 收藏数量
  collect_count,
  // 数据请求状态
  load_data_state,
  // 设置收藏数量
  set_collect_count,
  //赛事收藏数量
  mx_collect_count,
  //联赛收藏
  mx_collect_leagues,
  //更新收藏数据
  update_collect_data,
  //收藏联赛、赛事
  mx_collect,
  //赛事收藏
  mx_collect_match,
  // 请求收藏的赛事信息
  fethc_collect_match,
};
