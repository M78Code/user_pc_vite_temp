<!--
 * @Description: 投注项赔率
-->

<template>
  <div style="display: none;">{{ MatchDataBaseH5.data_version.version }}</div>
  <div class="odd-column-item" :class="odds_class_object" @click.stop="item_click3" :id="dom_id_show && `list-${lodash.get(odd_item, 'oid')}`">
    <!-- 占位  或者  关盘 -->
    <!-- <div v-if="placeholder == 1 || is_close(get_odd_status())" class="item-inner">
      <img class="icon-lock" :class="{standard:n_s}" :src="match_icon_lock" />
    </div> -->

    <!-- 占位  或者  关盘 (列表简单版时非足球赛事角球菜单时设置为关盘)-->
    <div v-if="placeholder == 1 || is_close(get_odd_status()) || (lodash.get(odds_class_object,'is-jiaoqiu') && _.get(match,'csid') != 1) && PageSourceData.route_name=='matchList'" class="item-inner">
      <template  v-if="is_show_lock">
        -
      </template>
      <img class="icon-lock" :class="{standard:n_s}" :src="match_icon_lock"  v-else/>
    </div>

    <!-- 全封(不显示盘口值) 占位时显示封-->
    <div v-else-if="is_fengpan(get_odd_status())" class="item-inner">
      <!--csid:1足球全封,不显示盘口名-->
      <div class='odd-title'
        :class="{three:column_ceil > 2,standard:n_s == 2}"
        v-if="(!is_fengpan(get_odd_status()) && [18,19].includes(+lodash.get(current_tab_item, 'id'))) || ((odd_item.on || convert_num(odd_item) === 0) && match.csid != 1)"
        v-html="transfer_on(odd_item)">
      </div>
      <img class="icon-lock" :class="{standard:n_s}" :src="match_icon_lock" />
    </div>

    <!-- 半封(显示盘口值)与赔率显示 -->
    <div v-else class="item-inner have-on" :class="{close: is_fengpan(get_odd_status()) || get_obv_is_lock(odd_item)}">
      <!--csid:1足球全封,不显示盘口名-->
      <div class='odd-title'
        :class="{three:column_ceil > 2,standard:n_s == 2}"
        v-if="(odd_item.on || convert_num(odd_item) === 0 || (!is_fengpan(get_odd_status()) && [18,19].includes(+lodash.get(current_tab_item, 'id'))) ) ||
              (is_fengpan(get_odd_status())  || get_obv_is_lock(odd_item))
              && match.csid != 1"
        v-html="transfer_on(odd_item)">
      </div>
      <!-- 显示赔率 -->
      <div class='odd-value fontbold' v-show="!is_fengpan(get_odd_status()) && (+odd_item.ov ) && !get_obv_is_lock(odd_item)"
        :class="{
          three:column_ceil > 2,
          red:red_green_status === 1,
          green:red_green_status === -1,
          orange:(get_cur_odd === 'ID' || get_cur_odd === 'MY') && odds_value < 0,
          focus:odd_item.result == 4 || odd_item.result == 5,
          win:[4,5].includes(+odd_item.result),
          lose:[0,1,2,3,6].includes(+odd_item.result),
          standard:n_s == 2,
        }">
        {{ odd_append_value }}<!--获取赔率或赛果-->
        <span class="change-icon" v-show="red_green_status" :class="{'icon-red':red_green_status === 1,'icon-green':red_green_status === -1}"></span>
      </div>
      <!-- 半封(显示盘口值on) -->
      <img class="icon-lock" :class="{standard:n_s}" v-if="(is_fengpan(get_odd_status()) || get_obv_is_lock(odd_item))"
           :src="match_icon_lock" />
    </div>

  </div>
</template>
 
