<!--
 * @Description: 模板id=5 --用于多重条件&多个投注项的玩法，例如全场大小、进球大小···
-->
<template>
  <div class="temp5 mx-10">
    <div class="hairline-border">
      <div class="content-wrapper">
        <!-- 单个投注项的名称开始 -->
        <div class="row head yb_mb4">
          <div class="col text-center ellipsis yb_px4"></div>
          <div class="col text-center ellipsis yb_px4" v-for="(item,index) in item_data.title" :key="index">{{item.osn}}</div>
        </div>

        <div v-for="(item,index) in item_data.hl" :key="index" class="row">
          <!-- 左 -->
          <div class="col yb_fontsize14" style="min-width: 1px;">
            <template v-for="(ol_item,ol_index) in item.ol">
              <div v-if="lodash.get(item_data.title,'[0].otd') == ol_item.otd" :key="ol_index" class="ellipsis font_color play-box-style">
                {{ol_item.on}}
              </div>
            </template>
          </div>

          <!-- 中 -->
          <div class="col">
            <template v-for="(ol_item,ol_index) in item.ol">
              <div v-if="lodash.get(item_data.title,'[0].otd') == ol_item.otd" :key="ol_index">
                <!--  0开 2关 1封 11锁 -->
                <!-- 开盘or锁盘 正常显示 -->
                <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                  <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                    <template v-if="ol_item.os == 1">
                      <!-- 主程序 start -->
                      <div 
                      class="play-box-style" 
                      @click="go_to_bet(ol_item)" 
                      :class="[get_bet_list.includes(ol_item.id_)?'active-play':'',{'win': calc_win(ol_item.result)}]">
                        <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                      </div>
                      <!-- 主程序 end -->
                    </template>
                    <template v-if="ol_item.os == 2">
                      <!-- lock 锁状态 start -->
                      <div class="play-box-style"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"></div>
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
                      <div class="play-box-style"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"></div>
                      <!-- lock 锁状态 end -->
                    </template>
                  </template>
                  <template v-if="ol_item._hs == 2">
                    <!-- 盘口级别状态关盘时，要占位 -->
                    <div class="play-box-style">
                    </div>
                  </template>
                </template>
                <!-- 封盘，一把锁的居中显示 -->
                <template v-if="ol_item._mhs == 1">
                  <!-- lock 锁状态 start -->
                  <div class="play-box-style"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"></div>
                  <!-- lock 锁状态 end -->
                </template>
                <!-- 关盘 -->
                <template v-if="ol_item._mhs == 2"></template>
              </div>
            </template>
          </div>

          <!-- 右 -->
          <div class="col">
            <template v-for="(ol_item,ol_index) in item.ol">
              <div v-if="lodash.get(item_data.title,'[1].otd') == ol_item.otd" :key="ol_index">
                <!--  0开 2关 1封 11锁 -->
                <!-- 开盘or锁盘 正常显示 -->
                <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                  <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                    <template v-if="ol_item.os == 1">
                      <!-- 主程序 start -->
                      <div class="play-box-style" @click="go_to_bet(ol_item)" :class="[get_bet_list.includes(ol_item.id_)?'active-play':'',{'win':calc_win(ol_item.result)}]">
                        <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                      </div>
                      <!-- 主程序 end -->
                    </template>
                    <template v-if="ol_item.os == 2">
                      <!-- lock 锁状态 start -->
                      <div class="play-box-style"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"></div>
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
                      <div class="play-box-style"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"></div>
                      <!-- lock 锁状态 end -->
                    </template>
                  </template>
                  <template v-if="ol_item._hs == 2">
                    <!-- 盘口级别状态关盘时，要占位 -->
                    <div class="play-box-style">
                    </div>
                  </template>
                </template>
                <!-- 封盘，一把锁的居中显示 -->
                <template v-if="ol_item._mhs == 1">
                  <!-- lock 锁状态 start -->
                  <div class="play-box-style"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"></div>
                  <!-- lock 锁状态 end -->
                </template>
                <!-- 关盘 -->
                <template v-if="ol_item._mhs == 2"></template>
              </div>
            </template>
          </div>

          <!-- 其他or平局 -->
          <template v-for="(ol_item,ol_index) in item.ol">
            <div v-if="ol_item.otd == '0'" :key="ol_index" class="other row">
              <!-- ms: 0开 2关 1封 11锁 -->
              <!-- 开盘or锁盘 正常显示 -->
              <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                <!-- hs: 0开 2关 1封 11锁 -->
                <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                  <!-- os: 1、开盘 2、封盘-->
                  <template v-if="ol_item.os == 1">
                    <!-- 主程序 start -->
                    <div class="ellipsis remark play-box-style bw_mr1">{{ol_item.on}}</div>
                    <div @click="go_to_bet(ol_item)" :class="[get_bet_list.includes(ol_item.id_)?'active-play':'',{'win':calc_win(ol_item.result)}]" class="play-box-style col">
                      <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                    </div>
                    <!-- 主程序 end -->
                  </template>
                  <template v-if="ol_item.os == 2">
                    <!-- lock 锁状态 start -->
                    <div class="ellipsis remark play-box-style bw_mr1">{{ol_item.on}}</div>
                    <div class="play-box-style col"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"></div>
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
                    <div class="ellipsis remark play-box-style bw_mr1">{{ol_item.on}}</div>
                    <div class="play-box-style col"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"></div>
                    <!-- lock 锁状态 end -->
                  </template>
                </template>
                <template v-if="ol_item._hs == 2">
                  <!-- 盘口级别状态关盘时，要占位 -->
                  <div class="row"></div>
                </template>
              </template>
              <!-- 封盘，一把锁的居中显示 -->
              <template v-if="ol_item._mhs == 1">
                <!-- lock 锁状态 start -->
                <div class="ellipsis remark play-box-style bw_mr1">{{ol_item.on}}</div>
                <div class="play-box-style col"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"></div>
                <!-- lock 锁状态 end -->
              </template>
              <!-- 关盘 -->
              <template v-if="ol_item._mhs == 2"></template>
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
import oddsNew from "src/base-h5/components/details/components/tournament-play/unit/odds-new.vue";
import {  LOCAL_PROJECT_FILE_PREFIX } from 'src/output/index.js';
import lodash from "lodash";
import store from "src/store-redux/index.js";
import BetData from "src/core/bet/class/bet-data-class.js"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent, ref } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"

