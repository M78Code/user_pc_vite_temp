import { ref } from "vue";
import lodash from 'lodash';
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { UserCtr } from "src/core/index.js";
import { PageSourceData } from "src/core/index.js";
import MatchListCard from "src/core/match-list-pc/match-card/match-list-card-class.js";
// import MatchListData from "src/core/match-list-pc/match-data/match-list-data-class.js";
import { t } from "src/core/index.js";




const collect_composable_fn = (props) => {
  // 收藏数量
  const collect_count = ref(0);
  // 前端控制是否禁用收藏功能   ENABLE_COLLECT_API
  const enable_collect_api = ref(false);
  // 服务器端设置的 三级服务开关
  const collect_switch = ref(true);

  // 数据请求状态
  const load_data_state = ref("loading");
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
      return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, t("msg.msg_09"));
    }
    let cur_collect_state = Number(!match.mf);
    let _params = {
      mid: match.mid,
      cuid: UserCtr.get_uid(),
      cf: cur_collect_state,
    };
    api_common.add_or_cancel_match(_params).then((res) => {
      let code = lodash.get(res, "data.code");
      let data = lodash.get(res, "data.data");
      if (code == 200 && data == 1) {
        // 在收藏列表页 移除收藏
        if (PageSourceData.page_source == "collect" && !cur_collect_state) {
          // 移除赛事
          MatchListCard.remove_match(match.mid);
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
      (PageSourceData.page_source == "play" && MenuData.is_export())
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
    if (MenuData.is_export()) {
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
   * @description 联赛收藏
   * @param  {object} match  单场赛事信息
   * @param  {boolean} is_champion  是否冠军收藏
   * @return {undefined} undefined
   */
  const mx_collect_leagues = (match, is_champion) => {
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
    api_match
      .post_collect_leagues(_params)
      .then((res) => {
        let code = lodash.get(res, "data.code");
        let data = lodash.get(res, "data.data");
        if (code == 200 && data == 1) {
          match.tf = cur_collect_state;
          let mids_arr = MatchListCard.update_league_collect_data_and_get_mids(
            match.tid,
            cur_collect_state
          );
          //跟新原数据联赛收藏状态
          MatchListData.set_league_list_collect(
            match.tid,
            cur_collect_state,
            [1, 3].includes(
              MatchListCard.get_match_list_mapping_relation_obj_type()
            )
          );
          mids_arr.forEach((mid) => {
            let match_item = MatchListData.list_to_obj.mid_obj[mid + '_'] || {};
            match_item.tf = cur_collect_state;
            match_item.mf = cur_collect_state;
            // 在收藏列表页 移除收藏
            if (PageSourceData.page_source == "collect" && !cur_collect_state) {
              // 移除联赛卡片
              MatchListCard.remove_league(match.tid);
              let match_length;
              if (MenuData.is_export()) {
                match_length =
                  lodash.get(MatchListData.league_list_obj, "livedata.length", 0) +
                  lodash.get(MatchListData.league_list_obj, "nolivedata.length", 0);
              } else {
                match_length = MatchListData.match_list.length;
              }
              // 赛事数量为0 设置暂无数据
              if (match_length == 0) {
                load_data_state.value = "empty";
              }
            }
          });
        } else {
          useMittEmit(
            MITT_TYPES.EMIT_SHOW_TOAST_CMD,
            t("common.collect_toast")
          );
        }
        // 获取列表最新的收藏数量
        mx_collect_count();
      })
      .catch((err) => {
        useMittEmit(
          MITT_TYPES.EMIT_SHOW_TOAST_CMD,
          t("common.collect_toast")
        );
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
            let match = MatchListData.list_to_obj.mid_obj[mid + '_'] || {};
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
      return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, t("msg.msg_09"));
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
  return {
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
    mx_collect

  }
}

export default collect_composable_fn