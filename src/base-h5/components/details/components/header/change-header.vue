<template>
  <div class="change-header">
    <div class="bg-wrap" :style="get_menu_type == 3000 ? URL.gaming_type[detail_data.csid] :ballTypeBackground">
    </div>
    <div class="h-row row mx-15">
        <!-- 返回按钮 --> 
        <div class="col-1 go-back-container" @click="go_where({back_to: 'go_back_from_mini_header',route,router})">
          <div class="go-back"></div>
        </div>
        <!-- 主队名称 -->
        <div class="col-2 text-left ellipsis base-header-font">{{detail_data.mhn}}</div>
        <!-- 中间的赛事阶段+比分 -->
        <div class="col-6 row">
          <!-- 左边的比分 -->
          <div class="col-2 text-center header-font" v-show="is_show_score && !eports_scoring">{{score.home}}</div>
          <!-- 中间的赛事阶段 上半场和一个倒计时-->
          <div class="col text-center base-header-font">
            <match-stage :detail_data="detail_data" v-if="show_match_stage" :is_change_header="true"></match-stage>
          </div>
          <div class="col eports_scoring_tip" v-if="eports_scoring">{{i18n_t('mmp.eports_scoring')}}</div>
          <!-- 右边的比分 -->
          <div class="col-2 text-center header-font" v-show="is_show_score && !eports_scoring">{{score.away}}</div>
        </div>
        <!-- 客队名称 -->
        <div class="col-2 text-right ellipsis base-header-font">{{detail_data.man}}</div>
<!--      为了保证标题可以居中-->
      <!--   其实也可以不要，本来加起来也不是12   -->
        <div class="col-1"></div>
    </div>
  </div>
</template>
<script>
// #TODO vuex
// import { mapGetters} from "vuex";
// import global_filters from 'src/boot/global-filters.js'
// 球类背景图base64路径集合
import {detail_csid_config} from "src/core/match-detail/match-detail-h5/config/details-bg.js"; 
import lodash from "lodash";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent,nextTick } from "vue";
import { i18n_t } from "src/boot/i18n.js";
import { format_total_score } from "src/output/index.js"
import matchStage from "src/base-h5/components/match/match-stage.vue";  // 详情页上推后置顶的赛事具体状态(1.未开赛显示2.开赛时间小于1小时显示分钟)
//国际化
import { go_where } from "src/core/utils/project/module/go-where.js"  
import { useRoute,useRouter } from "vue-router";
export default defineComponent({
  name: "change_header",
  props:{
    detail_data:Object,
  },
  components: {
    matchStage
  },
  setup(props, evnet) {
    const route = useRoute()
    const router = useRouter()
    let component_data = reactive({
      // 背景图片引入
      URL: detail_csid_config,
      // 顶部赛事阶段及时间 显示控制
      show_match_stage: false,
    });
    // #TODO vuex
    // computed: {
    // ...mapGetters(["get_menu_type", "get_change_count"]),
    let ballTypeBackground = computed(() => lodash.get(detail_csid_config,`[CSID_${props.detail_data.csid}].detail.B`))
    const get_menu_type = computed(() => {
      return "";
    });
    const get_change_count = computed(() => {
      return "";
    });
    // 通过球种csid减1匹配相应的背景图片
    const ballType = computed(() => {
      return props.detail_data.csid - 1;
    });
    const score = computed(() => {
      return {
        
       
        home: format_total_score(props.detail_data, 0),
        away: format_total_score(props.detail_data, 1)
      }
    });
    const eports_scoring = computed(() => {
      //比分判断处理
      let scoring = false
      //如果是电竞，则进行比分判定处理
      if(get_menu_type.value == 3000) {
        const mmp_state = props.detail_data.mmp || 1
        if(mmp_state != (Number(component_data.score.home) + Number(component_data.score.away) +1)) {
          scoring = true
        }
      }
      return scoring
    });
    // 是否展示比分
    const is_show_score = computed(() => {
      return  [1,2,3,4].includes(+props.detail_data.ms) || (get_menu_type.value == 3000 && props.detail_data.ms > 0)
    });
    onMounted(()=>{
      nextTick(() => {
      // ios兼容处理，延迟显示
      component_data.show_match_stage = true
    })
    })
    return {
      ...toRefs(component_data),
      get_menu_type,
      get_change_count,
      ballType,
      score,
      eports_scoring,
      is_show_score,
      lodash,
      ballTypeBackground,
      go_where,
      route,
      router
    }
  }
})
</script>
<style lang="scss" scoped>
.eports_scoring_tip {
  text-align: center;
  color: var(--q-gb-t-c-18);
}
.change-header {
  height: 0.44rem;
  line-height: 0.43rem !important;

  .bg-wrap {
    overflow: hidden;
    width: 100%;
    max-width: 7rem;
    height: 0.44rem;
    background-position: 0 0 !important;
  }

  .go-back-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    // 不是这么玩的！
    //border-right: .15rem solid transparent;   /*扩大可点击范围*/
  }

  .iocn {
    top: 46.5%;
    position: absolute;
    display: block;
    transform: translateY(-50%) rotateZ(90deg);

    &:before {
      color: var(--q-gb-t-c-18) !important;
    }
  }

  .h-row {
    width: 100%;
    height: 100%;
    transition: opacity 2s;
    position: absolute;
    left: 0;
    top: 0;
  }
}

.base-header-font {
  position: relative;
  font-size: 0.12rem;
  color: var(--q-gb-t-c-14);
  letter-spacing: 0;
  &:deep(){
    .counting-title{
      // margin-left: -0.35rem;
    }
    .counting{
      color: var(--q-gb-t-c-14);
      // margin-left: 0.7rem;
      // transform: translateX(80%);
    }
  }
}

.header-font {
  font-size: 0.16rem;
  color: var(--q-gb-t-c-14);
  letter-spacing: 0;
  font-weight: 600;
}

.go-back {
  display: inline-block;
  width: 0.12rem;
  height: 0.2rem;
  background: url($SCSSPROJECTPATH + '/image/common/go_back.svg') no-repeat center / 96% 96%;
  background-size: 100% 100%;
}
// 解决标题的居中问题，
// margin 和 padding不能乱用
.mx-15 {
  margin: 0;
  //padding: 0 0.15rem;
  padding: 0;
}
</style>
<style lang="scss">

</style>