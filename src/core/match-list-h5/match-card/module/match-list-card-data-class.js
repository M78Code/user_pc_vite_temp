/**
 * 列表表征数据存放实例
 */
class MatchListCardData {
  constructor() {
    this.init();
  }
  init() {
    // scroll_top
    this.scroll_top = 0;
    // 所有卡片对象
    this.all_card_obj = {
      // 'card_key':{}
    };
    //当前列表的卡片key列表  不包含赛事卡片
    this.match_list_card_key_arr = [
      // 'card_key'
    ];
    /**
     * 哪种列表类型
     * 1. 列表数据类型为联赛列表   有未开赛 已开赛
     * 2. 列表数据类型为赛事列表   区分赛种
     * 3. 列表数据类型为联赛列表   只有联赛
     * 4. 列表数据类型为赛事列表   有未开赛 已开赛
     * 5. 冠军赛事列表            区分赛种
     * 6. 冠军赛事列表            只有联赛
     * 8. 热门    只有联赛
     * 7. 列表数据类型为赛事列表   只有联赛
     * 7. 列表数据类型为赛事列表   只有联赛
     * 7. 列表数据类型为赛事列表   只有联赛
     */
    this.match_list_mapping_relation_obj_type = "";
    // 是否走卡片逻辑  虚拟体育和详情页热门赛事 不走卡片逻辑
    this.is_run_card_function = true;
    // 列表视图渲染key 每次切换菜单自增1  解决切换菜单偶现视图数据不更新
    this.match_list_render_key = 0;

  
  }
  // 设置 的列表scroll_top
  set_scroll_top(scroll_top) {
    this.scroll_top = scroll_top;
  }
}
export default new MatchListCardData();
