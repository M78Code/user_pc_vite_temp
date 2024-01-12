<!--
 * @Author: Supermark
 * @Date: 2020-12-29 10:35:02
 * @Description: 针对虚拟体育新增的玩法模板8
-->
<template>
  <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="temp8 mx-5" >
    <div>
      <div v-for="(team,index) in item_data.team" :key="index" :style="{'margin-top':index > 0 ? '0.04rem':''}" class="hairline-border">
        <div class="row special items-center justify-between" >
          <div class="row items-center">
            <div class="virtual-count" :class="`virtual-num-${index+1} csid-${[1010].includes(sub_menu_type)?'1002':sub_menu_type} ${[1010].includes(sub_menu_type) ? `motorcycle-${index+1}` : ''}`"></div>
            <div class="team-name">{{team.teamName}}</div>
          </div>
          <div class="row team justify-between">
            <div class="col-4 team-odds" @click="go_to_fun(`20033${team.teamId}`,index)" :class="[BetData.bet_oid_list.includes(play_obj && play_obj[`20033${team.teamId}`] && play_obj[`20033${team.teamId}`].oid) && 'team-odds2']">
              <div v-if="lodash.get(play_obj,`20033${team.teamId}.os`) == 2"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" /></div>
              <div v-else>
                {{compute_value_by_cur_odd_type(lodash.get(play_obj,`20033${team.teamId}.ov`) ,null,hsw_obj[20033])}}
              </div>
            </div>
            <div class="col-4 team-odds" @click="go_to_fun(`20034${team.teamId}`,index)" :class="[BetData.bet_oid_list.includes(play_obj && play_obj[`20034${team.teamId}`] && play_obj[`20034${team.teamId}`].oid) && 'team-odds2']">
              <div v-if="lodash.get(play_obj,`20034${team.teamId}.os`) == 2"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" /></div>
              <div v-else>
                {{compute_value_by_cur_odd_type(lodash.get(play_obj,`20034${team.teamId}.ov`) ,null,hsw_obj[20034])}}
              </div>
            </div>
            <div v-if="'1009' != sub_menu_type"
            class="col-4 team-odds" @click="go_to_fun(`20035${team.teamId}`,index)" :class="BetData.bet_oid_list.includes(play_obj && play_obj[`20035${team.teamId}`] && play_obj[`20035${team.teamId}`].oid) && 'team-odds2'">
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
// #TODO vuex
// import { mapGetters } from "vuex";
import lodash from "lodash";
import store from "src/store-redux/index.js";
import odds_new from "src/base-h5/components/details/components/tournament-play/unit/odds-new.vue";
// import odd_convert from "src/base-h5/mixins/odds_conversion/odds_conversion.js";
import { reactive, ref, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { useMittEmit, MITT_TYPES,MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance } from "src/output/index.js"
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import { useRoute, useRouter } from "vue-router"
import BetData from "src/core/bet/class/bet-data-class.js"
import { go_to_bet } from "src/core/bet/class/bet-box-submit.js";
import {compute_value_by_cur_odd_type} from "src/output/index.js"
export default defineComponent({
  // #TODO mixins
  // mixins: [odd_convert],
  name: "temp8",
  props: ["item_data", "csid"],
  components: {

  },
  setup(props, evnet) {
    // 冠军/前二/前三赔率
    const play_obj = ref({});
    //组装的盘口数据
    const play_obj2 = reactive({});
    // hsw对象
    const hsw_obj = reactive({});
    // #TODO vuex
    // ...mapGetters({
    //   sub_menu_type: 'get_curr_sub_menu_type',
    // }),
    const sub_menu_type = computed(() => {
      return props.csid;
    });
    const get_cur_odd = computed(() => {
      return ""
    });
    const route = useRoute()
    const get_detail_data = computed(() => {
      return MatchDataWarehouseInstance.get_quick_mid_obj(route.params.mid||lodash.get(props.item_data,'mid'))
    });
    const get_curr_sub_menu_type = computed(() => {
      return ""
    });

    const is_match_result = computed(() => {
      return ['result_details', 'match_result'].includes($route.name)
    });
    /**
     *@description 是否选中
     *@param {String} id 投注项id
     *@return {Boolean}
     */
    const is_select = () => {
      return function(id){
        return BetData.bet_oid_list.includes(play_obj && play_obj[id] && play_obj[id].oid)
      }
    }
    onMounted(() => {
      get_odds()
    });
    const get_odds = () => {
    // plays集合
      let play_ = lodash.get(props.item_data,'plays')
      let play_obj1 = {}
      lodash.each(play_,(item) => {
        lodash.each(lodash.get(item,'hl[0].ol'), ol_item => {
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
    /**
     *@description 虚拟体育(赛马)点击详细页小方块投注
     *@param {Object} ol_item 里层ol数据
     *@param {Number} index 下标，用来识别第几匹马
     *@return {Undefined} undefined
     */
    const go_to_fun = (ol_item,index) => {
      ol_item = play_obj.value[ol_item]
      ol_item.num = index + 1
      go_to_bet(ol_item)
      // useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX,true);
    };
    return {
      hsw_obj,
      play_obj2,
      compute_value_by_cur_odd_type,
      lodash,
      BetData,
      get_cur_odd,
      get_detail_data,
      get_curr_sub_menu_type,
      LOCAL_PROJECT_FILE_PREFIX,
      is_select,
      get_odds,
      go_to_fun,
      play_obj,
      sub_menu_type
    }
  }
})
</script>

<style lang="scss" scoped>
/*************** 每项热门开始 *************** -S*/
.special {
  position: relative;
  height: 0.52rem;

  border-radius: 0.08rem;
  overflow: hidden;
}

/*************** 每项热门结束 *************** -E*/
/*************** 每项team开始 *************** -S*/
.team-name {
  max-width: 1.1rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 0.52rem;
  margin-left: 0.08rem;
  color: var(--q-gb-t-c-18);
  font-size: 0.14rem;
}


/*************** 每项team结束 *************** -E*/
/*************** 每项odds开始 *************** -S*/
.team-odds {
  line-height: 0.4rem;
  height: 0.4rem;
  text-align: center;
  font-size: 0.16rem;
  flex: 1;
  color: var(--q-gb-t-c-18);
  background: var(--q-gb-bg-c-28);
  border-radius: 0.08rem;
  >div {
    color: var(--q-gb-t-c-18);
    font-size: 0.14rem;
    font-weight: 700;
  }
}

.team-odds-left {
  text-align: left;
}

.team-odds-right {
  text-align: right;
}


/*************** 每项odds结束 *************** -E*/
/*************** 数字开始 *************** -S*/
.virtual-count {
  width: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  text-align: center;

  margin-left: 0.12rem;
  background: url($SCSSPROJECTPATH+"/image/png/virtual_num.png")  no-repeat 0 0 / 100%;
  --per: -0.3rem;
}

/*************** 数字结束 *************** -E*/
.team {
  width: 1.9rem;
  margin-right: 0.28rem;
  gap: 0.1rem;
}

.team-odds2 {
  background: var(--q-gb-bg-c-37) !important
}

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
</style>
