<!--
 * @Author: Cable
 * @Date: 2020-08-04 17:13:55
 * @Description: 赛事级别卡片
-->
<template>
  <!--赛事玩法模板-->
  <div
    class="c-match-card relative-position"
    :id="DOM_ID_SHOW && `list-mid-${mid}`"
    :style="`height:${match_style_obj.total_height}px  !important;width:${vx_get_layout_size.list_content_width}px  !important;`"
    v-if="match_style_obj.is_show_card && match_components_name"
  >
    <component
      v-if="is_mounted && [1,2].includes(match_style_obj.show_level)"
      :is="match_components_name"
      :mid="mid"
      :class="'csid-'+match_style_obj.csid"
    />
    <!-- 调试信息 -->
    <div v-if="test" class="test">{{mid}}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  components:{
    // 玩法模板 0   足球-让球&大小  、 足球-角球 、 美足-让球&大小 、 手球-让球&大小
    matchTpl0After: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_tpl_new_data/match_tpl0_after.vue"),
    // 玩法模板 2   足球-半/全
    matchTpl2After: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_tpl_new_data/match_tpl2_after.vue"),
    // 玩法模板 7   篮球-让球&大
    matchTpl7After: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_tpl_new_data/match_tpl7_after.vue"),
    // 玩法模板 9   网球-让球&大
    matchTpl9After: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_tpl_new_data/match_tpl9_after.vue"),
    // 玩法模板 10  网球-准确盘
    matchTpl10After: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_tpl_new_data/match_tpl10_after.vue"),
    // 玩法模板 12  热门赛事-竟足-让球/胜平
    matchTpl12After: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_tpl_new_data/match_tpl12_after.vue"),
    // 玩法模板 17  棒球-让球&大
    matchTpl17After: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_tpl_new_data/match_tpl17_after.vue"),
    // 玩法模板 18  所有冠军玩法 政治娱
    matchTpl18After: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_tpl_new_data/match_tpl18_after.vue"),
    // 玩法模板 21  足球-比分
    matchTpl21After: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_tpl_new_data/match_tpl21_after.vue"),
    // 玩法模板 24  足球-15分钟
    matchTpl24After: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_tpl_new_data/match_tpl24_after.vue"),

    // 电竞玩法模板
    matchTplesportsAfter: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_tpl_new_data/match_tpl_esports_after.vue"),

  },
  inject:['match_list_card'],
  props:{
    mid: String | Number,
  },
  data(){
    return {
      // 赛事样式对象
      match_style_obj:this.match_list_card.all_card_obj['mid_'+this.mid] || {},
      // 是否显示调试信息
      test:sessionStorage.getItem('wsl'),
      // 组件是否加载完成
      is_mounted: false
    }
  },
  computed:{
    ...mapGetters({
      // 当前菜单类型
      vx_cur_menu_type: "get_cur_menu_type",
      // 页面布局大小信息
      vx_get_layout_size: "get_layout_size",
    }),
    // 赛事模板名称
    match_components_name() {
// console.error( 'this.match_list_card.all_card_obj-----------',this.match_list_card.all_card_obj);

      let {tpl_id = 0} = this.match_style_obj
      // 25 罚牌主盘口
      if([3,5,6,8,19,20,22,23,25].includes(+tpl_id)){
         tpl_id = 2
      }else if([11,16].includes(+tpl_id)){
         tpl_id = 9
      }else if([15].includes(+tpl_id)){
         tpl_id = 10
      }else if([13].includes(+tpl_id)){
        tpl_id = 0
      }
      return `match-tpl${tpl_id}-after`
    }
  },
  created(){
    // 显示部分dom ID
    this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
  },
  mounted(){
    // 异步设置组件是否挂载完成
    setTimeout(()=>{
      this.is_mounted = true
    })
  },
  beforeDestroy(){
    this.match = {}
    this.match_style_obj = null
  },

}
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
