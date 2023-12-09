/*
 * @Description: 为赛事列表(专业版和新手版)提供逻辑方法，拆分组件复杂度
 */

// TODO: get_lang
import lodash from 'lodash'
import MatchCtr from './match-ctr'
import { i18n_t } from "src/boot/i18n.js";
import { numberToChinese } from "src/output/module/constant-utils.js";
class matchListClass {
  /**
  * @description:斯诺克7局显示处理
  * @param {Object} {mct局数 mmp赛事阶段 ms赛事状态}
  * @return {String}
  */
  covert_mct({ mct, mmp, ms }) {
    let result = '';
    if (this.is_match_playing(ms) && mmp == 0) {
      mct = "1";
    } else {
      mct = lodash.toString(mct);
    }

    let new_num = mct;
    if (this.get_lang == 'zh') {
      new_num = numberToChinese(mct);
    }
    let game_count = i18n_t("mmp.7.x")
    let ext = {
      419: i18n_t("mmp.7.419"),
      420: i18n_t("mmp.7.420"),
      439: i18n_t("mmp.7.439"),
    };
    if (mmp == 445) {
      result = i18n_t("mmp.7.445");
    }
    else {
      let game_count_des = game_count.replace('%s', new_num);
      result = game_count_des + (ext[mmp] || "");
    }
    return result;
  }
  /**
   * @description: mmp映射赛事阶段名，国际化语言
   * @param {Object} match 赛事
   */
  match_period_map(match, has_replace) {
    let { mmp, csid, ms } = match;
    let mmp_map_title = ''
    let r = '';
    if ([110].includes(+ms)) { // ms == 110: 代表 即将开赛
      r = i18n_t(`ms[${ms}]`);
      mmp_map_title = r;
      return r;
    }
    try {
      if (mmp == 0 && ms == 1) {
        // 篮球
        if (csid == 2) {
          mmp = 13;
        }
        // 棒球
        else if (csid == 3) {
          mmp = 401;
        }
        // 美式足球6 水球16
        else if ([6, 16].includes(+csid)) {
          mmp = 13;
        }
      }
      // 斯诺克7局显示处理
      if (csid == 7) {
        r = mmp_map_title = this.covert_mct(match);
        return r;
      }
      if (i18n_t('mmp')[csid]) {
        r = i18n_t(`mmp.${csid}.${mmp}`);
        // 如果是篮球的  小节玩法，则转成 上半场
        if ([14, 301].includes(+mmp) && has_replace && csid == 2) {
          r = i18n_t(`mmp.${csid}.1`);
        }
      }
    } catch (e) { console.error(e) }
    // 篮球3X3滚球时显示"全场"
    if (ms == 1 && csid == 2 && match.mle == 73) {
      r = i18n_t('mmp.2.21');
    }

    mmp_map_title = r;
    return typeof r === 'string' ? r : '';
  }
  /**
   * @description: 赛事进行中
   * 0未开始        1滚球阶段 2暂停 7延迟 10比赛中断 110即将开赛        3结束 4关闭 5取消 6比赛放弃 8未知 9延期
   */
  is_match_playing(ms) {
    return [1, 2, 7, 10, 110].includes(+ms);
  }
  /**
   * @description: 点击球种前置处理 1. 一键折叠情况下 有联赛tid展开 2. 一键展开情况下 所有联赛tid折叠
   */
  before_ball_folding_handle() {
    const { csid } = this.match_of_list
    // 联赛tid折叠map
    let map_collapse = lodash.cloneDeep(this.get_collapse_map_match)
    // 球种csid折叠map
    let collapse_csid_map = lodash.cloneDeep(this.get_collapse_csid_map)
    // 当前操作赛种tid列表
    let cur_cid_arr = MatchCtr.match_list_data_sources.filter(item => item.csid == csid)
    // 当前操作赛种已折叠联赛tid数量
    let collapse_len = 0

    for (let i = 0, len = cur_cid_arr.length; i < len; i++) {
      // 一键折叠情况下 有联赛tid展开
      if (collapse_csid_map[csid] && map_collapse[cur_cid_arr[i].tid] === 0) {
        collapse_csid_map[csid] = false
        this.set_collapse_csid_map(collapse_csid_map)
        this.need_init_curr_csid_map = true

        break
      }
      // 一键展开情况下 所有联赛tid折叠
      else if (map_collapse[cur_cid_arr[i].tid] === 1) {
        collapse_len++
      }
    }

    // 若累加后的长度和当前赛种下联赛长度相等，则改变相应赛种map一键折叠状态
    if (collapse_csid_map.hasOwnProperty(csid) && !collapse_csid_map[csid] && collapse_len === cur_cid_arr.length) {
      collapse_csid_map[csid] = true
      this.set_collapse_csid_map(collapse_csid_map)
      this.need_init_curr_csid_map = true
    }
  }
  /**
   * @description: 点击球种折叠
   */
  ball_folding_click(csid) {
    if (is_time_limit(200)) { return }

    let collapse_csid_map = lodash.cloneDeep(this.get_collapse_csid_map)
    let collapse_map_match = lodash.cloneDeep(this.get_collapse_map_match)

    // 滚球全部
    if (this.get_sport_all_selected) {
      this.before_ball_folding_handle()
    }

    // 更新相应赛种map一键折叠状态
    if (collapse_csid_map.hasOwnProperty(csid)) {
      collapse_csid_map[csid] = !collapse_csid_map[csid]
    } else {
      collapse_csid_map[csid] = true
    }

    if (!this.get_sport_all_selected) {
      let is_all_fold = false
      let arr_tid = []
      for (let i = 0, match_list_len = MatchCtr.match_list_data_sources.length; i < match_list_len; i++) {
        if (arr_tid.indexOf(MatchCtr.match_list_data_sources[i]['tid']) == -1) {
          arr_tid.push(MatchCtr.match_list_data_sources[i]['tid'])
        }
      }

      // 当前赛种联赛减少后，删除相应联赛折叠状态key
      let collapse_map_match_keys_arr = Object.keys(collapse_map_match)
      if (collapse_map_match_keys_arr.length > arr_tid.length) {
        collapse_map_match_keys_arr.forEach(item => {
          if (!arr_tid.includes(item)) {
            delete collapse_map_match[item]
          }
        })

        this.set_collapse_map_match(collapse_map_match)
      }

      // 如果查找到有 赛事折叠过了，点击则全部展开
      if (!lodash.isEmpty(this.get_collapse_map_match) && Object.keys(this.get_collapse_map_match).length == arr_tid.length) {
        for (let item_value in this.get_collapse_map_match) {
          if (this.get_collapse_map_match[item_value] == 0) {
            is_all_fold = true
            break
          }
        }
        // 如果查找到有 赛事展开过了，点击则全部折叠
        if (is_all_fold) {
          this.set_collapse_all_ball(true)
        } else {  // 如果没有查找到 赛事展开过，点击则全部展开
          this.set_collapse_all_ball(false)
        }
      } else {
        // 做兜底处理，初始化 get_collapse_all_ball 值为 true
        this.set_collapse_all_ball(true)
      }

      collapse_csid_map[csid] = this.get_collapse_all_ball
    } else {

    }

    // 如果当前是滚球的全部页面 并且 上次选中的球种id  和 当前的不一样，则重新初始化  get_collapse_all_ball 的值
    // if(this.get_sport_all_selected && this.match_of_list.csid != this.get_last_ball_csid){
    //   this.set_collapse_all_ball(!this.get_collapse_all_ball)
    //   if(!this.get_last_ball_csid){this.set_collapse_all_ball(true)}
    //   // 记录上一次选中的球种 id
    //   this.set_last_ball_csid(this.match_of_list.csid)
    //   // 如果之前有折叠过的话，则初始化为 false
    //
    //   if(this.get_collapse_map_match[this.match_of_list.tid]){
    //     this.set_collapse_all_ball(false)
    //   }
    // }else{
    //   this.set_last_ball_csid('')
    // }


    let cur_cid_arr = MatchCtr.match_list_data_sources.filter(item => item.csid == this.match_of_list.csid)
    let co_map_match = lodash.cloneDeep(this.get_collapse_map_match);
    for (let j = 0, cur_len = cur_cid_arr.length; j < cur_len; j++) {
      let d_key = this.gen_collapse_key(cur_cid_arr[j])
      // 1 是全部折叠， 0 是全部展开
      if (!this.get_sport_all_selected) {
        co_map_match[d_key] = this.get_collapse_all_ball ? 1 : 0
      } else {
        // 在全部赛种中使用collapse_csid_map对象更新联赛折叠状态
        co_map_match[d_key] = !this.get_collapse_csid_map[csid] ? 1 : 0
      }
    }

    // 滚球全部中 需根据 前置处理中的标识状态 更新collapse_csid_map赛种折叠状态
    if (this.need_init_curr_csid_map) {
      collapse_csid_map[csid] = !collapse_csid_map[csid]
      this.need_init_curr_csid_map = false
    }

    this.set_collapse_map_match(co_map_match);
    this.set_collapse_csid_map(collapse_csid_map)
    this.set_collapse_all_ball(!this.get_collapse_all_ball);
    this.$emit('unfold_changed')
  }
}

export default new matchListClass()