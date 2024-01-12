
<template>
   <!-- active 1 开盘 4 锁盘-->
  <q-card flat class="relative-position bet-mix-item-card"
    :class="{ 'bet-mix-item-first': index == 0, 'bet-no-effect': !(ref_data.active == 1 || ref_data.active == 4) || !(ref_data.is_serial && ref_data.serial_type) || ref_data.match_update }">
    <div style="display: none;">{{ BetData.bet_data_class_version }} </div>
    <!--玩法,提示及删除区域-->
    <q-card-section>
      <!--不是冠军-->
      <div class="row" v-if="ref_data.match_type != 3">
        <div class="col bet-league-name">
          <!--联赛名称-->
          {{ item.tid_name }}
        </div>
        <div class="col-auto">
          <!--删除按钮-->
          <icon-wapper size="12px" name="icon-del" class="bet-del" @click="del_bet_item" />
        </div>
      </div>
      <div class="row">
        <div class="col bet-against">
          <!--冠军赛的模板id为18-->
          <template v-if="ref_data.match_type == 3">
            {{ item.season }}
          </template>
          <template v-else>
            <!--主队v客队-->
            <span class="home-vs-away">
              <!--主客队队名-->
              {{ item.home }}<span class='bet-pk'> v </span>{{ item.away }} 
            </span>
            <!--足,蓝,棒,乒,排-->
            <span v-if="[1, 2, 3, 8, 9].includes(item.sport_id * 1) && ref_data.timerly_basic_score">({{ ref_data.timerly_basic_score }})</span>
          </template>
        </div>
      </div>
     
      <!-- ms的值，0:未开赛 1:滚球阶段 2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛 -->
      <div class="row" v-if="item.match_ms == 0">
        <div class="col match-time">
          <!--赛事时间-->
          {{ formatTime(item.match_time, "mm月DD日 HH:MM") }}
        </div>
      </div>
      <div class="bet-content">
        <div class="row">
          <div class="col bet-play-game">
            <!--盘口类型，盘口名称，比分的显示 ref_data.timerly_basic_score 0 滚球-->
            <label class="bet-play-text">
              <template v-if="ref_data.match_ms == 1">
                <label class="bet-match-playing">{{ i18n_t('menu.match_playing') }}</label>
              </template>
              {{ item.playName }}
              <template v-if="item.basic_score">
                ({{ item.basic_score }})
              </template>
              <label class="bet-handicap-name">
                [{{ i18n_t(`odds.${item.marketTypeFinally}`) }}]
              </label>
            </label>
          </div>
        </div>
        <!--队名及盘口区域-->
        <div class="row no-wrap">
          <div class="col bet-play-team">
            <!--卡赫利赛哈特 -0.5-->
            <label class="bet-team-handicap">
              <template v-if="item.handicap !== ''">{{ lodash.trim(item.team_name) }}<template v-if="item.team_name != item.handicap"><label
                    class="handicap yb-number-bold bet-text-nowrap"
                    :class="{ 'margin-left-0': item.team_name == '', 'bet-handicap': item.handicap_change }" v-html="item.handicap"></label></template>
              </template>
              <template v-else>
                <!--所选的投注项名称-->
                {{ lodash.trim(item.team_name) }}
              </template>
            </label>
          </div>
        </div>
        <div class="row">
          <div class="col bet-odds-value" :class="{
            'up-red': ref_data.odds_change_up,
            'down-green': ref_data.odds_change_up
          }">
            <!--@1.87-->
            <span class="odds-value yb-number-bold">
              <span>@</span>{{ format_odds(item.oddFinally,item.csid) }}
            </span>
          </div>
          <!--右侧无效按钮  -->
          <div class="auto-col" v-if="item.is_serial && !BetData.is_bet_single">
            <span class="invalid serial-msg">
              <!--不支持串关-->
              {{ i18n_t('bet.no_support_serial') }}
            </span>
          </div>
          <div class="auto-col" v-else-if="!(item.ol_os == 1 && item.hl_hs == 0 && item.mid_mhs == 0)">
            <span class="invalid">
              {{ i18n_t('common.invalid') }}
              <!-- 无效 -->
            </span>
          </div>
         
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, reactive } from "vue"
import lodash from 'lodash'
import { format_odds,formatTime } from 'src/output/index.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { IconWapper } from 'src/components/icon'

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  item: {}
})


// 投注金额
const is_close = ref(false)

const ref_data = reactive({
  DOM_ID_SHOW: false,
  match_type: 1,  // match_type 盘口类型 1:赛前盘，2: 滚球盘 3: 冠军盘 
  active: 1,    //投注项状态
  season: '',   // 赛季
  timerly_basic_score: "",   // 计时比分 返回比分格式为: (主队得分-客队得分)
  market_type: '',     // 赛事状态 0未开赛 滚球:进行中
  basic_score: "",    /// 赛事比分 返回比分格式为: (主队得分-客队得分)
  handicap_name: '',  // 当前盘口名称 欧洲盘/香港盘
  appoint: true, // 是否预约
  odds_change_up: false,  // 赔率上升
  odds_change_up: false, // 赔率下降
  min_money: 10, // 最小投注金额
  max_money: 8888, // 最大投注金额
  win_money: 0.00, // 最高可赢
  is_serial:"", //
  value_range: {
    min: 0,
    max: 0
  }
})

// 删除当前投注项
const del_bet_item = () => {
  BetData.set_delete_bet_info(props.item.playOptionsId,props.index)
}

</script>
<style lang="scss" scoped>
/*  卡片样式 总的*/
.bet-mix-item-card {
  padding: 15px 10px;
  padding-bottom: 0px;

  /* *卡片组件样式重写* */
  :deep(.q-card__section) {
    margin: 0;
    padding: 0;
    line-height: 1;

    .row {

      /*  玩法及队名部分样式 */
      .bet-play-game {
        display: flex;
        align-item: flex-start;
        padding: 0;
        margin: 0;
        word-break: break-word;

        /*  弹出tips的样式 */
        .bet-play-text {
          .bet-match-playing {
            margin-right: 5px;
            margin-top: 2px;
            white-space: nowrap;
          }

          /*  盘口名称设置 */
          .bet-handicap-name {
            margin-top: 2px;
            white-space: pre-wrap;
          }
        }
      }

      /*  队伍名称 */
      .bet-play-team {
        display: flex;
        align-item: center;
        padding-right: 5px !important;
        min-height: 20px;

        /*  队伍名称 和 盘口值 */
        .bet-team-handicap {
          display: block;
          word-break: break-all;
          line-height: 1.3;

          /* 盘口值 -0.5 */
          label {
            margin-left: 5px;
            word-break: break-word;

            &.bet-handicap {
              text-align: center;
              padding: 0px 5px;
            }

            &.margin-left-0 {
              margin-left: 0px;
            }

            &.bet-text-nowrap {
              white-space: nowrap;
            }
          }
        }
      }
    }
  }

  /*  删除按钮  */
  .bet-del {
    z-index: 20;
    top: 0px;
  }
}
</style>