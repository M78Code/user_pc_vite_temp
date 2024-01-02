<!--
 * @Author: Router
 * @Description: 详情页视频横屏，全屏状态下，实时事件的展示（目前只有足球的进球事件）
-->
<template>
  <div class="football-events  yb_ml10 fullscreen" :class="{'football-events2':is_shoe && get_is_hengping && get_is_full_screen}">
    <div class="img-wrap yb_mb10 yb_ml4"></div>
    <div class="info-wrap yb_px4 yb_py4 relative-position">
      <p class="row justify-between yb">
        <span style="flex:1" class="ellipsis yb_mr8">{{calc_name}} ({{obj.t1 + '-' + obj.t2}})</span>
        <span style="width:0.36rem" class="text-right">{{calc_time}}</span>
      </p>
    </div>
  </div>
</template>

<script>
// #TODO VUEX
// import { mapGetters } from "vuex";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { reactive,defineComponent, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
export default defineComponent({
  name: "football_events",

  setup(props, evnet) {
    let data = reactive({
      emitters: [],
      is_shoe: false,  // 是否显示
      obj: {
        t1: 0,
        t2: 0,
        secondsFromStart: '',
        homeAway: ''
      }, // ws数据对象
    });
    onMounted(() => {
      // 延时器
      timer = null;

      // 原 mounted
      // #TODO $root
      data.emitters = [
        useMittOn(MITT_TYPES.EMIT_FOOTBALL_EVENTS, football_events_handle).off,
      ]
      // useMittOn(MITT_TYPES.EMIT_FOOTBALL_EVENTS, football_events_handle);
    },);
    // #TODO vuex
    // computed: {
    // ...mapGetters(['get_detail_data', 'get_is_hengping', 'get_is_full_screen']),
    const get_detail_data = computed(() => {
      return {}
    });
    const get_is_hengping = computed(() => {
      return ""
    });
    const get_is_full_screen = computed(() => {
      return ""
    });
    const calc_name = computed(() => {
      let { man, mhn } = get_detail_data
      return data.obj.homeAway == 'home' ? man : mhn
    });
    const calc_time = computed(() => {
      let a = Math.floor(data.obj.secondsFromStart / 60), b = ('' + data.obj.secondsFromStart % 60).padStart(2, 0)
      return `${a}'${b}'`
    });

    let timer = null;
    /**
     *@description ws处理函数
     *@param {Object} obj ws数据对象
     */
    const football_events_handle = (obj) => {
      data.obj = obj
      data.is_shoe = true
      timer = setTimeout(() => {
        data.is_shoe = false
      }, 6000);
    };
    onUnmounted(() => {
      // #TODO $root
      data.emitters.map((x) => x())
      clearTimeout(timer)
      timer = null
    })
    return {
      ...toRefs(data),
      calc_name,
      calc_time,
      get_detail_data,
      get_is_hengping,
      get_is_full_screen,
      football_events_handle
    }
  }
})
</script>
<style lang="scss" scoped>
.football-events {
  width: 25vw;
  width: max-content;
  max-width: 50vw;
  color: var(--q-gb-t-c-18);
  margin-top: 0.44rem;
  display: none;
}

.football-events2 {
  display: block;
}

.info-wrap {
  background-color: var(--q-color-com-bg-color-35);
  border-radius: 4px;

  &::before {
    content: '';
    position: absolute;
    width: 0.08rem;
    height: 0.08rem;
    transform: rotate(45deg);
    background-color: var(--q-color-com-bg-color-12);
    left: 0.1rem;
    top: -0.04rem;
    background-color: inherit;
  }
}

.img-wrap {
  width: 0.2rem;
  height: 0.2rem;
  background: var(--q-color-com-img-bg-138) no-repeat -0.8rem 0 / 1.6rem 0.2rem;
}
</style>
