<template>
  <div class="match-tpl-129">
    <div class="flex flex-start items-center">
        <horse-template :item_data="item_data" :csid="match.csid" v-if="match" />
    </div>
    <div class="row justify-end to-detail"  @click="goto_details(match)">
      All Markets &nbsp;>
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
import horseTemplate from "src/base-pc/vr/pages/virtual/virtual-sports-part/horse-template.vue"

export default {
  mixins:[virtual_sports_match_item_mixin],
  components: {
    MatchHandicap,
    IconBox,
    'icon-wapper': IconWapper,
    'horse-template': horseTemplate,
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

    // 获取赛马类赔率所需数据
    const item_data = {
      team: match.value.teams.map(((item, index)=>{return { teamName: item, teamId: index + 1 }})),
      plays: match.value.hps
    }

    lodash.each(item_data.plays,(item) => {
        lodash.each(lodash.get(item,'hl[0].ol'), (ol_item, index) => {
          ol_item.teamId = index + 1;
        })
      })

    

  return {
      compute_css_obj,
      current_mid,
      match,
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

.to-detail {
  padding: 13px;
  cursor: pointer;
  color: #1A1A1A;
  background: var(--q-gb-bd-c-2);
}
</style>