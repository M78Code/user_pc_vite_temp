<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 体育菜单
-->
<template>
  <div class="c-menu-sports menu-border">
    <div class="header relative-position">
      <!-- 1级 体育菜单-->
      <div class="menu-item menu-top menu-item-title disable-hover">{{menu_obj.sport_menu.menuName}}
        <span class="col-right">{{ menu.sport_menu_count }}</span>
      </div>

      <!-- 2级 今日、早盘、串关-->
      <div class="menu-item menu-tab  disable-hover" :class="menu_obj.sport_menu.subList.length == 2 && 'double'">
        <div
          v-for="(menu,index) in menu_obj.sport_menu.subList"
          :key="menu.menuId"
          @click="menu_click(1,menu.menu_name)"
          class="item yb-flex-center"
          :class="(menu_data.cur_level1_menu == menu.menu_name || (!['today','early','bet'].includes(menu_data.cur_level1_menu) && index == 0)) && 'active'"
          :id="DOM_ID_SHOW && `menu-${menu.menuId}`"
        >{{menu.menuName}}</div>
      </div>
      <!-- <div class="menu-tab-line">
        <div class="line" :class="'active'+line_index"></div>
      </div> -->
    </div>

    <template v-for="(sport_menu, sport_index) in sport_menu_list">
      <div :key="sport_index" v-if="sport_menu.menuId &&  menu_obj['menu_id_'+sport_menu.menuId].count > 0">
        <!-- 3级 赛种-->
        <div
          @click.stop="menu_click(2,sport_menu.menuId, sport_menu.field1,sport_menu)"
          class="menu-item menu-fold1"
          :class="{active: menu_data.cur_level2_menu == sport_menu.menuId && vx_layout_cur_page.cur != 'search' && !menu_data.is_show_play,'y-active': menu_data.cur_level2_menu == sport_menu.menuId && vx_layout_cur_page.cur != 'search'}"
          :id="DOM_ID_SHOW && `menu-${sport_menu.menuId}`"
        >
          <div class="row items-center">
            <sport-icon :sport_id="sport_menu.menuType == 3000 ? 10003 : sport_menu.field1" size="18px" class="icon" :status="menu_data.cur_level2_menu == sport_menu.menuId ?1:2" />
          </div>

          <div class="items-right row" style="flex-wrap:wrap;">
            <div style="line-height:1;flex:1;">
              <span
                class="menu-text"
              >{{sport_menu.menuName}}</span>
              <!-- 手球、 拳击、沙滩排球 显示 new 图标-->
              <!-- <img v-if="[11,12,13].includes(Number(sport_menu.field1))" class="menu-new-icon" src="~public/image/yabo/svg/virtual/menu_new.svg"/> -->
            </div>
              <!-- :class="{'relative-position':[30].includes(+sport_menu.menuType)}" -->
            <div class="col-right" style="min-width:40px" >
              <!-- <div v-if="[30].includes(+sport_menu.menuType)" class="owg-icon"></div> -->
              <div v-show="menu_obj['menu_id_'+sport_menu.menuId].containLive"   class="live-text" />
              <span class="match-count yb-family-odds">{{menu_obj['menu_id_'+sport_menu.menuId].count}}</span>
              <!-- <span class="match-count yb-family-odds">{{menu_obj['menu_id_'+sport_menu.menuId] ? '' :sport_menu.menuId}}</span> -->
            </div>
          </div>
        </div>

        <!-- 4级(新手版不需要4级菜单) -->
        <div v-if="get_version==1" class="menu-fold2-wrap" :class="menu_data.cur_level2_menu == sport_menu.menuId && vx_layout_cur_page.cur != 'search' && menu_data.is_show_play && 'open'">
          <template v-for="(play_menu, play_index) in _.get(menu_obj,`menu_id_${sport_menu.menuId}.subList`,[])">
            <div
              v-if="menu_obj['menu_id_'+play_menu.menuId].count > 0 || (play_menu.menuId == menu_data.cur_level3_menu && play_menu.menuId != 0)"
              :key="play_index"
              @click.stop="menu_click(3,play_menu.menuId, null, play_menu.menuName, sport_menu.field1,play_menu)"
              class="menu-item menu-fold2"
              :class="menu_data.cur_level3_menu == play_menu.menuId && 'active'"
              :id="DOM_ID_SHOW && `menu-${play_menu.menuId}`"
            >
              <div class="row items-center relative-position">
                <span class="menu-point"></span>
                <span class="menu-text ellipsis">{{play_menu.menuName}}
                  <!-- 是否新上玩法 -->
                  <img v-if="sport_menu.menuType == 3000 && play_menu.coppertone == 1" class="menu-new-icon" src="~public/image/yabo/svg/virtual/menu_new.svg"/>
                </span>
              </div>

              <div class="col-right relative-position" style="min-width:40px" >
                <span class="match-count yb-family-odds" v-if="sport_menu.menuType !== 3000">{{menu_obj['menu_id_'+play_menu.menuId].count}}</span>
              </div>
            </div>
          </template>

        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters,mapActions } from "vuex";
