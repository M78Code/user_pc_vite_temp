<!--
 * @Description: 投注结果
-->
<template>
  <!--单关投注项信息组件-->
  <q-card flat class="relative-position bet-card bet-single-items-card">
    <q-card-section>

      <div class="col bet-league-name">
        <!--联赛名称-->
        {{ items.matchInfo }}
      </div>
      <!--删除按钮-->
      <div class="col-auto bet-icon-info">
        <template v-if="items.orderStatusCode == 0">
          <!--投注失败图标-->
          <icon-wapper name="icon-failure" size="18px"/>
        </template>
        <template v-if="items.orderStatusCode == 1">
          <!--投注成功图标 绿色的勾勾-->
          <icon-wapper name="icon-success" size="18px"/>
        </template>
        <template v-if="items.orderStatusCode == 2">
          <!--投注确认中转圈，滚球才有的转圈圈-->
          <span class="bet-confirm-handle">
            <img />
          </span>
        </template>
      </div>

      <div class="row">
        <div class="col">
          <!--足,蓝,棒,乒,排[1,2,3,8,9]-->
          <div class="against" >{{ items.matchName }} </div>

          <!--不是滚球-->
          <!--1 ：早盘赛事 ，2： 滚球盘赛事， -->
          <div class="row" v-if="items.matchType == 1">
            <div class="col match-time">
              <!--赛事时间-->
              {{ formatTime(items.match_time, "mm月DD日 HH:MM") }}
            </div>
          </div>
        </div>
      </div>

      <div class="bet-content">
        <div class="row">
          <!--玩法及队名部分样式-->
          <span class="mr-4 text-009 text-flow-none handicap-type" v-if="items.matchType == 2">{{'[' + i18n_t("bet.bowls") + ']'}}</span>

          <span>
            {{ items.playName }}<em v-if="items.score_benchmark">{{items.score_benchmark}}</em>
          </span>

          <span class="handicap-type">[{{ i18n_t(`odds.${items.marketType}`) }}]</span> 
        </div>

        <div class="text-flow-none handicap-type">{{items.playOptionName}}</div> 

        <!-- 赔率 -->
        <div class="bet-team-handicap-odd">
          <div class="col bet-odds-value">
            <!--投注赔率1.87-->
            <span class="odds-value yb-number-bold">
              <span>@</span>{{ items.oddsValues }}
            </span>
          </div>
        </div>

      </div>
    </q-card-section>

  </q-card>
</template>
<script setup>
import { formatTime } from "src/output/index.js"
import { IconWapper } from 'src/components/icon'

const props = defineProps({
  items: {}
})



</script>


<style lang="scss" scoped>
.bet-content{
  padding: 8px;
  background: var(--q-bet-box-6);
  border-radius: 6px;
}
.bet-league-name{
  font-size: 13px;
  color: var(--q-bet-box-1);
  font-weight: 600;
  line-height: 1.8;
}
.against{
  color: var(--q-gb-t-c-20);
  font-size: 13px;
  line-height: 1.8;
}
</style>