/*
 * @Author: Cable
 * @Date: 2020-09-04 14:35:38
 * @Description: 搜索操作相关控制类
 */


import details from 'src/core/match-detail/match-detail-pc/match-detail.js'
import { api_search } from "src/api/index.js";
import { i18n_t } from "src/boot/i18n.js";
import BetCommonHelper from "src/core/bet/common-helper/index.js"
import lodash from 'lodash'
import UserCtr from "src/core/user-config/user-ctr.js";
import { useMittOn, MITT_TYPES, useMittEmit } from 'src/core/mitt';

export default {
  //搜索结果数据模板
  testdata:[
    {
      type_name:'进行中',
      is_active:false,
      is_inplay:true,
      children:[
        {
          league_name:'',
          league_total:3,
          is_active:true,
          children:[
            {
              mhn:'云达不莱梅',
              man:'拜仁慕尼黑',
              score:'0-1',
            },
          ]
        },
      ]
    },
  ],
  /**
  * @Description:获取搜索结果
  * @param {string} keyword 搜索关键词
  * @param {number} csid 球种ID
  * @return {undefined} undefined
  */
	get_search_result(keyword,csid){
    return new Promise((resolve, reject) => {
      let params = {
        keyword,
        cuid:UserCtr.get_uid(),
        pageNumber:1,
        rows:200,
        isPc:true,
        searchSportType:csid
      }
      api_search.get_search_result(params).then( res => {
        // let sports_list = this.get_result_sports_list(res)
        // let list = this.get_result_list(lodash.get(sports_list,'[0].id'))
        const list = this.get_result_data(res)
        const state = list.length == 0 ? 'empty' : 'data'
        resolve({state,list})
      }).catch(() => {
        reject('empty',[])
      })
    })
  },
  /**
  * @Description:接口获取搜索后，重新组装搜索数据
  * @Author Cable
  * @param:res 接口返回的数据
  * @return:组装后的数据
  */
  get_result_data(res,csid){
    let list = []
    let bowling_list = lodash.get(res,'data.data.bowling', [])
    let league_list = lodash.get(res,'data.data.league', [])
    let team_list = lodash.get(res,'data.data.team', [])

    //滚球数据
    if(bowling_list.length > 0){
      let bowling = {
        type_name:i18n_t('list.match_doing'),
        is_active:true,
        is_inplay:true,
        children:[{
          league_name:'',
          league_total:0,
          is_active:true,
          children:[]
        }]
      }
      bowling_list.forEach( match => {
        // if(csid == match.csid){
          if(match.type != 'team'){
            match.name = match.tn
          }
          match.msc = BetCommonHelper.msc_array_obj(match.msc)
          details.init_score(match.msc,['S1'],true)
          bowling.children[0].children.push(match)
        // }
      })
      if(bowling.children[0].children.length > 0){
        list.push(bowling)
      }
    }
    //球队数据
    if(team_list.length > 0){
      let team = this.get_league_data(team_list,csid)
      if(team.children.length > 0){
        team.type_name = i18n_t('search.team'),
        list.push(team)
      }
    }
    //联赛数据
    if(league_list.length > 0){
      let league = this.get_league_data(league_list,csid)
      if(league.children.length > 0){
        league.type_name = i18n_t('search.league'),
        list.push(league)
      }
    }
    return list
  },
  /**
  * @Description:获取重组后的联赛数据
  * @Author Cable
  * @param:league_list 联赛数据列表
  * @param:csid 球种id
  * @return:
  */
  get_league_data(league_list,csid){
    let league = {
      is_active:true,
      children:[]
    }
    league_list.forEach( item => {
      let league_item = {
        league_name:item.leagueName || item.teamName || '',
        league_total:0,
        is_active:true,
        children:[]
      }
      item.matchList.forEach( match => {
        // if(csid == match.csid){
          league_item.children.push(match)
          league_item.league_total++
          match.name = league_item.league_name
        // }
      })
      if(league_item.league_total > 0){
        league.children.push(league_item)
      }
    });
    return league
  },
  /**
  * @Description:获取搜索结果的球种列表
  * @Author Cable
  * @param:res 接口返回的数据
  * @return:组装后的数据
  */
  get_result_sports_list(res){
    let list = []
    let sports_list = lodash.get(res,'data.data.sportIdList') || []
    sports_list.forEach( item => {
      if(item.id){
        let key = 'result_list'+item.id
        this[key] = this.get_result_data(res,item.id)
        if(this[key].length > 0){
          list.push({
            id:item.id,
            tab_name:item.nameText
          })
        }
      }
    })
    return list
  },
  /**
  * @Description:获取搜索结果列表
  * @Author Cable
  * @param:id 球种id
  * @return:
  */
  get_result_list(id){
    let key = 'result_list'+id
    return this[key] || []
  },
  /**
  * @Description:获取搜索关键词联想列表
  * @param {string} keyword
  * @param {function} callback
  * @return {Undefined} Undefined
  */
  fetch_keyword_related(keyword,callback) {
    let params = { keyword: encodeURIComponent(keyword) };
    api_search.get_fetch_keyword_related(params).then(res => {
      let data = lodash.get(res, "data.data") || [];
      callback(data)
    }).catch( err => {
      console.error(err);
      callback([])
    });
  },
  /**
   * @Description:获取热门搜索
   * @param {function} callback
   * @return {Undefined} Undefined
   */
  get_hot_search(callback) {
    api_search.get_hot_search().then(res => {
      // 限频提示
      if(res.code == '0400500') {
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t('common.limited'))
      }
      let data = lodash.get(res, "data") || [];
      if (data.length > 0) {
        callback(data)
      }
    });
  },
  /**
   * @Description:获取搜索历史数据
   * @param {function} callback
   * @return {Undefined} Undefined
   */
  get_history(callback) {
    let params = {
      cuid:UserCtr.get_uid(),
      isPc:1
    }
    api_search.get_history_search(params).then( res => {
      let data = lodash.get(res, "data") || [];
      if (data.length > 0) {
        callback(data)
      }
    });
  },
  /**
   * @Description:删除搜索历史
   * @param {string} keyword
   * @param {function} callback
   * @return {Undefined} Undefined
   */
  delete_histroy(keyword,callback) {
    let params = {
      keyword:keyword || '',
      cuid:UserCtr.get_uid()
    }
    api_search.get_delete_history_search(params).then( res => {
      let code = lodash.get(res, "code");
      if (code == 200) {
        callback()
      }
    });
  },
  /**
   * @Description 插入搜索历史 
   * @param {string} word 关键词
   * @param {undefined} undefined
  */
  insert_history(word){
    api_search.insert_history({word})
  },
  back_keyword:{},
  /**
   * @Description 设置详情页返回搜索参数 
   * @param {object} data 搜索参数
   * @param {undefined} undefined
  */
  set_back_keyword(data){
    this.back_keyword = data 
    if(this.timer_back_keyword ){
      clearTimeout(this.timer_back_keyword)
      this.timer_back_keyword =null
    }
   this.timer_back_keyword= setTimeout(() => {
      this.back_keyword = {}
    },2000)
  }
}
