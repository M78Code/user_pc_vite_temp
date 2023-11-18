<!--
 * @
 * @Author: Yellow
 * @Description: VR足球、VR篮球对阵模板(赛前、滚球、未开赛)
 * @Date: 2020-10-04 11:54:02
-->
<template>
  <div class="panel" v-if="isRouterAlive" >
    <div class="content">
        <!-- 主队 开始-->
        <div class="home">
            <div class="team_name home-name allow-user-select" v-if="is_virtual">{{lodash.get(match_info,'teams[0]')}}</div>
            <div class="team_name home-name allow-user-select" v-else>{{lodash.get(match_info,'mhn')}}</div>
            <div class="img-wrap">
              <!-- 主队 虚拟足球 虚拟篮球 -->
              <template v-if="[1001,1004].includes(match_info.csid*1)">
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  v-img="([lodash.get(match_info,'mhlu'),lodash.get(match_info,'frmhn')])"
                  class="team_logo"
                  alt
                />
              </template>
              <template v-else>
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  v-img="([lodash.get(match_info,'mhlu[0]'),lodash.get(match_info,'frmhn[0]')])"
                  class="team_logo"
                  alt
                />
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  v-if="Array.isArray(match_info.mhlu) && lodash.get(match_info,'mhlu').length >1"
                  v-img="([lodash.get(match_info,'mhlu[1]'),lodash.get(match_info,'frmhn[1]')])"
                  class="team_logo logo-double"
                  alt
                />
              </template>
            </div>
        </div>
        <!-- 主队 结束 -->
        <!-- 开赛时间 S-->
        <div class="match_time">
          <!-- 虚拟体育 -->
          <template v-if="is_virtual">
            <div class="roll_ball">
              <img src="/image/yabo/svg/details_vs.svg" width="28" style="margin: 0 22px" alt="">
            </div>
          </template>
          <!-- 虚拟体育 -->

          <template v-else>
            <div v-if="lodash.get(match_info,'ms') == 1" class="roll_ball">
              <span>{{panel_score.home}}</span>
              <img src="/image/yabo/svg/details_vs.svg" width="28" style="margin: 0 22px" alt="">
              <span>{{panel_score.away}}</span>
            </div>
            <match-date v-if="lodash.get(match_info,'ms')!=1" class="match_time-text" :match_props="{match:match_info}"></match-date>
          </template>
        </div>

        <!-- 开始时间 E -->
        <!-- 客队 S -->
        <div class="away">
            <div class="img-wrap">
              <template v-if="[1001,1004].includes(match_info.csid*1)">
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  v-img="([lodash.get(match_info,'malu'),lodash.get(match_info,'frman')])"
                  class="team_logo"
                  alt
                />
              </template>
              <template v-else>
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  v-img="([lodash.get(match_info,'malu[0]'),lodash.get(match_info,'frman[0]')])"
                  class="team_logo"
                  alt
                />
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  v-if="Array.isArray(match_info.malu) && lodash.get(match_info,'malu').length >1"
                  v-img="([lodash.get(match_info,'malu[1]'),lodash.get(match_info,'frman[1]')])"
                  class="team_logo logo-double"
                  alt
                />
              </template>
            </div>
            <div class="team_name away-name allow-user-select" v-if="is_virtual">{{lodash.get(match_info,'teams[1]')}}</div>
            <div class="team_name away-name allow-user-select" v-else>{{lodash.get(match_info,'man')}}</div>
        </div>
        <!-- 客队 E -->
    </div>
  </div>
</template>

<script>
import common_before from "src/project/yabo/mixins/match_details/animation_template/common_before";
import { nextTick } from "vue";
export default {
  mixins: [common_before],
  data() {
    return {
      isRouterAlive: true,//重载页面开关
      default_score:{ // 默认比分
        home: "0",
        away: "0"
      },
      panel_score: {}, // 比分数据
    };
  },
  methods: {
    /**
     * @description: 重载页面
     * @return {undefined} undefined
     */
    reload_data() {
      this.isRouterAlive = false;
      nextTick( ()=> {
        this.isRouterAlive = true;
      });
    },
  },
  watch: {
    match_info: {
      handler(res){
        if(res.ms == 110){
          this.panel_score = {
            home: '',
            away: ''
          }
        } else {
          //足球特殊处理顶部比分，显示为各阶段的比分，不是总分
          if(res.csid == '1'){
            if([32,41,42,33,110].includes(Number(res.mmp))){//加时赛状态
              this.panel_score = lodash.get(res,"msc.S7") || this.default_score
            }else if([34,50,120].includes(Number(res.mmp))){//点球状态
              this.panel_score = lodash.get(res,"msc.70") || this.default_score
            } else {//常规状态 S1
              this.panel_score = lodash.get(res,"msc.S1") || this.default_score
            }
          } else {
            this.panel_score = lodash.get(res,"msc.S1") || this.default_score
          }
        }
        this.reload_data();
      },
      immediate: true
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
    width: 560px;
    height: 130px;
    border-radius: 4px;
    background-color: rgba(38, 41, 49, 0.8);
    box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.3);
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
    }
    .team_name {
      display: -webkit-box;
      overflow: hidden;
      max-height: 100%;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    /* ************** 主队 *************** -S */
    .home {
      justify-content: flex-end;
      .img-wrap {
        justify-content: flex-end;
        margin-left: 20px;
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
        max-height: 52px;
        overflow: hidden;
      }
    }
    .team_name {
      text-align: left;
    }

    /* ************** 客队 *************** -S */
    .home,
    .away {
      flex: 1;
      text-align: center;
    }
    .team_logo {
      width: 36px;
      &.logo-double {
        margin-left: -8px;
      }
    }

    /* ************** 信息面板 *************** -E */
  }
}
</style>
