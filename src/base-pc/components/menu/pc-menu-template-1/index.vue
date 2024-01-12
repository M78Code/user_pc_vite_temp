<template>
  <div class="c-menu-sports menu-border">
    <div class="header relative-position">
      <!--   体育菜单-->
      <div class="menu-item menu-top menu-item-title disable-hover">
        {{ i18n_t('common.menu_title') }}
        <!-- <span @click="send_user">user</span> <span @click="send_vr">vr</span> <span @click="send_menu">菜单</span> -->
      </div>
      <!--   今日、早盘、 -->
      <div class="menu-item menu-tab disable-hover double">
        <div class="item yb-flex-center" :style="compute_css_obj(`today_menu_bg_1${!MenuData.is_zaopan() ? '_active' : ''}`)" :class="!MenuData.is_zaopan() ? 'active' : ''"
          @click="handle_click_jinri_zaopan(2,'click')">
          {{ i18n_t("menu.match_today") }}
        </div>
        <div class="item yb-flex-center" :style="compute_css_obj(`today_menu_bg_1${MenuData.is_zaopan() ? '_active' : ''}`)" :class="MenuData.is_zaopan() ? 'active' : ''"
          @click="handle_click_jinri_zaopan(3,'click')">
          {{ i18n_t("menu.match_early") }}
        </div>
      </div>
    </div>
    
    <div v-show="false">{{ BaseData.base_data_version }}-{{MenuData.menu_data_version}}</div>
    <div class="menu-wap-nav">
      <div v-for="item in (MenuData.left_menu_list || [] )" :key="`_${item.mi}`" :class="set_vr_or_guanjun_border(item.mi)">
        <!--   赛种-->
        <!-- {{ BaseData.filterSport_arr }} -- {{ BaseData.compute_sport_id(item) }} -->
        <div class="menu-item menu-fold1 search" :class="current_lv_1_mi == item.mi? 'y-active' : ''" @click="lev_1_click(item)" v-if="item.ct">
          <!-- icon -->
          <div class="row items-center">
            <span class="soprts_id_icon"
              :style="compute_css_obj({key:current_lv_1_mi == item.mi?'pc-left-menu-bg-active-image':'pc-left-menu-bg-image', position: `item_${BaseData.compute_sport_id(item.mif|| item.mi)}` })"
              :alt="BaseData.menus_i18n_map[item.mif || item.mi]"></span>

          </div>
          <div class="items-right row" style="flex-wrap: wrap">
            <div style="line-height: 1; flex: 1">
              <span class="menu-text">
                <!-- 名字 {{ item }} -->
                {{ BaseData.menus_i18n_map[item.mif || item.mi] || "" }}
              </span>
            </div>
            <!-- 数字 显示    有些赛种不显示 -->
            <div class="col-right" style="min-width: 40px">
              <!-- 有滚球赛事  hl 今日&&存在滚球赛事时  展示live图标 -->
              <div class="live-text" :style="compute_css_obj('live_text')" v-if="MenuData.is_today() && BaseData.mi_gunqiu.includes(item.mif)" />
              <span class="match-count yb-family-odds">{{ item.ct }}</span>
            </div>
          </div>
        </div>

        <!--  子菜单  ，  开始    -->
        <!--  子菜单  ， 冠军 不显示子菜单  -->
        <!--  常规体育 含 娱乐     子菜单  开始    -->
        <div class="menu-fold2-wrap  1" :class="current_lv_1_mi == item.mi && !show_menu ? 'open' : ''" v-if="item.mi != 400">
          <template v-for="item2 in item.sl" :key="`_${item.mi}_${item2.mi}_100`">
            <!--  常规赛种 （不含娱乐）  下的  玩法 （ 不含冠军 ）        开始   -->
            <div @click.stop="lev_2_click({ lv1_mi: item.mi, lv2_mi: item2.mi })" :class="MenuData?.get_lv2_mi_value() == item2.mi?'active':''" class="menu-item menu-fold2">
              <div class="row items-center relative-position">
                <span class="menu-point"></span>
                <span class="menu-text ellipsis">
                  <!-- 名字{{ item2.mi }}  -->
                  {{ BaseData.menus_i18n_map[item2.mi] || "" }}
                </span>
              </div>
              <div class="col-right relative-position" style="min-width: 40px">
                <span class="match-count yb-family-odds" v-if="item.mif != 2000">
                  {{ item2["ct"] }}</span>
              </div>
            </div>
            <!--  常规赛种 （不含娱乐）  下的  玩法 （ 不含冠军 ）        结束    -->
          </template>
        </div>
      </div>
    </div>
    <div class="box-line"></div>
  </div>
