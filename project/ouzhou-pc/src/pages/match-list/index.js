import { api_match_list, api_details } from 'src/api';
import {
    MatchDataWarehouse_ouzhou_PC_l5mins_List_Common,
    MatchDataWarehouse_ouzhou_PC_hots_List_Common,
    MatchDataWarehouse_PC_List_Common,
    MatchDataWarehouse_ouzhou_PC_five_league_List_Common,
    LayOutMain_pc,
    UserCtr,
    MenuData
} from "src/core";
import { filter_odds_func, handle_course_data, format_mst_data } from 'src/core/utils/matches_list.js'
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";

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

const is_timer = [ '5', '10', '8', '7', '9', '13', '3' ]



/**
 * 
 * @param {Object} payload 请求主页列表的入参
 * @description 用于请求列表数据的函数 
 */
export const get_home_matches = async payload => {
    const res = await api_match_list.get_home_matches(payload);
    let obj = res?.data || [];
    return obj;
}

/**
   * 
   * @description 获取赛事请求参数
   * @returns { Object }
   */
function get_base_params (euid) {
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

export const filter_featured_list = payload => {
    payload.forEach(item => {
      item['current_ol'] = filter_odds_func(item.hps, '1', true);
      item['course'] = handle_course_data(item);
      item['mstValue'] = !is_timer.includes(item.csid) ? format_mst_data(item.mst) : '';
    })
    return payload.slice(0, 5);
}

const filter_20_match = (data)=>{
    const result = [];
    // 足球最多10个
    const max_football_count = 5;
    let football_count = 0;
    // 别的球种5个
    const max_other_count = 2;

    //用来跟踪每种球种的数量
    const sport_counts = {}

    for(const item of data){
      if(item.csid === '1' && football_count < max_football_count){
        result.push(item);
        football_count++;
      }else if(item.csid !== '1'){
        //当前球种数量
        const current_count = sport_counts['ball' + item.csid] || 0;
        // 当前球种数量小于5时，推入result
        if(current_count < max_other_count){
          result.push(item);
          sport_counts['ball' + item.csid] = current_count + 1;
        }
      }
      // 大于20条时，跳出循环
      if(result.length >= 10){
        break;
      }
    }
    
    return result;
}

// 新规则：足球15 ，篮球5
const filter_20_match_new = (data)=>{
  const result = [];
  // 足球最多15个
  const max_football_count = 15;
  let football_count = 0;
  // 别的球种5个
  const max_other_count = 5;

  const football_csid = '1';
  const basketball_csid = '2';

  for(const item of data){
    if(item.csid === football_csid && football_count < max_football_count){
      result.push(item);
      football_count++;
    }else if(item.csid === basketball_csid && result.length < 20){
      result.push(item);
    }
    // 大于20条时，跳出循环
    if(result.length >= 20){
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

// 获取首页数据
export const init_home_matches = async () => {
    const params = {
      type: 1,
      sort: 1,
      // hasFlag: 0
    };
    let mins15_list = []
    let featured_list = []
    let match_count = 0;
    await get_home_matches(params).then((res) => {
      try {
        MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`].set_template_width(lodash.trim(LayOutMain_pc.layout_content_width - 15, 'px'),false)
        // 处理返回数据 将扁平化数组更改为页面适用数据
        MatchDataWarehouse_ouzhou_PC_l5mins_List_Common.set_list(res.p15);
        // MatchDataWarehouse_ouzhou_PC_hots_List_Common.set_list(res.hots);
        match_count = res.dataList.length || 0;
        let sort_list = res.dataList.sort((x, y) => x.csid - y.csid)
        //过滤前20条数据
        sort_list = filter_20_match_new(sort_list);
        // 将球种排序
        MatchDataWarehouse_PC_List_Common.set_list(sort_list);
        MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
          sort_list,
        );
        //获取15mins 数据
        mins15_list = filter_15mins_func(
          MatchDataWarehouse_ouzhou_PC_l5mins_List_Common.match_list
        );
        console.log(MatchDataWarehouse_ouzhou_PC_l5mins_List_Common.match_list, 'p15- mins15_list')
        // // 获取matches_featured
        // featured_list = filter_featured_list(
        //   MatchDataWarehouse_ouzhou_PC_hots_List_Common.match_list
        // );
      } catch (error) {
          console.log(error);
      }
    });
    get_five_leagues_list().then(res=>{
      try {
        MatchDataWarehouse_PC_List_Common.set_list(res);
        MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
          res, null, null, true
        );
      }catch (error) {
          console.log(error);
      }
    })
    return {
        mins15_list,
        match_count
    }
};