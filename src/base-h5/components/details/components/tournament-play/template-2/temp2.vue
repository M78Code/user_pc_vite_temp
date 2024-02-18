<template>
  <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="temp2 mx-5 text-center">
    <div class="play-name-wrapper" v-show="get_is_hengping">
      <div class="item-name ellipsis">{{lodash.get(item_data, 'title[0].osn')}}</div>
      <div class="item-name ellipsis">{{lodash.get(item_data, 'title[1].osn')}}</div>
    </div>
    <div class="hairline-border">
      <div class="bet-wrapper">
        <div v-for="(item,index) in item_data.hl" :key="index" class="row">
          <template v-if="item">
            <template v-for="(ol_item,ol_index) in item.ol">
              <!-- 左 -->
              <div class="col border-style" v-if="lodash.get(item_data.title,'[0].otd') == ol_item.otd" :key="ol_index">
                <!-- ms就是外层的赛事级别状态mhs: 0开 2关 1封 11锁 -->
                <!-- 开盘or锁盘 正常显示 -->
                <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                  <!-- hs是盘口级别状态: 0开 2关 1封 11锁 -->
                  <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                    <!-- os: 1、开盘 2、封盘 -->
                    <template v-if="ol_item.os == 1">
                      <!-- 主程序 start -->
                      <div class="play-box" @click="go_to_bet(ol_item)" :class="[BetData.bet_oid_list.includes(ol_item.oid)?'active_play':'',{'win':calc_win(ol_item.result)}]">
                        <div class="ellipsis">
                          <span v-show="!get_is_hengping" class="odds-osn">{{item_data.title[0].osn}}</span>
                          <span class="size-color">{{ol_item.on || ol_item.ott}}</span>
                        </div>
                        <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                      </div>
                      <!-- 主程序 end -->
                    </template>
                    <template v-if="ol_item.os == 2">
                      <!-- lock 锁状态 start -->
                      <div class="play-box " :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis" v-show="get_detail_data.csid != 1">{{item_data.title[0].osn}}{{ol_item.on || ol_item.ott}}</div>
                        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`">
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
                      <div class="play-box " :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis" v-show="get_detail_data.csid != 1">{{item_data.title[0].osn}}{{ol_item.on || ol_item.ott}}</div>
                        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`">
                      </div>
                      <!-- lock 锁状态 end -->
                    </template>
                  </template>
                  <template v-if="ol_item._hs == 2">
                    <!-- 盘口级别状态关盘时，要占位 -->
                    <div class="play-box"></div>
                  </template>
                </template>
                <!-- 封盘，一把锁的居中显示 -->
                <template v-if="ol_item._mhs == 1">
                  <!-- lock 锁状态 start -->
                  <div class="play-box " :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                    <div class="ellipsis" v-show="get_detail_data.csid != 1">{{item_data.title[0].osn}}{{ol_item.on || ol_item.ott}}</div>
                    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`">
                  </div>
                  <!-- lock 锁状态 end -->
                </template>
                <!-- 关盘 -->
                <template v-if="ol_item._mhs == 2"></template>
              </div>

              <!-- 右 -->
              <div class="col" v-if="lodash.get(item_data.title,'[1].otd') == ol_item.otd" :key="ol_index">
                <!--  0开 2关 1封 11锁 -->
                <!-- 开盘or锁盘 正常显示 -->
                <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                  <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                    <!-- os: 1、开盘 2、封盘 3、隐藏不显示，不占地方 -->
                    <template v-if="ol_item.os == 1">
                      <!-- 主程序 start -->
                      <div class="play-box" @click="go_to_bet(ol_item)" :class="[BetData.bet_oid_list.includes(ol_item.oid)?'active_play':'',{'win':calc_win(ol_item.result)}]">
                        <div class="ellipsis">
                          <span v-show="!get_is_hengping" class="odds-osn">{{item_data.title[1].osn}}</span>
                          <span class="size-color">{{ol_item.on || ol_item.ott}}</span>
                        </div>
                        <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                      </div>
                      <!-- 主程序 end -->
                    </template>
                    <template v-if="ol_item.os == 2">
                      <!-- lock 锁状态 start -->
                      <div class="play-box " :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis" v-show="get_detail_data.csid != 1">{{item_data.title[1].osn}}{{ol_item.on || ol_item.ott}}</div>
                        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`">
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
                      <div class="play-box " :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis" v-show="get_detail_data.csid != 1">{{item_data.title[1].osn}}{{ol_item.on || ol_item.ott}}</div>
                        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`">
                      </div>
                      <!-- lock 锁状态 end -->
                    </template>
                  </template>
                  <template v-if="ol_item._hs == 2">
                    <!-- 盘口级别状态关盘时，要占位 -->
                    <div class="play-box"></div>
                  </template>
                </template>
                <!-- 封盘，一把锁的居中显示 -->
                <template v-if="ol_item._mhs == 1">
                  <!-- lock 锁状态 start -->
                  <div class="play-box " :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                    <div class="ellipsis" v-show="get_detail_data.csid != 1">{{item_data.title[1].osn}}{{ol_item.on || ol_item.ott}}</div>
                    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`">
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
  </div>
