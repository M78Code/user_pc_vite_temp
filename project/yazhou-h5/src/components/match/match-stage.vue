<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 下拉列表赛事时间展示
-->
<template>
  <div class="match_stage">
      <span v-if="!['result_details', 'match_result'].includes($route.name)">
        <!-- 赛事未开赛 -->
        <span v-if="detail_data.ms == 0">
          <span v-if="!one_hour" >
            <!-- 距离开赛时间大于1小时 显示月和日 -->
            <!-- {{(new Date(+detail_data.mgt)).Format(i18n_t('time3'))}} -->
            {{utils.format_time_zone(+detail_data.mgt).Format(i18n_t('time3'))}}
          </span>
        </span>

        <span v-else-if="detail_data.ms == 3">
          <span v-if="detail_data.csid == 1 || detail_data.csid == 2">
            {{i18n_t('match_info.match_over')}}
          </span>
          <span v-else>
            {{i18n_t('match_info.match_end')}}
          </span>
        </span>

        <span v-else-if="detail_data.ms == 110">
          {{i18n_t(`ms[${detail_data.ms}]`)}}
        </span>
        <span v-else>
          <!-- 显示 赛事阶段和赛事时间 -->
          <component :is="componentId" :detail_data="detail_data" :dialog="dialog"></component>
        </span>
      </span>
      <span v-else>
        {{i18n_t('match_info.match_end')}}
      </span>
  </div>
</template>

<script>
import stage_child_1 from "./stage/stage-child-1.vue";  // 详情页显示足球赛事第几节以及赛事时间
import stage_child_2 from "./stage/stage-child-2.vue";  // 详情页显示篮球赛事第几节以及赛事时间
import stage_child_3 from "./stage/stage-child-3.vue";  // 详情页显示棒球赛事第几节以及赛事时间
import stage_child_4 from "./stage/stage-child-4.vue";  // 详情页显示冰球赛事第几节以及赛事时间
import stage_child_5 from "./stage/stage-child-5.vue";  // 详情页显示网球赛事第几节以及赛事时间
import stage_child_6 from "./stage/stage-child-6.vue";  // 详情页显示美式足球赛事第几节以及赛事时间
import stage_child_7 from "./stage/stage-child-7.vue";  // 详情页显示斯诺克赛事第几节以及赛事时间
import stage_child_8 from "./stage/stage-child-8.vue";  // 详情页显示兵乓球赛事第几节以及赛事时间
import stage_child_9 from "./stage/stage-child-9.vue";  // 详情页显示排球赛事第几节以及赛事时间
import stage_child_10 from "./stage/stage-child-10.vue";  // 详情页显示羽毛球赛事第几节以及赛事时间
import stage_child_11 from "./stage/stage-child-11.vue";  // 详情页手球赛事阶段+赛事时间
import stage_child_12 from "./stage/stage-child-12.vue";  // 详情页拳击赛事阶段
import stage_child_13 from "./stage/stage-child-13.vue";  // 详情页显示沙滩排球赛事第几节以及赛事时间
import stage_child_14 from "./stage/stage-child-14.vue";  // 详情页橄榄球赛事阶段+赛事时间
import stage_child_15 from "./stage/stage-child-15.vue";  // 详情页显示曲棍球赛事阶段及赛事时间
import stage_child_16 from "./stage/stage-child-16.vue";  // 详情页显示水球赛事第几节以及赛事时间
import stage_child_101 from "./stage/stage-child-101.vue";  // 详情页 电竞第几局 以及 赛事时间
// import {mapGetters} from "vuex";
import { utils } from 'src/core/utils/index.js';

export default {
  name: "match_stage",
  data() {
    return {
      // 时间显示
      one_hour: false,
      utils
    };
  },
  computed: {
    // ...mapGetters([
    //   "get_menu_type",
    // ]),
    componentId() {
      if (get_menu_type != 3000) {
        return `stage_child_${detail_data.csid}`
      } else {
        return `stage_child_101`;
      }
    }
  },
  watch: {
    // 监听detail_data的值,数据发生变化时,执行initEvent方法
    detail_data:{
      // 值可以为methods的方法名
      handler:'initEvent',
      // 深入监听
      deep:true,
      // 以当前的初始值执行handler的函数
      immediate:true
    }
  },
  props: ["detail_data","dialog"],

  created() {
    // 监听match_nostart事件
    $root.$on(emit_cmd.EMIT_MATCH_NOSTART,initEvent);
  },
  components: {
    stage_child_1,
    stage_child_2,
    stage_child_3,
    stage_child_4,
    stage_child_5,
    stage_child_6,
    stage_child_7,
    stage_child_8,
    stage_child_9,
    stage_child_10,
    stage_child_11,
    stage_child_12,
    stage_child_13,
    stage_child_14,
    stage_child_15,
    stage_child_16,
    stage_child_101,
  },
  destroyed() {
    // 组件销毁,关闭监听
    $root.$off(emit_cmd.EMIT_MATCH_NOSTART);
  },
  methods: {
    // 计算bool的值 控制是否显示赛事时间
    initEvent(){
      // 当前时间
      let now = new Date().getTime();
      // 赛事开始时间-当前时间 小于一小时并且大于0时为true
      let bool = (+detail_data.mgt - now < 3600 * 1000) && (detail_data.mgt - now > 0)? true: false;
      one_hour = bool;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
