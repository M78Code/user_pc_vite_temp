<template>
  <div class="match-tpl-129">
    <div class="flex flex-start items-center">
        <tem8 :item_data="item_data" :csid="match.csid" v-if="match" />
    </div>
  </div>
</template>

<script>
import { computed, watch, ref, provide} from 'vue';
import IconBox from 'src/base-pc/components/match-list/match-tpl-new-data/match-tpl-101-after/modules/iconBox/index.vue'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
import { compute_css_obj } from 'src/core/server-img/index.js'
import { useRouter } from 'vue-router';
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { MenuData, MatchDataWarehouse_PC_Detail_Common as MatchDataWarehouseInstance, } from "src/output/index.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/output/index.js";
import virtual_sports_match_item_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-match-item-mixin.js";
import { IconWapper } from 'src/components/icon'
import { get_match_to_map_obj } from 'src/core/match-list-pc/match-handle-data.js'
import tem8 from "src/base-pc/vr/pages/virtual/virtual-sports-part/tem8.vue"

export default {
  mixins:[virtual_sports_match_item_mixin],
  components: {
    MatchHandicap,
    IconBox,
    'icon-wapper': IconWapper,
    tem8
  },
  props: {
    is_show_more: {
      type: Boolean,
      default: () => false
    },
    mid: {
      type: String,
      default: () => null
    },
    index: {
      type: Number,
      default: () => null
    },
  },
  setup(props){

    const match = MatchListData.get_quick_mid_obj_ref(props.mid)
    provide("match", match)
    provide("MatchListData", MatchListData)

    let current_mid = MatchListCardDataClass.current_mid;
    const match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_${match.value.csid == '1001' ? 129 : 126}_config`]
    
    let handicap_list = computed(() => {
      try{
        const hpids = MatchListCardDataClass.get_csid_current_hpids(match.value.csid);
        const list = match_tpl_info?.get_current_odds_list(hpids);
       return list
      }catch(e){
        console.error(match_tpl_info,e)
      }
      return []
    });

    const match_list_tpl_size = computed(() => {
      const width_config = MATCH_LIST_TEMPLATE_CONFIG[`template_${match.value.csid == '1001' ? 129 : 126}_config`].width_config
      return width_config
    })

     //非坑位对象
     const not_hn_obj_map = computed(() => {
      const _not_hn_obj_map = get_match_to_map_obj(match.value, null); //非坑位对象
      return _not_hn_obj_map
    })
    
    provide("not_hn_obj_map", not_hn_obj_map)

    const item_data = {}

  return {
      compute_css_obj,
      current_mid,
      match,
      handicap_list,
      match_list_tpl_size,
      item_data
    }
}
 
}



</script>

<style lang="scss" scoped>
.match-tpl-129 {
  background: var(--q-gb-bg-c-4);
  border-bottom: 1px solid var(--q-gb-bd-c-2);
  .vertical-line {
    width: 1px;
    height: 60px;
    background: var(--q-gb-bg-c-10);
  }
  .basic-col {
    display: flex;
    align-items: center;
    cursor: pointer;
    .team-num {
      color: #1A1A1A;
      font-weight: 500;
      font-size: 12px;
      margin: 0 15px 0 10px;
    }
    .team-title-wrap {
      display: flex;
      width: 100%;
      align-items: center;
      .play-count {
        flex: 1;
        text-align: right;
        margin-right: 14px;
        color: #1A1A1A;
        font-weight: 500;
        > i {
          transform: rotate(90deg);
        }
      }
    }
  }
  .team-title {
    color: #1A1A1A;
    font-weight: 400;
  }
  :deep(.handicap-col-ouzhou){
    width: 330px !important;
  }
}

.other-play-tab {
  height: 32px;
  display: flex;

  .play-title {
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    position: relative;

    .tab-wrap {
      :deep(.item-wrap) {
        .tab-item {
          padding: 0 10px;
        }
      }
    }
  }

  .arrow-wrap {
    width: 34px;
    height: 100%;

    .yb-icon-arrow {
      transform: rotate(270deg);

      &.active {
        transform: rotate(90deg);
      }
    }
  }
}

/*15分钟和角球tab*/
.fifteen-box {
  display: flex;
  height: 24px;

  &.double-title {
    height: 40px;

    .fifteen-item {
      line-height: 40px;
    }
  }

  .fifteen-item {
    text-align: center;
    font-weight: 500;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    height: 100%;
    padding: 0 2px;

    &.flex {
      line-height: 16px;
    }
  }

  .bet-item-wrap:last-child {
    border-right: none !important;
  }
}

.score-board {
  cursor: pointer;
  text-align: center;
  margin-left: auto;

  >div {
    width: 16px;
    height: 16px;
    background-size: 100%;
  }

  .video {
    width: 18px;
  }

  &:hover {
    color: var(--q-gb-bg-c-17);
  }
}
</style>