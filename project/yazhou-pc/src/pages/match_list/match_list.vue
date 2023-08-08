<!--
 * @Author: Amor
 * @Date: 2020-06-03 18:01
 * @Description: 赛事主列表页
-->
<template>
  <div
    class="yb-match-list column full-height   relative-position"
    :class="['match-tpl' + NewMenu.mid_menu_result.match_tpl_number,{'match-tplesports': NewMenu.mid_menu_result.match_tpl_number == 18 && NewMenu.is_esports()}, {'virtual-list':NewMenu.is_virtual_sport()}]"
  >
    <div class="test-info-wrap" v-if="wsl">
      <div>{{NewMenu.mid_menu_result.match_tpl_number}}</div>
      <div class="fold-btn" @click="match_list_card.unfold_all_league()">展开联赛</div>
      <div class="fold-btn" @click="match_list_card.fold_all_league()">折叠联赛</div>
      <div class="fold-btn" @click="match_list_card.test_log_data()">打印数据</div>
      <div> load_data_state {{ load_data_state }}</div>
    </div>

    <div
      class="scroll-fixed-header"
      :class="{ 'no-data': load_data_state != 'data' }"
    >
      <!-- banner -->
      <!-- <div class="banner-box" :style="{height: get_is_roll_show_banner ? '120px' : '0px'}" v-if="get_is_show_banner"></div> -->
      <!-- 列表头 -->



      <list-header :collect_count="collect_count" :is_show_hot="is_show_hot" :load_data_state="load_data_state">
        <template v-slot:refresh_icon>
          <!-- 刷新组件 -->
          <refresh :loaded="load_data_state != 'loading'"  :other_icon="true" icon_name="icon-balance_refresh" @click="on_refresh" />
        </template>
      </list-header>








  <!-- <div>NewMenu.match_list_menu_show.list_filter {{ NewMenu.match_list_menu_show.list_filter }}</div> -->

     <!-- 顶部菜单  // 滚球  冠军 -->
     <list-filter
        v-if="[1,400].includes(parseInt(NewMenu.menu_root)) && vx_layout_list_type != 'collect'"
        :collect_count="collect_count"
        :load_data_state="load_data_state"
      />

      <!-- 日期菜单   早盘 日期 -->

     <list-filter-date
        v-if="NewMenu.menu_root == 3  && vx_layout_list_type != 'collect'"


        :collect_count="collect_count"
        :load_data_state="load_data_state"
      />



      <!-- 热门赛事顶部菜单 -->
      <list-filter-hot
        v-if=" NewMenu.menu_root == 500 && vx_layout_list_type != 'collect'"
        :collect_count="collect_count"
        :load_data_state="load_data_state"
      />

      <!-- 电竞顶部菜单 -->
      <esports-header
        v-if="NewMenu.menu_root == 2000 "
        :load_data_state="load_data_state"
      />
      <!-- 赛事状态 | 赛种类型      -->
      <PlayVirtualMatchType  class="sticky-wrap" v-if="NewMenu.menu_root_show_shoucang == 300"  style="top:100px"  />

      <!-- 联赛  VR 足球才会有联赛-->
      <div class="leagues-tabs leagues-bg" v-if="NewMenu.mid_menu_result.mi =='1001'">
          <!-- 联赛菜单 -->
        <LeagueTab
        />
      </div>
    </div>
    
    <!-- 列表容器 -->
    <load-data :state="load_data_state">

      <!-- 滚球虚拟体育列表 -->
      <scroll-list v-if="NewMenu.menu_root_show_shoucang == 300">
        <template v-slot:before>
          <div :style="{ height: fixed_header_height }"></div>
        </template>
        <template>
          <!--虚拟体育 赛事列表 赛事头-->
          <virtual-match-type
            v-for="(match_item, match_index) in match_list"
            :key="`match_type_${match_item.mid}`"
            :mid="match_item.mid"
            :match_index="match_index"
            :sticky_top=" NewMenu.mid_menu_result.csid == '1001' ? 157.5:117"
            :style="`width:${vx_get_layout_size.list_content_width}px  !important;`"
          />
          <div class="v-scroll-item" :style="`width:${vx_get_layout_size.list_content_width}px  !important;`" :key="match_item.mid">
            <div v-if="wsl" class="test">{{match_index}}———{{match_item.mid}}-----{{match_item.flex_index}}</div>
            <!--玩法模板-->
            <component
              :is="match_tpl_component"
              :mid="match_item.mid"
            />
          </div>
        </template>
         <template v-slot:after>
          <div style="height:15px"></div>
        </template>
      </scroll-list>

      <!-- 滚球其他列表 -->
      <scroll-list v-else>

        <template v-slot:before>
          <div :style="{ height: fixed_header_height }"></div>
        </template>
        <div class="today-champion-bg" v-if="NewMenu.menu_root == '2' || NewMenu.menu_root == 400 || NewMenu.menu_root != 2000"></div>
        <template>
          <match-list-card
            v-for="card_key in match_list_card.match_list_card_key_arr" 
            :key="card_key+match_list_card.match_list_render_key"
            :card_key="card_key"
          />
        </template>

        <template v-slot:after>
          <div style="height:15px"></div>
          <div class="pager-wrap row justify-end">
            <div class="go-top-btn yb-flex-center" @click="on_go_top">
              <icon name="icon-go_top" size="14px" />
              <div class="msg">{{ $root.$t("common.back_top") || "" }}</div>
            </div>
          </div>
        </template>
      </scroll-list>


    </load-data>

    <!-- 联赛筛选层 -->
    <leagues-filter v-if="vx_show_filter_popup" />
    <!-- 点击头部刷新弹出 loading 蒙层 -->
    <div v-show="show_refresh_mask" class="refresh-mask absolute-full yb-flex-center" :style="{top:'36px'}">
    <!-- <div v-show="show_refresh_mask" class="refresh-mask absolute-full yb-flex-center" :style="{top:get_is_show_banner && get_is_roll_show_banner ? '156px' : '36px'}"> -->
      <div class="img-loading custom-format-img-loading"></div>
    </div>
  </div>
