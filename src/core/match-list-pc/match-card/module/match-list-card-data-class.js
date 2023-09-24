import { reactive, ref } from "vue";

/**
 * 列表表征数据存放实例
 */
class MatchListCardDataClass {
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
    this.list_version =  ref('1') 
    //当前列表的卡片key列表  不包含赛事卡片
    this.match_list_card_key_arr =    [
      // 'card_key'
    ] ;
    this.match_list_style_info = ref({})
    // 赛种ID到card_key的映射对象
    this.csid_to_card_key_obj = {
      // 'csid_1':[ 'card_0', 'card_1' ]
    };
    // 已开赛 到卡片key的 映射对象
    this.play_to_card_key_arr = [];
    // 未开赛 到卡片key的 映射对象
    this.no_start_to_card_key_arr = [];
    /**
     * 哪种列表类型
     * 1. 列表数据类型为联赛列表   有未开赛 已开赛
     * 2. 列表数据类型为赛事列表   区分赛种
     * 3. 列表数据类型为联赛列表   只有联赛
     * 4. 列表数据类型为赛事列表   有未开赛 已开赛
     * 5. 冠军赛事列表            区分赛种
     * 6. 冠军赛事列表            只有联赛
     * 7. 列表数据类型为赛事列表   只有联赛
     */
    this.match_list_mapping_relation_obj_type = "";
    // 是否走卡片逻辑  虚拟体育和详情页热门赛事 不走卡片逻辑
    this.is_run_card_function = true;
    // 列表视图渲染key 每次切换菜单自增1  解决切换菜单偶现视图数据不更新
    this.match_list_render_key = 0;
    // 显示等级 计算参照结果
    this.show_level_refer = {
      level1_offset_top: "",
      level1_offset_bottom: "",
      level2_offset_top: "",
      level2_offset_bottom: "",
      level3_offset_top: "",
      level3_offset_bottom: "",
    };
    // 吸顶高度
    this.sticky_top = {
      //固定在顶部的头高度
      fixed_header_height: "36px",
      // 赛事状态 | 赛种类型 吸顶高度
      type: 0,
      // 联赛名称吸顶高度
      league: 0,
    };
  }
  // 设置 的列表scroll_top
  set_scroll_top(scroll_top) {
    this.scroll_top = scroll_top;
  }

  set_match_list_style_info(payload) {
    this.match_list_style_info.value = payload;
  }

  set_list_version() {
    this.list_version.value =   Date.now() ;
  }
}
export default new MatchListCardDataClass();