</template>
<script>
// #TODO vuex
// import { mapGetters } from "vuex";
import lodash from "lodash";
import oddsNew from "src/base-h5/components/details/components/tournament-play/unit/odds-new.vue";
// import odd_convert from "src/base-h5/mixins/odds_conversion/odds_conversion.js";
import { LOCAL_PROJECT_FILE_PREFIX,MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance,calc_win} from 'src/output/index.js';
import store from "src/store-redux/index.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { useRoute } from "vue-router";
import BetData from "src/core/bet/class/bet-data-class.js"
import { go_to_bet } from "src/core/bet/class/bet-box-submit.js";
export default defineComponent({
  // #TODO mixins
  // mixins: [odd_convert],
  name: "temp2",
  props: ["item_data","title"],
  components: {
    oddsNew,
  },
  setup(props, evnet) {
    const route = useRoute()
    const get_detail_data = computed(() => {
      return MatchDataWarehouseInstance.get_quick_mid_obj(route.params.mid||lodash.get(props.item_data,'mid'))
    });
    const get_is_hengping = computed(() => {
      return ""
    });
    const is_match_result = computed(() => {
      return ['result_details', 'match_result'].includes(route.name)
    });
    return {
      calc_win,
      lodash,
      BetData,
      get_detail_data,
      get_is_hengping,
      is_match_result,
      LOCAL_PROJECT_FILE_PREFIX,
      go_to_bet
    }
  }
})
</script>

<style lang="scss" scoped>
.temp2 {
  .bet-wrapper {
    border-radius: 0.08rem;
    overflow: hidden;
    padding:0.08rem;
    color: var(--q-bd-t-c-18);
    .border-style{
      background-color: transparent;
    }
  }

  .play-box {
    background: var(--q-gb-bg-c-28);
    margin: 0.04rem;
    height: 0.52rem;
    line-height: 0.52rem;
    padding: 0 0.15rem;
    display: flex;
    justify-content: center;
    border-radius: .04rem;
    overflow: hidden;

    .ellipsis {
      height: 0.16rem;
      overflow: unset;
    }

    .odds-osn {
      margin-right: .04rem;
    }

    div {
      height: 0.16rem;
    }

    img {
      width: 0.12rem;
      height: 0.14rem;
      margin-top: 2px;
    }
  }

  .size-color {
    color: var(--q-gb-t-c-1);
  }

  .play-box-lock {
    padding: 0;
    line-height: 0.52rem;
  }

  .win :deep(.odds-new2) {
    color: #FF4A4A !important;
  }
}

// Bug: 53049
.temp2 {
  .play-box {
    flex-direction: column;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
    line-height: normal;
    .ellipsis {
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      .odds-osn {
        //flex: 1;
        //text-align: right;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: 1rem;
        display: inline-block;
      }
      .size-color {
        //width: 0.3rem;

      }
    }
    :deep(.odds_new) {
      height: auto;
    }
  }
}


</style>