</template>
<script setup>
import { ref, watch,reactive,onMounted, onUnmounted,computed,nextTick } from "vue";
import { useRoute, useRouter } from 'vue-router'
// 菜单配置
import { MenuData } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import BaseData from "src/core/base-data/base-data.js"
import { compute_css_variables } from "src/core/css-var/index.js"
import { compute_css_obj } from 'src/core/server-img/index.js'
import { MITT_TYPES ,useMittOn} from "src/core/mitt/index.js";
import MenuItem from "./menu-item.vue";


const route = useRoute();
const router = useRouter();
const ref_data = reactive({
    emit_lsit:{}
})
const left_menu_list = ref(MenuData.left_menu_list||[])
// 当前的一级菜单ID
const current_lv_1_mi = ref(""); //"101",
// 当前的二级菜单ID
// const current_lv_2_mi = ref(""); //"101201", // 101301
// 当前赛种是否收起 状态
const show_menu = ref(true);
// 首次进入 刷新用
const first_change = ref(false);
/**
 * @description: 冠军 vr border 样式
 * @param {item} 赛种id
 * @return {undefined} undefined
 */
const set_vr_or_guanjun_border = computed(()=> item =>{
  // 菜单ID == 300 vr体育
  if(item == 300){
    return 'menu-b-border'
  }
  // 菜单ID 400 冠军
  if(item == 400){
    return 'menu-y-border'
  }
})

/**
 * @description: 今日 早盘 紧急开关
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const today_early = () => {
  const { lv2_mi, lv1_mi } = MenuData.left_menu_result;

  if (!BaseData.left_menu_base_mi_arr.includes(Number(lv1_mi))) {
    let params = {},
      mid_menu_show = { list_filter: true },
      has_mid_menu = true;
    params = {
      root: 1,
      lv1_mi: "",
      lv2_mi: 1,
      sports: "",
      guanjun: "",
    };
    // 设置左侧菜单输出
    MenuData.set_left_menu_result({
      ...params,
      mid_menu_show,
      has_mid_menu,
    });
  }
};
/**
 * @description: 电竞 vr 紧急开关
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const esports_vr_switch = () => {
  let params = {},
    mid_menu_show = { list_filter: true },
    has_mid_menu = true;
  // 电竞和 vr关闭后 需要跳转到滚球 (没有数据 也算是关)
  if (!BaseData.is_mi_2000_open || !BaseData.is_mi_300_open) {
    params = {
      root: 1,
      lv1_mi: "",
      lv2_mi: 1,
      sports: "",
      guanjun: "",
    };
  } else {
    let { lv2_mi, lv1_mi } = MenuData.left_menu_result;
    // 电竞 vr 部分关停

    // 判断 电竞 下面是否还有该 赛种
    if (MenuData.menu_root == 2000) {
      let esports =
        BaseData.dianjing_sublist.find((item) => item.mi == lv2_mi) ||
        {};
      if (esports.mi) {
        return;
      } else {
        params.lv2_mi = BaseData.dianjing_sublist[0].mi;
      }
    }
    // 判断 VR 下面是否还有该 赛种
    if (MenuData.menu_root == 300) {
      let vr_sports =
        BaseData.vr_mi_config.find((item) => item.menuId == lv2_mi) ||
        {};
      if (vr_sports.menuId) {
        return;
      } else {
        params.lv2_mi = BaseData.vr_mi_config[0].menuId;
      }
      return lv_2_click_wapper_4({ lv1_mi, lv2_mi: params.lv2_mi });
    }

    // 单个赛事关闭后
    params.root = MenuData.menu_root;
    params.lv1_mi = lv1_mi;
  }
  // 设置 中间 菜单输出
  MenuData.set_mid_menu_result(params);
  // 设置左侧菜单输出
  MenuData.set_left_menu_result({
    ...params,
    mid_menu_show,
    has_mid_menu,
  });
};

/**
 * @description: 一级菜单 点击 找到第一个有数的 菜单
 * @param {*} obj 一级菜单id
 * @return {*}
 */
