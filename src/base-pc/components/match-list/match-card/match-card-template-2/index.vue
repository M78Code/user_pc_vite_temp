<template>
  <!--赛事玩法模板-->
  <div v-show="false">{{ LayOutMain_pc.layout_version}}</div>
  <div
    class="c-match-card relative-position"
    :id="`list-mid-${mid}`"
    :style="cardStyle"
  >
  <div v-show="false">{{ MatchListCardDataClass.list_version }}</div>
  <!--改成101用来打包调试--> 
    <component
      :is="`MatchTpl${101}After`" 
      :mid="mid"
    />
    <!-- {{`MatchTpl${match_style_obj.view_tpl_id}After`}} -->
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { LayOutMain_pc } from "src/core/index.js";

// // // 玩法模板 101 欧洲版
import { MatchTpl101AfterFullVersionWapper as MatchTpl101After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-101-after/index.js";
// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
export default {
  props: {
    mid: {
      type: [String, Number],
      default: () => null,
    },
  },
  components: {
    MatchTpl101After
  },
  setup(props) {
    // 赛事样式对象
    let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(props.mid)
    // 组件是否加载完成
    const is_mounted = ref(true);

    //将太长的行内样式优化
    const cardStyle = computed(()=>{
      const width = LayOutMain_pc.layout_content_width - 15;
      const height = lodash.get(match_style_obj, `total_height`);

      return {
        width: `${width}px`,
        height: `${height}px`,
      }
    })

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
      cardStyle
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
