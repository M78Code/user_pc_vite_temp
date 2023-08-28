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
const PAGE_SOURCE_POOL =  [
  "details",
  'match-play-common' ,
  'match-play-fliter' ,
  'match-play-collect' ,
  'match-early-common' ,
  'match-early-fliter' ,
  'match-early-collect' ,
  "virtual_details"
 
]
   

import{set_sticky_top}  from  "src/core/match-list-pc/match-card/module/sticky-top.js"
class PageSourceData {
  constructor() {
    // 页面来源标识  当前 页面标识
    this.page_source = "";
    //  上一个页面的标识
    this.from_page_source = "";
    //初始化 页面根据  page_source 计算出来的 一些参照值
    this.rebase_other_property();
  }

  compute_other_property_by_page_source() {}
  /**
   * 初始化 页面根据  page_source 计算出来的 一些参照值
   */
  rebase_other_property() {
    // 列表页强力推荐
    this.is_show_hot = false;

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




  // 列表与收藏切换




  /**
   * 设置来源
   * @param {*} from_page_source
   */
  set_from_page(from_page_source) {
    this.from_page_source = from_page_source;
  }

  is_search(){
    return   this.page_source.includes('search')
  }
}


const  instance =new PageSourceData()
const PageSourceDataProxy =new Proxy(instance, {
  set: function (target, key, value, receiver) {
    console.log(`setting : key: ${key} value:${value} , `)
    if(key=='page_source'){
      if(PAGE_SOURCE_POOL.includes(value)){
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



 