<!--
 * @Description: 投注项列表
-->
<template>
  <div class="odd-list-wrap app-odd-list"
      :class="{
        standard: !show_newer_edition,
        compose_play: [11].includes(+lodash.get(current_tab_item, 'id')),
        special_play: [18].includes(+lodash.get(current_tab_item, 'id')),
        five_special_play: [11,19].includes(+lodash.get(current_tab_item, 'id')),
        five_no_data: !lodash.size(lodash.get(five_minutes_all_list, 'hl[0].ol'))
      }"
    >
    <!--新手版-->
    <div class="odd-list-container flex" v-if="show_newer_edition && !selected_list">
      <!--角球选中标志2白色版4黑色版-->
      <span class="icon-jiaoqiu"
        :class="{'selected show':show_lock_selected}"
        :style="compute_css_obj('icon-jiaoqiu-s')" ></span>
        <!--角球未选中标志1白色版3黑色版-->
      <img class="icon-jiaoqiu"
        :style="{
          display:match.csid == 1 && MenuData.get_footer_sub_menu_id() == 114 ? 'block':'none',
          ...compute_css_obj('icon-jiaoqiu')
      }"
        />
      <odd-column-item
        v-for="(ol_item,i) of ol_list"
        :key="i"
        @select_change="select_column_change_handle"
        :odd_item_i="i"
        :match="match"
        :odd_field="hp_item"
        :hl_hs="hl_hs"
        :invoke_source="invoke_source"
      />
      <template v-if="!ol_list || !ol_list.length">
        <odd-column-item :placeholder="1" :odd_item_i="0"/>
        <!--独赢才显示三个投注-->
        <odd-column-item :placeholder="1" v-if="show_3_space()" />
        <odd-column-item :placeholder="1" :odd_item_i="2"/>
      </template>
    </div>
    <!--标准版赔率容器  波胆 5分钟  玩法除外-->
    <template v-if="![18,19].includes(+lodash.get(current_tab_item, 'id'))">
      <template v-if="![11].includes(+lodash.get(current_tab_item, 'id'))">
        <div v-if="(!show_newer_edition && get_n_s_changed_loaded ) || selected_list"
          :class="['standard-odd-l-w',{'status2': standard_odd_status == 1}, { 'is_no_scroll': is_scroll_page }]" v-touch-swipe.mouse.right.left="odd_wrapper_pan">
          <!--标准版-->
          <div class="standard-odd-list row" v-if="!selected_list" :class="{'f-child':standard_odd_status == 0,'r-child':standard_odd_status == 1}">
            <div class="odd-column-w" :class="[{ clounm2: ![1,4,11,14,16].includes(+match.csid) }, {'boxing':match.csid == 12 }]" 
                v-for="(hp_item_obj,hp_i_i) in fill_empty_hps(get_hp_list(standard_odd_status))" :key="hp_i_i+''+standard_odd_status">
              <!-- 足球 1，水球 16， 冰球 4, 手球 11，橄榄球 14 有三行 -->
              <div :class="['odd-wrap-min 1', `hp-${get_ol_length(hp_item_obj,hp_i_i)}`, { 'is-small': match.csid != 1 }]"
                :key="ol_item_i" v-for="(ol_item,ol_item_i) in get_ol_list(hp_item_obj,hp_i_i)">
                <odd-column-item
                  :placeholder="ol_item.placeholder"
                  :n_s="standard_edition"
                  :column_ceil="get_ol_length(hp_item_obj)"
                  :odd_item_i="ol_item_i"
                  :match="match"
                  :odd_field="hp_item_obj"
                  :hl_hs="get_hl_hs(hp_item_obj)"
                  :invoke_source="invoke_source"
                />
              </div>
            </div>
          </div>
          <!-- 赛果精选列表 -->
          <div class="standard-odd-list row reslut-box" v-else  :class="{'f-child':standard_odd_status == 0,'r-child':standard_odd_status == 1}">
            <div class="odd-column-w w100" :class="[{ clounm2: ![1,4,11,14,16].includes(+match.csid) }, {'boxing':match.csid == 12 }]" :key="hp_i_i+''+standard_odd_status"
                v-for="(hp_item_obj,hp_i_i) in get_match_result_hp_list(standard_odd_status)">
              <!-- 足球 1，水球 16， 冰球 4, 手球 11，橄榄球 14 有三行 -->
              <div class="odd-wrap-min w50" :class="[`hp-${get_ol_length(hp_item_obj,hp_i_i)}`, { 'is-small': match.csid != 1 }]"
                  :key="ol_item_i" v-for="(ol_item,ol_item_i) in get_match_result_ol_list(hp_item_obj,hp_i_i)">
                <odd-column-item
                  :placeholder="ol_item.placeholder"
                  :n_s="standard_edition"
                  :column_ceil="get_ol_length(hp_item_obj)"
                  :odd_item_i="ol_item_i"
                  :match="match"
                  :odd_field="hp_item_obj"
                  :hl_hs="get_hl_hs(hp_item_obj)"
                  :invoke_source="invoke_source"
                />
              </div>
            </div>
          </div>
          <!-- 赛果精选列表 -->
        </div>
      </template>

      <!-- 标准版 特色组合 赔率组件 -->
      <template v-if="[11].includes(+lodash.get(current_tab_item, 'id'))">
        <div v-touch-swipe.mouse.right.left="odd_wrapper_pan"
          :class="['standard-odd-l-w featured-combination', { 'status3':standard_odd_status == 1 }]">
          <div :class="['odds-content', {'f-child':standard_odd_status == 0,'r-child':standard_odd_status == 1}]">
            <div class="item" v-for="(compose_data, index) in hps_compose_data()" :key="compose_data.chpid">
              <div :class="['title', { 'blue-color': standard_odd_status === 1 }]">{{ compose_data.title }}</div>
              <div class="odds-info">
                <div class="odd-column odd-wrap-min" v-for="(ol_item, ol_item_i) in get_compose_ol_data(compose_data)" :key="ol_item.hid">
                  <odd-column-item
                    :placeholder="ol_item.placeholder"
                    :n_s="standard_odd_status"
                    :ol_list_item="ol_item"
                    :match="match"
                    :odd_field="compose_data"
                    :hl_hs="get_hl_hs(compose_data)"
                    :current_tab_item="current_tab_item"
                    :invoke_source="invoke_source"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!--标准版 才有的样式 下划线 -->
      <div :class="['dir-standard row justify-center items-center', {'max-width': [11].includes(+lodash.get(current_tab_item, 'id'))} ]"
        v-show="get_hp_list(1).length && !show_newer_edition && !is_scroll_page">
        <div class="block" :class="{selected:standard_odd_status == 0}"></div>
        <div class="block" :class="{selected:standard_odd_status == 1}"></div>
      </div>
      <!--标准版 才有的样式  动态图方向箭头-->
      <template v-if="get_hp_list(1).length > 0 && !is_scroll_page">
        <img class="slide_icon slide_icon_l animate-effect" :src="slide_icon_0" alt="" v-if="is_show_scroll_dir(0)">
        <img class="slide_icon slide_icon_r animate-effect-r" :src="slide_icon_0" alt="" v-if="is_show_scroll_dir(1)">
      </template>
      <!-- <template v-else>
        <img class="slide_icon slide_icon_r animate-effect-r" :src="slide_icon_1" alt="" v-if="is_show_scroll_dir(1)">
        <img class="slide_icon slide_icon_l animate-effect" :src="slide_icon_1" alt="" v-if="is_show_scroll_dir(0)">
      </template> -->
    </template>
    <!-- 标准版 波胆玩法盘口赔率组件 -->
    <div v-else-if="[18].includes(+lodash.get(current_tab_item, 'id'))" class="correct_style">
      <!-- 波胆玩法 标题 -->
      <div class="correct_style_title">
        <div>
          <span>{{match.mhn}}</span>
          <span>{{ i18n_t('football_playing_way.full_time_draw')}}</span>
          <span>{{match.man}}</span>
        </div>
        <div>
          <span>{{match.mhn}}</span>
          <span>{{ i18n_t('football_playing_way.half_time_draw')}}</span>
          <span>{{match.man}}</span>
        </div>
      </div>
      <!-- 波胆玩法 盘口赔率 -->
      <div class="hps-bold-main-container">
        <div class="hps-bold-container" :key="hp_i+'hp_i_i_bold'" v-for="(hp_item,hp_i) of bold_all_list">
          <div class="hps-bold-other-left" :key="main_i+'main_i_bold'" v-for="(main_item,main_i) of get_bold_ol_list(hp_item,hp_i)">
            <div  v-for="(ol_item,ol_item_i) of main_item" :key="ol_item_i+'ol_item_i_bold'" :class="['odd-wrap-hps-bold-other', {hold_other:ol_item.otd == -1}]">
              <odd-column-item
                :placeholder="ol_item.placeholder"
                :n_s="standard_edition"
                :ol_list_item="ol_item"
                :match="match"
                :odd_field="hp_item"
                :hl_hs="get_hl_hs(hp_item)"
                :current_tab_item="current_tab_item"
                :invoke_source="invoke_source"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 标准版 5分钟 盘口赔率组件 -->
    <div v-else-if="[19].includes(+lodash.get(current_tab_item, 'id'))" class="five-minutes-to-play">
      <div class="odd-wrap-hps-bold-other"
           :key="ol_item_i_five+'ol_item_i_five'" v-for="(ol_item,ol_item_i_five) of get_five_minutes_ol_list(five_minutes_all_list)"
           :class="{
             lastBestTwoOddWraps:[1172,1192].includes(+lodash.get(ol_item, 'otd')),
             lastFiveOddWraps:[1173,1193].includes(+lodash.get(ol_item, 'otd')),
             second_half: lodash.get(ol_item, 'ot') === '46-50',
             kill_shot: lodash.get(ol_item, 'ot') === 'ClutchGoal' && lodash.get(ol_item, 'os') === 1,
             'ClutchGoal-os-3': lodash.get(ol_item, 'ot') === 'ClutchGoal' && [1,2,7,10].includes(+match['ms']),
           }"
      >
        <odd-column-item
          :placeholder="ol_item.placeholder"
          :n_s="standard_edition"
          :ol_list_item="ol_item"
          :match="match"
          :odd_field="five_minutes_all_list"
          :hl_hs="get_hl_hs(five_minutes_all_list)"
          :current_tab_item="current_tab_item"
          :invoke_source="invoke_source"
        />
      </div>
      <!--  5分钟 图标  -->
      <div class="team-t-title-w" v-if="[1,3,5,7,8,9].includes(+match.csid) && lodash.size(lodash.get(five_minutes_all_list, 'hl[0].ol'))">
        <img @click="info_icon_click($event,match.mid)"
        class="img" :src="compute_img_url(show_tips?'icon-tips':'icon-tips-u')"
             >
        <span class="ellipsis">
          {{[1,2,7,10].includes(+match['ms']) ? i18n_t('football_playing_way.minutes_of_the_Xth_goal', {goalnr: minutes_of_the_Xth_goal}) : i18n_t('football_playing_way.any_goal')}}
        </span>
      </div>

    </div>

  </div>
