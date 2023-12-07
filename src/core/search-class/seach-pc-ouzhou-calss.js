import { ref, nextTick } from "vue";
import { debounce } from "lodash";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
class SearchPCDataClass {
  related_keyword = ""; //联想关键字
  keyword = ""; //搜索关键字
  click_keyword = ""; //点击的关键字
  search_league_name = ""; //搜索联赛名
  search_isShow = false; //是否显示搜索组件
  search_type = 1; //搜索类型  1组件搜索   2页面搜索
  update_time = ref(Date.now());
  update = debounce(() => {
    this.update_time.value = Date.now();
  }, 10);

  /**
   * @description: 设置搜索关键字
   * @param {*} search_txt
   * @return {*}
   */
  set_keyword(search_txt) {
    this.search_txt = "a" + lodash.random(1000, 9999) + search_txt;
    this.update();
  }
  /**
   * @description: 保存联想搜索关键字
   * @param {*} search_txt
   * @return {*}
   */
  set_related_keyword(search_txt) {
    this.related_keyword = "a" + lodash.random(1000, 9999) + data;
    this.update();
  }
  /**
   * @description: 设置搜索的联赛名
   * @param {*} data
   * @return {*}
   */
  set_click_keyword(data) {
    this.click_keyword = "a" + lodash.random(1000, 9999) + data;
    this.search_league_name = "a" + lodash.random(1000, 9999) + data;
    this.update();
  }
  /**
   * @description: 设置显示搜索组件状态
   * @param {*} flag
   * @return {*}
   */
  set_search_isShow(flag) {
    useMittEmit(MITT_TYPES.EMIT_LAYOUT_HEADER_SEARCH_ISSHOW, flag)
    this.search_isShow = flag;
    this.update();
  }
  /**
   * @description: 设置保存搜索类型
   * @param {*} type
   * @return {*}
   */
  set_search_type(type) {
    this.search_type = type;
    this.update();
  }
}
const SearchPCClass = new SearchPCDataClass();
export default SearchPCClass;
