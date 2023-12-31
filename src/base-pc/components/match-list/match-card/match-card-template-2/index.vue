<template>
  <!--赛事玩法模板-->
  <div v-show="false">{{ LayOutMain_pc.layout_version }}</div>
  <div v-show="false">{{ MatchListCardDataClass.list_version }}</div>
  <div class="c-match-card relative-position" :id="`list-mid-${mid}`" v-if="match_style_obj.is_show_card"
    :style="`height:${lodash.get(match_style_obj, `total_height`)}px !important;
            width:${LayOutMain_pc.oz_layout_content - LayOutMain_pc.oz_right_width - LayOutMain_pc.oz_left_width}px  !important;`">
    <!--改成101用来打包调试-->
    <!-- <div class="test">{{ match_style_obj.offset_top }}----{{ match_style_obj.show_level }}</div> -->
    <component :is="`MatchTpl${get_current_template_number()}After`"  :mid="mid" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, provide,inject } from 'vue';
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
import { get_match_template_id } from 'src/core/match-list-pc/match-handle-data.js';
// 玩法模板 101 欧洲版 常规赛事
import { MatchTpl101AfterFullVersionWapper as MatchTpl101After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-101-after/index.js";
// 欧洲版 冠军模板
import { MatchTpl118AfterFullVersionWapper as MatchTpl118After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-118-after/index.js";
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
    const get_match_item = (mid) => {
      return MatchListData.get_quick_mid_obj(mid)
    }
    provide("match",MatchListData.get_quick_mid_obj_ref(props.mid))
    // 赛事样式对象
    let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(props.mid)
    const match = get_match_item(props.mid)
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
      match_style_obj,
      is_mounted,
      LayOutMain_pc,
      MatchListCardData,
      MatchListCardDataClass,
      match,
      get_match_item,
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