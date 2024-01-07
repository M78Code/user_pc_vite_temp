<!--
 * @Description: 虚拟体育赛马,赛狗列表
-->

<template>
  <div class="match-list-wrapper" :class="{standard: standard_edition == 2}">
    <div>
      <div class="title-wrap-standard row justify-end" v-if="standard_edition == 2 && false">
        <div class="odd-title-wrapper row">
          <div class="odd-t-w-inner row items-center" :class="{status2:standard_odd_status}">
            <div v-for="(hpl_title, hp_i) of i18n_t('list_title.'+csid+'.title')" :key="hp_i">
              {{hpl_title}}
            </div>
          </div>
        </div>
      </div>
      <template v-for="(match_item,i) in virtual_match_list" :key="i">
        <v-sports-match-item :match_selected_i="selected_match_i" v-if="MatchDataBaseH5.get_quick_mid_obj(match_item.mid)"
          :i="i" :match_item="MatchDataBaseH5.get_quick_mid_obj(match_item.mid)" @switch_match="switch_match_handle"
          @odd_pan="odd_pan_handle" :other_status="standard_odd_status">
        </v-sports-match-item>
      </template>
    </div>
  </div>
</template>
<script>
import virtual_sports_match_list2_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-match-list2-mixin.js";
import v_s_match_timer from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/virtual-sports-match-timer.vue";
import virtual_sports_match_item from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/virtual-sports-match-item2.vue";
export default {
  mixins:[virtual_sports_match_list2_mixin],
  components:{
    'v-s-match-timer':v_s_match_timer,
    'v-sports-match-item':virtual_sports_match_item,
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
src/core/vr/mixin/pages/virtual/virtual-sports_part/virtual_sports_match_list2_mixin.js