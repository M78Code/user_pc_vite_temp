<template>
  <div class='search-container'>
    <template v-if="!results_of_the_virtual_display">
      <!-- 搜索头部 -->
      <search-top @get_suggestion_list="get_suggestion_list" @get_search_result="get_search_result"
        @change_show_content="change_show_content" />

      <div class="search" ref="search">
        <!-- 搜索页面骨架屏 -->
        <SSearch v-show="show_suggestion && loading" :loading_body="show_suggestion" />
        <!-- 搜索联想框 -->
        <i-suggestion :suggestion-list="suggestion_list" v-if="show_suggestion && !loading" />
        <!-- 搜索历史 -->
        <search-history v-if="history_list.length > 0 && !show_suggestion" :history_list="history_list"
          @get_search_result="get_search_result" @delete_history="delete_history" />
        <!-- 热门搜索 -->
        <search-hot v-if='hot_list.length > 0 && !show_suggestion' :hot_list="hot_list"
          @get_search_result='get_search_result' />
      </div>
    </template>
    <template v-if="results_of_the_virtual_display">
      <!-- 搜索头部 -->
      <search-top @get_suggestion_list="get_suggestion_list" show_tab="saiguo_xunitiyu" />
    </template>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import searchTop from './components/search-top.vue'// 搜索头部组件
import searchHot from './components/search-hot.vue'// 搜索热门
import searchHistory from './components/search-history.vue' // 搜索历史
import iSuggestion from './components/i-suggestion.vue'// 搜索联想建议
import SSearch from "src/base-h5/components/skeleton/search.vue"// 骨架屏
import { MenuData, SearchData, i18n_t, SessionStorage, useMittEmit, MITT_TYPES } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import { api_search } from 'src/api/'
import lodash from "lodash"
const { get_fetch_search_history, get_delete_history_search, get_fetch_hot_search, get_hotselect3 } = api_search || {};
const history_list = ref([])  //搜索历史记录list
const params = { cuid: '' }//查询搜索历史记录的入参
const suggestion_list = ref([]) //搜索建议列表
const show_suggestion = ref(false)  //是否显示搜索建议
const hot_list = ref([]);  //热门搜索列表
const loading = ref(true); // 加载动画
// ...mapGetters([
const get_uid = ref(UserCtr.get_uid()); // userId



// const get_current_menu = ref(); // 当前选中的一级菜单, 二级菜单, 三级菜单
const menu_type = MenuData.menu_type;// 当前选中的主菜单菜单menu_type
const get_newer_standard_edition = UserCtr.standard_edition// 1新手版 2标准版
// 是赛果虚拟体育赛事
const results_of_the_virtual_display = ref(MenuData.is_results_virtual_sports())
// ...mapMutations([ 'set_toast']),
// 获取历史记录接口
function get_history() {
  get_fetch_search_history({ cuid: get_uid.value }).then(({ data }) => {
    history_list.value = data || [];
  })
}
// 删除历史记录
function delete_history(item) {
  let params = {
    cuid: get_uid.value,
    keyword: item ? item.keyword : '',
  };
  // 删除搜索历史
  get_delete_history_search(params).then(({ data }) => {
    let found_i = -1;
    // 历史记录数据源
    history_list.value.forEach((li, i) => {
      if (li.id == item.id) {
        found_i = i;
      }
    });
    if (found_i > -1) {
      history_list.value.splice(found_i, 1);
    } else {
      history_list.value = [];
    }
  }).catch((err) => {
    console.error(err);
  })

}
// 获取数据 搜索结果接口
function get_search_result(skt_upd) {
  // 如果没有搜索文字，则弹框
  if (!lodash.trim(SearchData.search_txt)) {
    //TODO
    set_toast({ 'txt': i18n_t('search.keyword_is_empty'), hide_time: 3000 });
    return;
  }
  // 代表的是 点击 历史搜索 和 热门搜索的模块
  if (skt_upd) {
    useMittEmit(MITT_TYPES.EMIT_SET_IS_HOT_HISTORY, true)
  } else {
    // 请求联想接口数据
    get_suggestion_list()
  }
}
function change_show_content($event) {
  get_history();
  show_suggestion.value = false;
}

// 请求模糊搜索 接口数据
function get_suggestion_list(evt) {
  const get_search_txt = lodash.trim(SearchData.search_txt)
  if (!get_search_txt) {
    suggestion_list.value = [];
    return;
  }
  // 展示骨架屏
  loading.value = true
  // 展示模糊搜索页面
  show_suggestion.value = true
  params.keyword = get_search_txt;
  // 增加参数：分球类搜索
  params.searchSportType = SearchData.cur_csid;  // 联赛的id
  // 如果是赛果 增加参数：分球类搜索
  if (menu_type.value == 28) { params.from = 2; }
  get_hotselect3(params).then(({ code, data }) => {
    loading.value = false
    if (code == 200 && data != null) {
      // 改变里边的 msc 比分
      data.data.bowling && data.data.bowling.forEach((item) => {
        transform_score(item)
      })
      // 改变里边的 msc 比分
      data.data.league && data.data.league.forEach((item) => {
        item.matchList.forEach((main) => {
          transform_score(main)
        })
      })
      // 改变里边的 msc 比分
      data.data.teamH5 && data.data.teamH5.forEach((item) => {
        transform_score(item)
      })
      // 模糊搜索里边的数据源
      suggestion_list.value = data.data || [];
    }
  }).catch((err) => {
    loading.value = false
    console.error(err);
  })
}
// 获取热门搜索
function get_hot_search() {
  get_fetch_hot_search().then(({ data }) => {
    hot_list.value = data || [];
  })
}
/**
 *@description msc比分数组转化为对象
 *@param {Undefined}  val 赛事对象
 *@return {Undefined} undefined
 */
function transform_score(val) {
  if (!val.msc) return;
  let api_msc = val.msc, obj = {};
  if (api_msc.length > 0) {
    for (let i in api_msc) {
      let format = api_msc[i].split("|");
      if (format[1] && format[1].split(":")) {
        obj[format[0]] = {
          home: format[1].split(":")[0],// 获取主队比分
          away: format[1].split(":")[1],// 获取客队比分
        };
      }
    }
  }
  val.msc = obj
}
const search = ref(null);
onMounted(() => {
  if (search.value) {
    search.value.style.height = window.innerHeight - search.value.getBoundingClientRect().top + 'px'
  }
});
// 用户的userid
params.cuid = get_uid.value;
// 标准版或者新手标
params.device = get_newer_standard_edition.value == 2 ? 'v2_h5_st' : 'v2_h5';
// 获取历史记录数据
get_history();
// 获取热门记录数据
get_hot_search();
if (SessionStorage.get('from') == 'category') {
  get_search_result()
} else {
  SearchData.set_search_txt('');
}
// 如果vuex里边 有搜索的记录
if (SearchData.search_term.length > 0) {
  // 展示联想建议页面
  show_suggestion.value = true
} else {
  // 隐藏联想建议页面
  show_suggestion.value = false
}
</script>
<style lang="scss" scoped>
.search {
  max-width: 768px;
  margin: auto;
  //height: 5.37rem;
  height: 4.37rem;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

src/output