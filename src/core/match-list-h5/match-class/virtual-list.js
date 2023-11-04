

/**
 * @description 赛事 虚拟列表 类
 */

import { ref } from 'vue'
import MatchFold from 'src/core/match-fold'
import { utils } from "src/core/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import MenuData from "src/core/menu-app-h5/menu-data-class.js"
import PageSourceData from "src/core/page-source/page-source.js";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { compute_style_template_by_match_height } from '../match-card/module/compute-style-template.js'

class VirtualList {
  constructor () {
    // 开始下标
    this.start_index = 0
    // 结束下标
    this.end_index = 15
    // 赛事 mid 高度 映射 对象
    this.match_mid_map_height = ref({})
    this.match_height_map_list = []
    this.already_folded = 0;
    this.container_total_height = 0;
    // 赛事与dom高度的映射
    this.mid_top_map = {};
    this.mid_dom_height_dict = {};
  }
  /**
   * @description 设置 赛事 mid 虚拟高度 映射
   * @param { match } 赛事对象
   * @param { height } 赛事初始化高度，初始只展示 联赛标题 40
   * @remarks
   *  1: 初始化时，赋值虚拟高度即 默认高度 40 
   *  2：赛事折叠/展开/次要玩法展开/次要玩法收起 均需更新对应赛事 高度（即真实高度）
   */
  set_match_mid_map_base_info (match, config = { show_league_height: 26, playing_title_height: 20, main_handicap_height: 133, }) {
    const key = this.get_match_height_key(match.mid)
    const { playing_title_height, show_league_height, main_handicap_height } = config
    Object.assign(this.match_mid_map_height.value, {
      [key]: {
        show_league_height,
        playing_title_height,
        main_handicap_height
      }
    })
  }

  get_match_total_height (match, index) {
    const { is_show_league, mid } = match
    const key = this.get_match_height_key(mid)
    const fold_key = MatchFold.get_match_fold_key(match)
    const fold_info = MatchFold.match_mid_fold_obj.value[fold_key]
    const { show_league_height = 0, playing_title_height = 0, main_handicap_height = 0 } = this.match_mid_map_height.value[key]
    let total = 0
    // 联赛标题高度  31: 缓冲容器 5px + 联赛高度 26px
    if (is_show_league) {
      total += !fold_info.show_card ? show_league_height + playing_title_height + main_handicap_height : 31
    } else {
      // 赛事卡片高度
      if (!fold_info.show_card) total += main_handicap_height
    }
    if (index === 0) total += 20
    return total
  }

  /**
   * @description 计算渲染的数据
   * @param {*} scrollTop 滑动的距离
   * @returns 
   */
  compute_page_render_list (scrollTop = 0) {
    this.compute_container_total_height()
    // 可视区高度
    let end_index = 0
    let start_index = 0
    let accrual_height = 0
    const match_datas = []
    // 展开的话缓冲 6场 赛事； 全部折叠 12个
    const buffer_height = scrollTop - 6 * 179
    // 折叠对象
    const fold_data = MatchFold.match_mid_fold_obj.value
    // 高度映射 对象
    MatchMeta.complete_matchs.some((match, index) => {
      const { mid, is_show_league } = match
      const fold_key = MatchFold.get_match_fold_key(match)
      const fold_info = fold_data[fold_key]
      const virtual_key = this.get_match_height_key(mid)
      // 赛事高度
      const total = this.get_match_total_height(match, index)
      if (accrual_height > buffer_height) {
        // 该赛事是否显示
        if (total > 0 && is_show_league || !fold_info.show_card) {
          match_datas.push(match)
        }
      }
      // 赛事偏移量
      this.mid_top_map[virtual_key] = accrual_height
      accrual_height += total
      // 退出循环
      if (match_datas.length >= 18) return true
      
    })
   
    return { 
      match_datas, 
      start_index, 
      end_index 
    }
  }

  compute_container_total_height1 () {
    let total_height = 0
    MatchMeta.complete_matchs.forEach((match, index) => {
      const total = this.get_match_total_height(match, index)
      total_height += total
    })
    this.container_total_height = total_height / 100;
  }

  /**
   * @description 获取 赛事对象 key
   * @param {*} match 
   * @returns String
   */
  get_match_height_key (mid) {
    return `mid_height_${mid}`
  }

  // 计算 容器 总高度
  compute_container_total_height () {
    this.match_height_map_list = MatchMeta.complete_matchs.map((match, i) => {
      let result = compute_style_template_by_match_height(match);
      this.mid_dom_height_dict[match.mid] = result;
      return result
    });
    // 计算每个赛事容器的高度，累加 = 总高度
    const total_height = this.match_height_map_list.reduce((total, map_obj) => {
      let p_total = 0;
      if (typeof total == "number") p_total = total;
      return p_total + this.get_match_dom_height_by_match_data(map_obj);
    }, 0);
    //页面容器 总高度
    this.container_total_height = total_height;
  }

  // 赛事卡片高度
  get_match_dom_height_by_match_data (match_height_map) {
    let r = 0;
    match_height_map && Object.keys(match_height_map).forEach((p_key) => {
      if (p_key != "" && p_key != "mid") {
        r += match_height_map[p_key];
      }
    });
    return r;
  }

