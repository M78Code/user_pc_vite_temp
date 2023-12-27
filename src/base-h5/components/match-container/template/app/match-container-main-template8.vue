<!--
 * @Description: app-h5  虚拟体育赛狗赛马赛果项
-->
<template>
  <div class="v-match-container">
    <div class="dog-horse">
      <div class="v-m-b-container row"
        :class="{
          show_title:get_is_show_title || get_is_show_league,
          last_of_league:get_is_next_show_league,
          collapsed: !collapsed,
        }">
        <!-- <div class="league-row row items-center justify-between hairline-border"
          :class="{show_title:get_is_show_title || get_is_show_league}">
          <div class="row items-center">
            <div class="sport-icon row items-center justify-center">
              <div class="inner" :style="{backgroundImage:get_icon_path_by_type()}">
              </div>
            </div>
            <div class="v-league">
             {{match.tournamentName}}
            </div>
          </div>
        </div> -->
        <div @click="handle_league_fold" v-if="match.is_show_league || (is_hot && get_league_show(i))"
          :class="[('league match-indent hairline-border'), { 'no-radius': show_sport_title, 'collapsed': !collapsed}]">
          <div class="league-t-wrap right-border">
          <!-- <div class="league-t-tubiao"></div> -->
            <span :class="['league-title-text row justify-between']">
              <span :class="['league-t-wrapper']">
                <span class="match-league ellipsis-2-lines">
                  {{ match.tournamentName }}
                </span>
              </span>
              <IconWapper color="#c9c9c9" name="icon-arrow" size="15px" :class="['icon-wapper', {'close': collapsed}]" />
            </span>
          </div>
        </div>
        <!--赛马 赛狗 摩托车 泥地摩托车-->
        <div v-if="[1011, 1002, 1010, 1009].includes(+match.sportId)" v-show="collapsed" class="data-item-w-wrapper">
          <!-- <div class="data-title-w row justify-between" :class="{show_title:get_is_show_title}">
            <div class="date-number">
            </div>
            <div class="title-i-w row items-center">
              <div>{{ i18n_t('virtual_sports.champion')}}</div>
              <div>{{ i18n_t('virtual_sports.runner_up')}}</div>
              <div>{{ i18n_t('virtual_sports.third_place')}}</div>
            </div>
            <div class="date-number">
            </div>
          </div> -->
          <!--数据列表-->
          <div class="data-item-w row justify-between hairline-border" :class="{last:match_list.length - i_list == 1}">
            <div class="date-number">
              {{get_batch_no_by_language(match.batchNo)}}
            </div>
            <div class="title-i-w data row items-center">
              <div v-for="(rank_i,i) of get_match_rank(match)" :key="i" class="title-i-w-r col items-center">
                <div class="text">{{ i18n_t(`virtual_sports.${i === 0 ? 'champion' : i === 1 ? 'runner_up' : 'third_place'}`)}}</div>
                <div class="virtual-num" :class="`virtual-num-${get_rank_background(rank_i,match)} ? motorcycle-${get_rank_background(rank_i,match)}`">
                </div>
              </div>
            </div>
            <div class="date-number">
              {{(new Date(+match.matchTime)).Format(i18n_t('time11'))}}
            </div>
          </div>
        </div>
        <!--虚拟足球-->
        <div v-else-if="[1001,1004].includes(+match.sportId)" v-show="collapsed"
          class="v-football-data">
          <div class="row justify-between">
            <div class="row">
              <img class="team-icon-w" :src="get_team_icon(0)" @error="team_icon_error(0,$event)"  v-if="get_team_icon(0)"/>
              <!--雪碧图-->
              <div
                v-else
                class="team-icon-w" v-img="([lodash.get(match,'homeUrl'), lodash.get(match,'t1FirstWd'),lodash.get(match,'sportId')])"
              />
              <div class="team-title">{{match.homeName}}</div>
            </div>
            <div class="row t-score"
              :class="[
              {
                winner:(match_score[0] - match_score[1]) > 0,
                't-penalty-score': is_cup_match
              },
              is_cup_match ? 'justify-between' : 'justify-center'
          ]">
              <span>{{match_score[0]}}</span>
              <span
                  v-if="is_cup_match"
                  class="penalty-border hairline-border">
                <i class="icon icon-penalty"></i>
                <span v-if="has_penalty_score">{{penalty_score[0]}}</span>
                <span v-else class="no-penalty-score">-</span>
              </span>
            </div>
          </div>
          <div class="row away justify-between">
            <div class="row">
              <img class="team-icon-w" :src="get_team_icon(1)" @error="team_icon_error(1,$event)" v-if="get_team_icon(1)"/>
              <!--雪碧图-->
              <div
                v-else
                class="team-icon-w" v-img="([lodash.get(match,'awayUrl'), lodash.get(match,'t2FirstWd'),lodash.get(match,'sportId')])"
              />
              <div class="team-title">{{match.awayName}}</div>
            </div>
            <div class="row t-score"
              :class="[
              {
                winner:(match_score[1] - match_score[0]) > 0,
                't-penalty-score': is_cup_match
              },
              is_cup_match ? 'justify-between' : 'justify-center'
          ]">
              <span>{{match_score[1]}}</span>
              <span
                  v-if="is_cup_match"
                  class="penalty-border hairline-border">
                <i class="icon icon-penalty"></i>
                <span v-if="has_penalty_score">{{penalty_score[1]}}</span>
                <span v-else class="no-penalty-score">-</span>
              </span>
            </div>
          </div>
          <div class="row justify-between">
            <div class="match-time">
              {{(new Date(+match.matchTime)).Format(i18n_t('time4'))}}
            </div>
            <div class="row match-type justify-center"
              v-html="stage_result">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import virtual_mixin from '../../mixins/virtual.mixin1.js'
