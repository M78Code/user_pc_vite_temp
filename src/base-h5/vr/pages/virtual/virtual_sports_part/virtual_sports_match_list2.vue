<!--
 * @Author: Cronus
 * @Date: 2021-01-01 13:52:32
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
import VR_CTR from "src/base-h5/vr/store/virtual_sports/virtual_ctr.js"
import v_s_match_timer from "src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports_match_timer.vue";
import virtual_sports_match_item from "src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports_match_item2.vue";
// import betting from 'project_path/mixins/betting/betting.js';
import SVirtual from "src/base-h5/vr/components/skeleton/virtual_sports/virtual.vue"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5} from "src/output/index.js"
import { standard_edition } from 'src/base-h5/mixin/userctr.js'

export default {
  // mixins:[betting],
  props:{
    virtual_match_list:Array,
    match_list_loaded:Number,
    v_menu_changed:Number | String,
    csid:Number | String,
  },
  data(){
    return{
      selected_match_i:0,
      v_match_hps:[],
      standard_odd_status:0,
      MatchDataBaseH5,
      standard_edition
    }
  },
  mounted() {
    this.emitters = [
      useMittOn(MITT_TYPES.EMIT_XU_NI_TY_STANDARD_ODD_STATUS, this.odd_pan_handle).off,
    ]
  },
  destroyed(){
    // this.$root.$off(this.emit_cmd.EMIT_XU_NI_TY_STANDARD_ODD_STATUS,this.odd_pan_handle)
    this.emitters.map((x) => x());
  },
  methods:{
    // ...mapActions([
    //   // 设置玩法项默认选中
    //   "set_details_item",
    // ]),
    set_details_item(data){ VR_CTR.set_details_item(data)  },
    /**
     * 切换赛事
     * @param {Number} i 赛事下标
     * @return {Undefined}
     */
    switch_match_handle(i){
      this.selected_match_i = i;
      this.$emit('switch_match',i);
    },
    /**
     * 赔率滑动状态
     */
    odd_pan_handle(status){
      this.standard_odd_status = status;
    },
  },
  watch:{
    v_menu_changed(){
      this.standard_odd_status = 0;
    },
    virtual_match_list(){
      if(!this.virtual_match_list || !this.virtual_match_list.length) return;
      this.v_match_hps = this.virtual_match_list[0].hps
      this.switch_match_handle(this.selected_match_i);
      this.$emit('switch_match',this.selected_match_i);
    }
  },
  computed:{
    // ...mapGetters({
    //   footer_sub_menu_id:"get_footer_sub_menu_id",
    //   get_newer_standard_edition:"get_newer_standard_edition",//新手版1    标准版  2
    // }),
    footer_sub_menu_id(){return ''},
  },
  components:{
    'v-s-match-timer':v_s_match_timer,
    'v-sports-match-item':virtual_sports_match_item,
    SVirtual
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
    border-bottom: 1px solid #eee;

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
      -webkit-transition: transform 0.2s;

      &.status2 {
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
