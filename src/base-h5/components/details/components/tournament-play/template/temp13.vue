<!--
 * @Author: Supermark
 * @Description: 模板13 --针对让球/大小玩法，有多盘口时使用，支持最多6个盘口(超过6个时取前6个)，页面第一屏最多展示3个，左右滑动可查看更多；盘口配置少于3个时，则按2个和1个的样式对应进行展示；
 *               主盘放第一个，多盘口排序规则维持不变；坑位规则保持不变；
-->
<template>
  <div class="temp13 mx-10">
    <div class="hairline-border">
      <div class="rad-style">
        <i class="slide_icon slide_icon_l animate-effect" v-show="is_show_slide && !get_is_hengping"></i>
        <i class="slide_icon slide_icon_r animate-effect-r" v-show="is_show_slide_r && !get_is_hengping"></i>

        <div class="play-name-wrapper" v-show="get_is_hengping">
          <div class="item-name ellipsis">{{lodash.get(item_data, 'title[0].osn')}}</div>
          <div class="item-name ellipsis">{{lodash.get(item_data, 'title[1].osn')}}</div>
        </div>
        <!-- 大 -->
        <div class="row bor-style" :class="get_is_hengping?'bor-style2':'' ">
          <div class="play-name ellipsis" v-show="!get_is_hengping">
            {{lodash.get(item_data, 'title[0].osn')}}
          </div>
          <div class="row slide-con" ref="bet_slide" style="flex:1;" v-touch-pan.horizontal.prevent.mouse="touch_pan">
            <div class="slide-wrap"
            :class="[
              {'slide-wrap-width-100': append_single_list.filter(append_single=>lodash.get(item_data, 'title[0].otd') == append_single.otd).length==1,
                'slide-wrap-width-50': append_single_list.filter(append_single=>lodash.get(item_data, 'title[0].otd') == append_single.otd).length==2 }]"
              :style="{left:`${left}px`}">
              <template v-for="(append_single, index) of append_single_list">
                <div class="col bet-item" :key="index" v-if="lodash.get(item_data, 'title[0].otd') == append_single.otd">
                  <div class="row row-fat">
                    <!-- (开盘_mhs=0或者锁盘_mhs=11 -->
                    <div v-if="append_single._mhs == 0 || append_single._mhs == 11" style="flex:1;">
                      <template v-if="append_single._hs == 0 || append_single._hs == 11">
                        <!-- os=1 开盘 -->
                        <template v-if="append_single.os == 1">
                          <div class="play-box-sty details-color" @click="go_to_bet(append_single)"
                               :class="[BetData.bet_oid_list.includes(append_single.oid)?['details-bg5','white_text']:'',{'win': calc_win(append_single.result)}]">
                            <div class="single-name">
                              <span class="fz_14 ver-ali-top">{{devote_value_d(append_single.ot)}}</span>
                              <span :class="BetData.bet_oid_list.includes(append_single.oid) ? 'size-color-wit':'size-color'" class="fz_16">
                              {{append_single.on}}
                            </span>
                            </div>
                            <odds-new :class="{'odds-style':!is_match_result}" :item_data="item_data" :ol_data="append_single" ></odds-new>
                          </div>
                        </template>
                        <!-- os=2 封盘 -->
                        <template v-if="append_single.os == 2">
                          <div class="play-box-sty details-color " style="flex:1;" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                            <div class="single-name details_t_color7" v-show="get_detail_data.csid != 1">
                              <span class="fz_14 ver-ali-top ">{{devote_value_d(append_single.ot)}}</span>
                              <span class="fz_16 odd-color">
                              {{append_single.on}}
                            </span>
                            </div>
                            <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                          </div>
                        </template>
                        <!-- 新增start -->
                        <template v-if="append_single.os == 3"></template>
                        <!-- 新增over -->
                      </template>
                      <!-- hs=1 封盘 -->
                      <template v-if="append_single._hs == 1">
                        <template v-if="append_single.os == 3">
                          <div style="height: 0.32rem;"></div>
                        </template>
                        <template v-else>
                          <div class="play-box-sty details-color " style="flex:1;" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                            <div class="single-name" v-show="get_detail_data.csid != 1">
                              <span class="fz_14 ver-ali-top">{{devote_value_d(append_single.ot)}}</span>
                              <span class="fz_16 night-style">
                              {{append_single.on}}
                            </span>
                            </div>
                            <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                          </div>
                        </template>
                      </template>
                      <!-- hs=2 空白占位 -->
                      <template v-if="append_single._hs == 2">
                        <div class="play-box-sty details-color" style="flex:1;">
                          <div class="single-name">
                            <span class="fz_14 ver-ali-top"></span>
                            <span class="fz_16"></span>
                          </div>
                        </div>
                      </template>
                    </div>
                    <!-- 封盘ms=1 -->
                    <template v-if="append_single._mhs == 1">
                      <div class="play-box-sty details-color " style="flex:1;" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                        <div class="single-name details_t_color7" v-show="get_detail_data.csid != 1">
                          <span class="fz_14 ver-ali-top">{{devote_value_d(append_single.ot)}}</span>
                          <span class="fz_16 size-color">
                          {{append_single.on}}
                        </span>
                        </div>
                        <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                      </div>
                    </template>
                    <!-- 关盘ms=2 -->
                    <template v-if="append_single._mhs == 2"></template>
                  </div>
                </div>
              </template>
              <template v-if="lodash.get(item_data,'hl.length') !=2 && !get_is_hengping">
                <div class="col" v-for="(item,index2) in null_box_list" :key="'bb'+index2"></div>
              </template>
            </div>
          </div>
        </div>
        <div class="row">
          <!-- 小 -->
          <div class="play-name ellipsis" v-show="!get_is_hengping">
            {{lodash.get(item_data, 'title[1].osn')}}
          </div>
          <div class="row slide-con" ref="bet_slide" style="flex:1;" v-touch-pan.horizontal.prevent.mouse="touch_pan">
            <div class="slide-wrap"
            :class="[
              {'slide-wrap-width-100': append_single_list.filter(append_single=>lodash.get(item_data, 'title[1].otd') == append_single.otd).length==1,
                'slide-wrap-width-50': append_single_list.filter(append_single=>lodash.get(item_data, 'title[1].otd') == append_single.otd).length==2 }]"
            :style="{left:`${left}px`}">
              <template v-for="(append_single,index) of append_single_list">
                <div class="col bet-item" :key="index" v-if="lodash.get(item_data, 'title[1].otd') == append_single.otd">
                  <div class="row row-fat" v-if="lodash.get(item_data, 'title[1].otd') == append_single.otd">
                    <!-- (开盘_mhs=0或者锁盘_mhs=11) -->
                    <div v-if="append_single._mhs == 0 || append_single._mhs == 11" style="flex:1;">
                      <template v-if="append_single._hs == 0 || append_single._hs == 11">
                        <!-- os=1 开盘 -->
                        <template v-if="append_single.os == 1">
                          <div class="play-box-sty details-color" @click="go_to_bet(append_single)"
                               :class="[BetData.bet_oid_list.includes(append_single.oid)?['details-bg5','white_text']:'',{'win':calc_win(append_single.result)}]">
                            <div class="single-name">
                              <span class="fz_14 ver-ali-top">{{devote_value_x(append_single.ot)}}</span>
                              <span :class="BetData.bet_oid_list.includes(append_single.oid) ? 'size-color-wit':'size-color'" class="fz_16">
                              {{append_single.on}}
                            </span>
                            </div>
                            <odds-new :class="{'odds-style':!is_match_result}" :item_data="item_data" :ol_data="append_single" ></odds-new>
                          </div>
                        </template>
                        <!-- os=2 封盘 -->
                        <template v-if="append_single.os == 2">
                          <div class="play-box-sty details-color " style="flex:1;" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                            <div class="single-name details_t_color7" v-show="get_detail_data.csid != 1">
                              <span class="fz_14 ver-ali-top">{{devote_value_x(append_single.ot)}}</span>
                              <span class="fz_16 odd-color">
                              {{append_single.on}}
                            </span>
                            </div>
                            <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                          </div>
                        </template>
                        <!-- 新增start -->
                        <template v-if="append_single.os == 3"></template>
                        <!-- 新增over -->
                      </template>
                      <!-- hs=1 封盘 -->
                      <template v-if="append_single._hs == 1">
                        <template v-if="append_single.os == 3">
                          <div style="height: 0.32rem;"></div>
                        </template>
                        <template v-else>
                          <div class="play-box-sty details-color " style="flex:1;" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                            <div class="single-name" v-show="get_detail_data.csid != 1">
                              <span class="fz_14 ver-ali-top">{{devote_value_x(append_single.ot)}}</span>
                              <span class="fz_16 night-style">
                              {{append_single.on}}
                            </span>
                            </div>
                            <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                          </div>
                        </template>
                      </template>
                      <!-- hs=2 空白占位 -->
                      <template v-if="append_single._hs == 2">
                        <div class="play-box-sty details-color" style="flex:1;">
                          <div class="single-name"><span class="fz_14 ver-ali-top"></span><span class="fz_16"></span></div>
                        </div>
                      </template>
                    </div>
                    <!-- 封盘ms=1 -->
                    <template v-if="append_single._mhs == 1">
                      <div class="play-box-sty details-color " style="flex:1;" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                        <div class="single-name details_t_color7" v-show="get_detail_data.csid != 1">
                          <span class="fz_14 ver-ali-top">{{devote_value_x(append_single.ot)}}</span>
                          <span class="size-color fz_16 odd-color">
                          {{append_single.on}}
                        </span>
                        </div>
                        <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                      </div>
                    </template>
                    <!-- 关盘ms=2 -->
                    <template v-if="append_single._mhs == 2"></template>
                  </div>
                </div>
              </template>
              <template v-if="lodash.get(item_data,'hl.length') !=2 && !get_is_hengping">
                <div class="col" v-for="(item,index2) in null_box_list" :key="'bb'+index2"></div>
              </template>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex
