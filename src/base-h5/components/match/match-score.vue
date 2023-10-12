
<!--
 * @Author:
 * @Date: 2020-08-20
 * @Description: 详情页所有球种的细节比分展示条
   比分文档：http://lan-confluence.sportxxxr1pub.com/pages/viewpage.action?pageId=12817576
   赛事阶段/状态文档：http://lan-confluence.sportxxxr1pub.com/pages/viewpage.action?pageId=15665390
-->
<template>
  <!-- 详情页所有球种的细节比分展示条 -->
  <!-- 当是赛果页面时蒙版不一致需要隐藏 back_mask属性-->
  <div
    class='match_score '
    :class="$route.name == 'match_result' ? '' : 'back_mask'"
    v-cloak
  >
    <!-- component 自定义标签:动态绑定组件,根据数据的不同更换不同的组件 'is' 关键字用来动态切换组件 -->
    <component
      :is="componentId"
      :detail_data="detail_data"
    ></component>

  </div>
</template>

<script setup>
import { defineComponent, computed, defineAsyncComponent } from 'vue';

const props = defineProps({
  detail_data: {
    type: Object,
    default: () => { }
  },
})
const componentId = computed(() => {
  const id = props.detail_data.csid || 101
  return defineAsyncComponent(() => import(`./score/score-child-${id}.vue`))
})
</script>

<script>
export default defineComponent({
  name: 'match-score',
  // components: {
  //   score_child_1: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-1.vue"),    // 详情页足球比分展示子组件
  //   score_child_2: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-2.vue"),    // 详情页篮球比分展示子组件
  //   score_child_3: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-3.vue"),    // 棒球赛事的细节比分展示
  //   score_child_4: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-4.vue"),    // 冰球赛事的细节比分展示
  //   score_child_5: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-5.vue"),    // 详情页网球比分展示子组件
  //   score_child_6: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-6.vue"),    // 美式足球赛事的细节比分展示
  //   score_child_7: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-7.vue"),    // 斯诺克赛事的细节比分展示
  //   score_child_8: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-8.vue"),    // 兵乓球赛事的细节比分展示
  //   score_child_9: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-9.vue"),    // 排球赛事的细节比分展示
  //   score_child_10: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-10.vue"),  // 羽毛球赛事的细节比分展示
  //   score_child_11: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-11.vue"),  // 详情页手球比分展示
  //   score_child_12: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-12.vue"),  // 详情页拳击比分展示
  //   score_child_13: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-13.vue"),  // 沙滩排球赛事的细节比分展示
  //   score_child_14: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-14.vue"),  // 详情页橄榄球比分展示子组件
  //   score_child_15: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-15.vue"),  // 详情页曲棍球比分展示子组件
  //   score_child_16: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./score/score-child-16.vue")   // 详情页水球比分展示子组件
  // },
})



</script>

<style lang="scss" scoped>
.match_score {
  height: 0.38rem;
  line-height: 0.38rem;
  width: 100%;
}

.back_mask {
  background: linear-gradient(180deg, rgba(0, 0, 0, 8e-05) 0%, rgba(0, 0, 0, 0.8) 100%);
}</style>
