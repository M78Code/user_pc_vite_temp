<template>
  <div class="match-list-wrapper" :class="{standard:get_newer_standard_edition == 2}">
    <template>
      <div class="title-wrap-standard row justify-end" v-if="get_newer_standard_edition == 2">
        <div class="odd-title-wrapper row">
          <div class="odd-t-w-inner row items-center" :class="{status2:standard_odd_status}">
            <div v-for="(hpl_title, hp_i) of i18n_t('list_title.'+csid+'.title')" :key="hp_i">
              {{hpl_title}}
            </div>
          </div>
        </div>
      </div>
      <v-sports-match-item v-for="(match_item,i) in virtual_match_list" :match_selected_i="selected_match_i"
        :key="i" :i="i" :match_item="match_item" @switch_match="switch_match_handle"
        @odd_pan="odd_pan_handle" :other_status="standard_odd_status">
      </v-sports-match-item>
    </template>
  </div>
</template>

<script>
// #TODO VUEX
// import { mapGetters, mapActions } from "vuex";
import SVirtual from "src/base-h5/components/skeleton/virtual-sports/virtual.vue"
import v_s_match_timer from "src/base-h5/components/virtual/virtual-sports-match-timer.vue";
import virtualSportsMatchItem from "src/base-h5/components/virtual/virtual-sports-match-item.vue";
// #TODO MIXINS 
// import betting from 'project_path/mixins/betting/betting.js';
import {  PageSourceData  } from "src/core/index.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "virtual_sports_match_list",
  // #TODO MIXINS 
  // mixins:[common],

  components:{
    'v-s-match-timer':v_s_match_timer,
    virtualSportsMatchItem,
    SVirtual
  },

  props:{
    virtual_match_list:Array,
    match_list_loaded:Number,
    v_menu_changed:Number | String,
    csid:Number | String,
  },
  
  
  setup(props, evnet) {
    const component_data = reactive({
      selected_match_i:0,
      v_match_hps:[],
      standard_odd_status:0,
    })
    // #TODO VUEX
    // ...mapActions([
    //   // 设置玩法项默认选中
    //   "set_details_item",
    // ]),

    // #TODO VUEX
    //   computed:{
    //   ...mapGetters({
    //     footer_sub_menu_id:"get_footer_sub_menu_id",
    //     get_newer_standard_edition:"get_newer_standard_edition",//新手版1    标准版  2
    //   }),
    // },
    const set_details_item = () => {}
    const footer_sub_menu_id = computed(() => {
      return ""
    })
    const get_newer_standard_edition = computed(() => {
      return PageSourceData.get_newer_standard_edition()
    })
    onMounted(() => {
      // #TODO emit
      // useMittOn(MITT_TYPES.EMIT_XU_NI_TY_STANDARD_ODD_STATUS,odd_pan_handle);
    })
    onUnmounted(() => {
      // #TODO emit
    // useMittOn(MITT_TYPES.EMIT_XU_NI_TY_STANDARD_ODD_STATUS,odd_pan_handle)
    })
    /**
     * 切换赛事
     * @param {Number} i 赛事下标
     * @return {Undefined}
     */
    const switch_match_handle = (i) => {
      component_data.selected_match_i = i;
      // #TODO emit
      // $emit('switch_match',i);
    };
    /**
     * 赔率滑动状态
     */
    const odd_pan_handle = (status) => {
      component_data.standard_odd_status = status;
    };
    watch(
      () => props.v_menu_changed,
      () => {
        component_data.standard_odd_status = 0;
      }
    );
    watch(
      () => props.virtual_match_list,
      () => {
        if(!virtual_match_list || !virtual_match_list.length) return;
        component_data.v_match_hps = virtual_match_list[0].hps
        switch_match_handle(component_data.selected_match_i);

        // #TODO emit 
        // $emit('switch_match',selected_match_i);
      }
    );
    return {
      ...toRefs(component_data),
      footer_sub_menu_id,
      get_newer_standard_edition,
      switch_match_handle,
      odd_pan_handle,
      set_details_item,
    }
  }
})
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
