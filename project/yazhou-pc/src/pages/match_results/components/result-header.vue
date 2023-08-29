<template>
  <div class="search-header">
    <div class="wrap-select">
      <div class="r-select">
        <!-- 体育 -->
        <span class="label">{{ i18n.t("results.sport") }}</span>
        <normal-select
          :value="sport"
          :options="sport_type"
          :isChampion="0"
        ></normal-select>
      </div>
      <!-- 冠军球种才展示这个下拉选择框 -->
      <div class="r-select ball-games" v-if="current_sport_id == '0'">
        <!-- 球种 -->
        <span class="label ball-games-label">{{
          i18n.t("results.ball_games")
        }}</span>
        <normal-select
          :value="champion_sport"
          :options="champion_sport_type"
          :isChampion="1"
          :showInput="true"
        ></normal-select>
      </div>
      <!-- 日期 -->
      <div class="r-select">
        <div class="label time-search-label">
          {{ i18n.t("results.date") }}
        </div>
        <div class="search-date-wrapper">
          <div class="date-wrap" @click.stop="startTimeShowFunc">
            <div>{{ showSelectTime }}</div>
            <q-icon name="icon-calendar"></q-icon>
          </div>
          <div class="date-picker-wrap relative-position">
            <q-date
              v-icon="{
                chevron_left: 'icon-arrow-left',
                chevron_right: 'icon-arrow-right',
              }"
              v-model="model"
              @click.stop
              @range-end="useMittEmit('init_select', 1)"
              range
              v-if="startTimeShow"
              minimal
              :locale="locale"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="wrap-handel">
      <div class="condition">
        <div class="r-select ml-30" style="margin-right: 5px">
          <!-- 联赛 -->
          <span class="label">{{ i18n.t("results.league") }}</span>
          <y-select
            @to_hide_select="hideSelect"
            :list="api_league_type"
            :sport_id="sport_id"
            popWidth="170"
            @select_submit="select_submit"
            @ipt_search="ipt_search(arguments)"
            @search_hot="search_hot"
            @confirm="isSelectConfirm"
            :hideSelect="cancel"
            :isTimeChanged="timeChanged"
          ></y-select>
        </div>
        <div
          class="search relative-position"
          v-if="!pournament_params.champion && Number(sport_id) < 17"
        >
          <!-- 赛事 -->
          <span class="label">{{ i18n.t("results.match") }}</span>
          <!-- 请输入 -->
          <input
            class="ipt"
            :placeholder="i18n.t('results.placeholder')"
            @focus="cancel = new Date().getTime()"
            v-model="results_params.matchNameStr"
            maxlength="150"
          />
        </div>
        <div class="date-time-choice" v-if="Number(sport_id) < 17">
          <!-- 仅虚拟赛事不能查询滚球 -->
          <div
            v-if="!results_params.isVirtualSport"
            class="checkbox"
            @click="input_radio"
          >
            <fliter-checkbox :checked="is_bowls" />
            <!-- 滚球 -->
            <span>{{ i18n.t("results.roll_ball") }}</span>
          </div>
          <div
            class="checkbox"
            v-if="results_params.sportType == '1' && show_play_back"
            @click="highlights_input_radio"
          >
            <fliter-checkbox :checked="is_highlights" />
            <!-- 精彩回放筛选 -->
            <span>{{ i18n.t("video.video_event_history") }}</span>
          </div>
        </div>
      </div>
      <div class="match-resultstips-wrap">
        <!-- 提示语 -->
        <q-tooltip v-model="is_show" anchor="top middle" self="bottom middle">
          <template>
            <div>{{ i18n.t("results.tips") }}</div>
          </template>
        </q-tooltip>
        <div
          class="match-resultstips-icon relative-position"
          @click="click_popup"
          @mouseleave="img_mouseleave"
        >
          <span class="cursor-pointer"></span>
        </div>
        <!-- 搜索 -->
        <div class="search-btn" @click="sub_search">
          {{ i18n.t("results.search") }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import ySelect from "src/components/select/y_select";
// import normalSelect from "src/components/select/normal_select.vue";
// import normalSelect2 from "src/components/select/normal_select.vue";
// import Calendar from "src/project/yabo/components/bet_record/calendar.vue";
</script>

<style  lang="scss" scoped>
/* ************** 筛选条件 *************** -S */
.search-header {
  display: flex;
  align-items: center;

  padding: 10px 0;

  /* ************** select *************** -S */
  .wrap-select {
    display: flex;

    .r-select {
      display: flex;
      align-items: center;
    }

    .r-select {
      .q-field {
        height: 28px;
        color: #5a6074;
        font-size: 12px;

        ::v-deep {
          .q-field__control,
          .items-center {
            min-height: 0px;
            height: 28px;

            .q-field__native {
              color: #5a6074;

              & > span {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }

          .q-field__control {
            padding: 0 0 0 15px;
            border-radius: 2px;

            &:before {
              border: 1px solid #d0d8de;
            }

            &:hover {
              &:before {
                border-color: var(--qq--yb-text-color1);
              }
            }

            &:after {
              transform: scale3d(0, 1, 1);
            }

            .q-field__marginal {
              margin-right: 6px;
              padding: 2px 0 0 0;
              height: auto;

              &.q-anchor--skip {
                display: none;
              }
            }
          }

          .items-center {
            padding: 0;
          }
        }
      }

      .ball-games-label {
        margin-left: 10px;
        white-space: nowrap;
      }
    }

    .ball-games {
      ::v-deep .q-field__native {
        input {
          position: absolute;
          left: -6px;
        }
      }
    }

    .label {
      margin-right: 10px;
    }

    .time-search-label {
      margin: 0 8px 0 8px;
      line-height: 28px;
      white-space: nowrap;
    }

    .search-date-wrapper {
      width: 185px;
      height: 28px;

      .date-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 8px;
        width: 100%;
        height: 100%;
        border-radius: 2px;
        cursor: pointer;

        & ::v-deep .icon-calendar {
          font-size: 14px;
        }
      }

      .date-picker-wrap {
        ::v-deep .q-date {
          .q-icon {
            font-size: 12px;

            &::before {
              color: var(--qq--yb-text-color3);
            }
          }
        }

        .q-date {
          position: relative;
          z-index: 2;

          ::v-deep .q-date__calendar-item > div {
            width: auto;
          }

          /*  星期X 字体颜色正常显示 */
          ::v-deep .q-date__calendar-weekdays > div {
            opacity: 1;
          }
        }

        .calendar-wrap {
          height: 276px;
          top: 10px;
          overflow: hidden;
        }

        .calendar-wrap:nth-child(1) {
          left: -135px;
        }

        .calendar-wrap:nth-child(2) {
          left: 175px;
          border-left: 1px solid transparent;

          ::v-deep .horn {
            display: none !important;
          }
        }
      }
    }
  }

  /* ************** select *************** -E */
  /* ************** 日期、单选框、搜索 *************** -S */
  .wrap-handel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 415px;
    flex: 1;

    .r-select {
      display: flex;
      align-items: center;
      min-width: 210px;

      .label {
        margin: 0 10px 0 0;
        line-height: 28px;
      }
    }

    .condition {
      display: flex;
    }

    .search {
      white-space: nowrap;

      .label {
        margin-right: 10px;
      }

      .ipt {
        width: 122px;
        height: 28px;
        outline: medium;
        background: transparent;
        border: 1px solid transparent;
        color: #5a6074;
        border-radius: 2px;
        padding-left: 15px;
      }
    }

    .checkbox {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-left: 10px;
    }

    .date-time-choice {
      display: flex;
      white-space: nowrap;
      padding-right: 5px;

      .time-search-title {
        margin: 0 10px;
        line-height: 28px;
      }
    }

    .search-btn {
      display: inline-block;
      width: 90px;
      height: 28px;
      border-radius: 4px;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
    }
  }

  /* ************** 日期、单选框、搜索 *************** -E */
}
</style>
