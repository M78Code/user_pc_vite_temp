<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 公共赛前组件
-->
<template>
  <div class="before" v-if="isRouterAlive">
    <div
      class="content"
      :style="{
        'background-color': is_eports_csid(match_info.csid)
          ? 'transparent'
          : '',
        'box-shadow': is_eports_csid(match_info.csid)
          ? 'none'
          : '0 1px 15px 0 rgba(0, 0, 0, 0.3)',
      }"
      :class="{ 'dota-resize': is_eports_csid(match_info.csid) }"
    >
      <div class="team">
        <!-- 主队 开始-->
        <div class="home">
          <!-- 主队名 -->
          <div
            class="team_name home-name allow-user-select"
            v-tooltip="{ content: lodash.get(match_info, 'mhn'), overflow: 2 }"
          >
            {{ lodash.get(match_info, "mhn") }}
          </div>
          <div class="img-wrap">
            <!-- <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              v-img="([lodash.get(match_info,'mhlu[0]'),lodash.get(match_info,'frmhn[0]'),lodash.get(match_info,'csid')])"
              class="team_logo"
              alt
            /> -->
            <div
              :style="
                sprite_img['pc-team-logo-image']({
                  position: [
                    lodash.get(match_info, 'mhlu[0]'),
                    lodash.get(match_info, 'frmhn[0]'),
                    lodash.get(match_info, 'csid'),
                  ],
                  theme: lodash.get(UserCtr,'theme'),
                })
              "
              class="team_logo"
            ></div>
            <!-- <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              v-if="!is_eports_csid(match_info.csid) && (lodash.get(match_info,'mhlu') && lodash.get(match_info,'mhlu').length>1)"
              v-img="([lodash.get(match_info,'mhlu[1]'),lodash.get(match_info,'frmhn[1]'),lodash.get(match_info,'csid')])"
              class="team_logo logo-double"
              alt
            /> -->
            <div
              v-if="
                !is_eports_csid(match_info.csid) &&
                lodash.get(match_info, 'mhlu') &&
                lodash.get(match_info, 'mhlu').length > 1
              "
              :style="
                sprite_img['pc-team-logo-image']({
                  position: [
                    lodash.get(match_info, 'mhlu[1]'),
                    lodash.get(match_info, 'frmhn[1]'),
                    lodash.get(match_info, 'csid'),
                  ],
                  theme: lodash.get(UserCtr,'theme'),
                })
              "
              class="team_logo logo-double"
            ></div>
          </div>
        </div>
        <!-- 主队 结束 -->
        <!-- 开赛时间 S-->
        <div class="match_time">
          <match-process
            v-if="match_info"
            class="match_time-text"
            :match="match_info"
          ></match-process>
          <!-- 中立场 -->
          <div class="neutral-wrap" v-if="match_info.mng">
            <span class="icon-neutral q-icon c-icon"
              ><span class="path1"></span><span class="path2"></span
            ></span>
          </div>
        </div>
        <!-- 开始时间 E -->
        <!-- 客队 S -->
        <div class="away">
          <div class="img-wrap">
            <!-- <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              v-img="[
                lodash.get(match_info, 'malu[0]'),
                lodash.get(match_info, 'frman[0]'),
                lodash.get(match_info, 'csid'),
              ]"
              class="team_logo"
              alt
            /> -->
            <div
              :style="
                sprite_img['pc-team-logo-image']({
                  position: [
                    lodash.get(match_info, 'malu[0]'),
                    lodash.get(match_info, 'frman[0]'),
                    lodash.get(match_info, 'csid'),
                  ],
                  theme: lodash.get(UserCtr,'theme'),
                })
              "
              class="team_logo"
            ></div>
            <!-- <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              v-if="
                !is_eports_csid(match_info.csid) &&
                lodash.get(match_info, 'malu') &&
                lodash.get(match_info, 'malu').length > 1
              "
              v-img="[
                lodash.get(match_info, 'malu[1]'),
                lodash.get(match_info, 'frman[1]'),
                lodash.get(match_info, 'csid'),
              ]"
              class="team_logo logo-double"
              alt
            /> -->
            <div
              v-if="
                !is_eports_csid(match_info.csid) &&
                lodash.get(match_info, 'malu') &&
                lodash.get(match_info, 'malu').length > 1
              "
              :style="
                sprite_img['pc-team-logo-image']({
                  position: [
                    lodash.get(match_info, 'malu[1]'),
                    lodash.get(match_info, 'frman[1]'),
                    lodash.get(match_info, 'csid'),
                  ],
                  theme: lodash.get(UserCtr,'theme'),
                })
              "
              class="team_logo logo-double"
            ></div>
          </div>
          <!-- 客队名 -->
          <div
            class="team_name away-name allow-user-select"
            v-tooltip="{ content: lodash.get(match_info, 'man'), overflow: 2 }"
          >
            {{ lodash.get(match_info, "man") }}
          </div>
        </div>
        <!-- 客队 E -->
      </div>
    </div>
  </div>