// import { mapGetters } from "vuex";
// 引入redux
import store from "src/store-redux/index.js";
import lodash from "lodash";
import odds_new from "src/base-h5/components/details/components/tournament-play/unit/odds-new.vue";
import {LOCAL_PROJECT_FILE_PREFIX } from 'src/output/index.js';
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import BetData from "src/core/bet/class/bet-data-class.js"

export default defineComponent({
  name: "temp13",
  props:{
    item_data: Object,
  },
  // #TODO mixins
  // mixins:[odd_convert],
  components: {
    "odds-new": odds_new
  },
  setup(props, evnet) {
    const store_state = store.getState()
    const route = useRoute()
    let init_data = reactive({
      
      // 滑动left
      left: 0
    });
    const bet_slide = ref(null)
    // #TODO vuex
    // computed: {
    // ...mapGetters(["get_bet_list", "get_detail_data", 'get_is_hengping']),
    const get_bet_list = computed(() => {
      return []
    });
    const get_detail_data = computed(() => {
      return store_state.detailsReducer.details_data || {}
    });
    const get_is_hengping = computed(() => {
      return ""
    });
    const devote_value_d = computed(() => {
      return function (val) {
        if (val == 'Over') {
          return 'O'
        } else {
          return ''
        }
      }
    })
    const devote_value_x = computed(() => {
      return function (val) {
        if (val == 'Under') {
          return 'U'
        } else {
          return ''
        }
      }
    })
    // 是否净胜分玩法
    //净胜分现在是5号模板
    // is_wining_score() {
    //   // 净胜分(不含加时)/净胜分3项/净胜分6项/净胜分12项/净胜分14项/点球大战-净胜分/净胜分（虚拟体育独有）
    //   let hpid_list = ['141', '200', '209', '211', '212', '238', '20024']
    //   let w_hpid = props.item_data.hpid
    //   return hpid_list.includes(w_hpid)
    // },
    // ol的长度
    const ol_length = computed(() => {
      return props.item_data.hl[0].ol.length;
    })
    // 附加盘投注项集合
    const append_single_list = computed(() => {
      let result = [];
      for (let i = 0; i < props.item_data.hl.length; i++) {
        for (let i_ = 0; i_ < props.item_data.hl[i].ol.length; i_++) {
          result.push(props.item_data.hl[i].ol[i_]);
        }
      }
      return result;
    })
    // 空白盒子个数
    const null_box_list = computed(() => {
      let count = 0
      let arr = []
      // 大玩法数据
      let arr_max = false
      // 小玩法数据
      let arr_min = false
      for (let i = 0; i < props.item_data.hl.length; i++) {
        for (let i_ = 0; i_ < props.item_data.hl[i].ol.length; i_++) {
          // 如果此时otd满足title里面第一个otd 则为true
          if (props.item_data.hl[i].ol[i_].otd == lodash.get(props.item_data, 'title[0].otd')) {
            arr_max = true
          }
          // 如果此时otd满足title里面第二个otd 则为true
          if (props.item_data.hl[i].ol[i_].otd == lodash.get(props.item_data, 'title[1].otd')) {
            arr_min = true
          }
        }
      }
      // 如果只有大玩法没小的玩法 此时需要做判断 如果大小玩法都有则空盒子数目除2 否则不除2
      if (arr_max && arr_min) {
        count = append_single_list.length / 2
      } else {
        count = append_single_list.length
      }
      if (count > 3) {
        count = 6 - count
      }
      for (let i = 0; i < count; i++) {
        arr.push(i)
      }
      return arr
    })
    const is_show_slide = computed(() => {
      return (append_single_list.length / 2) > 3 && init_data.left == 0
    })
    const is_show_slide_r = computed(() => {
      return (append_single_list.length / 2) > 3 && init_data.left != 0
    })
    const is_match_result = computed(() => {
      return ['result_details', 'match_result'].includes(route.name)
    })
    /**
     * @Description 左右滑动
     * @param {object} e 滑动参数
     * @param {undefined} undefined
    */
    const touch_pan = lodash.debounce((e) => {
      let dom_width = bet_slide.value?.clientWidth

      if ((append_single_list.length / 2) < 4) {
        return
      }
      if (bet_slide.value?.direction == 'left') {
        // 左滑
        let slide_num
        let temp_num = props.item_data.hl.length / 3

        // 是整数则减一，否则向下取整
        if (init_data.is_integer(temp_num)) {
          slide_num = temp_num - 1
        } else {
          slide_num = Math.floor(temp_num)
        }

        // 左滑最大距离
        let max_left = dom_width * slide_num
        if (Math.abs(init_data.left) >= max_left) {
          return
        }

        init_data.left -= dom_width

      } else {
        // 右滑
        if (init_data.left >= 0) {
          return
        }
        init_data.left += dom_width
      }
    }, 500);
    const go_to_bet = (ol_item) => {
      useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX,true);
    };
    onMounted(() => {
      // 原created
      touch_pan()
    })
    onUnmounted(() => {
      touch_pan.cancel();
    })
    return {
      ...toRefs(init_data),
      lodash,
      get_bet_list,
      BetData,
      get_detail_data,
      get_is_hengping,
      devote_value_d,
      devote_value_x,
      ol_length,
      append_single_list,
      null_box_list,
      is_show_slide,
      is_show_slide_r,
      is_match_result,
      touch_pan,
      bet_slide,
      route,
      go_to_bet,
      LOCAL_PROJECT_FILE_PREFIX
    }
  }
})
</script>

