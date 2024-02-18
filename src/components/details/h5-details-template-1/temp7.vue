<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 模板id=7 --用于有盘口&3个投注项玩法
-->
<template>
  <div class="temp7 mx-10">
    <div class="content hairline-border">
      <div class="row title-style ">
        <div class="col text-center ellipsis fam">{{item_data.title[0].osn}}</div>
        <div class="col text-center ellipsis fam">{{item_data.title[1].osn}}</div>
        <div class="col text-center ellipsis fam" v-if="item_data.title.length > 2">{{item_data.title[2].osn}}</div>
      </div>
      <div class="item-wrap">
        <template>
          <div v-for="(item,index) in item_data.hl" :key="index" :class="{'bor-style':item_data.hl.length > 1 && index != item_data.hl.length-1}">
            <div class="row" v-if="(index>0||index==0) && (item.hs!=2)">
              <div class="col">
                <template v-for="(ol_item,ol_index) in item.ol">
                  <div
                      v-if="_.get(item_data.title,'[0].otd') == ol_item.otd"
                      :key="ol_index"
                  >
                    <!--  0开 2关 1封 11锁 -->
                    <!-- 开盘or锁盘 正常显示 -->
                    <template v-if="ol_item.ms == 0 || ol_item.ms == 11">
                      <template v-if="ol_item.hs == 0 || ol_item.hs == 11">
                        <template v-if="ol_item.os == 1">
                          <!-- 主程序 start -->
                          <div
                              class="play-box-style details_color warp"
                              @click="go_to_bet(ol_item)"
                              :class="[get_bet_list.includes(ol_item.id_)?['details-bg5','first-rad']:'',{'win':calc_win(ol_item.result)}]"
                          >
                            <div class="ellipsis remark details_t_color6 fz_16">
                            <span :class="[{'white_text':get_bet_list.includes(ol_item.id_)},'size-color']">
                              {{ol_item.on}}
                            </span>
                            </div>
                            <div class="text-right odds-wrap">
                              <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                            </div>
                          </div>
                          <!-- 主程序 end -->
                        </template>
                        <template v-if="ol_item.os == 2">
                          <!-- lock 锁状态 start -->
                          <div class="play-box-style details_color warp">
                            <div class="size-color-imp size-color ellipsis remark details_t_color7 fz_16">{{ol_item.on}}</div>
                            <div class="text-left text-right odds-wrap">
                              <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                            </div>
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
                          <!-- lock 锁状态 start -->
                          <div class="play-box-style details_color warp">
                            <div class="size-color-imp ellipsis remark details_t_color6 fz_16">{{ol_item.on}}</div>
                            <div class="text-left text-right odds-wrap">
                              <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                            </div>
                          </div>
                          <!-- lock 锁状态 end -->
                        </template>
                      </template>
                      <template v-if="ol_item.hs == 2">
                        <!-- 盘口级别状态关盘时，要占位 -->
                        <div class="play-box-style details_color">
                        </div>
                      </template>
                    </template>
                    <!-- 封盘，一把锁的居中显示 -->
                    <template v-if="ol_item.ms == 1">
                      <!-- lock 锁状态 start -->
                      <div class="play-box-style details_color warp">
                        <div class="size-color-imp ellipsis remark details_t_color6 fz_16">{{ol_item.on}}</div>
                        <div class="text-left text-right odds-wrap">
                          <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                        </div>
                      </div>
                      <!-- lock 锁状态 end -->
                    </template>
                    <!-- 关盘 -->
                    <template v-if="ol_item.ms == 2"></template>
                  </div>
                </template>
              </div>
              <div class="col">
                <template v-for="(ol_item,ol_index) in item.ol">
                  <div
                      v-if="_.get(item_data.title,'[1].otd') == ol_item.otd"
                      :key="ol_index"
                  >
                    <!--  0开 2关 1封 11锁 -->
                    <!-- 开盘or锁盘 正常显示 -->
                    <template v-if="ol_item.ms == 0 || ol_item.ms == 11">
                      <template v-if="ol_item.hs == 0 || ol_item.hs == 11">
                        <template v-if="ol_item.os == 1">
                          <!-- 主程序 start -->
                          <div
                              class="play-box-style details_color warp"
                              @click="go_to_bet(ol_item)"
                              :class="[get_bet_list.includes(ol_item.id_)?['details-bg5','first-rad']:'',{'win':calc_win(ol_item.result)}]"
                          >
                            <div class="ellipsis remark details_t_color6 fz_16">
                            <span :class="[{'white_text':get_bet_list.includes(ol_item.id_)},'size-color']">
                              {{ol_item.on}}
                            </span>
                            </div>
                            <div class="text-right odds-wrap">
                              <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                            </div>
                          </div>
                          <!-- 主程序 end -->
                        </template>
                        <template v-if="ol_item.os == 2">
                          <!-- lock 锁状态 start -->
                          <div class="play-box-style details_color warp">
                            <div class="size-color-imp ellipsis remark details_t_color7 fz_16">{{ol_item.on}}</div>
                            <div class="text-left text-right odds-wrap">
                              <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                            </div>
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
                          <!-- lock 锁状态 start -->
                          <div class="play-box-style details_color warp">
                            <div class="size-color-imp ellipsis remark details_t_color7 fz_16">{{ol_item.on}}</div>
                            <div class="text-left text-right odds-wrap">
                              <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                            </div>
                          </div>
                          <!-- lock 锁状态 end -->
                        </template>
                      </template>
                      <template v-if="ol_item.hs == 2">
                        <!-- 盘口级别状态关盘时，要占位 -->
                        <div class="play-box-style details_color">
                        </div>
                      </template>
                    </template>
                    <!-- 封盘，一把锁的居中显示 -->
                    <template v-if="ol_item.ms == 1">
                      <!-- lock 锁状态 start -->
                      <div class="play-box-style details_color warp">
                        <div class="size-color-imp ellipsis remark details_t_color7 fz_16">{{ol_item.on}}</div>
                        <div class="text-left text-right odds-wrap">
                          <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                        </div>
                      </div>
                      <!-- lock 锁状态 end -->
                    </template>
                    <!-- 关盘 -->
                    <template v-if="ol_item.ms == 2"></template>
                  </div>
                </template>
              </div>
              <div v-if="item_data.title.length > 2" class="col">
                <template v-for="(ol_item,ol_index) in item.ol">
                  <div
                      v-if="_.get(item_data.title,'[2].otd') == ol_item.otd"
                      :key="ol_index"
                  >
                    <!--  0开 2关 1封 11锁 -->
                    <!-- 开盘or锁盘 正常显示 -->
                    <template v-if="ol_item.ms == 0 || ol_item.ms == 11">
                      <template v-if="ol_item.hs == 0 || ol_item.hs == 11">
                        <template v-if="ol_item.os == 1">
                          <!-- 主程序 start -->
                          <div
                              class="play-box-style details_color warp"
                              @click="go_to_bet(ol_item)"
                              :class="[get_bet_list.includes(ol_item.id_)?'details-bg5':'',{'win':calc_win(ol_item.result)}]"
                          >
                            <div class="ellipsis remark details_t_color6 fz_16">
                            <span :class="[{'white_text':get_bet_list.includes(ol_item.id_)},'size-color']">
                              {{ol_item.on || ol_item.otv || ol_item.ott}}
                            </span>
                            </div>
                            <div class="text-right odds-wrap">
                              <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                            </div>
                          </div>
                          <!-- 主程序 end -->
                        </template>
                        <template v-if="ol_item.os == 2">
                          <!-- lock 锁状态 start -->
                          <div class="play-box-style details_color">
                            <div class="size-color-imp ellipsis remark details_t_color7 fz_16">{{ol_item.on}}</div>
                            <div class="text-left text-right odds-wrap">
                              <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                            </div>
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
                          <!-- lock 锁状态 start -->
                          <div class="play-box-style details_color">
                            <div class="size-color-imp size-color-imp ellipsis remark details_t_color6 fz_16">{{ol_item.on}}</div>
                            <div class="text-left text-right odds-wrap">
                              <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                            </div>
                          </div>
                          <!-- lock 锁状态 end -->
                        </template>
                      </template>
                      <template v-if="ol_item.hs == 2">
                        <!-- 盘口级别状态关盘时，要占位 -->
                        <div class="play-box-style details_color">
                        </div>
                      </template>
                    </template>
                    <!-- 封盘，一把锁的居中显示 -->
                    <template v-if="ol_item.ms == 1">
                      <!-- lock 锁状态 start -->
                      <div class="play-box-style details_color">
                        <div class="size-color-imp ellipsis remark details_t_color7 fz_16">{{ol_item.on}}</div>
                        <div class="text-left text-right odds-wrap">
                          <img class="icon-lock" src="image/wwwassets/bw3/common/match-icon-lock.svg" />
                        </div>
                      </div>
                      <!-- lock 锁状态 end -->
                    </template>
                    <!-- 关盘 -->
                    <template v-if="ol_item.ms == 2"></template>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex 
