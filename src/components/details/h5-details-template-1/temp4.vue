<!--
 * @Description: 模板id=4 例如(全场比分) --用于无盘口&区分主客的多个投注项玩法
 * hs 盘口级别状态 0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态
 * ms 赛事状态 0:未开赛 1:赛事进行中  2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
 * os 1:开盘 2:封盘 3:关盘
-->
<template>
  <div class="temp4 mx-10">
    <div class="hairline-border">
      <div class="row title-style ">
        <div class="col text-center ellipsis fam">{{item_data.title[0].osn}}</div>
        <div class="col text-center ellipsis fam">{{item_data.title[1].osn}}</div>
        <div class="col text-center ellipsis fam" v-if="item_data.title.length > 2">{{item_data.title[2].osn}}</div>
      </div>
      <div class="item-wrap">
        <template>
          <div v-for="(item,index) in item_data.hl" :key="index">
            <div class="row" v-if="index > 0 || index == 0">
              <!-- 左 -->
              <div class="col">
                <template v-for="(ol_index0,ol_index) in max_count_ol">
                  <template v-if="ol_list_0[ol_index0 - 1]">
                    <div :key="ol_index" :data-ii="ol_index0 - 1">
                      <!--  0开 2关 1封 11锁 -->
                      <!-- 开盘or锁盘 正常显示 -->
                      <template v-if="ol_list_0[ol_index0 - 1].ms == 0 || ol_list_0[ol_index0 - 1].ms == 11">
                        <template v-if="ol_list_0[ol_index0 - 1].hs == 0 || ol_list_0[ol_index0 - 1].hs == 11">
                          <template v-if="ol_list_0[ol_index0 - 1].os == 1">
                            <!-- 主程序 start -->
                            <div
                                class="play-box-style details_color warp"
                                @click="go_to_bet(ol_list_0[ol_index0 - 1])"
                                :class="{
                                  'details-bg5 first-rad': get_bet_list.includes(ol_list_0[ol_index0 - 1].id_),
                                  'bor-style': ol_index != max_count_ol-1,
                                  'win': calc_win(ol_list_0[ol_index0 - 1].result),
                                  'is-like-bodan-play': ['344'].includes(item_data.hpid)
                                }">
                              <div class="size-color ellipsis remark details_t_color6 fz_16" :class="[{'white_text':get_bet_list.includes(ol_list_0[ol_index0 - 1].id_)}]">
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
                              <div class="size-color-imp ellipsis remark details_t_color7 fz_16" v-show="get_detail_data.csid != 1">{{ol_list_0[ol_index0 - 1].on}}</div>
                              <div class="text-left mar-left">
                                <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                              </div>
                            </div>
                            <!-- lock 锁状态 end -->
                          </template>
                          <template v-if="ol_list_0[ol_index0 - 1].os == 3"></template>
                        </template>
                        <template v-if="ol_list_0[ol_index0 - 1].hs == 1">
                          <template v-if="ol_list_0[ol_index0 - 1].os == 3"></template>
                          <template v-else>
                            <!-- lock 锁状态 start -->
                            <div class="play-box-style details_color warp" :class="ol_index != max_count_ol-1 ?'bor-style':''">
                              <div class="size-color-imp ellipsis remark details_t_color6 fz_16" v-show="get_detail_data.csid != 1">{{ol_list_0[ol_index0 - 1].on}}</div>
                              <div class="text-left mar-left">
                                <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                              </div>
                            </div>
                            <!-- lock 锁状态 end -->
                          </template>
                        </template>
                        <template v-if="ol_list_0[ol_index0 - 1].hs == 2">
                          <!-- 盘口级别状态关盘时，要占位 -->
                          <div class="play-box-style details_color" :class="ol_index != max_count_ol-1?'bor-style':''">
                          </div>
                        </template>
                      </template>
                      <!-- 封盘，一把锁的居中显示 -->
                      <template v-if="ol_list_0[ol_index0 - 1].ms == 1">
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color warp" :class="ol_index != max_count_ol-1?'bor-style':''">
                          <div class="size-color-imp ellipsis remark details_t_color7 fz_16" v-show="get_detail_data.csid != 1">{{ol_list_0[ol_index0 - 1].on}}</div>
                          <div class="text-left mar-left">
                            <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                          </div>
                        </div>
                        <!-- lock 锁状态 end -->
                      </template>
                      <!-- 关盘 -->
                      <template v-if="ol_list_0[ol_index0 - 1].ms == 2">
                        <div class="play-box-style details_color" :class="ol_index != max_count_ol-1?'bor-style':''"></div>
                      </template>
                    </div>
                  </template>
                  <template v-else>
                    <div :key="ol_index" class="play-box-style details_color warp" :class="ol_index != max_count_ol-1?'bor-style':''"></div>
                  </template>
                </template>
              </div>

              <!-- 中 -->
              <div class="col" :class="{'col-middle': ['344'].includes(item_data.hpid)}">
                <template v-for="(ol_index1,ol_index) in max_count_ol">
                  <template v-if="ol_list_1[ol_index1 - 1]">
                    <div :key="ol_index" :data-oid="ol_list_1[ol_index1 - 1].oid">
                      <!--  0开 2关 1封 11锁 -->
                      <!-- 开盘or锁盘 正常显示 -->
                      <template v-if="ol_list_1[ol_index1 - 1].ms == 0 || ol_list_1[ol_index1 - 1].ms == 11">
                        <template v-if="ol_list_1[ol_index1 - 1].hs == 0 || ol_list_1[ol_index1 - 1].hs == 11">
                          <template v-if="ol_list_1[ol_index1 - 1].os == 1">
                            <!-- 主程序 start -->
                            <div
                                class="play-box-style details_color warp"
                                @click="go_to_bet(ol_list_1[ol_index1 - 1])"
                                :class="{
                                  'details-bg5 first-rad': get_bet_list.includes(ol_list_1[ol_index1 - 1].id_),
                                  'bor-style': ol_index != max_count_ol-1,
                                  'win': calc_win(ol_list_1[ol_index1 - 1].result),
                                  'is-like-bodan-play': ['344'].includes(item_data.hpid)
                                }"
                            >
                              <div class="size-color ellipsis remark details_t_color6 fz_16" :class="[{'white_text':get_bet_list.includes(ol_list_1[ol_index1 - 1].id_)}]">
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
                              <div class="size-color-imp ellipsis remark details_t_color7 fz_16" v-show="get_detail_data.csid != 1">{{ol_list_1[ol_index1 - 1].on}}</div>
                              <div class="text-left mar-left">
                                <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                              </div>
                            </div>
                            <!-- lock 锁状态 end -->
                          </template>
                          <template v-if="ol_list_1[ol_index1 - 1].os == 3"></template>
                        </template>
                        <template v-if="ol_list_1[ol_index1 - 1].hs == 1">
                          <template v-if="ol_list_1[ol_index1 - 1].os == 3"></template>
                          <template v-else>
                            <!-- lock 锁状态 start -->
                            <div class="play-box-style details_color warp" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                              <div class="size-color-imp ellipsis remark details_t_color6 fz_16" v-show="get_detail_data.csid != 1">{{ol_list_1[ol_index1 - 1].on}}</div>
                              <div class="text-left mar-left">
                                <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                              </div>
                            </div>
                            <!-- lock 锁状态 end -->
                          </template>
                        </template>
                        <template v-if="ol_list_1[ol_index1 - 1].hs == 2">
                          <!-- 盘口级别状态关盘时，要占位 -->
                          <div class="play-box-style details_color" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                          </div>
                        </template>
                      </template>
                      <!-- 封盘，一把锁的居中显示 -->
                      <template v-if="ol_list_1[ol_index1 - 1].ms == 1">
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color warp" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                          <div class="size-color-imp ellipsis remark details_t_color7 fz_16" v-show="get_detail_data.csid != 1">{{ol_list_1[ol_index1 - 1].on}}</div>
                          <div class="text-left mar-left ">
                            <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                          </div>
                        </div>
                        <!-- lock 锁状态 end -->
                      </template>
                      <!-- 关盘 -->
                      <template v-if="ol_list_1[ol_index1 - 1].ms == 2"></template>
                    </div>
                  </template>
                  <template v-else>
                    <div :key="ol_index" class="play-box-style details_color warp" :class="ol_index != max_count_ol-1 ? 'bor-style':''"></div>
                  </template>
                </template>
              </div>

              <!-- 右 -->
              <div class="col">
                <template v-for="(ol_index2,ol_index) in max_count_ol">
                  <template v-if="ol_list_2[ol_index2 - 1]">
                    <div :key="ol_index">
                      <!--  0开 2关 1封 11锁 -->
                      <!-- 开盘or锁盘 正常显示 -->
                      <template v-if="ol_list_2[ol_index2 - 1].ms == 0 || ol_list_2[ol_index2 - 1].ms == 11">
                        <template v-if="ol_list_2[ol_index2 - 1].hs == 0 || ol_list_2[ol_index2 - 1].hs == 11">
                          <template v-if="ol_list_2[ol_index2 - 1].os == 1">
                            <!-- 主程序 start -->
                            <div
                                class="play-box-style details_color"
                                @click="go_to_bet(ol_list_2[ol_index2 - 1])"
                                :class="{
                                  'details-bg5 first-rad': get_bet_list.includes(ol_list_2[ol_index2 - 1].id_),
                                  'bor-style': ol_index != max_count_ol-1,
                                  'win': calc_win(ol_list_2[ol_index2 - 1].result),
                                  'is-like-bodan-play': ['344'].includes(item_data.hpid)
                                }"
                            >
                              <div class="size-color ellipsis remark details_t_color6 fz_16" :class="[{'white_text':get_bet_list.includes(ol_list_2[ol_index2 - 1].id_)}]">
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
                              <div class="size-color-imp ellipsis remark details_t_color7 fz_16" v-show="get_detail_data.csid != 1">{{ol_list_2[ol_index2 - 1].on}}</div>
                              <div class="text-left mar-left">
                                <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                              </div>
                            </div>
                            <!-- lock 锁状态 end -->
                          </template>
                          <template v-if="ol_list_2[ol_index2 - 1].os == 3"></template>
                        </template>
                        <template v-if="ol_list_2[ol_index2 - 1].hs == 1">
                          <template v-if="ol_list_2[ol_index2 - 1].os == 3"></template>
                          <template v-else>
                            <!-- lock 锁状态 start -->
                            <div class="play-box-style details_color" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                              <div class="size-color-imp ellipsis remark details_t_color6 fz_16" v-show="get_detail_data.csid != 1">{{ol_list_2[ol_index2 - 1].on}}</div>
                              <div class="text-left mar-left">
                                <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                              </div>
                            </div>
                            <!-- lock 锁状态 end -->
                          </template>
                        </template>
                        <template v-if="ol_list_2[ol_index2 - 1].hs == 2">
                          <!-- 盘口级别状态关盘时，要占位 -->
                          <div class="play-box-style details_color" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                          </div>
                        </template>
                      </template>
                      <!-- 封盘，一把锁的居中显示 -->
                      <template v-if="ol_list_2[ol_index2 - 1].ms == 1">
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color" :class="ol_index != max_count_ol-1 ? 'bor-style':''">
                          <div class="size-color-imp ellipsis remark details_t_color7 fz_16" v-show="get_detail_data.csid != 1">{{ol_list_2[ol_index2 - 1].on}}</div>
                          <div class="text-left mar-left">
                            <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                          </div>
                        </div>
                        <!-- lock 锁状态 end -->
                      </template>
                      <!-- 关盘 -->
                      <template v-if="ol_list_2[ol_index2 - 1].ms == 2"></template>
                    </div>
                  </template>
                  <template v-else>
                    <div :key="ol_index" class="play-box-style details_color" :class="ol_index != max_count_ol-1 ? 'bor-style':''" ></div>
                  </template>
                </template>
              </div>
            </div>

            <!-- 其他 横向一列 -->
            <div class="row other margin-other radius-4" v-for="(ol_item,ol_index) of other_item_list" :key="ol_index">

              <!--  0开 2关 1封 11锁 -->
              <!-- 开盘or锁盘 正常显示 -->
              <template v-if="ol_item.ms == 0 || ol_item.ms == 11">
                <template v-if="ol_item.hs == 0 || ol_item.hs == 11">
                  <template v-if="ol_item.os == 1">
                    <!-- 主程序 start -->
                    <div
                        class="play-box-style details_color"
                        @click="go_to_bet(ol_item)"
                        :class="[get_bet_list.includes(ol_item.id_)?'details-bg5':'',{'win':calc_win(ol_item.result)}]">
                      <div class="ellipsis details_t_color6 fz_13" :class="{'text-right': !['344'].includes(item_data.hpid)}">
                        <span :class="[{'white_text':get_bet_list.includes(ol_item.id_)}]">
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
                        v-show="get_detail_data.csid != 1"
                        class="ellipsis remark details_t_color7 fz_13"
                        :class="{'text-right': !['344'].includes(item_data.hpid)}"
                       >{{ol_item.on}}</div>
                      <div class="text-left mar-left">
                        <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                      </div>
                    </div>
                    <!-- lock 锁状态 end -->
                  </template>
                  <template v-if="ol_item.os == 3"></template>
                </template>
                <template v-if="ol_item.hs == 1">
                  <template v-if="ol_item.os == 3"></template>
                  <template v-else>
                    <!-- lock 锁状态 start -->
                    <div class="play-box-style details_color">
                      <div
                          v-show="get_detail_data.csid != 1"
                          class="ellipsis remark details_t_color6 fz_13"
                          :class="{'text-right': !['344'].includes(item_data.hpid)}"
                      >{{ol_item.on}}</div>
                      <div class="text-left mar-left">
                        <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                      </div>
                    </div>
                    <!-- lock 锁状态 end -->
                  </template>
                </template>
                <template v-if="ol_item.hs == 2">
                  <!-- 盘口级别状态关盘时，要占位 -->
                  <div class="play-box-style details_color">
                  </div>
                </template>
              </template>
              <!-- 封盘，一把锁的居中显示 -->
              <template v-if="ol_item.ms == 1">
                <!-- lock 锁状态 start -->
                <div class="play-box-style details_color">
                  <div
                      v-show="get_detail_data.csid != 1"
                      class="ellipsis remark details_t_color7 fz_13"
                      :class="{'text-right': !['344'].includes(item_data.hpid)}"
                  >{{ol_item.on}}</div>
                  <div class="text-left mar-left">
                    <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                  </div>
                </div>
                <!-- lock 锁状态 end -->
              </template>
              <!-- 关盘 -->
              <template v-if="ol_item.ms == 2"></template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex 
