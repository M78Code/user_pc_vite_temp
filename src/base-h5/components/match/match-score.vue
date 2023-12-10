
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
const id = props.detail_data.csid || 101
const componentId = defineAsyncComponent(() => import(`./score/score-child-${id}.vue`))
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
