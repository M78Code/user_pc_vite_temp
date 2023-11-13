<!--
 * @Author: Amor
 * @Date: 2020-12-23 14:11
 * @Description: 虚拟体育 赛事列表 头部
-->

<template>
  <div class="c-virtual-list-header">
    <!-- 列表标题 -->
    <div class="list-header row">
      <div class="list-header-title row items-center">
        {{ $root.$t("list_header.virtual_sport") }}
      </div>
      <div class="row items-center">
        <!-- 专业、新手 切换-->
        <div show_type="sort" class="flex list-sort select-btn ya-zhou-border yb-hover-bg">
          <template v-for="(item, index) in ver_option">
            <div @click="set_click_version(item)"
              :class="[get_version == item.id ? 'active special' : 'yb-hover-bg', 'list-sort-item']" :key="index">
              {{ item.name }}
            </div>
          </template>
        </div>
        <!-- 日间夜间切换 -->
        <div show_type="sort" class="flex list-sort select-btn ya-zhou-border yb-hover-bg">

          <div v-for="(item, index) in theme_option" @click="handle_set_theme(item.theme)"
            :class="[handicap_theme == item.theme ? 'active' : 'yb-hover-bg', 'list-sort-item']" :key="index">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 赛种列表 -->
    <div class="match-type-tabs tabs-bg">
      <div class="tabs-bar">
        <div class="tabs-item-wrap row items-center">
          <!-- 切换虚拟体育 -->
          <div v-for="item in menu_data.virtual_sport_list"
            class="tabs-item items-center justify-center cursor-pointer relative-position "
            :class="{ active: item.menuId == menu_data.cur_level2_menu }" :key="item.menuId"
            @click="sport_click(item.menuId)">
            <!-- 虚拟体育图标 -->
            <div class="sport_icon">
              <sport-icon :sport_id="item.menuId" :status="item.menuId == menu_data.cur_level2_menu ? 1 : 2" size="20px"
                class="icon" />
            </div>
            <!-- 虚拟体育名称 -->
            <!-- <div class="tab-text ellipsis"  v-tooltip="{content:item.field1== 1009 ? item.name.replace('VR','').replace('VR',''):item.name,overflow:1}" >{{ item.field1== 1009 ? item.name.replace('VR','').replace('VR',''):item.name }}</div> -->
            <div class="tab-text ellipsis" :class="item.menuId == 1009 ? 'no-ellipsis' : ''"
              v-tooltip="{ content: item.name, overflow: 1 }">{{ item.name }}</div>
            <img v-if="item.coppertone == 1" class="menu-new-icon" src="~public/image/yabo/svg/virtual/menu_new.svg" />
          </div>
        </div>
      </div>
    </div>

    <!-- 联赛 -->
    <div class="leagues-tabs" v-if="menu_data.virtual_league_list.length > 0">
      <!-- 联赛菜单 -->
      <tab :list="menu_data.virtual_league_list" tab_name_key="name" :is_show_line="true" :is_show_btn="true"
        :currentIndex="menu_data.cur_level3_menu" @onclick="leagues_tab_click"
        :key="menu_data.cur_level2_menu + menu_data.virtual_league_list_key" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import tab from "src/public/components/tab/tab.vue";//联赛菜单