import sportIcon from "src/public/components/sport_icon/sport_icon.vue";

export default {
  name: "MenuSports",

  components: {
    sportIcon
  },
  computed: {
    ...mapGetters({
      vx_get_user: "get_user",
      //获取当前版本状态  // 1专业  2 新手
      get_version: "get_version",
    }),
     // 菜单数据
    menu_data() {
      return this.menu.menu_data;
    },
    // 球种菜单列表
    sport_menu_list() {
      return this.menu.sport_menu_list;
    },
    // 菜单对象
    menu_obj() {
      return this.menu.menu_obj;
    },
  },

  data() {
    return {
      // 菜单数据
      menu: $menu,
      currentMenu: '', // 当前菜单类型 今日/早盘/串关
    };
  },
  created () {
    // 显示部分dom ID
    this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
  },
  methods:{
    ...mapActions({
      // 设置是否为当
      vx_set_is_bet_single: 'set_is_bet_single'
    }),
    /**
     * @Description 菜单点击
     * @param {number} level_type 点击的菜单类型
     * @param {number} menu_id 菜单ID
     * @param {undefined} undefined
    */
    menu_click(level_type,menu_id, menuType, playname, item,play_menu = {}){
      let type = level_type == 2 ? 'today' : ''
      // 诸葛埋点处理，今日&早盘下所有球种
      // 赛种菜单
      if (level_type == 2 && menu_id != this.menu_data.cur_level2_menu) {
        let eventLabel = '';
        // 当前菜单
        switch (this.menu_data.cur_level1_menu) {
          case 'today':
            eventLabel = 'PC_今日_球种导航'
            break;
          case 'early':
            eventLabel = 'PC_早盘_球种导航'
            break;
        }
        let sportName = this.yabo_common.play_name_mapping(menuType);
        if (eventLabel) {
          if (sportName) {
            this.$utils.send_zhuge_event(eventLabel, {'球种名称': sportName})
          } else {
            if (menuType == 18) {
              this.$utils.send_zhuge_event(eventLabel, {'球种名称': '娱乐'})
            } else if (menuType == -2) {
              this.$utils.send_zhuge_event(eventLabel, {'球种名称': '电子竞技'})
            }
          }
        }
      
      } else if (level_type == 1 && menu_id != this.menu_data.cur_level1_menu) {
        // 今日/早盘/串关
        let label = '', scheduleType = '';
        if (menu_id == 'today') {
          scheduleType = '今日';
        } else if (menu_id == 'early') {
          scheduleType = '早盘';
        } else if (menu_id == 'bet') {
          scheduleType = '串关';
        }
        label = 'PC_' + scheduleType
        if (scheduleType) {
          this.$utils.send_zhuge_event(label,{'赛程类型': scheduleType});
        }
      } else if (level_type == 3 && menu_id != this.menu_data.cur_level1_menu) {
        // 统计今日-足球的二级菜单
        if (this.menu_data.cur_level1_menu == 'today' && item == 1) {
          this.$utils.send_zhuge_event('PC_今日_足球_二级导航', {'玩法名称': playname})
        }
      }
      // 是否是冠军
      $menu.menu_data.is_winner_champion = level_type == 3 && play_menu.field2 == 18

      $menu.menu_change(level_type,menu_id,type)
    }
  }
};
</script>
<style lang="scss" scoped>
/* 体育菜单 */
.c-menu-sports {
  /* 体育菜单标题 */
  .menu-item-title {
    height: 32px !important;
    margin-bottom: 2px;
    font-size: 12px;
  }
  .menu-tab{
    padding: 0 !important;
  }
}
</style>

