<!--
 * @Description: 模板id=4 例如(全场比分) --用于无盘口&区分主客的多个投注项玩法
 * hs 盘口级别状态 0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态
 * ms 赛事状态 0:未开赛 1:赛事进行中  2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
 * os 1:开盘 2:封盘 3:关盘
-->
<template>
   <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="component temp4 mx-5">
    <div class="hairline-border">
      <div class="row title-style ">
        <div class="col text-center ellipsis fam">{{item_data.title[0].osn}}</div>
        <div class="col text-center ellipsis fam">{{item_data.title[1].osn}}</div>
        <div class="col text-center ellipsis fam" v-if="item_data.title.length > 2">{{item_data.title[2].osn}}</div>
      </div>
      <div class="item-wrap">
          <div v-for="(item,index) in item_data.hl" :key="index">
            <div class="row" v-if="index > 0 || index == 0">
              <!-- 左 -->
              <div class="col ">
                <template v-for="(ol_index0,ol_index) in max_count_ol">
                  <template v-if="ol_list_0[ol_index0 - 1]">
                    <div :key="ol_index" :data-ii="ol_index0 - 1" class="mg-4-bg">
                      <!--  0开 2关 1封 11锁 -->
                      <!-- 开盘or锁盘 正常显示 -->
                      <template v-if="ol_list_0[ol_index0 - 1]._mhs == 0 || ol_list_0[ol_index0 - 1]._mhs == 11">
                        <template v-if="ol_list_0[ol_index0 - 1]._hs == 0 || ol_list_0[ol_index0 - 1]._hs == 11">
                          <template v-if="ol_list_0[ol_index0 - 1].os == 1">
                            <!-- 主程序 start -->
                            <div
                                class="play-box-style details_color warp"
                                @click="go_to_bet(ol_list_0[ol_index0 - 1])"
                                :class="{
                                  'details-bg5 first-rad': BetData.bet_oid_list.includes(ol_list_0[ol_index0 - 1].oid),
                                  'bor-style': ol_index != max_count_ol-1,
                                  'win': calc_win(ol_list_0[ol_index0 - 1].result),
                                  'is-like-bodan-play': ['344'].includes(item_data.hpid)
                                }">
                              <div class="size-color ellipsis remark details_t_color7  fz_12">{{['367','368','369'].includes(item_data.hpid)?i18n_t('detail.non') : ''}}</div>
                              <div class="size-color ellipsis remark details_t_color6  fz_12" :class="[{'white_text':BetData.bet_oid_list.includes(ol_list_0[ol_index0 - 1].oid)}]">
                                {{ol_list_0[ol_index0 - 1].on}}
                              </div>
                              <div class="odds-wrap" :class="{'text-right': !['344'].includes(item_data.hpid)}">
                                <odds-new :item_data="item_data" :ol_data="ol_list_0[ol_index0 - 1]" ></odds-new>
                              </div>
                            </div>
                            <!-- 主程序 end -->
                          </template>
                          <template v-if="ol_list_0[ol_index0 - 1].os == 2">
                            <!-- lock 锁状态 start -->
                            <div class="play-box-style details_color warp" :class="ol_index != max_count_ol-1?'bor-style':''">
                              <div class="size-color-imp ellipsis remark details_t_color7  fz_12" v-show="get_detail_data?.csid != 1">{{ol_list_0[ol_index0 - 1].on}}</div>
                              <div class="text-left mar-left">
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
                            <div class="play-box-style details_color warp" :class="ol_index != max_count_ol-1 ?'bor-style':''">
                              <div class="size-color-imp ellipsis remark details_t_color6  fz_12" v-show="get_detail_data?.csid != 1">{{ol_list_0[ol_index0 - 1].on}}</div>
                              <div class="text-left mar-left">
                                <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                              </div>
                            </div>
                            <!-- lock 锁状态 end -->
                          </template>
                        </template>
                        <template v-if="ol_list_0[ol_index0 - 1]._hs == 2">
                          <!-- 盘口级别状态关盘时，要占位 -->
                          <div class="play-box-style details_color" :class="ol_index != max_count_ol-1?'bor-style':''">
                          </div>
                        </template>
                      </template>
                      <!-- 封盘，一把锁的居中显示 -->
                      <template v-if="ol_list_0[ol_index0 - 1]._mhs == 1">
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color warp" :class="ol_index != max_count_ol-1?'bor-style':''">
                          <div class="size-color-imp ellipsis remark details_t_color7  fz_12" v-show="get_detail_data?.csid != 1">{{ol_list_0[ol_index0 - 1].on}}</div>
                          <div class="text-left mar-left">
                            <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                          </div>
                        </div>
                        <!-- lock 锁状态 end -->
                      </template>
                      <!-- 关盘 -->
                      <template v-if="ol_list_0[ol_index0 - 1]._mhs == 2">
                        <div class="play-box-style details_color" :class="ol_index != max_count_ol-1?'bor-style':''"></div>
                      </template>
                    </div>
                  </template>
                  <template v-else>
                    <div :key="ol_index" class="play-box-style details_color warp mg-4-bg" :class="ol_index != max_count_ol-1?'bor-style':''"></div>
                  </template>
                </template>
              </div>

              <!-- 中 -->
              <div class="col" :class="{'col-middle': ['344'].includes(item_data.hpid)}">
                <template v-for="(ol_index1,ol_index) in max_count_ol">
                  <template v-if="ol_list_1[ol_index1 - 1]">
                    <div :key="ol_index" :data-oid="ol_list_1[ol_index1 - 1].oid" class="mg-4-bg">
                      <!--  0开 2关 1封 11锁 -->
                      <!-- 开盘or锁盘 正常显示 -->
                      <template v-if="ol_list_1[ol_index1 - 1]._mhs == 0 || ol_list_1[ol_index1 - 1]._mhs == 11">
                        <template v-if="ol_list_1[ol_index1 - 1]._hs == 0 || ol_list_1[ol_index1 - 1]._hs == 11">
                          <template v-if="ol_list_1[ol_index1 - 1].os == 1">
                            <!-- 主程序 start -->
                            <div
                                class="play-box-style details_color warp"
                                @click="go_to_bet(ol_list_1[ol_index1 - 1])"
                                :class="{
                                  'details-bg5 first-rad': BetData.bet_oid_list.includes(ol_list_1[ol_index1 - 1].oid),
                                  'bor-style': ol_index != max_count_ol-1,
                                  'win': calc_win(ol_list_1[ol_index1 - 1].result),
                                  'is-like-bodan-play': ['344'].includes(item_data.hpid)
                                }"
                            >
                              <div class="size-color ellipsis remark details_t_color7  fz_12">{{['367','368','369'].includes(item_data.hpid)?i18n_t('detail.non') : ''}}</div>
                              <div class="size-color ellipsis remark details_t_color6  fz_12" :class="[{'white_text':BetData.bet_oid_list.includes(ol_list_1[ol_index1 - 1].oid)}]">
                                {{ol_list_1[ol_index1 - 1].on}}
                              </div>
                              <div class="odds-wrap" :class="{'text-right': !['344'].includes(item_data.hpid)}">
                                <odds-new :item_data="item_data" :ol_data="ol_list_1[ol_index1 - 1]" ></odds-new>
                              </div>
                            </div>
                            <!-- 主程序 end -->
                          </template>
                          <template v-if="ol_list_1[ol_index1 - 1].os == 2">
                            <!-- lock 锁状态 start -->
                            <div class="play-box-style details_color warp" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                              <div class="size-color-imp ellipsis remark details_t_color7  fz_12" v-show="get_detail_data?.csid != 1">{{ol_list_1[ol_index1 - 1].on}}</div>
                              <div class="text-left mar-left">
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
                            <div class="play-box-style details_color warp" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                              <div class="size-color-imp ellipsis remark details_t_color6  fz_12" v-show="get_detail_data?.csid != 1">{{ol_list_1[ol_index1 - 1].on}}</div>
                              <div class="text-left mar-left">
                                <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                              </div>
                            </div>
                            <!-- lock 锁状态 end -->
                          </template>
                        </template>
                        <template v-if="ol_list_1[ol_index1 - 1]._hs == 2">
                          <!-- 盘口级别状态关盘时，要占位 -->
                          <div class="play-box-style details_color" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                          </div>
                        </template>
                      </template>
                      <!-- 封盘，一把锁的居中显示 -->
                      <template v-if="ol_list_1[ol_index1 - 1]._mhs == 1">
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color warp" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                          <div class="size-color-imp ellipsis remark details_t_color7  fz_12" v-show="get_detail_data?.csid != 1">{{ol_list_1[ol_index1 - 1].on}}</div>
                          <div class="text-left mar-left ">
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
                    <div :key="ol_index" class="play-box-style details_color warp mg-4-bg" :class="ol_index != max_count_ol-1 ? 'bor-style':''"></div>
                  </template>
                </template>
              </div>

              <!-- 右 -->
              <div class="col">
                <template v-for="(ol_index2,ol_index) in max_count_ol">
                  <template v-if="ol_list_2[ol_index2 - 1]">
                    <div :key="ol_index" class="mg-4-bg">
                      <!--  0开 2关 1封 11锁 -->
                      <!-- 开盘or锁盘 正常显示 -->
                      <template v-if="ol_list_2[ol_index2 - 1]._mhs == 0 || ol_list_2[ol_index2 - 1]._mhs == 11">
                        <template v-if="ol_list_2[ol_index2 - 1]._hs == 0 || ol_list_2[ol_index2 - 1]._hs == 11">
                          <template v-if="ol_list_2[ol_index2 - 1].os == 1">
                            <!-- 主程序 start -->
                            <div
                                class="play-box-style details_color"
                                @click="go_to_bet(ol_list_2[ol_index2 - 1])"
                                :class="{
                                  'details-bg5 first-rad': BetData.bet_oid_list.includes(ol_list_2[ol_index2 - 1].oid),
                                  'bor-style': ol_index != max_count_ol-1,
                                  'win': calc_win(ol_list_2[ol_index2 - 1].result),
                                  'is-like-bodan-play': ['344'].includes(item_data.hpid)
                                }"
                            >
                              <div class="size-color ellipsis remark details_t_color7  fz_12">{{['367','368','369'].includes(item_data.hpid)?i18n_t('detail.non') : ''}}</div>
                              <div class="size-color ellipsis remark details_t_color6  fz_12" :class="[{'white_text':BetData.bet_oid_list.includes(ol_list_2[ol_index2 - 1].oid)}]">
                                {{ol_list_2[ol_index2 - 1].on}}
                              </div>
                              <div class="odds-wrap" :class="{'text-right': !['344'].includes(item_data.hpid)}">
                                <odds-new :item_data="item_data" :ol_data="ol_list_2[ol_index2 - 1]" ></odds-new>
                              </div>
                            </div>
                            <!-- 主程序 end -->
                          </template>
                          <template v-if="ol_list_2[ol_index2 - 1].os == 2">
                            <!-- lock 锁状态 start -->
                            <div class="play-box-style details_color" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                              <div class="size-color-imp ellipsis remark details_t_color7  fz_12" v-show="get_detail_data?.csid != 1">{{ol_list_2[ol_index2 - 1].on}}</div>
                              <div class="text-left mar-left">
                                <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                              </div>
                            </div>
                            <!-- lock 锁状态 end -->
                          </template>
                          <template v-if="ol_list_2[ol_index2 - 1].os == 3"></template>
                        </template>
                        <template v-if="ol_list_2[ol_index2 - 1]._hs == 1">
                          <template v-if="ol_list_2[ol_index2 - 1].os == 3"></template>
                          <template v-else>
                            <!-- lock 锁状态 start -->
                            <div class="play-box-style details_color" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                              <div class="size-color-imp ellipsis remark details_t_color6  fz_12" v-show="get_detail_data?.csid != 1">{{ol_list_2[ol_index2 - 1].on}}</div>
                              <div class="text-left mar-left">
                                <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                              </div>
                            </div>
                            <!-- lock 锁状态 end -->
                          </template>
                        </template>
                        <template v-if="ol_list_2[ol_index2 - 1]._hs == 2">
                          <!-- 盘口级别状态关盘时，要占位 -->
                          <div class="play-box-style details_color" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                          </div>
                        </template>
                      </template>
                      <!-- 封盘，一把锁的居中显示 -->
                      <template v-if="ol_list_2[ol_index2 - 1]._mhs == 1">
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                          <div class="size-color-imp ellipsis remark details_t_color7  fz_12" v-show="get_detail_data?.csid != 1">{{ol_list_2[ol_index2 - 1].on}}</div>
                          <div class="text-left mar-left">
                            <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                          </div>
                        </div>
                        <!-- lock 锁状态 end -->
                      </template>
                      <!-- 关盘 -->
                      <template v-if="ol_list_2[ol_index2 - 1]._mhs == 2"></template>
                    </div>
                  </template>
                  <template v-else>
                    <div :key="ol_index" class="play-box-style details_color warp mg-4-bg" :class="ol_index != max_count_ol-1 ? 'bor-style':''" ></div>
                  </template>
                </template>
              </div>
            </div>

            <!-- 其他 横向一列 -->
            <div class="row other margin-other radius-4" v-for="(ol_item,ol_index) of other_item_list" :key="ol_index">

              <!--  0开 2关 1封 11锁 -->
              <!-- 开盘or锁盘 正常显示 -->
              <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                  <template v-if="ol_item.os == 1">
                    <!-- 主程序 start -->
                    <div
                        class="play-box-style details_color"
                        @click="go_to_bet(ol_item)"
                        :class="[BetData.bet_oid_list.includes(ol_item.oid)?'details-bg5':'',{'win':calc_win(ol_item.result)}]">
                      <div class="ellipsis details_t_color6 fz_12" :class="{'text-right': !['344'].includes(item_data.hpid)}">
                        <span :class="[{'white_text':BetData.bet_oid_list.includes(ol_item.oid)}]">
                          {{ol_item.on}}
                        </span>
                      </div>
                      <div class="odds-wrap" :class="{'text-right': !['344'].includes(item_data.hpid)}">
                        <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                      </div>
                    </div>
                    <!-- 主程序 end -->
                  </template>
                  <template v-if="ol_item.os == 2">
                    <!-- lock 锁状态 start -->
                    <div class="play-box-style details_color">
                      <div
                        v-show="get_detail_data?.csid != 1"
                        class="ellipsis remark details_t_color7 fz_12"
                        :class="{'text-right': !['344'].includes(item_data.hpid)}"
                       >{{ol_item.on}}</div>
                      <div class="text-left mar-left">
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
                      <div
                          v-show="get_detail_data?.csid != 1"
                          class="ellipsis remark details_t_color6 fz_12"
                          :class="{'text-right': !['344'].includes(item_data.hpid)}"
                      >{{ol_item.on}}</div>
                      <div class="text-left mar-left">
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
                  <div
                      v-show="get_detail_data?.csid != 1"
                      class="ellipsis remark details_t_color7 fz_12"
                      :class="{'text-right': !['344'].includes(item_data.hpid)}"
                  >{{ol_item.on}}</div>
                  <div class="text-left mar-left">
                    <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                  </div>
                </div>
                <!-- lock 锁状态 end -->
              </template>
              <!-- 关盘 -->
              <template v-if="ol_item._mhs == 2"></template>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex
// import { mapGetters, mapMutations } from "vuex";
import oddsNew from "src/base-h5/components/details/components/tournament-play/unit/odds-new.vue";
// import odd_convert from "src/base-h5/mixins/odds_conversion/odds_conversion.js";
import {LOCAL_PROJECT_FILE_PREFIX,MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance ,calc_win } from 'src/output/index.js';
import matchDetailClass from "src/core/match-detail/match-detail-class";
import lodash from "lodash";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent, ref } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
import { useRoute } from "vue-router";
import BetData from "src/core/bet/class/bet-data-class.js";
import { go_to_bet } from "src/core/bet/class/bet-box-submit.js";
export default defineComponent({
  // #TODO mixins
  // mixins: [odd_convert],
  name: "temp4",
  props: ["item_data", "title"],
  components: {
    oddsNew,
  },
  setup(props, evnet) {
    const other_item_list = ref([])
    const ol_list_0 = ref([])
    const ol_list_1 = ref([])
    const ol_list_2 = ref([])
    const max_count_ol = ref([])
    // #TODO vuex
    // computed: {
    //   ...mapGetters(["BetData.bet_oid_list","get_cur_odd","get_flag_get_ol_list", "get_menu_type","get_detail_data"]),
    //   change_ms(){
    //     return lodash.get(props.item_data,'hl[0].ol[0].os')
    //   }
    // },
    const get_cur_odd = computed(() => {
      return ""
    });
    const get_flag_get_ol_list = computed(() => {
      return ""
    });
    const get_menu_type = computed(() => {
      return ""
    });
      const route = useRoute()
    const get_detail_data = computed(() => {
      return MatchDataWarehouseInstance.get_quick_mid_obj(route.params.mid||lodash.get(props.item_data,'mid'))
    });


    const change_ms = computed(() => {
      return lodash.get(props.item_data,'hl[0].ol[0].os')
    });
    // watch(
    //   () =>matchDetailClass.details_data_version.version, () => {
    //     max_count_ol.value = get_ol_list();
    //   }
    // );
    watch(
      () => change_ms,
      (new_) => {
        if(new_ == 2 && get_menu_type == 900){
          max_count_ol.value = get_ol_list();
        }
      }
    );
    onMounted(() => {
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
    return {
      calc_win,
      change_ms,
      ol_list_0,
      ol_list_1,
      ol_list_2,
      BetData,
      get_cur_odd,
      get_flag_get_ol_list,
      get_menu_type,
      get_detail_data,
      other_item_list,
      max_count_ol,
      LOCAL_PROJECT_FILE_PREFIX,
      go_to_bet
    }
  }
})
</script>

<style lang="scss" scoped>
.title-style {
  height: 0.35rem;
  line-height: 0.35rem;
  margin-bottom: 0;
  background-color: var(--q-match-page-bg-color-105);
}

.item-wrap {
  border-radius: 4px;
  min-height: 0.32rem;
  height: auto;
  overflow: hidden;
  padding:0.08rem;
  border-top: unset !important;
  .col-middle {
    flex: 0 0 .9rem;
  }
  .col > div {
    border-right: 1px solid rgba(0,0,0,0.01);
  }
}

.play-box-style {
  width: 100%;
  height: 0.52rem;
  line-height: 0.52rem;
 border-radius: .04rem;
  overflow: hidden;
  padding: 0 0.15rem;
  display: flex;
  justify-content: center;
  &.is-like-bodan-play {
    flex-direction: column;
    text-align: center;
    padding: .06rem .07rem;
    line-height: .2rem;
  }
  &.warp.mg-4-bg{
    width: auto;
  }
}


.remark {
  flex: 1;

  letter-spacing: 0;
}

.odds-wrap {
  width: 0.51rem;
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


.icon-lock {
  width: 0.16rem;
  height: 0.16rem;
  vertical-align: middle;
}

.fam {
  height: 0.35rem;
  line-height: 0.35rem;

  font-size: 0.13rem;

  max-width: 1rem;
  margin: 0 auto;
  color: var(--q-gb-t-c-19);
}

.lock-margin {
  padding-left: 0.2rem;
}
.margin-base{
  margin:0.04rem;
}
.mg-4-bg{
  @extend .margin-base;
  background:var(--q-gb-bg-c-15) !important;
  border-radius: .04rem;
  overflow: hidden;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.04);
}
.margin-other {
  @extend .margin-base;
  .play-box-style{
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.04);
     border-radius: .04rem;
    overflow: hidden;
  }
}
// .mgb4{
//   margin-bottom:4px
// }

// 统一间距
.mg-4-bg {
  margin-left: 0.02rem !important;
  margin-right: 0.02rem !important;
}
// 最后一行
.margin-other {
  margin-top: 0;
  margin-left: 0.02rem !important;
  margin-right: 0.02rem !important;
}
</style>