<!--
 * @Description: 筛选+搜索
-->
<template>
  <div class="select-dia" :style="bounced_high">
    <div style="height:.5rem">
      <div class="select-box">
        <div class="row items-center justify-center composite">
          <div class="filter-trn" v-for="(item_name, index) in search_tab" :key="index" @click="change_record(index)"
            v-show="index == 0 || index != 0 && menu_type != 100" :class="get_search_for_choose == index ? 't_color' : ''"
            :style="{ visibility: `${is_search_hide(index) ? 'hidden' : 'visible'}` }">
            {{ item_name }}
          </div>
        </div>
      </div>
    </div>
    <template v-if="change_show && GlobalAccessConfig.get_filterSwitch()">

      <filter_old v-if="menu_type == 1 && get_sport_all_selected" />
      <filter_new v-else />
    </template>
    <search v-if="!change_show && GlobalAccessConfig.get_searchSwitch()"></search>
  </div>
</template>
 
<script setup>
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import filter_new from '../../match-filter/index.vue'
import filter_old from '../../match-filter/index_old.vue'
import search from '../../search/search.vue'

import { onMounted, onUnmounted, ref, watch } from "vue"
import store from "src/store-redux/index.js";
import { i18n_t, MenuData, SearchData } from 'src/output/index.js'
const props = defineProps(['detail_data'])
const { menu_type, get_sport_all_selected } = MenuData;
const change_show = ref(true)
const search_tab = ref([i18n_t('footer_menu.filter'), i18n_t('search.search_title')])
//外层是 v-if 所以直接取就行
const get_search_for_choose = ref(SearchData.search_for_choose);//0筛选 1搜索
const get_curr_sub_menu_type = MenuData.get_current_sub_menuid() //二级菜单id
// 弹框的高度
let rem_1 = window.innerWidth * 100 / 375;
const bounced_high = { height: window.innerHeight - rem_1 + 50 + 'px !important' }

// 是赛果虚拟体育赛事
const results_of_the_virtual_display = MenuData.is_results_virtual_sports()


onMounted(() => {

  // 如果是冠军，则默认展示筛选
  if (menu_type.value == 100) {
    change_record(0)
  } else {
    // 默认选中筛选
    change_record(get_search_for_choose.value)
  }
  // 如果是赛果虚拟体育赛事，则显示 筛选
  // 筛选
  if (results_of_the_virtual_display || !GlobalAccessConfig.get_filterSwitch()) {
    search_tab.value = [i18n_t('search.search_title')]
    change_show.value = false
  }
  // 搜索
  if (!GlobalAccessConfig.get_searchSwitch()) {
    search_tab.value = [i18n_t('footer_menu.filter')]
    change_show.value = true
  }
})
const change_record = (key) => {
  //搜索返回时，保持搜索原来的页面
  key == 0 && SearchData.search_term && SearchData.set_search_term('')
  get_search_for_choose.value = key;
  SearchData.set_search_for_choose(key);
  if (key === 1) {// 赛事搜索页
    change_show.value = false
  } else {
    change_show.value = true
  }
}
const is_search_hide = (i) => {
  return i == 1 && [1001, 1002, 1011, 1004, 1010, 1009].includes(get_curr_sub_menu_type)
}
</script>
 
<style scoped lang="scss">
@import url("src/base-h5/css/pages/select-dia.scss");

.select-dia {
  width: 100%;
  max-width: unset !important;
  /*  兼容性问题,高度的调整影响到安卓手机的软键盘弹出 */
  max-height: calc(var(--vh, 1vh) * 100 - 80px) !important;
  border-radius: 0.16rem 0.16rem 0 0;
  position: absolute;
  bottom: 0;

  .select-box {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 999;
    border-radius: 0.16rem 0.16rem 0 0;

    .composite {
      width: 60%;
      height: 0.5rem;
      margin: 0 auto;

      .filter-trn {
        margin-right: 0.2rem;
        font-size: 0.16rem;
        font-weight: 300;

        &:last-child {
          margin-right: 0;
        }

        &.t_color {
          position: relative;
          letter-spacing: 0;
          font-weight: bold;

          &:after {
            content: '';
            display: block;
            position: absolute;
            width: 0.18rem;
            height: 0.03rem;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 0.65rem;
          }
        }
      }
    }
  }
}
</style>