</template>
 
<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import lodash from 'lodash'
import oddColumnItem from "./odd-column-item.vue";
import { slide_icon_0 } from 'src/base-h5/core/utils/local-image'
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { MenuData,compute_img_url ,UserCtr, compute_css_obj} from "src/output/index.js"
import PageSourceData  from  "src/core/page-source/page-source.js";
import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';

const emits = defineEmits(['on_update_standard'])

const props = defineProps({
  // 赛事信息
  match: Object,
  invoke_source: String,
  // 当前选中的小节玩法
  current_tab_item: {
    type: Object,
    default: {
      hps:[ {hl:[{}]} ],
      title:'',
      id: 0,
    }
  },
  hps: Array,
  // 特色组合数据,
  compose_hps: null,
  // 波胆玩法的数据
  bold_all_list: null,
  // 5分钟玩法的数据
  five_minutes_all_list: null,
  //精选列表
  selected_list:{
    type:Boolean,
    default:false
  }
});

const emitters = ref({})

// 罚牌玩法描述显示
const show_tips = ref(false);
const hp_item = ref({});
const hl_hs = ref(0);
const sport_convert = ref("");
// 0 在左 1 在右
const standard_odd_status = ref(PageSourceData.standard_odd_status);
// 简版投注项选中时角球标志
const show_lock_selected = ref(false);
// 简版投注项选中时角球标志
const index_show_map = ref({});

