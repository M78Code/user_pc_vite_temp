<!--
 * @Author: Router
 * @Description: 模板16，用于半场/全场 & 总进球等 多行title玩法
-->
<template>
  <!-- ms: 0开 1封 2关 11锁 -->
  <!-- hs: 0开 1封 2关 11锁 -->
  <!-- os: 1开 2封 3隐藏不显示不占地方-->
  <div class="temp16 mx-5 text-center">
    <div v-show="false">{{BetData.bet_data_class_version}}</div>
    <div class="hairline-border">
      <div v-for="(titles,index) in item_data.title" :key="index" class="content">
        <div class="row tittle">
          <span class="col ellipsis yb_px4">{{item_data.title[index][0]?.osn}}</span>
          <span class="col ellipsis yb_px4">{{item_data.title[index][1]?.osn}}</span>
          <span class="col ellipsis yb_px4" v-if="titles.length > 2">{{item_data.title[index][2]?.osn}}</span>
        </div>

        <div class="row row-bet-wrapper">
          <!-- 左 -->
          <div class="col" :class="{col3: titles.length > 2}">
            <template v-for="(ol_item, ol_index) in item_data.hl[0].ol">
              <div v-if="lodash.get(item_data.title,`[${index}][0].otd`) == ol_item.otd" :key="ol_index" class="bet-box-bg mg-4-bg">
                <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                  <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                    <template v-if="ol_item.os == 1">
                      <!-- 主程序 start -->
                      <div class="play-box" @click="go_to_bet(ol_item)" :class="{'win':calc_win(ol_item.result),'active':BetData.bet_oid_list.includes(ol_item.oid)}">
                        <div class="ellipsis remark">
                        <span class="item-fat">
                          {{ol_item.on.trim().split(" ")[0]}}
                        </span>
                          <span class="item-son">
                          {{ol_item.on.trim().split(" ")[1]}}
                        </span>
                        </div>
                        <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                      </div>
                      <!-- 主程序 end -->
                    </template>
                    <template v-if="ol_item.os == 2">
                      <!-- lock 锁状态 start -->
                      <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
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
                      <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                      </div>
                    </template>
                  </template>
                  <template v-if="ol_item._hs == 2">
                    <div class="play-box"></div>
                  </template>
                </template>
                <!-- 封盘，一把锁的居中显示 -->
                <template v-if="ol_item._mhs == 1">
                  <!-- lock 锁状态 start -->
                  <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                    <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                  </div>
                  <!-- lock 锁状态 end -->
                </template>
                <!-- 关盘 -->
                <template v-if="ol_item._mhs == 2"></template>
              </div>
            </template>
          </div>

          <!-- 中 -->
          <div class="col" :class="{col3: titles.length > 2}">
            <template v-for="(ol_item,ol_index) in item_data.hl[0].ol">
              <div v-if="lodash.get(item_data.title,`[${index}][1].otd`) == ol_item.otd" :key="ol_index" class="bet-box-bg mg-4-bg">
                <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                  <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                    <template v-if="ol_item.os == 1">
                      <div class="play-box" @click="go_to_bet(ol_item)" :class="{'win':calc_win(ol_item.result),'active':BetData.bet_oid_list.includes(ol_item.oid)}">
                        <div class="ellipsis remark">
                        <span class="item-fat">
                          {{ol_item.on.trim().split(" ")[0]}}
                        </span>
                          <span class="item-son">
                          {{ol_item.on.trim().split(" ")[1]}}
                        </span>
                        </div>
                        <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                      </div>
                    </template>
                    <template v-if="ol_item.os == 2">
                      <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                      </div>
                    </template>
                    <template v-if="ol_item.os == 3"></template>
                  </template>
                  <template v-if="ol_item._hs == 1">
                    <template v-if="ol_item.os == 3"></template>
                    <template v-else>
                      <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                      </div>
                    </template>
                  </template>
                  <template v-if="ol_item._hs == 2">
                    <div class="play-box"></div>
                  </template>
                </template>
                <template v-if="ol_item._mhs == 1">
                  <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                    <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                  </div>
                </template>
                <template v-if="ol_item._mhs == 2"></template>
              </div>
            </template>
          </div>

          <!-- 右 -->
          <div v-if="titles.length > 2" class="col" :class="{col3: titles.length > 2}">
            <template v-for="(ol_item,ol_index) in item_data.hl[0].ol">
              <div v-if="lodash.get(item_data.title,`[${index}][2].otd`) == ol_item.otd" :key="ol_index" class="bet-box-bg mg-4-bg">
                <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                  <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                    <template v-if="ol_item.os == 1">
                      <div class="play-box" @click="go_to_bet(ol_item)" :class="{'win':calc_win(ol_item.result),'active':BetData.bet_oid_list.includes(ol_item.oid)}">
                        <div class="ellipsis remark">
                        <span class="item-fat">
                          {{ol_item.on.trim().split(" ")[0]}}
                        </span>
                          <span class="item-son">
                          {{ol_item.on.trim().split(" ")[1]}}
                        </span>
                        </div>
                        <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                      </div>
                    </template>
                    <template v-if="ol_item.os == 2">
                      <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                      </div>
                    </template>
                    <template v-if="ol_item.os == 3"></template>
                  </template>
                  <template v-if="ol_item._hs == 1">
                    <template v-if="ol_item.os == 3"></template>
                    <template v-else>
                      <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                      </div>
                    </template>
                  </template>
                  <template v-if="ol_item._hs == 2">
                    <div class="play-box"></div>
                  </template>
                </template>
                <template v-if="ol_item._mhs == 1">
                  <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                    <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                  </div>
                </template>
                <template v-if="ol_item._mhs == 2"></template>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex
