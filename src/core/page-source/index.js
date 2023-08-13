/**
 * 页面级别 辅助计算参数  ，和菜单无关 的数据
 */

// 把 可能的值  ，用到的  列这里  免得 满代码找
const page_source = {
  details: "details",
};

class PageSourceData {
  constructor() {
    // 页面来源标识
    this.page_source = "";
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

  /**
   * 设置来源
   * @param {*} page_source
   */
  set_page_source(page_source) {
    this.page_source = page_source;
    //初始化 页面根据  page_source 计算出来的 一些参照值
    this.rebase_other_property();
    if (page_source == "hot") {
      this.is_show_hot = true;
    }

    
  }
}

export default new PageSourceData();