const get_n_s_changed_loaded = ref(true)

onMounted(() => {
  emitters.value = {
    emitter_2: useMittOn(MITT_TYPES.EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE, fapai_way_tips_status_change_h).off,
  }
});

// 左右tab切换也要计算赔率
// watch( () => props.hps, () => {
//   modify_overtime_status(PageSourceData.standard_odd_status.value);
// });

// 5分钟第X个进球时分tips文本提示
const minutes_of_the_Xth_goal = computed(() => {
  if (
    !(props.match.msc && Array.isArray(props.match.msc) && props.match.msc.length)
  ) {
    const suffix = lang.value === "en" ? "st" : "";
    return 1 + suffix;
  }

  const mscmap = new Map(
    props.match.msc.map((item) => [
      item.split("|")[0],
      item.split("|")[1].split(":"),
    ])
  );
  const [home = 0, away = 0] = mscmap.get("S1");
  const score = +home + +away + 1;
  let suffix = "";
  if (lang.value === "en") {
    if (score === 1) {
      suffix = "st";
    } else if (score === 2) {
      suffix = "nd";
    } else if (score === 3) {
      suffix = "rd";
    } else {
      suffix = "th";
    }
  }

  return score + suffix;
});

// 显示新手版
const show_newer_edition = computed(() => {
  return standard_edition.value == 1 || PageSourceData.page_source == "detail_match_list"
});

// 是否主动 滑动
const is_scroll_page = computed(() => {
  return [30].includes(props.current_tab_item.id)
})

// 特色组合玩法
const hps_compose_data = () => {
  const all_both = i18n_t('football_playing_way.all_both')
  const half_both = i18n_t('football_playing_way.half_both')
  const all_total_goal = i18n_t('football_playing_way.all_total_goal')
  const half_total_goal = i18n_t('football_playing_way.half_total_goal')

  // 全场默认
  const default_ol_0 = [
    { hl: [], title: all_both, hpid: 101 },
    { hl: [], title: all_total_goal, hpid: 13 },
  ]
  // 半场默认
  const default_ol_1 = [
    { hl: [], title: half_both, hpid: 105 },
    { hl: [], title: half_total_goal, hpid: 345 },
  ]
  const result = standard_odd_status.value === 0 ? default_ol_0 : default_ol_1
  const hps_data = lodash.cloneDeep(props.match.hpsCompose)
  if (!hps_data) return
  const length = lodash(hps_data, 'length', 0)
  if (length < 1) return result

  hps_data.forEach(t => {
    const flag = t && t.hl && t.hl.length > 0 && t.hl[0].ol && t.hl[0].ol.length > 0
    if (!flag) t.hl = [{}]
    if (standard_odd_status.value === 0) {
      // 全场
      if (+t.hpid === 13) t.title = all_total_goal
      // 是在左边  否在右边   后端不提供排序字段， 前端写死处理
      if (+t.hpid === 101) {
        t.title = all_both
        if (flag) {
          t.hl[0].ol.forEach(t => {
            if (+t.otd === 343) t.index = 1
            if (+t.otd === 344) t.index = 2
            if (+t.otd === 347) t.index = 3
            if (+t.otd === 348) t.index = 4
            if (+t.otd === 345) t.index = 5
            if (+t.otd === 346) t.index = 6
          })
          t.hl[0].ol = t.hl[0].ol.sort((a, b) => a.index - b.index)
        }
      }
      if ([13, 101].includes(+t.hpid)) {
        const index = result.findIndex(l => +l.hpid === +t.hpid)
        result.splice(index, 1, t)
      }
    } else {
      // 半场
      if (+t.hpid === 105) {
        t.title = half_both
        if (flag) {
          t.hl[0].ol.forEach(t => {
            if (+t.otd === 362) t.index = 1
            if (+t.otd === 363) t.index = 2
            if (+t.otd === 366) t.index = 3
            if (+t.otd === 367) t.index = 4
            if (+t.otd === 364) t.index = 5
            if (+t.otd === 365) t.index = 6
          })
          t.hl[0].ol = t.hl[0].ol.sort((a, b) => a.index - b.index)
        }
      }
      if (+t.hpid === 345) t.title = half_total_goal
      if ([345, 105].includes(+t.hpid)) {
        const index = result.findIndex(l => +l.hpid === +t.hpid)
        result.splice(index, 1, t)
      }
    }
  })
  if (result.length < 1) {
    return standard_odd_status.value === 0 ? [{hl: [{}], title: all_both}, {hl: [{}], title: all_total_goal}] : [{hl: [{}], title: half_both}, {hl: [{}], title: half_total_goal}] 
  }
  
  const result_data = standard_odd_status.value === 0 ? result.sort((a, b) => +b.hpid - +a.hpid) : result.sort((a, b) => +a.hpid - +b.hpid)
  return result_data
}

