<template>
  <!-- hpt: 1 -->
  <div class="temp1 mx-10" v-cloak>
    <div class="item-wrap">
      <div v-for="(item,index) in item_data.hl" :key="index">
        <div class="row" v-if="index > 0||index == 0" :class="{'result-style':is_match_result}">
          <!-- 如果是电竞，展示这个模板-->
          <div class="col fat-warp first-radius DJ_special_treatment" v-if="menu_type ==3000">
            <template v-for="(ol_item,ol_index) in item.ol" :key="ol_index">
              <div class="col" >
                <!-- ms---是外层的赛事级别状态值  mhs: 0开 2关 1封 11锁 -->
                <!--  0开 2关 1封 11锁 -->
                <!-- 开盘or锁盘 正常显示 -->
                <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                  <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                    <template v-if="ol_item.os == 1">
                      <!-- 主程序 start -->
                      <div
                        class="play-box-style details_color first-radius warp"
                        @click="go_to_bet(ol_item)"
                        :class="[get_bet_list.includes(ol_item.id_)?['details-bg5','white_text','first-rad']:'',{'win':calc_win(ol_item.result)}]"
                      >
                        <div class="text-center odds-wrap w-full">
                          <div class="col text-center ellipsis led">{{ol_item.ott}}{{ol_item.on}}</div>
                          <odds-new class="odds-style" :item_data="item_data" :ol_data="ol_item" ></odds-new>
                        </div>
                      </div>
                      <!-- 主程序 end -->
                    </template>
                    <template v-if="ol_item.os == 2">
                      <!-- lock 锁状态 start -->
                      <div class="play-box-style details_color">
                        <div class="text-center odds-wrap warp ">
                        <div class="col text-center ellipsis led details_t_color7">{{ol_item.ott}}{{ol_item.on}}</div>
                          <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                        </div>
                      </div>
                      <!-- lock 锁状态 end -->
                    </template>
                    <!-- 新增start -->
                    <template v-if="ol_item.os == 3"></template>
                    <!-- 新增over -->
                  </template>
                  <template v-if="ol_item._hs == 1">
                    <template v-if="ol_item.os == 3"></template>
                    <template v-else>
                      <!-- lock 锁状态 start -->
                      <div class="play-box-style details_color first-radius">
                        <div class="text-center odds-wrap warp ">
                        <div class="col text-center ellipsis led details_t_color7">{{ol_item.ott}}{{ol_item.on}}</div>
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
                    <div class="text-center odds-wrap warp ">
                    <div class="col text-center ellipsis led details_t_color7">{{ol_item.ott}}{{ol_item.on}}</div>
                      <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                    </div>
                  </div>
                  <!-- lock 锁状态 end -->
                </template>
                <!-- 关盘 -->
                <template v-if="ol_item._mhs == 2"></template>
              </div>
            </template>
          </div>
          <!-- 如果不是电竞，展示这个模板-->
          <template v-if="menu_type !=3000">
            <div class="col fat-warp first-radius">
              <template v-for="(ol_item,ol_index) in item.ol">
                <div class="col" v-if="lodash.get(item_data.title,'[0].otd') == ol_item.otd" :key="ol_index">
                  <!-- _mhs---是外层的赛事级别状态值  mhs: 0开 2关 1封 11锁 -->
                  <!--  0开 2关 1封 11锁 -->
                  <!-- 开盘or锁盘 正常显示 -->
                  <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                    <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                      <template v-if="ol_item.os == 1">
                        <!-- 主程序 start -->
                        <div
                          class="play-box-style details_color first-radius warp"
                          @click="go_to_bet(ol_item)"
                          :class="[get_bet_list.includes(ol_item.id_)?['details-bg5','white_text','first-rad']:'',{'win':calc_win(ol_item.result)}]"
                        >
                          <div class="text-center odds-wrap w-full">
                            <div class="col text-center ellipsis led">{{ol_item.ott}}{{ol_item.on}}</div>
                            <odds-new class="odds-style" :item_data="item_data" :ol_data="ol_item" ></odds-new>
                          </div>
                        </div>
                        <!-- 主程序 end -->
                      </template>
                      <template v-if="ol_item.os == 2">
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                          <div class="text-center odds-wrap warp flex-center">
                            <div class="col text-center ellipsis led details_t_color7"  v-show="get_detail_data.csid != 1">{{ol_item.ott}}{{ol_item.on}}</div>
                            <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                          </div>
                        </div>
                        <!-- lock 锁状态 end -->
                      </template>
                      <!-- 新增start -->
                      <template v-if="ol_item.os == 3"></template>
                      <!-- 新增over -->
                    </template>
                    <template v-if="ol_item._hs == 1">
                      <template v-if="ol_item.os == 3"></template>
                      <template v-else>
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color first-radius">
                          <div class="text-center odds-wrap warp"  :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                            <div class="col text-center ellipsis led" v-show="get_detail_data.csid != 1">{{ol_item.ott}}{{ol_item.on}}</div>
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
                      <div class="text-center odds-wrap warp" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                        <div class="col text-center ellipsis led details_t_color7" v-show="get_detail_data.csid != 1">{{ol_item.ott}}{{ol_item.on}}</div>
                        <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                      </div>
                    </div>
                    <!-- lock 锁状态 end -->
                  </template>
                  <!-- 关盘 -->
                  <template v-if="ol_item._mhs == 2"></template>
                </div>
              </template>
            </div>

            <div class="col fat-warp">
              <template v-for="(ol_item,ol_index) in item.ol">
                <div
                  class="col"
                  v-if="lodash.get(item_data.title,'[1].otd') == ol_item.otd"
                  :key="ol_index"
                >
                  <!--  0开 2关 1封 11锁 -->
                  <!-- 开盘or锁盘 正常显示 -->
                  <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                    <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                      <template v-if="ol_item.os == 1">
                        <!-- 主程序 start -->
                        <div
                          class="play-box-style details_color warp"
                          @click="go_to_bet(ol_item)"
                          :class="[get_bet_list.includes(ol_item.id_)?['details-bg5','white_text','first-rad']:'',,{'win':calc_win(ol_item.result)}]"
                        >
                          <div class="text-center odds-wrap w-full">
                            <div class="col text-center ellipsis led">{{ol_item.ott}}{{ol_item.on}}</div>
                            <odds-new class="odds-style" :item_data="item_data" :ol_data="ol_item" ></odds-new>
                          </div>
                        </div>
                        <!-- 主程序 end -->
                      </template>
                      <template v-if="ol_item.os == 2">
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color">
                          <div class="text-center odds-wrap warp" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                            <div class="col text-center ellipsis led details_t_color7"  v-show="get_detail_data.csid != 1">{{ol_item.ott}}{{ol_item.on}}</div>
                            <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                          </div>
                        </div>
                        <!-- lock 锁状态 end -->
                      </template>
                      <!-- 新增start -->
                      <template v-if="ol_item.os == 3"></template>
                      <!-- 新增over -->
                    </template>
                    <template v-if="ol_item._hs == 1">
                      <template v-if="ol_item.os == 3"></template>
                      <template v-else>
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color">
                          <div class="text-center odds-wrap warp" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                            <div class="col text-center ellipsis led"  v-show="get_detail_data.csid != 1">{{ol_item.ott}}{{ol_item.on}}</div>
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
                      <div class="text-center odds-wrap warp" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                        <div class="col text-center ellipsis led details_t_color7" v-show="get_detail_data.csid != 1">{{ol_item.ott}}{{ol_item.on}}</div>
                        <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                      </div>
                    </div>
                    <!-- lock 锁状态 end -->
                  </template>
                  <!-- 关盘 -->
                  <template v-if="ol_item._mhs == 2"></template>
                </div>
              </template>
            </div>

            <div class="col fat-warp last-radius">
              <template v-for="(ol_item,ol_index) in item.ol">
                <div
                  class="col"
                  v-if="lodash.get(item_data.title,'[2].otd') == ol_item.otd"
                  :key="ol_index"
                >
                  <!--  0开 2关 1封 11锁 -->
                  <!-- 开盘or锁盘 正常显示 -->
                  <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                    <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                      <template v-if="ol_item.os == 1">
                        <!-- 主程序 start -->
                        <div
                          class="play-box-style details_color last-radius"
                          @click="go_to_bet(ol_item)"
                          :class="[get_bet_list.includes(ol_item.id_)?['details-bg5','white_text']:'',{'win':calc_win(ol_item.result)}]"
                        >
                          <div class="text-center odds-wrap w-full">
                            <div class="col text-center ellipsis led">{{ol_item.ott}}{{ol_item.on}}</div>
                            <odds-new class="odds-style" :item_data="item_data" :ol_data="ol_item" ></odds-new>
                          </div>
                        </div>
                        <!-- 主程序 end -->
                      </template>

                      <template v-if="ol_item.os == 2">
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color">
                          <div class="text-center odds-wrap w-full" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                            <div class="col text-center ellipsis led details_t_color7" v-show="get_detail_data.csid != 1">{{ol_item.ott}}{{ol_item.on}}</div>
                            <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                          </div>
                        </div>
                        <!-- lock 锁状态 end -->
                      </template>

                      <!-- 新增start -->
                      <template v-if="ol_item.os == 3"></template>
                      <!-- 新增over -->
                    </template>

                    <template v-if="ol_item._hs == 1">
                      <template v-if="ol_item.os == 3"></template>
                      <template v-else>
                        <!-- lock 锁状态 start -->
                        <div class="play-box-style details_color last-radius">
                          <div class="text-center odds-wrap w-full" :class="get_detail_data.csid == 1? 'odds-lock' : '' ">
                            <div class="col text-center ellipsis led" v-show="get_detail_data.csid != 1">{{ol_item.ott}}{{ol_item.on}}</div>
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
                      <div class="text-center odds-wrap w-full">
                        <div class="col text-center ellipsis led details_t_color7" v-show="get_detail_data.csid != 1">{{ol_item.ott}}{{ol_item.on}}</div>
                      </div>
                    </div>
                    <!-- lock 锁状态 end -->
                  </template>
                  <!-- 关盘 -->
                  <template v-if="ol_item._mhs == 2"></template>
                </div>
              </template>
              </div>

          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex 
