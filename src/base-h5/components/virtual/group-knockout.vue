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
import group_matches from "src/base-h5/components/virtual/group-matches.vue";
import knockout from "src/base-h5/components/virtual/knockout.vue";
import 'src/base-h5/css/pages/virtual-group-knockout.scss'
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { i18n_t } from "src/core/index.js"

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
    const state = reactive({
      tabIndex: 0,
      tab_list: [
        { index: 0, label: i18n_t('virtual_sports.group_matches'), value: 'group_matches' ,disable: false},
        { index: 1, label: i18n_t('virtual_sports.knockout'), value: 'knockout', disable: false }
      ],
      tabList: [
        {
          name: i18n_t('virtual_sports.group_matches'),
          component: 'group_matches'
        },
        {
          name: i18n_t('virtual_sports.knockout'),
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
        state.height_change = '400px'

        clearTimeout(state.timer)
        state.timer = setTimeout(() => {
          state.height_change = '100%'
        },200)
      }
    );
    // 监听小组赛 淘汰赛的变化
    // #TODO VUEX GETTERS 
    watch(
      () => current_batch.value.mmp,
      (n,o) => {
        const key_list = ['Q8', 'Q4', 'SEMIFINAL', 'FINAL']
        if(key_list.includes(state.current_batch.value.mmp)){
          state.tabIndex = 1
          state.currentContent = 'knockout'
          state.tab_list[0].disable = true
          state.tab_list[1].disable = false
        }else{
          state.tabIndex = 0
          state.currentContent = 'group_matches'
          state.tab_list[0].disable = false
          state.tab_list[1].disable = true
        }
      }
    );
    // 点击菜单切换
    const tab_click = (tab) => {
      if(tab.index==1 && tab.disable) return
      state.tabIndex = tab.index
      state.currentContent = tab.value
    }
    onUnmounted(() => {
      clearTimeout(state.timer)
      state.timer = null

      // #TODO $data 
      // for (const key in state.$data) {
      //   state.$data[key] = null
      // }
    })
    return {
      ...toRefs(state),
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
      //   color: var(--q-gb-t-c-13);

      // }
    }
  }
  :deep(.q-carousel__slide) {
    padding: unset;
  }
}


</style>

