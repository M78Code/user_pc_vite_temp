<template>
  <!-- 菜单项 -->
  <div v-show="layout_left_show == 'menu'" class="menu-wrap">

    <!-- 现场滚球盘 -->
    <div @click="new_menu_click(1)" class="menu-item menu-top menu-roll menu-border" style="margin-bottom:0px"
      :class="menu_config.menu_root == 1 && 'active'">
      <!-- 现场滚球盘 -->
      <img class="hot-icon" :src="play_match" />
      <div class="col">
        现场滚球盘
        <!-- {{ i18n.t("common.in_plays") }} -->
      </div>

      <div class="col-right">
        <span class="match-count yb-family-odds">{{ menu_config.menu_root_count.mi_1 }}</span>
      </div>
    </div>

    <!-- 热门赛事 -->
    <div v-if="menu_config.add_mi_introduce.mi_500.label && get_global_switch.hot_match_num" @click="new_menu_click(500)"
      class="menu-item menu-top menu-play menu-border" :class="menu_config.menu_root == 500 && 'active'"
      :id="DOM_ID_SHOW && `menu-${menu_config.add_mi_introduce.mi_500.label}`">
      <!-- 热门赛事图标 -->
      <img class="hot-icon" :src="hot_svg" />
      <div class="col">
        热门赛事
        <!-- {{ i18n.t("menu.match_hot") }} -->
      </div>
      <div class="col-right">
        <!-- 热门赛事数量 -->
        <span class="match-count yb-family-odds">{{ menu_config.menu_root_count.mi_500 }}</span>
      </div>
    </div>

    <div style="display: none;">{{ base_data_instance.base_data_version }}</div>
    <!-- 体育菜单 -->
    <menu-wapper use_component_key="PcMenuTemplate1" :base_data="base_data_instance"
      :version="base_data_instance.base_data_version"></menu-wapper>


  </div>
</template>

<script setup>

import { ref, reactive } from 'vue'
import { useRouter } from "vue-router";

import store from "src/store-redux/index.js";
import menu_config from 'src/core/menu-pc/menu-data-class.js'
import base_data_instance from 'src/core/utils/base-data/base-data.js'
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'

import play_match from "/public/yazhou-pc/image/png/play-match.png";
import hot_svg from "/public/yazhou-pc/image/svg/hot.svg"

import { MenuWapper } from "src/components/menu";

const {
  layoutReducer,
  globalReducer
} = store.getState()

const router = useRouter()

const props = defineProps({
  // 自动化测试
  DOM_ID_SHOW: {
    type: Boolean,
    default: () => false,
  },
})

// 菜单布局信息
const layout_left_show = reactive(layoutReducer.layout_left_show)
// 当前菜单类型
const get_global_switch = ref(globalReducer.global_switch)
/**
 * 新菜单点击
 */
const new_menu_click = root => {
  // if(!['101201','101',].includes(root) ){
  //   set_unfold_multi_column(false)
  // }
  let mid_menu_show = {}

  let lv2_mi = ''
  if (root == 1) {
    mid_menu_show.list_filter = true
    // 滚球 默认全部
    lv2_mi = 1
  } else if (root == 500) {
    mid_menu_show.list_filter_hot = true
    // 热门默认赛事
    let mi_500_obj = base_data_instance.mew_menu_list_res.find((x) => x.mi == 500) || {
      sl: [],
    };
    // 热门赛事有值的
    let { mi } = mi_500_obj['sl'].find(item => item.ct)
    lv2_mi = mi
  }
  // 清除数据 和 重置收藏
  set_route_url()

  let params = {
    root: root,
    lv1_mi: '',
    lv2_mi,
    sports: '',
    guanjun: "",
  };
  // 设置 中间 菜单输出
  menu_config.set_mid_menu_result(params);

  // 设置 左侧菜单 
  menu_config.set_left_menu_result({
    root: root,
    lv1_mi: '',
    lv2_mi,
    sports: '',
    guanjun: "",
    mid_menu_show,
    has_mid_menu: true,
  })

}

/**
 * 详情页回首页
*/
const set_route_url = () => {
  let { name } = router
  if (['details', 'search', 'video', 'virtual_details'].includes(name)) {
    router.push({ path: '/home' })
  }
  useMittEmit(MITT_TYPES.EMIT_LAYOUT_LIST_TYPE, 'match')
}

</script>