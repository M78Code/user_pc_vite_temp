<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 模板id=6 --用于无盘口&区分主客的多个投注项玩法 比如最后进球球员
-->
<template>
  <div class="temp6 mx-10 super-vip-oper">
    <div class="hairline-border">
      <div class="row title-style">
        <div class="col text-center ellipsis fz_13">{{ item_data.title[0].osn }}</div>
        <div class="col text-center ellipsis fz_13">{{ item_data.title[1].osn }}</div>
      </div>
      <div class="item-wrap">
        <div ref="element">
          {{void (line1=0,line2=0)}}
          <div v-for="(item,index) in item_data.hl" :key="index">
            <div class="item" v-if="index > 0 || index == 0">
              
              <!-- 左 -->
              <div class="item-col">
                <template v-for="(ol_index0,ol_index) in max_count_ol">
                  <template v-if="((hide_show_more_layout || (!hide_show_more_layout && (show_more || (!show_more && ol_index<5)))))">
                    {{void (line1++)}}
                    <template v-if="ol_list_0[ol_index0 - 1]">
                      <div v-if="lodash.get(item_data.title,'[0].otd') == ol_list_0[ol_index0 - 1].otd" :key="ol_index">
                        <!--  0开 2关 1封 11锁 -->
                        <!-- 开盘or锁盘 正常显示 -->
                        <template v-if="ol_list_0[ol_index0 - 1]._mhs == 0 || ol_list_0[ol_index0 - 1]._mhs == 11">
                          <template v-if="ol_list_0[ol_index0 - 1]._hs == 0 || ol_list_0[ol_index0 - 1]._hs == 11">
                            <!-- os: 1、开盘 2、封盘 3、隐藏不显示，不占地方-->
                            <template v-if="ol_list_0[ol_index0 - 1].os == 1">
                              
                              <!-- 主程序 start -->
                              <div
                                  class="play-box-style details_color warp bor-style"
                                  @click="go_to_bet(ol_list_0[ol_index0 - 1])"
                                  :class="[get_bet_list.includes(ol_list_0[ol_index0 - 1].id_)?['details-bg5','first-rad']:'',{'win':calc_win(ol_list_0[ol_index0 - 1].result)}]"
                              >
                                <div class="ellipsis-t remark details_t_color6 fz_16">
                                <span :class="[{'is-score':check_score(ol_list_0[ol_index0 - 1].on),'white_text':get_bet_list.includes(ol_list_0[ol_index0 - 1].id_)},'size-color']">
                                  {{ ol_list_0[ol_index0 - 1].on }}
                                </span>
                                </div>
                                <div class="text-right odds-wrap">
                                  <odds-new :item_data="item_data" :ol_data="ol_list_0[ol_index0 - 1]" ></odds-new>
                                </div>
                              </div>
                              <!-- 主程序 end -->
                            </template>
                            <template v-if="ol_list_0[ol_index0 - 1].os == 2">
                              <!-- lock 锁状态 start -->
                              <div class="play-box-style details_color warp bor-style">
                                <div class="size-color ellipsis-t remark details_t_color7 fz_16" :class="{'is-score':check_score(ol_list_0[ol_index0 - 1].on)}">{{ ol_list_0[ol_index0 - 1].on }}</div>
                                <div class="text-left">
                                  <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                                </div>
                              </div>
                              <!-- lock 锁状态 end -->
                            </template>
                            <template v-if="ol_list_0[ol_index0 - 1].os == 3"></template>
                          </template>
                          <template v-if="ol_list_0[ol_index0 - 1]._hs == 1">
                            <template v-if="ol_list_0[ol_index0 - 1].os == 3"></template>
                            <template v-else>
                              <!-- lock 锁状态 start -->
                              <div class="play-box-style details_color warp bor-style">
                                <div class="size-color ellipsis remark details_t_color6 fz_16" :class="{'is-score':check_score(ol_list_0[ol_index0 - 1].on)}" v-show="get_detail_data.csid != 1">{{ ol_list_0[ol_index0 - 1].on }}</div>
                                <div class="text-left">
                                  <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                                </div>
                              </div>
                              <!-- lock 锁状态 end -->
                            </template>
                          </template>
                          <template v-if="ol_list_0[ol_index0 - 1]._hs == 2">
                            <!-- 盘口级别状态关盘时，要占位 -->
                            <div class="play-box-style details_color">
                            </div>
                          </template>
                        </template>
                        <!-- 封盘，一把锁的居中显示 -->
                        <template v-if="ol_list_0[ol_index0 - 1]._mhs == 1">
                          <!-- lock 锁状态 start -->
                          <div class="play-box-style details_color warp bor-style">
                            <div class="size-color ellipsis remark details_t_color7 fz_16" :class="{'is-score':check_score(ol_list_0[ol_index0 - 1].on)}" v-show="get_detail_data.csid != 1">{{ ol_list_0[ol_index0 - 1].on }}</div>
                            <div class="text-left">
                              <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                            </div>
                          </div>
                          <!-- lock 锁状态 end -->
                        </template>
                        <!-- 关盘 -->
                        <template v-if="ol_list_0[ol_index0 - 1]._mhs == 2"></template>
                      </div>
                    </template>
                    <template v-else>
                      <div :key="ol_index" class="play-box-style details_color warp bor-style"></div>
                    </template>
                  </template>
                </template>
              </div>

              <!-- 右 -->
              <div class="item-col col-super-vip1">
                <template v-for="(ol_index1,ol_index) in max_count_ol">
                  <template v-if="((hide_show_more_layout || (!hide_show_more_layout && (show_more || (!show_more && ol_index<5)))))">
                    <template v-if="ol_list_1[ol_index1 - 1]">
                      <div
                          v-if="lodash.get(item_data.title,'[1].otd') == ol_list_1[ol_index1 - 1].otd" :key="ol_index">
                        <!--  0开 2关 1封 11锁 -->
                        <!-- 开盘or锁盘 正常显示 -->
                        <template v-if="ol_list_1[ol_index1 - 1]._mhs == 0 || ol_list_1[ol_index1 - 1]._mhs == 11">
                          <template v-if="ol_list_1[ol_index1 - 1]._hs == 0 || ol_list_1[ol_index1 - 1]._hs == 11">
                            <!-- os: 1、开盘 2、封盘 3、隐藏不显示，不占地方-->
                            <template v-if="ol_list_1[ol_index1 - 1].os == 1">
                              <!-- 主程序 start -->
                              <div
                                  class="play-box-style details_color bor-style"
                                  @click="go_to_bet(ol_list_1[ol_index1 - 1])"
                                  :class="[get_bet_list.includes(ol_list_1[ol_index1 - 1].id_)?'details-bg5':'',{'win':calc_win(ol_list_1[ol_index1 - 1].result)}]">
                                <div class="ellipsis-t remark details_t_color6 fz_16">
                                <span :class="[{'is-score':check_score(ol_list_1[ol_index1 - 1].on),'white_text':get_bet_list.includes(ol_list_1[ol_index1 - 1].id_)},'size-color']">
                                  {{ ol_list_1[ol_index1 - 1].on }}
                                </span>
                                </div>
                                <div class="text-right odds-wrap">
                                  <odds-new :item_data="item_data" :ol_data="ol_list_1[ol_index1 - 1]" ></odds-new>
                                </div>
                              </div>
                              <!-- 主程序 end -->
                            </template>
                            <template v-if="ol_list_1[ol_index1 - 1].os == 2">
                              <!-- lock 锁状态 start -->
                              <div class="play-box-style details_color bor-style">
                                <div class="size-color ellipsis remark details_t_color7 fz_16" :class="{'is-score':check_score(ol_list_1[ol_index1 - 1].on)}" v-show="get_detail_data.csid != 1">{{ ol_list_1[ol_index1 - 1].on }}</div>
                                <div class="text-left">
                                  <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                                </div>
                              </div>
                              <!-- lock 锁状态 end -->
                            </template>
                            <template v-if="ol_list_1[ol_index1 - 1].os == 3"></template>
                          </template>
                          <template v-if="ol_list_1[ol_index1 - 1]._hs == 1">
                            <template v-if="ol_list_1[ol_index1 - 1].os == 3"></template>
                            <template v-else>
                              <!-- lock 锁状态 start -->
                              <div class="play-box-style details_color bor-style">
                                <div class="size-color ellipsis remark details_t_color6 fz_16" :class="{'is-score':check_score(ol_list_1[ol_index1 - 1].on)}" v-show="get_detail_data.csid != 1">{{ ol_list_1[ol_index1 - 1].on }}</div>
                                <div class="text-left">
                                  <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                                </div>
                              </div>
                              <!-- lock 锁状态 end -->
                            </template>
                          </template>
                          <template v-if="ol_list_1[ol_index1 - 1]._hs == 2">
                            <!-- 盘口级别状态关盘时，要占位 -->
                            <div class="play-box-style details_color bor-style">
                            </div>
                          </template>
                        </template>
                        <!-- 封盘，一把锁的居中显示 -->
                        <template v-if="ol_list_1[ol_index1 - 1]._mhs == 1">
                          <!-- lock 锁状态 start -->
                          <div class="play-box-style details_color bor-style">
                            <div class="size-color ellipsis remark details_t_color7 fz_16" :class="{'is-score':check_score(ol_list_1[ol_index1 - 1].on)}" v-show="get_detail_data.csid != 1">{{ ol_list_1[ol_index1 - 1].on }}</div>
                            <div class="text-left">
                              <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                            </div>
                          </div>
                          <!-- lock 锁状态 end -->
                        </template>
                        <!-- 关盘 -->
                        <template v-if="ol_list_1[ol_index1 - 1]._mhs == 2"></template>
                      </div>
                    </template>
                    <template v-else>
                      <div :key="ol_index" class="play-box-style details_color bor-style"></div>
                    </template>
                  </template>
                </template>
              </div>
            </div>
            <!--横向一列+底部横排一列-->
            <div class="row" v-if="index>0||index==0">
              <div class="col col-super-vip1">
                <template v-for="(ol_item,ol_index) in item.ol" >
                  <template v-if="('-1' == lodash.get(ol_item, 'otd')) ">
                    {{void (line2++)}}
                    <div :key="ol_index"  v-if="((hide_show_more_layout || (!hide_show_more_layout && (show_more || (!show_more && (line1+line2)<5)))))">
                      <!--  0开 2关 1封 11锁 -->
                      <!-- 开盘or锁盘 正常显示 -->
                      <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                        <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                          <!-- os: 1、开盘 2、封盘 3、隐藏不显示，不占地方-->
                          <template v-if="ol_item.os == 1">
                            <!-- 主程序 start -->
                            <div
                                class="play-box-style details_color"
                                @click="go_to_bet(ol_item)"
                                :class="[get_bet_list.includes(ol_item.id_)?'details-bg5':'',{'win':calc_win(ol_item.result)}]">
                              <div class="ellipsis-t remark details_t_color6 fz_16">
                              <span :class="[{'is-score':check_score(ol_item.on),'white_text':get_bet_list.includes(ol_item.id_)}]">
                                {{ ol_item.on }}
                              </span>
                              </div>
                              <div class="text-right odds-wrap">
                                <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                              </div>
                            </div>
                            <!-- 主程序 end -->
                          </template>
                          <template v-if="ol_item.os == 2">
                            <!-- lock 锁状态 start -->
                            <div class="play-box-style details_color">
                              <div class="ellipsis remark details_t_color7 fz_16" v-show="get_detail_data.csid != 1">{{ ol_item.on }}</div>
                              <div class="text-left">
                                <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                              </div>
                            </div>
                            <!-- lock 锁状态 end -->
                          </template>
                          <template v-if="ol_item.os == 3"></template>
                        </template>
                        <template v-if="ol_item._hs == 1">
                          <template v-if="ol_item.os == 3"></template>
                          <template v-else>
                            <!-- lock 锁状态 start -->
                            <div class="play-box-style details_color">
                              <div class="ellipsis remark details_t_color6 fz_16" v-show="get_detail_data.csid != 1">{{ ol_item.on }}</div>
                              <div class="text-left">
                                <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                              </div>
                            </div>
                            <!-- lock 锁状态 end -->
                          </template>
                        </template>
                        <template v-if="ol_item._hs == 2">
                          <!-- 盘口级别状态关盘时，要占位 -->
                          <div class="play-box-style details_color">
                          </div>
                        </template>
                      </template>
                      <!-- 封盘，一把锁的居中显示 -->
                      <template v-if="ol_item._mhs == 1">
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color">
                          <div class="ellipsis remark details_t_color7 fz_16" v-show="get_detail_data.csid != 1">{{ ol_item.on }}</div>
                          <div class="text-left">
                            <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                          </div>
                        </div>
                        <!-- lock 锁状态 end -->
                      </template>
                      <!-- 关盘 -->
                      <template v-if="ol_item._mhs == 2"></template>
                    </div>
                  </template>
                </template>
              </div>
            </div>

          </div>

          <!-- 展开和收起按钮 -->
          <div v-if="!hide_show_more_layout" class="show-more play-box-style"  @click="change_show">
          <span class="fz_13">{{show_more?i18n_t('match_info.pack_up'):i18n_t('match_info.show_more')}}
          </span>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex
