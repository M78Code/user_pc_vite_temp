<template>
  <div class="">
 
  </div>
</template>
 
<script setup>

import { computed, onActivated, onDeactivated, onMounted, watch } from "vue";

// TODO: 其他模块得 store  待添加
// mixins: [formartmixin, odd_convert, bettings, match_list_mixin, msc,common],
// ...mapMutations([
//   /**
//    * 押注状态0-隐藏状态 1-初始弹出状态,2-注单处理中状态,3-投注成功,
//    * 4-投注失败(bet接口没返回200),5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）,
//    * 7-有投注项锁盘，8-单关投注失败(bet接口返回200)
//    */
//   "set_bet_status",
//   // 赛事id
//   'set_goto_detail_matchid',
//   // 玩法tab 所有投注 - 进球 - 上半场 - 球队 - 让球&大小
//   'set_details_item',
//   // 提醒内容
//   'set_toast',
//   // 控制内容是否高亮用作新手引导使用(home页使用)
//   'set_show_content',
// ]),
// ...mapGetters([
//   // 投注成功的赛事id
//   "get_match_id_bet_success",
//   "get_theme",
//   // 投注项id集合
//   "get_bet_list",
//   // 用户信息,用户金额,userId 需要监听变化
//   "get_user",
//   // 当用户未登录时返回uuid, 当用户登录时返回userId
//   "get_uid",
//   // 收藏菜单为6
//   "get_menu_type",
//   // 当前选中的菜单
//   'get_current_menu',
//   // 控制内容是否高亮用作新手引导使用(home页使用)
//   'get_show_content',
//   // 获取高亮元素高(match-list页使用)
//   'get_element_height',
//   // 滚到顶部
//   'get_goto_list_top',
//   // 显示收藏列表
//   'get_show_favorite_list',
//   // 当前语言
//   'get_lang',
//   // 三级菜单id
//   'get_curr_third_menu_id',
//   // 折叠展开与赛事对应
//   'get_collapse_map_match',
//   // 简版还是标准版
//   'get_newer_standard_edition',
//   //二级菜单type
//   'get_curr_sub_menu_type',
//   'get_access_config',
// ]),

const props = defineProps({
  // 赛事列表无数据
  data_get_empty: Boolean, 
  // 6 收藏页, 
  menu_type: Number | String, 
  //处理赛事列表数据的类型封装
  matchCtr:Object,                
  source:String,
  window_scrolly:Number | String,
  match_list_wrapper_height:Number,
})

const timer_super12 = ref(null)
// 默认箭头向上
const arr_top_down = ref('arr-top') 
// 收藏|取消收藏是否请求中
const favorite_loading = ref(false)
// 罚牌 玩法信息展示
const other_way_info_show = ref(false)
const other_way_style = ref({
  left:0,
  top:0,
})
const pre_info_clicked_mid = ref('')
const play_way_info = ref('')
const current_way_name = ref('')
//回到顶部
const is_goto_top_random = ref(0)
// 次要玩法info tips----当前展开的次要玩法tab信息
const curr_play_info = ref({
  // 当前赛事状态，默认为滚球
  ms: 1,
  // 当前展开的次要玩法tab
  menu_id: '',
  show_15min_data:false // 15分钟玩法数据
})

onMounted(() => {
  timer_super12.value = null;
})

watch(() => other_way_info_show, (curr) => {
  $root.$emit(emit_cmd.EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE,curr);
})

watch(() => window_scrolly, () => {
  other_way_info_show.value = false;
})
// 投注成功收藏赛事
watch(() => get_match_id_bet_success, (curr) => {
  if(curr){
    let id_s = curr.split('-')[0];
    let favorite = curr.split('-')[1];
    let match_id_list = id_s.split(',');
    let found = null;
    match_id_list.forEach(id => {
      for(let i = 0; i < props.matchCtr.list.length;i++){
        let match = props.matchCtr.list[i];
        if(match.mid == id){
          if(favorite == 1 || favorite == 0){
            match.mf = favorite == 1;
          }
          else{
            match.mf = true;
          }
          //如果是冠军玩法,投注成功后收藏赛事同也收藏联赛
          if(is_champion){
            if(favorite == 1 || favorite == 0){
              match.tf = favorite == 1;
            }
            else{
              match.tf = true;
            }
          }
          found = match;
          break;
        }
      }
      if(props.matchCtr.mid_obj[id]){
        if(favorite == 1 || favorite == 0){
          props.matchCtr.mid_obj[id].mf = favorite == 1;
        }
        else{
          props.matchCtr.mid_obj[id].mf = true;
        }
      }

    });
  }
}, { deep: true })
// 回到顶部
watch(() => get_goto_list_top, () => {
  is_goto_top_random.value = Math.random();
})

watch(() => get_newer_standard_edition, (newValue) => {
  if (newValue == 1) {
    other_way_info_show.value = false
  }
})

// 当前为冠军或电竞冠军
const is_champion = computed(() => {
  let flag = 100 == props.menu_type || (3000 == props.menu_type && _.get(get_current_menu, 'date_menu.menuType') == 100); //电竞冠军
  return flag;
})
// 是否显示无第 {X} 个进球 title----次要玩法tips(5分钟次要玩法)
const show_Xth_title = computed(() => {
  return [1,2,7,10].includes(+curr_play_info.value.ms) && curr_play_info.value.menu_id === 19
})

