/**
 * 赛事主列表容器卡片逻辑 设计思路
 * 原始痛点：
 *     1.PC 列表按照赛事维度循环来渲染 ， 在赛事多，赛事变更时候会特别卡
 *     2.更新影响维度较大 ，粒度较大
 *     3.比较不好做到 脱离文档流
 *     4.总会为了高度等问题操作DOM 引起强制回流
 * 设计理念：
 *     1. 容器， 卡片 ，骨架  高度原始计算 ， 内部填词 ，===》 类似 楼房 骨架和 房间装修
 *     2. 根据PC 业务特殊性 ，PC 本身性能比较强大， 粒度选择 联赛层级 ， 提升了粒度 ， 缩减了步长
 *        步长： 赛事越多，处理的时候步长越大，效率越低
 *        粒度： 粒度由原来的整个列表 变更为  联赛级别  ，  联赛中间层 ，向上接后台原始数据，向下对应赛事粒度 （卡片）
 *     3. 房屋装修 ，骨架成型后，房屋内部随便怎么装修 ，不影响骨架
 *
 * 后期优化方向：
 *     1.css布局 卡片内分层，脱离文档流
 *     2.前端视图显示级别：
 *          level 1 赔率 状态等所有都显示  ws更新
 *          level 2 赔率 状态等所有都显示  ws不更新
 *          level 3 只显示主客队等静态内容  不显示时间 赔率 状态等   ws不更新
 *          level 4 只显示空格容器 空div
 *     3.因为前端列表数据形式的视图渲染 当索引改变的时候重新渲染数据 开销较大 所以优化方案如下
 *          根据列表 赛种的顺序是固定的 可以在一定程度上预留容器
 *     4.当我们页面数据变更的东西离我们视觉区比较远的情况 可以只改变高度，甚至高度都可以不用改，内存里面跑一份高度映射
 *
 *
 * 备注： 卡片 ===大部分场景下 等同于容器
 *
 * 数据依据：
 *     1.列表后台返回的数据
 *     2.前端页面所在页面 业务特殊性
 *     3.单个赛事的模板
 *     4.附加需求 （扩展性）
 *
 * 特别留意：
 *     1.顺序问题：  永远记得：  先骨架 >>>> 联赛卡片 >>>> 赛事卡片（角球）
 *     2.附加需求:   例如目前的 滚球下的 球类显示行
 *     3.更新粒度问题 ： 理论上  赛事级别 最佳 ， 本期 联赛级别
 *     4.冠军玩法、虚拟体育不走卡片容器逻辑
 *     5.一个列表里面联赛ID是有可能多次重复的，赛事ID 是不可能重复的
 *
 *
 *
 * 卡片类型：
 *      sport_title  -----  球种标题
 *      play_title   -----  滚球盘标题
 *      no_start_title  --- 未开赛标题
 *      league_title  ----  联赛标题
 *      champion_league_title - 冠军联赛标题
 *      league_container -  联赛容器
 *
 *
 */
import MatchListCardData from "./module/match-list-card-data-class.js";
// import { recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie } from "./module/fold-tid.js";
import { set_match_basic_data } from "./module/match-base-data.js";
import {
  update_match_cur_card_style,
  fold_tab_play,
} from "./module/compute-style-template.js";
import {
  fold_all_league,
  unfold_all_league,
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie,
} from "./module/fold-tid.js";
import {
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie
} from './module/fold-csid.js';
import { test_log_data } from "./module/test-log.js";
import { compute_match_list_style_obj_and_match_list_mapping_relation_obj } from "./module/data-relation.js";
import {
  update_league_collect_data,
  update_league_collect_data_and_get_mids,
} from "./module/league-collect.js";
import {
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs,
  remove_match,
  remove_league,
} from "./module/add-and-remove.js";
import { update_match_style } from './module/update-match-style.js'
import { set_card_show_level } from './module/card-show-offset.js'
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { ref } from "vue";

class MatchListCardInfo {
  constructor() {
  }

