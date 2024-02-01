<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 中立场赛事展示
-->
<template>
  <div class="team-text">
    <!-- mng 是否中立场 1:是中立场，0:非中立场 --- 仅足球, 复刻版不需要这个中立图标 -->
    <span class="style_icon" v-if="detail_data.mng == 1&&project_name!='app-h5'">
      <img :src="`${project_name}/image/svg/zhonglichang.svg`" alt />
    </span>
    <span v-if="detail_data.ms != 110" class="base-header-font">
      <!-- 赛事阶段 1、足球；2、篮球；3、棒球；4、冰球；5、网球；6、美足； 7、斯诺克； 8、乒乓球；9、排球； 10、羽毛球； 11、手球； 12、拳击； 13、沙滩排球 -->
      <match-stage :detail_data="detail_data"></match-stage>
         <!-- mng 是否中立场   1:是中立场，0:非中立场 复刻版在用，其他版本如有冲突判断一下-->
      <span  class="midfield-container" v-if="![5, 10, 7, 8, 13].includes(Number(detail_data.csid)) && detail_data.mng * 1"  >N</span>
    </span>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";
import { project_name } from "src/output/index.js"
import matchStage from "src/base-h5/components/match/match-stage.vue";   // 下拉列表赛事时间展示
const props = defineProps(['detail_data'])
</script>

<script>
export default defineComponent({
  name: "team-text",
})
</script>

<style lang="scss" scoped>
.team-text {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.style_icon {
  position: relative;
  top: 0.14rem;
  margin-right: 0.05rem;

  img {
    width: 0.12rem;
  }
}

.base-header-font {
  position: relative;
  font-size: 0.12rem;
  color: #FFFFFF;
  letter-spacing: 0;
  top: 0.32rem;
  display: flex;
  align-items: center;
}
.midfield-container{
  background-color: var(--q-gb-t-c-1);
  font-size: 0.12rem;
  color: #FFFFFF;
  display: inline-block;
  padding: 0 2px;
  height: 0.12rem;;
  line-height:0.12rem; 
  //  margin-left:  0.16rem;
  margin-bottom:  0.02rem;
  border-radius: 0.04rem;;
}
</style>