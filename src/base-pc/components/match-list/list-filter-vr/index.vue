<template>
    <!-- 球种标题 -->
    <!-- 赛种列表 -->
    <div class="match-type-tabs">
      <div class="tabs-bar">
        <div class="tabs-item-wrap row items-center">
          <!-- 切换虚拟体育 -->
          <!-- :class="{ active: item.menuId == current_mi }" -->
          <!--  @click="handle_menu_click_vr_sub_mi(item) -->
          <div
            v-for="(item,index) in menuInfo"
            class="tabs-item column items-center justify-center cursor-pointer relative-position"
            :class="{ active: MenuData.get_lv2_mi_value() == `3${item.menuId}`}"
            @click="handle_menu_click_vr_sub_mi(item,index)"
            :key="item.menuId"
          >
            <!-- 虚拟体育图标 -->
            <div class="sport_icon">
              <!-- <sport-icon :sport_id="item.menuId" :status="item.menuId == menu_data.cur_level2_menu ? 1 : 2" size="20px"
                class="icon" /> -->
                <span :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_${BaseData.compute_sport_id(item.field1)}` })"></span>
            </div>
            <!-- 虚拟体育名称 -->
            <!-- <div class="tab-text ellipsis"  v-tooltip="{content:item.field1== 1009 ? item.name.replace('VR','').replace('VR',''):item.name,overflow:1}" >{{ item.field1== 1009 ? item.name.replace('VR','').replace('VR',''):item.name }}</div> -->
            <div
              class="tab-text ellipsis"
              v-tooltip="{ content: item.name, overflow: 1 }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 联赛 -->
    <div class="leagues-tabs">
        <div class="leagues-tabs-ul">
            <div class="leagues-tabs-li" :class="{ active: index == activeOnLeagues }" @click="handle_menu_click_vr_sub_mi_leagues(item,index)" v-for="(item,index) in ((menuInfo.find(n=>{return MenuData.get_lv2_mi_value() == `3${n.menuId}`}) ?? []).subList || [])" :key="item.menuId">
                {{item.name}}
            </div>
        </div>
    </div>
   </template>
    
   <script setup>
    import { ref } from "vue";
    import { compute_css_obj } from 'src/core/server-img/index.js'
    import { MenuData } from "src/output/index.js"
    import BaseData from "src/core/base-data/base-data.js"
    const props = defineProps({
        menuInfo:{
            type: Array,
            default: []
        },
    })
    const activeOn = ref(0);
    const activeOnLeagues = ref(0);
    /**
     * 球种点击
     */
    const handle_menu_click_vr_sub_mi = (item,index) =>{
        if(MenuData.get_lv2_mi_value() == `3${item.menuId}`)return;
        const left_obj = {
            lv1_mi:MenuData.menu_root,
            lv2_mi:`3${item.menuId}`
        }
        MenuData.set_left_menu_result(left_obj)
        MenuData.set_menu_current_mi(left_obj.lv2_mi)
        //联赛数据 还未对接
        // handle_menu_click_vr_sub_mi_leagues(item.subList[0],0)
    }
    /**
     * 联赛点击
     */
     const handle_menu_click_vr_sub_mi_leagues = (item,index) =>{
        if(index == activeOnLeagues.value)return;
        activeOnLeagues.value = index;
    }
   </script>
   <style lang="scss" scoped>
    /*  球种 */
  .match-type-tabs {
    height: 60px;
    background:#fff;
    border-left: 1px solid var(--q-gb-bd-c-6);
    border-right: 1px solid var(--q-gb-bd-c-6);
    .tabs-item {
      padding: 0 15px;
      height: 54px;
      width: 90px;
      &.active{
        color:#ff7000;
        }
      /*  未选中时的图标 */
      .sport_icon{
        
        margin: 5px 0;
        width: 18px;
        span{
            background-size: 100% auto;
            display:inline-block;
            width:100%;
            height:100%;
        }
      }
      .tab-text {
        height: 17px;
        max-width: 60px;
      }
    }
  }
  /*  联赛 */
  .leagues-tabs {
    height: 40px;
    background-image: var(--q-gb-bg-lg-18);
    border-radius:0px 0px 6px 6px;
    border: 1px solid var(--q-gb-bd-c-6);
    border-top: none;
    color: var(--qq--menu-text-color2);
    .leagues-tabs-ul{
        width:100%;
        height:100%;
        margin:0;
        padding:0;
        display:flex;
        .leagues-tabs-li{
            text-align:center;
            line-height:40px;
            padding:0 10px;
            cursor:pointer;
            &.active{
                color:#ff7000;
            }
        }
    }
    .line-wrap {
      bottom: 4px !important;
    }
  }
   </style>
   
   