  /**
   * @Description 设置联赛容器卡片赛事数据加载状态
   * @param {object} league_title_card_obj 卡片对象
   * @param load_data_status 加载状态
   */
  set_league_card_load_data_status(league_title_card_obj, load_data_status) {
    // 设置联赛加载无数据状态
    if (["user_api_limited", "empty"].includes(load_data_status)) {
      let league_container =
        MatchListCardData.all_card_obj[
          league_title_card_obj.league_container_card_key
        ];
      league_container.load_data_status = load_data_status;
    }
  }
  /**
   * @Description 刷新联赛，展开联赛接口报限流错误调用
   * @param {object} card_obj 刷新的联赛卡片对象
   */
  refresh_league(card_obj) {
    card_obj.load_data_status = "loading";
    let params = {
      mids: card_obj.mids.split(","),
    };
    // 拉取http请求
    useMittEmit(MITT_TYPES.EMIT_API_BYMIDS, params, (status) => {
      let league_title_card_obj =
        MatchListCardData.all_card_obj[card_obj.league_title_card_key];
      this.set_league_card_load_data_status(league_title_card_obj, status);
    });
  }

  /**
   * 哪种列表类型
   * @returns
   */
  get_match_list_mapping_relation_obj_type() {
    return MatchListCardData.match_list_mapping_relation_obj_type;
  }
  /**
   * 联赛 折叠
   * click_card_obj 点击的联赛卡片对象
   */

  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie(
    click_card_obj
  ) {
    recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie(
      click_card_obj
    );
  }
  /**
   * @Description 判断联赛是否加载过数据  如果没加载过数据 从基础数据仓库 设置赛事主客队名称
   */
  set_match_basic_data(league_title_card_obj) {
    set_match_basic_data(league_title_card_obj);
  }

  /**
   * 
   * @param {Object} mids 
   * @description 更新需要重新计算表征的数据
   */
  update_match_style(mids) {
    let current_match_info = update_match_style(mids);
    MatchListCardData.set_match_list_style_info(current_match_info)
  }

  /**
   * @Description 跟新次要玩法高度
   * @param {String|Number} mid 赛事id
   */
  update_match_cur_card_style(mid) {
    update_match_cur_card_style(mid);
  }
  /**
   * @Description 角球折叠
   * @param {number} mid 折叠的赛事ID
   */

  fold_tab_play(mid) {
    fold_tab_play(mid);
    MatchListCardData.set_list_version()
  }

  /**
   * @Description 展开所有联赛 调试用
   */
  unfold_all_league() {
    unfold_all_league();
  }
  /**
   * @Description 折叠所有联赛   调试用
   */
  fold_all_league() {
    fold_all_league();
  }

  /**
   * @Description 设置卡片偏移量
   */
  set_card_show_level() {
    set_card_show_level()
  }

  /**
   *   other_params  其他 附加参数
   * @Description 打印数据  调试用
   */
  test_log_data(other_params) {
    test_log_data(other_params);
  }
  /**
   * 计算 当前的 赛事列表 级别 的 卡片 数据
   */
  compute_match_list_style_obj_and_match_list_mapping_relation_obj(match_list, is_ws_call, is_remove_call, is_five_leagues) {
   
    compute_match_list_style_obj_and_match_list_mapping_relation_obj(match_list, is_ws_call, is_remove_call, is_five_leagues);
  }
  /**
   * @Description 冠军投注后跟新 联赛收藏状态
   * @param {string} mid  赛事id
   * @returns
   */

  update_league_collect_data(mid) {
    update_league_collect_data(mid);
  }
  /**
   * 更新     all_card_obj
   * 更新     映射信息
   * 这里注意  单个赛事增删  不用遍历循环全部 的 数据
   * bymids接口拉取数据或者 ws推送改变赛事盘口变更
   */
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs(mids_arr) {
    recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs(
      mids_arr
    );
  }
  // 球种折叠
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie(click_card_obj,is_no_emit_fold_change,is_flod_mids) {
    recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie(click_card_obj,is_no_emit_fold_change,is_flod_mids)
  }
  /**
   * @Description 移除一场赛事
   * @param {number} remove_mid 移除的赛事ID
   * @param {}  callback 特定状态回调
   */
  remove_match(remove_mid, callback) {
    remove_match(remove_mid, callback);
  }

  /**
   *@Description 更新常规赛事不同分类的联赛收藏状态 并 获取所有同联赛下的赛事ID
   * @param {String} tid  联赛id
   * @param {Boolean} status  联赛收藏状态
   * @returns {Array}       联赛下的赛事ID
   */
  update_league_collect_data_and_get_mids(tid, status) {
   return update_league_collect_data_and_get_mids(tid, status);
  }
  /**
   * @Description 移除一场联赛
   * @param {number} remove_tid 移除的联赛ID
   */

  remove_league(remove_tid, callback) {
    remove_league(remove_tid, callback);
  }
}

export default new MatchListCardInfo();