// import { mapGetters } from "vuex";
import lodash from "lodash"
import odds_new from "src/base-h5/components/details/components/tournament-play/unit/odds-new.vue";
// import odd_convert from "src/core/odds-conversion/odds_conversion-mixin.js";
import { MenuData, LOCAL_PROJECT_FILE_PREFIX } from 'src/output/index.js';
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { useRoute } from "vue-router"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"

export default defineComponent({
  // #TODO mixins
  // mixins:[odd_convert],
  name: "temp1",
  props: ["item_data", "title"],
  components: {
    "odds-new": odds_new
  },
  setup(props, evnet) {
    const route = useRoute()
    const { menu_type } = MenuData; //菜单选中项
    // #TODO vuex 
    // computed: {
    // ...mapGetters(["get_bet_list","get_cur_odd","menu_type","get_detail_data"]),
    const get_bet_list = computed(() => {
      return ""
    });
    const get_cur_odd = computed(() => {
      return ""
    });
    const get_detail_data = computed(() => {
      return ""
    });
    const is_match_result = computed(() => {
      return ['result_details', 'match_result'].includes(route.name)
    });
    const go_to_bet = (ol_item) => {
      useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX,true);
    };
    return {
      
      lodash,
      get_bet_list,
      get_cur_odd,
      menu_type,
      get_detail_data,
      is_match_result,
      LOCAL_PROJECT_FILE_PREFIX,
      go_to_bet
    }
  }
})
</script>

