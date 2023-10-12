<!--
 * @Description: 冠军赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div class="champion-wrap" v-if="is_show">
    <!--体育类别  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
    <div class="sport-title match-indent" v-if="get_sport_show(i)" @click="ball_folding_click(match_of_list.csid)">
      <span class="score-inner-span">
        {{match_of_list.csna}}
      </span>
      <div class="collapse-dire">
        <img class="icon-down-arrow" src="/yazhou-h5/image/list/league-collapse-icon-black.svg" :class="{collapsed:collapsed}" alt="" v-if="get_sport_show(i)">
        <img class="icon-down-arrow" src="/yazhou-h5/image/list/league-collapse-icon.svg" :class="{collapsed:collapsed}" alt="" v-else>
      </div>
    </div>
    <div v-if="is_show_league(i)" class="league-container flex items-center justify-between hairline-border" @click="toggle_collapse_state(match_of_list);">
      <div class="league-wrapper champion flex items-center">
         <!-- 未收藏图标 -->
        <img style="width: 16px; height: 16px; margin: 0 10px 0 6px" :src="normal_img_not_favorite_white" alt="">
        <div v-if="menu_type === 100 && GlobalAccessConfig.get_collectSwitch()"  class="favorite" :class="[{favorited:match_of_list.tf},theme]"
          @click.self.stop="toggle_collect(match_of_list)"></div>
            <div class="league-title-text row justify-between" :class="{'without-collect': menu_type !== 100 || (menu_type === 100 && !GlobalAccessConfig.get_collectSwitch())}" >
              {{menu_type == 100 ? match_of_list.onTn : match_of_list.tn}}
            </div>
        </div>

      <div class="collapse-dire">
        <img class="icon-down-arrow" :class="{collapsed:collapsed}" alt="" :src="compute_img('icon-collapse')">
      </div>
    </div>

    <template v-for="(hp,index) of match_of_list.hps">
      <div class="hps-wrap hairline-border" v-if="hp.hs != 2 && !collapsed" :key="index">
       
        <div class="match-title flex items-center"
          :class="{'is-favorite':get_show_favorite_list}">
          <div class="debug-head" style="color:red;position:absolute;right:0;">
            {{get_key_by_obg(hp)}}
          </div>
          <div class="hpn-wrap ellipsis">
            {{hp.hps}}
          </div>
        </div>

        <div v-if="!collapsed && hp.hmed" class="limit-time flex items-center justify-center"
          :class="{'first-t':index == 0}">
          <div class="limit-t-i row justify-center items-center">
            <template v-if="!['zh', 'tw'].includes(lang)">
              {{(new Date(+hp.hmed)).Format(i18n_t('time7'))}} {{ $t('match_main.cut_off')}}
            </template>
            <template v-else>
              {{(new Date(+hp.hmed)).Format(i18n_t('time7'))}} {{ $t('match_main.cut_off')}}
            </template>
          </div>
        </div>

        <div class="ol-list-wrap flex justify-start" :data-ol="hp.ol.length" v-if="hp.ol">

          <odd-item-champion 
            v-for="(ol_item,i) of hp.ol"
            :key="i"
            :hs="hp.hs"
            :data-i="i"
            :ol_item="ol_item"
            :style="calc_bgcolor(ol_item)"
            :class="calc_bgcolor(ol_item) && 'active-item'"
            :csid="match_of_list.csid"
            @click.stop="item_click(match_of_list,hp,ol_item)">
          </odd-item-champion>
        </div>
      </div>
    </template>

  </div>
</template>
 
<script setup>
import { ref, computed, onUnmounted } from "vue";
import lodash from 'lodash'
import { i18n_t} from 'src/core/index.js'
import store from "src/store-redux/index.js";
import { MenuData, compute_img, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/index.js"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
import oddItemChampion from "./odd-item-champion.vue";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import { lang, theme } from 'src/base-h5/mixin/userctr.js'
import { menu_type } from 'src/base-h5/mixin/menu.js'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { normal_img_not_favorite_white } from 'src/base-h5/core/utils/local-image.js'
import 'src/base-h5/css/pages/match-container-champion.scss'

const props = defineProps({
  // 当前组件的赛事数据对应列表的赛事
  match_of_list: Object,
  // 赛事处于列表中的下标
  i: Number,
})

const store_state = store.getState()

const get_bet_list = ref(store_state.get_bet_list)
const get_collapse_map_match = ref(store_state.get_collapse_map_match)
const get_show_favorite_list = ref(store_state.get_show_favorite_list)

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
  get_bet_list.value = new_state.get_bet_list
  get_collapse_map_match.value = new_state.get_collapse_map_match
  get_show_favorite_list.value = new_state.get_show_favorite_list
})

const collapsed = computed(() => {
  let result = true;
  let tmid = gen_collapse_key(props.match_of_list);
  result = get_collapse_map_match.value && get_collapse_map_match.value[tmid];
  return result;
})

