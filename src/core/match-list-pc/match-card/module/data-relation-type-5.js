
    /**
     * 哪种列表类型
     * 1. 列表数据类型为联赛列表   有未开赛 已开赛
     * 2. 列表数据类型为赛事列表   区分赛种
     * 3. 列表数据类型为联赛列表   只有联赛
     * 4. 列表数据类型为赛事列表   有未开赛 已开赛
     * 5. 冠军赛事列表            区分赛种
     * 6. 冠军赛事列表            只有联赛
     * 7. 列表数据类型为赛事列表   只有联赛
     * 
     * 
     * 处理  56
     */
    import MatchListCardData from "./match-list-card-data-class.js";
    import {set_new_sport_title_card_fold} from "./add-and-remove.js"
    import {set_new_league_fold} from  "./fold-tid.js"
    import {compute_style_template_by_matchinfo} from "./compute-style-template.js"
    import {
   
      sport_title_card_template,
      league_title_card_template,
      fold_template,
      league_container_card_template,
    
    } from "../config/card-template-config.js"
    import { compute_sport_id  } from 'src/output/module/constant-utils.js'
    import {get_match_template_id} from '../../match-handle-data.js'
    import { MenuData} from "src/output/project/index.js"

  /**
   * @Description 计算所有卡片样式数据   5. 冠军赛事列表 全部赛种 不区分是否开赛  6. 冠军赛事列表    单一赛种 不区分是否开赛
   * @param {Array} match_list 赛事列表
   * @param {boolean} is_ws_call 是否ws调用
   * @param {undefined} undefined
  */
  export const compute_match_list_style_obj_and_match_list_mapping_relation_obj_type5=(match_list,is_ws_call)=>{
    // 赛种ID 到卡片key的 映射对象
    let csid_to_card_key_obj = {}
    // 所有卡片列表
    let match_list_card_key_arr = []
    // 所有卡片样式对象
    let all_card_obj = {}
    // 所有联赛容器卡片key列表
    let all_league_container_keys_arr = []
    // 卡片key 到 赛事 id 映射 对象
    let league_card_mids_arr = {}

    // 上一个赛事的赛种ID
    let pre_match_csid = 0
    // 当前卡片索引
    let card_index = -1
    // 卡片key
    let card_key = ''

    // 是否联赛折叠
    let is_league_fold = false

    // 上一个赛事的联赛ID
    let pre_match_tid = 0
    // 同样联赛出现次数  用于生成自定义联赛ID
    let league_repeat_count_obj = {}
    // 自定义联赛ID
    let cus_tid = ''
    // 遍历所有赛事列表
    match_list && match_list.length && match_list.forEach( (match,match_index) => {
      league_repeat_count_obj[match.tid] = league_repeat_count_obj[match.tid] || 0
      // 冠军首次加载只显示前3场赛事
      is_league_fold = match_index > 2

      let csid_key = 'csid_'+match.csid
      // 赛种ID到卡片key的映射
      csid_to_card_key_obj[csid_key] = csid_to_card_key_obj[csid_key] || []

      // 如果当前赛种 不等于上一个赛种  需要添加一个球种标题卡片
      if(MatchListCardData.match_list_mapping_relation_obj_type == 5 && match.csid != pre_match_csid){
        pre_match_csid = match.csid
        card_key = `sport_title_${match.csid}`
        // 判断球种标题卡片是否创建过，防止傻逼后台返回傻逼数据， 有可能会出现重复球种标题卡片
        if(!csid_to_card_key_obj[csid_key].includes(card_key)){
          // 球种标题卡片处理
          card_index += 1
          match_list_card_key_arr.push(card_key)
          csid_to_card_key_obj[csid_key].push(card_key)

          // 打入球种标题卡片特征
          all_card_obj[card_key] = {
            ...sport_title_card_template,
            // 卡片索引
            card_index,
            // 球种名称
            csna:match.csna,
            // 球种ID
            csid:match.csid,
          }
          // 如果不是ws调用  设置折叠数据
          if(!is_ws_call){
            Object.assign(all_card_obj[card_key],fold_template)
          }
        }
      }

      // 如果当前联赛 不等于上一个联赛  需要添加一个联赛标题卡片
      if(match.tid != pre_match_tid){
        // 生成自定义联赛ID
        league_repeat_count_obj[match.tid]++
        cus_tid = `${match.tid}_${league_repeat_count_obj[match.tid]}`

        pre_match_tid = match.tid

        // 联赛标题卡片处理
        card_index += 1
        card_key = `league_title_${cus_tid}`
        match_list_card_key_arr.push(card_key)
        csid_to_card_key_obj[csid_key].push(card_key)

        // 打入联赛标题卡片特征
        all_card_obj[card_key] = {
          ...league_title_card_template,
          // 卡片索引
          card_index,
          // 卡片类型
          card_type:'champion_league_title',
          // 赛事ID
          mid:match.mid,
          // 对应的联赛容器卡片key
          league_container_card_key:`league_container_${cus_tid}`,
          // 联赛信息对象 联赛名称 联赛logo等
          league_obj:{
            csid:match.csid,
            lurl:match.lurl,
            tf:match.tf,
            tid:match.tid,
            tn:match.tn,
            onTn:match.onTn,
            mid:match.mid,
          },
        }
        // 如果不是ws调用  设置折叠数据
        if(!is_ws_call){
          Object.assign(all_card_obj[card_key],fold_template)
          all_card_obj[card_key].is_league_fold = is_league_fold
        }

        // 打入联赛容器卡片
        card_index += 1
        card_key = `league_container_${cus_tid}`
        match_list_card_key_arr.push(card_key)
        all_league_container_keys_arr.push(card_key)
        csid_to_card_key_obj[csid_key].push(card_key)

        // 打入联赛容器卡片特征
        all_card_obj[card_key] = {
          ...league_container_card_template,
          // 卡片索引
          card_index,
          // 对应的联赛标题卡片key
          league_title_card_key:`league_title_${cus_tid}`,
        }
        // 如果不是ws调用  设置折叠数据
        if(!is_ws_call){
          Object.assign(all_card_obj[card_key],fold_template)
          all_card_obj[card_key].is_league_fold = is_league_fold
          all_card_obj[card_key].is_show_card = !is_league_fold
        }

      }

      // 联赛卡片下的所有赛事ID列表
      league_card_mids_arr[card_key] = league_card_mids_arr[card_key] || []
      league_card_mids_arr[card_key].push(match.mid)
      // 赛事表征数据
      let match_style_obj =  compute_style_template_by_matchinfo(match, get_match_template_id(match),true)
      all_card_obj[match.mid+'_'] = match_style_obj
    })

    MatchListCardData.set_all_card_obj({
      // 合并所有卡片样式对象
        all_card_obj,
        //卡片key列表
        match_list_card_key_arr,
        csid_to_card_key_obj//赛种ID 到卡片key的 映射对象
      })
    // 遍历所有联赛容器卡片
    all_league_container_keys_arr.forEach( card_key => {
      let card_total_height = 0

      let mids_arr = league_card_mids_arr[card_key]
      let mids = mids_arr.join(',')
      mids_arr.forEach( mid => {
        let match_style_obj = MatchListCardData.all_card_obj[mid+'_']
        // 设置父级卡片key
        match_style_obj.parent_card_key = card_key
        card_total_height += match_style_obj.total_height
      })
      // 设置联赛容器卡片
      let league_container_card_obj = MatchListCardData.all_card_obj[card_key]
      // 联赛标题卡片
      let league_title_card_obj = MatchListCardData.all_card_obj[league_container_card_obj.league_title_card_key]

      // 设置联赛容器卡片
      league_container_card_obj.card_total_height_back = card_total_height
      league_container_card_obj.mids = mids

      // 如果未设置折叠数据  设置折叠数据
      if(!league_container_card_obj.hasOwnProperty('is_show_card')){
        Object.assign(league_container_card_obj,fold_template)
        Object.assign(league_title_card_obj,fold_template)
      }

      // 判断卡片是否显示  设置联赛卡片总高度
      if(league_container_card_obj.is_show_card){
        league_container_card_obj.card_total_height = card_total_height
      }else{
        league_container_card_obj.card_total_height = 0
      }

      // 设置联赛标题卡片赛事ID
      league_title_card_obj.league_obj.mids = mids
      // 设置联赛标题卡片
      if(league_title_card_obj.is_show_card){
        // 卡片显示  还原卡片总高度
        league_title_card_obj.card_total_height = league_title_card_obj.card_total_height_back
      }else{
        // 卡片不显示 设置总高度为0
        league_title_card_obj.card_total_height = 0
      }
    })
    // 如果是ws调用
    if(is_ws_call){
      // 设置新增球种标题卡片折叠数据
      set_new_sport_title_card_fold()
      // 设置新增赛事折叠
      set_new_league_fold()
    }
  }