export default defineComponent({
  name: "temp5",
  props: ["item_data"],
  components: {
    oddsNew,
  },
  setup(props, evnet) {
    const store_state = store.getState()
    // #TODO vuex 
    // computed: {
    //   ...mapGetters(["get_bet_list"])
    // },
    const get_bet_list = ref(BetData.bet_list)
    const change_ms = computed(() => {
      return lodash.get(item_data,'hl[0].ol[0].os')
    });
    const go_to_bet = (ol_item) => {
      useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX,true);
    };
    return {
      
      go_to_bet,
      get_bet_list,
      LOCAL_PROJECT_FILE_PREFIX,
    }
  }
})
</script>

<style lang="scss" scoped>
.temp5 {
  .head {
    line-height: 0.17rem;
  }

  .play-box-style {
    text-align: center;
    height: 0.52rem;
    line-height: 0.52rem;

    padding: 0 0.14rem;
    margin-bottom: 1px;

    img {
      width: 0.12rem;
      height: 0.14rem;
    }
  }

  .other {
    width: 100%;
    // margin-bottom: 1px;
    // border-bottom: 1px solid var(--q-gb-bd-c-7);

    .play-box-style {
      margin-bottom: 0;
      width: 1.18rem;
    }
  }

  .bw_mr1 {
    // margin-right: 0.01rem;
    // border-right: 1px solid var(--q-gb-bd-c-7);
    min-width: 1px;
  }

  .active-play {
    & > div {

    }
  }
}
</style>