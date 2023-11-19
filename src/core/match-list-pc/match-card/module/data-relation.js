import { MatchDataWarehouse_PC_List_Common as MatchListData, PROJECT_NAME } from "src/core/index.js";
import MatchListCardData from "./match-list-card-data-class.js";
import lodash from "lodash";
import { compute_match_list_style_obj_and_match_list_mapping_relation_obj_type1 } from "./data-relation-type-1.js";
import { compute_match_list_style_obj_and_match_list_mapping_relation_obj_type2 } from "./data-relation-type-2.js";
import { compute_match_list_style_obj_and_match_list_mapping_relation_obj_type3 } from "./data-relation-type-3.js";
import { compute_match_list_style_obj_and_match_list_mapping_relation_obj_type4 } from "./data-relation-type-4.js";
import { compute_match_list_style_obj_and_match_list_mapping_relation_obj_type5 } from "./data-relation-type-5.js";
import PageSourceData from "src/core/page-source/page-source.js";
import { MATCH_LIST_TEMPLATE_CONFIG } from "src/core/match-list-pc/list-template/index.js";
import { conpute_match_list_card_offset } from "./card-show-offset.js";
import MenuData from "src/core/menu-pc/menu-data-class.js";

/**
 * @Description 设置是哪种列表类型
 */
const set_match_list_mapping_relation_obj_type = () => {
  /**
   * 哪种列表类型
   * 1. 列表数据类型为联赛列表   有未开赛 已开赛 今日
   * 2. 列表数据类型为赛事列表   区分赛种 热门 滚球
   * 3. 列表数据类型为联赛列表   只有联赛 常规赛事
   * 4. 列表数据类型为赛事列表   有未开赛 已开赛
   * 5. 冠军赛事列表            区分赛种
   * 6. 冠军赛事列表            只有联赛
   * 7. 列表数据类型为赛事列表   只有联赛
   * 8. 欧洲版pc列表  单一模板 单一计算
   * "details",
      'match-play-common' , // 滚球 常规
      'match-play-esports' ,// 滚球 电竞
      'match-play-vr' ,// 滚球 vr
      'match-common-champion', //常规 冠军 联赛结构
      'match-champion', //冠军 球种结构
      'match-today-common' , //今日 常规
      'match-early-common' , //早盘 常规
      'match-fliter' ,//筛选
      'match-collect' ,//收藏
      'match-esports' ,//电竞
      'match-vr' ,// vr
      "virtual_details"// vr 详情
    */
  let type;
  const page_source = PageSourceData.page_source;
  // 列表页强力推荐
  if (PageSourceData.is_show_hot) {
    type = MenuData.is_export() ? 7 : 2;
  }
  // 详情页强力推荐
  else if (page_source == "details") {
    type = 7;
  }
  // 搜索页面
  else if (page_source == "search") {
    type = 4;
  }
  // 电竞收藏
  else if (MenuData.is_export() && page_source == "collect") {
    type = 7;
  }
  // 冠军聚合页
  else if (page_source == "winner_top") {
    type = 5;
  }
  // 电竞冠军
  else if (MenuData.is_esports_champion()) {
    type = 3;
  }
  // 今日冠军
  else if (page_source == "match-common-champion") {
    type = 6;
  }
  // 列表接口类型为赛事列表
  else if (MenuData.match_list_api_type == "match_list") {
    // 热门赛事 或者 今日、早盘、串关
    if (
      (page_source == "hot" && MenuData.match_list_api_params.euid != 30199) ||
      ["today", "early", "bet"].includes(page_source)
    ) {
      type = 4;
    } else {
      type = 2;
    }
  }
  // 早盘 和 电竞只有未开赛  不区分赛种
  else if ( page_source == "early" || (MenuData.is_export() && page_source != "hot") ) {
    type = 3;
  } else {
    type = 1;
  }
  // 欧洲版也不区分赛种 且需要一个新的计算逻辑 但是因为接口结构不一样 所以需要有两套计算逻辑
  // 但是需要区分滚球全部和单球种
  if (PROJECT_NAME == 'ouzhou-pc') {
    if (
      (page_source == "hot" && MenuData.match_list_api_params.euid != 30199) 
      || ["today", "early", "bet",'match-play-common', 'match-collect'].includes(page_source)
      || !MenuData.menu_root
    ) {
      type = 9
    } else {
      type = 8
    }
  }
  console.log('type', type);
  return   type
};

/**
 * @Description 切换菜单的时候初始化所有卡片数据
 */
const reset_all_card_data = () => {
  // 所有卡片样式对象
  MatchListCardData.all_card_obj = {};
};

