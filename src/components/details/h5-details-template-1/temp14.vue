<!--
 * @Author: Router
 * @Description: 模板14，用于获胜&总分、独赢&进球大小等混合玩法模板
-->
<template>
  <!-- ms: 0开 1封 2关 11锁 -->
  <!-- hs: 0开 1封 2关 11锁 -->
  <!-- os: 1开 2封 3隐藏不显示不占地方-->
  <div class="temp14 mx-10 text-center">
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
              <div v-if="_.get(item_data.title,'[0].otd') == ol_item.otd" :key="ol_index" class="bet-box-bg">
                <template v-if="ol_item.ms == 0 || ol_item.ms == 11">
                  <template v-if="ol_item.hs == 0 || ol_item.hs == 11">
                    <template v-if="ol_item.os == 1">
                      <!-- 主程序 start -->
                      <div class="play-box" @click="go_to_bet(ol_item)" :class="{'win':calc_win(ol_item.result),'active':get_bet_list.includes(ol_item.id_)}">
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
                        <img src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                      </div>
                      <!-- lock 锁状态 end -->
                    </template>
                    <!-- 新增start -->
                    <template v-if="ol_item.os == 3"></template>
                    <!-- 新增over -->
                  </template>
                  <template v-if="ol_item.hs == 1">
                    <template v-if="ol_item.os == 3"></template>
                    <template v-else>
                      <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <img src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                      </div>
                    </template>
                  </template>
                  <template v-if="ol_item.hs == 2">
                    <div class="play-box"></div>
                  </template>
                </template>
                <!-- 封盘，一把锁的居中显示 -->
                <template v-if="ol_item.ms == 1">
                  <!-- lock 锁状态 start -->
                  <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                    <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                    <img src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                  </div>
                  <!-- lock 锁状态 end -->
                </template>
                <!-- 关盘 -->
                <template v-if="ol_item.ms == 2"></template>
              </div>
            </template>
          </div>

          <!-- 中 -->
          <div class="col" :class="{col3: item_data.title.length > 2}">
            <template v-for="(ol_item,ol_index) in item.ol">
              <div v-if="_.get(item_data.title,'[1].otd') == ol_item.otd" :key="ol_index" class="bet-box-bg">
                <template v-if="ol_item.ms == 0 || ol_item.ms == 11">
                  <template v-if="ol_item.hs == 0 || ol_item.hs == 11">
                    <template v-if="ol_item.os == 1">
                      <div class="play-box" @click="go_to_bet(ol_item)" :class="{'win':calc_win(ol_item.result),'active':get_bet_list.includes(ol_item.id_)}">
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
                        <img src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                      </div>
                    </template>
                    <template v-if="ol_item.os == 3"></template>
                  </template>
                  <template v-if="ol_item.hs == 1">
                    <template v-if="ol_item.os == 3"></template>
                    <template v-else>
                      <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <img src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                      </div>
                    </template>
                  </template>
                  <template v-if="ol_item.hs == 2">
                    <div class="play-box"></div>
                  </template>
                </template>
                <template v-if="ol_item.ms == 1">
                  <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                    <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                    <img src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                  </div>
                </template>
                <template v-if="ol_item.ms == 2"></template>
              </div>
            </template>
          </div>

          <!-- 右 -->
          <div v-if="item_data.title.length > 2" class="col" :class="{col3: item_data.title.length > 2}">
            <template v-for="(ol_item,ol_index) in item.ol">
              <div v-if="_.get(item_data.title,'[2].otd') == ol_item.otd" :key="ol_index" class="bet-box-bg">
                <template v-if="ol_item.ms == 0 || ol_item.ms == 11">
                  <template v-if="ol_item.hs == 0 || ol_item.hs == 11">
                    <template v-if="ol_item.os == 1">
                      <div class="play-box" @click="go_to_bet(ol_item)" :class="{'win':calc_win(ol_item.result),'active':get_bet_list.includes(ol_item.id_)}">
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
                        <img src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                      </div>
                    </template>
                    <template v-if="ol_item.os == 3"></template>
                  </template>
                  <template v-if="ol_item.hs == 1">
                    <template v-if="ol_item.os == 3"></template>
                    <template v-else>
                      <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                        <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                        <img src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                      </div>
                    </template>
                  </template>
                  <template v-if="ol_item.hs == 2">
                    <div class="play-box"></div>
                  </template>
                </template>
                <template v-if="ol_item.ms == 1">
                  <div class="play-box" :class="get_detail_data.csid == 1? 'play-box-lock' : '' ">
                    <div class="ellipsis remark" v-show="get_detail_data.csid != 1">{{ol_item.on}}</div>
                    <img src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                  </div>
                </template>
                <template v-if="ol_item.ms == 2"></template>
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
import odds_new from "src/base-h5/components/details/components/tournament_play/unit/odds_new.vue";

import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "temp14",
  props:{},
  props: ["item_data"],
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
    //   ...mapGetters(["get_bet_list", "get_cur_odd","get_detail_data"])
    // },
    onUnmounted(() => {
      for (const key in $data) {
        $data[key] = null
      }
    });
    const go_to_bet = (ol_item) => {
      $emit("bet_click_", { ol_item });
    }
    return {
      ...toRefs(data),
      go_to_bet,
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
  }

  .play-box {

    height: 0.52rem;

    font-size: 0.14rem;
    padding: 0.06rem 0.07rem 0;
    // margin-bottom: 1px;
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
</style>