const lev_1_click = async (obj) => {
  // show_menu 展开或者收起  收起是 true  展开是false
  // current_lv_1_mi 选中按钮  选中的情况下 点击一级菜单 收起或者展开
  // 收起的情况下 再次回来 还是收起 / 展开的情况下 再次回来还是展开
  // mif 赛种id
  // lv1_mi 新菜单id
  // lv2_mi 二级菜单id
  let mi = obj.mi
  let type = obj.mif || obj.mi
  // if(!MenuData.is_zaopan()){
  //   MenuData.set_menu_root(2)
  // }
  if (MenuData.is_today() || MenuData.is_zaopan()) {
    // 点击一级菜单
    if (current_lv_1_mi.value == mi) {
      // 一级菜单点击无效
      show_menu.value = !show_menu.value;
    } else {
      show_menu.value = false;
    }
  }

  // 今日 / 早盘 选中的情况下 点击无效
  if (( MenuData.is_today() || MenuData.is_zaopan() ) && current_lv_1_mi.value == mi) {
    return false;
  }

  // 获取具体的二级玩法
  if ( MenuData.is_today() || MenuData.is_zaopan())MenuData.set_post_menu_play_count(mi)

  current_lv_1_mi.value = mi
  // current_lv_2_mi.value = get_lv_1_lv_2_mi(mi)

  let mid_obj = {}
  let left_obj = {}
  let root = ''
  let d_value = 100

  if (type == 400) {
    // 设置 中间 菜单输出 
    // 冠军 全部 400
    mid_obj = {
      mi: '400'
    }

    //冠军  没有子菜单  直接点击 冠军足球 
    left_obj ={
      lv1_mi: 400,
      has_mid_menu: true,
    }
    // 设置为冠军
    root = 400

  } else if (type == 2000) {
    // 设置默认值
    root = 2000

    d_value = 2000

    // 设置左侧菜单
    left_obj = {
      lv1_mi: 2000,
      lv2_mi: 2100,
      has_mid_menu: true,
    }
    //电竞  直接点英雄联盟
    mid_obj = {
      mi: 2100,
      md: '', // 所有时间
    }

  } else if (type == 300) {
    // 1级 冠军和vr体育 点击后默认为早盘
    root = 300
    const res = await MenuData.get_vr_menu_list();
    if(res && res.length){
      // 设置左侧菜单
      left_obj = {
        lv1_mi: 300,
        lv2_mi: `3${res[0].menuId}`,
        has_mid_menu: true,
      }
      //电竞  直接点英雄联盟
      mid_obj = {
        mi: `3${res[0].menuId}`,
        tid: `${res[0].subList?.[0]?.field1}`, // 联赛
      }
    }
    
    
  } else if (type == 118) {
    // 娱乐只有冠军
    left_obj ={
      lv1_mi: 118,
      lv2_mi: '1184',
      has_mid_menu: true,
    }
    // 设置为冠军
    root = 400
    MenuData.set_current_ball_type(left_obj.lv1_mi - 100)
  } else {
    // 常规体育
    left_obj = {
      lv1_mi: mi,
      lv2_mi: get_lv_1_lv_2_mi(mi),
    }

    if(MenuData.is_zaopan()){
      // 早盘有中间菜单
      left_obj.has_mid_menu = true
      mid_obj = {
        md: ''
      }
    }
    MenuData.set_current_ball_type(left_obj.lv1_mi - 100)
  }

  // 今日 早盘不用设置 
  if(root){
    MenuData.set_menu_root(root)
  }
  // 不是列表页 点击列表菜单
  if(route.name != 'home'){
    router.push({name:'home'})
  }

  // 设置 左侧菜单
  MenuData.set_left_menu_result(left_obj)

  // 设置 中间菜单 
  // 今日没有中间菜单 需要清空
  MenuData.set_mid_menu_result(mid_obj)

  MenuData.is_today() && MenuData.set_menu_current_mi(left_obj.lv2_mi || "")

};
/**
 *   常规赛种 （不含娱乐）  下的  玩法 （ 不含冠军 ）     点击
 *
 * @param {*} detail
 */
