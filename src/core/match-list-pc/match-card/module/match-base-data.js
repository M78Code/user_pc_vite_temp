import { MatchDataWarehouse_PC_List_Common as MatchListData } from 'src/output/module/match-data-base.js'
import MatchListCardData from "./match-list-card-data-class.js";
import MatchListCardClass from '../match-list-card-class.js';
import {match_list_handle_set} from '../../match-handle-data.js'


  /**
   * @Description 根据mid 获取一场赛事数据
   * @param {number} mid 赛事id
   * @return {Object} 赛事对象
  */

    //引入菜单类
    const MenuData ={
      menu_data:{
        is_show_hot :false
      },
     
    }
    
  export const  get_match_data =(mid)=>{
    let match = MatchListData.list_to_obj.mid_obj[mid+'_']
    if(!match) return false
    return {
      ...match,
      api_update_time:0,
      cmec: '',
      maid: "",
      mat: "",
      mc: 0,
      mcg: 0,
      mcid: "",
      mct: 0,
      mdsc: '',
      mearlys: 0,
      mess: 0,
      mf: false,
      mfo: null,
      mft: 0,
      mgt: "0",
      mhid: "0",
      mhs: 0,
      mle: 0,
      mlet: "0",
      mmp: "0",
      mms: -1,
      mng: 0,
      mo: 0,
      mp: 1,
      mprmc: "", // 操盘类型取值 "", MTS ,PA
      mrmc: "",
      ms: 1,
      mst: "0",
      mstst: "0",
      mststi: "0",
      mststr: "0",
      mststs: 0,
      mvs: -1,
      operationHotSortTop: 0,
      operationTournamentSort: 8,
      regionIdSort: 9,
      seid: "",
      srid: "0",
      tf: false,
      th: 0,
      tlev: 0,
      team_let_ball:"" // 让球方
    }
  }
  /**
   * @Description 判断联赛是否加载过数据  如果没加载过数据 从基础数据仓库 设置赛事主客队名称
  */
  export  const set_match_basic_data=(league_title_card_obj)=>{
    // 模板10 网球-准确盘数   模板15 兵乓球-准确盘数  不处理
    if([10, 15].includes(+MenuData.menu_data.match_tpl_number)){
      return
    }
    // 设置联赛加载无数据状态
    let league_container = MatchListCardData.all_card_obj[league_title_card_obj.league_container_card_key] || {}
    // 没加载过数据
    if(league_container.load_data_status == 'loading'){
      // 联赛的赛事ID数组
      let mids = league_title_card_obj.league_obj.mids.split(',')
      let match_list = []
      mids.forEach( mid => {
        let match =  get_match_data(mid)
        if(match){
          match_list.push(match)
        }
      })
      if(match_list.length > 0){
        // 设置列表数据仓库
        MatchListData.set_list(match_list,true)
        match_list_handle_set(match_list)
        // 重新计算赛事样式
        MatchListCardClass.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs(mids)
      }
    }
  }