//计算 当前的 赛事列表 级别 的 卡片 数据
/**
 * 数据依据：
 *    1. 数据仓库的 列表赛事数据  假定  match_list
 *    2. 当前在哪一个列表  假定 which_list
 *    3. 单种赛事基础模板 ， 可以走赛种 维度 （赛种 到 模板 配置）  假定
 *    4. 联赛折叠     在  联赛卡片内
 *    5. 赛种折叠   放到 第一个 联赛卡片内
 *    6. 未开赛 ， 已开赛折叠  放到    放到 第一个 联赛卡片内
 *
 *
 *
 * 调用时机：
 *    1. 列表初始化，赛事列表方法调度
 *    2. 赛事增删 ，(可以走小的方法 ，不一定走这个)
 *    3. 列表排序变更 ， 代码内一般 还是走  调用时机 1
 *    4. 筛选过滤 ， 等同于 1
 *    5. 赛事状态变更
 *    6. 附加盘增减 ，
 *    7. 角球类玩法 开关
 *
 * 执行流程： 第一步第二步可以一起执行 计算 ，最好一起计算   ，这里只是 基本梳理
 *   第一步：
 *      根据当前的 数据列表 ， 目前后台返回的都是赛事粒度的  计算出 几个映射关系
 *      单一赛种列表页面： 开赛层级 -->  联赛层级 ---》赛事层级，（需要注意，开赛未开赛都有 同一个联赛）
 *      全部赛种列表页面： 赛种层级  --> 联赛层级 ---》赛事层级，         （目前只有滚球全部，和热门 赛事 两个菜单，或者可能的 关注--全部）
 *   第二步：
 *       循环赛事列表 计算每个赛事的显示表征， 并且 同时计算  联赛层级表征 ，  compute_style_template_by_matchinfo(match)
 *       如果需要可以同时计算 赛种层级 或者 开赛层级 表征 数据
 *       但是 理论上   赛种层级 或者 开赛层级 走其他方法更快
 *
 *
 *
 *
 */

export const compute_match_list_style_obj_and_match_list_mapping_relation_obj =
  (match_list, is_ws_call, is_remove_call) => {
    let current_csid = MenuData.left_menu_result.lv1_mi;
    // 虚拟体育 不走卡片逻辑
    if (MenuData.is_vr()) {
      MatchListCardData.is_run_card_function = false;
      return;
    } else {
      MatchListCardData.is_run_card_function = true;
    }
  MatchListCardData.match_list_mapping_relation_obj_type = set_match_list_mapping_relation_obj_type();
    // 非ws调用  清空卡片数据
    if (!is_ws_call) {
      MatchListCardData.match_list_render_key++;
      // 重置 赛事模板配置  开始
      //  let template_id = MenuData.match_tpl_number
      let reset_template_config_fn =
        MATCH_LIST_TEMPLATE_CONFIG[
          "template_1_config"
        ]["reset_match_template_config"];
      if (reset_template_config_fn) {
        reset_template_config_fn();
      }
      // 重置 赛事模板配置  结束
      reset_all_card_data();
    }
    /**
     * 哪种列表类型
     * 1. 列表数据类型为联赛列表   有未开赛 已开赛
     * 2. 列表数据类型为赛事列表   区分赛种
     * 3. 列表数据类型为联赛列表   只有联赛
     * 4. 列表数据类型为赛事列表   有未开赛 已开赛
     * 5. 冠军赛事列表            区分赛种
     * 6. 冠军赛事列表            只有联赛
     * 7. 列表数据类型为赛事列表   只有联赛
     */
    if (
      [1, 3].includes(MatchListCardData.match_list_mapping_relation_obj_type)
    ) {
      compute_match_list_style_obj_and_match_list_mapping_relation_obj_type1(
        match_list,
        is_ws_call,
        is_remove_call
      );
    } else if (
      [2, 4, 7].includes(MatchListCardData.match_list_mapping_relation_obj_type)
    ) {
      compute_match_list_style_obj_and_match_list_mapping_relation_obj_type2(
        match_list,
        is_ws_call
      );
    } else if ([8].includes(MatchListCardData.match_list_mapping_relation_obj_type)) {
      compute_match_list_style_obj_and_match_list_mapping_relation_obj_type3(
        match_list,
        is_ws_call
      );
    } else if ([9].includes(MatchListCardData.match_list_mapping_relation_obj_type)) {
      compute_match_list_style_obj_and_match_list_mapping_relation_obj_type4(
        match_list,
        is_ws_call
      );
    } else {
      compute_match_list_style_obj_and_match_list_mapping_relation_obj_type5(
        match_list,
        is_ws_call
      );
    }

    // 设置列表总高度
    conpute_match_list_card_offset();
  };
