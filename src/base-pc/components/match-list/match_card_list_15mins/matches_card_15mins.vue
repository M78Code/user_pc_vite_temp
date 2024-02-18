<template>
  <div class="sport">
    <div v-show="false">{{ BetData.bet_data_class_version }}</div>
    <div class="competing-time" @click="jump_to_details()">
      <sport_icon :size="'12px'" :status="true" :sport_id="match.csid" class="sport-icon" />
      <div class="matches-time">
        <div class="begin-time din_font">{{ get_mmp(match.mst) }}</div>
      </div>
    </div>
    <div class="club-name" :class="{ 'bold': get_handicap_index_by(match) == 1 }" @click="jump_to_details()">
      {{ match.mhn }}
    </div>
    <div class="union-name" :class="{ 'bold': get_handicap_index_by(match) == 2 }" @click="jump_to_details()">
      {{ match.man }}
    </div>
    <div class="odds-box din_font">
      <div class="odds-box-item">
        <div :class="['bet-item-wrap-ouzhou', (handicap_list.ols).length === 2 && 'bet-item-wrap-ouzhou-bigger']"
          v-for="(ol_data, i) in ols_data" :key="`${ol_data.oid}+${ol_data._hpid}+${i}`">
          <!-- {{ ol_data }} -->
          <!-- 投注项组件 -->
          <bet-item :ol_data="ol_data" match_data_type="pc_ten_five_mins" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, provide } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// import { get_15mins_odds_list } from "src/core/match-list-pc/list-template/module/template-101.js"
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import { MenuData, MatchDataWarehouse_ouzhou_PC_l5mins_List_Common, i18n_t, useMittEmit, MITT_TYPES } from "src/output/index.js"
import betItem from "src/base-pc/components/bet-item/bet-item-list-ouzhou-data.vue"
import sport_icon from "src/base-pc/components/match-list/sport_icon.vue";
import { get_handicap_index_by } from 'src/core/match-list-pc/match-handle-data.js'

const router = useRouter()
const route = useRoute();
const props = defineProps({
  mid: String,
  idx: Number
});
const match = MatchDataWarehouse_ouzhou_PC_l5mins_List_Common.get_quick_mid_obj_ref(props.mid)
provide("match",match)
const jump_to_details = () => {
  let obj = {
    pre_route : route.name
  }
  MenuData.set_router_info(obj)
  const { tid, csid, mid } = match.value;
  //比分板跳转到详情页
  router.push({
    name: 'details',
    params: {
      mid: mid,
      tid: tid,
      csid: csid
    }
  })
}
const current_check_betId = ref(MenuData.current_check_betId.value);
let match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`]
let handicap_list = lodash.cloneDeep(match_tpl_info.get_15mins_odds_list()) //只有一个数组哦
const emits = defineEmits(['del'])
const ols_data = computed(() => {
  const { mid, hps15Minutes } = match.value
  const jieduan = lodash.find(hps15Minutes, (i) => handicap_list._hpid == i.hpid) //找到玩法ID 和阶段
  const ot_Map = lodash.keyBy(lodash.get(jieduan, 'hl[0].ol',lodash.get(jieduan, 'hl.ol', [])), (i) => i.ot) //找到ol数据
  return lodash.cloneDeep(handicap_list.ols).map((ol) => {
    const ol_data = ot_Map[ol.ot]
    if (ol_data) {
      const ref_oid = lodash.get(MatchDataWarehouse_ouzhou_PC_l5mins_List_Common, `list_to_obj.ol_obj.${mid}_${ol_data.oid}`, {})
      Object.assign(ol, ref_oid)
    }
    return ol
  })
})
watch(() => match.value.hSpecial, (v, o) => {
  if (v != o && v != undefined && o != undefined) {
    // 15分钟玩法阶段改变
    useMittEmit(MITT_TYPES.EMIT_SET_HOME_MATCHES,true)
  }
})
// // 监听 当前投注项ID的变化
watch(
  MenuData.current_check_betId,
  () => {
    current_check_betId.value = MenuData.current_check_betId.value
  },
)
const get_mmp = (mst) => {
  let difference = Math.floor(mst / 60 / 15);
  if (difference >= 6) difference = 5;
  return i18n_t('ouzhou.15minutes_bet_col')[difference]
}
</script>

<style lang="scss" scoped>
.sport {
  height: 100%;
  width: 250px;
}

.competing-time {
  display: flex;
  align-items: center;
  margin: 0 0 5px 16px;
}

.sport-icon {
  margin-right: 5px;
}

.matches-time {
  color: var(--q-gb-t-c-2);
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;

  .begin-time {
    font-family: DIN;
    line-height: 17px;
    letter-spacing: 0px;
  }

  .end-time {
    font-family: PingFang SC;
    line-height: 20px;
    letter-spacing: 0px;
  }
}

.club-name {
  color: #3D3B37;
  font-size: 14px;
  margin-bottom: 6px;
  font-family: "Roboto";
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0px;
  margin-left: 16px;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.union-name {
  color: var(--q-gb-t-c-5);
  font-size: 14px;
  margin-bottom: 8px;
  font-family: "Roboto";
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0px;
  margin-left: 16px;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.union-name,
.club-name {
  &.bold {
    color: var(--q-gb-t-c-2);
  }
}


.odds-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: DIN;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  letter-spacing: 0px;

  .odds-box-item {
    cursor: pointer;
    // width: 73px;
    height: 40px;
    line-height: 17px;
    letter-spacing: 0px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    // &:hover {
    //   background: rgba(255, 112, 0, 0.1);
    // }

    :deep(.c-bet-item) {
      width: 74px;
      height: 40px;
    }


  }

  div:last-of-type {
    margin: 0;
  }

  span {
    font-size: 14px;

    &:first-child {
      color: var(--q-gb-t-c-8);
      margin-right: 7px;
    }

    &:last-child {
      color: var(--q-gb-t-c-2);
    }
  }

  .checked {
    background: var(--q-gb-bg-c-1);
    color: var(--q-gb-t-c-1);

    span {
      color: var(--q-gb-t-c-1);
    }

    &:hover {
      background: var(--q-gb-bg-c-1);
    }
  }
}
</style>