<script setup>
// import betting from 'src/project/mixins/betting/betting.js';
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import store from "src/store-redux/index.js";
import lodash from 'lodash'
import { useMittOn, MITT_TYPES } from  "src/core/mitt"
import  { MenuData, i18n_t, get_odds_active, compute_value_by_cur_odd_type,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import UserCtr from 'src/core/user-config/user-ctr.js'
import PageSourceData  from  "src/core/page-source/page-source.js";
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/output/index.js"

// import odd_convert from "/mixins/odds_conversion/odds_conversion.js";

// TODO: 其他模块得 store  待添加
// mixins:[odd_convert,betting],

const props = defineProps({
  current_tab_item:Object, //
  ol_list_item:Object, //
  odd_item_i:Number,
  match:Object,
  odd_field:Object,
  hl_hs:Number,  // 0.开盘，1封盘，2关盘 ，3 锁盘    和 match.mhs   是一样的意思
  placeholder:Number,// 是否为占位
  n_s:Number,    // 1新手版 2标准版
  column_ceil:Number, //列数量
})

const match_icon_lock = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`

const emits = defineEmits(['select_change'])

const store_state = store.getState()
const timer_ = ref(null)
const timer1_ = ref(null)
const emitters = ref({})
// 投注项
const odd_item = ref({})
//红升绿降状态
const red_green_status = ref(0)
//虚拟体育开0 封1
const virtual_odds_state = ref(0)
const odd_append_value = ref('')
const ol_dictionary = ref({})
const is_local_lock = ref(0)
const dom_id_show = ref('')

const get_bet_list = ref(store_state.get_bet_list)
const get_cur_odd = ref(store_state.get_cur_odd)
const get_foot_ball_screen_changing = ref(store_state.get_foot_ball_screen_changing)
const get_lang = ref(store_state.get_lang)

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
  get_lang.value = new_state.get_lang
  get_cur_odd.value = new_state.get_cur_odd
  get_bet_list.value = new_state.get_bet_list
  get_foot_ball_screen_changing.value = new_state.get_foot_ball_screen_changing
})

onMounted(() => {
  // 设置是否显示投注项dom的id属性值
  dom_id_show.value =  window.BUILDIN_CONFIG.LOCAL_FUNCTION_SWITCH.DOM_ID_SHOW;
  get_odd_data();
  emitters.value = {
    // 封盘事件
    emitter_1: useMittOn(MITT_TYPES.EMIT_ARRIVED10, arrived10_handle).off,
     // c105更新
    emitter_2: useMittOn(MITT_TYPES.EMIT_MATCH_RESULT_DATA_LOADED, match_result_data_loaded).off,
  }
})

// 当前玩法ID
const hpid = computed(() => {
  return lodash.get(props.odd_field,'hpid');
})

// 是否显示 -
const is_show_lock = () => {
  const ol = lodash.get(props.odd_field, 'hl[0].ol', "")
  return lodash.isEmpty(ol)
}

// 判断边框border-radius样式
const odds_class_object = computed(() => {
  let result = {
    'odd-column-item2':is_selected,
    'is-standard':PageSourceData.get_newer_standard_edition() === 2,
    'first-radius': props.odd_item_i === 0,
    'last-radius': props.odd_item_i > 1,
    'is-jiaoqiu':MenuData.footer_sub_menu_id == 114,
    'mred':  red_green_status.value === 1 && no_lock() && (!is_selected),
    'mgreen': red_green_status.value === -1 && no_lock() && (!is_selected),
  };
  if(PageSourceData.get_newer_standard_edition() == 2){
    delete result['first-radius'];
    delete result['last-radius'];
  }
  return result;
})

/**
 * @description: 盘口状态  1.开盘，    2封盘，   3关盘 ，    4 锁盘
 * @return number 1开盘     4锁盘正常显示    2 封盘显示锁,     3关盘显示短横线
 */
const odd_s = computed(() => {
  clearTimeout(timer1_.value)
  timer1_.value = setTimeout(() => {
    get_odd_data();
  },600);

  if(!odd_item.value) return 3;
  if(props.hl_hs == 1 || virtual_odds_state.value == 1){
    return 2
  }
  else if(props.hl_hs == 2){
    return 3
  }
  else if(props.hl_hs == 3){
    return 4
  }
  return get_odds_active(odd_item.value.ms,odd_item.value.hs,odd_item.value.os);
})

// 投注项是否被选中
const is_selected = computed(() => {
  let flag;
  if (MenuData.get_menu_type() == 900) {  //虚拟体育
    flag = get_bet_list.includes(odd_item.value.oid);
  } else {
    let id_ = lodash.get(props.odd_field,'hl[0].hn')? `${props.match.mid}_${props.odd_field.chpid || props.odd_field.hpid}_${odd_item.value.ot}_${props.odd_field.hl[0].hn}` : odd_item.value.oid
    flag = get_bet_list.includes(id_);
  }
  emits('select_change',{flag,i:props.odd_item_i});
  return flag;
})


// 计算最终显示的赔率
const odds_value = computed(() => {
  if(!props.odd_field) return 0;
  let ov = odd_item.value?.ov
  let hsw = props.odd_field?.hsw;
  let csid = null;
  if(MenuData.get_menu_type() == 3000){
    csid = props.match.csid;
  }
  //  let r1 = compute_value_by_cur_odd_type(ov / 100000,null, hsw, false ,csid);
  let r1 = ov / 100000
  return r1 || 0;
})

// 监听玩法变化
watch(() => hpid.value, () => {
  get_odd_data();
})

// 监听赔率变化实现红升绿降
watch(() => odd_item.value?.ov, (v1,v0) => {
  if(get_foot_ball_screen_changing.value){
    return;
  }
  let curr = Number(v1);
  let old = Number(v0);

  clearTimeout(timer_.value);
  if(curr > old){
    red_green_status.value = 1;
  }else if(curr < old){
    red_green_status.value = -1;
  }
  timer_.value = setTimeout(() => {
    red_green_status.value = 0;
  },3000);
})

// 监听玩法变化
watch(() => odds_value.value, () => {
  get_odd_append_value(odd_item.value);
})

watch(() => props.match, () => {
  let ol_list = get_ollist_no_close(props.odd_field);
  if(ol_list.length > 0){
    if([11,18,19].includes(+lodash.get(props.current_tab_item, 'id'))){
      odd_item.value = props.ol_list_item
    }else{
      if(odd_item.value) {
        Object.assign(odd_item.value, ol_list[props.odd_item_i]);
      } else{
        odd_item.value = ol_list[props.odd_item_i];
      }
    }
  }
}, { deep:true })

/**
 * @description: 不是锁
 * @return boolean
 */
const no_lock = () => {
  let result = false;
  if(props.placeholder == 1){
    result = true;
  }
  else if(is_close(odd_s)){
    result = true;
  }
  else if(is_fengpan(odd_s) && (!odd_item.value.on || odd_item.value.on == 0)){
    result = true;
  }
  else if(is_fengpan(odd_s) || get_obv_is_lock(odd_item.value)){
    result = true;
  }
  return !result;
}
/**
 * 获取到赛果数据
 */
const match_result_data_loaded = (data) => {
  data.forEach(result => {
    result.forEach(hl_list => {
      if(hl_list && hl_list.hl && hl_list.hl.length){
        hl_list.hl[0].ol.forEach(ol_item => {
          ol_dictionary.value[ol_item.oid] = ol_item.result;
        });
      }
    });
  });
  is_local_lock.value = 11;
  get_odd_append_value(odd_item.value);
}
// 获取赔率或赛果
const get_odd_append_value = (ol_item) => {
  let r = "";
  if(ol_item.result === "0" || ol_item.result){
    r = i18n_t(`virtual_sports.result[${ol_item.result}]`);
  } else{
    let dict_result = ol_dictionary.value[ol_item.oid];
    if(dict_result === "0" || dict_result){
      r = i18n_t(`virtual_sports.result[${dict_result}]`);
    } else{
      r = odds_value.value;
    }
  }
  odd_append_value.value = compute_value_by_cur_odd_type(ol_item.ov,ol_item._hpid,ol_item._hsw,props.match.csid)
  // odd_append_value.value = r.toFixed(2);
}
const arrived10_handle = () => {
  virtual_odds_state.value = 1;
}
// 获取 投注项数据，
const get_odd_status = () => {
  get_odd_data();
  if(!odd_item.value) return 3;
  if(props.hl_hs == 1 || virtual_odds_state.value == 1){
    return 2
  }
  else if(props.hl_hs == 2){
    return 3
  }
  else if(props.hl_hs == 3){
    return 4
  }
  return get_odds_active(odd_item.value.ms,odd_item.value.hs,odd_item.value.os);
}
// on转换html
const transfer_on = (odd_item) => {
  if(props.match.csid == 1 && [19].includes(+lodash.get(props.current_tab_item, 'id')) ){
    return odd_item.onb || odd_item.on;
  }
  let on = odd_item.onb || odd_item.on;
  if(props.match.csid == 1 && [18].includes(+lodash.get(props.current_tab_item, 'id')) ){
    on = odd_item.ot
    if(odd_item.ot == 'Other' && ['zh', 'tw', 'hk'].includes(get_lang)){
      on = '其他'
    }
  }
  let color = '';
  if(is_fengpan(odd_s) || get_obv_is_lock(odd_item)){
    color='var(--qq-gb-t-c-3)'
    // if(.includes('day')){
    //   // color = '#d1d1d1';
    // }
    // else{
    //   // color = '#414141';
    // }
  }
  let replaced = on
  if(![18].includes(+lodash.get(props.current_tab_item, 'id'))){
    replaced = on.replace(/[\/0-9\+\-\.]/ig,found => {
      return `<span style="color:${color}">${found}</span>`
    });
  }
  return replaced;
}
// on转换为数字
const convert_num = (odd_item) => {
  let on = odd_item.onb || odd_item.on;
  if(on === 0 || on === "0"){
    return 0;
  }
  else if(!on){
    return ''
  }
  else{
    return on;
  }
}
/**
 * @description: 原始赔率(ov / 100000)小于1.01 强制显示封盘(显示锁)
 * @return boolean 是否显示封盘样式
 */
const get_obv_is_lock = (odd_item) => {
  return odd_item.ov < 101000;
}
//  获取指定下标的投注项数据
const get_odd_data = () => {
  let ol = null;
  try{
    if(lodash.get(props.odd_field,'hl[0]')){
      ol = props.odd_field.hl[0].ol;
    }
  } catch(e){
    console.error(e);
  }
  if(ol && ol.length){
    if([11,18,19].includes(+lodash.get(props.current_tab_item, 'id'))){
      odd_item.value = props.ol_list_item
    }else{
      odd_item.value = ol[props.odd_item_i];
    }
  } else {
    odd_item.value = {"oid":"","mid": lodash.get(props.odd_field,'mid')}
  }
}
/**
 * @description: 获取（开盘与关盘）非封盘和锁盘的盘口
 * @return Array 投注项列表
 */
const get_ollist_no_close = (odd_field) => {
  let hl_list = [],ol = [];
  if(odd_field && odd_field.hl && odd_field.hl.length){
    hl_list = odd_field.hl;
  }

  for(let i = 0; i < hl_list.length;i++){
    let hl = hl_list[i];
    if(hl.hs == 0 || hl.hs == 11){
      ol = hl.ol;
      break;
    }
  }
  return ol;
}
/**
 * @description: 是否封盘odd_s == 2
 * @return boolean
 */
const is_fengpan = (odd_s) => {
  if(is_local_lock.value == 11) return false;
  if(props.match.mhs == 1) return true; // mhs： 0 开,  1 封,  2 关,  11 锁
  if(props.hl_hs == 1) return true;
  return odd_s == 2;
}
/**
 * @description: 是否是关盘
 * @return boolean
 */
const is_close = (odd_s) => {
  let r = false;
  if(is_local_lock.value == 11) return false;
  if(props.match.mhs == 2) return true; // mhs： 0 开,  1 封,  2 关,  11 锁
  if(props.hl_hs == 2){ // 投注项父类关盘
    return true;
  }
  if(odd_s == 2) {
    return false;
  }
  if(odd_s == 3){
    r = true;
  }
  return r;
}
/**
 * @description bw3新版点击列表小方块投注
 * @param {Undefined} Undefined
 * @return {Undefined} undefined
 */
const item_click3 = lodash.debounce(() => {
  if (!odd_item.value.ov || odd_item.value.ov < 101000) return;   //对应没有赔率值或者欧赔小于101000
  let flag = get_odds_active(props.match.mhs, props.hl_hs, odd_item.value.os);

  if (flag == 1 || flag == 4) {   //开盘和锁盘可以点击弹起来
    if (MenuData.get_menu_type() == 900 && $route.name == 'virtual_sports') { //虚拟体育走这里逻辑
      if (props.match.match_status) return
    } else { //正常赛事走这里逻辑
      console.error('ol_list_item',odd_item.value)
      const {oid,_hid,_hn,_mid } = odd_item.value
      let params = {
        oid, // 投注项id ol_obj
        _hid, // hl_obj 
        _hn,  // hn_obj
        _mid,  //赛事id mid_obj
      }
      let other = {
        is_detail: false,
        // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
        // 根据赛事纬度判断当前赛事属于 那种投注类型
        bet_type: 'common_bet',
        // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
        device_type: 1,  
        // 数据仓库类型
        match_data_type: "h5_list",

    }
      set_bet_obj_config(params,other)
    }
  }
}, 450, {'leading': true, trailing: false})

onUnmounted(() => {
  unsubscribe()
  Object.values(emitters.value).map((x) => x())
  clearTimeout(timer_.value);
  timer_.value = null;
  clearTimeout(timer1_.value);
  timer1_.value = null;
})

</script>
 
<style scoped lang="scss">
  @import "../styles/odd-column-item";
</style>