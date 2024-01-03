<!--
 * @Description: 虚拟体育 小组赛淘汰赛页面 只需要传个 tid 联赛id进来
-->
<template>
  <div class="group_knockout">
    <div class="row justify-center tabs hairline-border">
      <div v-for="(item, index) in tab_list" :key="index"
           :class="[tabIndex == index ? 'is-active' : '']"
           @click="tab_click(item)"
      >
        {{item.label}}
      </div>
    </div>
    <q-carousel
      v-model="currentContent"
      transition-prev="slide-right"
      transition-next="slide-left"
      :swipeable="false"
      animated
      :height="height_change"
    >
      <q-carousel-slide :name="item.component" v-for="(item,i) in tabList" :key="i">
        <!-- 顶部切换 下边的内容组件 -->
        <component :is="item.component" :tid="tid" :current_match = "current_match"/>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>
<script>
import group_knockout_mixin from "src/base-h5/vr/mixin/virtual_sports/pages/virtual/virtual_sports_part/group_knockout_mixin.js";
import group_matches from "src/base-h5/vr/pages/virtual/virtual_sports_part/group_matches.vue";
import knockout from "src/base-h5/vr/pages/virtual/virtual_sports_part/knockout.vue";
export default {
  mixins:[group_knockout_mixin],
  name:'virtual_sports_part',
  components: {
    group_matches: group_matches,
    knockout: knockout,
  },
}
</script>

<style lang="scss" scoped>
.group_knockout {
  
  // background-color: #F8F9FA;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .tabs {
    // width: 3.52rem;
    width: 98vw;
    height: 0.4rem;
    margin: 0.11rem 0 0.05rem 0;
    border-radius: 0.08rem;
    position: relative;
    background-color: var(--q-gb-bg-c-29);
    color: #7981A4;
    
    display: flex;
    flex-direction: row;
    align-items: center;

    > div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.14rem;
      // background-color: orange;


      &:nth-child(1) {
        border-radius: 0.08rem 0 0 0.08rem;
      }

      &:nth-child(2) {
        border-radius: 0 0.08rem 0.08rem 0;
      }

      &.is-active {
        // background: var(--q-color-page-bg-color-9);
        color: var(--q-color-fs-color-6);
        background-color: var(--q-gb-bg-c-28);
        border-radius: 0.08rem;
        height: 0.36rem;
        color: #303442;
      }
    }
  }
  :deep(.q-carousel__slide) {
    padding: unset;
    // background: var(--q-gb-bg-c-18);
  }
}
:deep(.q-carousel){
  background: var(--q-gb-bg-c-18);
}

</style>

