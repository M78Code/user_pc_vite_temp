<!--
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-05 13:21:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-17 19:43:42
 * @FilePath: \user-pc-vue3\src\components\menus\menu.vue
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
    <div class="left-container">
      <!-- 左侧菜单 -->
      <div class="menu-nav-li">
        <ul class="menu-list menu-favouritse">
          <li class="f-s-c" @click="go_to_favouritse"> 
            <i class="icon-star q-icon c-icon icon"></i>
            Favorites
          </li>
        </ul>
      </div>

      <div class="menu-nav-line" />

      <div class="menu-nav-li">
        <p>POPULAR</p>
        <ul class="menu-list">
          <li class="f-s-c" :class="{ 'menu_checked': current_menu_id == item }" v-for="item in popular" :key="item" @click="jump_func(item)"> 
            <!-- <sport_icon :sport_id="compute_sport_id(item)" size="18px" class="icon" /> -->
            {{ (BaseData.menus_i18n_map || {} )[item] || "" }}
          </li>
        </ul>
      </div>

      <div class="menu-nav-line" />

      <div class="menu-nav-li">
        <p>ALL SPORTS</p>
        <ul class="menu-list">
          <li class="f-s-c" :class="{ 'menu_checked': current_menu_id == item }" v-for="item in ( left_menu_list || menu )" :key="item" @click="jump_func(item)"> 
            <!-- <sport_icon :sport_id="compute_sport_id(item)" size="18px" class="icon" /> -->
            {{ (BaseData.menus_i18n_map || {} )[item] || "" }}
          </li>
        </ul>
      </div>
      <div class="menu-line"></div>
      <div class="menu-nav-line" />

      <!-- <div class="menu-nav-li">
        <ul class="menu-list">
          <li class="f-s-c"> 
            <sport_icon :sport_id="compute_sport_id(300)" size="18px" class="icon" />
            VR Sports
          </li>
        </ul>
      </div> -->

      <div class="menu-line"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted  } from "vue";
  import { useRouter } from "vue-router";
  import BaseData from "src/core/base-data/base-data.js";
  import sport_icon from "src/base-pc/components/sport_icon.vue";
  // import { use_base_data,useMenuData,useMenuI18n } from "./base_data";
  import { useLoadMapping } from './load_mapping.js';
  
  const { load_mapping } = useLoadMapping()



  // 当前选中的菜单 id
  const current_menu_id = ref('')

  const popular = ([101,102,105])
  const menu = [
  101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115,
  114, 104, 106, 118,
]

  let state = {
    menu_list: [], // 左侧菜单列表
    top_events: [], // top_event 菜单列表
    in_play: [], // 滚球菜单列表
    menu_root: 1, // 菜单的 root 节点   root ： 1 首页  2 滚球  3 my bets   4 左侧赛种
    menu_left: 1,  // 左侧菜单 赛种菜单id
    menu_id_euid:"", // 菜单对应的euID
    menu_id_euid_ealy:'', // 菜单对应的 早盘 euID
    mid_tab_type:'', // header tab切换
    mid_tab_menu_type:1, // header tab切换对应的 赛种菜单id 或者 时间 (左侧赛种菜单对应的 matches 今日 2 其他日期为 3)  或者 联赛类型
    mid_right_bg: 0 , // header 右上角对应的赛种
    coom_soon:false
  }
  const left_menu_list = ref(menu)
  
  const router = useRouter();

  onMounted(()=>{
    // init()
    console.error(BaseData,"BaseData====")
  })
  
  // 监听左侧变化
  // let un_subscribe = store.subscribe(() => {
  //   const { menu_root,menu_left,menu_list } =state
  //   if(menu_root == 4){
  //     current_menu_id.value = menu_left
  //   }else{
  //     current_menu_id.value = ''
  //   }
  //   // if(menu_root == 1){
  //     left_menu_list.value = menu_list
  //   // }
  
  // });
  
const go_to_favouritse= () =>{
  router.push({
            path: '/conming_soon',
            query: {}
          })
  
}
  /**
   * 
   * @param {Object} payload 菜单信息 
   * @description 点击菜单item 存储当前菜单信息
   * @returns {undefind} 无返回值
   */
  const jump_func = payload => {

    current_menu_id.value = payload

    let euid = (load_mapping[payload + '2'] || {}).h || ''
    let ealy_euid = (load_mapping[payload + '3'] || {}).h || ''

    // 获取最新的 数据
    let redux_menu = state
    // 修改菜单数据
    redux_menu.menu_root = 4
    redux_menu.menu_left = payload

    redux_menu.mid_tab_menu_type = ''

    redux_menu.menu_id_euid = euid

    redux_menu.menu_id_euid_ealy = ealy_euid
    
    // 存储
    // store.dispatch({
    //   type: 'SETREDUXMENU',
    //   data: redux_menu
    // })

    router.push({
      path: '/event_list',
      query: {},
    })
  }

  onUnmounted(()=>{
    // un_subscribe()
  })

  </script>

  <style lang="scss" scoped>
  @import "./menu.scss";
  </style>


  <!-- <style scoped lang="scss">
    @import "src/components/bet-box/bet/bet.scss";
  </style>
 -->
