<template>
  <div class="match-list-wrapper" :class="{standard:standard_edition == 2}">
    <div class="title-wrap-standard row justify-end" v-if="standard_edition == 2">
        <div class="odd-title-wrapper row">
          <div class="odd-t-w-inner row items-center" :class="{status2: stateRefs.standard_odd_status}">
            <div v-for="(hpl_title, hp_i) of i18n_t('list_title.'+csid+'.title')" :key="hp_i">
              {{hpl_title}}
            </div>
          </div>
        </div>
      </div>
    <VirtualSportsMatchItem v-for="(match_item,i) in virtual_match_list" :match_selected_i="stateRefs.selected_match_i.value"
      :key="i" :i="i" :match_item="match_item" @switch_match="switch_match_handle"
      @odd_pan="odd_pan_handle" :other_status="stateRefs.standard_odd_status.value">
    </VirtualSportsMatchItem>
  </div>
</template>

<script setup>
import SVirtual from "src/base-h5/components/skeleton/virtual-sports/virtual.vue"
import VirtualSportsMatchItem from "src/base-h5/components/virtual/virtual-sports-match-item.vue";
// #TODO MIXINS 
// import betting from 'project_path/mixins/betting/betting.js';
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";


const props = defineProps({
  virtual_match_list: Array,
  match_list_loaded: Number,
  v_menu_changed:Number | String,
  csid:Number | String,
})  

const emit = defineEmits(['switch_match'])

const state = reactive({
  selected_match_i:0,
  v_match_hps:[],
  standard_odd_status:0,
})

const set_details_item = () => {}
const footer_sub_menu_id = computed(() => {
  return ""
})
onMounted(() => {
  setTimeout(() => {
    console.log(props.virtual_match_list)
  }, 3000)
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
  state.selected_match_i = i;
  // #TODO emit
  emit('switch_match',i);
};
/**
 * 赔率滑动状态
 */
const odd_pan_handle = (status) => {
  state.standard_odd_status = status;
};
watch(
  () => props.v_menu_changed,
  () => {
    state.standard_odd_status = 0;
  }
);
watch( () => props.virtual_match_list, (newValue) => {
    if(!newValue || !newValue.length) return;
    state.v_match_hps = newValue[0].hps
    switch_match_handle(state.selected_match_i);

    // #TODO emit 
    // emit('switch_match',state.selected_match_i); 重复调用，注释掉
  }
);

const stateRefs = toRefs(state)
</script>

<style lang="scss" scoped>
.match-list-wrapper {
  position: relative;
  width: 100%;
  height: auto;
  border-bottom: 1px solid #e9e9e9;
  padding-top: 0.08rem;

  &.standard {
    padding-top: 0;
  }

  .title-wrap-standard {
    width: 3.61rem;
    height: 0.24rem;
    margin: 0 auto;
    border-bottom: 1px solid #e9e9e9;

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