// import { mapGetters, mapMutations } from "vuex";
import odds_new from "src/base-h5/components/details/components/tournament_play/unit/odds_new.vue";
// import odd_convert from "/mixins/odds_conversion/odds_conversion.js";

import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  // #TODO mixins
  // mixins: [odd_convert],
  name: "temp4",
  props: ["item_data", "title"],
  components: {
    oddsNew: 'odds_new',
  },
  setup(props, evnet) {
    // #TODO vuex 
    // computed: {
    //   ...mapGetters(["get_bet_list","get_cur_odd","get_flag_get_ol_list", "get_menu_type","get_detail_data"]),
    //   change_ms(){
    //     return _.get(item_data,'hl[0].ol[0].os')
    //   }
    // },

    const change_ms = computed(() => {
      return _.get(item_data,'hl[0].ol[0].os')
    });
    const go_to_bet = (ol_item) => {
      // #TODO emit 
      // $emit("bet_click_", {ol_item});
    };
    watch(
      () => get_flag_get_ol_list,
      () => {
        max_count_ol = get_ol_list();
      }
    );
    watch(
      () => change_ms,
      (new_) => {
        if(new_ == 2 && get_menu_type == 900){
          max_count_ol = get_ol_list();
        }
      }
    );
    onMounted(() => {
      max_count_ol = get_ol_list();
    })
    return {
      
      change_ms,
      go_to_bet
    }
  }
})
</script>

<style lang="scss" scoped>
.title-style {
  margin-bottom: 0.06rem;
  height: 0.13rem;
  font-size: 0.12rem;

  line-height: 0.13rem;
}

.item-wrap {
  border-radius: 4px;
  min-height: 0.32rem;
  height: auto;
  overflow: hidden;
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

  padding: 0 0.15rem;
  display: flex;
  justify-content: center;
  &.is-like-bodan-play {
    flex-direction: column;
    text-align: center;
    padding: .06rem .07rem;
    line-height: .2rem;
  }
}

.margin-other {

}

.bor-style {

}

.remark {
  flex: 1;

  letter-spacing: 0;
}

.odds-wrap {
  width: 0.51rem;
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

.fam {
  height: 0.18rem;
  line-height: 0.18rem;

  font-size: 0.13rem;

  max-width: 1rem;
  margin: 0 auto;
}

.lock-margin {
  padding-left: 0.2rem;
}

</style>