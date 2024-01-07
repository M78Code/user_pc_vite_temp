<!--
 * @Author: Amor
 * @Date: 2020-08-08 08:56:43
 * @Description: 赛事列表头部——滚球——赛事类型
-->
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
            v-for="item in menuInfo"
            class="tabs-item column items-center justify-center cursor-pointer relative-position"
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
    <!-- <div class="leagues-tabs"  >
      <LeagueTab
        :is_show_line="true"
        :is_show_btn="true"
        :current_mi="current_mi"
        ref="leagueTab"
      />
    </div> -->
   </template>
    
   <script setup>
    import { compute_css_obj } from 'src/core/server-img/index.js'
    import { MenuData } from "src/output/index.js"
    import BaseData from "src/core/base-data/base-data.js"
    const props = defineProps({
        menuInfo:{
            type: Array,
            default: []
        },
    })
   </script>
   <style lang="scss" scoped>
    /*  球种 */
  .match-type-tabs {
    height: 60px;
    .tabs-item {
      padding: 0 15px;
      height: 54px;
      width: 90px;
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
    .line-wrap {
      bottom: 4px !important;
    }
  }
   </style>
   
   