import sportIcon from "src/public/components/sport_icon/sport_icon.vue";
export default {
  name: "CVirtualListHeader",
  props: {
    state: String
  },
  components: {
    tab,
    sportIcon
  },
  computed: {
    ...mapGetters({
      //获取当前主题
      get_theme: "get_theme",
      //获取当前版本状态  // 1专业  2 新手
      get_version: "get_version",
    }),

    //日间或夜间版
    handicap_theme() {
      return this.get_theme.indexOf('theme02') != -1 ? 'theme02' : 'theme01'
    },
    //专业新手
    ver_option() {
      let option = [
        {
          id: 1,
          name: this.$root.$t('set.pro'),//"专业版",
        },
        {
          id: 2,
          name: this.$root.$t('set.beginner'),//"新手版",
        }
      ]
      return option
    },
    //日间夜间
    theme_option() {
      let option = [
        {
          id: 1,
          name: this.$root.$t('set.day_'),//"日间版",
          theme: "theme01"
        },
        {
          id: 2,
          name: this.$root.$t('set.night_'),//"夜间版",
          theme: "theme02"
        }
      ]
      return option
    },
  },

  data() {
    return {
      // 菜单数据
      menu_data: $menu.menu_data,
    };
  },

  methods: {
    ...mapActions({

      set_theme: "set_theme", // 设置主题
      set_version: "set_version" // 设置专业版、新手版切换
    }),
    /**
     * @description 赛种 鼠标点击
     * @param {number} menu_id 当前 tab 的数据
     * @return {undefined} undefined
     */
    sport_click(menu_id) {
      if (this.state == 'loading') {
        return
      }
      $menu.menu_change(2, menu_id)
    },
    /**
     * @description 联赛 鼠标点击
     * @param  {number} obj  当前 tab 的传入的对象
     * @return {undefined} undefined
     */
    leagues_tab_click(obj) {
      if (this.state == 'loading') {
        return
      }
      $menu.menu_change(3, obj.index)
    },
    // 专业、新手 切换
    set_click_version(item) {
      this.set_version(item.id)
      if (this.menu_data.match_tpl_number != 18) {
        setTimeout(() => {
          this.$emit('on_refresh')
        }, 300);
      }

      //  this.$nextTick(()=>{
      //   this.$emit('on_refresh')
      //  })
    },

    // 设置主题
    handle_set_theme(theme) {
      const curr_theme = this.get_theme

      if (curr_theme.includes('y0')) {
        this.set_theme(theme + '_y0')
      } else {
        this.set_theme(theme)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.c-virtual-list-header{
  .list-header.row{
    background-color: var(--qq--list-header-row-bg);
    background-image: none;
  }
  .match-type-tabs.tabs-bg{
    background-color: var(--qq--list-header-row-bg);
    border-top-color: var(--qq--match-type-tab-bg-border);
    border-bottom-color: var(--qq--match-type-tab-bg-border);
    .tabs-item{
      //border-color: var(--qq--list-header-row-item-border);
      background-color: var(--qq--list-header-row-item-bg);
    }
  }
  .leagues-tabs{
    background: var(--qq--list-header-leagues-tabs-bg);
  }
}
</style>
<style lang="scss">
/* 虚拟体育 赛事列表 头部 高度 字体大小 */
.c-virtual-list-header {
  .list-header-title {
    padding: 0 15px;
    height: 33px;
    font-size: 16px;
    font-weight: 500;
    color: #1D1D1D;
  }

  /*  球种 */
  .match-type-tabs {
    height: 48px;

    .tabs-item-wrap {
      height: 48px;
      padding-left: 20px;
    }

    .tabs-item {
      padding: 2px 5px 2px 2px;
      border: 1px solid var(--qq--vr-border-color);
      height: 48px;
      margin-right: 10px;
      display: flex;

      //width: 90px;
      /*  未选中时的图标 */
      .sport-img {
        background-size: 100% auto;
      }

      .sport_icon {
        background-color: var(--qq--theme-bd-play-color);
        padding: 2px;
        border-radius: 50%;
        box-sizing: border-box;
      }

      .tab-text {
        height: 17px;
        margin-left: 6px;
        // max-width: 60px;

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

  .menu-new-icon {
    position: absolute;
    top: 4px;
    right: -8px;
  }

  .no-ellipsis {
    overflow: inherit;
  }
}

.yb-hover-bg {
  color: var(--qq--y0-text-color5_1);
  // &:hover {
  //   background: var(--qq--background-gradient-7);
  // }
}

.list-sort {
  .list-sort-item {
    font-weight: 400;
    padding: 2px 11px;
    border-radius: 12px;
    font-size: 12px;

    &.active {
      //background: #626262;
      color: var(--qq--y0-text-color5_2);
      background: var(--qq--background-gradient-1_2);
      font-weight: 500;
      border: 0;
    }

    &.special {
      background-image: linear-gradient(225deg, var(--qq--match-bg-color6) 0%, var(--qq--match-bg-color6) 100%);
      //background-color: #45B0FF;
      color: var(--qq--yb-text-color27_1);
      border: 0;
      // &:hover {
      // background-image: var(--qq--background-gradient-4);
      // color: var(--qq--y0-text-color5);
      // }
    }
  }
}

.select-btn {
  margin-left: 5px;
  padding: 2px 8px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid transparent;
  background: var(--qq--background-gradient-1_1);

  &.ya-zhou-border {
    border: 1px solid transparent !important;
  }

  &.sort-btn {
    .icon-sort_league {
      &:before {
        color: var(--qq--y0-text-color5);
      }
    }
  }
}</style>
