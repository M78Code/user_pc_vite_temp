<!--
 * @Author: Router
 * @Description: 模板14，用于获胜&总分、独赢&进球大小等混合玩法模板
-->
<template>
  <!-- ms: 0开 1封 2关 11锁 -->
  <!-- hs: 0开 1封 2关 11锁 -->
  <!-- os: 1开 2封 3隐藏不显示不占地方-->
  <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="temp14 mx-5 text-center">
    <div class="hairline-border">
      <div v-for="(item,index) in item_data.hl" :key="index" class="content">
        <div class="row tittle">
          <span class="col ellipsis yb_px4">{{item_data.title[0].osn}}</span>
          <span class="col ellipsis yb_px4">{{item_data.title[1].osn}}</span>
          <span class="col ellipsis yb_px4" v-if="item_data.title.length > 2">{{item_data.title[2].osn}}</span>
        </div>

        <div class="row row-bet-wrapper">
          <!-- 左 -->
          <div class="col" :class="{col3: item_data.title.length > 2}">
            <template v-for="(ol_item, ol_index) in item.ol">
              <div v-if="lodash.get(item_data.title,'[0].otd') == ol_item.otd" :key="ol_index" class="bet-box-bg">
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
          <div class="col" :class="{col3: item_data.title.length > 2}">
            <template v-for="(ol_item,ol_index) in item.ol">
              <div v-if="lodash.get(item_data.title,'[1].otd') == ol_item.otd" :key="ol_index" class="bet-box-bg">
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
          <div v-if="item_data.title.length > 2" class="col" :class="{col3: item_data.title.length > 2}">
            <template v-for="(ol_item,ol_index) in item.ol">
              <div v-if="lodash.get(item_data.title,'[2].otd') == ol_item.otd" :key="ol_index" class="bet-box-bg">
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
import lodash from "lodash";
import odds_new from "src/base-h5/components/details/components/tournament-play/unit/odds-new.vue";
import {  LOCAL_PROJECT_FILE_PREFIX,MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance,calc_win } from 'src/output/index.js';
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { useRoute } from "vue-router";
import BetData from "src/core/bet/class/bet-data-class.js"
import { go_to_bet } from "src/core/bet/class/bet-box-submit.js";
export default defineComponent({
  name: "temp14",
  props: ["item_data", "title"],
  components: {
    "odds-new": odds_new
  },
  setup(props, evnet) {
    const data = reactive({
      
      // 滑动left
      left: 0
    });
    // #TODO vuex
    // computed: {
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
.temp14 {
  .content {
    border-radius: 0.08rem;
    overflow: hidden;
  }

  .tittle {

    line-height: 0.195rem;
    font-size: 0.13rem;
  }

  .row-bet-wrapper {
    border-radius: 4px;
    overflow: hidden;
    padding:0.08rem;
  }

  .play-box {

    height: 0.52rem;

    font-size: 0.14rem;
    padding: 0.06rem 0.07rem 0;
    // margin-bottom: 1px;
  }

  .item-fat {
    color: var(--q-gb-t-c-24);
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
.bet-box-bg {
  margin:0.04rem;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.04);
  background:var(--q-gb-bg-c-15);
  border-radius: 4px;
}
</style>