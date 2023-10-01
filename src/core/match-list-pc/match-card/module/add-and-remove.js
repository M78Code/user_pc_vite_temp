import { update_match_parent_card_style } from "./utils.js";
import { compute_style_template_by_matchinfo } from "./compute-style-template.js";
import { conpute_match_list_card_offset } from "./card-show-offset.js";
import { compute_match_list_style_obj_and_match_list_mapping_relation_obj } from "./data-relation.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/core/index.js";
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";
import use_featch_fn from '../../composables/match-list-featch.js'
import { PageSourceData } from 'src/core/index.js';


//引入菜单类
const MenuData = {
  menu_data: {
    is_show_hot: false,
  },
};

const { page_source } = PageSourceData;
const { league_list_obj } = use_featch_fn();

/**
 * @Description 移除一场联赛
 * @param {number} remove_tid 移除的联赛ID
 */
export const remove_league = (remove_tid) => {
  if (MenuData.menu_data.is_esports) {
    // 列表接口数据类型为联赛列表
    let all_league_obj = league_list_obj;
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
    let match_list = MatchListData.match_list_data.match_list;
    // 移除联赛ID一样的赛事
    lodash.remove(match_list, (match) => {
      return match.tid == remove_tid;
    });
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
    if (!MatchListCardClass.is_run_card_function) {
      return;
    }
    mids_arr.forEach((mid) => {
      // 原来的样式数据
      let old_match_style_obj =
        MatchListCardClass.all_card_obj[mid+'_'] || {};
        debugger
      // 判断是否需要动态计算高度
      if (
        old_match_style_obj.is_dynamic_compute_height ||
        !old_match_style_obj.card_total_height
      ) {
        // 更新赛事表征数据
        let match = MatchListData.list_to_obj.mid_obj[mid+'_'] || {};
        console.log('mids_arrmids_arr', match);

        let match_style_obj = compute_style_template_by_matchinfo(
          match,
          match.data_tpl_id
        );
        Object.assign(old_match_style_obj, match_style_obj);
        // 更新赛事父级卡片样式 即对应的联赛容器卡片样式
        update_match_parent_card_style(
          old_match_style_obj,
          MatchListCardClass.all_card_obj
        );
      }
    });
    // 重新计算卡片样式
    compute_match_list_style_obj_and_match_list_mapping_relation_obj(
      match_list,
      true
    );
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
  // if([1,3].includes(MatchListCardClass.match_list_mapping_relation_obj_type)){
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
    `mid_${remove_mid}.tid`
  );
  let all_league_obj = MatchListData.match_list_data.league_list_obj;
  // 遍历所有赛事数据
  let match_status_type_arr = ["livedata", "nolivedata"];
  match_status_type_arr.forEach((match_status_type) => {
    // 遍历联赛列表
    let league_list = lodash.get(all_league_obj, match_status_type, []);
    league_list.forEach((league_obj, league_index) => {
      // 判断联赛ID是否相等
      if (remove_tid == league_obj.tid) {
        // 赛事ID数组
        let mids_arr = league_obj.mids.split(",");
        // 遍历联赛下所有赛事ID
        mids_arr.forEach((mid, mid_index) => {
          // 判断赛事ID是否相等
          if (mid == remove_mid) {
            mids_arr.splice(mid_index, 1);
            if (mids_arr.length == 0) {
              // 联赛下没有赛事  移除联赛
              league_list.splice(league_index, 1);
            } else {
              // 移除赛事后  重新赋值联赛的mids
              league_obj.mids = mids_arr.join(",");
            }
          }
        });
      }
    });
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
  let match_list = MatchListData.match_list_data.match_list;
  match_list.forEach((match, index) => {
    if (match.mid == remove_mid) {
      match_list.splice(index, 1);
    }
  });
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
    MenuData.menu_data.cur_level1_menu == "play" &&
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
  if (window.vue.$route.name == "search") {
    return;
  }
  if ([1, 3].includes(MatchListCardClass.match_list_mapping_relation_obj_type)) {
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
  lodash.each(MatchListCardClass.csid_to_card_key_obj, (card_key_arr) => {
    let sport_card_obj = MatchListCardClass.all_card_obj[card_key_arr[0]] || {};
    // 如果未设置折叠数据  设置折叠数据
    if (!sport_card_obj.hasOwnProperty("is_show_card")) {
      Object.assign(sport_card_obj, fold_template);
    }
  });
  // 滚球标题卡片折叠数据处理
  let play_card_obj = MatchListCardClass.all_card_obj["play_title"] || {};
  if (!play_card_obj.hasOwnProperty("is_show_card")) {
    Object.assign(play_card_obj, fold_template);
  }
  // 未开赛标题卡片折叠数据处理
  let no_start_card_obj =
    MatchListCardClass.all_card_obj["no_start_title"] || {};
  if (!no_start_card_obj.hasOwnProperty("is_show_card")) {
    Object.assign(no_start_card_obj, fold_template);
  }
};
