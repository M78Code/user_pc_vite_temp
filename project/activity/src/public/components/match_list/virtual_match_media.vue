<!--
 * @Author: Amor
 * @Date: 2021-12-04 15:57:44
 * @Description: 列表视频icon
-->

<template>
  <div
    class="media-col-wrap"
    :class="get_vsport_params.mid == match.mid && 'active'"
  >
    <!-- 赛事直播 -->
    <div
      class="item"
      @click="on_switch_match()"
      v-if="show_icons.includes('video') && match.mms == 1"
    >
    <!-- 是否选中 -->
      <span class="icon-play q-icon c-icon"  :class="video_is_active && 'active'"></span>
    </div>

    <!-- 统计分析 -->
    <div  v-if="show_icons.includes('statistic') && get_global_switch.statistics_switch" class="item">   
      <!-- 统计图标 -->
      <span class="icon-signal q-icon c-icon relative-position"  @click="click_popup">
        <!-- 统计分析 弹层-->
        <q-menu v-model="is_show" anchor="bottom end" self="top end" :content-class="`tips-body ${popup_class}`">
           <!-- 弹层箭头 -->
          <div class="direction" :class="{'other':match.csid !=1001}"></div>
          <!-- 统计分析主体 -->
          <virtual-match-statistic :match="match" :row_index="match.csid !=1001 ? statistic_mark : -1" :class="['statistic-popup']" />
        </q-menu>
      </span>
       
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import virtualMatchStatistic from "src/public/components/match_list/virtual_match_statistic.vue";

export default {
  components: {
    virtualMatchStatistic,
  },
   props: {
    //赛事详情
    match: Object,
    //赛事索引
    match_index: Number,

    // 需要显示的  icon
    show_icons: {
      type: Array,
      // 视频，统计
      default: () => ["video", "statistic"],
    },
    statistic_mark:{
      type:[Number,String],
      default:""
    }

  },
  data(){
    return {
      // 弹层类
      popup_class: '',
      // 弹层是否显示
      is_show: false
    }
  },
  computed: {
    ...mapGetters({
      // 获取右侧参数
      get_vsport_params: "get_vsport_params",
      //获取页面大小信息
      vx_get_layout_size: "get_layout_size",
        //全局开关
      get_global_switch:'get_global_switch'
    }),
    /**
     * @Description:视频icon是否高亮
     * @return {boolean}
     */
    video_is_active() {
      //当前赛事是滚球  并且  (视频状态=2 或者 动画状态 > -1)
      if (
        this.$utils.get_match_status(this.match.ms) == 1 &&
        (this.match.mms == 2 || this.match.mvs > -1)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  created(){
    this.$root.$on('emit_list_on_scroll', this.on_scroll);
  },
  beforeDestroy(){
    this.$root.$off('emit_list_on_scroll', this.on_scroll);
  },
  methods: {
    ...mapActions({
      set_vsport_params: "set_vsport_params",// 设置虚拟体育右侧
    }),
    /**
     * @Description 列表滚动事件 
     * @param {undefined} undefined
    */
    on_scroll(){
      this.is_show = false
    },
    /**
     * @Description 点击弹层 
     * @param {undefined} undefined
    */
    click_popup(e){
      let height = this.match.csid == 1001 ? 282 : 110
      //元素底部距离浏览器顶部位置
      let bottom = e.target.getBoundingClientRect().bottom
      //获取滚动条宽度
      let margin = this.$utils.getScrollbarWidth()
      //客放位置高度
      let innerHeight = window.innerHeight - margin
      if (bottom + height > innerHeight) {
        this.popup_class = 'style2'
      }else{
        this.popup_class = 'style1'
      }
    },
    /**
     * @Description:切换右侧赛事
     * @return {undefined} undefined
     */
    on_switch_match() {
      this.set_vsport_params({
        mid: this.match.mid,
        csid: this.match.csid,
        tid: this.match.tid,
        batchNo: this.match.batchNo,
        orderNo: this.match.orderNo,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* 列表视频icon 定位及宽度 */
.media-col-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .c-icon {
    font-size: 14px;
  }
  .item {
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>

<style lang="scss">
/*  弹窗样式 */
.tips-body {
  overflow: unset;
  &.style1 {
    transform: translate(10px, 8px);
    .direction {
      top: -12px;
    }
  }
  &.style2 {
    transform: translate(10px, -8px);
    .direction {
      bottom: -12px;
      transform: rotate(180deg);
    }
  }

  /* 箭头 */
  .direction {
    position: absolute;
    left: 220px;
    width: 14px;
    height: 14px;
    border: 7px solid transparent;
    border-bottom: 7px solid #eaeaea;
    //虚拟摩托车等箭头位置
    &.other {
      left: 200px;
    }
  }
  .direction:after {
    position: absolute;
    border-width: 0 5px 5px;
    border-style: solid;
    border-color: transparent transparent #f7f8fa;
    content: "";
    top: 2px;
    left: -5px;
    pointer-events: none;
  }
}
</style>