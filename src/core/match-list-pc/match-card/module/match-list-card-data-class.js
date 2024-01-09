import { reactive, ref } from "vue";
import lodash from 'lodash';
import { choose_config } from 'src/output/module/constant-utils.js'

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
    this.all_card_obj = {};
    this.list_version = ref('1')
    //当前列表的卡片key列表  不包含赛事卡片
    this.match_list_card_key_arr = [
      // 'card_key'
    ];
    //五大联赛卡片key列表  不包含赛事卡片
    this.five_leagues_card_key_arr = [];
    this.match_list_style_info = ref({})
    // 赛种ID到card_key的映射对象
    this.csid_to_card_key_obj = {
      // 'csid_1':[ 'card_0', 'card_1' ]
    };
    this.csid_to_card_key_obj_five = {
      // 'csid_1_five':[ 'card_0', 'card_1' ]
    };
    // 已开赛 到卡片key的 映射对象
    this.play_to_card_key_arr = [];
    // 未开赛 到卡片key的 映射对象
    this.no_start_to_card_key_arr = [];
    // 当前选中的玩法id对象
    this.csid_current_hpids = {};
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
    this.sticky_top = reactive({
      //固定在顶部的头高度
      fixed_header_height: "0px",
      // 赛事状态 | 赛种类型 吸顶高度
      type: 0,
      // 联赛名称吸顶高度
      league: 0,
    });
    // 赛事列表队列数据
    this.match_list_key = []
    // 滚球页当前选中的赛事id
    this.current_mid = ref('')
  }
  set_all_card_obj({
    all_card_obj, play_to_card_key_arr, no_start_to_card_key_arr, match_list_card_key_arr, five_leagues_card_key_arr, csid_to_card_key_obj
  }) {
    // 合并所有卡片样式对象
    lodash.merge(this.all_card_obj, all_card_obj)
    play_to_card_key_arr && (this.play_to_card_key_arr = play_to_card_key_arr)
    no_start_to_card_key_arr && (this.no_start_to_card_key_arr = no_start_to_card_key_arr)
    match_list_card_key_arr && (this.match_list_card_key_arr = match_list_card_key_arr)
    five_leagues_card_key_arr && (this.five_leagues_card_key_arr = five_leagues_card_key_arr)
    csid_to_card_key_obj && (this.csid_to_card_key_obj = csid_to_card_key_obj)
    this.set_list_version()
  }
  set_sticky_top({
    type, league, fixed_header_height
  }) {
    // 吸顶高度
    this.sticky_top.fixed_header_height = fixed_header_height; //固定在顶部的头高度
    this.sticky_top.league = league; // 联赛名称吸顶高度
    this.sticky_top.type = type; // 赛事状态 | 赛种类型 吸顶高度
  }
  // 设置 的列表scroll_top
  set_scroll_top(scroll_top) {
    this.scroll_top = scroll_top;
  }
  set_match_list_style_info(payload) {
    this.match_list_style_info.value = payload;
    this.set_list_version()
  }
  /**
   * 当前赛中选中的要显示赔率
   * 
  */
  set_csid_current_hpids(csid, csid_current_hpids) {
    this.csid_current_hpids[csid] = csid_current_hpids
    this.set_list_version()
  }
  set_list_version() {
    this.list_version.value = Date.now() + '';
  }
  get_csid_current_hpids(csid) {
    //如果保存过模板旧使用保存的
    const tpl_odds = this.csid_current_hpids[csid]
    if (tpl_odds) return tpl_odds
    //默认使用第一个
    if (choose_config[csid]) return choose_config[csid][0]
    console.error("默认模板没有配置", csid)
    return {};
  }
  //获取单个卡片对象
  get_card_obj_bymid(mid) {
    return this.all_card_obj[mid] || this.all_card_obj[mid + '_'] || {}
  }
  set_current_mid(mid) {
    return this.current_mid.value = mid;
  }
}
export default new MatchListCardDataClass();