<style lang="scss" scoped>
.item-wrap {
  min-height: 0.32rem;
  height: auto;
}

.play-box-style {
  width: 100%;


  display: flex;
}

.remark {
  flex: 1;

  letter-spacing: 0;
}

.odds-wrap {
  width: 100%;
  padding: 0.005rem 0;
  height: 0.52rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.odds-lock {
  line-height: 0.52rem;
}

.active {

}

.lock-style {
  width: 100%;
  height: 0.3rem;
  line-height: 0.3rem;
  margin-bottom: 0.02rem;

  border-radius: 0.03rem;
  padding: 0 0.1rem;
  text-align: center;
  display: block;
}

.details_color {
  background-color: var(--q-gb-bg-c-15);
}

.fat-warp {

}

.led {

  color: #999999; //var(--q-detials-color-7);
  padding-bottom: 0.02rem;
  font-size: 0.13rem;

  max-width: 1rem;
  margin: 0 auto;
  margin-top: 0.06rem;
}

.os-led {

  font-size: 0.14rem;

  padding-bottom: 0.02rem;
  padding-top: 0.07rem;
  max-width: 1rem;
  margin: 0 auto;
}

.odds-style {
  line-height: 0.16rem;
  padding-bottom: 0.07rem;
}

.DJ_special_treatment {
  display: flex;
}

.first-radius {
  position: relative;
  // border-radius: 0.03rem 0 0 0.03rem;

  > .col {
    &:nth-child(2) {
      margin: 0 0.02rem;
    }
  }
}

.last-radius {
  // border-radius: 0 0.03rem 0.03rem 0;
}

.first-rad {
  &:after {

  }
}

.icon-lock {
  width: 0.16rem;
  height: 0.16rem;
  vertical-align: middle;
  margin: 0rem 0 0.076rem 0;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.odds-wrap {
  width: 100%!important;
}
</style>