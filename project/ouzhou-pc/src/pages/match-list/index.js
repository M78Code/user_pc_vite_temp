import { api_match_list, api_details } from 'src/api';
import {
  MatchDataWarehouse_ouzhou_PC_l5mins_List_Common,
  MatchDataWarehouse_ouzhou_PC_hots_List_Common,
  MatchDataWarehouse_PC_List_Common,
  LayOutMain_pc,
  UserCtr,
  MenuData, axios_loop
} from "src/core";
import { nextTick, ref } from 'vue'
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";
import { api_bymids } from 'src/core/match-list-pc/composables/match-list-featch.js'
import { set_match_play_current_index } from 'src/core/match-list-pc/composables/match-list-other.js'

import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
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
export const get_five_leagues_list = async () => {
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
  console.log('555results', filterData, results);

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

/**
 * 
 * @param {Array} payload 需要筛选的15分钟玩法数据 
 * @description 需要返回已开赛且未结束的赛事(滚球)
 * @returns {Array} 返回处理好的15分钟玩法数据
 */
export const filter_15mins_func = payload => {
  // const timeStamp = new Date().getTime()
  // const endTimeStamp = 90 * 60 * 1000
  // 过滤已开赛且未结束数据
  // const matches_15mins_list = payload.filter(item => item.mgt < timeStamp && timeStamp - item.mgt < endTimeStamp)

  // payload.forEach(item => {
  //   item['current_ol'] = filter_odds_func(item.hps15Minutes, '32', true);
  //   item['matches_15mins_obj'] = get_15mins_data(item);
  //   item['course'] = handle_course_data(item);
  //   item['mstValue'] = !is_timer.includes(item.csid) ? format_mst_data(item.mst) : '';
  // })

  return payload.slice(0, 5).map(item => item.mid);
}

// 新规则：足球15 ，篮球5
const filter_20_match_new = (data) => {
  const result = [];
  // 足球最多15个
  const max_football_count = 15;
  let football_count = 0;
  // 别的球种5个
  const max_other_count = 5;

  const football_csid = '1';
  const basketball_csid = '2';

  for (const item of data) {
    if (item.csid === football_csid && football_count < max_football_count) {
      result.push(item);
      football_count++;
    } else if (item.csid === basketball_csid && result.length < 20) {
      result.push(item);
    }
    // 大于20条时，跳出循环
    if (result.length >= 20) {
      break;
    }
  }

  return result;
}

export const get_featurd_list = async () => {
  let params = {
    isHot: 1,
    cuid: UserCtr.get_uid()
  }
  let featured_list = []
  let res = await api_details.get_hots(params)
  MatchDataWarehouse_ouzhou_PC_hots_List_Common.set_list(res.data);
  // 获取matches_featured
  featured_list = filter_featured_list(
    MatchDataWarehouse_ouzhou_PC_hots_List_Common.match_list
  );
  return featured_list
}
const matches_15mins_list = ref([])
let match_count = ref(0);

// 获取首页数据
export const init_home_matches = async () => {
  const params = {
    type: 1,
    sort: 1,
    // hasFlag: 0
  };
  await axios_loop({
    axios_api: api_match_list.get_home_matches,
    params,
    fun_then: function ({ data }) {
      try {
        MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`].set_template_width(lodash.trim(LayOutMain_pc.layout_content_width - 15, 'px'), false)
        // 处理返回数据 将扁平化数组更改为页面适用数据
        MatchDataWarehouse_ouzhou_PC_l5mins_List_Common.set_list(data.p15);
        //获取15mins 数据
        matches_15mins_list.value = data.p15.slice(0, 5).map(item => {
          set_match_play_current_index(item, 'hps15Minutes')
          return item.mid;
        });
        axios_loop({
          axios_api: () => api_bymids({ mids: matches_15mins_list.value }, null, MatchDataWarehouse_ouzhou_PC_l5mins_List_Common),
        })
        match_count = data.dataList.length || 0;
        let sort_list = data.dataList.sort((x, y) => x.csid - y.csid)
        //过滤前20条数据
        sort_list = filter_20_match_new(sort_list).concat(MatchDataWarehouse_PC_List_Common.match_list);
        // 将球种排序
        MatchDataWarehouse_PC_List_Common.set_list(sort_list);
        MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(sort_list);
      } catch (error) {
        console.log(error);
      }
    }
  })
  axios_loop({
    axios_api: get_five_leagues_list,
    fun_then: function (res) {
      try {

        MatchDataWarehouse_PC_List_Common.set_list(res.concat(MatchDataWarehouse_PC_List_Common.match_list));
        MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
          res, null, null, true
        );
      } catch (error) {
        console.log(error);
      }
    },
  })

};
export {
  matches_15mins_list,
  match_count
}