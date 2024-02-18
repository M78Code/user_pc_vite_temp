<template>
  <div class="temp2 mx-10 text-center">
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
                      <div class="play-box" @click="go_to_bet(ol_item)" :class="[get_bet_list.includes(ol_item.id_)?'active_play':'',{'win':calc_win(ol_item.result)}]">
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
                        <img src="image/wwwassets/bw3/common/match-icon-lock.svg">
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
                        <img src="image/wwwassets/bw3/common/match-icon-lock.svg">
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
                    <img src="image/wwwassets/bw3/common/match-icon-lock.svg">
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
                      <div class="play-box" @click="go_to_bet(ol_item)" :class="[get_bet_list.includes(ol_item.id_)?'active_play':'',{'win':calc_win(ol_item.result)}]">
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
                        <img src="image/wwwassets/bw3/common/match-icon-lock.svg">
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
                        <img src="image/wwwassets/bw3/common/match-icon-lock.svg">
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
                    <img src="image/wwwassets/bw3/common/match-icon-lock.svg">
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
import oddsNew from "src/base-h5/components/details/components/tournament_play/unit/odds_new.vue";
// import odd_convert from "/mixins/odds_conversion/odds_conversion.js";

import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import lodash from "lodash"

export default defineComponent({
  // #TODO mixins
  // mixins: [odd_convert],
  name: "temp2",
  props: ["item_data"],
  components: {
    oddsNew,
  },
  setup(props, evnet) {
    console.error(props.item_data);
    // #TODO vuex 
    // computed: {
    //   ...mapGetters(["get_bet_list","get_detail_data", 'get_is_hengping'])
    // },

    const is_match_result = computed(() => {
      return ['result_details', 'match_result'].includes($route.name)
    });
    const go_to_bet = (ol_item) => {
      // #TODO emit 
      // this.$emit("bet_click_", {ol_item});
    };
    return {
      
      is_match_result,
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
    .border-style{
      border-right: 1px solid var(--q-color-border-color-56);
    }
  }

  .play-box {
    height: 0.52rem;


    padding: 0.06rem 0.05rem 0;

    .ellipsis {
      height: 0.16rem;
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
    color: var(--q-color-fs-color-50);
  }

  .play-box-lock {
    padding: 0;
    line-height: 0.52rem;
  }

  .win :deep(.odds-new2) {
    color: #FF4A4A !important;
  }
}
</style>