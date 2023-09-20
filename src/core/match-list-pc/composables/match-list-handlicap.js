/**
 *
 * 这里是处理表征与数据仓库之间的 链接的东西
 * 通过表征里的坑位 取到数据仓库里边的对应赔率数据 用于页面的显示
 */

import { ref } from "vue";
import { MATCH_LIST_TEMPLATE_CONFIG } from "src/core/match-list-pc/list-template/index.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/core/index.js";

const ol_data = ref({});
const quick_query_obj = MatchListData.quick_query_obj;

/**
 * @Description 计算单个盘口数据
 * @param {Object} match    赛事数据
 * @param {Object} hl_obj   盘口数据
 * @param {Array} all_hids 当前赛事所有玩法 id
 * @param {Object} all_hl_obj  当前赛事所有盘口数据
 * @param {Number} hl_index  附加盘
 */
const compute_hl_obj_data = ({
  match,
  hl_obj,
  all_hids,
  all_hl_obj,
  hl_index,
}) => {
  let {
    hl,
    hSpecial,
    hpid,
    chpid,
    hl: { hid },
  } = hl_obj;
  if (
    [7, 20, 74, 341, 342].includes(+hpid) &&
    lodash.get(hl_obj, "hl.hs", 2) != 2
  ) {
    match.tpl_21_hpids += hpid + ",";
  }
  if (hid) {
    let handle_type = 1;
    if (hSpecial) {
      hl.hSpecial = hSpecial;
      handle_type = Number(hSpecial);
    }
    if (hl_index) {
      handle_type = hl_index;
    }
    // 添加盘口ID
    all_hids.push(hid);
    // 玩法ID
    hl._hpid = hpid;
    // 玩法唯一标识
    hl.chpid = chpid || hpid;
    // 赛事级别盘口状态
    hl._mhs = match.mhs;
    all_hl_obj["hid_" + hid] = hl;
    // 计算投注项数据
    this.compute_ol_data(hl, match, handle_type);
  }
};

/**
	 * @Description 根据赛事列表计算所有赛事数据 数据仓库主入口函数
	 * @param {array} match_list 赛事列表
	 * @param {boolean} is_ws_call  是否ws调用
	 * @param {boolean} is_all_match 是否全量列表数据
	 * @param {undefined} undefined
	 */
const compute_match_list_all_data = (match_list, is_ws_call, is_all_match) => {
  // 所有赛事对象 用来存放页面上的赛事数据
  let mid_obj = {};
  // 是否ws拉取全量数据
  let is_ws_call_all = is_ws_call && is_all_match;
  // 球种赛事数量
  let sport_match_count = lodash.cloneDeep(sport_match_count_template);
/**
* 主要列表 
* H5 是走虚拟算法的 主列表 
* PC 是走框架算法的 主列表 
* 
* 这个不含  match-small-list-data.js  的应用  场景
* 
*/


  // 根据商户过滤篮球赛事
  // if(store.getters.get_user.mId == '1443742662615240704'){
  //   lodash.remove(match_list, match => match.csid == 2)
  // }
  match_list.forEach((match) => {
    let { mid, csid } = match || {};
    // 处理ws拉取全量数据  列表闪屏
    // ws拉取全量数据 并且 mid_obj未存有赛事数据 不合并数据
    if (!(is_ws_call_all && this.mid_obj[mid+'_'])) {
      // 设置赛事模板ID
      match.tpl_id = this.get_match_template_id(match);
      // 设置赛事默认数据
      this.set_match_default_data(match);
      // 设置赛事所有盘口数据
      this.set_match_all_handicap_data(match);
      // 设置赛事比分
      this.set_match_score(match);
      // 计算单个赛事数据
      mid_obj[mid+'_'] = this.compute_match_data(match);
    }
    // 虚拟体育 不需要统计数量
    if (is_all_match && !utils.is_virtual_csid(csid)) {
      // 统计球种赛事数量
      sport_match_count["csid_" + csid] = sport_match_count[
        "csid_" + csid
      ] || { count: 0 };
      sport_match_count["csid_" + csid].count++;
    }
  });

  if (is_all_match) {
    this.match_list = match_list;
    // 合并球种数量
    lodash.merge(this.sport_match_count, sport_match_count);
    // 计算滚球全部菜单数量
    $menu.compute_play_all_menu_count(sport_match_count);
  }
  // 合并赛事对象 冠军赋值
  lodash.merge(this.mid_obj, mid_obj);
  // 设置所有赛事ol_obj对象
  this.set_match_ol_obj(match_list);
}

/**
 * @Description 计算投注项数据
 * @param {Object} hl_data 盘口对象
 * @param {object} match 赛事对象
 * @param {number} handicap_type 盘口类型 1:主盘，  2：附加盘1， 3：附加盘2   (特殊 15分钟玩法是取阶段保存)
 */
