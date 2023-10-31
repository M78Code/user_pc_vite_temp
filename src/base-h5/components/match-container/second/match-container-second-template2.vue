<!--
 * @Description: 加时赛点球大战等新增玩法
-->
<template>
    <div class="m-o-p-wrapper" v-show="show_tab_by_data">
      <span v-if="wsl_flag" class="wsl_flag_777">
        {{ 'csid:' + match_info.csid + '---mid:' + match_info.mid + '---tid:' + match_info.tid }}---{{
          get_secondary_unfold_map[match_info.mid] }}
      </span>
      <!--次要玩法 标题主名称-->
      <div class="tab-m-o-w row items-center" ref="sub_play_scroller">
        <div v-for="(t_item, i) of tab_list.filter(x => x.show_tab)" :key="i" ref="sub_play_scroll_item"
          class="tab-item-h row items-center" :class="{ 'collapsed': t_item.unfold == 1 }"
          @click="overtime_tab_handle(t_item, undefined, 'is-user', i)">
          <div> {{ t_item.title }} </div>
           <!--折叠得箭头图标-->
          <span class="league-collapse-dir" :class="{ 'collapsed': t_item.unfold == 1 }"
            :style="compute_css_obj('icon-collapse')" ></span>
  
            
          <!-- <img class="league-collapse-dir" :class="{ 'collapsed': t_item.unfold == 1 }"
            :src="(`${project_name}/image/list/league-collapse-icon${('night') ? '-black' : ''}${t_item.unfold == 1 ? (('y0') ? '-collapse-y0' : '-collapse') : ''}.svg`)" /> -->
        
          </div>
      </div>
      <!-- 次要玩法   1. 左边队伍名标题   2. 右边 盘口组件  模块 -->
      <div v-if="current_tab_item.hps" :mid="match_info.mid"  :class="['transition-w-odd', {
          expanded: any_unfold && any_unfold != '0',
          bodan_wanfa: [18].includes(+ lodash.get(current_tab_item, 'id')) && bold_gaodu_css > 3,
          bodan_wanfa_small: any_unfold && [18].includes(+ lodash.get(current_tab_item, 'id')) && bold_gaodu_css <= 3,
          five_minutes_wanfa: any_unfold && any_unfold != '0' && [19].includes(+ lodash.get(current_tab_item, 'id')),
        }]">
        <!--次要玩法标 队名 和 比分 和 盘口-->
        <div class="row justify-between" v-if="any_unfold">
          <!--次要玩法标 队名 和 比分  次要玩法 左边的 区域    波胆，5分钟玩法  不显示-->
          <div class="team-title-container" v-if="![18, 19].includes(+ lodash.get(current_tab_item, 'id'))">
            <!--主队名 和 比分-->
            <div class="team-t-title-w" :class="{
              'is-handicap': current_tab_handicap_index == 1,
              'is-handicap-1': current_tab_handicap_index == 2,
            }">
              <div class='team-title'>
                {{ match_info.mhn }}
              </div>
              <!--显示次要玩法比分-->
              <div class="way-score" v-if="[1, 5, 7, 8, 9].includes(+current_tab_item.id) && match_info.ms == 1">
                {{ home_score }}<!--7,8,9 网,乒,斯-->
              </div>
            </div>
            <!--副队名 和 比分-->
            <div class="team-t-title-w" :class="{
              'is-handicap': current_tab_handicap_index == 2,
              'is-handicap-1': current_tab_handicap_index == 1,
            }">
              <div class='team-title'>
                {{ match_info.man }}
              </div>
              <!--显示次要玩法比分-->
              <div class="way-score" v-if="[1, 5, 7, 8, 9].includes(+current_tab_item.id) && match_info.ms == 1">
                {{ away_score }}<!--7,8,9 网,乒,斯-->
              </div>
            </div>
            <!--  玩法描述图标显示  -->
            <div class="team-t-title-w fight-type" v-if="[1, 3, 5, 7, 8, 9].includes(+match_info.csid)"> <!--csid 7斯诺克-->
              <!--csid 1足球-->
              <span v-if="[2, 5, 17].includes(+current_tab_item.id)" @click="info_icon_click($event, match_info.mid)"
                :src="compute_css_obj(show_tips?'icon-tips':'icon-tips-d')"></span>
              {{ match_info.csid == 1 ? current_tab_item.title : mmp_map_title }}
            </div>
          </div>
          <!--次要玩法 盘口 右边的 区域-->
          <odd-list-wrap :main_source="main_source" :match="match_info" :hps="current_tab_item.hps"
            :current_tab_item="current_tab_item" :invoke_source="'attached'" :bold_all_list="bold_all_list" :five_minutes_all_list="five_minutes_all_list" />
        </div>
      </div>
    </div>
  </template>
  
  
  <style scoped lang="scss">
  @import "../styles/match-overtime-pen";
  </style>
  