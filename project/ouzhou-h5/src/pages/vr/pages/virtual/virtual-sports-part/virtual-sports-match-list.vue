<!--
 * @Description: 虚拟体育赛事列表
-->

<template>
  <div class="match-list-wrapper" :class="{vr_basketball_match_list_wrapper: is_vr_basketball}">
    <div>
      <div class="title-wrap-standard row justify-between items-center" v-if=" virtual_match_list?.length ">
        <div class="lengue-name">{{ lengue_name }}</div>
        <div class="odd-title-wrapper row" :class="{vr_basketball: is_vr_basketball}">
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
          @odd_pan="odd_pan_handle" :other_status="standard_odd_status" :is_vr_lock="match_item.is_vr_lock">
        </v-sports-match-item>
      </template>
    </div>
  </div>
</template>
<script>
import virtual_sports_match_list_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-match-list-mixin.js";
import v_s_match_timer from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/virtual-sports-match-timer.vue";
import virtual_sports_match_item from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/virtual-sports-match-item.vue";
import { useRouter,useRoute } from "vue-router";
import VR_CTR from 'src/core/vr/vr-sports/virtual-ctr'



export default {
  mixins:[virtual_sports_match_list_mixin],
  components:{
    'v-s-match-timer':v_s_match_timer,
    'v-sports-match-item':virtual_sports_match_item,
  },
  computed: {
    is_vr_basketball(){
      return VR_CTR.state.virtual_current_sub_menuid == 1004
    }
  },
  setup(){
    const route = useRoute()
    const router = useRouter()
    return {
      route,
      router
    }
  }
}
</script>

<style lang="scss" scoped>
.match-list-wrapper {
  position: relative;
  width: 100%;
  height: auto;

  &.vr_basketball_match_list_wrapper{
    // background-color: red;
  }

  .title-wrap-standard {
    // width: 3.61rem;
    width: 100%;
    border-radius: 0;
    display: flex;
    height: 36px;
    padding-left: 10px;
    color: #1a1a1a;
    background: #F1F1F1!important;
    .lengue-name {
      font-weight: 600;
    }
    .odd-title-wrapper {
      width: 1.92rem;
      height: 100%;
      overflow: hidden;
    }

    .vr_basketball{
      width: 60%;
    }

    .odd-t-w-inner {
      // width: 2.52rem;
      width: 100%;
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
        line-height: 1;
        margin-right: 0.03rem;
        font-size: 13px;
        font-weight: 600;
      }
    }
  }
}
</style>
src/core/vr/mixin/pages/virtual/virtual-sports_part/virtual_sports_match_list_mixin.js