const lev_2_click = (detail = {}) => {
  //当选择了近期开赛时间再点击其他球种时，需要置为全部
  let { lv1_mi, lv2_mi } = detail;
  // 设置左侧菜单
  let left_obj = {
    lv1_mi,
    lv2_mi
  }

  let mid_obj = {
    md: ''
  }

  // current_lv_2_mi.value = lv2_mi

  // 不是列表页 点击列表菜单
  if(route.name != 'home'){
    router.push({name:'home'})
  }

  MenuData.set_left_menu_result(left_obj)

  MenuData.set_mid_menu_result(mid_obj)

  MenuData.is_today() && MenuData.set_menu_current_mi(left_obj.lv2_mi)
};

/**
 * 详情页回首页
 */
const set_route_url = () => {
  let name = lodash.get(route,'name','')
  if (["details", "search", "video", "virtual_details"].includes(name)) {
    return true
  }
 return false
};
/**
 * 今日早盘按钮点击
 * @param {*} val
 */
const handle_click_jinri_zaopan = (val,type) => {
  
  MenuData.set_menu_root(val)

  let left_menu_config = {
    lv1_mi: `101${val}`,
    lv2_mi: get_lv_1_lv_2_mi(`101${val}`)
  }
  
  // 点击事件 走默认配置 
  // 非点击事件 走缓存逻辑
  if(!type){
    left_menu_config = lodash.get(MenuData,'left_menu_result',{}) || {}
  }
 
  let obj = {
    lv1_mi: left_menu_config.lv1_mi,
    lv2_mi: left_menu_config.lv2_mi,
    root: val
  }

  // mif 赛种id
  // lv1_mi 新菜单id
  // lv2_mi 二级菜单id
  current_lv_1_mi.value = obj.lv1_mi
  // current_lv_2_mi.value = obj.lv2_mi 

  MenuData.set_left_menu_result(obj)

  // 早盘还需要设置中间菜单
  if(MenuData.is_zaopan()){
    MenuData.set_mid_menu_result({md:""})
  }
  
  if(set_route_url()) return

  MenuData.set_menu_current_mi(obj.lv2_mi || "")
};

// 获取当前菜单下的二级菜单id
const get_lv_1_lv_2_mi = (mi) => {
  let lv2_mi = ''
  // 获取对应的菜单数据
  let left_list = lodash.get(MenuData,'left_menu_list',[]) || []
  let obj = left_list.find(item => item.mi == mi ) || {}

  if(obj.mi){
    // 获取菜单下的第一个菜单
    lv2_mi = lodash.get(obj,'sl[0].mi', '')
  }

  return lv2_mi
}
/**
 * 
 */