</template>

<script>
import sprite_img from "src/core/server-img/sprite-img/index.js";
import common_before from "./common_before";
import UserCtr from "src/core/user-config/user-ctr.js";;
// import { MatchProcessFullVersionWapper as matchProcess } from "src/components/match-process/index.js"
import matchProcess  from "src/components/match-process/match-process-template-1/index.vue"
import { nextTick } from "vue";
export default {
  mixins: [common_before],
  data() {
    return {
      UserCtr,
      sprite_img,
      isRouterAlive: true, //重载页面开关
    };
  },
  components:{
    matchProcess
  },
  methods: {
    /**
     * @description: 重载页面
     * @return {undefined} undefined
     */
    reload_data() {
      this.isRouterAlive = false;
      nextTick(()=> {
        this.isRouterAlive = true;
      });
    },
  },
  watch: {
    match_info(res) {
      this.reload_data();
    },
  },
};
</script>

<style lang="scss" scoped>
.before {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-size: cover;
  .content {
    padding: 0 16px;
    max-width: 700px;
    width: 85%;
    min-width: 330px;
    height: 130px;
    border-radius: 4px;
    background-color: rgba(38, 41, 49, 0.8);
    box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.3);
    font-size: 14px;
    .match_time-text {
      color: var(--q-gb-t-c-1);
    }

    /* ************** 赛前信息面板 *************** -S */
    .team {
      display: flex;
      justify-content: center;
      margin: 42px 0;
      .img-wrap {
        flex-shrink: 0;
      }
      .home,
      .away,
      .match_time {
        display: flex;
        align-items: center;
        height: 46px;
        color: var(--q-gb-bd-c-13);
      }
      .match_time {
        display: block;
        justify-content: center;
        width: 20%;
        margin: 0 10px;
        .neutral-wrap {
          display: flex;
          justify-content: center;
        }
        :deep(.c-match-date) {
          min-width: 58px;
          padding: 0 0;
        }
        .c-match-process {
          justify-content: center;
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
      }

      /* ************** 主队 *************** -S */
      .home {
        justify-content: flex-end;
        .img-wrap {
          justify-content: flex-end;

          min-width: 56px;
          text-align: right;
        }
        .team_name {
          text-align: right;
        }
      }

      /* ************** 主队 *************** -E */
      /* ************** 客队 *************** -S */
      .away {
        justify-content: flex-start;
        .img-wrap {
          justify-content: flex-start;

          min-width: 56px;
          text-align: left;
          max-height: 52px;
          overflow: hidden;
        }
        .team_name {
          text-align: left;
        }
      }

      /* ************** 客队 *************** -S */
      .home,
      .away {
        flex: 1;
        text-align: center;
        .team_logo {
          max-width: 46px;
          max-height: 46px;
          height: 46px;
          &.logo-double {
            margin-left: -8px;
          }
        }
        img[class*="team-logo-"] {
          width: 46px;
        }
      }
    }
  }
  .dota-resize {
    .match_time {
      .c-match-process {
        display: flex;
        height: 100%;
        align-items: center;
      }
    }
    .team {
      margin-top: 15px;
      .match_time {
        height: 100px;
      }
      .home,
      .away {
        height: 100px;
        .img-wrap {
          max-height: 100px;
        }
        .team_logo {
          width: 100px !important;
          max-width: 100px;
          max-height: 100px;
        }
        .team_name {
          font-size: 20px;
        }
      }
    }

    /* ************** 赛前信息面板 *************** -E */
  }
}
.info-upd {
  .before {
    .content {
      .team {
        .home {
          .img-wrap {
            min-width: 46px;
            margin-left: 20px;
          }
        }
        .away {
          .img-wrap {
            min-width: 46px;
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>
