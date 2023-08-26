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
// #TODO VUEX 
// import {mapGetters} from "vuex";
import group_matches from "project_path/pages/virtual/virtual_sports_part/group_matches.vue";
import knockout from "project_path/pages/virtual/virtual_sports_part/knockout.vue";

import { reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
export default defineComponent({
  name: "group_knockout",
  props:{
    tid: {
      type: Number|String,
      default: null,
      require: true
    },
    current_match:Object,
  },
  components: {
    group_matches: group_matches,
    knockout: knockout,
  },
  
  setup(props, evnet) {
    const component_data = reactive({
      tabIndex: 0,
      tab_list: [
        { index: 0, label: i18n.t('virtual_sports.group_matches'), value: 'group_matches' ,disable: false},
        { index: 1, label: i18n.t('virtual_sports.knockout'), value: 'knockout', disable: false }
      ],
      tabList: [
        {
          name: i18n.t('virtual_sports.group_matches'),
          component: 'group_matches'
        },
        {
          name: i18n.t('virtual_sports.knockout'),
          component: 'knockout'
        }
      ],
      currentContent: 'group_matches',
      height_change: '100%'
    });
    // #TODO VUEX 
    // computed: {
    //   ...mapGetters({
    //     current_batch:'get_current_batch'
    //   }),
    // },
    const current_batch = computed(() => {
      return ""
    });
    watch(
      () => data.currentContent,
      () => {
        component_data.height_change = '400px'

        clearTimeout(component_data.timer)
        component_data.timer = setTimeout(() => {
          component_data.height_change = '100%'
        },200)
      }
    );
    // 监听小组赛 淘汰赛的变化
    // #TODO VUEX GETTERS 
    watch(
      () => current_batch.value.mmp,
      (n,o) => {
        const key_list = ['Q8', 'Q4', 'SEMIFINAL', 'FINAL']
        if(key_list.includes(component_data.current_batch.value.mmp)){
          component_data.tabIndex = 1
          component_data.currentContent = 'knockout'
          component_data.tab_list[0].disable = true
          component_data.tab_list[1].disable = false
        }else{
          component_data.tabIndex = 0
          component_data.currentContent = 'group_matches'
          component_data.tab_list[0].disable = false
          component_data.tab_list[1].disable = true
        }
      }
    );
    // 点击菜单切换
    const tab_click = (tab) => {
      if(tab.index==1 && tab.disable) return
      component_data.tabIndex = tab.index
      component_data.currentContent = tab.value
    }
    onUnmounted(() => {
      clearTimeout(component_data.timer)
      component_data.timer = null

      // #TODO $data 
      // for (const key in component_data.$data) {
      //   component_data.$data[key] = null
      // }
    })
    return {
      ...toRefs(component_data),
      tab_click,
      current_batch
    }
  }
})
</script>

<style lang="scss" scoped>
.group_knockout {
  .tabs {
    height: 0.4rem;
    margin: 0.11rem 0 0.05rem 0;
    border-radius: 0.08rem;
    position: relative;

    > div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.14rem;

      &:nth-child(1) {
        border-radius: 0.08rem 0 0 0.08rem;
      }

      &:nth-child(2) {
        border-radius: 0 0.08rem 0.08rem 0;
      }

      // &.is-active {
      //   background: var(--q-color-page-bg-color-9);
      //   color: var(--q-color-fs-color-6);

      // }
    }
  }
  ::v-deep.q-carousel__slide {
    padding: unset;
  }
}


</style>

