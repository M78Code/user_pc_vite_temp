 
 
import { ref, computed, onUnmounted, onMounted } from "vue";
import lodash from 'lodash'
import { i18n_t} from 'src/core/index.js'
import store from "src/store-redux/index.js";
import { MenuData, compute_img_url, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/index.js"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
import oddItemChampion from "./odd-item-champion.vue";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import { lang, theme } from 'src/base-h5/mixin/userctr.js'
import { menu_type } from 'src/base-h5/mixin/menu.js'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { normal_img_not_favorite_white } from 'src/base-h5/core/utils/local-image.js'
import 'src/base-h5/css/pages/match-container-champion.scss'
import MatchFold from 'src/core/match-fold'
import MatchCollect from 'src/core/match-collect'

const props = defineProps({
  // 当前组件的赛事数据对应列表的赛事
  match_of_list: Object,
  // 赛事处于列表中的下标
  i: Number,
})

const store_state = store.getState()

const get_bet_list = ref(store_state.get_bet_list)
const get_show_favorite_list = ref(store_state.get_show_favorite_list)

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
  get_bet_list.value = new_state.get_bet_list
  get_show_favorite_list.value = new_state.get_show_favorite_list
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
 * @description 赛事收藏
 */
const handle_match_collect = () => {
  // 获取当前收藏状态
  const state = MatchCollect.get_match_collect_state(props.match_of_list)
  MatchCollect.set_match_collect_state(props.match_of_list, !state)
}

/**
 * @deprecated  赛事收藏 状态
 */
const match_collect_state = computed(() => {
  return MatchCollect.get_match_collect_state(props.match_of_list)
})

/**
 * @description 球种折叠
 */
const handle_ball_seed_fold = () => {
  MatchFold.set_ball_seed_match_fold(props.match_of_list.csid)
}
/**
 * @description 联赛折叠
 */
const handle_league_fold = () => {
  MatchFold.set_league_fold(props.match_of_list.tid)
}

/**
 * @description 联赛折叠状态
 */
const league_collapsed = computed(() => {
  return !lodash.get(MatchFold.ball_seed_csid_fold_obj.value, `csid_${props.match_of_list.csid}`, true)
})
/**
 * @description 赛事显示/隐藏
 */
const collapsed = computed(() => {
  const key = MatchFold.get_match_fold_key(props.match_of_list)
  const show_card = lodash.get(MatchFold.match_mid_fold_obj.value, `${key}.show_card`)
  return !show_card
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


 

export default {
  setup(props) {
    

    return{

    }
  },
  mounted(){
    
  },
  unmounted() {
    unsubscribe()
  },
  
}
 