<template>
  <!--赛事玩法模板-->
  <div v-show="false">{{ LayOutMain_pc.layout_version }}</div>
  <!-- 数据模版调试 -->
  <div class="c-match-card relative-position" :id="`list-mid-${mid}`" v-if="match_style_obj.is_show_card"
    :style="`height:${match_style_obj?.total_height}px !important;
                                        width:${LayOutMain_pc.oz_layout_content - LayOutMain_pc.oz_right_width - LayOutMain_pc.oz_left_width}px  !important;`">
    <div  v-show="GlobalAccessConfig.get_wsl()" style="position:absolute;color:red">{{ match.mid }}-{{ match.csid }}-{{
      match_style_obj.view_tpl_id }}-{{ match_style_obj.data_tpl_id }}-{{ match_style_obj.show_level }}-
    </div>
    <component :is="`MatchTpl${get_current_template_number()}After`" :mid="mid" />
  </div>
</template>

<script>
import { ref, onMounted, computed, onUnmounted, provide, inject } from 'vue';
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import {GlobalAccessConfig } from "src/output/index.js";
import { LayOutMain_pc } from "src/output/project/common/pc-common.js";
import { get_match_template_id } from 'src/core/match-list-pc/match-handle-data.js';
// 玩法模板 101 欧洲版 常规赛事
import { MatchTpl101AfterFullVersionWapper as MatchTpl101After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-101-after/index.js";
// 欧洲版 冠军模板
import { MatchTpl118AfterFullVersionWapper as MatchTpl118After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-118-after/index.js";
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import { get_match_to_map_obj } from 'src/core/match-list-pc/match-handle-data.js'
export default {
  props: {
    mid: {
      type: [String, Number],
      default: () => null,
    },
  },
  components: {
    MatchTpl101After,
    MatchTpl118After
  },
  setup(props) {
    const MatchListData = inject("MatchListData")
    const match = MatchListData.get_quick_mid_obj_ref(props.mid)
    let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(props.mid)
    const match_list_tpl_size = computed(() => {
      return MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`].width_config
    })
    const match_tpl_info = computed(() => {
      return MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id || match.value.tpl_id}_config`]
    })
    //非坑位对象
    const not_hn_obj_map = computed(() => {
      const _not_hn_obj_map = get_match_to_map_obj(match.value, null); //非坑位对象
      return _not_hn_obj_map
    })
    provide("match", match)
    provide("match_list_tpl_size", match_list_tpl_size)
    provide("match_style_obj", match_style_obj)// 赛事样式对象
    provide("match_tpl_info", match_tpl_info)// 赛事样式对象
    provide("not_hn_obj_map", not_hn_obj_map)

    //101号模板 默认就是 101的宽高配置 不会改变
    const get_current_template_number = () => {
      let tpl_id = get_match_template_id(match);
      if (tpl_id == 118) {
        return 118
      } else {
        return 101
      }
    }
    // 组件是否加载完成
    const is_mounted = ref(true);
    // 显示部分dom ID
    // this.DOM_ID_SHOW = window.BUILDIN_CONFIG.DOM_ID_SHOW;
    onMounted(() => {
      // 异步设置组件是否挂载完成
      // setTimeout(()=>{
      //   is_mounted.value = true
      // })
    })
    onUnmounted(() => {
      match_style_obj = null
    })
    return {
      GlobalAccessConfig,
      match_style_obj,
      is_mounted,
      LayOutMain_pc,
      MatchListCardData,
      MatchListCardDataClass,
      match,
      get_current_template_number,
    }
  }
}

// const props = defineProps({
//   mid: {
//     type: [String, Number],
//     default: () => null,
//   },
// })
</script>

<style lang="scss" scoped>
.c-match-card {
  overflow: hidden;
  border-bottom: 1px solid var(--q-gb-bd-c-2);

  .test {
    position: absolute;
    color: red;
    font-size: 14px;
    z-index: 999999;
    left: 0;
    bottom: 0;
    user-select: text;
  }
}
</style>