  /** 更新 赛事列表 进程
   *  重新计算 每个容器 的 top 定位     核心算法可视区域头尾进行插入新数据操作
   *  调用  vuex 里面 set_match_top_map_dict 设置容器 定位 top 值 表征对象
   */
  compute_container_list_by_scroll_top( scroll_top ) {
    const menu_lv_v1 = MenuData.current_lv_1_menu_mi.value
    const menu_lv_v2 = MenuData.current_lv_2_menu_mi
    
    this.compute_container_total_height()

    let page_count = 18;
    // 新手版
    if (UserCtr.standard_edition == 1) {
      page_count = 20;
    } else if (menu_lv_v1 == 28) {
      //赛果虚拟赛狗|赛马 摩托车
      if ([1002, 1011, 1010, 1009].includes(menu_lv_v2)) {
        page_count = lodash.get(MatchMeta.complete_matchs, 'length')
      } else {
        page_count = 20;
      }
    }
    this.already_folded = 0
    this.mid_top_map = {}
    let match = null
    let show_card = false
    let is_show_league = false
    let current_match_dom_top = 0, // 可视区域的赛事的top 值  18场
      match_list_length = this.match_height_map_list.length, // 当前列表数据的总数量  长度
      get_match_total = 0, // 当前页面的赛事数量
      start_rem = utils.px_2_rem(scroll_top) - 2.34 * 5, // 顶部滚动距离减去  上面5个列表赛事  的距离
      current_screen_match = []; // 列表页可视区域 赛事的数据
    // 只有在列表页才有计算逻辑，节省性能
    if ( !["detail_match_list", "home_hot_page_schedule"].includes( PageSourceData.page_source) ) {
      // aaaaaaa. 虚拟滚动 真正的滑动 算法
      for (let i = 0; i < match_list_length; i++) {
        // 当前赛事
        match = MatchMeta.complete_matchs[i]
        
        is_show_league = match.is_show_league
        let h_map = this.match_height_map_list[i];
        const key = MatchFold.get_match_fold_key(match)
        show_card = lodash.get(MatchFold.match_mid_fold_obj.value, `${key}.show_card`)
        // 计算出 当前赛事的容器高度，以rem 计算
        // let match_height = this.get_match_total_height(match, i) / 100;
        let match_height = this.get_match_dom_height_by_match_data(h_map);
        // 当前赛事id 在整体列表页的高度位置， 大于滑动 的距离，就是可视区域的赛事了
        if (current_match_dom_top > start_rem) {
          // 数量小于 18 或者 20 时，执行下边 赋值操作，列表页每一个赛事的 translateY( ${top}rem) top 定位值
          if (get_match_total < page_count) {
            // 显示的 top 值，在 scroll_wrapper.vue 文件中引用
            // if (i > 0) {
            //   const prev_match = MatchMeta.complete_matchs[i - 1]
            //   if (prev_match && prev_match.is_show_league && !match.is_show_league && prev_match.tid === match.tid && !show_card){
            //     current_match_dom_top += 0.03
            //   }
            // }
            this.mid_top_map[h_map.mid] = current_match_dom_top;
          } else {
            // 执行break，则立即退出 循环
            break;
          } 
          if (match && match_height > 0 && (is_show_league || show_card)) {
            // 列表页赛事的数据
            current_screen_match.push(match);
            get_match_total++; //赛事容器数量加1
          }
          // 如果当前折叠 并且 当前赛事 显示联赛，则 -1 操作
          console.log(show_card)
          if (!show_card && match.is_show_league) {
            if (this.already_folded <= 7) {
              get_match_total--; //赛事容器数量减1，相当于页面可视区域 总数量 page_count 加1个
            }
            this.already_folded++;
          }
        }
        if (i === 0) current_match_dom_top += 0.2
        if (is_show_league || show_card) current_match_dom_top += show_card ? match_height : 0.31;
        
      }

      // 如果当前赛事折叠超过 8场赛事 并且 高度 大于5.5  走  虚拟滚动 真正的滑动 算法，和上边 aaaaaaa 逻辑一模一样
      if (this.already_folded > 7 && this.container_total_height > 550) {
        current_match_dom_top = 0; // 可视区域的赛事的top 值  18场
        get_match_total = 0; // 当前页面的赛事数量
        this.mid_top_map = {}; // 对应的 赛事id 的  偏移 位置值
        let current_list_total_length = current_screen_match.length,
          current_list_total_height = 0,
          list_visible_areas_number = 25;
        // 计算出 当前可视区域赛事的容器总高度，以rem 计算
        for (let j = 0; j < current_list_total_length; j++) {
          let h_map = this.mid_dom_height_dict[current_screen_match[j].mid];
          // 计算出 当前赛事的容器高度，以rem 计算
          current_list_total_height += +this.get_match_dom_height_by_match_data(h_map);
        }
        let many_distances = utils.px_2_rem(scroll_top) - (current_list_total_height / page_count) * 7; // 可视区域  每一场的平均高度 × 7
        current_screen_match = []; // 列表页可视区域 赛事的数据
        for (let i = 0; i < match_list_length; i++) {
          let h_map = this.match_height_map_list[i];
          let match_height = this.get_match_dom_height_by_match_data(h_map);
          if (current_match_dom_top > many_distances) {
            if (get_match_total < list_visible_areas_number) {
              this.mid_top_map[h_map.mid] = current_match_dom_top;
            } else {
              break;
            }
            const match = MatchMeta.complete_matchs[i]
            if (match && match_height > 0) {
              current_screen_match.push(match);
              get_match_total++; //赛事容器数量加1
            }
          }
          current_match_dom_top += match_height;
        }
      }
      // H5 列表页显示的 可视区域的  数据源
      // MatchDataBaseH5.set_list(current_screen_match)
    } else {
      // H5 列表页显示的 可视区域的  数据源
      // MatchDataBaseH5.set_list(current_screen_match)
    }
    return { match_datas: current_screen_match }
  }
}

export default new VirtualList()