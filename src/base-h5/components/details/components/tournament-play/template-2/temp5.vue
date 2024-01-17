<!--
 * @Description: 模板id=5 --用于多重条件&多个投注项的玩法，例如全场大小、进球大小···
-->
<template>
  <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="temp5 mx-5">
    <div class="hairline-border">
      <div class="content-wrapper">
        <!-- 单个投注项的名称开始 -->
        <div class="row head yb_mb4">
          <div class="col text-center ellipsis yb_px4"></div>
          <div class="col text-center ellipsis yb_px4" v-for="(item,index) in item_data.title" :key="index">{{item.osn}}</div>
        </div>

        <div v-for="(item,index) in item_data.hl" :key="index" class="row play-hl-box">
          <!-- 左   -->
          <div :class="['col','yb_fontsize14' ,{'col-mg':!['37'].includes(item_data.hpid)}]" style="min-width: 1px;">
            <template v-for="(ol_item,ol_index) in item.ol">
              <div class="mg-4-bg" v-if="lodash.get(item_data.title,'[0].otd') == ol_item.otd" :key="ol_index">
                <div class="ellipsis font_color play-box-style">
                  {{ol_item.on}}
                </div>
              </div>
            </template>
          </div>

          <!-- 中 -->
          <div class="col col-mg">
            <template v-for="(ol_item,ol_index) in item.ol">
              <div class="mg-4-bg" v-if="lodash.get(item_data.title,'[0].otd') == ol_item.otd" :key="ol_index">
                <div>
                  <!--  0开 2关 1封 11锁 -->
                  <!-- 开盘or锁盘 正常显示 -->
                  <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                    <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                      <template v-if="ol_item.os == 1">
                        <!-- 主程序 start -->
                        <div 
                        class="play-box-style" 
                        @click="go_to_bet(ol_item)" 
                        :class="[BetData.bet_oid_list.includes(ol_item.id_)?'active-play':'',{'win': calc_win(ol_item.result)}]">
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
              </div>
            </template>
          </div>

          <!-- 右 -->
          <div class="col col-mg">
            <template v-for="(ol_item,ol_index) in item.ol">
              <div class="mg-4-bg" v-if="lodash.get(item_data.title,'[1].otd') == ol_item.otd" :key="ol_index">
                <div >
                  <!--  0开 2关 1封 11锁 -->
                  <!-- 开盘or锁盘 正常显示 -->
                  <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                    <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                      <template v-if="ol_item.os == 1">
                        <!-- 主程序 start -->
                        <div class="play-box-style" @click="go_to_bet(ol_item)" :class="[BetData.bet_oid_list.includes(ol_item.id_)?'active-play':'',{'win':calc_win(ol_item.result)}]">
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
              </div>
             
            </template>
          </div>

          <!-- 其他or平局 -->
          <template v-for="(ol_item,ol_index) in item.ol">
            <!-- <div class="mg-4-bg"></div> -->
            <div v-if="ol_item.otd == '0'" :key="ol_index" class="other row">
              <!-- ms: 0开 2关 1封 11锁 -->
              <!-- 开盘or锁盘 正常显示 -->
              <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                <!-- hs: 0开 2关 1封 11锁 -->
                <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                  <!-- os: 1、开盘 2、封盘-->
                  <template v-if="ol_item.os == 1">
                    <!-- 主程序 start -->
                    <div class="ellipsis remark play-box-style bw_mr1 mg-4">{{ol_item.on}}</div>
                    <div @click="go_to_bet(ol_item)" :class="[BetData.bet_oid_list.includes(ol_item.id_)?'active-play':'',{'win':calc_win(ol_item.result)}]" class="play-box-style col mg-4">
                      <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                    </div>
                    <!-- 主程序 end -->
                  </template>
                  <template v-if="ol_item.os == 2">
                    <!-- lock 锁状态 start -->
                    <div class="ellipsis remark play-box-style bw_mr1 mg-4">{{ol_item.on}}</div>
                    <div class="play-box-style col mg-4"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"></div>
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
                    <div class="ellipsis remark play-box-style bw_mr1 mg-4">{{ol_item.on}}</div>
                    <div class="play-box-style col mg-4"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"></div>
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
                <div class="ellipsis remark play-box-style bw_mr1 mg-4">{{ol_item.on}}</div>
                <div class="play-box-style col mg-4"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"></div>
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
import {  LOCAL_PROJECT_FILE_PREFIX,calc_win } from 'src/output/index.js';
import lodash from "lodash";
import BetData from "src/core/bet/class/bet-data-class.js"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent, ref } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { go_to_bet } from "src/core/bet/class/bet-box-submit.js";
export default defineComponent({
  name: "temp5",
  props: ["item_data","title"],
  components: {
    oddsNew,
  },
  setup(props, evnet) {
    const change_ms = computed(() => {
      return lodash.get(props.item_data,'hl[0].ol[0].os')
    });
    return {
      calc_win,
      BetData,
      LOCAL_PROJECT_FILE_PREFIX,
      go_to_bet
    }
  }
})
</script>

<style lang="scss" scoped>
// .content-wrapper{
//   overflow: hidden;
// }
// .play-hl-box{
//   padding: .08rem;
//   box-sizing: border-box !important;
// }
.temp5 {
  .head {
    height: 0.35rem !important; 
    line-height: 0.35rem !important;
    .yb_px4{
      height: 0.35rem !important; 
    line-height: 0.35rem !important;
    }
  }
  .col-mg{
    color:#7981A4;
    overflow: hidden;
    box-sizing: border-box;
  }
  .play-hl-box{
    padding: 0 .08rem;
    box-sizing: border-box;
    overflow: hidden;
  }
  .play-box-style {
    width: 100%;
    height: 0.52rem;
    line-height: 0.52rem;
    padding: 0 0.15rem;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: .04rem;
    border: none !important;

    img {
      width: 0.12rem;
      height: 0.14rem;
    }
  }

  .other {
    width: 100%;
    box-sizing: border-box;

    .play-box-style {
      background: var(--q-gb-bg-c-28);
      border-radius: .04rem;
      overflow: hidden;
    }
    .mg-4{
      margin-right: .04rem;
      margin-left: .04rem;
      border-radius: .04rem;
      overflow: hidden;
    }
  }
  .play-box-style{
    flex: 20;
    box-sizing: border-box;
    padding-left: 0;
    padding-right: 0;
    flex-basis: 0.08rem;
  }
  .bw_mr1 {
    flex: 10;
    flex-basis: 0;
    margin: 0 .04rem .04rem .04rem;
    border-radius: .04rem;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.04);
  }

}
.mg-4{
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.04);
  border-radius: .04rem;
  overflow: hidden;
}
:deep(.component.odds_new){
  text-align: center;
}
.mg-4-bg{
  border-radius: .04rem;
  overflow: hidden;
}

// 统一间距
.mg-4-bg {
  margin-left: 0.02rem !important;
  margin-right: 0.02rem !important;
}

.other {
  .mg-4{
    margin-right: .02rem !important;
    margin-left: .02rem !important;
  }
}
.remark {
  font-size: 0.14rem;
}
</style>