// import { mapGetters } from "vuex";
import odds_new from "src/base-h5/components/details/components/tournament-play/unit/odds-new.vue";
import {LOCAL_PROJECT_FILE_PREFIX,MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance,calc_win  } from 'src/output/index.js';
import lodash from "lodash";
import store from "src/store-redux/index.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { useRoute } from "vue-router"
import BetData from "src/core/bet/class/bet-data-class.js"
import { go_to_bet } from "src/core/bet/class/bet-box-submit.js";
export default defineComponent({
  name: "temp16",
  props: ["item_data", "title"],
  components: {
    "odds-new": odds_new
  },
  // #TODO mixins
  // mixins:[odd_convert],
  setup(props, evnet) {
    let data = reactive({
    });
    const get_cur_odd = computed(() => {
      return ""
    });
    const route = useRoute()
    const get_detail_data = computed(() => {
      return MatchDataWarehouseInstance.get_quick_mid_obj(route.params.mid||lodash.get(props.item_data,'mid'))
    });
    onUnmounted(() => {
      // for (const key in $data) {
      //   $data[key] = null
      // }
    });
    return {
      ...toRefs(data),
      lodash,
      BetData,
      get_cur_odd,
      get_detail_data,
      LOCAL_PROJECT_FILE_PREFIX,
      calc_win,
      go_to_bet
    }
  }
})
</script>

<style lang="scss" scoped>
.temp16 {
  //padding:0.04rem;
  .content {
    border-radius: 0.08rem;
    overflow: hidden;
  }

    .hairline-border{
        padding: .08rem;
    }

  .tittle {

    line-height: 0.195rem;
    font-size: 0.13rem;
  }

  .row-bet-wrapper {
    border-radius: 4px;
    overflow: hidden;
  }

  .play-box {

    height: 0.52rem;

    font-size: 0.14rem;
    //padding: 0.06rem 0.07rem 0;
    margin-bottom: 1px;
      border-radius: .04rem;
      //margin: 0 !important;
  }

  .item-fat {
    color: var(--q-color-com-fs-color-26);
  }

  .play-box-lock {
    padding: 0;
    line-height: 0.52rem;

    img {
      width: 0.12rem;
      height: 0.14rem;
      margin-top: 2px;
    }
  }
}

// 统一间距
.mg-4-bg {
  margin:  0.04rem 0 !important;
  .play-box {
    margin-left: 0.02rem !important;
    margin-right: 0.02rem !important;
  }
}

</style>