// 新手版赔率
const ol_list = computed(() => {
  // hpid 对应球类
  let sport_id_convert;
  const sport_id = +props.match.csid;
  switch (sport_id) {
    // 网球
    case 5:
      if (footer_sub_menu_id() == 1) {
        sport_id_convert = 153; //独赢
      } else if (footer_sub_menu_id() == 4) {
        sport_id_convert = 154; //让盘
      } else if (footer_sub_menu_id() == 2) {
        sport_id_convert = 169; // 大小
      } else if (footer_sub_menu_id() == 114) {
        sport_id_convert = 153; //角球变独赢
      }
      break;
    // 羽毛球
    case 10:
      if (footer_sub_menu_id() == 1) {
        sport_id_convert = 153; //独赢
      } else if (footer_sub_menu_id() == 4) {
        sport_id_convert = 172; //让盘
      } else if (footer_sub_menu_id() == 2) {
        sport_id_convert = 173; // 大小
      } else if (footer_sub_menu_id() == 114) {
        sport_id_convert = 153; //角球变独赢
      }
      break;
    case 8: // 乒乓球
    case 9: //排
    case 13: { // 沙滩排球
      if (footer_sub_menu_id() == 1) {
        sport_id_convert = 153;
      } else if (footer_sub_menu_id() == 4) {
        sport_id_convert = 172;
      } else if (footer_sub_menu_id() == 2) {
        sport_id_convert = 173;
      } else if (footer_sub_menu_id() == 114) {
        sport_id_convert = 153; //角球独赢
      }
      break;
    }
    // 斯诺克
    case 7:
      if (footer_sub_menu_id() == 1) {
        sport_id_convert = 153;
      } else if (footer_sub_menu_id() == 4) {
        sport_id_convert = 181;
      } else if (footer_sub_menu_id() == 2) {
        sport_id_convert = 182;
      } else if (footer_sub_menu_id() == 114) {
        sport_id_convert = 153; //角球独赢
      }
      break;
    // 篮球
    case 2:
    case 6: //美
      if (footer_sub_menu_id() == 1) {
        sport_id_convert = 37;
      } else if (footer_sub_menu_id() == 4) {
        sport_id_convert = 39;
      } else if (footer_sub_menu_id() == 2) {
        sport_id_convert = 38;
      } else if (footer_sub_menu_id() == 114) {
        sport_id_convert = 37; //角球独赢
      }
      break;
    // 足球
    case 1: // hpid 1(独赢) 4(让球) 2(大小) 114(角球)
      sport_id_convert = footer_sub_menu_id();
      break;
    // 3、4、6、9棒冰美排
    case 3: //棒
      if (footer_sub_menu_id() == 1) {
        sport_id_convert = 242;
      } else if (footer_sub_menu_id() == 4) {
        sport_id_convert = 243;
      } else if (footer_sub_menu_id() == 2) {
        sport_id_convert = 244;
      } else if (footer_sub_menu_id() == 114) {
        sport_id_convert = 242; //角球独赢
      }
      break;
    case 4: //冰
      sport_id_convert = footer_sub_menu_id();
      if (footer_sub_menu_id() == 114) {
        sport_id_convert = 1; //角球独赢
      }
      break;
    case 12: // 拳击
      if (footer_sub_menu_id() == 1) {
        sport_id_convert = 153;
      } else if (footer_sub_menu_id() == 2) {
        sport_id_convert = 2;
      }
      break;
    case 101: //电竞DOTA
    case 100: //电竞lol
    case 102: //CS GO
    case 103: //王者荣耀1
      if (footer_sub_menu_id() == 1) {
        sport_id_convert = 30001; //独赢
      } else if (footer_sub_menu_id() == 4) {
        sport_id_convert = 30002; //让盘
      } else if (footer_sub_menu_id() == 2) {
        sport_id_convert = 30003; // 大小
      } else if (footer_sub_menu_id() == 114) {
        sport_id_convert = 30001; //角球变独赢
      }
      break;
    default:
      sport_id_convert = footer_sub_menu_id();
      break;
  }

  // 赛果精选赛事
  if (PageSourceData.page_source == "detail_match_list") {
    switch (sport_id) {
      case 5:
        sport_id_convert = 154;
        break;
      case 10:
        sport_id_convert = 172;
        break;
      case 8:
        sport_id_convert = 172;
        break;
      case 7:
        sport_id_convert = 181;
        break;
      case 2:
        sport_id_convert = 39;
        break;
      case 1:
        sport_id_convert = 4;
        break;
      case 3:
        sport_id_convert = 243;
        break;
      case 4:
        sport_id_convert = 4;
        break;
      case 6:
        sport_id_convert = 39;
        break;
      case 9:
        sport_id_convert = 172;
        break;
    }
  }

  //足球加时阶段处理 手球
  if (sport_id == 1) {
    if ([32, 33, 41, 42].includes(+props.match.mmp)) {
      // hpid 1(独赢) 4(让球) 2(大小) 114(角球)
      if (footer_sub_menu_id() == 1) {
        sport_id_convert = 126;
      } else if (footer_sub_menu_id() == 4) {
        sport_id_convert = 128;
      } else if (footer_sub_menu_id() == 2) {
        sport_id_convert = 127;
      } else if (footer_sub_menu_id() == 114) {
        sport_id_convert = 114; //角球独赢
      }
    }
  }
  sport_convert.value = sport_id_convert;
  let found = props.match.hps
    ? props.match.hps.filter((item) => item.hpid == sport_id_convert)[0]
    : null;
  let ol_list_custom = [];
  if (found) {
    Object.assign(hp_item.value, found);
    if (!found.hl) return
    let f_hl_item = found.hl[0];
    if (found.hl && f_hl_item) {
      hl_hs.value = f_hl_item.hs;
      let ol_list = f_hl_item.ol;
      if (ol_list && ol_list.length) {
        //主胜,客胜,平变为主胜,平,客胜
        if (show_newer_edition.value) {
          if (ol_list.length == 3) {
            //只有三个投注项时才做此操作
            let found = lodash.findIndex(ol_list, (item) => item.ot == 2);
            if (found == 1) {
              let delted = f_hl_item.ol.splice(found, 1);
              f_hl_item.ol.push(delted[0]);
            }
          }
        }
        ol_list_custom = ol_list;
      } else {
        ol_list_custom = [];
      }
    }
  }
  return ol_list_custom;
});

// 根据调用方式获取赔率列表
const finally_ol_list = computed(() => {
  let data = [];
  if (!props.invoke_source) {
    data = props.match.hps;
  } else if (props.invoke_source == "attached" && props.hps && props.hps.length) {
    data = props.hps;
  }
  return data;
});

