<!--
 * @Description: 虚拟体育赛事列表
-->

<template>
  <div class="match-list-wrapper" v-if="lodash.get(virtual_match_list, 'length')" :class="{standard: standard_edition == 2}">
    <div>
      <v-sports-play-name :match_item_batch="match_item_batch" :csid="csid" />
      <template v-for="(match_item, index) in virtual_match_list">
        <v-sports-tpl v-if="MatchListData.get_quick_mid_obj_ref(match_item.mid)" :match_item="match_item" :index="index" :key="index"
        :mid="match_item.mid"  @switch_match="switch_match_handle"></v-sports-tpl>
        <!-- <v-sports-match-item :match_selected_i="selected_match_i" v-if="MatchDataBaseH5.get_quick_mid_obj(match_item.mid)"
          :i="i" :match_item="MatchDataBaseH5.get_quick_mid_obj(match_item.mid)" @switch_match="switch_match_handle"
          @odd_pan="odd_pan_handle" :other_status="standard_odd_status" :is_vr_lock="match_item.is_vr_lock">
        </v-sports-match-item> -->
      </template>
    </div>
  </div>
</template>
<script>
import virtual_sports_match_list_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-match-list-mixin.js";
import v_s_match_timer from "src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-match-timer.vue";
// import virtual_sports_match_item from "src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-match-item.vue";
import virtual_sports_match_tpl from 'src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-match-tpl.vue'
import virtual_sports_play_name from 'src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-play-name.vue'
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/output/index.js";

export default {
  mixins:[virtual_sports_match_list_mixin],
  components:{
    'v-s-match-timer':v_s_match_timer,
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
    // width: 3.61rem;
    width: 60vw;
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
        color: var(--q-gb-t-c-19)
      }
    }
  }
}
</style>