</template>

<script>
import match_list_version_mixin from "src/project/yabo/mixins/match_list/match_list_version_mixin.js";//模板引入及主要业务逻辑
import LeagueTab from "src/public/components/tab/league-tab.vue";//联赛菜单
import skt_data_list from "src/public/mixins/websocket/data/skt_data_list_new_data.js";// 发送websocket命令时使用
import BaseData from "src/public/utils/base_data/base-data.js";
import NewMenu from "src/public/utils/menuClass/menu_class_new.js";
export default {
  name: "MatchList",
  mixins: [match_list_version_mixin,skt_data_list],
  components: {
    VirtualMatchType:() => import( /* webpackChunkName: "details" */ "src/public/components/match_list/virtual_match_type.vue"),  //虚拟体育 赛事列表 赛事头
    PlayVirtualMatchType:() => import( /* webpackChunkName: "details" */ "src/project/yabo/components/match_list/play_virtual_match_type.vue"), //赛事列表头部——滚球——赛事类型
    LeagueTab,
    virtualMatchTpl1:() => import( /* webpackChunkName: "details" */ "src/project/yabo/components/match_list/match_tpl_new_data/virtual_match_tpl1.vue"),  //拟足球 、 虚拟篮球
    virtualMatchTpl2:() => import( /* webpackChunkName: "details" */ "src/project/yabo/components/match_list/match_tpl_new_data/virtual_match_tpl2.vue")   //拟赛马 、 虚拟赛狗
  },
  data() {
    return {
      NewMenu,
      BaseData
    }
  },

  methods:{

  }
};
</script>

<style lang="scss" scoped>
.test-info-wrap {
  color: red;
  font-size: 24px;
  position: absolute;
  top: 0;
  left: 200px;
  z-index: 99999;
  display: flex;
  .fold-btn {
    border: 1px solid #ccc;
    font-size: 16px;
    cursor: pointer;
    padding: 5px;
  }
}
.leagues-tabs {
  height: 40px;
  position: sticky;
  top: 133px;
  z-index: 200;
  font-size: 13px;
}
</style>
