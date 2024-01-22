<!--
 * @Description: 投注项列表 112 20 20 25
-->
<template>
  <div class="odd-list-wrap"
       :class="{
          standard: !show_newer_edition,
          special_play: [18].includes(+ lodash.get(current_tab_item, 'id')),
          five_special_play: lodash.get(current_tab_item, 'id') === 19,
          five_no_data: !lodash.size(lodash.get(five_minutes_all_list, 'hl[0].ol'))
       }
      ">
    <!--新手版-->
    <div class="odd-list-container flex" v-if="show_newer_edition">
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
      <div v-if="!show_newer_edition && get_n_s_changed_loaded" v-touch-swipe.mouse.right.left.passive="odd_wrapper_pan"
        :class="['standard-odd-l-w',{'status2':standard_odd_status == 1}]" >
        <!--标准版-->
        <div class="standard-odd-list row"  :class="{'f-child':standard_odd_status == 0,'r-child':standard_odd_status == 1}">
          <div class="odd-column-w" :key="hp_i_i+''+standard_odd_status" :class="{'boxing':match.csid == 12 } "
               v-for="(hp_item_obj,hp_i_i) in fill_empty_hps(get_hp_list(standard_odd_status))">
            <div class="odd-wrap-min" :class="`hp-${get_ol_length(hp_item_obj,hp_i_i)}`"
                :key="ol_item_i" v-for="(ol_item,ol_item_i) in get_ol_list(hp_item_obj,hp_i_i)">
              <odd-column-item
                :placeholder="ol_item.placeholder"
                :n_s="standard_edition"
                :column_ceil="get_ol_length(hp_item_obj)"
                :odd_item_i="ol_item_i"
                :match="match"
                :odd_field="hp_item_obj"
                :hl_hs="get_hl_hs(hp_item_obj)"
              />
            </div>
          </div>
        </div>
      </div>
      <!--标准版 才有的样式 下划线 -->
      <div class="dir-standard row justify-center items-center"
        v-show="get_hp_list(1).length && !show_newer_edition">
        <div class="block" :class="{selected:standard_odd_status == 0}"></div>
        <div class="block" :class="{selected:standard_odd_status == 1}"></div>
      </div>
      <!--标准版 才有的样式  动态图方向箭头-->
      <template v-if="theme && theme.includes('theme-2')">
        <!-- <i class="slide_icon slide_icon_l animate-effect" v-if="is_show_scroll_dir(0)"></i> -->
        <img class="slide_icon slide_icon_l animate-effect" :src="slide_icon_0" alt="" v-if="is_show_scroll_dir(0)">
        <!-- <i class="slide_icon slide_icon_r animate-effect-r" v-if="is_show_scroll_dir(1)"></i> -->
        <img class="slide_icon slide_icon_r animate-effect-r" :src="slide_icon_0" alt="" v-if="is_show_scroll_dir(1)">
      </template>
      <template v-else>
        <img class="slide_icon slide_icon_r animate-effect-r" :src="slide_icon_1" alt="" v-if="is_show_scroll_dir(0)">
        <img class="slide_icon slide_icon_l animate-effect" :src="slide_icon_1" alt="" v-if="is_show_scroll_dir(1)">
        <!-- <i class="slide_icon slide_icon_l animate-effect" v-if="is_show_scroll_dir(0)"></i>
        <i class="slide_icon slide_icon_r animate-effect-r" v-if="is_show_scroll_dir(1)"></i> -->
      </template>
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
            <div class="odd-wrap-hps-bold-other"
                 :key="ol_item_i+'ol_item_i_bold'"
                 v-for="(ol_item,ol_item_i) of main_item"
                 :class="{hold_other:ol_item.otd == -1}"
            >
              <odd-column-item
                :placeholder="ol_item.placeholder"
                :n_s="standard_edition"
                :ol_list_item="ol_item"
                :match="match"
                :odd_field="hp_item"
                :hl_hs="get_hl_hs(hp_item)"
                :current_tab_item="current_tab_item"
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
import store from "src/store-redux/index.js"
import lodash from 'lodash'
import oddColumnItem from "./odd-column-item.vue";
import { img1, img2, img3, img4, Y0_img_white, slide_icon_0, slide_icon_1 } from 'src/base-h5/core/utils/local-image'
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { MenuData,compute_img_url ,UserCtr, compute_css_obj} from "src/output/index.js"
import PageSourceData  from  "src/core/page-source/page-source.js";
import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'

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
  // 波胆玩法的数据
  bold_all_list: null,
  // 5分钟玩法的数据
  five_minutes_all_list: null,
});