import { IconWapper } from 'src/components/icon'

export default {
  name: "match-container-main-template8",
  mixins: [virtual_mixin],
  props: {
    // 当前组件的赛事数据对应列表的赛事
    match_of_list: Object, // item
    // 赛事处于列表中的下标
    i: Number,
    // 赛事列表相关操作的类型封装对象
    matchCtr: Object, 
    main_source: String,
  },
  components: {
    IconWapper
  },
}
</script>

<style scoped lang="scss">
 .v-match-container {
  width: 100%;
  height: auto;

  .dog-horse {
    width: 100%;
    height: auto;
  }

  .sport-type {
    line-height: 1;
    padding-left: 0.2rem;
    color: var(--q-color-com-fs-color-42);
    width: 100%;
    height: 0.08rem;
    font-size: 0.11rem;
    display: none;

    &.show_title {
      display: flex;
    }
  }

  .v-m-b-container {
    width: 100%;
    // margin: 0 auto;
    padding: 0 0.05rem;

    &.show_title {
      border-top-left-radius: 0.08rem;
      border-top-right-radius: 0.08rem;
      margin-top: 0.08rem;
    }

    &.collapsed {
      border-bottom-left-radius: 0.08rem;
      border-bottom-right-radius: 0.08rem;
    }

    &.last_of_league {
      border-bottom-left-radius: 0.08rem;
      border-bottom-right-radius: 0.08rem;
    }

    .league-row {
      width: 100%;
      height: 0.41rem;
      border-radius: 0.08rem;
      display: none;
      margin: 0 auto;

      &.show_title {
        display: flex;
        margin-bottom: 0.05rem;
      }

      .league-collapse-dir {
        margin-right: 0.04rem;
        transition: transform 0.3s;

        &.collapsed {
          transform: rotateZ(180deg);
        }
      }

      .sport-icon {
        width: 0.22rem;
        height: 0.22rem;
        margin: 0.01rem 0.07rem 0 0.09rem;

        .inner {
          width: 0.14rem;
          height: 0.14rem;
          background-size: contain;
        }
      }

      .v-league {
        margin-left: 0.08rem;
        font-size: 0.12rem;
        font-weight: 600;
        padding-top: 0.02rem;
      }
    }

    .v-football-data {
      width: 100%;
      height: 0.91rem;
      padding: 0.1rem;
      border-width: 1px;
      border-radius: 0.08rem;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.04);
      border: .01rem solid #E4E6ED;
      background-color: #F8F9FA;
      border-radius: 0;

      b,
      .row {
        height: 0.18rem;

        .match-time {
          min-width: 0.8rem;
        }

        &.away {
          margin: 0.07rem 0 0.1rem 0;
        }

        .t-score {
          width: 0.59rem;
          font-size: 0.16rem;
          align-items: center;
          &.t-penalty-score {
            width: .75rem;
          }
          span {
            height: .18rem;
            line-height: .2rem;
            &.no-penalty-score {
              color: var(--q-color-com-fs-color-43);
              line-height: .16rem;
            }
          }
        }

        .team-icon-w {
          width: 0.18rem;
          height: 0.18rem;
          margin-right: 0.07rem;
          background-size: cover;
        }

        .team-title {
          font-size: 0.14rem;
        }

        .match-type {
          min-width: 0.59rem;
        }
      }
    }

    .penalty-border {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 0 0 .43rem;
      height: .18rem;
      &::after {
        border-radius: .5rem;
      }
      .icon-penalty {
        width: .12rem;
        height: .12rem;
        background:  var(--q-color-com-img-bg-22) no-repeat center / cover;
        margin-right: .04rem;
        span {
          height: .18rem;
          line-height: .2rem;
        }
      }
    }

    .data-title-w {
      flex-wrap: nowrap;
      display: none;

      &.show_title {
        display: flex;
      }
    }

    .data-title-w, .data-item-w {
      width: 100%;
      height: 0.23rem;
      font-size: 0.1rem;

      .title-i-w {
        flex: 1;

        & > div {
          width: 0.52rem;
          line-height: 1;
          text-align: center;
        }
      }

      .date-number {
        &:first-child {
          width: 1.1rem;
          padding-left: 0.08rem;
        }

        &:last-child {
          width: 1.1rem;
          padding-right: 0.08rem;
          text-align: right;
        }
      }
    }

    .data-item-w-wrapper {
      width: 100%;
    }

    .data-item-w {
      width: 100%;
      height: 0.54rem;
      position: relative;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.04);
      border: .01rem solid #E4E6ED;
      background-color: #F8F9FA;
      border-radius: .02rem;

      .test-line {
        position: absolute;
        top: 0;
        right: 0;
      }

      .date-number {
        line-height: 0.54rem;
        font-size: 0.12rem;
      }

      .title-i-w {
        & > div {
          width: 0.2rem;
          // height: 0.2rem;
          margin: 0 0.16rem;
          border-radius: 0.02rem;
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
      .title-i-w-r {
        & > div {
          width: 0.2rem;
          // margin: 0 0.16rem;
          border-radius: 0.02rem;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .text {
          margin-bottom: .04rem;
        }
      }
    }

    .pager-wrap {
      width: 100%;
      height: 0.31rem;

      .p-w-inner {
        width: auto;
        height: 100%;
        margin: 0 auto;
      }
    }

    .show-more {
      width: 100%;
      height: auto;
      padding-top: 0.08rem;
      background-color: var(--q-color-com-bg-color-40);

      .pager-wrap {
        background-color: var(--q-color-com-bg-color-12);
        border-radius: 0.08rem;
      }
    }
  }

  .v-football {
    width: 100%;
    height: auto;
  }
}


/*************** 马类编号开始 *************** -S*/
.virtual-num {
  width: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  // margin-left: 0.22rem;
  text-align: center;
  background: url($SCSSPROJECTPATH+"/image/png/virtual_num.png")  no-repeat 0 0 / 100%;
  --per: -0.3rem;
}

.virtual-on {
  width: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  text-align: center;
  background: url($SCSSPROJECTPATH+"/image/png/virtual_num.png")  no-repeat 0 0 / 100%;
  --per: -0.3rem;
}

.border_right {
  display: flex;
}

.margin_sty {
  margin: 0 0.02rem 0 0.02rem;
}

/*************** 编号结束 *************** -E*/
/*************** 编号背景色开始 *************** -S*/
div[class*="virtual-num"] {
  border-radius: 2px;
}

.virtual-num-1 {
  background-position-y: calc(var(--per) * 6);

  &.csid-1009 {
    background-position-y: calc(var(--per) * 14);
  }
}

.virtual-num-2 {
  background-position-y: calc(var(--per) * 7);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 1);
  }

  &.csid-1009 {
    background-position-y: calc(var(--per) * 15);
  }
}

