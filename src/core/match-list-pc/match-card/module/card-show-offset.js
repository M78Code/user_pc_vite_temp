/**
 * 
 * 
 * 列表可视区 显示级别 算法  
 * */ 
import { nextTick } from 'vue'
import MatchListCardData from "./match-list-card-data-class.js";
import PageSourceData  from  "src/core/page-source/page-source.js"
import { MenuData} from "src/output/module/menu-data.js";
import LayOutMain_pc from "src/core/layout/index.js";
import MatchListScrollClass from 'src/core/match-list-pc/match-scroll.js'

 
//显示等级 计算参照结果
const show_level_refer = MatchListCardData.show_level_refer;
/**
 * @Description 获取显示等级
 */
const get_show_level = (card_obj) => {
  let show_level = 1;
  if (
    (card_obj.offset_top > show_level_refer.level1_offset_top &&
      card_obj.offset_top < show_level_refer.level1_offset_bottom) ||
    (card_obj.offset_bottom > show_level_refer.level1_offset_top &&
      card_obj.offset_top < show_level_refer.level1_offset_bottom)
  ) {
    show_level = 1;
  } else if (
    (card_obj.offset_top > show_level_refer.level2_offset_top &&
      card_obj.offset_top < show_level_refer.level2_offset_bottom) ||
    (card_obj.offset_bottom > show_level_refer.level2_offset_top &&
      card_obj.offset_top < show_level_refer.level2_offset_bottom)
  ) {
    show_level = 2;
  } else if (
    (card_obj.offset_top > show_level_refer.level3_offset_top &&
      card_obj.offset_top < show_level_refer.level3_offset_bottom) ||
    (card_obj.offset_bottom > show_level_refer.level3_offset_top &&
      card_obj.offset_top < show_level_refer.level3_offset_bottom)
  ) {
    show_level = 3;
  } else {
    show_level = 4;
  }
  return show_level;
};
/**
 * 设置卡片显示等级
 * 一级   列表可视区域
 * 二级   列表可视区域 加前500px  和后500px
 * 三级   列表可视区域 加前1000px 和后1000px
 * 四级   列表可视区域 加前2000px 和后2000px
 * 五级   列表可视区域 加前3000px 和后3000px
 */
