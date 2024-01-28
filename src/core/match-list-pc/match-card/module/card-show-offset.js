/**
 * 
 * 
 * 列表可视区 显示级别 算法  
 * */ 
import MatchListCardData from "./match-list-card-data-class.js";
import PageSourceData  from  "src/core/page-source/page-source.js"
import { MenuData} from "src/output/project/index.js";
import {LayOutMain_pc} from "src/output/project/index.js";
import MatchListScrollClass from 'src/core/match-list-pc/match-scroll.js'
import { throttle } from "lodash";
// 显示等级：
//     列表分为不同层级 不同维度 组合成为我们的列表
//     1.我们由赛事卡片组合成我们的列表容器卡片
//     2.由多个联赛容器卡片和联赛标题卡片组合成我们的赛事列表
//     3.有关于我们的显示等级 是在我们表征计算之后 此时已经得到了我们每个赛事卡片的表征信息了(例如卡片高度)
//     4.然后我们会循环我们的表征key组成的数组，去表征类里边取我们的每个key所对应的视图信息
//     5.例如 第一个卡片高度为200px 那么会计算出来这个卡片的向上偏移量 然后加上自身的高度获得当前卡片距离顶部的偏移量
//     6.这个时候会把当前的这个卡片的表征信息存储为pre_card_obj
//     7.然后下一个卡片会根据pre_card_obj去计算当前卡片的顶部向上偏移量及底部向上偏移量 以此类推
//     8.当我们的表征key的数组里边全部都有offset_top offset_bottom之后 会走进我们的显示等级的算法里边
//     9.目前我们的显示等级的算法为：
//         9.1 首先我们规划出了一个我们的显示等级,分为五个显示等级 1~5级
//         9.2 我们在列表发生滚动的时候，可以拿到我们的当前scrollTop 然后根据scrollTop和当前的页面高度计算出我们每个卡片的显示等级
//         9.3 我们的显示等级区域计算逻辑为 
//             9.3.1 scrollTop+当前页面的高度 这是1级显示区域 
//             9.3.2 2级显示区域的逻辑为 从scrollTop - 500 --》 content_height + 500 * 2 可以理解为向上向上扩展500px 向下扩展500px
//             9.3.3 然后3级可视区域就是 1000px
//             9.3.4 其余为4级可视区域
//             9.3.5 目前没有应用5级可视区域
//         9.4 例如 当前卡片的offset_top为 300 offset_bottom为600(卡片高度为300px) 然后列表的scrollTop为400
//             因为offset_bottom > scrollTop && offset_bottom < scrollTop+当前页面高度 所以这张卡片就是在可视区域内的
//             或者 当前卡片的offset_top为 600 offset_bottom为1000(卡片高度为400px) 然后列表的scrollTop为400
//             因为offset_top > scrollTop && offset_top < scrollTop+当前页面高度 所以这张卡片也是在可视区域内的
//             这是显示等级为1的算法
//         9.5 其余2.3.4 显示等级与1级显示等级计算逻辑一致 只不过用于判断的值 会上下扩展

// 可视区域id获取  
//     我们根据显示等级获取到可视区域赛事id(show_level 为 1 且当前卡片是展示状态)
//     会将mid push到一个数组里边 作为我们的可视区域id数组
//     注意~~~
//         特殊情况会获取不到可视区域的赛事id
//         这个时候是有一个补充逻辑在的
//         补充逻辑为
//             拿到当前获取到的可视区域id的第一项和最后一项的赛事id
//             从我们的当前列表的mid队列中取到第一项和最后一项的mid所在位置的下标
//             如果第一项到最后一项的长度 大于我们的可视区域id数组的长度
//             那么用这个新数组 去覆盖掉我们原来的可视区域id的数组
//             只需要补充当前可视区域数组长度小于我们的真正队列中截取出来的长度的时候 才需要处理
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
    let card_obj = MatchListCardData.get_card_obj_bymid(card_key);
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
      let league_title_card_obj = MatchListCardData.get_card_obj_bymid(card_obj.league_title_card_key);

      league_title_card_obj.show_level = card_obj.show_level;
      let mids_arr = card_obj.mids.split(",");
      // 遍历联赛容器下的赛事卡片  设置显示等级
      mids_arr.forEach((mid) => {
        let match_card_obj = MatchListCardData.get_card_obj_bymid(mid);
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
  // MatchListCardData.set_list_version()
  return show_mids_arr;
};



  const set_list_version=throttle(()=>MatchListCardData.set_list_version(),10)
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
      let card_obj = MatchListCardData.get_card_obj_bymid(card_key)
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
          let match_card_obj = MatchListCardData.get_card_obj_bymid(mid)
          if(!match_card_obj){
            console.log("未找到表征:card_key",mid);
            return;
          }
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
    // set_list_version()
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






