<!--
 * @Description: 虚拟体育赛马,赛狗列表
-->

<template>
  <div class="match-list-wrapper" :class="{standard: standard_edition == 2}">
    <div>
      <v-sports-play-name :match_item_batch="match_item_batch" :csid="csid" />
      <template v-for="(match_item, index) in virtual_match_list" :key="index">
        <v-sports-tpl v-if="MatchListData.get_quick_mid_obj_ref(match_item.mid)" :match_item="match_item" :index="index"
        :mid="match_item.mid"></v-sports-tpl>
      </template>
    </div>
  </div>
</template>
<script>
import virtual_sports_match_list2_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-match-list2-mixin.js";
import virtual_sports_match_tpl from 'src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-match-tpl-2.vue'
import virtual_sports_play_name from 'src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-play-name.vue'
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/output/index.js";

export default {
  mixins:[virtual_sports_match_list2_mixin],
  components:{
    'v-sports-tpl': virtual_sports_match_tpl,
    'v-sports-play-name': virtual_sports_play_name
  },
  props: ['match_item_batch', 'csid'],
  data(){
    return {
      MatchListData
    }
  }
}
</script>

<style lang="scss" scoped>
.match-list-wrapper {
  position: relative;
  width: 100%;
  height: auto;
  padding-top: 0.08rem;

  &.standard {
    padding-top: 0;
  }

  .title-wrap-standard {
    width: 3.61rem;
    height: 0.24rem;
    margin: 0 auto;
    border-bottom: 1px solid  var(--q-gb-bd-c-4);

    .odd-title-wrapper {
      width: 1.92rem;
      height: 100%;
      overflow: hidden;
    }

    .odd-t-w-inner {
      width: 2.52rem;
      height: 100%;
      float: right;
      flex-wrap: nowrap;
      transition: transform 0.2s;
      -webkit-transition: transform 0.2s;

      &.status2 {
        transform: translateX(-1.84rem);
        -webkit-transform: translateX(-1.84rem);
      }

      & > div {
        width: 0.6rem;
        text-align: center;
        font-size: 0.1rem;
        line-height: 1;
        margin-right: 0.03rem;
      }
    }
  }
}
</style>