<style lang="scss" scoped>
.temp13 {
  // @include keyframes(dir_remind_animate) {
  //   0% {
  //     transform: translateX(0);
  //     opacity: 0;
  //   }
  //   60% {
  //     transform: translateX(-0.06rem);
  //     opacity: 1;
  //   }
  //   100% {
  //     transform: translateX(-0.09rem);
  //     opacity: 0;
  //   }
  // }

  // @include keyframes(dir_right_remind_animate) {
  //   0% {
  //     transform: translateX(-0.09rem) rotate(180deg);
  //     opacity: 0;
  //   }
  //   60% {
  //     transform: translateX(-0.06rem) rotate(180deg);
  //     opacity: 1;
  //   }
  //   100% {
  //     transform: translateX(0) rotate(180deg);
  //     opacity: 0;
  //   }
  // }

  .slide_icon {
    width: 0.12rem;
    height: 0.12rem;
    position: absolute;
    top: 50%;
    right: -0.03rem;
    z-index: 10;
    margin-top: -0.06rem;

    &.animate-effect {
      animation: dir_remind_animate cubic-bezier(0.49, 0.49, 0.61, 0.59) 1.4s infinite;
    }

    &.animate-effect-r {
      animation: dir_right_remind_animate cubic-bezier(0.49, 0.49, 0.61, 0.59) 1.4s infinite;
    }
  }

  .slide-con {
    position: relative;
    overflow: hidden;
  }

  .slide-wrap {
    transition: left 0.3s;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    //width: 200%;
    height: 0.52rem;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.04);
    .bet-item {
      min-width: 0.796rem;
    }
  }
  .slide-wrap-width-100{
    width: 100%;
  }
  .slide-wrap-width-50{
    width: 100%;
  }

  .rad-style {
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }

  .bor-style {
    // margin-bottom: 1px;
    border-bottom: 1px solid  var(--q-gb-bd-c-7);
  }
  .bor-style2 {
    border-bottom: none !important;
  }

  .title-style {
    height: 0.18rem;
    font-size: 0.14rem;

    line-height: 0.18rem;
  }

  .main-fat {
    border-radius: 4px;
    overflow: hidden;
  }

  .play-box-style {
    text-align: center;
    width: 100%;
    height: 0.52rem;
    line-height: 0.52rem;
  }

  .play-box-sty {
    height: 0.52rem;
    text-align: center;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.04);
  }

  .odds-lock {
    line-height: 0.52rem;
  }

  .remark {
    flex: 1;
    color: var(--q-color-com-fs-color-28);
    letter-spacing: 0;
  }

  .remark-line1 {
    flex: 1;

    letter-spacing: 0;
  }

  .odds-wrap {
    height: 0.52rem;
    line-height: 0.52rem;

    border-radius: 0 0 0.02rem 0;
    position: relative;

    &:after {
      content: ' ';
      display: block;
      position: absolute;
      width: 1px;
      height: 0.24rem;
      top: 0.16rem;
      left: 0rem;
      background: #EDEEF9;
    }
  }

  .play-box-style-line1 {
    width: 100%;
    height: 0.52rem;
    line-height: 0.52rem;

    display: flex;
  }

  .details-color {

  }

  .row-fat {
    text-align: center;
  }

  .white_text {
    .ver-ali-top {

    }
  }

  .play-name {
    width: 1.15rem;
    height: 0.52rem;
    line-height: 0.52rem;
    padding: 0 0.075rem;
    // margin-right: 1px;
    border-right: 1px solid  var(--q-gb-bd-c-7);
    color: #999999;// var(--q-detials-color-7);

    text-align: center;
    font-size: 0.14rem;
    position: relative;
  }

  .single-name {
    line-height: 0.2rem;
    padding-top: 0.07rem;
  }

  .odds-style {
    line-height: 0.16rem;
    padding-bottom: 0.07rem;
  }

  .icon-lock {
    width: 0.12rem;
    height: 0.14rem;
    vertical-align: middle;
  }
  .odd-color {
    color: var(--q-gb-t-c-11);
  }

  .size-color {
    color: var(--q-gb-t-c-11);
  }

  .size-color-wit {
    color: var(--q-gb-t-c-14);
  }
  .ver-ali-top {
    vertical-align: top;
  }
}
</style>