const is_show = computed(() => {
  let flag = true;
  if( lodash.get(props.match_of_list, 'hps')){
    flag = !props.match_of_list.hps.every(item => item.hs == 2)
  }

  return flag
})

const calc_bgcolor = computed(() => {
  return function(ol){
    if(!ol) return;
    if(get_bet_list?.value?.includes(ol.oid)){
      if(theme.value.includes('y0')){
        return {'background-color':'#569FFD'}
      }
      return {'background-color':'#FFB001'}
    }else{
      return ""
    }
  }
})

/**
 * @description 判断是否显示联赛标题
 * @param {Number} i 赛事处于列表中的下标
 * @returns {Boolean}
 */
const is_show_league = (i) => {
  let flag = false;
  // 当前赛事
  let curr = MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i])
  if (!curr) {
    return false;
  }
  
  // 虚拟体育没有tid而是tnameCode
  let property_key = "tnameCode";
  if(!curr[property_key]) {
    property_key = "tid";
  }
  if (i == 0) {
    flag = true;
  } else {
    // 前一个赛事
    let prev = MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i - 1])
    // 如果显示  赛事未开赛标题， 或者是  上一次和这一次tid 不一样  则显示联赛标题高度
    if (!prev) return
    if (curr[property_key] != prev[property_key]) {
      flag = true;
    }
  }
  
  return flag;
}
/**
 * 判断是否显示体育类型
 * @param {Object} match 赛事对象
 * @returns {Boolean}
 */
const get_sport_show = (i) => {
  const c = MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i])
  const p = i > 0 && MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i - 1])
  if (!menu_type.value) {
    if (i > 0) {
      if (p && c) {
        return p.csid !== c.csid;
      }
    } else {
      return true;
    }
  } else if ([1, 2, 3, 4, 11, 12,100].includes(menu_type.value)) {
    if (i > 0) {
      if (p && c) {
        return p.csid !== c.csid;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }
}
const get_key_by_obg = (obj) => {
  let r = "";
  if(sessionStorage.getItem('wsl') != '9999') return r;
  if(obj.hid){
    r = `hid:${obj.hid}`;
  }
  return r;
}
/**
 * @description: 获取赔率
 * @param {Object} ol_item 投注项
 * @param {Object} hsw
 * @return {Undefined}
 */
const get_odds_value = (ol_item,hsw) => {
  let ov = ol_item.ov;hsw='1';  //冠军玩法只支持欧赔
  let r1 = compute_value_by_cur_odd_type(ov / 100000,null, hsw );
  return r1 || 0;
}
const gen_collapse_key = (match) => {
    return match.tid;
}
/**
 * @description: 翻转折叠状态
 * @param {Undefined} Undefined
 * @return {Undefined}
 */
const toggle_collapse_state = () => {
  let map_collapse = lodash.cloneDeep(get_collapse_map_match.value);
  if(map_collapse){
    // 翻转折叠时始终将 赛事列表请求状态设为false
    store.dispatch({ type: 'matchReducer/set_match_list_loading',  payload: false })

    let tmid_list = [],tid = null,mid = null,max_l = MatchMeta.match_mids.length;
    for(let i = 0; i < max_l;i++){
      let match = MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i])
      let match_c_key = gen_collapse_key(match);
      if(match.mid == match_of_list.mid){
        tid = match.tid;
        mid = match.mid;
        tmid_list.push(match_c_key);
      }
      if(tid){
        if(tid == match.tid){
          if(mid != match.mid){
            tmid_list.push(match_c_key);
          }
        }
        else{
          break;
        }
      }
    }
    let tmid = gen_collapse_key(match_of_list);
    let f = map_collapse[tmid] ? 0 : 1;
    tmid_list.forEach(tmid => map_collapse[tmid] = f);
    store.dispatch({ type: 'matchReducer/set_collapse_map_match',  payload: map_collapse })
  }
}
/**
 * @description: 冠军投注,内嵌版走这里逻辑
 * @param {Object} match 赛事对象
 * @param {Object} hp 盘口级别对象
 * @param {Object} ol_item 赔率对象
 * @return {String}
 */
const item_click = (match,hp,ol_item) => {
  if (!ol_item.ov || ol_item.ov < 101000) return;   //对应没有赔率值或者欧赔小于101000
  let flag = $common.odds.get_odds_active(0, hp.hs, ol_item.os);
  if (flag == 1 || flag == 4) {   //开盘和锁盘可以点击弹起来
    bet_click2(match, hp, ol_item);
  }
}
/**
 * @description: 冠军玩法联赛收藏与取消收藏
 * @param {Object} match 赛事
 * @return {String}
 */
const toggle_collect = (match) => {
  let item_ = i;

  let param = {
    match,
    index:item_,
    type:'tf',
    type2:true,
  };
  useMittEmit(MITT_TYPES.TOGGLE_COLLECT_LEAGUE,param);
}

onUnmounted(() => {
  unsubscribe()
})

</script>
 
<style scoped lang="scss">
  @import "../styles/match-container-champion.scss";
</style>
