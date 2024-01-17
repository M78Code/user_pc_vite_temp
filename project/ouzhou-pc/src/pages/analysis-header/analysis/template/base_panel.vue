<!-- 
赛事分析---数据---基本面
 -->
<template>
  <div class="base_panel">
    <!-- 杯赛积分 -->
    <div
      v-if="vs_info && vs_info.length > 0"
      class="panel integrate"
      :class="{ show_all_rank: flag }"
    >
      <div class="panel-title">
        <!-- 联赛积分(无数字) 杯赛积分(有数字) -->
        <span v-if="tournamentTypeFinish">{{
          i18n_t(
            `analysis.cup_points${
              lodash.get(vs_info, "[0].tournamentType") == 2 ? "1" : ""
            }`
          ) +
          "-" +
          match.tnjc
        }}</span>
        <!-- 查看更多 -->
        <span
          class="ranking-more"
          v-if="lodash.get(vs_info, '[0].tournamentType') == 1"
          @click="show_more"
          >{{ i18n_t("analysis.show_more") }}</span
        >
      </div>
      <div class="d-header d-tr">
        <!-- 排名 -->
        <div class="d-td">{{ i18n_t("analysis.ranking") }}</div>
        <!-- 球队 -->
        <div class="d-td">{{ i18n_t("analysis.team") }}</div>
        <!-- 足球 -->
        <template v-if="match.csid == '1'">
          <!-- 联赛 -->
          <!-- <div class="d-td">{{i18n_t('analysis.league')}}</div> -->
          <!-- 场数 -->
          <div class="d-td">{{ i18n_t("analysis.game") }}</div>
          <!-- 胜 -->
          <div class="d-td">{{ i18n_t("analysis.victory") }}</div>
          <!-- 负 -->
          <div class="d-td">{{ i18n_t("analysis.negative") }}</div>
          <!-- 平 -->
          <div class="d-td">{{ i18n_t("analysis.flat") }}</div>
          <!-- 进/失 -->
          <div class="d-td">{{ i18n_t("analysis.gain_loss") }}</div>
          <!-- 净胜 -->
          <div class="d-td">{{ i18n_t("analysis.net_win") }}</div>
          <!-- 积分 -->
          <div class="d-td">{{ i18n_t("analysis.integral") }}</div>
        </template>
        <!-- 篮球 -->
        <template v-else>
          <!-- 胜 -->
          <div class="d-td">{{ i18n_t("analysis.victory") }}</div>
          <!-- 负 -->
          <div class="d-td">{{ i18n_t("analysis.negative") }}</div>
          <!-- 赢盘率 -->
          <div class="d-td">{{ i18n_t("analysis.Win_rate") }}</div>
        </template>
      </div>
      <!-- <div class="d-body d-tr" v-for="(item,index) in vs_info" :key="index" :style="{backgroundColor:unfold&&item.teamFlag?'#F5F5F5':'#ffffff' }"> -->
      <div
        class="d-body d-tr"
        v-for="(item, index) in vs_info"
        :key="index"
        :class="[
          item.teamName == match.mhn || item.teamName == match.man
            ? 'bold-class'
            : 'no-bold-class',
        ]"
      >
        <div class="d-td">
          <div class="ranking">{{ item.positionTotal }}</div>
        </div>
        <div
          class="d-td"
          :style="{
            fontWeight:
              item.teamName == match.mhn || item.teamName == match.man
                ? 'bold'
                : 'unset',
          }"
        >
          {{ item.teamName }}
        </div>
        <!-- 足球 -->
        <template v-if="match.csid == '1'">
          <!-- <div class="d-td" style="color: #191C24;">{{item.tournamentName}}</div> -->
          <div class="d-td">{{ item.matchCount }}</div>
          <div class="d-td">{{ item.winTotal }}</div>
          <div class="d-td">{{ item.lossTotal }}</div>
          <div class="d-td">{{ item.drawTotal }}</div>
          <div class="d-td">
            {{ item.goalsForTotal + "/" + item.goalsAgainstTotal }}
          </div>
          <div class="d-td">{{ item.goalDiffTotal }}</div>
          <div class="d-td">{{ item.pointsTotal }}</div>
        </template>
        <!-- 篮球 -->
        <template v-else>
          <div class="d-td">{{ item.winTotal }}</div>
          <div class="d-td">{{ item.lossTotal }}</div>
          <div class="d-td">
            {{ ((item.winTotal / item.matchCount) * 100).toFixed(2) }}%
          </div>
        </template>
      </div>
      <!-- 展开收起按钮 -->
      <div
        class="row justify-center"
        v-if="match.csid == '1' && vs_info_data.length > 2"
      >
        <div class="unfold-table" @click="unfoldTable">
          {{ unfold ? i18n_t("icon_tips.fold") : i18n_t("icon_tips.unfold") }}
        </div>
      </div>
    </div>

    <!-- 历史交战 -->
    <div class="panel history before">
      <div class="panel-title">
        <!-- 历史交战 -->
        <span>{{ i18n_t("analysis.historical_war") }}</span>
        <m-select name="vs" @click="selectedFn(arguments)" />
      </div>
      <div class="content">
        <div class="title">
          <div class="both home">
            <div class="team-name">
              <img
                v-img="[
                  lodash.get(match, 'mhlu[0]'),
                  lodash.get(match, 'frmhn[0]'),
                ]"
                class="logo"
                alt
              />
              <span>{{ match.mhn }}</span>
            </div>
            <div class="socre">
              <span class="label">
                {{ lodash.get(team_vs_history_result, "home.win") }}
                <!-- 胜 -->
                {{ i18n_t("analysis.victory") }}
                {{ lodash.get(team_vs_history_result, "home.dogfall") }}
                <!-- 平 -->
                {{ i18n_t("analysis.flat") }}
                {{ lodash.get(team_vs_history_result, "home.lose") }}
                <!-- 负 -->
                {{ i18n_t("analysis.negative") }}
              </span>
            </div>
          </div>
          <div class="vs">vs</div>
          <div class="both away">
            <div class="team-name">
              <span>{{ match.man }}</span>
              <img
                v-img="[
                  lodash.get(match, 'malu[0]'),
                  lodash.get(match, 'frman[0]'),
                ]"
                class="logo"
                alt
              />
            </div>
            <div class="socre">
              <span class="label">
                {{ lodash.get(team_vs_history_result, "away.win") }}
                <!-- 胜 -->
                {{ i18n_t("analysis.victory") }}
                {{ lodash.get(team_vs_history_result, "away.dogfall") }}
                <!-- 平 -->
                {{ i18n_t("analysis.flat") }}
                {{ lodash.get(team_vs_history_result, "away.lose") }}
                <!-- 负 -->
                {{ i18n_t("analysis.negative") }}
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
              <span>{{ formatTime(item.beginTime, "yy-mm-dd") }}</span>
              <span>{{ item.tournamentName }}</span>
            </div>
            <div
              :class="{
                fontBold: match.mhn == item.homeTeamName,
                font999: match.mhn != item.homeTeamName,
              }"
            >
              {{ item.homeTeamName }}
            </div>
          </div>
          <div class="score">
            <span>{{ item.homeTeamScore }}</span>
            <span class="line">-</span>
            <span>{{ item.awayTeamScore }}</span>
          </div>
          <div class="away">
            <div
              :class="{
                fontBold: match.mhn == item.awayTeamName,
                font999: match.mhn != item.awayTeamName,
              }"
            >
              {{ item.awayTeamName }}
            </div>
            <div class="result">
              <span :class="result_filter('cls', item.result)">{{
                result_filter("resultwinlose", item.result)
              }}</span>
              <span :class="result_filter('cls', item.handicapResult)">{{
                result_filter("resultwinlose", item.handicapResult)
              }}</span>
              <span :class="result_filter('cls', item.overunderResult)">{{
                result_filter("overunderLabel", item.overunderResult)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 近期战绩 -->
    <div class="panel history near">
      <div class="panel-title">
        <!-- 近期战绩 -->
        <span>{{ i18n_t("analysis.recent_record") }}</span>
        <m-select name="other" @click="selectedFn(arguments)" />
      </div>
      <div class="content">
        <div class="title">
          <div class="both home">
            <div class="team-name">
              <img
                v-img="[
                  lodash.get(match, 'mhlu[0]'),
                  lodash.get(match, 'frmhn[0]'),
                ]"
                class="logo"
                alt
              />
              <span>{{ match.mhn }}</span>
            </div>
            <div class="socre">
              <span class="label">
                {{ lodash.get(team_vs_other_team_result, "home.win") }}
                <!-- 胜 -->
                {{ i18n_t("analysis.victory") }}
                {{ lodash.get(team_vs_other_team_result, "home.dogfall") }}
                <!-- 平 -->
                {{ i18n_t("analysis.flat") }}
                {{ lodash.get(team_vs_other_team_result, "home.lose") }}
                <!-- 负 -->
                {{ i18n_t("analysis.negative") }}
              </span>
            </div>
          </div>
          <div class="both away">
            <div class="team-name">
              <span>{{ match.man }}</span>
              <img
                v-img="[
                  lodash.get(match, 'malu[0]'),
                  lodash.get(match, 'frman[0]'),
                ]"
                class="logo"
                alt
              />
            </div>
            <div class="socre">
              <span class="label">
                {{ lodash.get(team_vs_other_team_result, "away.win") }}
                <!-- 胜 -->
                {{ i18n_t("analysis.victory") }}
                {{ lodash.get(team_vs_other_team_result, "away.dogfall") }}
                <!-- 平 -->
                {{ i18n_t("analysis.flat") }}
                {{ lodash.get(team_vs_other_team_result, "away.lose") }}
                <!-- 负 -->
                {{ i18n_t("analysis.negative") }}
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
            <div
              class="d-tr"
              v-for="(item, index) in team_vs_other_team.home"
              :key="index"
            >
              <div class="info">
                <div
                  class="match-time ellipsis"
                  v-tooltip="{ content: item.tournamentName, overflow: 1 }"
                >
                  <span>{{ formatTime(item.beginTime, "yy-mm-dd") }}</span
                  ><br />
                  <span>{{ item.tournamentName }}</span>
                </div>
                <div class="both">
                  <span
                    class="ellipsis"
                    :class="{
                      fontBold: match.mhn == item.homeTeamName,
                      font999: match.mhn != item.homeTeamName,
                    }"
                    v-tooltip="{ content: item.homeTeamName, overflow: 1 }"
                    >{{ item.homeTeamName }}</span
                  >
                  <div class="score">
                    <span>{{ item.homeTeamScore }}</span>
                    <span class="line">-</span>
                    <span>{{ item.awayTeamScore }}</span>
                  </div>
                  <span
                    class="ellipsis"
                    :class="{
                      fontBold: match.mhn == item.awayTeamName,
                      font999: match.mhn != item.awayTeamName,
                    }"
                    v-tooltip="{ content: item.awayTeamName, overflow: 1 }"
                    >{{ item.awayTeamName }}</span
                  >
                </div>
              </div>
              <div class="result">
                <span :class="result_filter('cls', item.result)">{{
                  result_filter("resultwinlose", item.result)
                }}</span>
                <span :class="result_filter('cls', item.handicapResult)">
                  {{ result_filter("resultwinlose", item.handicapResult) }}
                </span>
                <span :class="result_filter('cls', item.overunderResult)">
                  {{ result_filter("overunderLabel", item.overunderResult) }}
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
            <div
              class="d-tr"
              v-for="(item, index) in team_vs_other_team.away"
              :key="index"
            >
              <div class="info">
                <div
                  class="match-time ellipsis"
                  v-tooltip="{ content: item.tournamentName, overflow: 1 }"
                >
                  <span>{{ formatTime(item.beginTime, "yy-mm-dd") }}</span
                  ><br />
                  <span>{{ item.tournamentName }}</span>
                </div>
                <div class="both">
                  <span
                    class="ellipsis"
                    :class="{
                      fontBold: match.man == item.homeTeamName,
                      font999: match.man != item.homeTeamName,
                    }"
                    v-tooltip="{ content: item.homeTeamName, overflow: 1 }"
                    >{{ item.homeTeamName }}</span
                  >
                  <div class="score">
                    <span>{{ item.homeTeamScore }}</span>
                    <span class="line">-</span>
                    <span>{{ item.awayTeamScore }}</span>
                  </div>
                  <span
                    class="ellipsis"
                    :class="{
                      fontBold: match.man == item.awayTeamName,
                      font999: match.man != item.awayTeamName,
                    }"
                    v-tooltip="{ content: item.awayTeamName, overflow: 1 }"
                    >{{ item.awayTeamName }}</span
                  >
                </div>
              </div>
              <div class="result">
                <span :class="result_filter('cls', item.result)">{{
                  result_filter("resultwinlose", item.result)
                }}</span>
                <span :class="result_filter('cls', item.handicapResult)">
                  {{ result_filter("resultwinlose", item.handicapResult) }}
                </span>
                <span :class="result_filter('cls', item.overunderResult)">
                  {{ result_filter("overunderLabel", item.overunderResult) }}
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
      <div class="panel-title">{{ i18n_t("analysis.Future_schedule") }}</div>
      <div class="simple-title">
        <div class="home">
          <img
            v-img="[
              lodash.get(match, 'mhlu[0]'),
              lodash.get(match, 'frmhn[0]'),
            ]"
            class="logo"
            alt
          />
          <span>{{ match.mhn }}</span>
        </div>
        <div class="away">
          <span>{{ match.man }}</span>
          <img
            v-img="[
              lodash.get(match, 'malu[0]'),
              lodash.get(match, 'frman[0]'),
            ]"
            class="logo"
            alt
          />
        </div>
      </div>
      <!-- 有内容的情况才渲染，方便调整样式 -->
      <div
        class="content"
        v-if="
          lodash.get(baseData, 'sThirdMatchFutureStatisticsDTOMap.1') &&
          lodash.get(baseData, 'sThirdMatchFutureStatisticsDTOMap.1').length &&
          lodash.get(baseData, 'sThirdMatchFutureStatisticsDTOMap.2') &&
          lodash.get(baseData, 'sThirdMatchFutureStatisticsDTOMap.2').length
        "
      >
        <div class="wrap-home">
          <div
            class="future-item"
            v-for="(item, index) in lodash.get(
              baseData,
              'sThirdMatchFutureStatisticsDTOMap.1'
            )"
            :key="index"
          >
            <div class="match-time ellipsis">
              <span>{{
                item.beginTime ? formatTime(item.beginTime, "yy-mm-dd") : "-"
              }}</span>
              <!-- X天后 -->
              <span
                >{{ item.intervalDay || "-" }}
                {{ i18n_t("analysis.day_later") }}</span
              ><br />
              <span>{{ item.tournamentName || "-" }}</span>
            </div>
            <div class="both">
              <div class="home-name">
                <span
                  class="ellipsis"
                  :class="{
                    fontBold: match.mhn == item.homeTeamName,
                    font999: match.mhn != item.homeTeamName,
                  }"
                  v-tooltip="{ content: item.homeTeamName, overflow: 1 }"
                >
                  <img v-img="['m']" class="team_logo logo" alt />
                  {{ item.homeTeamName || "-" }}
                </span>
              </div>
              <div class="vs">vs</div>
              <div class="away-name">
                <span
                  class="ellipsis"
                  :class="{
                    fontBold: match.mhn == item.awayTeamName,
                    font999: match.mhn != item.awayTeamName,
                  }"
                  v-tooltip="{ content: item.awayTeamName, overflow: 1 }"
                >
                  <img v-img="['m']" class="team_logo logo" alt />
                  {{ item.awayTeamName || "-" }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="wrap-away">
          <div
            class="future-item"
            v-for="(item, index) in lodash.get(
              baseData,
              'sThirdMatchFutureStatisticsDTOMap.2'
            )"
            :key="index"
          >
            <div class="match-time ellipsis">
              <span>{{
                item.beginTime ? formatTime(item.beginTime, "yy-mm-dd") : "-"
              }}</span>
              <!-- 天后 -->
              <span
                >{{ item.intervalDay || "-" }}
                {{ i18n_t("analysis.day_later") }}</span
              ><br />
              <span>{{ item.tournamentName || "-" }}</span>
            </div>
            <div class="both">
              <div class="home-name">
                <span
                  class="ellipsis"
                  :class="{
                    fontBold: match.man == item.homeTeamName,
                    font999: match.man != item.homeTeamName,
                  }"
                  v-tooltip="{ content: item.homeTeamName, overflow: 1 }"
                >
                  <img v-img="['m']" class="team_logo logo" alt />
                  {{ item.homeTeamName || "-" }}
                </span>
              </div>
              <div class="vs">vs</div>
              <div class="away-name">
                <span
                  class="ellipsis"
                  :class="{
                    fontBold: match.man == item.awayTeamName,
                    font999: match.man != item.awayTeamName,
                  }"
                  v-tooltip="{ content: item.awayTeamName, overflow: 1 }"
                >
                  <img v-img="['m']" class="team_logo logo" alt />
                  {{ item.awayTeamName || "-" }}
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
      <div class="panel-title">{{ i18n_t("analysis.injury") }}</div>
      <div
        class="simple-title"
        :class="{
          'simple-team':
            lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.1') &&
            lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.1').length &&
            lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.2') &&
            lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.2').length,
        }"
      >
        <div class="home">
          <img
            v-img="[
              lodash.get(match, 'mhlu[0]'),
              lodash.get(match, 'frmhn[0]'),
            ]"
            class="logo"
            alt
          />
          <span>{{ match.mhn }}</span>
        </div>
        <div class="away">
          <span>{{ match.man }}</span>
          <img
            v-img="[
              lodash.get(match, 'malu[0]'),
              lodash.get(match, 'frman[0]'),
            ]"
            class="logo"
            alt
          />
        </div>
      </div>
      <!-- 有内容的情况才渲染，方便调整样式 -->
      <div
        class="content"
        v-if="
          lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.1') &&
          lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.1').length &&
          lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.2') &&
          lodash.get(baseData, 'sThirdMatchSidelinedDTOMap.2').length
        "
      >
        <div class="wrap-home">
          <div
            class="item"
            v-for="(item, index) in lodash.get(
              baseData,
              'sThirdMatchSidelinedDTOMap.1'
            )"
            :key="index"
          >
            <div class="player-name">
              <span>{{ item.positionName }}</span>
              <span>{{ item.playerName }}</span>
            </div>
            <div>{{ item.reason }}</div>
          </div>
        </div>

        <div class="wrap-away">
          <div
            class="item"
            v-for="(item, index) in lodash.get(
              baseData,
              'sThirdMatchSidelinedDTOMap.2'
            )"
            :key="index"
          >
            <div class="player-name">
              <span>{{ item.positionName }}</span>
              <span>{{ item.playerName }}</span>
            </div>
            <div>{{ item.reason }}</div>
          </div>
        </div>
      </div>
      <div class="content no_data" v-else>
        <div class="wrap-home">{{ i18n_t("analysis.no_data") }}</div>
        <div class="wrap-away">{{ i18n_t("analysis.no_data") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import time_format from 'src/public/mixins/common/time_format'
import { formatTime } from "src/output/index.js";
import analysisData from "./analysis";
import mSelect from "./m_select.vue";
export default {
  data() {
    return {
      vs_info_data: [], //杯赛数据
      //默认：空，  flag= 0  排名榜全量展示
      flag: false,
      unfold: false,
      vs_info_new: [],
      formatTime,
    };
  },
  mixins: [analysisData],
  components: {
    mSelect,
  },
  props: {
    baseData: Object,
    tournamentTypeFinish: Boolean,
    vs_info: Array,
    vs_info_data: Array,
    team_vs_history: Array,
    team_vs_other_team: Object,
    team_vs_history_result: Object,
    team_vs_other_team_result: Object,
  },
  computed: {
    vs_info_list() {
      return this.unfold ? this.vs_info_new : this.vs_info;
    },
  },
  mounted() {},
  methods: {
    /**
     * @description: 历史交战、近期战绩下拉框
     */
    selectedFn(data) {
      this.$emit("selectedFn", data);
    },
    /**
     * @description: 杯赛积分查看更多
     */
    show_more() {
      this.flag = !this.flag;
      this.$emit("get_all_vsInfo", this.flag);
    },
    /**
     * @description: 展开收起联赛积分
     */
    unfoldTable() {
      this.unfold = !this.unfold;
      this.$emit("get_all_vsInfo", this.unfold);
    },
  },
  destroyed() {
    this.vs_info_data = null;
  },
};
</script>

<style lang="scss" scoped>
.panel {
  margin-bottom: 6px;
  min-width: 960px;
  .panel-title {
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
    .ranking-more {
      color: #414655;
      cursor: pointer;
    }
  }
}
/*  杯赛积分 */
.integrate {
  .d-header:not(:last-child) {
    border-bottom: 1px solid #e4eaff !important;
  }
  .d-body {
    color: #17191d;
    .d-td:not(:last-child) {
      border-right: 1px solid #e4eaff;
    }
  }
  .d-tr {
    display: flex;
    border-bottom: 1px solid #e4eaff;
    background: #ffffff;
    .d-td {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
      height: 100%;
      color: #414655;
      flex: 1;
      font-weight: 500;
      &:first-child {
        min-width: 6%;
        flex: unset;
      }
      &:nth-child(2) {
        width: 19%;
        flex: unset;
      }
      &:nth-child(3) {
        width: 17%;
        flex: unset;
      }
      &:last-child {
        border-right: transparent;
      }
    }
  }
  .bold-class {
    background: #fffcfa;
  }
  .d-header {
    height: 30px;
    // color: var(--qq--analysis-text-color-12);
    // background: var(--qq--analysis-bg-color-5);
    background: #FFF8F3;

    color: #414655;
  }
  .d-body {
    height: 40px;
    &:last-child {
      border-radius: 0 0 8px 8px;
    }
    .ranking {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      background: #afb3bb;
      color: #f2f2f2;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  &.show_all_rank {
    .d-tr:nth-child(3) {
      .ranking {
        background: #e03c00;
      }
    }
    .d-tr:nth-child(4) {
      .ranking {
        background: #ef7700;
      }
    }
    .d-tr:nth-child(5) {
      .ranking {
        background: #ff9323;
      }
    }
  }
}
/*  历史交战/近期战绩 */
.history {
  .content {
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 74px;
      padding: 0 20px;
      color: #414655;
      .vs {
        font-size: 16px;
        font-weight: 600;
        color: #1d1d1d;
      }
      .both {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        .team-name {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          .logo {
            width: 20px;
            height: 20px;
          }
        }
        .socre {
          display: flex;
          align-items: center;
          .label {
            color: #1d1d1d;
            font-size: 16px;
          }
          .item-wrap {
            display: flex;
            .item {
              height: 20px;
              width: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #414655;
              border-radius: 2px;
              margin-right: 5px;
              &:last-child {
                margin-right: 0;
              }
            }
          }
        }
        &.home {
          .team-name {
            .logo {
              margin-right: 10px;
            }
          }
          .label {
            margin-right: 10px;
          }
        }
        &.away {
          align-items: flex-end;
          .d-title {
            border-right: 1px solid #e4eaff;
          }
          .team-name {
            .logo {
              margin-left: 10px;
            }
          }
          .label {
            margin-left: 10px;
          }
        }
      }
    }
    .d-title {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      // background: var(--qq--analysis-bg-color-5);
      background: #fff8f3;
      height: 28px;
      color: #414655;
      padding: 0 20px;
      &:last-child {
        border-bottom: 1px solid #e4eaff;
        border-radius: 0 0 8px 8px;
      }
      span {
        width: 60px;
        margin-right: 10px;
        text-align: center;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .d-tr {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      border-bottom: 1px solid #e4eaff;
      .score {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #414655;
        font-size: 16px;
        font-weight: 600;
        .line {
          margin: 0 3px;
        }
      }
      .home {
        display: flex;
        align-items: center;

        flex: 1;
        div {
          width: 50%;
          flex: 1;
          height: 100%;
          &:nth-child(2) {
            text-align: center;
            line-height: 39px;
            border-left: 1px solid #e4eaff;
            border-right: 1px solid #e4eaff;
          }
        }
      }
      .away {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
      }
      .match-time {
        color: #414655;
        display: flex;
        align-items: center;
        span {
          margin-right: 6px;
          min-width: 50px;
        }
      }
      .result {
        display: flex;
        align-items: center;
        span {
          width: 50px;
          height: 20px;
          margin-right: 6px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
.fontBold {
  font-weight: 700;
  color: #414655;
  font-family: PingFangSC-Medium;
}
.font999 {
  color: #414655;
  font-family: PingFangSC-Regular;
}
.before {
  .content {
    .d-title {
      border-left: 1px solid #e4eaff;
      border-right: 1px solid #e4eaff;
      padding: 0;
      div {
        width: 22.15%;
        max-width: 213px;
        display: flex;
        justify-content: space-around;
      }
    }
    .d-tr:last-child {
      border-radius: 0 0 8px 8px;
    }
  }
  .d-tr {
    height: 40px;
    padding: 0 !important;
    .home {
      .match-time {
        padding-left: 20px;
      }
      div:nth-child(2) {
        width: 200px;
      }
      div {
        flex: 1;
      }
    }
    .away {
      div {
        flex: 1;
      }
      div:first-child {
        width: 200px;
        text-align: center;
        border-right: 1px solid #e4eaff;
        height: 100%;
        line-height: 39px;
      }
      .result {
        justify-content: space-around;
        max-width: 213px;
      }
    }
    .score {
      width: 110px;
      border-right: 1px solid #e4eaff;
    }
  }
}
/*  近期战绩 */
.near {
  .both:first-child {
    border-right: 1px solid #e4eaff;
  }
  .t-body {
    border-top: none;
    display: flex;
    .home,
    .away {
      flex: 1;
      overflow: hidden;
    }
    .home {
      border-right: 1px solid #e4eaff;
      .d-title {
        border-left: 1px solid #e4eaff;
        padding: 0;
        &:last-child {
          border-radius: 0 0 0 8px;
        }
        div {
          width: 168px;
          display: flex;
          justify-content: space-around;
          span {
            margin: 0;
          }
        }
      }
      .d-tr {
        border-right: none !important;
        border-left: 1px solid #e4eaff;
        &:last-child {
          border-radius: 0 0 0 8px;
        }
      }
    }
    .away {
      .d-title {
        padding: 0;
        &:last-child {
          border-radius: 0 0 8px 0;
        }
        div {
          width: 168px;
          display: flex;
          justify-content: space-around;
          span {
            margin: 0;
          }
        }
      }
      .d-title,
      .d-tr {
        border-right: 1px solid #e4eaff;
        border-left: none !important;
      }
      .d-tr:last-child {
        border-radius: 0 0 8px 0;
      }
    }
    .d-tr {
      padding: 0 !important;
      height: 56px;
      border-right: 1px solid #e4eaff;
      &:last-child {
        border-bottom: 1px solid #e4eaff;
      }
      .result {
        width: 168px;
        justify-content: space-around;
        span {
          margin-right: 0 !important;
        }
      }
      .info {
        flex: 1;

        display: flex;
        overflow: hidden;
        .match-time {
          display: unset;
          border-right: 1px solid #e4eaff;

          padding: 10px 0 0 10px;
          flex: 1;
        }
        .both {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-right: 1px solid #e4eaff;

          width: 70%;
          & > span {
            flex: 1;
            width: 38%;
            text-align: center;
          }
          .score {
            width: 33%;
            height: 100%;
            border-left: 1px solid #e4eaff;
            border-right: 1px solid #e4eaff;
          }
        }
      }
    }
  }
}
/*  未来赛程/伤停情况 */
.details {
  .simple-title {
    display: flex;
    padding: 0 20px;
    color: #414655;
    border-bottom: 1px solid #e4eaff;
    .home {
      .logo {
        margin-right: 10px;
      }
    }
    .away {
      justify-content: flex-end;
      .logo {
        margin-left: 10px;
      }
    }
    .logo {
      width: 20px;
      height: 20px;
    }
  }
  .home,
  .away,
  .future-item {
    display: flex;
    align-items: center;
    height: 40px;
    flex: 1;
  }
  .home {
    border-right: 1px solid #e4eaff;
  }
  .d-tr {
    display: flex;
    border-bottom: 1px solid #e4eaff;
    &:last-child {
      border-bottom: transparent;
    }
    .home,
    .away {
      color: #414655;
    }
  }
  .content {
    display: flex;
    .wrap-home {
      border-right: 1px solid #e4eaff;
    }
    .future-item {
      border-bottom: 1px solid #e4eaff;
      padding: 0 10px 0 20px;
    }
    .wrap-home,
    .wrap-away {
      color: #414655;
      flex: 1;
      .logo {
        width: 14px;
        height: 14px;
      }
      .both {
        display: flex;
        align-items: center;
        width: 267px;
        color: #414655;
        .home-name,
        .away-name {
          display: flex;
          align-items: center;
          flex: 1;
          overflow: hidden;
        }
        .home-name {
          .logo {
            margin-right: 6px;
            vertical-align: sub;
          }
        }
        .away-name {
          .logo {
            margin-left: 6px;
            vertical-align: sub;
          }
        }
        .vs {
          text-align: center;
          width: 77px;
          font-size: 16px;
        }
      }
      .match-time {
        flex: 1;
        span {
          margin-right: 6px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .item {
      padding: 0 10px 0 20px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      height: 56px;
      &:first-child {
        border-top: none;
      }
    }
    .player-name {
      color: #414655;
      span:first-child {
        margin-right: 6px;
      }
    }
  }
}

/*  伤停情况 */
.hurt {
  .simple-title:not(:last-child) {
    border-bottom: 0;
  }
  .simple-team {
    border-bottom: 1px solid #e4eaff !important;
    .home {
      border-bottom: 0;
    }
  }
  .content {
    .item:not(:last-child) {
      border-bottom: 1px solid #e4eaff;
    }
    .wrap-home {
      border-left: 1px solid #e4eaff;
      border-bottom: 1px solid #e4eaff;
      border-radius: 0 0 0 8px;
    }
    .wrap-away {
      border-bottom: 1px solid #e4eaff;
      border-right: 1px solid #e4eaff;
      border-radius: 0 0 8px 0;
    }
  }
  .content.no_data {
    display: flex;
    border-top: 1px solid #e4eaff;

    text-align: center;
    height: 40px;
    line-height: 40px;
    .wrap-away {
      border-right: 1px solid #e4eaff;
    }
    .wrap-home {
      border-radius: 0 0 0 8px;
    }
    .wrap-away {
      border-radius: 0 0 8px 0;
    }
  }
}
/*  未来赛程 */
.future {
  .wrap-home,
  .wrap-away {
    border-bottom: none;
  }
  .content {
    .both {
      flex: 1;
      height: 100%;
      .home-name,
      .away-name {
        display: unset !important;
        text-align: center;
        .ellipsis {
          width: 85%;
          display: inline-block;
        }
      }
      .away-name {
        .ellipsis {
          direction: rtl;
        }
      }
      .vs {
        height: 100%;
        border-left: 1px solid #e4eaff;
        border-right: 1px solid #e4eaff;
        line-height: 39px;
      }
    }
    .match-time {
      width: 23%;
      flex: none !important;
      height: 100%;
      border-right: 1px solid #e4eaff;
      padding-top: 2px;
    }
    .wrap-home {
      .future-item:last-child {
        border-radius: 0 0 0 8px;
      }
    }
    .wrap-away {
      .future-item:last-child {
        border-radius: 0 0 8px 0;
      }
    }
  }
}

.unfold-table {
  width: 82px;
  height: 24px;
  background-color: #179cff;
  line-height: 24px;
  font-size: 12px;
  text-align: center;
  color: #414655;
  border-radius: 0 0 6px 6px;
  cursor: pointer;
}
</style>