// watch(MenuData.menu_data_version,()=>{
//   const { left_menu_result } = MenuData;
//   if( current_menu.value?.mi!=left_menu_result.lv2_mi){
//     current_menu.value =
//       dianjing_sublist.value.find((item) => item.mi == left_menu_result.lv2_mi) ||
//       {};
//     sport_click(current_menu.value);
//   }
// })
/**
 * ws推送球种数量
 * @param {*} list 
 */
 const get_menu_ws_list = (list) =>{
  console.log("list",list)
    list = list.filter((item)=>{return item.mi});
    let wsList = left_menu_list.value.map((item)=>{
        list.forEach((n)=>{
            if(item.mi == n.mi){
                item.ct = n.count;
            }
            const index = item.sl?.findIndex((k)=>{
              return k.mi == n.mi;
            })
            if(index !== -1){
              item.sl[index].ct = n.count;
            }
        })
        return item;
    })
    left_menu_list.value = wsList;
}
onMounted(()=>{
  // 刷新后使用 MenuData中的数据 menuData 是存在sessionStorage的 不影响首次进入
  let menu_root = lodash.get(MenuData,'menu_root',2)
  handle_click_jinri_zaopan(menu_root)
  return
  ref_data.emit_lsit = {
      emitter_1: useMittOn(MITT_TYPES.EMIT_SET_BESE_MENU_COUNT_CHANGE, get_menu_ws_list).off,
  }
})
onUnmounted(()=>{
    Object.values(ref_data.emit_lsit).map((x) => x());
})
// 模拟推送
// const send_menu = () => {
//   BaseData.set_ws_send_new_menu_init()
// }
// const send_user = () => {
//   BaseData.set_ws_send_new_user_info_init()
// }
// const send_vr = () => {
//   BaseData.set_ws_send_new_vr_menu_init()
// }
</script>
<style lang="scss" scoped>
.box-line{
  width: 100%;
  height: 50px;
}
.c-main-menu {
  font-size: 13px;
  /* *** 头部 ************ -S */
  z-index: 211;
  width: 100%;



  /* *** 头部 ************ -E */
  .scroll-inner-wrap {
    margin-bottom: 10px;
  }

  /* *** 体育 ************ -S */
  .c-menu-sports {
    font-size: 13px;

    .menu-item {

     

      &.menu-tab {
        font-size: 13px;
        justify-content: space-around;
        padding: 0px;
        margin-bottom: 9px;

        .item {
          border-radius: 1000px;
          margin-right: 10px;
          white-space: nowrap;
          margin-right: 0!important;
          height: 30px!important;
          min-width: 90px;
          line-height: 30px;
          border: 0.5px solid #D7E1FD;
          box-shadow: 0px 3px 3px 0px rgba(0, 56, 98, 0.1) !important;
          background: var(--q-gb-bg-lg-4);          
          &:last-child {
            margin-right: 0;
          }

          &.active {
            font-weight: 600;
            font-size: 14px;
            color: var(--q-gb-t-c-18);
            background: var(--q-gb-bg-c-4);
          }

          &.active1 {
            margin-left: 152px;
          }
        }
      }
      &.menu-fold1{

        &.y-active{
          background: var(--q-gb-bg-lg-8);
          color: var(--q-gb-t-c-16); 
        }
        &:hover{
          background: var(--q-gb-bg-lg-9);
          color: var(--q-gb-t-c-16); 
        }
      }
      &.menu-fold2 {
        &.active{
          color: var(--q-gb-t-c-15); 
        }
      }

    }
    .menu-y-border{
      .menu-fold1{
        border-top:1px solid var(--q-gb-bd-c-8);
        border-bottom:1px solid var(--q-gb-bd-c-8);
        &.y-active{
          border: none;
        }
      }
     
      
    }
    .menu-b-border{
      .menu-fold1{
        border-bottom:1px solid var(--q-gb-bd-c-8);
        &.y-active{
          border: none;
        }
      }
     
    }
  }

  /* *** 体育 ************ -E */
  /* *** 公共 ************ -S */
  .menu-wrap {
    cursor: pointer;

    .no-click {
      cursor: auto;

      &:hover {
        background: none !important;
      }
    }

    .menu-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.active {
        font-weight: 700;
        border-bottom: 0;
      }

      .hot-icon {
        width: 14px;
        height: 14px;
        margin-right: 10px;
      }

      .menu-new-icon {
        margin: 0 0 3px 4px;
      }

      .match-count {
        padding-right: 15px;
        display: inline-block;
        width: 40px;
        text-align: right;
        max-width: 45px;
      }

      &.disable-hover {
        &:hover {
          background-color: transparent !important;
        }
      }

      &.menu-top {
        padding: 0 15px 0 16px;
        height: 40px;

        .match-count {
          padding-right: 0;
        }

        &.menu-virtual {
          .menu-name {
            margin-left: 10px;
          }
        }

        &.hot-menu {
          &:hover {
            background: none;
          }
        }

        &.item-bet {
          width: 200px;
          height: 36px;
          border-radius: 10px;
          border-right: 0;
          margin-left: 10px;
        }

        &.no-click {
          font-size: 12px;
        }
      }

      &.menu-fold1,
      &.menu-fold2 {
        padding-left: 16px;
        height: 36px;

        &.active {
          border-bottom: 0;

          & .items-right.menu-border {
            border-bottom: 1px solid transparent;
          }

          & .menu-border {
            border-bottom: 1px solid transparent;
          }
        }

        .league-logo {
          width: 18px;
          height: 18px;
        }

        .items-right {
          margin-left: 10px;
          flex: 1;
          align-items: center;
          justify-content: space-between;
          height: 100%;

          .live-text {
            position: relative;
            top: 2px;
            display: inline-block;
            width: 26px;
            height: 12px;
          }
        }
      }
    }

    /*  玩法 菜单项 */
    .menu-fold2-wrap {
      max-height: 0px;
      overflow: hidden;
      transition: max-height 0.2s;

      &.open {
        max-height: 500px;
      }

      .menu-fold2 {
        padding: 0 0 0 43px;
        border-right: 2px solid transparent;

        .menu-border {
          position: absolute;
          width: 128px;
          height: 1px;
          right: 0;
          bottom: 0;
        }

        .menu-point {
          position: absolute;
          left: -18px;
          width: 4px;
          height: 4px;
          border-radius: 100%;
        }

        .menu-text {
          max-width: 130px;
        }

        .match-count {
          padding-right: 13px;
        }

        &.menu-virtual {
          padding-left: 34px;
        }
      }
    }
  }

  .hot-menu-wrap {
    margin-top: 15px;

    .level2 {
      .menu-text {
        max-width: 170px;
      }
    }
  }

  .menu-normal-fixed-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    cursor: pointer;

    .left {
      padding-left: 15px;

      .icon-menu_show_normal {
        margin-right: 5px;
      }
    }

    .right {
      padding-right: 15px;
      height: 100%;

      .icon-close {
        transform: scale(0.7);
      }
    }

    &.normal-close {
      height: 32px;
      justify-content: center;

      .icon-close {
        transform: scale(0.7);
      }
    }
  }

  .bet-mode-zone {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 40px;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
      padding-left: 15px;

      .bet-single-count {
        border-radius: 10px;
        color: var(--q-gb-t-c-1);
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin-left: 5px;
        text-align: center;
        transform: scale(0.8);
      }
    }

    .right {
      display: flex;
      flex-wrap: nowrap;
      margin-right: 10px;

      .check-box {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        padding-left: 5px;
        padding-right: 5px;

        .check-wrap {
          padding: 0;
          margin-right: 5px;
        }
      }
    }
  }

  .tip-content {
    width: calc(100% - 20px);
    height: 100px;
    position: absolute;
    bottom: 0;
    z-index: 500;
    top: 40px;
    left: 10px;

    &.top-content {
      top: 5px;
    }

    .content-wrap {
      position: absolute;
      top: 6px;
      width: 100%;
      background: var(--q-gb-bg-c-4);
      border: 2px solid #ff781d;
      border-radius: 5px;

      .content {
        padding: 10px;
        font-size: 12px;

        .row-1,
        .row-2,
        .row-3 {
          color: #2d2d2d;
          text-align: center;
        }

        .row-1 {
          margin-bottom: 10px;
          font-size: 14px;
          color: #ff781d;
          font-weight: bold;
        }
      }

      .triangle,
      .triangle1 {
        position: absolute;
        background: var(--q-gb-bg-c-4);
        border: 2px solid #ff781d;
        border-top: 0;
        border-left: 0;
        width: 15px;
        height: 15px;
        transform: rotate(45deg);
        top: 81px;
        right: 22px;
      }

      .triangle1 {
        top: 116px;
      }

      .icon-del {
        position: absolute;
        top: 16px;
        right: 10px;
        cursor: pointer;
      }
    }
  }

  /* *** 公共 ************ -E */
}

// 后续删掉
.yb-flex-center {
  .active {
    color: #ff0000;
  }
}

.soprts_id_icon {
  width: 18px;
  height: 18px;
  background-size: 100% auto;
}
.menu-item-title{
  height: 32px!important;
  margin-bottom: 2px;
  font-size: 12px;
}
</style>