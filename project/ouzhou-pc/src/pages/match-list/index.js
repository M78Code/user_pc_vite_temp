import { api_match_list, api_details } from 'src/api';
import {
  MatchDataWarehouse_ouzhou_PC_l5mins_List_Common,
  MatchDataWarehouse_ouzhou_PC_hots_List_Common,
  MatchDataWarehouse_PC_List_Common,
  LayOutMain_pc,
  MenuData, axios_loop, get_match_status,LocalStorage
} from "src/output";

import { ref } from 'vue'
import { set_load_data_state } from 'src/core/match-list-pc/match-list-composition.js'
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";
import { set_league_list_obj } from 'src/core/match-list-pc/composables/match-list-processing.js'
import { set_match_play_current_index } from 'src/core/match-list-pc/composables/match-list-other.js'
import MatchListScrollClass from 'src/core/match-list-pc/match-scroll.js'
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import { api_bymids } from 'src/core/match-list-pc/composables/match-list-featch';

export const playingMethods_15 = [
  {
    value: 0,
    title: 'Start~14:59',
  }, {
    value: 1,
    title: '15:00~29:59',
  }, {
    value: 2,
    title: '30:00~44:59',
  }, {
    value: 3,
    title: '2H Start~59:59',
  }, {
    value: 4,
    title: '2H 60:00~74:59',
  }, {
    value: 5,
    title: '2H 75:00~89:59',
  }
]

const is_timer = ['5', '10', '8', '7', '9', '13', '3']
/**
   * 
   * @description 获取赛事请求参数
   * @returns { Object }
   */
function get_base_params(euid) {
  // match中 hpsFlag 都为0 除开冠军或电竞冠军; 赛事列表冠军或者电竞冠军/赛果不需要hpsFlag
  const hpsflag = 0
  return {
    // cuid: UserCtr.get_uid(), // 508895784655200024
    euid: euid ? euid : MenuData.get_euid(lodash.get(MenuData, 'current_lv_2_menu_i')),
    //排序	 int 类型 1 按热门排序 2 按时间排序
    sort: 1,
    hpsflag
  };
}

/**
 * 
 * @description 获取五大联赛列表
 */
export const get_five_leagues_list_api = async () => {
  const filterData = {}
  const max = 5
  const tid = ['320', '180', '239', '276', '79']
  const euid = '40203'
  const type = '12'
  const params = get_base_params(euid)
  const res = await api_match_list.get_matches_list({
    ...params,
    tid: tid.toString(),
    euid,
    type
  })
  const list = lodash.get(res, 'data', [])
  list.forEach(item => {
    const { tid } = item
    item.warehouse_type = 'five_league'
    if (!filterData[tid]) {
      filterData[tid] = [item]
    } else if (filterData[tid].length < max) {
      filterData[tid].push(item)
    }
  })
  const results = Object.values(filterData).flat()

  return results
}

/**
 * 
 * @param {Object} payload 包含着赛事时间的对象 
 * @description 根据字典映射不同的赛事时段
 * @returns {Object} 返回当前赛段的时间映射值
 */
export const get_15mins_data = payload => {
  const { mst, ms } = payload;
  if (Number(ms) !== 1) {
    return playingMethods_15[0];
  }
  const difference = mst / 60;
  if (difference >= 90) {
    return playingMethods_15[playingMethods_15.length - 1];
  } else {
    const residue = Math.floor(difference / 15)
    return playingMethods_15.find(p => p.value === residue);
  }
}

// 新规则：足球10 ，篮球5, 其他球种5
const filter_20_match_new = (data) => {
  const result = [];
  // 足球最多10个
  const max_football_count = 10;
  const max_basketball_count = 5;
  let football_count = 0;
  let basketball_count = 0;

  const football_csid = '1';
  const basketball_csid = '2';

  for (const item of data) {
    if (item.csid == football_csid && football_count < max_football_count) {
      result.push(item);
      football_count++;
    } else if (item.csid == basketball_csid && basketball_count < max_basketball_count) {
      result.push(item);
      basketball_count++;
    } else if(result.length < 20 && item.csid !== football_csid && item.csid !== basketball_csid) {
      result.push(item);
    }
    // 大于20条时，跳出循环
    if (result.length >= 20) {
      break;
    }
  }

  return result;
}
const matches_15mins_list = ref(LocalStorage.get('matches_15mins_list', []))
let match_count = ref(0);
if (matches_15mins_list.value.length) {
  MatchDataWarehouse_ouzhou_PC_l5mins_List_Common.set_list(matches_15mins_list.value);
}
// 获取首页数据
export const init_home_matches = async (is_socket=true) => {
  const params = {
    type: 1,
    sort: 2,
    // hasFlag: 0
  };
  const match_list = []
  const get_home_matches = LocalStorage.get('get_home_matches', [])
  const get_five_leagues_list = LocalStorage.get('get_five_leagues_list', [])
  if (get_home_matches.length > 0&&!is_socket) { //数据缓存先
    MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`].set_template_width(lodash.trim(LayOutMain_pc.layout_content_width - 15, 'px'), false)
    MatchDataWarehouse_PC_List_Common.set_list(get_home_matches.concat(get_five_leagues_list));
    MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(get_home_matches);
    MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
      get_five_leagues_list, null, null, true
    );
    set_load_data_state("data")
  }
  await axios_loop({
    axios_api: api_match_list.get_home_matches,
    params,
    fun_then: function ({ data }) {
      try {
        set_load_data_state("data")
        MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`].set_template_width(lodash.trim(LayOutMain_pc.layout_content_width - 15, 'px'), false)
        // 处理返回数据 将扁平化数组更改为页面适用数据
        MatchDataWarehouse_ouzhou_PC_l5mins_List_Common.set_list(data.p15);
        // 如果有数据加上特色赛事的高度 防止可视区域计算不对
        MatchListScrollClass.set_special_offset(205, true)
        LocalStorage.get('matches_15mins_list', data.p15 || [])
        //获取15mins 数据
        const mids_15 = []
        matches_15mins_list.value = data.p15.slice(0, 5).map(item => {
          set_match_play_current_index(item, 'hps15Minutes')
          mids_15.push(item.mid)
          return item;
        });
        match_count = data.dataList.length || 0;
        // 过滤没有csid的数据
        let sort_list = data.dataList.filter(item => item.csid);
        sort_list = sort_list.sort((x, y) => x.csid - y.csid);
        //过滤前20条数据
        sort_list = filter_20_match_new(sort_list);
        match_list.push(...sort_list)
        set_league_list_obj(match_list)
        // 将球种排序
        MatchDataWarehouse_PC_List_Common.set_list(match_list);
        LocalStorage.set('get_home_matches', sort_list,12*3600)
        MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(sort_list);
      } catch (error) {
        console.log(error);
      }
    }, fun_catch() {
      !is_socket&&set_load_data_state("refresh")
    }
  })
  // 暂时隐藏五大联赛
  axios_loop({
    axios_api: get_five_leagues_list_api,
    fun_then: function (res) {

      try {
        //五大联赛，只显示滚球数据
        // if (res?.length) {
        //   res = res.filter(match => {
        //     return !!get_match_status(match.ms)
        //   })
        // }
        match_list.push(...res)
        set_league_list_obj(match_list)
        LocalStorage.set('get_five_leagues_list', res,12*3600)
        MatchDataWarehouse_PC_List_Common.set_list(match_list);
        MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
          res, null, null, true
        );
        api_bymids({mids:lodash.map(res,'mid')})
      } catch (error) {
      }
    },
  })

};
export {
  matches_15mins_list,
  match_count
}