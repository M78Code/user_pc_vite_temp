/**
 * 页面级别 辅助计算参数  ，和菜单无关 的数据
 */

// 把 可能的值  ，用到的  列这里  免得 满代码找
/**
 * 
 * 主列表页面 key  三个维度
 * 1.match 
 * 2.菜单相关的大类 7个左右 
 * 3.common   fliter  collect
 * 
 */

import{set_sticky_top}  from  "src/core/match-list-pc/match-card/module/sticky-top.js"


const PAGE_SOURCE_POOL_H5 =  [
  "match",
  "details",
  "home",
  "hot-chosen",
  "hot-league",
  'result_details',
  'match_result',
  'category',
  "matchList-common",
  "matchList-filter",
  "matchList-collect",
  "detail_match_list",
  "hot-foot-racing",
]

const PAGE_SOURCE_POOL_PC =  [
  "details",
  'match-play-common' ,
  'match-play-fliter' ,
  'match-play-collect' ,
  'match-early-common' ,
  'match-early-fliter' ,
  'match-early-collect' ,
  "virtual_details"
]

class PageSourceData {
  constructor() {
    // 页面来源标识  当前 页面标识
    this.page_source = "";
    // 页面来源标识  当前 页面标识
    this.route_name = "";
    //  上一个页面的标识
    this.from_page_source = "";
    //初始化 页面根据  page_source 计算出来的 一些参照值
    this.rebase_other_property();
    //排序	 int 类型 1 按热门排序 2 按时间排序
    this.sort_type = 1 ;
    // //标准版和简版 1为新手版  2为标准版    ['','v2_h5','v2_h5_st']
    this.newer_standard_edition = 2 
    // 列表 搜素 文字 
    this.get_search_txt =''

     //路由名字 
     this.router_name = '';

    // 列表查询额外辅助参数
    this.list_query_other_params={
      // batchNo  ： 虚拟体育期号，
      // search_txt ：搜索传参 字符串 
      // filter_list ： 筛选 ： all  或者 [tid]
      
    }
  }

  compute_other_property_by_page_source() {}
  /**
   * 初始化 页面根据  page_source 计算出来的 一些参照值
   */
  rebase_other_property() {
    // 列表页强力推荐
    this.is_show_hot = false;

  }

  /**
   * 获取当前 项目版本 
   * @returns 
   */
  get_newer_standard_edition(){
    const arr=[
      { value:'', label:"", text:"" },
      { value:1, label:"v2_h5", text:"新手版" },
      { value:2, label:"v2_h5_st", text:"标准版" },
    ]

    return this.newer_standard_edition || arr[1]
  }


// 中间列表是列表|收藏

  /**
   * 设置来源
   * @param {*} page_source
   */
  set_page_source(page_source) {
    this.page_source = page_source;
    //初始化 页面根据  page_source 计算出来的 一些参照值
    this.rebase_other_property();
    //强力推荐
    if (page_source == "hot") {
      this.is_show_hot = true;
       // 设置联赛吸顶高度
      set_sticky_top()

    }
    //在列表页面  列表与收藏切换
    if(page_source.includes('match-')){
        // 设置联赛吸顶高度
        set_sticky_top()
    }

  }

  // 设置当前路由名称
  set_route_name (value) {
    this.route_name = value
  }


  // 列表与收藏切换


  /**
   * 设置来源
   * @param {*} from_page_source
   */
  set_from_page(from_page_source) {
    this.from_page_source = from_page_source;
  }
  set_route_name(name){
    this.router_name = name
   }

  is_search(){
    return   this.page_source.includes('search')
  }
   /**
    * 筛选
    */
  is_in_filtering(){
    return   this.page_source.includes('filter')
  }
  /**
   * 列表收藏 
   * @returns 
   */
  is_show_favorite_list(){
    return   this.page_source.includes('collect') 
  }
}

const  instance =new PageSourceData()
const PageSourceDataProxy =new Proxy(instance, {
  set: function (target, key, value, receiver) {
    console.log(`setting : key: ${key} value:${value} , `)
    if(key=='page_source'){

      let check =  PAGE_SOURCE_POOL_H5.includes(value) || PAGE_SOURCE_POOL_PC.includes(value)
      if(check){
        return Reflect.set(target, key, value, receiver);
      }else{
        console.error('page_source 必须在 PAGE_SOURCE_POOL 内录入');
      }
    }else{
      return Reflect.set(target, key, value, receiver);
    }
  }
});


export default  PageSourceDataProxy ;
