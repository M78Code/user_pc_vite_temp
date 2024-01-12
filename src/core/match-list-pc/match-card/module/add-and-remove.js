import { update_match_parent_card_style } from "src/core/match-list-pc/match-card/module/utils.js";
import { compute_style_template_by_matchinfo } from "./compute-style-template.js";
import { conpute_match_list_card_offset } from "./card-show-offset.js";
import { compute_match_list_style_obj_and_match_list_mapping_relation_obj } from "./data-relation.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/output/module/match-data-base.js";
import MatchListCardData from "./match-list-card-data-class";
import { league_list_obj } from '../../composables/match-list-processing.js'
import PageSourceData from "src/core/page-source/page-source.js";
import { fold_template } from "../config/card-template-config.js"
import { MenuData } from 'src/output/project/index.js'

const { page_source, route_name } = PageSourceData;
/**
 * @Description 移除一场联赛
 * @param {number} remove_tid 移除的联赛ID
 */
export const remove_league = (remove_tid, callback) => {
  if (MenuData.is_esports()) {
    // 列表接口数据类型为联赛列表
    let all_league_obj = league_list_obj.value;
    // 遍历所有赛事数据
    let match_status_type_arr = ["livedata", "nolivedata"];
    match_status_type_arr.forEach((match_status_type) => {
      // 遍历联赛列表
      let league_list = lodash.get(all_league_obj, match_status_type, []);
      league_list.forEach((league_obj, league_index) => {
        // 判断联赛ID是否相等
        if (remove_tid == league_obj.tid) {
          league_list.splice(league_index, 1);
        }
      });
    });
    // 重新计算卡片样式
    compute_match_list_style_obj_and_match_list_mapping_relation_obj(
      all_league_obj,
      true
    );
  } else {
    // 列表接口数据类型为赛事列表
    let match_list = MatchListData.match_list;
    // 移除联赛ID一样的赛事
    lodash.remove(match_list, (match) => {
      return match.tid == remove_tid;
    });
    //当没有数据时，返回到首页
    if (match_list.length == 0) {
      if (callback && callback.length_0_fn) {
        callback.length_0_fn();
      }
    }
    // 重新计算卡片样式
    compute_match_list_style_obj_and_match_list_mapping_relation_obj(
      match_list,
      true
    );
  }
};
/**
 * 更新     all_card_obj
 * 更新     映射信息
 * 这里注意  单个赛事增删  不用遍历循环全部 的 数据
 * bymids接口拉取数据或者 ws推送改变赛事盘口变更
 */
export const recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs =
  (mids_arr) => {

    // 是否走卡片逻辑
    if (!MatchListCardData.is_run_card_function) {
      return;
    }
    mids_arr.forEach((mid) => {
      // 原来的样式数据
      let old_match_style_obj = MatchListCardData.get_card_obj_bymid(mid);
      if (old_match_style_obj) {
        // 判断是否需要动态计算高度
        if (old_match_style_obj.is_dynamic_compute_height || lodash.get(old_match_style_obj, 'card_total_height')) {
          let match = MatchListData.get_quick_mid_obj(mid);
          let match_style_obj = compute_style_template_by_matchinfo(
            match
          );
          // 更新赛事表征数据
          Object.assign(old_match_style_obj, match_style_obj);
          // 更新赛事父级卡片样式 即对应的联赛容器卡片样式
          update_match_parent_card_style(
            old_match_style_obj,
            MatchListCardData.all_card_obj
          );
        }
      } else {
        console.error('jiffy',mid, old_match_style_obj)
      }
    });
    // 设置列表总高度
    conpute_match_list_card_offset();
  };
/**
 *
 *
 * 当移除赛事导致列表赛事为 空 的 执行回调   demo 版本  ， 具体需要自己实现
 *  并且 在调用   remove_match  方法的时候 传入  回调   { length_0_fn：xxxx_fn   }
 */
const remove_match_callback_when_match_list_length_0_demo = () => {
  // if([1,3].includes(MatchListCardData.match_list_mapping_relation_obj_type)){
  //   // this.view.set_load_data_state('empty')
  // }else{
  //      // 收藏时当列表为空时跳转菜单
  //      if(localStorage.getItem('get_layout_list_type') == 'collect'){
  //       //取消最后一个收藏定位到赛事列表
  //       this.view.vx_set_layout_list_type("match");
  //       // 获取赛事列表数据
  //       this.view.fetch_match_list()
  //     }else{
  //       this.view.set_load_data_state('empty')
  //     }
  // }
};
/**
 * @Description 移除一场赛事    列表类型     1 3
 * @param {number} remove_mid 移除的赛事ID
 */
