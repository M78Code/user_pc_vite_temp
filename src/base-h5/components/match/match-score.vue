
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
    :class="route.name == 'match_result' ? '' : 'back_mask'"
    v-cloak
  >
    <!-- mng 是否中立场 1:是中立场，0:非中立场 --- 仅足球 -->
    <template v-if="project_name == 'app-h5' && ['result_details', 'match_result'].includes(route.name)">
      <span v-if="![5, 10, 7, 8, 13].includes(Number(detail_data.csid)) && detail_data.mng * 1"
        class="tag">
        N
      </span>
    </template>
    
    <!-- component 自定义标签:动态绑定组件,根据数据的不同更换不同的组件 'is' 关键字用来动态切换组件 -->
    <component
      :is="componentId"
      :detail_data="detail_data"
    ></component>

  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import {project_name } from 'src/output/module/constant-utils-common.js'
import { useRoute } from "vue-router";
let route = useRoute()
const props = defineProps({
  detail_data: {
    type: Object,
    default: () => { }
  },
})
let componentId = null
const id = props.detail_data.csid || 101
if(id != 100 && id != 101){
 componentId = defineAsyncComponent(() => import(`./score/score-child-${id}.vue`))
}

</script>
<style lang="scss" scoped>
.match_score {
  // height: 0.38rem;
  // line-height: 0.38rem;
  width: 100%;
  display: flex;
  align-items: center;
}

.back_mask {
  // background: linear-gradient(180deg, rgba(0, 0, 0, 8e-05) 0%, rgba(0, 0, 0, 0.8) 100%);
}

.tag{
  border: 1px solid var(--q-gb-bg-c-15);
  height: .15rem;
  width: .15rem;
  border-radius: .03rem;
  text-align: center;
  line-height: .15rem;
  color: var(--q-gb-bg-c-15);
}


</style>
