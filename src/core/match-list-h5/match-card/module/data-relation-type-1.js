
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
     * 处理  13
     */
    import { MatchDataWarehouse_H5_List_Common as MatchListData  } from 'src/output/module/match-data-base.js'
    import MatchListCardData from "./match-list-card-data-class.js";
    import lodash from "lodash";

    import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"

    import {get_league_title_card_height,compute_style_template_by_match_info } from  "./compute-style-template.js"
    import {set_new_sport_title_card_fold} from "./add-and-remove.js"
    import {set_new_league_fold} from  "./fold-tid.js"
    import {
      match_status_title_card_template,
   
      league_title_card_template,
      fold_template,
      league_container_card_template,
   
    } from "../config/card-template-config.js"
import { template_3 } from "../template/module/template-3.js";
  //引入菜单类
  const MenuData ={
    menu_data:{
      is_show_hot :false
    },
   
  }


  /**
   * @Description 更新所有未折叠 但是赛事没数据的 赛事
   * @param {array} all_league_container_keys_arr  所有联赛容器卡片列表
  */
  const update_all_unfold_match=(all_league_container_keys_arr)=>{
    // 需要更的赛事ID列表
    let update_mids_arr = []
    all_league_container_keys_arr.forEach( card_key => {
      let card_obj = MatchListCardData.all_card_obj[card_key] || {}
      // 判断联赛是否显示
      if(card_obj.is_show_card){
        let mids_arr = card_obj.mids.split(',')
        // 遍历联赛下 所有赛事
        mids_arr.forEach(mid => {
          // 判断数据仓库是否有数据  没有数据 就更新
          if(!MatchListData.list_to_obj.mid_obj[`${mid}_`]){
            update_mids_arr.push(...mids_arr)
          }
        })
      }
    })
    // 调用bymids接口 拉数据
    if(update_mids_arr.length > 0){
      let params = {
        mids: update_mids_arr,
      };
      // 拉取http请求
      useMittEmit(MITT_TYPES.EMIT_API_BYMIDS,params)
    }
  }


  /**
   * @Description 计算所有卡片样式数据 1. 单一赛种，有未开赛 已开赛 ，不区分赛种   3 单一赛种，不区分赛种 ，只有未开赛，只有联赛
  */
  export const  compute_match_list_style_obj_and_match_list_mapping_relation_obj_type1 =(all_league_obj,is_ws_call,is_remove_call)=>{
    // 赛事模板ID
    let template_id = MenuData.menu_data.match_tpl_number
    if(MenuData.menu_data.is_esports_champion){
      // 电竞冠军玩法
      template_id = 18
    }else if(MenuData.menu_data.is_esports){
      // 电竞常规玩法
      template_id = 'esports'
    }

    // 已开赛 到卡片key的 映射对象
    let play_to_card_key_arr = ['play_title']
    // 未开赛 到卡片key的 映射对象
    let no_start_to_card_key_arr = ['no_start_title']
    // 所有卡片列表
    let match_list_card_key_arr = []
    // 所有卡片样式对象
    let all_card_obj = {}
    // 所有联赛容器卡片key列表
    let all_league_container_keys_arr = []

    // 当前卡片索引
    let card_index = -1
    // 卡片key
    let card_key = ''

    // 展开的赛事数量计数  用于计数首次加载列表 只展开前12场赛事
    let unfold_match_count = 0
    // 是否联赛折叠
    let is_league_fold = false

    let league_nofold_height = get_league_title_card_height(template_id)

    // 临时卡片对象变量
    let temp_card_obj
    // 临时赛事状态标题卡片对象
    let temp_match_status_title_card_obj = {}

    // 联赛标题卡片类型
    let league_title_card_type = MenuData.menu_data.is_esports_champion ? 'champion_league_title' : 'league_title'

    // 同样联赛出现次数  用于生成自定义联赛ID
    let league_repeat_count_obj = {}
    // 自定义联赛ID
    let cus_tid = ''

    // 遍历所有赛事数据
    let match_status_type_arr = ['livedata','nolivedata']
    match_status_type_arr.forEach(match_status_type => {
      // 已开赛、未开赛的赛事数量计算
      let match_status_type_match_count = 0

      // 遍历联赛列表
      let league_list = lodash.get(all_league_obj,match_status_type,[])
      league_list.forEach( (league_obj,league_index) => {
        league_repeat_count_obj[league_obj.tid] = league_repeat_count_obj[league_obj.tid] || 0
        // 生成自定义联赛ID
        league_repeat_count_obj[league_obj.tid]++
        cus_tid = `${league_obj.tid}_${league_repeat_count_obj[league_obj.tid]}`

        // 赛事ID数组
        let mids_arr = league_obj.mids.split(',')

        match_status_type_match_count += mids_arr.length

        // 如果是第一个联赛 并且列表类型是1 有已开赛、未开赛区分，  添加一个已开赛、未开赛标题卡片
        if(league_index == 0 && MatchListCardData.match_list_mapping_relation_obj_type == 1){
          // 已开赛、未开赛标题卡片处理
          card_index += 1
          card_key = match_status_type == 'livedata' ? 'play_title' : 'no_start_title'
          match_list_card_key_arr.push(card_key)

          // 打入已开赛、未开赛标题卡片特征
          all_card_obj[card_key] = {
            ...match_status_title_card_template,
            // 卡片索引
            card_index,
            // 卡片类型
            card_type: card_key,
          }
          temp_match_status_title_card_obj = all_card_obj[card_key]
          // 如果不是ws调用  设置折叠数据
          if(!is_ws_call){
            Object.assign(all_card_obj[card_key],fold_template)
          }
        }

        // 联赛标题卡片处理
        card_index += 1
        card_key = `league_title_${cus_tid}`
        match_list_card_key_arr.push(card_key)

        if(match_status_type == 'livedata'){
          // 已开赛 到卡片key的 映射对象
          play_to_card_key_arr.push(card_key)
        }else{
          // 未开赛 到卡片key的 映射对象
          no_start_to_card_key_arr.push(card_key)
        }

        if(unfold_match_count < 12){
          is_league_fold = false
        }else{
          is_league_fold = true
        }

        // 打入联赛标题卡片特征
        all_card_obj[card_key] = {
          ...league_title_card_template,
          // 卡片索引
          card_index,
          card_type:league_title_card_type,
          // 联赛未折叠高度
          league_nofold_height:league_nofold_height,
          // 联赛下赛事数量
          match_count:mids_arr.length,
          // 联赛下第一个赛事ID
          mid:mids_arr[0],
          // 对应的联赛容器卡片key
          league_container_card_key:`league_container_${cus_tid}`,
          // 联赛信息对象 联赛名称 联赛logo等
          league_obj:{...league_obj},
          // 可能未来要加上他自己下面的所有赛事的内容高度
        }

        temp_card_obj = all_card_obj[card_key]

        if(!is_ws_call){
          // 非ws调用 设置折叠数据
          Object.assign(temp_card_obj,fold_template)
          temp_card_obj.is_league_fold = is_league_fold
        }

        // 打入联赛容器卡片
        card_index += 1
        card_key = `league_container_${cus_tid}`
        match_list_card_key_arr.push(card_key)
        all_league_container_keys_arr.push(card_key)

        if(match_status_type == 'livedata'){
          // 已开赛 到卡片key的 映射对象
          play_to_card_key_arr.push(card_key)
        }else{
          // 未开赛 到卡片key的 映射对象
          no_start_to_card_key_arr.push(card_key)
        }

        // 联赛容器卡片总高度
        let league_card_total_height = 0

        mids_arr.forEach( mid => {
          unfold_match_count++
          // 赛事表征数据
          let match = MatchListData.match_list_data.mid_obj['mid_'+mid]
          let match_style_obj =  compute_style_template_by_match_info(match,template_id)
          all_card_obj['mid_'+mid] = match_style_obj
          league_card_total_height += match_style_obj.total_height
          // 设置父级卡片key
          match_style_obj.parent_card_key = card_key
        })
        // 打入联赛容器卡片特征
        all_card_obj[card_key] = {
          ...league_container_card_template,
          // 卡片索引
          card_index,
          // 对应的联赛标题卡片key
          league_title_card_key:`league_title_${cus_tid}`,
          // 卡片总高度备份 用于折叠展开还原卡片高度
          card_total_height_back:league_card_total_height,
          mids:league_obj.mids
        }
        // 如果不是ws调用  设置折叠数据
        if(!is_ws_call){
          Object.assign(all_card_obj[card_key],fold_template)
          all_card_obj[card_key].is_league_fold = is_league_fold
          all_card_obj[card_key].is_show_card = !is_league_fold

          // 设置赛事数据加载状态
          all_card_obj[card_key].load_data_status = is_league_fold ?'loading' : 'loaded'
        }else{
          // 是ws调用
          delete all_card_obj[card_key].load_data_status
        }

      })
      // 设置赛事数量
      if(match_status_type_match_count > 0){
        temp_match_status_title_card_obj.match_count = match_status_type_match_count
      }
    })

    MatchListCardData.set_all_card_obj({
      //合并所有卡片样式对象
      all_card_obj,
      // 已开赛 到卡片key的 映射对象
      play_to_card_key_arr,
      // 未开赛 到卡片key的 映射对象
      no_start_to_card_key_arr,
      // 所有卡片列表
      match_list_card_key_arr
    })
    // 遍历所有联赛容器卡片
    all_league_container_keys_arr.forEach( card_key => {
      // 设置联赛容器卡片
      let league_container_card_obj = MatchListCardData.all_card_obj[card_key]
      // 联赛标题卡片
      let league_title_card_obj = MatchListCardData.all_card_obj[league_container_card_obj.league_title_card_key]
      // 如果未设置折叠数据  设置折叠数据
      if(!league_container_card_obj.hasOwnProperty('is_show_card')){
        Object.assign(league_container_card_obj,fold_template)
        Object.assign(league_title_card_obj,fold_template)
        league_container_card_obj.load_data_status = 'loading'
      }

      if(league_container_card_obj.is_show_card){
        // 卡片显示  还原卡片总高度
        league_container_card_obj.card_total_height = league_container_card_obj.card_total_height_back
      }else{
        // 卡片不显示 设置总高度为0
        league_container_card_obj.card_total_height = 0
      }

      // 设置联赛标题卡片
      if(league_title_card_obj.is_league_fold){
        // 联赛折叠 设置高度为折叠的高度
        league_title_card_obj.card_total_height_back = league_title_card_template.league_fold_height
        league_title_card_obj.mid = 0
      }else{
        // 联赛未折叠 设置高度为未折叠的高度
        league_title_card_obj.card_total_height_back = league_nofold_height
      }
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
      // 更新未折叠赛事
      if(!is_remove_call){
       update_all_unfold_match(all_league_container_keys_arr)
      }
    }
  }
