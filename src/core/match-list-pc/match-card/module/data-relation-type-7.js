
    /**
     * 哪种列表类型
     * 1. 列表数据类型为联赛列表   有未开赛 已开赛
     * 2. 列表数据类型为赛事列表   区分赛种
     * 3. 列表数据类型为联赛列表   只有联赛
     * 4. 列表数据类型为赛事列表   有未开赛 已开赛
     * 5. 冠军赛事列表            区分赛种
     * 6. 冠军赛事列表            只有联赛
     * 7. 列表数据类型为赛事列表   只有联赛
     * 8. 欧洲版 常规
     * 9. 欧洲版 滚球
     * 处理 ： 9 
     * 因为首页有两个列表  所以不能用同一个表征类  需要新创建一个五大联赛的表征类
     */
    import { MatchDataWarehouse_PC_List_Common as MatchListData } from 'src/output/module/match-data-base.js'
    import MatchListCardData from "./match-list-card-data-class.js";
    import lodash from "lodash";
    import {ref} from "vue"
    import {set_new_sport_title_card_fold} from "./add-and-remove.js"
    import {set_new_league_fold} from  "./fold-tid.js"
    import {compute_style_template_by_matchinfo} from "./compute-style-template.js"
    import {get_match_status} from "src/output/module/constant-utils.js"
    import {
      ouzhou_match_status_title_card_template,
      ouzhou_sport_title_card_template,
      ouzhou_league_title_template,
      fold_template,
      ouzhou_league_container_template,
      no_data_card_template
    } from "../config/card-template-config.js"
    import { compute_sport_id  } from 'src/output/module/constant-utils.js'
    import { MenuData} from "src/output/project/index.js"
    import {get_match_template_id} from '../../match-handle-data.js'
  /**
   * @Description 计算所有卡片样式数据 2. 全部赛种 不区分 是否开赛  4. 列表数据类型为赛事列表   单一赛种，有未开赛 已开赛 ，不区分赛种
   * @param {Array} match_list 赛事列表
   * @param {boolean} is_ws_call 是否ws调用
  */
  export const compute_match_list_style_obj_and_match_list_mapping_relation_obj_type7=(match_list,is_ws_call, is_five_leagues)=>{
    // 已开赛 到卡片key的 映射对象
    let play_to_card_key_arr = ['play_title']
    // 未开赛 到卡片key的 映射对象
    let no_start_to_card_key_arr = ['no_start_title']
    // 赛种ID 到卡片key的 映射对象
    let csid_to_card_key_obj_five = {}
    // 卡片key 到 赛事 id 映射 对象
    let league_card_mids_arr = {}
    // 所有卡片列表
    let match_list_card_key_arr = [];
    // 五大联赛卡片列表
    let five_leagues_card_key_arr = is_five_leagues ?  [] : undefined;

    
    // 所有卡片样式对象
    let all_card_obj = {}

    // 上一个赛事的联赛ID
    let pre_match_tid = 0
    // 上一个赛事的赛种ID
    let pre_match_csid = 0
    // 上一个赛事的开赛状态
    let pre_match_ms = -1
    // 当前卡片索引
    let card_index = -1
    // 卡片key
    let card_key = ''

    // 滚球赛事数量统计
    let play_match_count = 0
    // 未开赛事数量统计
    let no_start_match_count = 0

    // 同样联赛出现次数  用于生成自定义联赛ID
    let league_repeat_count_obj = {}
    // 自定义联赛ID
    let cus_tid = ''

    // 暂无数据热门赛事 添加暂无数据卡片
    if(MenuData.is_show_hot){
      card_index++
      card_key = 'no_data'
      match_list_card_key_arr.push(card_key)
      // 打入球种标题卡片特征
      all_card_obj[card_key] = {
        ...no_data_card_template,
        // 卡片索引
        card_index,
      }
    }
    // 将我们的列表历史存入
    MatchListCardData.match_list_key = match_list
    // 遍历所有赛事列表
    lodash.each(match_list, _match => {
      let match = MatchListData.list_to_obj.mid_obj[_match.mid + '_']
      league_repeat_count_obj[_match.tid] = league_repeat_count_obj[_match.tid] || 0
      let match_ms =  get_match_status(_match.ms)
      // 赛事数量统计
      if(match_ms == 1){
        play_match_count++
      }else{
        no_start_match_count++
      }
      let csid_key = 'csid_'+_match.csid
      // 赛种ID到卡片key的映射
      csid_to_card_key_obj_five[csid_key] = csid_to_card_key_obj_five[csid_key] || []

      // 如果当前联赛 不等于上一个联赛,或者刚创建了一个赛事开赛状态标题卡片，  需要添加一个联赛标题卡片
      if(_match.tid != pre_match_tid){
        // 生成自定义联赛ID
        league_repeat_count_obj[_match.tid]++
        cus_tid = `${_match.tid}_${league_repeat_count_obj[_match.tid]}`

        pre_match_tid = _match.tid

        // 联赛标题卡片处理
        card_index += 1
        card_key = `league_title_${cus_tid}`
        match_list_card_key_arr.push(card_key)
        is_five_leagues && five_leagues_card_key_arr.push(card_key)
        csid_to_card_key_obj_five[csid_key].push(card_key)

        if(match_ms == 1){
          // 已开赛 到卡片key的 映射对象
          play_to_card_key_arr.push(card_key)
        }else{
          // 未开赛 到卡片key的 映射对象
          no_start_to_card_key_arr.push(card_key)
        }

        // 打入联赛标题卡片特征
        all_card_obj[card_key] = {
          ...ouzhou_league_title_template,
          // 卡片索引
          card_index,
          // 赛事ID
          mid:_match.mid,
          // 对应的联赛容器卡片key
          league_container_card_key:`league_container_${cus_tid}`,
          // 联赛信息对象 联赛名称 联赛logo等
          league_obj:{
            csid:_match.csid,
            lurl:_match.lurl,
            tf:_match.tf,
            tid:_match.tid,
            tn:_match.tn,
            mids:''
          },
        }
        // 如果不是ws调用  设置折叠数据
        if(!is_ws_call){
          Object.assign(all_card_obj[card_key],fold_template)
        }

        // 打入联赛容器卡片
        card_index += 1
        card_key = `league_container_${cus_tid}`
        match_list_card_key_arr.push(card_key)
        is_five_leagues && five_leagues_card_key_arr.push(card_key)
        csid_to_card_key_obj_five[csid_key].push(card_key)

        if(match_ms == 1){
          // 已开赛 到卡片key的 映射对象
          play_to_card_key_arr.push(card_key)
        }else{
          // 未开赛 到卡片key的 映射对象
          no_start_to_card_key_arr.push(card_key)
        }

        // 打入联赛容器卡片特征
        all_card_obj[card_key] = {
          ...ouzhou_league_container_template,
          // 卡片索引
          card_index,
          // 对应的联赛标题卡片key
          league_title_card_key:`league_title_${cus_tid}`,
        }
        // 如果不是ws调用  设置折叠数据
        if(!is_ws_call){
          Object.assign(all_card_obj[card_key],fold_template)
        }

      }

      // 联赛卡片下的所有赛事ID列表
      league_card_mids_arr[card_key] = league_card_mids_arr[card_key] || []
      league_card_mids_arr[card_key].push(_match.mid)
      // 赛事表征数据
      all_card_obj[_match.mid+'_'] =  compute_style_template_by_matchinfo(_match, get_match_template_id(_match), true)
    })
     // 已开赛 到卡片key的 映射对象
     MatchListCardData.set_all_card_obj({
      // 合并所有卡片样式对象
        all_card_obj,
        csid_to_card_key_obj_five,//五大联赛 赛种ID 到卡片key的 映射对象
        play_to_card_key_arr,// 已开赛 到卡片key的 映射对象
        no_start_to_card_key_arr,// 未开赛 到卡片key的 映射对象
        //卡片key列表
        match_list_card_key_arr:is_five_leagues?undefined:match_list_card_key_arr,
        // 五大联赛key列表
        five_leagues_card_key_arr 
      })
    // 重新计算所有的联赛卡片样式
    for(let card_key in league_card_mids_arr){
      // 不是联赛容器卡片不处理
      if(card_key.indexOf('league') < 0){
        continue
      }
      let card_total_height = 0

      let mids_arr = league_card_mids_arr[card_key]
      let mids = mids_arr.join(',')
      mids_arr.forEach( mid => {
        let match_style_obj = MatchListCardData.all_card_obj[mid+'_']
        // 设置父级卡片key
        match_style_obj.parent_card_key = card_key
        card_total_height += match_style_obj.total_height
      })

      // 联赛容器卡片
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

      // 设置联赛标题卡片
      league_title_card_obj.match_count = mids_arr.length
      // 设置联赛标题卡片赛事ID
      league_title_card_obj.league_obj.mids = mids
      // 判断卡片是否显示  设置联赛卡片总高度
      if(!league_title_card_obj.is_show_card){
        league_title_card_obj.card_total_height = 0
      }
    }
    // 如果是ws调用
    if(is_ws_call){
      // 设置新增球种标题卡片折叠数据
      set_new_sport_title_card_fold()
      // 设置新增赛事折叠
      set_new_league_fold()
    }
  }