// 占位,填充三个空元素
const fill_empty_hps = (hpsArr) => {
  if ((hpsArr || []).length == 0) {
    return [{ hl: [{}] }, { hl: [{}] }, { hl: [{}] }];
  }
  return hpsArr;
};
// 特色组合玩法盘口
const get_compose_ol_data = (data) => {
  let ol_list = []
  if (data.hl && data.hl.length > 0) {
    ol_list = data.hl[0].ol
  }
  return ol_list && ol_list.length > 0 ? ol_list : [{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1}]
}
// 5分钟玩法
const get_five_minutes_ol_list = (data) => {
  // 前端 写死的格子，3行，一行6个格子
  let ol_list = [
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
    { placeholder: 1 },
  ];
  let ol = lodash.get(data, "hl[0].ol", []);
  let ol_len = 0;
  if (ol.length) {
    const mst = +props.match.mst;
    // 滚球阶段无绝杀投注项，最多为19个投注项, 非滚球阶段最多为20个投注项
    const ol_max_len = [1, 2, 7, 10].includes(+props.match.ms) ? 19 : 20;
    const placeholder_len = ol_max_len - ol.length;

    // 投注项格子补齐
    if (ol.length < ol_max_len) {
      for (let i = 0; i < placeholder_len; i++) {
        ol.unshift({ placeholder: 1 });
      }
    }
    // 25分钟前显示4行，25分钟(包含)后显示3行
    if (mst < 25 * 60) {
      ol_list = ol;
    } else {
      // 25分钟(包含)后显示3行,从第6个开始 截取
      ol_list = ol.slice(6);
    }
    for (let i = 0, list_len = ol.length; i < list_len; i++) {
      //  如果是特殊的无进球  或者   绝杀(补时) 球, 累加多少次出现
      if ([1172, 1192, 1173, 1193].includes(+ol[i].otd)) {
        ol_len++;
      }
    }
    // ol 的长度 减去 无进球 绝杀球 的次数，小于7个，前端手动填补格子
    if (ol.length - ol_len <= 6) {
      // 前端手动 填补 1行6列 的格子
      ol_list = [
        { placeholder: 1 },
        { placeholder: 1 },
        { placeholder: 1 },
        { placeholder: 1 },
        { placeholder: 1 },
        { placeholder: 1 },
      ].concat(ol_list);
    }
  }
  return ol_list;
};
// 罚牌玩法描述显示
const fapai_way_tips_status_change_h = (flag) => {
  show_tips.value = flag;
};
// 波胆玩法
// h获取 ol 投注项数组， otd 1  主队，  otd 0  平， otd 2  客队， otd -1  其它
const get_bold_ol_list = (data, index) => {
  // 默认3行 投注项
  let ol_list = [
    [{ placeholder: 1 }, { placeholder: 1 }, { placeholder: 1 }],
    [{ placeholder: 1 }, { placeholder: 1 }, { placeholder: 1 }],
    [{ placeholder: 1 }, { placeholder: 1 }, { placeholder: 1 }],
  ];

  let mapping = lodash.get(MatchResponsive.secondary_unfold_map.value, `${props.match.mid}`)
  let bodan_len = 0;
  if (mapping && mapping.split("-") && mapping.split("-")[2]) {
    
    bodan_len = mapping.split("-")[2] - 1;
  }
  if (lodash.get(data, "hl[0].ol")) {
    ol_list = data.hl[0].ol;
    let bold_left = [],
      bold_middle = [],
      bold_right = [],
      bold_other = []; // 其它
    for (let i = 0, list_len = ol_list.length; i < list_len; i++) {
      if (ol_list[i].otd == 1) {
        bold_left.push(ol_list[i]);
      } else if (ol_list[i].otd == 0) {
        bold_middle.push(ol_list[i]);
      } else if (ol_list[i].otd == 2) {
        bold_right.push(ol_list[i]);
      } else if (ol_list[i].otd == "-1") {
        bold_other.push(ol_list[i]);
      }
    }
    // 如果没有值，就负责个初始值
    function chect_array(arr) {
      if (arr.length === 0) {
        arr.push({
          placeholder: 1,
          otd: -1,
          os: 1,
        });
      }
    }
    chect_array(bold_other);
    let all_bold_list = [bold_left, bold_middle, bold_right];
    supplementary_spaces(all_bold_list.length, all_bold_list, bodan_len);
    // 最长数组的，再添加个 其它投注项
    all_bold_list[0].push(...bold_other);
    return all_bold_list;
  } else {
    // 如果总高度 大于 3行，则补充
    if (bodan_len > 3) {
      supplementary_spaces(ol_list.length, ol_list, bodan_len);
      ol_list[2].push({ placeholder: 1, otd: -1 });
    }
    return ol_list;
  }
};

// 波胆玩法补充 封盘空格
const supplementary_spaces = ( all_bold_list_length, all_bold_list, bodan_len ) => {
  for (let j = 0; j < all_bold_list_length; j++) {
    if (all_bold_list[j].length < bodan_len) {
      for (let x = all_bold_list[j].length; x < bodan_len; x++) {
        all_bold_list[j].push({ placeholder: 1 });
      }
    }
  }
};
// $event 时间对象 mid 赛事id
const info_icon_click = ($event, mid) => {
  useMittEmit(
    MITT_TYPES.EMIT_INFO_ICON_CLICK,
    {
      e: $event,
      mid,
      item: props.current_tab_item,
      match: props.match
    }
  );
};
/**
 * 显示横向滚动标识
 * @param {Number} dir 0 向左; 1 向右
 */
const is_show_scroll_dir = (dir) => {
  let have_2_part = get_hp_list(dir).length;
  if (!have_2_part) return false;
  // 增加水球csid：16 联合式橄榄球14 的显示
  if (dir == 0) {
    return standard_odd_status.value !== 1 && !show_newer_edition.value && [1, 7, 11, 16, 14].includes(+props.match.csid)
  } else if (dir == 1) {
    return standard_odd_status.value === 1 && !show_newer_edition.value && [1, 7, 11, 16, 14].includes(+props.match.csid)
  }
};
/**
 * 滑动赔率容器
 * @param {Number} type 0 第一部分; 1 第二部分
 * @return Undefined Undefined
 */
