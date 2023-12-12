<!--
 * @Author: ledron
 * @Date: 2020-12-27 17:13:55
 * @Description: 虚拟体育淘 小组赛淘汰赛页面 只需要传个 tid 联赛id进来
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
import VR_CTR from "src/base-h5/vr/store/virtual_sports/virtual_ctr.js"
import group_matches from "src/base-h5/vr/pages/virtual/virtual_sports_part/group_matches.vue";
import knockout from "src/base-h5/vr/pages/virtual/virtual_sports_part/knockout.vue";

export default {
  name: "virtual_sports_part",
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
  data() {
    return {
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
    }
  },
  created() {

  },
  mounted() {
  },
  watch: {
    currentContent() {
      this.height_change = '400px'

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.height_change = '100%'
      },200)
    },
    // 监听小组赛 淘汰赛的变化
    'current_batch.mmp': {
      handler(n,o){
        const key_list = ['Q8', 'Q4', 'SEMIFINAL', 'FINAL']
        if(key_list.includes(this.current_batch.mmp)){
          this.tabIndex = 1
          this.currentContent = 'knockout'
          this.tab_list[0].disable = true
          this.tab_list[1].disable = false
        }else{
          this.tabIndex = 0
          this.currentContent = 'group_matches'
          this.tab_list[0].disable = false
          this.tab_list[1].disable = true
        }
      },
      immediate: true,
      deep: true
    },
  },
  computed: {
    current_batch(){
      return VR_CTR.get_current_batch();
    }
  },
  methods: {
    // 点击菜单切换
    tab_click(tab) {
      if(tab.index==1 && tab.disable) return
      this.tabIndex = tab.index
      this.currentContent = tab.value
    }
  },
  destroyed() {
    clearTimeout(this.timer)
    this.timer = null

    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
};
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