// import {mapGetters, mapMutations, mapActions} from "vuex";
import odds_new from "src/base-h5/components/details/components/tournament-play/unit/odds-new.vue";
// import odd_convert from "src/base-h5/mixins/odds_conversion/odds_conversion.js";
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/output/index.js';
import lodash from "lodash";
import store from "src/store-redux/index.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent, ref } from "vue";
import { useRoute } from "vue-router"
import { i18n_t } from "src/boot/i18n.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
//国际化


export default defineComponent({
  // #TODO mixins
  // mixins: [odd_convert],
  name: "temp6",
  props: ["item_data", "title"],
  components: {
    "odds-new": odds_new
  },
  data() {
    return {
      LOCAL_PROJECT_FILE_PREFIX
    }
  },
  setup(props, evnet) {
    const route = useRoute()
    const store_state = store.getState()
    let state_data = reactive({
      show_more:true,
    })
  const element = ref(null)
  const other_item_list = ref([])
  const ol_list_0 = ref([])
  const ol_list_1 = ref([])
  const ol_list_2 = ref([])
  const max_count_ol = ref([])
    // #TODO vuex
    // computed: {
    // ...mapGetters([
    // "get_bet_list",
    // "get_cur_odd",
    // "get_detail_data",
    // // 收到C105推送赔率,生成一个浮点, 伪随机数在范围从0到小于1
    // "get_flag_get_ol_list"
    // ]),
    const get_bet_list = computed(() => {
      return []
    });
    const get_cur_odd = computed(() => {
      return ""
    });
    const get_flag_get_ol_list = computed(() => {
      return ""
    });
    const get_detail_data = computed(() => {
      return store_state.detailsReducer.details_data || {}
    });
    const hide_show_more_layout = computed(() => {
      let ret = true;
      let len = lodash.get(props.item_data,'hl[0].ol.length');
      if(!len){
        len = 0;
      }
      
      if(len>10){
        ret = false;
      } else{
        ret = true;
      }
      return ret;
    });
    watch(
      () => get_flag_get_ol_list,
      () => {
        max_count_ol.value = get_ol_list();
      }
    );
    onMounted(() => {
      // 根据指定模板,对模板下数据量大的玩法进行折叠处理
      // 获取玩法下的数量
      let temp = lodash.get(props.item_data,'hl[0].ol.length');
      if(temp && temp>10){
        state_data.show_more = false;
      }
      max_count_ol.value = get_ol_list();
    })
    const get_ol_list = () =>{
      let max = 0,
        hl = props.item_data.hl[0],
        ol_list = hl.ol;

        props.item_data.title.forEach((tit,i) => {
        let other_items = ol_list.filter(ol_item => ol_item.ot == 'Other');
        if(other_items.length){
          // 合并数据，根据id去重
          const arr = [...other_items,...other_item_list.value]
          const uniq_arr = lodash.uniqWith(arr, (arr_val, oth_val)=>{
            if(arr_val.id_ === oth_val.id_ ) {
              return true
            }
            return false
          });
          other_item_list.value = uniq_arr
        }
        //os等于3需要隐藏投注项
        let filtered = ol_list.filter(ol_item => ol_item.otd == tit.otd && ol_item.ot != 'Other' && ol_item.os != 3 );
        if(i == 0){
          ol_list_0.value = filtered;
        }
        else if(i == 1){
          ol_list_1.value = filtered;
        }
        else if(i == 2){
          ol_list_2.value = filtered;
        }
        let m_len = filtered.length;
        if(m_len > max) max = m_len;
      });
      return max;
    }
    /**
     *@description 6号模板点击收起的时候，要调整滚动距离回到展开之前的高度
     *@return {Undefined} undefined
     */
    const change_show = () => {
      if (state_data.show_more) {
        let distance = element.value.offsetHeight - (6 * rem(0.52))
        if (route.name == 'virtual_sports_details') {
          document.documentElement.scrollTop -= distance
        } else {
          useMittEmit(MITT_TYPES.EMIT_SET_DETAILDS_SCROLL,distance)
        }
      }
      state_data.show_more = !state_data.show_more
    };
    /**
     * @description: 检测是不是比分格式5-9
     * @param {String} 检测字符串
     * @return {Boolean} 检测结果
     */
    const check_score = (str) => {
      let ret = false;
      if(str && /^(\d)*-(\d)*$/.test(str)){
        ret = true;
      }
      return ret;
    };
    /**
     * @description 为数字时为其添加高亮类(highlight)
     *
     * @param  {string} val  需要判断的值
     * @return {string} 类名
     */
    const set_highlight_cls = (val) => {
      let reg = /^\d*-?\d*$/
      return reg.test(val) ? "highlight" :""
    };
    const go_to_bet = (ol_item) => {
      useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX,true);
    };
    return {
      ...toRefs(state_data),
      
      i18n_t,
      get_bet_list,
      get_cur_odd,
      max_count_ol,
      ol_list_0,
      ol_list_1,
      ol_list_2,
      get_detail_data,
      // 收到C105推送赔率,生成一个浮点, 伪随机数在范围从0到小于1
      get_flag_get_ol_list,
      hide_show_more_layout,
      go_to_bet,
      change_show,
      check_score,
      set_highlight_cls,
      LOCAL_PROJECT_FILE_PREFIX,
    }
  }
})
</script>

