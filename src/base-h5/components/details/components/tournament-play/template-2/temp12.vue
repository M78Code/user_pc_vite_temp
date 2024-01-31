<!--
 * @Author: Supermark
 * @Date: 2021-02-26 10:18:22
 * @Description: 玩法模板12
-->
<template>
  <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="temp12 mx-5">
    <div class="hairline-border">
      <div class="bet-wrapper">
        <!-- 主队 -->
        <template v-if="valid_home">
          <div class="row justify-between margin-btm">
            <!-- 主队名 -->
            <div class="troop-name ellipsis">{{get_detail_data.mhn}}</div>
            <div class="row on-name">
              <!-- 大/小 -->
              <div class="on-name-osn">{{home_name.osn}}</div>
              <div class="on-name-osn">{{away_name.osn}}</div>
            </div>
          </div>
          <div class="bgm-color">
            <template v-for=" (hl_item,index) in item_data.hl">
              <div v-if='hl_item.ad1 == 1' class="row" :class="{'bor-style':index != 0}" :key="index">
                <div class="player-name line-heg">
                  <!-- 主队球员名 -->
                  {{hl_item.ad2}}
                </div>
                <div class="row on-name">
                  <div v-for="(ol_item, ol_index) in hl_item.ol"
                       :key="ol_index"
                       class="on-name-osn"
                       @click="go_to_fun(ol_item)"
                       :class="[BetData.bet_oid_list.includes(ol_item.oid)?'bet-click':'',{'win':calc_win(ol_item.result)}]"
                  >
                    <!-- ms就是外层的赛事级别状态mhs: 0开 2关 1封 11锁 -->
                    <!-- 开盘or锁盘 正常显示 -->
                    <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                      <!-- hs是盘口级别状态: 0开 2关 1封 11锁 -->
                      <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                        <!-- os: 1、开盘 2、封盘 -->
                        <template v-if="ol_item.os == 1">
                          <div class="on-color" v-if="ol_item.otd == home_name.otd">
                            <!-- 投注项值 -->
                            <div >{{ol_item.on}}</div>
                            <!-- 赔率 -->
                            <div>
                              <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                            </div>
                          </div>
                          <div class="on-color" v-if="ol_item.otd == away_name.otd">
                            <!-- 投注项值 -->
                            <div >{{ol_item.on}}</div>
                            <!-- 赔率 -->
                            <div>
                              <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                            </div>
                          </div>
                        </template>
                        <template v-if="ol_item.os == 2">
                          <div class="on-color" v-if="ol_item.otd == home_name.otd">
                            <!-- 投注项值 -->
                            <div v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                            <!-- 赔率 -->
                            <div>
                              <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                            </div>
                          </div>
                          <div class="on-color" v-if="ol_item.otd == away_name.otd">
                            <!-- 投注项值 -->
                            <div v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                            <!-- 赔率 -->
                            <div>
                              <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                            </div>
                          </div>
                        </template>
                        <!-- 新增start -->
                        <template v-if="ol_item.os == 3"></template>
                        <!-- 新增over -->
                      </template>
                      <template v-if="ol_item._hs == 1">
                        <template v-if="ol_item.os == 3"></template>
                        <template v-else>
                          <!-- lock 锁状态 start -->
                          <div class="on-color" v-if="ol_item.otd == home_name.otd">
                            <!-- 投注项值 -->
                            <div  v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                            <!-- 赔率 -->
                            <div>
                              <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                            </div>
                          </div>
                          <div class="on-color" v-if="ol_item.otd == away_name.otd">
                            <!-- 投注项值 -->
                            <div  v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                            <!-- 赔率 -->
                            <div>
                              <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                            </div>
                          </div>
                          <!-- lock 锁状态 end -->
                        </template>
                      </template>
                    </template>
                    <!-- 封盘，一把锁的居中显示 -->
                    <template v-if="ol_item._mhs == 1">
                      <!-- lock 锁状态 start -->
                      <div class="on-color" v-if="ol_item.otd == home_name.otd">
                        <!-- 投注项值 -->
                        <div  v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <!-- 赔率 -->
                        <div>
                          <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                        </div>
                      </div>
                      <div class="on-color" v-if="ol_item.otd == away_name.otd">
                        <!-- 投注项值 -->
                        <div  v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <!-- 赔率 -->
                        <div>
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
            </template>
          </div>
        </template>
        <!-- 客队 -->
        <template v-if="valid_away">
          <div class="row justify-between margin-btm">
            <!-- 客队名 -->
            <div class="troop-name ellipsis">{{get_detail_data.man}}</div>
            <div class="row on-name">
              <!-- 大/小 -->
              <div class="on-name-osn">{{home_name.osn}}</div>
              <div class="on-name-osn">{{away_name.osn}}</div>
            </div>
          </div>
          <div class="bgm-color">
            <template v-for=" (hl_item,index) in item_data.hl" >
              <div v-if='hl_item.ad1 == 2' class="row" :class="{'bor-style':index != 0}" :key="index">
                <div class="player-name line-heg">
                  <!-- 客队球员名 -->
                  {{hl_item.ad2}}
                </div>
                <div class="row on-name">
                  <div v-for="(ol_item, ol_index) in hl_item.ol"
                       :key="ol_index"
                       class="on-name-osn"
                       @click="go_to_fun(ol_item)"
                       :class="[BetData.bet_oid_list.includes(ol_item.oid)?'bet-click':'',{'win':calc_win(ol_item.result)}]"
                  >
                    <!-- ms就是外层的赛事级别状态mhs: 0开 2关 1封 11锁 -->
                    <!-- 开盘or锁盘 正常显示 -->
                    <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                      <!-- hs是盘口级别状态: 0开 2关 1封 11锁 -->
                      <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                        <!-- os: 1、开盘 2、封盘 -->
                        <template v-if="ol_item.os == 1">
                          <div class="on-color" v-if="ol_item.otd == home_name.otd">
                            <!-- 投注项值 -->
                            <div >{{ol_item.on}}</div>
                            <!-- 赔率 -->
                            <div>
                              <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                            </div>
                          </div>
                          <div class="on-color" v-if="ol_item.otd == away_name.otd">
                            <!-- 投注项值 -->
                            <div >{{ol_item.on}}</div>
                            <!-- 赔率 -->
                            <div>
                              <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                            </div>
                          </div>
                        </template>
                        <template v-if="ol_item.os == 2">
                          <div class="on-color" v-if="ol_item.otd == home_name.otd">
                            <!-- 投注项值 -->
                            <div  v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                            <!-- 锁 -->
                            <div>
                              <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                            </div>
                          </div>
                          <div class="on-color" v-if="ol_item.otd == away_name.otd">
                            <!-- 投注项值 -->
                            <div  v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                            <!-- 锁 -->
                            <div>
                              <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                            </div>
                          </div>
                        </template>
                        <!-- 新增start -->
                        <template v-if="ol_item.os == 3"></template>
                        <!-- 新增over -->
                      </template>
                      <template v-if="ol_item._hs == 1">
                        <template v-if="ol_item.os == 3"></template>
                        <template v-else>
                          <!-- lock 锁状态 start -->
                          <div class="on-color" v-if="ol_item.otd == home_name.otd">
                            <!-- 投注项值 -->
                            <div  v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                            <!-- 赔率 -->
                            <div>
                              <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                            </div>
                          </div>
                          <div class="on-color" v-if="ol_item.otd == away_name.otd">
                            <!-- 投注项值 -->
                            <div  v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                            <!-- 赔率 -->
                            <div>
                              <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                            </div>
                          </div>
                          <!-- lock 锁状态 end -->
                        </template>
                      </template>
                    </template>
                    <!-- 封盘，一把锁的居中显示 -->
                    <template v-if="ol_item._mhs == 1">
                      <!-- lock 锁状态 start -->
                      <div class="on-color" v-if="ol_item.otd == home_name.otd">
                        <!-- 投注项值 -->
                        <div v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <!-- 赔率 -->
                        <div>
                          <img class="icon-lock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" />
                        </div>
                      </div>
                      <div class="on-color" v-if="ol_item.otd == away_name.otd">
                        <!-- 投注项值 -->
                        <div v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <!-- 赔率 -->
                        <div>
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
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
// #TODO vuex
// import { mapGetters } from "vuex";
import odds_new from "src/base-h5/components/details/components/tournament-play/unit/odds-new.vue";
// import odd_convert from "src/base-h5/mixins/odds_conversion/odds_conversion.js";
import {LOCAL_PROJECT_FILE_PREFIX,MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance,calc_win } from 'src/output/index.js';
import store from "src/store-redux/index.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import BetData from "src/core/bet/class/bet-data-class.js"
import { go_to_bet } from "src/core/bet/class/bet-box-submit.js";
import { useRoute } from "vue-router"
export default defineComponent({
  name: "temp12",
  props: ["item_data", "title"],
  components: {
    "odds-new": odds_new
  },
  // #TODO mixins
  // mixins:[ odd_convert ],
  setup(props, evnet) {
    let data = reactive({
      
      // 主队是否显示
      valid_home: false,
      // 客队是否显示
      valid_away: false,
    });
    const route = useRoute()
    const get_detail_data = computed(() => {
      return MatchDataWarehouseInstance.get_quick_mid_obj(route.params.mid||lodash.get(props.item_data,'mid'))
    });
    const home_name = computed(() => {
      return props.item_data.title[0]
    })
    const away_name = computed(() => {
      return props.item_data.title[1]
    })
    watch(
      // 深度监听数据的变化及时执行os修改函数
      () => props.item_data,
      (new_) => {
        new_.hl.forEach(hl_item => {
          if(hl_item.ad1 == '1' && hl_item.ol.length){
            data.valid_home = true
          }
          if(hl_item.ad1 == '2' && hl_item.ol.length){
            data.valid_away = true
          }
        });
      },
      {
        immediate: true,
      }
    );
    const go_to_fun = (ol_item) => {
      if(ol_item.os == 1 && ol_item._hs != 1){      
        go_to_bet(ol_item)
      }
    };
    return {
      ...toRefs(data),
      calc_win,
      BetData,
      get_detail_data,
      home_name,
      away_name,
      LOCAL_PROJECT_FILE_PREFIX,
      go_to_fun
    }
  }
})
</script>

<style lang="scss" scoped>
.bet-wrapper {
  border-radius: 0.08rem;
  overflow: hidden;
}

.bor-style {

}

.bgm-color {

  border-radius: 4px;
  overflow: hidden;
}

.margin-btm {
  margin: 0.06rem 0;
}

.line-heg {
  height: 0.52rem;
  display: flex;
  align-items: center;
}

.troop-name {
  flex: 1;


  margin-left: 0.1rem;
  font-size: 0.14rem;
}

.player-name {
  flex: 1;

  margin-bottom: 0.06rem;
  margin-left: 0.1rem;
  font-size: 0.14rem;
}

.on-name {
  width: 1.18rem;
  text-align: center;
}

.on-name-osn {

  width: 50%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: 0.13rem;
}

.on-color {
  font-size: 0.12rem;
}


</style>