const odd_wrapper_pan = ({ direction }) => {
  if(!['left', 'right'].includes(direction)) return ;
  let status = 0;
  if (get_hp_list(1).length) {
    if (direction == "left") {
      status = 1;
    } else {
      status = 0;
    }
    MatchResponsive.set_is_http_update_info(true)
    PageSourceData.set_standard_odd_status(status)
    emits('on_update_standard', status)
    let timer = setTimeout(() => {
      MatchResponsive.set_is_http_update_info(false)
      clearTimeout(timer)
      timer = null
    }, 2000)
  }
};
/**
 * 获取hp指定部分
 * @param {Number} type 0 第一部分; 1 第二部分
 */
const get_hp_list = (type) => {
  let hps = [];
  if (type == 0 || is_scroll_page) {
    if (props.match && finally_ol_list.value) {
      if (props.match.csid == 12) {
        hps = finally_ol_list.value.slice(0, 2);
      } else {
        hps = finally_ol_list.value.slice(0, 3);
        for (let i = 3 - hps.length; i > 0; i--) {
          hps.push({
            hl: [{}],
          });
        }
      }
    }
  } else if (type == 1) {
    if (props.match && lodash.size(finally_ol_list.value) > 3) {
      if (props.match.csid == 12) {
        hps = finally_ol_list.value.slice(3, 5);
      } else {
        hps = finally_ol_list.value.slice(3, 6);
      }
    }
    // 特色组合
    if (props.current_tab_item && props.current_tab_item.id === 11) {
      hps = [ {hl:[{}]} ]
    }
  }
  return hps;
};
/**
 * 获取hp指定部分 精选列表专用
 * @param {Number} type 0 第一部分; 1 第二部分
 */
 const get_match_result_hp_list = (type) => {
  let hps = [];
  if (type == 0) {
    if (props.match && finally_ol_list.value) {
      if (props.match.csid == 12) {
        hps = finally_ol_list.value.slice(0, 1);
      } else {
        hps = finally_ol_list.value.slice(0, 1);
      }
    }
  } else if (type == 1) {
    if (props.match && lodash.size(finally_ol_list.value) > 3) {
      if (props.match.csid == 12) {
        hps = finally_ol_list.value.slice(0,1);
      } else {
        hps = finally_ol_list.value.slice(0, 1);
      }
    }
  }
  return hps;
};
/**
 * 获取投注项
 * @param {Object} hp_item
 * @param {Number} hp_i_i
 * @return Undefined Undefined
 */
 const get_match_result_ol_list = (hp_item, hp_i_i) => {
  // let ol_list = props.match.csid == 1 ? [{ placeholder: 1 }, { placeholder: 1 }, { placeholder: 1 }] : [{ placeholder: 1 }, { placeholder: 1 }];
  let ol_list = [1, 4, 11, 16,14].includes(+props.match.csid) ? [{ placeholder: 1 }, { placeholder: 1 }] : [{ placeholder: 1 }, { placeholder: 1 }];
  if (lodash.get(hp_item, "hl[0].ol")) {
    ol_list = hp_item.hl[0].ol;
  } else {
    // 次要玩法
    if (props.invoke_source == "attached") {
      //独赢与半场独赢
      if ([111, 119, 126, 129].includes(+hp_item.hpid)) {
        ol_list = [{ placeholder: 1 }, { placeholder: 1 }];
      }
    } else {
      if ([1, 4, 11, 16,14].includes(+props.match.csid)) {
        if (props.match.hps && props.match.hps[hp_i_i]) {
          if (props.match.hps[hp_i_i].hpid == 1) {
            ol_list = [
              { placeholder: 1 },
              { placeholder: 1 },
            ];
          }
        }
      }
    }
  }
  return ol_list;
};
// 获取hl的hs
const get_hl_hs = (hp_item_obj) => {
  let hs = 0;
  if (lodash.get(hp_item_obj, "hl[0]")) {
    hs = hp_item_obj.hl[0].hs;
  }
  return hs;
};
/**
 * 获取ol的 长度
 * @param {Number} hp_item_obj
 * @param {Number} hp_i_i
 * @return Undefined Undefined
 */
const get_ol_length = (hp_item_obj, hp_i_i) => {
  const id = lodash.get(props.current_tab_item, 'id')
  let ol_list = [];
  if (lodash.get(hp_item_obj, "hl[0].ol")) {
    ol_list = hp_item_obj.hl[0].ol;
    if (MenuData.get_menu_type() == 3000) {
      return 2;
    }
  } else {
    // 晋级
    if ([3, 30].includes(id)) return 2
    if ([1, 4, 11, 14, 16].includes(+props.match.csid)) {
      if (props.match.hps && props.match.hps[hp_i_i]) {
        if (props.match.hps[hp_i_i].hpid == 1) {
          return 3;
        }
      }
    }
    if ([1, 4, 11, 14, 16].includes(+props.match.csid) && hp_i_i == 0 && !lodash.get(props.match, "hps.length")) {
      return 3;
    }
  }
  return ol_list.length;
};
/**
 * 获取投注项
 * @param {Object} hp_item
 * @param {Number} hp_i_i
 * @return Undefined Undefined
 */
