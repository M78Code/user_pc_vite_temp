<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 模板id=6 --用于无盘口&区分主客的多个投注项玩法 比如最后进球球员
-->
<template>
   <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="temp6 mx-5 super-vip-oper">
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
                      <div v-if="lodash.get(item_data.title,'[0].otd') == ol_list_0[ol_index0 - 1].otd" :key="ol_index" class="item-col-item">
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
                                  :class="[BetData.bet_oid_list.includes(ol_list_0[ol_index0 - 1].oid)?['details-bg5','first-rad']:'',{'win':calc_win(ol_list_0[ol_index0 - 1].result)}]"
                              >
                                <div class="ellipsis-t remark details_t_color6 fz_12">
                                <span :class="[{'is-score':check_score(ol_list_0[ol_index0 - 1].on),'white_text':BetData.bet_oid_list.includes(ol_list_0[ol_index0 - 1].oid)},'size-color']">
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
                                <div class="size-color ellipsis-t remark details_t_color7 fz_12" :class="{'is-score':check_score(ol_list_0[ol_index0 - 1].on)}">{{ ol_list_0[ol_index0 - 1].on }}</div>
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
                                <div class="size-color ellipsis remark details_t_color6 fz_12" :class="{'is-score':check_score(ol_list_0[ol_index0 - 1].on)}" v-show="get_detail_data.csid != 1">{{ ol_list_0[ol_index0 - 1].on }}</div>
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
                            <div class="size-color ellipsis remark details_t_color7 fz_12" :class="{'is-score':check_score(ol_list_0[ol_index0 - 1].on)}" v-show="get_detail_data.csid != 1">{{ ol_list_0[ol_index0 - 1].on }}</div>
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
                    <div class="item-col-item" v-else>
                      <div :key="ol_index" class="play-box-style details_color warp bor-style"></div>
                    </div>
                  </template>
                </template>
              </div>

              <!-- 右 -->
              <div class="item-col col-super-vip1">
                <template v-for="(ol_index1,ol_index) in max_count_ol">
                  <template v-if="((hide_show_more_layout || (!hide_show_more_layout && (show_more || (!show_more && ol_index<5)))))">
                    <template v-if="ol_list_1[ol_index1 - 1]">
                      <div
                          v-if="lodash.get(item_data.title,'[1].otd') == ol_list_1[ol_index1 - 1].otd" :key="ol_index"  class="item-col-item">
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
                                  :class="[BetData.bet_oid_list.includes(ol_list_1[ol_index1 - 1].oid)?'details-bg5':'',{'win':calc_win(ol_list_1[ol_index1 - 1].result)}]">
                                <div class="ellipsis-t remark details_t_color6 fz_12">
                                <span :class="[{'is-score':check_score(ol_list_1[ol_index1 - 1].on),'white_text':BetData.bet_oid_list.includes(ol_list_1[ol_index1 - 1].oid)},'size-color']">
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
                                <div class="size-color ellipsis remark details_t_color7 fz_12" :class="{'is-score':check_score(ol_list_1[ol_index1 - 1].on)}" v-show="get_detail_data.csid != 1">{{ ol_list_1[ol_index1 - 1].on }}</div>
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
                                <div class="size-color ellipsis remark details_t_color6 fz_12" :class="{'is-score':check_score(ol_list_1[ol_index1 - 1].on)}" v-show="get_detail_data.csid != 1">{{ ol_list_1[ol_index1 - 1].on }}</div>
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
                            <div class="size-color ellipsis remark details_t_color7 fz_12" :class="{'is-score':check_score(ol_list_1[ol_index1 - 1].on)}" v-show="get_detail_data.csid != 1">{{ ol_list_1[ol_index1 - 1].on }}</div>
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
                    
                    <div class="item-col-item" v-else>
                      <div :key="ol_index" class="play-box-style details_color warp bor-style"></div>
                    </div>
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
                                :class="[BetData.bet_oid_list.includes(ol_item.oid)?'details-bg5':'',{'win':calc_win(ol_item.result)}]">
                              <div class="ellipsis-t remark details_t_color6 fz_12">
                              <span :class="[{'is-score':check_score(ol_item.on),'white_text':BetData.bet_oid_list.includes(ol_item.oid)}]">
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
                              <div class="ellipsis remark details_t_color7 fz_12" v-show="get_detail_data.csid != 1">{{ ol_item.on }}</div>
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
                              <div class="ellipsis remark details_t_color6 fz_12" v-show="get_detail_data.csid != 1">{{ ol_item.on }}</div>
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
                          <div class="ellipsis remark details_t_color7 fz_12" v-show="get_detail_data.csid != 1">{{ ol_item.on }}</div>
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
          <div  v-if="!hide_show_more_layout" style="padding: .04rem 0.08rem;border-radius: .04rem;overflow: hidden;">
            <div class="show-more play-box-style"  @click="change_show">
              <span class="fz_13">{{show_more?i18n_t('match_info.pack_up'):i18n_t('match_info.show_more')}}</span>
            </div>
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
import { LOCAL_PROJECT_FILE_PREFIX,MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance ,calc_win } from 'src/output/index.js';
import lodash from "lodash";
import store from "src/store-redux/index.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent, ref } from "vue";
import { useRoute } from "vue-router"
import { i18n_t } from "src/boot/i18n.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
//国际化
import BetData from "src/core/bet/class/bet-data-class.js"
import { go_to_bet } from "src/core/bet/class/bet-box-submit.js";
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
    let state_data = reactive({
      show_more:true,
    })
  const element = ref()
  const other_item_list = ref([])
  const ol_list_0 = ref([])
  const ol_list_1 = ref([])
  const ol_list_2 = ref([])
  const max_count_ol = ref([])
    // #TODO vuex
    // computed: {
    // ...mapGetters([
    // "get_cur_odd",
    // "get_detail_data",
    // // 收到C105推送赔率,生成一个浮点, 伪随机数在范围从0到小于1
    // "get_flag_get_ol_list"
    // ]),

    const get_cur_odd = computed(() => {
      return ""
    });
    const get_flag_get_ol_list = computed(() => {
      return ""
    });
    const get_detail_data = computed(() => {
      return MatchDataWarehouseInstance.get_quick_mid_obj(route.params.mid||lodash.get(props.item_data,'mid'))
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
     * @description: 参考iphone6,7,8窗口宽度(375)模拟rem
     * @param {Number} value 需要转换的值
     * @return {Number}
     */
    const rem = (value) => {
      let font_size = (innerWidth * 100) / 375;
      return Math.ceil(value * font_size);
    };
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
    return {
      ...toRefs(state_data),
      calc_win,
      i18n_t,
      BetData,
      get_cur_odd,
      max_count_ol,
      ol_list_0,
      ol_list_1,
      ol_list_2,
      get_detail_data,
      // 收到C105推送赔率,生成一个浮点, 伪随机数在范围从0到小于1
      get_flag_get_ol_list,
      hide_show_more_layout,
      change_show,
      check_score,
      set_highlight_cls,
      LOCAL_PROJECT_FILE_PREFIX,
      go_to_bet,
      element,
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
  padding-left: 0.04rem;
  &:nth-child(2n) {
    margin-right: 0;
    padding-right: 0.04rem;
  }
}

.item-wrap {
  min-height: 0.32rem;
  height: auto;
  border-radius: .04rem;
  overflow: hidden;
}

.item-col-item {
  padding:0.04rem;
}

.show-more {
  color: var(--q-color-com-fs-color-11);
  align-items: center;
  justify-content: center;
  padding:0 20px;
  border-radius: .04rem !important;
  overflow: hidden;
}

.play-box-style {
  width: 100%;
  height: 0.52rem;
  line-height: 0.52rem;
  background:var(--q-gb-bg-c-28);
  padding: 0 0.15rem;
  display: flex;
  justify-content: center;
  border-radius: .04rem;
  overflow: hidden;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.04);
}

.bor-style {
  border: none !important;
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
  font-size: 0.12rem;
  &.highlight {
    font-size: 16px;
    color: var(--q-color-fs-color-51);
  }
}

.odds-wrap {
  width: 0.45rem;
}

.lock-style {
  width: 100%;
  height: 0.3rem;
  line-height: 0.3rem;
  margin-bottom: 0.02rem;
  border-radius: 0.04rem;
  padding: 0 0.1rem;
  text-align: center;
  display: block;
}

.icon-lock {
  width: 0.16rem;
  height: 0.16rem;
  vertical-align: middle;
}

</style>