const tab_changing_handle = () => {
  close_other_w_info();
}
/**
 * 关闭玩法描述
 */
const close_other_w_info = () => {
  other_way_info_show.value = false;
}
/**
 * 玩法信息图标点击
 */
const info_icon_click_h = (e,mid,menu,match) => {
  if(!e){
    other_way_info_show.value = false;
    return;
  }

  // 获取当前赛事状态
  curr_play_info.value = {
    ms: _.get(match, 'ms', 1),
    menu_id: menu.id
  }

  current_way_name.value = menu.title;
  let menu_id = menu.id;
  other_way_style.value.left = rem(0.1);
  other_way_style.value.top = e.clientY + rem(.16);
  if(mid != pre_info_clicked_mid.value){
    other_way_info_show.value = true;
  }
  else{
    other_way_info_show.value = !other_way_info_show.value;
  }

  let arr_top_off_set=0; //偏移量  滑动到快底部时 显示不下,向上显示
  let arr_to_down=false; // 默认向上显示
  if([19,17,5].includes(menu_id)){ // 如果是17 15分钟玩法 // 后续可能会加新玩法 所以大判断在前
    // 5分钟
    if (19 == menu_id) {
      arr_top_off_set = 2 // 单位rem
      show_15min_data = false
    }
    // 15分钟
    else if(17==menu_id){
      arr_top_off_set=1.8 // 单位rem
      show_15min_data = true
    }
    // 罚牌
    else if(5==menu_id){
      arr_top_off_set=1.1 // 单位rem
    }

    if(document.body.offsetHeight-e.clientY <rem(arr_top_off_set)+ rem(0.1)){
        // 如果当前点击的位置超过 弹框本身的大小 则变成向上显示
        other_way_style.value.top = e.clientY -rem(.16) -rem(arr_top_off_set);
        arr_to_down=true;
    }
  }
  arr_top_down.value=arr_to_down?'arr-down':'arr-top'; // 箭头向上向下显示 // 赋值给this

  play_way_info.value = $root.$t(`play_way_info.${menu_id}`);
  pre_info_clicked_mid.value = mid;
}
/**
 * 收藏与取消收藏（联赛与赛事）
 * @param {Object} $event {match index type type2}
 * @return {Undefined} Undefined
 */
const toggle_collect = ($event) => {
  if( !utils.judge_collectSwitch( _.get(get_access_config,'collectSwitch'),this ) ) return

  if(favorite_loading.value) {
    clearTimeout(timer_super12.value);
    timer_super12.value = setTimeout(() => {
      favorite_loading.value = false;
    },3000);
    return;
  }

  let match = $event.match, index = $event.index,item = $event.type,type2= $event.type2;

  let api, txt, number = 0;
  let params = {
    cuid: get_user ? get_user.userId:get_uid,
  };
  if (item == 'tf') {
    //联赛收藏或取消收藏
    api = add_or_cancel_tournament;
    if (match.tf) {
      txt = $root.$t('common.cancel');//'取消';
    } else {
      txt = $root.$t('collect.betted_title');//'收藏';
    }
    if(type2){  //冠军联赛收藏
      //电竞冠军收藏dota2传非空
      if(props.menu_type == 3000){
        params.dota2 = 1;
        params.tid = match.tid;
      }
      else{
        let mids = []
        _.each(props.matchCtr.match_list_data_sources,cur_match=>{
          if(cur_match.tid == match.tid){
            mids.push(cur_match.mid)
          }
        })
        params.mid = mids.join(',');
      }
      params.cf = Number(!match.tf);
    }else{    //其他联赛收藏
      Object.assign(params, {cf: Number(!match.tf), tid: match.tid})
    }
  }
  else
  {
    //赛事收藏或取消收藏
    api = add_or_cancel_match;
    number = 1;
    if (match.mf) {
      txt = $root.$t('common.cancel');//'取消';
    } else {
      txt = $root.$t('collect.betted_title');//'收藏';
    }
    Object.assign(params, {cf: Number(!match.mf), mid: match.mid})
  }

  let changedParam = {
    index: index,
    item: item,
    bool: !match[item],
    number: number,
    sportId: match.csid,
  };
  $emit('change_favorite_state', changedParam);

  favorite_loading.value = true;
  api(params).then(res => {
    favorite_loading.value = false;
    if(res.code == 200){
    }
    else if(res.msg){
      set_toast({ 'txt': res.msg });
    }
  });
}
/**
 * 折叠状态变化
 */
const unfold_changed_handle = ($event) => {
  $emit('unfold_changed',$event);
}

onDeactivated(() => {
  utils.del(msc_map);
  clearTimeout(timer_super12.value)
  timer_super12.value = null

  $root.$off(emit_cmd.EMIT_INFO_ICON_CLICK,info_icon_click_h);
  $root.$off(emit_cmd.EMIT_TAB_HOT_CHANGING,tab_changing_handle);
})

onActivated(() => {
  $root.$on(emit_cmd.EMIT_INFO_ICON_CLICK,info_icon_click_h);
  $root.$on(emit_cmd.EMIT_TAB_HOT_CHANGING,tab_changing_handle);
})
 
</script>
 
<style scoped lang="scss">
  @import "../styles//match-list";
</style>