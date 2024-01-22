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
                :class="[current_match.mid === team.mid && 'active', current_match.csid == 1001 && 'vsm-options-short']"
                v-for="(team, index) in item_data.team" :key="index">
                <div class="teams">
                    <div class="index row items-center justify-center">
                        {{ index + 1 }}
                    </div>
                    <div class="horse-name col ellipsis">
                        {{ team.teamName }}
                    </div>

                    <div class="row team justify-between" style="width: 361px">
                      <div class="col-4 team-odds">
                        <div v-if="lodash.get(play_obj,`20033${team.teamId}.os`) == 2"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" /></div>
                        <div v-else>
                          {{compute_value_by_cur_odd_type(lodash.get(play_obj,`20033${team.teamId}.ov`) ,null,hsw_obj[20033])}}
                        </div>
                      </div>
                      <div class="col-4 team-odds">
                        <div v-if="lodash.get(play_obj,`20034${team.teamId}.os`) == 2"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" /></div>
                        <div v-else>
                          {{compute_value_by_cur_odd_type(lodash.get(play_obj,`20034${team.teamId}.ov`) ,null,hsw_obj[20034])}}
                        </div>
                      </div>
                      <div v-if="'1009' != sub_menu_type"
                      class="col-4 team-odds">
                        <div v-if="lodash.get(play_obj,`20035${team.teamId}.os`) == 2"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" /></div>
                        <div v-else>
                          {{compute_value_by_cur_odd_type(lodash.get(play_obj,`20035${team.teamId}.ov`) ,null,hsw_obj[20035])}}
                        </div>
                      </div>
                    </div>
                    
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import { reactive, ref, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/output/index.js";
import {compute_value_by_cur_odd_type} from "src/output/index.js"

export default defineComponent({
  props: ['current_match', 'match_list_by_no', 'switch_match_handle'],
  setup(props, evnet) {
    // 冠军/前二/前三赔率
    const play_obj = ref({});
    //组装的盘口数据
    const play_obj2 = reactive({});
    // hsw对象
    const hsw_obj = reactive({});
    // 获取赛马类赔率所需数据
    const item_data = ref({})
    
    const sub_menu_type = props.current_match.csid;

    const match = MatchListData.get_quick_mid_obj_ref(props.current_match.mid)

    onMounted(() => {
      if(sub_menu_type !== '1001' && sub_menu_type !== '1004'){
        item_data.value = {
          team: match.value.teams.map(((item, index)=>{return { teamName: item, teamId: index + 1 }})),
          plays: match.value?.hpsData[0]?.hps
        }

        lodash.each(item_data.value.plays,(item) => {
          lodash.each(lodash.get(item,'hl.ol'), (ol_item, index) => {
            ol_item.teamId = index + 1;
          })
        })
        
        get_odds()
      }
      
    });

    const get_odds = () => {
      // plays集合
      let play_ = lodash.get(item_data.value,'plays')
      let play_obj1 = {}
      lodash.each(play_,(item) => {
        lodash.each(lodash.get(item,'hl.ol'), ol_item => {
          let hpid = lodash.get(item,'hpid')
          hsw_obj[hpid] =  lodash.get(item,'hsw').toString()
          let key = hpid + '' + ol_item.teamId;
          ol_item.hpid = hpid;
          play_obj1[key] = ol_item
        })
        play_obj2[item.hpid] = item;
      })
      play_obj.value = play_obj1
    };
    
    return {
      hsw_obj,
      play_obj2,
      lodash,
      LOCAL_PROJECT_FILE_PREFIX,
      get_odds,
      play_obj,
      sub_menu_type,
      match,
      item_data,
      compute_value_by_cur_odd_type
    }
  }
})
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
  }
</style>
