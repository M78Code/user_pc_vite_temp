<template>
  <div class="sport">
    <div v-show="false">{{ BetData.bet_data_class_version }}</div>
    <div class="competing-time" @click="jump_to_details(current_tab)">
      <sport_icon :size="'12px'" :status="true" :sport_id="current_tab.csid" class="sport-icon" />
      <div class="matches-time">
        <div class="begin-time din_font">{{ get_mmp(current_tab.mst) }}</div>
      </div>
    </div>
    <div class="club-name" @click="jump_to_details(current_tab)">
      {{ current_tab.mhn }}
    </div>
    <div class="union-name" @click="jump_to_details(current_tab)">
      {{ current_tab.man }}
    </div>
    <div class="odds-box din_font">
      <div class="odds-box-item" v-for="(col, col_index) in ols_data"
        :key="`${current_tab.mid}_${col._hpid}_${col_index}`">
        <!-- :class="{checked: BetData.bet_oid_list.includes(item.oid) }" -->
        <div :class="['bet-item-wrap-ouzhou', (col.ols).length === 2 && 'bet-item-wrap-ouzhou-bigger']"
          v-for="(ol_data, ol_index) in (col.ols)" :key="`${ol_data.oid}_${ol_index}_${col_index}`">
          <!-- 投注项组件 -->
          <bet-item :ol_data="ol_data" match_data_type="pc_ten_five_mins" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
// import { get_15mins_odds_list } from "src/core/match-list-pc/list-template/module/template-101.js"
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import { MenuData, MatchDataWarehouse_ouzhou_PC_l5mins_List_Common, i18n_t } from "src/core/index.js"
import { merge_template_data } from 'src/core/match-list-pc/composables/match-list-other.js'
import betItem from "src/base-pc/components/bet-item/bet-item-list-ouzhou-data.vue"
import sport_icon from "src/base-pc/components/match-list/sport_icon.vue";
const router = useRouter()
const props = defineProps({
  current_tab: {
    type: [Object, Array],
    default: () => ({}),
  },
});
const jump_to_details = (item) => {
  const { tid, csid } = item;
  //比分板跳转到详情页
  router.push({
    name: 'details',
    params: {
      mid: item.mid,
      tid: tid,
      csid: csid
    }
  })
}
const current_check_betId = ref(MenuData.current_check_betId.value);
let match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`]
let odds_list = lodash.cloneDeep(match_tpl_info.get_15mins_odds_list())
const ols_data = computed(() => {
  const ols = merge_template_data({
    match:JSON.parse(JSON.stringify(props.current_tab)),
    handicap_list: [odds_list],
    type: 4,
    play_key: 'hps15Minutes'
  }, MatchDataWarehouse_ouzhou_PC_l5mins_List_Common)
  return ols
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

:deep(.bet-item-wrap-ouzhou) {
  display: flex;
  width: 78px;
  height: 40px !important;
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  flex: 1;

  .c-bet-item {
    width: 78px;
    height: 40px;
  }

  .c-bet-item.can-hover:hover {
    background: var(--q-gb-t-c-4);
    cursor: pointer;
  }

  &.bet-item-wrap-ouzhou-bigger {
    .c-bet-item {
      width: 133px;
    }

  }

  .c-bet-item.active {
    background: var(--q-gb-bg-c-1) !important;

    .handicap-value,
    .handicap-value-text {
      color: var(--q-gb-t-c-4);
    }

    .odds {
      color: var(--q-gb-t-c-1);
    }
  }

  div {
    color: var(--q-gb-bg-c-7);
    font-size: 14px;
  }

  .odds {
    color: var(--q-gb-t-c-2);
    font-weight: 500;
    font-size: 14px;

    &.up {
      color: var(--q-gb-t-c-7) !important;
    }

    &.down {
      color: var(--q-gb-t-c-10) !important;
    }
  }
}
</style>