<style lang="scss" scoped>
.title-style {
  height: 0.18rem;
  color: var(--q-analysis-text-color-14);
  line-height: 0.18rem;
}

.item {
  display: flex;
  flex-wrap: wrap;
}

.item-col {
  flex: 1;

  &:nth-child(2n) {
    margin-right: 0;
  }
}

.item-wrap {
  min-height: 0.32rem;
  height: auto;
  border-radius: 4px;
  overflow: hidden;
}

.show-more {

  color: var(--q-color-com-fs-color-11);
  align-items: center;
  justify-content: center;
}

.play-box-style {
  width: 100%;
  height: 0.52rem;


  padding: 0 0.15rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bor-style {

}

.ellipsis-t {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.remark {
  flex: 1;

  letter-spacing: 0;
  font-size: 0.14rem;
  color: var(--q-analysis-text-color-14)!important;
  &.highlight {
    font-size: 16px;
    color: var(--q-color-fs-color-51);
  }
}

.odds-wrap {
  width: 0.45rem;
}

.active {

}

.lock-style {
  width: 100%;
  height: 0.3rem;
  line-height: 0.3rem;
  margin-bottom: 0.02rem;

  border-radius: 0.02rem;
  padding: 0 0.1rem;
  text-align: center;
  display: block;
}

.white_text {

}

.details_color {

}

.first-rad {
  &:after {

  }
}

.icon-lock {
  width: 0.16rem;
  height: 0.16rem;
  vertical-align: middle;
}

</style>