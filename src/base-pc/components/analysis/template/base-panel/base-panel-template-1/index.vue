<template>
  <div class="base_panel">
    <!-- 杯赛积分 -->
    <div class="panel integrate" :class="{ 'show_all_rank': flag }">
      <div class="panel-title">
        <!-- 联赛积分(无数字) 杯赛积分(有数字) -->
        <span
          v-if="tournamentTypeFinish">{{ i18n_t(`analysis.cup_points${lodash.get(vs_info, '[0].tournamentType') == 2 ? '1' : ''}`) }}</span>
        <!-- 查看更多 -->
        <span class="ranking-more" v-if="lodash.get(vs_info, '[0].tournamentType') == 1"
          @click="show_more">{{ i18n_t('analysis.show_more') }}</span>
      </div>
      <div class="d-header d-tr">
        <!-- 排名 -->
        <div class="d-td">{{ i18n_t('analysis.ranking') }}</div>
        <!-- 球队 -->
        <div class="d-td">{{ i18n_t('analysis.team') }}</div>
        <!-- 足球 -->
        <template v-if="match.csid == '1'">
          <!-- 联赛 -->
          <div class="d-td">{{ i18n_t('analysis.league') }}</div>
          <!-- 场数 -->
          <div class="d-td">{{ i18n_t('analysis.game') }}</div>
          <!-- 胜 -->
          <div class="d-td">{{ i18n_t('analysis.victory') }}</div>
          <!-- 负 -->
          <div class="d-td">{{ i18n_t('analysis.negative') }}</div>
          <!-- 平 -->
          <div class="d-td">{{ i18n_t('analysis.flat') }}</div>
          <!-- 进/失 -->
          <div class="d-td">{{ i18n_t('analysis.gain_loss') }}</div>
          <!-- 净胜 -->
          <div class="d-td">{{ i18n_t('analysis.net_win') }}</div>
          <!-- 积分 -->
          <div class="d-td">{{ i18n_t('analysis.integral') }}</div>
        </template>
        <!-- 篮球 -->
        <template v-else>
          <!-- 胜 -->
          <div class="d-td">{{ i18n_t('analysis.victory') }}</div>
          <!-- 负 -->
          <div class="d-td">{{ i18n_t('analysis.negative') }}</div>
          <!-- 赢盘率 -->
          <div class="d-td">{{ i18n_t('analysis.Win_rate') }}</div>
        </template>
      </div>
      <div class="d-body d-tr" v-for="(item, index) in vs_info" :key="index">
        <div class="d-td">
          <div class="ranking">{{ item.positionTotal }}</div>
        </div>
        <div class="d-td"
          :style="{ 'fontWeight': (item.teamName == match.mhn || item.teamName == match.man) ? 'bold' : 'unset', 'color': '#191C24' }">
          {{ item.teamName }}</div>
        <!-- 足球 -->
        <template v-if="match.csid == '1'">
          <div class="d-td" style="color: #191C24;">{{ item.tournamentName }}</div>
          <div class="d-td">{{ item.matchCount }}</div>
          <div class="d-td">{{ item.winTotal }}</div>
          <div class="d-td">{{ item.lossTotal }}</div>
          <div class="d-td">{{ item.drawTotal }}</div>
          <div class="d-td">{{ item.goalsForTotal + '/' + item.goalsAgainstTotal }}</div>
          <div class="d-td">{{ item.goalDiffTotal }}</div>
          <div class="d-td">{{ item.pointsTotal }}</div>
        </template>
        <!-- 篮球 -->
        <template v-else>
          <div class="d-td">{{ item.winTotal }}</div>
          <div class="d-td">{{ item.lossTotal }}</div>
          <div class="d-td">{{ (item.winTotal / item.matchCount * 100).toFixed(2) }}%</div>
        </template>
      </div>
    </div>

    <!-- 历史交战 -->
    <div class="panel history before">
      <div class="panel-title">
        <!-- 历史交战 -->
        <span>{{ i18n_t('analysis.historical_war') }}</span>
        <m-select name="vs" @click="selectedFn(arguments)" />
      </div>
      <div class="content">
        <div class="title">
          <div class="both home">
            <div class="team-name">
              <img v-img="([lodash.get(match, 'mhlu[0]'), lodash.get(match, 'frmhn[0]')])" class="logo" alt />
              <span>{{ match.mhn }}</span>
            </div>
            <div class="socre">
              <span class="label">
                {{ lodash.get(team_vs_history_result, 'home.win') }}
                <!-- 胜 -->
                {{ i18n_t('analysis.victory') }}
                {{ lodash.get(team_vs_history_result, 'home.dogfall') }}
                <!-- 平 -->
                {{ i18n_t('analysis.flat') }}
                {{ lodash.get(team_vs_history_result, 'home.lose') }}
                <!-- 负 -->
                {{ i18n_t('analysis.negative') }}
              </span>
            </div>
          </div>
          <div class="vs">vs</div>
          <div class="both away">
            <div class="team-name">
              <span>{{ match.man }}</span>
              <img v-img="([lodash.get(match, 'malu[0]'), lodash.get(match, 'frman[0]')])" class="logo" alt />
            </div>
            <div class="socre">
              <span class="label">
                {{ lodash.get(team_vs_history_result, 'away.win') }}
                <!-- 胜 -->
                {{ i18n_t('analysis.victory') }}
                {{ lodash.get(team_vs_history_result, 'away.dogfall') }}
                <!-- 平 -->
                {{ i18n_t('analysis.flat') }}
                {{ lodash.get(team_vs_history_result, 'away.lose') }}
                <!-- 负 -->
                {{ i18n_t('analysis.negative') }}
              </span>
            </div>
          </div>
        </div>
        <div class="d-title">
          <div>
            <!-- 赛果 -->
            <span>{{ i18n_t("results.result") }}</span>
            <!-- 盘口 -->
            <span>{{ i18n_t("analysis.picks") }}</span>
            <!-- 大小 -->
            <span>{{ i18n_t("analysis.size") }}</span>
          </div>
        </div>
        <div class="d-tr" v-for="(item, index) in team_vs_history" :key="index">
          <div class="home">
            <div class="match-time">
              <span>{{ formatTime(item.beginTime, 'yy-mm-dd') }}</span>
              <span>{{ item.tournamentName }}</span>
            </div>
            <div :class="{ 'fontBold': match.mhn == item.homeTeamName, 'font999': match.mhn != item.homeTeamName }">
              {{ item.homeTeamName }}</div>
          </div>
          <div class="score">
            <span>{{ item.homeTeamScore }}</span>
            <span class="line">-</span>
            <span>{{ item.awayTeamScore }}</span>
          </div>
          <div class="away">
            <div :class="{ 'fontBold': match.mhn == item.awayTeamName, 'font999': match.mhn != item.awayTeamName }">
              {{ item.awayTeamName }}</div>
            <div class="result">
              <span :class="result_filter('cls', item.result)">{{ result_filter('resultwinlose', item.result) }}</span>
              <span
                :class="result_filter('cls', item.handicapResult)">{{ result_filter('resultwinlose', item.handicapResult) }}</span>
              <span
                :class="result_filter('cls', item.overunderResult)">{{ result_filter('overunderLabel', item.overunderResult) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 近期战绩44 -->
    <div class="panel history near">
      <div class="panel-title">
        <!-- 近期战绩 33-->
        <span>{{ i18n_t('analysis.recent_record') }}</span>
        <m-select name="other" @click="selectedFn(arguments)" />
      </div>
      <div class="content">
        <div class="title">
          <div class="both home">
            <div class="team-name">
              <img v-img="([lodash.get(match, 'mhlu[0]'), lodash.get(match, 'frmhn[0]')])" class="logo" alt />
              <span>{{ match.mhn }}</span>
            </div>
            <div class="socre">
              <span class="label">
                {{ lodash.get(team_vs_other_team_result, 'home.win') }}
                <!-- 胜 -->
                {{ i18n_t('analysis.victory') }}
                {{ lodash.get(team_vs_other_team_result, 'home.dogfall') }}
                <!-- 平 -->
                {{ i18n_t('analysis.flat') }}
                {{ lodash.get(team_vs_other_team_result, 'home.lose') }}
                <!-- 负 -->
                {{ i18n_t('analysis.negative') }}
              </span>
            </div>
          </div>
          <div class="both away">
            <div class="team-name">
              <span>{{ match.man }}</span>
              <img v-img="([lodash.get(match, 'malu[0]'), lodash.get(match, 'frman[0]')])" class="logo" alt />
            </div>
            <div class="socre">
              <span class="label">
                {{ lodash.get(team_vs_other_team_result, 'away.win') }}
                <!-- 胜 -->
                {{ i18n_t('analysis.victory') }}
                {{ lodash.get(team_vs_other_team_result, 'away.dogfall') }}
                <!-- 平 -->
                {{ i18n_t('analysis.flat') }}
                {{ lodash.get(team_vs_other_team_result, 'away.lose') }}
                <!-- 负 -->
                {{ i18n_t('analysis.negative') }}
              </span>
            </div>
          </div>
        </div>
        <div class="t-body">
          <div class="home">
            <div class="d-title">
              <div>
                <!-- 赛果 -->
                <span>{{ i18n_t("results.result") }}</span>
                <!-- 盘口 -->
                <span>{{ i18n_t("analysis.picks") }}</span>
                <!-- 大小 -->
                <span>{{ i18n_t("analysis.size") }}</span>
              </div>
            </div>
            <div class="d-tr" v-for="(item, index) in team_vs_other_team.home" :key="index">
              <div class="info">
                <div class="match-time ellipsis" v-tooltip="{ content: item.tournamentName, overflow: 1 }">
                  <span>{{ formatTime(item.beginTime, 'yy-mm-dd') }}</span><br>
                  <span>{{ item.tournamentName }}</span>
                </div>
                <div class="both">
                  <span class="ellipsis"
                    :class="{ 'fontBold': match.mhn == item.homeTeamName, 'font999': match.mhn != item.homeTeamName }"
                    v-tooltip="{ content: item.homeTeamName, overflow: 1 }">{{ item.homeTeamName }}</span>
                  <div class="score">
                    <span>{{ item.homeTeamScore }}</span>
                    <span class="line">-</span>
                    <span>{{ item.awayTeamScore }}</span>
                  </div>
                  <span class="ellipsis"
                    :class="{ 'fontBold': match.mhn == item.awayTeamName, 'font999': match.mhn != item.awayTeamName }"
                    v-tooltip="{ content: item.awayTeamName, overflow: 1 }">{{ item.awayTeamName }}</span>
                </div>
              </div>
              <div class="result">
                <span :class="result_filter('cls', item.result)">{{ result_filter('resultwinlose', item.result) }}</span>
                <span :class="result_filter('cls', item.handicapResult)">
                  {{ result_filter('resultwinlose', item.handicapResult) }}
                </span>
                <span :class="result_filter('cls', item.overunderResult)">
                  {{ result_filter('overunderLabel', item.overunderResult) }}
                </span>
              </div>
            </div>
          </div>
          <div class="away">
            <div class="d-title">
              <div>
                <!-- 赛果 -->
                <span>{{ i18n_t("results.result") }}</span>
                <!-- 盘口 -->
                <span>{{ i18n_t("analysis.picks") }}</span>
                <!-- 大小 -->
                <span>{{ i18n_t("analysis.size") }}</span>
              </div>
            </div>
            <div class="d-tr" v-for="(item, index) in team_vs_other_team.away" :key="index">
              <div class="info">
                <div class="match-time ellipsis" v-tooltip="{ content: item.tournamentName, overflow: 1 }">
                  <span>{{ formatTime(item.beginTime, 'yy-mm-dd') }}</span><br>
                  <span>{{ item.tournamentName }}</span>
                </div>
                <div class="both">
                  <span class="ellipsis"
                    :class="{ 'fontBold': match.man == item.homeTeamName, 'font999': match.man != item.homeTeamName }"
                    v-tooltip="{ content: item.homeTeamName, overflow: 1 }">{{ item.homeTeamName }}</span>
                  <div class="score">
                    <span>{{ item.homeTeamScore }}</span>
                    <span class="line">-</span>
                    <span>{{ item.awayTeamScore }}</span>
                  </div>
                  <span class="ellipsis"
                    :class="{ 'fontBold': match.man == item.awayTeamName, 'font999': match.man != item.awayTeamName }"
                    v-tooltip="{ content: item.awayTeamName, overflow: 1 }">{{ item.awayTeamName }}</span>
                </div>
              </div>
              <div class="result">
                <span :class="result_filter('cls', item.result)">{{ result_filter('resultwinlose', item.result) }}</span>
                <span :class="result_filter('cls', item.handicapResult)">
                  {{ result_filter('resultwinlose', item.handicapResult) }}
                </span>
                <span :class="result_filter('cls', item.overunderResult)">
                  {{ result_filter('overunderLabel', item.overunderResult) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 未来赛程 -->
    <div class="panel future details" v-if="match.csid == '1'">
      <!-- 未来赛程 -->
      <div class="panel-title">{{ i18n_t('analysis.Future_schedule') }}</div>
      <div class="simple-title">
        <div class="home">
          <img v-img="([lodash.get(match, 'mhlu[0]'), lodash.get(match, 'frmhn[0]')])" class="logo" alt />
          <span>{{ match.mhn }}</span>
        </div>
        <div class="away">
          <span>{{ match.man }}</span>
          <img v-img="([lodash.get(match, 'malu[0]'), lodash.get(match, 'frman[0]')])" class="logo" alt />
        </div>
      </div>
      <!-- 有内容的情况才渲染，方便调整样式 -->
      <div class="content"
        v-if="(lodash.get(baseData, 'sThirdMatchFutureStatisticsDTOMap.1') && lodash.get(baseData, 'sThirdMatchFutureStatisticsDTOMap.1').length) && (lodash.get(baseData, 'sThirdMatchFutureStatisticsDTOMap.2') && lodash.get(baseData, 'sThirdMatchFutureStatisticsDTOMap.2').length)">
        <div class="wrap-home">
          <div class="future-item" v-for="(item, index) in lodash.get(baseData, 'sThirdMatchFutureStatisticsDTOMap.1')"
            :key="index">
            <div class="match-time ellipsis">
              <span>{{ item.beginTime ? formatTime(item.beginTime, 'yy-mm-dd') : '-' }}</span>
              <!-- X天后 -->
              <span>{{ item.intervalDay || '-' }} {{ i18n_t("analysis.day_later") }}</span><br>
              <span>{{ item.tournamentName || '-' }}</span>
            </div>
            <div class="both">
              <div class="home-name">
                <span class="ellipsis"
                  :class="{ 'fontBold': match.mhn == item.homeTeamName, 'font999': match.mhn != item.homeTeamName }"
                  v-tooltip="{ content: item.homeTeamName, overflow: 1 }">
                  <img v-img="(['m'])" class="team_logo logo" alt />
                  {{ item.homeTeamName || '-' }}
                </span>
              </div>
              <div class="vs">vs</div>
              <div class="away-name">
                <span class="ellipsis"
                  :class="{ 'fontBold': match.mhn == item.awayTeamName, 'font999': match.mhn != item.awayTeamName }"
                  v-tooltip="{ content: item.awayTeamName, overflow: 1 }">
                  <img v-img="(['m'])" class="team_logo logo" alt />
                  {{ item.awayTeamName || '-' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="wrap-away">
          <div class="future-item" v-for="(item, index) in lodash.get(baseData, 'sThirdMatchFutureStatisticsDTOMap.2')"
            :key="index">
            <div class="match-time ellipsis">
              <span>{{ item.beginTime ? formatTime(item.beginTime, 'yy-mm-dd') : '-' }}</span>
              <!-- 天后 -->
              <span>{{ item.intervalDay || '-' }} {{ i18n_t("analysis.day_later") }}</span><br>
              <span>{{ item.tournamentName || '-' }}</span>
            </div>
            <div class="both">
              <div class="home-name">
                <span class="ellipsis"
                  :class="{ 'fontBold': match.man == item.homeTeamName, 'font999': match.man != item.homeTeamName }"
                  v-tooltip="{ content: item.homeTeamName, overflow: 1 }">
                  <img v-img="(['m'])" class="team_logo logo" alt />
                  {{ item.homeTeamName || '-' }}
                </span>
              </div>
              <div class="vs">vs</div>
              <div class="away-name">
                <span class="ellipsis"
                  :class="{ 'fontBold': match.man == item.awayTeamName, 'font999': match.man != item.awayTeamName }"
                  v-tooltip="{ content: item.awayTeamName, overflow: 1 }">
                  <img v-img="(['m'])" class="team_logo logo" alt />
                  {{ item.awayTeamName || '-' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 伤停情况 -->
    <div class="panel hurt details" v-if="match.csid == '1'">
      <!-- 伤停情况 -->
      <div class="panel-title">{{ i18n_t('analysis.injury') }}</div>
      <div class="simple-title "
        :class="{ 'simple-team': (lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.1') && lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.1').length) && (lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.2') && lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.2').length) }">
        <div class="home">
          <img v-img="([lodash.get(match, 'mhlu[0]'), lodash.get(match, 'frmhn[0]')])" class="logo" alt />
          <span>{{ match.mhn }}</span>
        </div>
        <div class="away">
          <span>{{ match.man }}</span>
          <img v-img="([lodash.get(match, 'malu[0]'), lodash.get(match, 'frman[0]')])" class="logo" alt />
        </div>
      </div>
      <!-- 有内容的情况才渲染，方便调整样式 -->
      <div class="content"
        v-if="(lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.1') && lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.1').length) && (lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.2') && lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.2').length)">
        <div class="wrap-home">
          <div class="item" v-for="(item, index) in lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.1')" :key="index">
            <div class="player-name">
              <span>{{ item.positionName }}</span>
              <span>{{ item.playerName }}</span>
            </div>
            <div>{{ item.reason }}</div>
          </div>
        </div>

        <div class="wrap-away">
          <div class="item" v-for="(item, index) in lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.2')" :key="index">
            <div class="player-name">
              <span>{{ item.positionName }}</span>
              <span>{{ item.playerName }}</span>
            </div>
            <div>{{ item.reason }}</div>
          </div>
        </div>
      </div>
      <div class="content no_data" v-else>
        <div class="wrap-home">{{ i18n_t('analysis.no_data') }}</div>
        <div class="wrap-away">{{ i18n_t('analysis.no_data') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onUnmounted } from 'vue';
 
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
// const { match,tournamentTypeFinish,vs_info } = useRegistPropsHelper(component_symbol, defineProps(need_register_props))
import { formatTime, result_filter } from 'src/output/index.js'
import { MSelectFullVersionWapper as MSelect } from 'src/base-pc/components/analysis/template/m-select/index.js'
const props = defineProps(need_register_props)
//杯赛数据
const vs_info_data = ref([]);
//默认：空，  flag= 0  排名榜全量展示 
const flag = ref(false);
const emits = defineEmits(["selectedFn", "get_all_vsInfo"])

/**
* @description: 历史交战、近期战绩下拉框
*/
const selectedFn = (data) => {
  emits("selectedFn", data)
}
/**
* @description: 杯赛积分查看更多
*/
const show_more = () => {
  flag.value = flag.value
  emits("get_all_vsInfo", flag.value)
}
onUnmounted(() => {
  vs_info_data.value = null
})

</script>

<style lang="scss" scoped>@import url('./index.scss');</style>