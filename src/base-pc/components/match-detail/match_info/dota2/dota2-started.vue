<!--
 * @Date: 2021-09-29 21:41:29
 * @FilePath: /user-pc1/src/project/yabo/components/match_details/match_info/dota2/dota2-started.vue
 * @Description: dota2已开赛详情比分模板
 * @Author: Echo
-->
<template>
  <div class="panel" v-if="isRouterAlive" >
    <div class="content">
        <!-- 主队 开始-->
        <div class="home">
            <div class="team_name home-name allow-user-select">{{lodash.get(match_info,'mhn')}}</div>
            <div class="img-wrap">
              <template v-if="$is_eports_csid(match_info.csid)">
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  v-img="([lodash.get(match_info,'mhlu'),lodash.get(match_info,'frmhn'),lodash.get(match_info,'csid')])"
                  class="team_logo"
                  alt
                />
              </template>
              <template v-else>
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  v-img="([lodash.get(match_info,'mhlu[0]'),lodash.get(match_info,'frmhn[0]'),lodash.get(match_info,'csid')])"
                  class="team_logo"
                  alt
                />
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  v-if="Array.isArray(match_info.mhlu) && lodash.get(match_info,'mhlu').length >1"
                  v-img="([lodash.get(match_info,'mhlu[1]'),lodash.get(match_info,'frmhn[1]'),lodash.get(match_info,'csid')])"
                  class="team_logo logo-double"
                  alt
                />
              </template>
            </div>
        </div>
        <!-- 主队 结束 -->
        <!-- 开赛时间 S-->
        <div class="match_time">
          <template>
            <div v-if="[1, 2, 3, 4].includes(lodash.get(match_info,'ms')*1)" class="started">
              <template v-if="scoring">
                <span class="text-judging">{{ i18n_t('mmp.100.scoring') }}</span>
              </template>
              <template v-else>
                <span class="text-big">{{lodash.get(match_info,'msc[S1].home')}}</span>
                <span class="text-big space">-</span>
                <span class="text-big">{{lodash.get(match_info,'msc[S1].away')}}</span>
              </template>
            </div>
            <match-date class="match_time-text" :match="match"></match-date>
          </template>
        </div>
        <!-- 开始时间 E -->
        <!-- 客队 S -->
        <div class="away">
            <div class="img-wrap">
              <template v-if="$is_eports_csid(match_info.csid)">
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  v-img="([lodash.get(match_info,'malu'),lodash.get(match_info,'frman'),lodash.get(match_info,'csid')])"
                  class="team_logo"
                  alt
                />
              </template>
              <template v-else>
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  v-img="([lodash.get(match_info,'malu[0]'),lodash.get(match_info,'frman[0]'),lodash.get(match_info,'csid')])"
                  class="team_logo"
                  alt
                />
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  v-if="Array.isArray(match_info.malu) && lodash.get(match_info,'malu').length >1"
                  v-img="([lodash.get(match_info,'malu[1]'),lodash.get(match_info,'frman[1]'),lodash.get(match_info,'csid')])"
                  class="team_logo logo-double"
                  alt
                />
              </template>
            </div>
            <div class="team_name away-name allow-user-select">{{lodash.get(match_info,'man')}}</div>
        </div>
        <!-- 客队 E -->
    </div>
  </div>
</template>
<script>
import {MatchProcessFullVersionWapper} from "src/components/match-process/index.js";
export default {
  data() {
    return {
      isRouterAlive: true,//重载页面开关
    };
  },
  components: {
    'match-date': MatchProcessFullVersionWapper
  },
  props: {
    match_info: Object
  },
  computed: {
    // 是否展示为比分判定中 
    scoring() {
      const { mmp } = this.match_info
      const home_score = lodash.get(this.match_info,'msc[S1].home')
      const away_score = lodash.get(this.match_info,'msc[S1].away')
      let scoring = false
      // 电竞未开赛 展示为 第一局
      const mmp_state = mmp || 1
      // 当前局数不等于 比分总和加一，則提示比分判定中
      if (mmp_state != (Number(home_score) + Number(away_score) + 1)) {
        scoring = true
      }
      return scoring
    }
  }
};
</script>


<style lang="scss" scoped>
.panel {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 130px;
  background-size: cover;
  .content {
    height: 130px;
    border-radius: 4px;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 0 14px;
    .roll_ball {
      display: flex;
      align-items: center;
      margin: 0 58px 6px 58px;
      span {
        font-size: 24px;
        font-weight: 500;
      }
    }
    .match_time-text {
      color: var(--q-gb-t-c-1);
      margin: 0 22px;
      display: flex;
      font-size: 12px;
      :deep(.date-wrap) {
        display: flex;
        flex-direction: column;
        .timer-layout {
          padding: 0;
        }
      }
    }

    /* ************** 信息面板 *************** -S */
    .img-wrap {
      flex-shrink: 0;
    }
    .home,
    .away,
    .match_time {
      display: flex;
      align-items: center;
    }
    .match_time {
      flex-flow: column;
      justify-content: center;
      min-width: 170px;
      .started {
        font-family: DIN-Medium;
        margin: 0 25px;
        .text-judging {
          font-size: 28px;
          letter-spacing: 4px;
        }
        .text-big {
          font-size: 48px;
          line-height: 1.2;
        }
        .space {
          margin: 0 10px;
        }
      }
      
      :deep(.date-wrap) {
        padding: 0 5px 0 10px;
      }
    }
    .team_name {
      display: -webkit-box;
      overflow: hidden;
      max-height: 100%;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-word;
      &.home-name {
        text-align: right;
      }
    }

    /* ************** 主队 *************** -S */
    .home {
      justify-content: flex-end;
      .img-wrap {
        justify-content: flex-end;
        margin-left: 20px;
        max-height: 100px;
      }
    }
    .team_name {
      text-align: right;
    }

    /* ************** 主队 *************** -E */
    /* ************** 客队 *************** -S */
    .away {
      justify-content: flex-start;
      .img-wrap {
        justify-content: flex-start;
        margin-right: 20px;
        max-height: 100px;
        overflow: hidden;
      }
    }
    .team_name {
      text-align: left;
      font-size: 20px;
    }
    /* ************** 客队 *************** -S */
    .home,
    .away {
      flex: 1;
      text-align: center;
    }
    .team_logo {
      max-width: 100px;
      max-height: 100px;
      &.logo-double {
        margin-left: -8px;
      }
    }
    img[class*="team-logo-"] {
      width: 100px;
    }

    /* ************** 信息面板 *************** -E */
  }
}

@media screen and (max-width: 1680px) {
  .panel {
    .content {
      max-width: 620px;
    }
  }
}

@media screen and (min-width: 1680px) {
  .panel {
    .content {
      width: 700px;
    }
  }
}
</style>