export const set_card_show_level = () => {
  let scroll_top = MatchListScrollClass.scroll_top;
  // 列表高度
  let list_content_height = LayOutMain_pc.layout_content_height;
  // 一级区域offset_top
  show_level_refer.level1_offset_top = scroll_top;
  // 一级区域offset_bottom
  show_level_refer.level1_offset_bottom =
    show_level_refer.level1_offset_top + list_content_height;
  // 二级区域offset_top
  show_level_refer.level2_offset_top = scroll_top - 500;
  // 二级区域offset_bottom
  show_level_refer.level2_offset_bottom =
    show_level_refer.level2_offset_top + list_content_height + 500 * 2;
  // 三级区域offset_top
  show_level_refer.level3_offset_top = scroll_top - 1000;
  // 三级区域offset_bottom
  show_level_refer.level3_offset_bottom =
    show_level_refer.level3_offset_top + list_content_height + 1000 * 2;
  // 可视区域赛事ID
  let show_mids_arr = [];
  // 遍历所有卡片
  const list_arry=lodash.clone(MatchListCardData.match_list_card_key_arr)
  if(MenuData.is_home())
  {
    list_arry.push(...MatchListCardData.five_leagues_card_key_arr)
  }
  list_arry.forEach((card_key) => {
    let card_obj = MatchListCardData.all_card_obj[card_key];
    if(!card_obj){
      console.log("未找到表征:card_key",card_key, card_obj);
      return;
    }
    // 是否联赛容器卡片
    if (card_obj.card_type == "league_container") {
      // 设置卡片显示等级
      card_obj.show_level = get_show_level(card_obj);
      // card_obj.show_level = 1;

      // 设置对应的联赛标题卡片显示等级
      let league_title_card_obj = MatchListCardData.all_card_obj[card_obj.league_title_card_key];

      league_title_card_obj.show_level = card_obj.show_level;
      let mids_arr = card_obj.mids.split(",");
      // 遍历联赛容器下的赛事卡片  设置显示等级
      mids_arr.forEach((mid) => {
        let match_card_obj = MatchListCardData.all_card_obj[mid+'_'];
        match_card_obj.show_level = get_show_level(match_card_obj);
        if (match_card_obj.show_level == 1 && card_obj.is_show_card) {
          show_mids_arr.push(mid);
        }
      });
    } else {
      // 球种标题卡片 和赛事状态卡片 因为设置吸顶的原因，不能用offset_top判断判断是否可视，所以这个类型卡片需要一直显示
      card_obj.show_level = 1;
    }
  });
  MatchListScrollClass.set_show_mids(show_mids_arr)
  return show_mids_arr;
};




  /**
   * 计算所有卡片的偏移量 和列表总高度
   * 切记 先改赛事 联赛 赛种  开赛层级 再 改这个
   * 自定义可视区域暂设2个列表高度  即当前真实可视区域加前半个列表高度  和后半个列表高度
   */
  export const conpute_match_list_card_offset=()=>{
    // 详情页强力推荐 不用计算卡片偏移量
    if(PageSourceData.page_source == 'details'){
      return
    }
    // 球种标题、赛事状态标题卡片类型的索引  用于给该类型偶数卡片 设置不同的背景色
    let match_type_card_index = 0
    // 上一个卡片对象
    let pre_card_obj = {
      // 卡片底部 距离列表顶部的距离
      // offset_bottom: MatchListScrollClass.special_offset,
      offset_bottom: 0,
    }
    // 上一个赛事卡片对象
    let pre_match_card_obj
    MatchListCardData.match_list_card_key_arr.forEach(card_key => {
      let card_obj = MatchListCardData.all_card_obj[card_key]
      if(!card_obj){
        console.log("未找到表征:card_key",card_key);
        return;
      }
      
      // 设置卡片偏移量  顶部偏移量等于上一个卡片 的底部偏移量， 底部偏移量等于自定顶部偏移量加自身高度
      card_obj.offset_top = pre_card_obj.offset_bottom
      card_obj.offset_bottom = card_obj.offset_top + card_obj.card_total_height
      // 设置是否球种标题、赛事状态标题类型卡片 的偶数卡片  用于设置偶数类型背景色
      if(['sport_title','play_title','no_start_title'].includes(card_obj.card_type)){
        match_type_card_index++
        if(match_type_card_index % 2 == 0){
          card_obj.is_even_type = true
        }else{
          card_obj.is_even_type = false
        }
      }
      // 设置赛事卡片偏移量
      if(card_obj.card_type == 'league_container'){
        pre_match_card_obj = {
          // 卡片底部 距离列表顶部的距离
          offset_bottom:card_obj.offset_top,
        }
        let mids_arr = card_obj.mids.split(',')
        // 遍历所有赛事卡片

        mids_arr.forEach( mid => {
          let match_card_obj = MatchListCardData.all_card_obj[mid+'_']
          // 设置卡片偏移量  顶部偏移量等于上一个卡片 的底部偏移量， 底部偏移量等于自定顶部偏移量加自身高度
          match_card_obj.offset_top = pre_match_card_obj.offset_bottom
          match_card_obj.offset_bottom = match_card_obj.offset_top + match_card_obj.total_height
          pre_match_card_obj = match_card_obj
        })
      }
      // 设置上一个卡片对象
      pre_card_obj = card_obj
    })
    set_card_show_level()
    MatchListCardData.set_list_version()  
  }



  
  /**
   * @Description 设置折叠后的列表scroll_top
   * @param {number} offset_top 折叠的卡片offset_top
   * @param {boolean} is_league_fold 是否联赛折叠
  */
 export const  set_fold_match_list_scroll_top=(offset_top,is_league_fold)=>{
    // 列表类型为冠军赛事 不需要设置表scroll_top
    if([5,6].includes(MatchListCardData.match_list_mapping_relation_obj_type)){
      return
    }
    if(is_league_fold && ![3,6].includes(MatchListCardData.match_list_mapping_relation_obj_type)){
      // 联赛折叠 并且列表类型不是3,6    有球种区分 或者赛事开赛状态区分  offset_top减去球种标题卡片高度
      offset_top -= 32
    }
    // 如果折叠后 标题不在可视区域  则滚动到标题吸顶的位置
    if(offset_top <  MatchListCardData.scroll_top){
      // this.view.useMittEmit('set_match_list_scroll_top',offset_top)
    }
  }