.virtual-num-3 {
  background-position-y: calc(var(--per) * 8);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 2);
  }

  &.csid-1009 {
    background-position-y: calc(var(--per) * 16);
  }
}

.virtual-num-4 {
  background-position-y: calc(var(--per) * 9);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 3);
  }

  &.csid-1009 {
    background-position-y: calc(var(--per) * 17);
  }
}

.virtual-num-5 {
  background-position-y: calc(var(--per) * 10);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 4);
  }
}

.virtual-num-6 {
  background-position-y: calc(var(--per) * 11);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 5);
  }
}

/*************** 编号背景色结束 *************** -S*/

.league {
    height: 0.26rem;
    border-radius: 0;
    // padding: 0 0.1rem;
    background:var(--q-gb-bg-c-18);
    width: 100%;
    &.show-sport {
      border-radius: 0.12rem 0.12rem 0 0;
    }

    &.home-hot {
      margin-top: .05rem;
    }

    .league-t-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      //padding-left: 0.08rem;
      .esport {
        margin: 0.01rem 0.07rem 0 0rem;
        position: relative;
        --per: -0.32rem;
        display: block;
        width: auto;
        height: 0.22rem;
        width: 0.22rem;
        background-position: 0 0;
        background-size: 0.22rem 18.88rem;
        flex-shrink: 0;
        img {
          width: 0.22rem;
          height: 0.22rem;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .league-t-tubiao {
        height: 0.15rem;
        width: 0.02rem;
        background-color:var(--q-gb-bg-c-13);
        border-radius: 10px;
        width: 200px; 
      }
      .league-collapse-dir {
        width: 0.12rem;
        height: 0.06rem;
        position: relative;
        right: 0.1rem;

        &.collapsed {
          transform: rotateZ(180deg);
        }
      }
      .favorited-icon{
        width: 14px;
        height: 14px;
        margin: 0 8px 0 11px;
        position: relative;
        flex-shrink: 0;
        > img {
          width: 0.14rem;
          height: 100%;
        }
      }
    }
    
    .dir {
      margin-right: 0.09rem;

      i {
        display: block;
        font-size: 0.1rem;
        transition: transform 0.3s;

        &.collapse {
          transform: rotateZ(180deg);
        }
      }
    }
  }

  .league-title-text {
    font-size: 0.13rem;
    width: 100%;
    height: 100%;
    padding-right: 5px;
    transform: translateY(1px);
    text-overflow: ellipsis;
    flex-wrap: nowrap;
    align-items: center;
    overflow: hidden;
    font-weight: 600;
    &.no-favorited{
      padding-left: 15px;
    }
    .icon-wapper{
      transform: rotate(90deg);
    }
    .close{
      transform: rotate(180deg);
    }

    .league-t-wrapper {
      line-height: 1;
      min-width: 1.18rem;
      display: flex;
      font-size: .12rem;
      &.export {
        min-width: 1.1rem;
        margin-left: 0.1rem;
      }
    }
     // 添加 line-height: 0.14rem 解决42682 生产BUG--malick
    .match-league {
      color: var(--q-gb-t-c-18);
      line-height: 0.14rem;
      margin-left: 0.08rem;
      &.match-main-league {
        //max-width: 1.4rem;
      }
      &.favorited-icon-hidden{
        // margin-left: 10px;
      }
    }
  }
</style>