// import { mapGetters } from "vuex";
import odds_new from "src/base-h5/components/details/components/tournament_play/unit/odds_new.vue";
// import odd_convert from "/mixins/odds_conversion/odds_conversion.js";

import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "temp7",
  // #TODO mixins 
  // mixins:[odd_convert],
  props: ["item_data", "title"],
  components: {
    "odds-new": odds_new
  },
  setup(props, evnet) {
    const go_to_bet = (ol_item) => {
      // #TODO emit 
      // $emit("bet_click_", {ol_item});
    };
    onMounted(() => {
      max_count_ol = get_ol_list();
    })
    return {
      
      go_to_bet
    }
  }
})
</script>

<style lang="scss" scoped>
.title-style {
  margin-bottom: 0.06rem;
  height: 0.13rem;
  font-size: 0.12rem;

  line-height: 0.13rem;
}

.item-wrap {
  min-height: 0.32rem;
  height: auto;
  border-radius: 0.03rem 0.03rem 0.03rem 0.03rem;
  overflow: hidden;
}

.bor-style {

}

.play-box-style {
  width: 100%;
  height: 0.52rem;
  line-height: 0.52rem;
  border-radius: 4px;


  padding: 0 0.15rem;
  display: flex;
  justify-content: center;
}

.play-box-style {
  width: 100%;
  height: 0.52rem;
  line-height: 0.52rem;
  border-radius: 4px;


  padding: 0 0.15rem;
  display: flex;
  justify-content: center;
}

