<template>
  <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="component temp3 mx-5 box-style">
    <!-- ms: 0开 1封 2关 11锁 -->
    <!-- hs: 0开 1封 2关 11锁 -->
    <!-- os: 1开 2封 3隐藏不显示不占地方-->
    <!-- 按ol循环，不考虑按tittle循环-->
    <div class="hairline-border">
      <div class="item-wrap" v-if="item_data.hl[0] && item_data.hl[0].ol">
        <div v-for="(ol_item,index) in item_data.hl[0].ol" :key="index" class="item2">
          <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
            <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
              <template v-if="ol_item.os == 1">
                <!-- 主程序 start -->
                <div class="play-box-style details_color warp" @click="go_to_bet(ol_item)"
                     :class="[BetData.bet_oid_list.includes(ol_item.oid)?['details-bg5','first-rad']:'','bor-style',{'win':calc_win(ol_item.result)}]">
                  <div class="ellipsis remark details_t_color6 fz_12" :class="[{'white_text':BetData.bet_oid_list.includes(ol_item.oid)}]">
                  <span :class="[{'white_text':BetData.bet_oid_list.includes(ol_item.oid)}]">
                    {{ol_item.on || ol_item.ott}}
                  </span>
                  </div>
                  <div class="text-right odds-wrap">
                    <odds-new :item_data="item_data" :ol_data="ol_item"></odds-new>
                  </div>
                </div>
                <!-- 主程序 end -->
              </template>
              <template v-if="ol_item.os == 2">
                <!-- lock 锁状态 start -->
                <div class="play-box-style details_color warp bor-style">
                  <div class="ellipsis remark details_t_color7 fz_12" v-show="get_detail_data.csid != 1">{{ol_item.on || ol_item.ott}}</div>
                  <div class="text-center">
                    <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                  </div>
                </div>
                <!-- lock 锁状态 end -->
              </template>
              <!-- 新增start -->
              <template v-if="ol_item.os == 3">
                <!-- 关盘 锁占位 -->
                <div class="play-box-style details_color warp bor-style">
                  <div class="text-center">
                    <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                  </div>
                </div>
              </template>
              <!-- 新增over -->
            </template>
            <template v-if="ol_item._hs == 1">
              <template v-if="ol_item.os == 3">
                <!-- 关盘 锁占位 -->
                <div class="play-box-style details_color warp bor-style">
                  <div class="text-center">
                    <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                  </div>
                </div>
              </template>
              <template v-else>
                <!-- lock 锁状态 start -->
                <div class="play-box-style details_color warp bor-style">
                  <div class="ellipsis remark details_t_color7 fz_12" v-show="get_detail_data.csid != 1">{{ol_item.on || ol_item.ott}}</div>
                  <div class="text-center">
                    <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                  </div>
                </div>
                <!-- lock 锁状态 end -->
              </template>
            </template>
            <template v-if="ol_item._hs == 2">
              <!-- 盘口级别状态关盘时，要占位 -->
              <div class="play-box-style details_color warp bor-style">
                <div class="text-center">
                  <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                </div>
              </div>
            </template>
          </template>
          <!-- 封盘，一把锁的居中显示 -->
          <template v-if="ol_item._mhs == 1">
            <!-- lock 锁状态 start -->
            <div class="play-box-style details_color warp bor-style">
              <div class="ellipsis remark details_t_color7 fz_12" v-show="get_detail_data.csid != 1">{{ol_item.on || ol_item.ott}}</div>
              <div class="text-center">
                <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
              </div>
            </div>
            <!-- lock 锁状态 end -->
          </template>
          <!-- 关盘 -->
          <template v-if="ol_item._mhs == 2">
            <!-- 关盘 锁占位 -->
            <div class="play-box-style details_color warp bor-style">
              <div class="text-center">
                <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
              </div>
            </div>
          </template>
        </div>
        <!-- 补空缺 -->
        <div v-if="item_data.hl[0].ol.length % 2 != 0" class="details_color item2"></div>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex
// import { mapGetters } from "vuex";
import oddsNew from "src/base-h5/components/details/components/tournament-play/unit/odds-new.vue";
// import odd_convert from "src/base-h5/mixins/odds_conversion/odds_conversion.js";
import { LOCAL_PROJECT_FILE_PREFIX,MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance,calc_win } from 'src/output/index.js';
import store from "src/store-redux/index.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { useRoute } from "vue-router";
import BetData from "src/core/bet/class/bet-data-class.js"
import { go_to_bet } from "src/core/bet/class/bet-box-submit.js";
export default defineComponent({
  // #TODO mixins
  // mixins: [odd_convert],
  name: "temp3",
  props: ["item_data", "title"],
  components: {
    oddsNew,
  },
  setup(props, evnet) {
    const route = useRoute()
    const mid = route.params.mid;
    const get_detail_data = computed(() => {
      return MatchDataWarehouseInstance.get_quick_mid_obj(mid||lodash.get(props.item_data,'mid'))
    });
    const get_is_hengping = computed(() => {
      return ""
    });
    const is_match_result = computed(() => {
      return ['result_details', 'match_result'].includes($route.name)
    });
    return {
      calc_win,
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
.temp3 {
  background: var(--q-gb-bg-c-38) !important;
  .title-style {
    margin-bottom: 0.06rem;
    height: 0.13rem;
    font-size: 0.12rem;

    line-height: 0.13rem;
  }


  .item-wrap {
    display: flex;
    flex-wrap: wrap;
       gap: 0.08rem;
    height: auto;
    overflow: hidden;
    padding:0.08rem;
    padding:0.08rem 0.12rem;
    box-sizing: border-box;
    
    .item2 {
      flex: 1;
      flex-basis: 45%;
      overflow: hidden;
      box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.04);
      border-radius: .04rem;
      // &:nth-child(1){
      //   margin-left:  0.04rem;;
      // }
      // &:nth-child(2){
      //   margin-right:  0.04rem;;
      // }
      // &:nth-child(2n) {
      //   border-right: 0;
      // }
    }
  }


  .play-box-style {
    width: 100%;
    height: 0.52rem;
    //line-height: 0.52rem;
    padding: 0 0.15rem;
    display: flex;
     flex-direction: column;
    justify-content: center;
    border-radius: .04rem;
    box-sizing: border-box;
    // box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.04);
    &.details-bg5 {
      background: var(--q-gb-bg-c-37) !important;
      .details_t_color6  {
        color: var(--q-gb-t-c-30)!important
      }
      :deep(.odds-wrap){
        .details_t_color6, .odds span {
          color: var(--q-gb-t-c-30)!important
        }
      }
    }
  }

  .play-box-style {
    width: 100%;
    height: 0.52rem;
    //line-height: 0.52rem;

    padding: 0.04rem 0.15rem;
    display: flex;
  }

  .remark {
    flex: 1;
    letter-spacing: 0;
    text-align: center;
  }

  .odds-wrap {
    text-align: center;
    // width: 0.55rem;
  }


  .lock-style {
    width: 100%;
    height: 0.3rem;
    line-height: 0.3rem;
    margin-bottom: 0.02rem;

    border-radius: .04rem;
    padding: 0 0.1rem;
    text-align: center;
    display: block;
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

}
.details_t_color6 {
  color: var(--q-gb-t-c-11);
}

// 统一间距
.item-wrap {
  gap: 0.04rem !important;
}

</style>