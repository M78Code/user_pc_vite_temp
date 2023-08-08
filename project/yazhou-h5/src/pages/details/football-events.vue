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
import { mapGetters } from "vuex";
export default {
  name: 'football_events',
  data() {
    return {
      is_shoe: false,  // 是否显示
      obj: {
        t1: 0,
        t2: 0,
        secondsFromStart: '',
        homeAway: ''
      }, // ws数据对象
    };
  },
  created () {
    // 延时器
    this.timer = null;
  },

  components: {},

  computed: {
    ...mapGetters(['get_detail_data', 'get_is_hengping', 'get_is_full_screen']),
    calc_name() {
      let { man, mhn } = this.get_detail_data
      return this.obj.homeAway == 'home' ? man : mhn
    },
    calc_time() {
      let a = Math.floor(this.obj.secondsFromStart / 60), b = ('' + this.obj.secondsFromStart % 60).padStart(2, 0)
      return `${a}'${b}'`
    }
  },

  mounted() {
    this.$root.$on(this.emit_cmd.EMIT_FOOTBALL_EVENTS, this.football_events_handle);
  },

  methods: {
    /**
     *@description ws处理函数
     *@param {Object} obj ws数据对象
     */
    football_events_handle(obj) {
      this.obj = obj
      this.is_shoe = true
      this.timer = setTimeout(() => {
        this.is_shoe = false
      }, 6000);
    }
  },
  beforeDestroy() {
    this.$root.$off(this.emit_cmd.EMIT_FOOTBALL_EVENTS, this.football_events_handle);
    clearTimeout(this.timer)
    this.timer = null
  }
}

</script>
<style lang="scss" scoped>
.football-events {
  width: 25vw;
  width: max-content;
  max-width: 50vw;
  color: var(--q-color-com-fs-color-8);
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