const get_ol_list = (hp_item, hp_i_i) => {
  // let ol_list = props.match.csid == 1 ? [{ placeholder: 1 }, { placeholder: 1 }, { placeholder: 1 }] : [{ placeholder: 1 }, { placeholder: 1 }];
  let ol_list = [1, 4, 11, 16,14].includes(+props.match.csid) ? [{ placeholder: 1 }, { placeholder: 1 }, { placeholder: 1 }] : [{ placeholder: 1 }, { placeholder: 1 }];
  if (lodash.get(hp_item, "hl[0].ol")) {
    ol_list = hp_item.hl[0].ol;
  } else {
    // 次要玩法
    if (props.invoke_source == "attached") {
      //独赢与半场独赢
      if ([111, 119, 126, 129].includes(+hp_item.hpid)) {
        ol_list = [{ placeholder: 1 }, { placeholder: 1 }, { placeholder: 1 }];
      }
    } else {
      if ([1, 4, 11, 16,14].includes(+props.match.csid)) {
        if (props.match.hps && props.match.hps[hp_i_i]) {
          if (props.match.hps[hp_i_i].hpid == 1) {
            ol_list = [
              { placeholder: 1 },
              { placeholder: 1 },
              { placeholder: 1 },
            ];
          }
        }
      }
    }
  }
  return ol_list;
};
// 简版投注项选中时角球标志
const select_column_change_handle = ($event) => {
  index_show_map.value[$event.i] = $event.flag;
  let flag = false;
  Object.keys(index_show_map.value).forEach((key) => {
    if (index_show_map.value[key]) {
      flag = true;
    }
  });
  if (flag) {
    flag = footer_sub_menu_id() == 114;
  }
  show_lock_selected.value = flag;
};
// 如果是在子玩法中,数据不足6条
const modify_overtime_status = (status) => {
  // 如果第二页为空 则取第一页
  if (status == 1 && get_hp_list(1).length == 0) {
    standard_odd_status.value = 0;
    PageSourceData.set_standard_odd_status(0)
  } else {
    PageSourceData.set_standard_odd_status(1)
  }
};
/**
 * 显示三个投注项
 * @param Undefined Undefined
 * @return Undefined Undefined
 */
const show_3_space = () => {
  let r = false;
  if (footer_sub_menu_id() == 1) {
    r = [1, 4, 11, 16, 14].includes(props.match.csid * 1);
  }
  if (PageSourceData.page_source == "detail_match_list") {
    r = false;
  }
  
  return r;
};

const footer_sub_menu_id = () => {
  return MenuData.get_footer_sub_menu_id()
}

onUnmounted(() => {
  Object.values(emitters.value).map((x) => x())
});
</script>
 
<style scoped lang="scss">

.correct_style{
  .correct_style_title{
    display: flex;
    position: relative;
    gap: 5px;
    >div{
      display: flex;
      flex: 1;
      flex-shrink: 0;
      overflow: hidden;
      // gap: 4px;
      >span{
        flex: 1;
        font-size: 10px;
        color: var(--q-gb-t-c-18);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      }
      &:nth-child(1){
      }
    }
  }
  //  波胆 容器
  .hps-bold-main-container{
    display: flex;
    gap: 5px;
    .hps-bold-container {
      width: 100%;
      height: 100%;
      display: flex;
      gap: 0.04rem;
      flex-wrap: nowrap;
      .hps-bold-other-left{
        width: 0.56rem;
        flex-shrink: 0;
        position: relative;
        &:last-child{
          margin-right: unset;
          .odd-wrap-hps-bold-other {
            &.hold_other{
              position: absolute;
              left: unset;
              right: 0;
              width: 1.76rem;
              z-index: 1000;
            }
          }
        }
        .odd-wrap-hps-bold-other {
          height: 0.3rem;
          overflow: hidden;
          border-radius: 0.02rem;
          margin-bottom: .02rem;
          background-color: var(--q-color-page-bg-color-9);
          &.hold_other{
            position: relative;
            width: 1.76rem;
            z-index: 1000;
          }
          :deep(.odd-column-item){
            width: 100%;
            &.mred{
              background: var(--q-color-page-bg-color-97);
              border: 1px solid var(--q-color-com-border-color-14);
              border-radius: 2px;
            }
            &.mgreen{
              background: var(--q-color-page-bg-color-98);
              border: 1px solid var(--q-color-com-border-color-15);
              border-radius: 2px;
            }
            .odd-title{
              font-size: .1rem;
              margin-bottom: unset;
              color: #179cff;
            }
            .odd-value{
              color: var(--q-gb-t-c-18);
              &.red{
                color: var(--q-color-com-fs-color-17) !important;
              }
              &.green{
                color: var(--q-color-com-fs-color-10) !important;
              }
            }
          }
        }
      }
    }
  }
}
.five-minutes-to-play{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .team-t-title-w {
    width: 1.1rem;
    height: 0.3rem;
    margin-bottom: 0.02rem;
    font-size: 0.12rem;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    color: var(--q-gb-t-c-13)!important;
    img {
      display: block;
      margin-bottom: 0.02rem;
      margin-right: .05rem;
    }
    .team-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 1.07rem;
    }
  }
    .odd-wrap-hps-bold-other {
      width: 0.56rem;
      height: 0.3rem;
      overflow: hidden;
      border-radius: 0.02rem;
      margin-bottom: .02rem;
      margin-right: .02rem;
      background-color: var(--q-color-page-bg-color-9);
      &.hold_other{
       
      }
      &:nth-child(6n){
        margin-right: unset;
      }
      &.lastBestTwoOddWraps{
        position: absolute;
        right: 1.165rem;
        bottom: 0;
        width: 1.14rem;
        margin-right: 0;
      }
      &.lastFiveOddWraps{
        position: absolute;
        right: 0;
        bottom: 0;
        width: 1.14rem;
        margin-right: 0;
      }
      &.second_half, &.kill_shot {
        :deep(.odd-title) {
          display: inline-block;
          white-space: nowrap;
          transform: scale(0.9);
        }
      }
      &.ClutchGoal-os-3 {
        :deep(.item-inner) {
          display: none;
        }
      }
      :deep(.odd-column-item){
        flex: unset!important;
        width: 100%;
        &.mred{
          background: var(--q-color-page-bg-color-97);
          border: 1px solid var(--q-color-com-border-color-14);
          border-radius: 2px;
        }
        &.mgreen{
          background: var(--q-color-page-bg-color-98);
          border: 1px solid var(--q-color-com-border-color-15);
          border-radius: 2px;
        }
        .odd-title{
          font-size: .1rem;
          margin-bottom: unset;
          color:var(--q-gb-t-c-13);
        }
        .odd-value{
          color: var(--q-gb-t-c-4);
          &.red{
            color: var(--q-color-com-fs-color-17) !important;
          }
          &.green{
            color: var(--q-color-com-fs-color-10) !important;
          }
        }
      }
    }
}