.play-box-style {
  width: 100%;
  height: 0.52rem;
  line-height: 0.52rem;
  border-radius: 4px;

  padding: 0 0.15rem;
  display: flex;
  justify-content: center;
}

.remark {
  flex: 1;

  letter-spacing: 0;
}

.odds-wrap {
  width: 0.55rem;
}

.active {

}

.lock-style {
  width: 100%;
  height: 0.3rem;
  line-height: 0.3rem;
  margin-bottom: 0.02rem;

  border-radius: 0.02rem;
  padding: 0 0.1rem;
  text-align: center;
  display: block;
}

.white_text {

}

.details_color {

}

.warp {
  position: relative;
  flex-shrink: 0;

  .remark {
    flex: 1;
    color: var(--q-color-com-fs-color-28);
    letter-spacing: 0;
    padding-right: 5px;
    text-align: right;
  }

  .odds-wrap {
    flex: 1;
    padding-left: 5px;
    text-align: left;
  }
}

.row {
  .col:last-child {
    .warp {
      &:after {
        display: none;
      }
    }
  }
}

.first-rad {
  &:after {

  }
}

.icon-lock {
  width: 0.16rem;
  height: 0.16rem;
  margin-top: 0.17rem;
}

.fam {
  height: 0.18rem;
  font-size: 0.13rem;
  line-height: 0.18rem;


  max-width: 1rem;
  margin: 0 auto;
}

</style>