<template>
    <div class="virtual-video-play-team" v-if="current_match.csid">
        <!-- 足蓝队伍比分 -->
        <div class="ball-rank" v-if="current_match.csid == 1001 || current_match.csid == 1004">
            <div class="vsm-options"
                :class="[current_match.mid === item.mid && 'active', current_match.csid == 1001 && 'vsm-options-short']"
                v-for="(item, index) in match_list_by_no" :key="index" @click.stop="switch_match_handle(index)">
                <div class="teams">
                    <div class="index row items-center justify-center">
                        {{ index + 1 }}
                    </div>
                    <div class="name home col ellipsis">
                        {{ item.teams[0] }}
                    </div>
                    <div class="score" v-if="(item.csid == 1001 && current_match.match_status == 0) ||
                        (item.csid == 1004 && item.mmp == 'PREGAME' && current_match.match_status == 0)">VS</div>
                    <div v-else class="score number_family">
                        {{ item.home || 0 }}:{{ item.away || 0 }}
                    </div>
                    <div class="name away col ellipsis">
                        {{ item.teams[1] }}
                    </div>
                    <div class="right-col row items-center justify-center">
                        {{ item.show_time }}
                    </div>
                </div>
            </div>
            <div class="vsm-options" v-if="current_match.csid == 1004"></div>
        </div>
        <!-- 赛马类队伍 -->
        <div v-else>
            <div class="vsm-options"
                :class="[current_match.mid === item.mid && 'active', current_match.csid == 1001 && 'vsm-options-short']"
                v-for="(item, index) in match_list_by_no[0] && match_list_by_no[0].teams" :key="index">
                <div class="teams">
                    <div class="index row items-center justify-center">
                        {{ index + 1 }}
                    </div>
                    <div class="horse-name col ellipsis">
                        {{ item }}
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
  props: ['current_match', 'match_list_by_no', 'switch_match_handle']
}
</script>

<style lang="scss" scoped>
.virtual-video-play-team {
    padding-bottom: 0;
    background: var(--q-gb-bg-c-28);
    border-bottom-left-radius: .04rem;
    border-bottom-right-radius: .04rem;
    .vsm-options {
      width: 100%;
      height: 48px;
      line-height: 48px;
      background: #fff;
      display: flex;
      align-items: start;
      justify-content: center;
      flex-direction: column;
      font-size: .12rem;
      border-bottom: 1px solid #E2E2E2;
      overflow: hidden;
      cursor: pointer;
      &-short {
        height: 29px;
        line-height: 29px;
      }
      &.active {
        background: linear-gradient(to right, #FF7000 -700%, #fff);
        .teams {
          color: var(--q-gb-t-c-30);
        }
      }
      .teams {
        display: flex;
        justify-content: space-between;
        width: 100%;
        color: #1A1A1A;
        .index {
          width: 30px;
          height: 100%;
          background: #F5F5F5;
        }
        .name.home {
          text-align: right;
        }
        .horse-name {
          padding-left: 15px;
        }
        .name.home, .name.away {
          flex: 10000 1 0%;
        }
        .score {
          width: 64px;
          text-align: center;
        }

        .right-col {
          width: 30px;
          height: 29px;
        }
      }
    }

    .horse-title {
      display: flex;
      align-items: center;
      padding-right: 5px;
      position: relative;
      .title {
        flex: 10000 1 0%;
      }
      .horse-col {
          font-size: 12px;
          width: 18%;
          max-width: 96px;
          text-align: center;
      }
    }
  }
</style>