const remove_match_when_match_list_mapping_relation_obj_type_1_3 = (
  remove_mid,
  callback
) => {
  // 列表接口数据类型为联赛列表
  // 移除的赛事联赛ID
  let remove_tid = lodash.get(
    MatchListData.list_to_obj.mid_obj,
    `${remove_mid}_.tid`
  );
  let all_league_obj = league_list_obj.value;
  // 遍历所有赛事数据
  let match_status_type_arr = ["livedata", "nolivedata"];
  match_status_type_arr.forEach((match_status_type) => {
    // 遍历联赛列表
    let league_list = lodash.get(all_league_obj, match_status_type, []);
    for (let index = 0; index < league_list.length; index++) {
      const league_obj = league_list[index];
      // 判断联赛ID是否相等
      if (remove_tid == league_obj.tid) {
        //删掉赛事
        league_obj.mids = lodash.remove(league_obj.mids.split(","), remove_mid).join(',')
        if (league_obj.mids == '') { //删掉联赛
          league_list.splice(index, 1)
          index--;
        }
      }
    }
  });
  let match_length =
    lodash.get(all_league_obj, "livedata.length", 0) +
    lodash.get(all_league_obj, "nolivedata.length", 0);
  if (match_length == 0) {
    if (callback && callback.length_0_fn) {
      // 参照 remove_match_callback_when_match_list_length_0_demo
      callback.length_0_fn();
    }
  } else {
    // 重新计算卡片样式
    compute_match_list_style_obj_and_match_list_mapping_relation_obj(
      all_league_obj,
      true,
      true
    );
  }
};
/**
 * @Description 移除一场赛事   列表类型     其他
 * @param {number} remove_mid 移除的赛事ID
 */
const remove_match_when_match_list_mapping_relation_obj_type_other = (
  remove_mid,
  callback
) => {
  // 列表接口数据类型为赛事列表
  let len = MatchListCardData.match_list_key.length;
  let match_list = MatchListCardData.match_list_key;
  match_list.forEach((match, index) => {
    if (match.mid == remove_mid) {
      match_list.splice(index, 1);
    }
  });
  if (len == match_list.length) return; //如果总是没有变化就直接返回
  if (match_list.length == 0) {
    // 参照 remove_match_callback_when_match_list_length_0_demo
    if (callback && callback.length_0_fn) {
      callback.length_0_fn();
    }
  } else {
    // 重新计算卡片样式
    compute_match_list_style_obj_and_match_list_mapping_relation_obj(
      match_list,
      true,
      true
    );
  }
  // 滚球 重新计算菜单数量
  if (
    MenuData.cur_level1_menu == "play" &&
    !page_source == "collect"
  ) {
    MatchListData.match_list_data.compute_sport_count(remove_mid);
  }
};
/**
 * @Description 移除一场赛事
 * @param {number} remove_mid 移除的赛事ID
 * @param {}  callback 特定状态回调
 */
export const remove_match = (remove_mid, callback) => {
  if (route_name == "search") {
    return;
  }
  if (lodash.get(league_list_obj.value, 'livedata') || lodash.get(league_list_obj.value, 'nolivedata')) {
    remove_match_when_match_list_mapping_relation_obj_type_1_3(
      remove_mid,
      callback
    );
  } else {
    remove_match_when_match_list_mapping_relation_obj_type_other(
      remove_mid,
      callback
    );
  }
};
/**
 * @Description 新增球种标题卡片 或者赛事状态标题卡片 设置折叠数据
 */
export const set_new_sport_title_card_fold = () => {
  // 新增球种操作
  lodash.each(MatchListCardData.csid_to_card_key_obj, (card_key_arr) => {
    let sport_card_obj = MatchListCardData.all_card_obj[card_key_arr[0]] || {};
    // 如果未设置折叠数据  设置折叠数据
    if (!sport_card_obj.hasOwnProperty("is_show_card")) {
      Object.assign(sport_card_obj, fold_template);
    }
  });
  // 滚球标题卡片折叠数据处理
  let play_card_obj = MatchListCardData.all_card_obj["play_title"] || {};
  if (!play_card_obj.hasOwnProperty("is_show_card")) {
    Object.assign(play_card_obj, fold_template);
  }
  // 未开赛标题卡片折叠数据处理
  let no_start_card_obj =
    MatchListCardData.all_card_obj["no_start_title"] || {};
  if (!no_start_card_obj.hasOwnProperty("is_show_card")) {
    Object.assign(no_start_card_obj, fold_template);
  }
};