const store_state = store.getState()
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
const screen_changing_timer = ref(0);

const get_bet_list = ref(store_state.get_bet_list)
const get_n_s_changed_loaded = ref(true)
const get_secondary_unfold_map = ref(store_state.get_secondary_unfold_map)

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
  get_bet_list.value = new_state.get_bet_list
  get_secondary_unfold_map.value = new_state.get_secondary_unfold_map
})

onMounted(() => {
  emitters.value = {
    emitter_2: useMittOn(MITT_TYPES.EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE, fapai_way_tips_status_change_h).off,
  }
});

// 左右tab切换也要计算赔率
watch( () => props.hps, (status) => {
  modify_overtime_status(PageSourceData.standard_odd_status.value);
});

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



// 新手版赔率
const ol_list = computed(() => {
  // hpid 对应球类
  let sport_id_convert;
  const sport_id = Number(props.match.csid);
  switch (sport_id) {
    // 网球
    case 5:
      if (MenuData.get_footer_sub_menu_id() == 1) {
        sport_id_convert = 153; //独赢
      } else if (MenuData.get_footer_sub_menu_id() == 4) {
        sport_id_convert = 154; //让盘
      } else if (MenuData.get_footer_sub_menu_id() == 2) {
        sport_id_convert = 169; // 大小
      } else if (MenuData.get_footer_sub_menu_id() == 114) {
        sport_id_convert = 153; //角球变独赢
      }
      break;
    // 羽毛球
    case 10:
      if (MenuData.get_footer_sub_menu_id() == 1) {
        sport_id_convert = 153; //独赢
      } else if (MenuData.get_footer_sub_menu_id() == 4) {
        sport_id_convert = 172; //让盘
      } else if (MenuData.get_footer_sub_menu_id() == 2) {
        sport_id_convert = 173; // 大小
      } else if (MenuData.get_footer_sub_menu_id() == 114) {
        sport_id_convert = 153; //角球变独赢
      }
      break;
    case 8: // 乒乓球
    case 9: //排
    case 13: { // 沙滩排球
      if (MenuData.get_footer_sub_menu_id() == 1) {
        sport_id_convert = 153;
      } else if (MenuData.get_footer_sub_menu_id() == 4) {
        sport_id_convert = 172;
      } else if (MenuData.get_footer_sub_menu_id() == 2) {
        sport_id_convert = 173;
      } else if (MenuData.get_footer_sub_menu_id() == 114) {
        sport_id_convert = 153; //角球独赢
      }
      break;
    }
    // 斯诺克
    case 7:
      if (MenuData.get_footer_sub_menu_id() == 1) {
        sport_id_convert = 153;
      } else if (MenuData.get_footer_sub_menu_id() == 4) {
        sport_id_convert = 181;
      } else if (MenuData.get_footer_sub_menu_id() == 2) {
        sport_id_convert = 182;
      } else if (MenuData.get_footer_sub_menu_id() == 114) {
        sport_id_convert = 153; //角球独赢
      }
      break;
    // 篮球
    case 2:
    case 6: //美
      if (MenuData.get_footer_sub_menu_id() == 1) {
        sport_id_convert = 37;
      } else if (MenuData.get_footer_sub_menu_id() == 4) {
        sport_id_convert = 39;
      } else if (MenuData.get_footer_sub_menu_id() == 2) {
        sport_id_convert = 38;
      } else if (MenuData.get_footer_sub_menu_id() == 114) {
        sport_id_convert = 37; //角球独赢
      }
      break;
    // 足球
    case 1: // hpid 1(独赢) 4(让球) 2(大小) 114(角球)
      sport_id_convert = MenuData.footer_sub_menu_id;
      break;
    // 3、4、6、9棒冰美排
    case 3: //棒
      if (MenuData.get_footer_sub_menu_id() == 1) {
        sport_id_convert = 242;
      } else if (MenuData.get_footer_sub_menu_id() == 4) {
        sport_id_convert = 243;
      } else if (MenuData.get_footer_sub_menu_id() == 2) {
        sport_id_convert = 244;
      } else if (MenuData.get_footer_sub_menu_id() == 114) {
        sport_id_convert = 242; //角球独赢
      }
      break;
    case 4: //冰
      sport_id_convert = MenuData.footer_sub_menu_id;
      if (MenuData.get_footer_sub_menu_id() == 114) {
        sport_id_convert = 1; //角球独赢
      }
      break;
    case 12: // 拳击
      if (MenuData.get_footer_sub_menu_id() == 1) {
        sport_id_convert = 153;
      } else if (MenuData.get_footer_sub_menu_id() == 2) {
        sport_id_convert = 2;
      }
      break;
    case 101: //电竞DOTA
    case 100: //电竞lol
    case 102: //CS GO
    case 103: //王者荣耀1
      if (MenuData.get_footer_sub_menu_id() == 1) {
        sport_id_convert = 30001; //独赢
      } else if (MenuData.get_footer_sub_menu_id() == 4) {
        sport_id_convert = 30002; //让盘
      } else if (MenuData.get_footer_sub_menu_id() == 2) {
        sport_id_convert = 30003; // 大小
      } else if (MenuData.get_footer_sub_menu_id() == 114) {
        sport_id_convert = 30001; //角球变独赢
      }
      break;
    default:
      sport_id_convert = MenuData.footer_sub_menu_id;
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
      if (MenuData.get_footer_sub_menu_id() == 1) {
        sport_id_convert = 126;
      } else if (MenuData.get_footer_sub_menu_id() == 4) {
        sport_id_convert = 128;
      } else if (MenuData.get_footer_sub_menu_id() == 2) {
        sport_id_convert = 127;
      } else if (MenuData.get_footer_sub_menu_id() == 114) {
        sport_id_convert = 114; //角球独赢
      }
    }
  }
  sport_convert.value = sport_id_convert;
  let found = props.match.hps
    ? props.match.hps.filter((item) => item.hpid == sport_id_convert)[0]
    : null;
  let ol_list_custom = [];

  // console.log('valuevaluevaluevaluevaluevaluevalue', found)
  if (found) {
    Object.assign(hp_item.value, found);
    // console.log('hp_item.valuehp_item.valuehp_item.value', hp_item.value)
    if (!found.hl) return
    let f_hl_item = found.hl[0];
    console.log('hp_item.valuehp_item.valuehp_item.value', f_hl_item)
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
  let mapping = get_secondary_unfold_map[props.match.mid];
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
const supplementary_spaces = (
  all_bold_list_length,
  all_bold_list,
  bodan_len
) => {
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
  let have_2_part = get_hp_list(1).length;
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
  let status = 0;
  if (get_hp_list(1).length) {
    if (direction == "left") {
      status = 1;
    } else {
      status = 0;
    }
    PageSourceData.set_standard_odd_status(status)
  }
};
/**
 * 获取hp指定部分
 * @param {Number} type 0 第一部分; 1 第二部分
 */
const get_hp_list = (type) => {
  let hps = [];
  if (type == 0) {
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
  }
  return hps;
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
  let ol_list = [];
  if (lodash.get(hp_item_obj, "hl[0].ol")) {
    ol_list = hp_item_obj.hl[0].ol;
    if (MenuData.get_menu_type() == 3000) {
      return 2;
    }
  } else {
    if ([1, 4, 11, 16].includes(+props.match.csid)) {
      if (props.match.hps && props.match.hps[hp_i_i]) {
        if (props.match.hps[hp_i_i].hpid == 1) {
          return 3;
        }
      }
    }
    if (
      [1].includes(+props.match.csid) &&
      hp_i_i == 0 &&
      !lodash.get(props.match, "hps.length")
    ) {
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
  let ol_list = [{ placeholder: 1 }, { placeholder: 1 }, { placeholder: 1 }];
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
      if ([1, 4, 11, 16].includes(+props.match.csid)) {
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
    flag = MenuData.get_footer_sub_menu_id() == 114;
  }
  show_lock_selected.value = flag;
};
// 如果是在子玩法中,数据不足6条
const modify_overtime_status = (vuex_status) => {
  // 如果第二页为空 则取第一页
  if (vuex_status == 1 && get_hp_list(1).length == 0) {
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
  if (MenuData.footer_sub_menu_id == 1) {
    r = [1, 4, 11, 16].includes(props.match.csid * 1);
  }
  if (PageSourceData.page_source == "detail_match_list") {
    r = false;
  }
  return r;
};

onUnmounted(() => {
  unsubscribe()
  Object.values(emitters.value).map((x) => x())
});
</script>
 
<style scoped lang="scss">
@import "../styles/odd-list-wrap";
</style>/index.js