@keyframes dir_remind_animate {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  60% {
    transform: translateX(-0.06rem);
    opacity: 1;
  }
  100% {
    transform: translateX(-0.09rem);
    opacity: 0;
  }
}

@keyframes dir_right_remind_animate {
  0% {
    transform: translateX(-0.09rem) rotate(180deg);
    opacity: 0;
  }
  60% {
    transform: translateX(-0.06rem) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: translateX(0) rotate(180deg);
    opacity: 0;
  }
}

.odd-list-wrap {
  position: relative;
  flex-shrink: 0;
  width: 100%;

  &.standard {
    width: 1.84rem;
    height: 1.07rem;
    flex-wrap: nowrap;
    overflow: hidden;
  }
  &.special_play{
    width: 100%;
    height: unset;
    overflow: unset;
    //padding-bottom: .31rem;
  }
  &.five_special_play{
    width: 100%;
    height: unset;
    padding-bottom: .32rem;
  }
  &.five_no_data{
    padding-bottom: unset;
  }
  &.compose_play{
    padding-bottom: 0;
    .slide_icon {
      top: 0.72rem;
    }
  }

  .slide_icon {
    width: 0.12rem;
    height: 0.12rem;
    position: absolute;
    top: 0.43rem;
    right: -0.03rem;

    &.animate-effect {
      animation: dir_remind_animate cubic-bezier(0.49, 0.49, 0.61, 0.59) 1.4s infinite;
    }

    &.animate-effect-r {
      animation: dir_right_remind_animate cubic-bezier(0.49, 0.49, 0.61, 0.59) 1.4s infinite;
    }
  }

  .odd-list-container {
    width: 1.7rem;
    height: 0.56rem;
    border-radius: 0.06rem;
    position: relative;
    overflow: hidden;

    .icon-jiaoqiu {
      width: 0.255rem;
      height: 0.255rem;
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      z-index: 1;

      &.selected {
        z-index: 2;
        display: block;
      }
    }
  }

  .standard-odd-l-w {
    height: 1.01rem;
    touch-action: pan-y !important;
    width: 3.68rem;
    flex-shrink: 0;
    position: relative;
    left: 0;
    display: flex;
    transition: transform 0.2s;
    -webkit-transition: transform 0.2s;
    overflow: hidden;

    &.status2 {
      -webkit-transform: translateX(-1.7rem);
      transform: translateX(-1.7rem);
    }
    &.status3{
      -webkit-transform: translateX(-3.6rem);
      transform: translateX(-3.6rem);
    }
    &.featured-combination{
      width: 200%;
      height: 1.4rem;
      position: relative;
      .odds-content{
        position: absolute;
        // width: 3.6rem;
        width: 50%;
        display: grid;
        grid-column-gap: 0.08rem;
        grid-template-columns: repeat(2, 50%);
        grid-template-rows: repeat(1, 1.23rem);
        &.f-child {
          left: 0;
        }
        &.r-child {
          right: 0.0085rem;
        }
        > .item {
          text-align: center;
          .title{
            margin-bottom: 0.08rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.blue-color{
              color: var(--q-color-fs-color-135);
            }
          }
          .odds-info{
            display: grid;
            gap: 0.02rem;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 0.35rem);
            .odd-column{
              overflow: hidden;
              border-radius: 0.02rem;
              background-color: var(--q-color-page-bg-color-9)
            }
          }
        }
      }
      &.status3{
        transform: translateX(-50%);
      }
    }
    &.is_no_scroll{
      transform: translateX(0) !important;
      .r-child{
        left: 0
      }
    }
  }

  .dir-standard {
    width: 1.8rem;
    position: absolute;
    bottom: 1px;

    .block {
      width:4px;
      height: 0.02rem;
      background: var(--q-gb-bd-c-16)!important;
      border-radius: 0.01rem;
      &.selected {
        width: 8px;
        background:  var(--q-gb-bd-c-17) !important;
      }

      &:last-child {
        margin-left: 0.04rem;
      }
    }
    &.max-width{
      width: 100%;
    }
  }

  .standard-odd-list {
    width: 1.84rem;
    flex-shrink: 0;
    position: absolute;
    height: 100%;

    &.f-child {
      left: 0;
    }

    &.r-child {
      right: 0.14rem;
    }

    .odd-wrap-min {
      width: 0.6rem;
      height: 0.32rem;
      overflow: hidden;
      border-radius: 0.02rem;
      margin-bottom: 0.02rem;
      color: var(--q-gb-t-c-18);

      &.hp-2, &.hp-0 {
        height: 0.49rem;
      }
      &.hp-3{
        :deep(.odd-title){
          margin-bottom: 0.01rem;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }

      &.column2 {
        height: 0.46rem;
      }
      &.is-small{
        // height: 0.32rem;
        :deep(.odd-title) {
          font-size: 0.1rem;
          &.standard {
            margin-bottom: 0;
          }

          &.three {
            font-size: 0.1rem;
          }
        }
      }
    }

    .odd-column-w {
      margin-left: 0.02rem;
      height: 100%;

      &:first-child {
        margin-left: 0;
      }

      &.boxing {
        .odd-wrap-min {
          width: 0.91rem;
        }
      }
      &.clounm2{
        .odd-wrap-min{
          height: 0.36rem;
        }
      }
    }
  }
}
.reslut-box{
  height: 70% !important;
  .w100{
  width: 100%;
  display: flex;
  gap: 5px;
  .w50{
    width: 50% !important;
    height: 90% !important;
    :deep(.odd-column-item2){
      background: var(--q-gb-bg-c-28) ;
    }
  }
}
}

</style>