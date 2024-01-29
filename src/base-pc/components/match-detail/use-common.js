// <!--
//  * @Author: cooper
//  * @Date: 2023-08-06 10:40:55
//  * @Description:详情页玩法模板-公共数据
// -->
import lodash from "lodash";
import { ref, watch, onMounted, onUnmounted } from "vue";
import {MatchDetailCalss, UserCtr, is_eports_csid} from 'src/output/index.js';
import { HandicapTitle } from "src/base-pc/components/match-detail/handicap-title/index.js";
import betItem from "src/base-pc/components/bet-item/bet_item.vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import { api_details } from "src/api/index";
import {
  useMittEmit,
  MITT_TYPES,
  useMittEmitterGenerator,
} from "src/output/index.js";
export const useCommon = ({ emit, props }) => {
  /** 主盘折叠 */
  const isShow = ref(true);
  /** 附加盘折叠 */
  const isShow_plus = ref(true);
  /** 是否展示当前玩法 */
  const curIsShow = ref(true);


  /** 当前电竞查询的模式 false单关模式 */
  const vx_cur_esports_mode = ref(BetData.cur_esports_mode);
  // 监听状态变化 todo
  // let un_subscribe = store.subscribe(() => {
  //   let state_ = store.getState();
  //   vx_cur_esports_mode.value = ref(state_.betInfoReducer.cur_esports_mode);
  // });

  /**
   * 数据或串关模式更新时，根据串关模式来显示或隐藏玩法
   * @param {Boolean} mode  true 串关  false 单关
   */
  const updateCurMode = (mode) => {
    if (
      is_eports_csid(lodash.get(props.item_details, "hl[0].ol[0].csid"))
    ) {
      // hipo 1 为支持串关 0 为不支持
      // 如果当前是串关模式但是玩法不支持串关，就隐藏不支持串关的玩法
      if (mode) {
        curIsShow.value = props.item_details.hl[0].hipo == 1;
      } else {
        curIsShow.value = true;
      }
    } else {
      curIsShow.value = true;
    }
  };

  watch(
    () => props.item_details,
    (res) => {
      //投注项总数若为基数则补空
      let data = lodash.get(res,'hl[0].ol',[]);
      if (data.length % 2) {
        res.hl[0].ol.push({});
      }
      updateCurMode(vx_cur_esports_mode.value);
    },
    { immediate: true }
  );

  watch(vx_cur_esports_mode, (val) => {
    updateCurMode(val);
  });
  /**
	* @description: 监听玩法列表展开收起（全部）
	* @param {}
	* @return {undefined} undefined
	*/

  watch( () => props.panel_status, (val) => {
    switch (val) {
      case "open":
       isShow.value = true;
       isShow_plus.value = true;
        break;
      case "hide":
       isShow.value = false;
       isShow_plus.value = false;
        break;
    }
  });
  //   ( 待改造)
  onMounted(() => {
    updateCurMode(vx_cur_esports_mode.value);
  });

  onUnmounted(() => {
    // un_subscribe();
  });

  // ( 待改造)
  // vx_cur_esports_mode: {
  //   handler(n) {
  //     this.updateCurMode(n);
  //   }
  // }
  const cuid = UserCtr.get_cuid()
  /**
   * @description: 置顶
   * @param {Object} data handicao_title.vue组件传值
   * @return {undefined} undefined
   */
  function sort_index(titleData){
    // emit("sort_index", data);
    /** @type {TYPES.OddInfo} */ const data = props.item_details;
    /** true取消置顶, false置顶 */ let type = data.hton != 0;
    let params = {
      cuid: cuid,
      playId: data.hpid,
      matchId: data.mid,
      topKey: data.topKey,
      status: type ? 1 : 0,
    };
    api_details.get_category_playTop(params).then((res) => {
      const code = lodash.get(res, "data.code");
      if (code == 200) {
        // 保存置顶玩法的 id
        MatchDetailCalss.set_top_id({
          id: params.topKey,
          type: !params.status,
        })
        // set_current_index(handicap);
      }
    });
    if (type) {
      data.hton = "0";
    }else {
      data.hton = new Date().getTime() + "";
    }
    // if (!params.status) {
      //置顶
      // if (handicap[index].hton == "0") {
      //   handicap[index].hton = new Date().getTime() + "";
      // }
      // handicap.unshift(handicap.splice(index, 1)[0]);
    // } else {
      //取消置顶
      // data.hton = "0";
      // let arr = []; //暂存置顶的数据
      // for (var i = 0; i < handicap.length; i++) {
      //   if (handicap[i].hton != "0") {
      //     arr.unshift(handicap.splice(i, 1)[0]);
      //     i--;
      //   }
      // }
      // //根据hpon排序
      // handicap.sort(function (a, b) {
      //   return a.hpon - b.hpon;
      // });
      // //插入置顶的数据
      // for (var i in arr) {
      //   handicap.unshift(arr[i]);
      // }
    // }
  };

  /**
   * @description: 收起展开附加盘
   * @param {Boolean} data true展开 false收起
   * @return {undefined} undefined
   */
  const toggle_menu = (data) => {
    if (data && data.isplus) {
      // 附加盘折叠
      isShow_plus.value = !isShow_plus.value;
      props.item_details.is_show_plus = props.isShow_plus;
    } else {
      // 主盘折叠
      isShow.value = !isShow.value;
      props.item_details.is_show = isShow.value;
    }
    // 用户点击了玩法就发送一次数据(需要改造)
    useMittEmit(MITT_TYPES.EMIT_SET_PANEL_STATUS, this.item_details );
  };

  /**
   * @description: 格式化赛马编号
   * @param {String} item.ot 赛马编号
   */
  const format_ranking = (on) => {
    let str = "";
    if (!on) return str;
    let no = on.split("/");
    let arr = [];
    no.forEach((item) => {
      arr.push(`ranking-bg-style1-${item} csid-${props.match_info.csid}`);
    });
    return arr;
  };
  /**
   * 过滤让球大小玩法的投注项名称和盘口值
   * @param {*} str 要过滤的玩法名
   * @param {*} team_a 主队名称
   * @param {*} team_b 客队名称
   * @returns
   */
  const filter_odds = (str) => {
    // 主客队名字
    let team_a = lodash.get(props.match_info, "mhn");
    let team_b = lodash.get(props.match_info, "man");
    // 返回值定义
    let res = str;
    if (str) {
      // 进行逻辑替换时的临时字符串
      let str_temp = str;
      // team_a判空设置默认字符串
      if (!team_a) {
        team_a = "";
      }
      // team_b判空设置默认字符串
      if (!team_b) {
        team_b = "";
      }
      // 设置等长字符串用*占位
      let team_a_str = team_a.replace(/./g, "*");
      let team_b_str = team_b.replace(/./g, "*");
      // 对主客队名称进行替换,优先替换队名长的
      if (team_a.length > team_b.length) {
        str_temp = str_temp.replace(team_a, team_a_str);
        str_temp = str_temp.replace(team_b, team_b_str);
      } else {
        str_temp = str_temp.replace(team_b, team_b_str);
        str_temp = str_temp.replace(team_a, team_a_str);
      }
      // 获取数值
      let reg = /\d+(.\d+)?/g;
      // 获取数组数组
      let str_arr_match = str_temp.match(reg);
      if (str_arr_match && str_arr_match.length) {
        // 获取最后的数字
        let val = str_arr_match[str_arr_match.length - 1];
        // 找到数字所在的索引
        let index = str_temp.indexOf(val);
        // 发现索引位置后,进行数据拼装
        if (index != -1) {
          res = `${str.substring(0, index)}<span class="color">${str.substring(
            index,
            index + val.length
          )}</span>${str.substring(index + val.length)}`;
        }
      }
    }
    return res;
  };

  return {
    format_ranking,
    sort_index,
    filter_odds,
    toggle_menu,
    curIsShow,
    isShow,
    HandicapTitle,
    betItem,
    lodash,
  };
};