const compute_ol_data = (hl_data, match, handicap_type) => {
  // 遍历盘口 所有投注项
  lodash.each(hl_data.ol, (ol) => {
    // 投注项坑位值
    let hn = `${match.mid}_${hl_data.chpid}_${handicap_type}_${ol.ot}`;
    // 投注项坑位旧值
    let old_hn = `${match.mid}_${hl_data._hpid}_${handicap_type}_${ol.ot}`;
    // 赛事级开盘状态
    ol._mhs = match.mhs;
    // 盘口级 开盘状态
    ol._hs = hl_data.hs;
    // 盘口ID
    ol._hid = hl_data.hid;
    // 玩法ID
    ol._hpid = hl_data._hpid;
    // 是否支持串关 1:支持串关 0: 不支持串关
    ol._hipo = hl_data.hipo;
    // 赛事ID
    ol._mid = match.mid;
    // 球种ID
    ol.csid = match.csid;
    //内嵌简化盘口文本
    if (utils.is_iframe) {
      ol.onb = this.disk_text_replace(
        JSON.parse(localStorage.getItem("get_lang")),
        lodash.get(ol, "onb", "")
      );
    }
    //简化盘口文本
    if (match.tpl_id == 22 && String(ol.onb).endsWith(".0")) {
      ol.onb = ol.onb.replace(".0", "");
    }
    // 简化盘口文本
    if (match.tpl_id == 13) {
      ol.onb = ol.onb
        .replace("Không có bàn thắng", "- 0 BT")
        .replace("ไม่มีเป้าหมาย", "ไม่ได้ประตู");
    }
    // 支持的盘口类型
    if (hl_data.hSpecial) {
      ol._hsw = lodash.get(
        match.play_obj,
        `hpid_${hl_data._hpid}_${hl_data.hSpecial}.hsw`,
        ""
      );
    } else {
      ol._hsw = lodash.get(match.play_obj, `hpid_${hl_data._hpid}.hsw`, "");
    }

    // 盘口是否高亮
    ol.handicap_highlight = handicap_highlight_paly_id.includes(+hl_data._hpid);

    // 判断盘口是否有坑位  设置投注项坑位值
    if (hl_data.hn) {
      ol._hn = hn;
    }
    match.all_ol_data[old_hn] = ol;
    match.all_oid_arr.push(ol.oid);
  });
};

/**
	 * @Description 设置赛事所有盘口数据
	 * @param {undefined} undefined
	 */
const set_match_all_handicap_data = (match) => {
  let all_hl_obj = {};
  let all_hids = [];
  // 计算玩法数据
  this.compute_play_data(match);
  if ([21, 0, 13].includes(+match.tpl_id)) {
    match.tpl_21_hpids = "";
  }
  // 所有投注项ID列表
  match.all_oid_arr = [];
  match.all_ol_data = {};
  // 遍历主盘口数据
  lodash.each(match.hpsData, (hpsData) => {
    lodash.each(hpsData.hps, (hl_obj) => {
      this.compute_hl_obj_data({ match, hl_obj, all_hids, all_hl_obj });
    });
  });
  // 遍历附加盘数据
  let add_hps = lodash.get(match, "hpsData[0].hpsAdd", []);
  add_hps.forEach((item) => {
    // 遍历附加盘盘口
    let { hl: hls_arr = [], hpid, chpid } = item;
    hls_arr.forEach((hl, hl_index) => {
      this.compute_hl_obj_data({
        match,
        hl_obj: { hl, hpid, chpid },
        all_hids,
        all_hl_obj,
        hl_index: hl_index + 2,
      });
    });
  });

  // 足球让球与大小玩法 遍历其他玩法数据
  if (match.csid == 1 && [0, 13].includes(+match.tpl_id)) {
    lodash.each(Object.keys(other_play_name_to_playid), (key) => {
      lodash.each(match[key], (hl_obj) => {
        this.compute_hl_obj_data({ match, hl_obj, all_hids, all_hl_obj });
      });
    });
  }

  lodash.merge(this.hl_obj, all_hl_obj);
  match.all_hids = all_hids.join(",");
  match.all_oids = match.all_oid_arr.join(",");
  // 过期旧投注项ID列表
  let old_oid_arr = lodash.filter(
    lodash.get(this.mid_obj["mid_" + match.mid], "all_oids", "").split(","),
    (oid) => !match.all_oids.includes(oid),
    []
  );
  // 删除旧投注项数据
  old_oid_arr.forEach((oid) => {
    delete this.ol_obj["oid_" + oid];
  });
  if (match.tpl_id == 18) {
    // 计算赛事所有盘口数据--冠军玩法
    this.compute_match_all_handicap_data_champion(match);
  } else {
    // 计算赛事所有盘口数据
    this.compute_match_all_handicap_data(match);
  }
}

const merge_template_data = ({ current_template_id }) => {
  const current_template = MATCH_LIST_TEMPLATE_CONFIG[`template_${current_template_id}_config`];
  current_template[`template_${current_template_id}`].main_handicap_list.forEach((col, col_index) => {
    col.ols.forEach((ol, ol_index) => {
      let { _hpid, ot } = ol;
    });
  });
};

export { merge_template_data };
