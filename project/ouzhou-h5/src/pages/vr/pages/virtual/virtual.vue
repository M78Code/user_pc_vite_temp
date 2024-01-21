<!--
 * @Description: 虚拟体育最外层父组件，包括了上方的球种菜单切换
-->
<template>
  <div>
    <div class="virtual-main router_scroll_layout" ref="scrollArea" @scroll="wrapper_scroll_handler">
      <!-- 头部 -->
      <div class="virtual-head" style="display: none;">
        <div class="type-bg" :class="'bg'+lodash.get(sub_menu_list,`[${sub_menu_i}].field1`)">
          <!-- 虚拟体育菜单 -->
          <div class="virtual-menu-list" ref='virtual_menu_list'>
            <div class="tabs-bar">
              <div class="tabs-bar-nav" ref="scroll_main">
                <div class="tabs-tab"
                     ref="scroll_box"
                     v-for="(tab, i) in sub_menu_list" :key="i"
                     :class="[sub_menu_i == i ? 'tabs-active' : '']"
                     @click="virtual_menu_changed(i)"
                >
                  <div class="sport-icon-wrap" :style="compute_css_obj({key:sub_menu_i == i ? 'menu-sport-active-image' : 'menu-sport-icon-image', position:format_type({...tab,mi:`3${tab.field1}`})})" >
                    <img v-if="false" class="menu-new-icon" src="image/bw3/svg/virtual-sports/new.svg" />
                  </div>
                  <span>VR{{ tab.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--虚拟体育-->
      <virtualSports
          :params="virtual_sports_params"
          :current_sub_menu="current_sub_menu"
          :is_user_refresh='refreshing'
          :menu_list="current_sub_menu.subList ? current_sub_menu.subList : []"
          :v_match_router_ente="v_match_router_ente"
          :v_menu_changed="v_menu_changed">
      </virtualSports>

    </div>
  </div>
</template>
<script>
import virtual_mixin from "src/core/vr/mixin/pages/virtual/virtual-mixin.js";
import virtualSports from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/virtual-sports.vue";    // 虚拟体育
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { MenuData } from "src/output/index.js";
import { useMittOn, MITT_TYPES } from "src/core/mitt/"

export default {
  mixins:[virtual_mixin],
  name:'match_main',
  components: {
    virtualSports,
  },
  methods: {
    handle_menu_click(res){
      this.virtual_sports_params = res.virtual_sports_params;
      this.current_sub_menu = res.current_sub_menu;
      this.refreshing = res.refreshing;
      this.menu_list = res.menu_list;
      this.v_match_router_ente = res.v_match_router_ente;
      this.v_menu_changed = res.v_menu_changed;
      // 切换菜单时修改csid
      MenuData.set_vr_menu_csid(this.current_sub_menu.menuId);
    }
  }, 
  mounted(){
    MenuData.set_vr_menu_csid('1001');
    // 重置所选 球种默认玩法 hpid
    MatchResponsive.reset_match_hpid_by_csid()
    // 监听vr-top组件菜单变化
    this.emitters = [
      useMittOn(MITT_TYPES.EMIT_VR_MENU_CLICK, this.handle_menu_click).off,
    ]
  },
  unmounted(){
    this.emitters.map((x) => x())
  }
}
</script>

<style lang="scss" scoped>
.virtual-main {
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  overflow: auto;
  background-color: var(--q-gb-bg-c-21) ;

  /* ************** 列表上滑箭头图标 **************** -S */
  .list-scroll-to-top {
    z-index: 86;
    position: fixed;
    width: 0.3rem;
    //height: 0.3rem;
    bottom: 0.6rem;
    right: .2rem;
  }

	 /*  头部 */
  .virtual-head {
    position: sticky;
    top: 0;
    z-index: 540;
    width: 100%;
    background: var(--q-gb-bg-c-27) !important;
    .type-bg {
      background-size: 100% auto;
    }

    .title-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.16rem;
      height: 0.44rem;
      background-color: var(--q-gb-bg-c-27);
      position: relative;
      .detail-back-a{
        width: 0.3rem;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex: 1 1;
        .detail-back {
          width: 0.3rem;
          height: 100%;
          background-position: center ;
          //background: url($SCSSPROJECTPATH + '/image/common/go_back.svg') no-repeat center / 96% 96%;
          background-size: 0.1rem auto;
          margin-left: 0.05rem;
         
        }
      }
      

      .virtual-title{
        text-align: center;
        font-weight: 500;
        font-size: 0.18rem;
        line-height: 0.44rem;
        color: var(--q-gb-t-c-18);
        position: absolute;
        width: 1.6rem;
        height: 0.44rem;
        top: 50%;
        left: 50%;
        margin-left: -0.8rem;
        margin-top: -0.22rem;
      }

      /*  刷新按钮 */
      @keyframes loading-ring-animate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .virtual-ref {
        width: 0.4rem;
        height: 100%;
        background: var(--q-color-com-img-bg-70) center no-repeat;
        background-size: 0.2rem auto;

        &.refreshing {
          animation: 0.7s loading-ring-animate linear;
        }
      }

      .no-single {
        width: 0.4rem;
        height: 100%;
        background-size: 0.2rem auto;
      }

      .main-menu-right {
        height: 0.22rem;
        line-height: 0.22rem;
        border-radius: 25px;
        float: right;
        background: var(--q-gb-bg-c-18);
        color: var(--q-gb-t-c-20);
        text-align: center;
        display: flex;
        align-items: center;
        padding: 0 0.1rem 0 0.03rem;
        margin-right: 0.1rem;
        .main-menu-right-symbol{
            font-family: 'Akrobat';
            font-style: normal;
            font-weight: 600;
        }
        .main-menu-right-money{
            font-family: ky-font;
            font-size: 15px;
            letter-spacing: .5px;
            font-style: normal;
            font-weight: 700;
            flex: 1;
            line-height: .26rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--q-gb-t-c-18);
        }
      }

      .set-menu {
        :deep(.filter-icon-wrapper) {
          width: 0.4rem;
          height: 0.44rem;
          margin-right: 0.1rem;
        }
      }
    }
  }
	/*  虚拟体育菜单 */
  .virtual-menu-list {
    display: flex;
    padding: 0 0.05rem;
    flex-wrap: nowrap;
    overflow: auto;
    font-size: 0.12rem;
    background: var(--q-gb-bg-c-21);
    .tabs-bar {
      width: 100%;

      .tabs-bar-nav {
        display: flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        height: 0.45rem;
        padding-left: 0.12rem;

        .tabs-tab {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-width: fit-content;
          padding-right: 0.18rem;
          &:last-child {
            padding-right: 0.2rem;
          }
          .sport-icon-wrap{
            --per: -0.22rem;
            display: block;
            width: auto;
            height: 0.22rem;
            width: 0.22rem;
            background-position: 0 0;
            background-size: 0.22rem auto;
          }
          .icon {
            position: relative;
            width: 0.22rem;
            height: 0.22rem;
            margin-bottom: 0.1rem;
            background: url($SCSSPROJECTPATH+"/image/png/sport_menu.png") no-repeat 0 0 / 0.22rem 19.52rem;
            --per: -0.32rem;

            .menu-new-icon {
              position: absolute;
              right: -0.3rem;
              top: -0.05rem;
            }
          }

          @each $virtual-id, $y in (1001, 29),
                                   (1004, 30),
                                   (1011, 23),
                                   (1002, 11),
                                   (1009, 24),
                                   (1010, 57) {
            .icon#{$virtual-id} {
              background-position-y: calc(var(--per) * #{$y});
            }
          }

          > span {
            font-family: PingFangSC-Medium;
            font-size: 0.1rem;
            text-align: center;
            color: var(--q-gb-t-c-19);
          }
          &.tabs-active > span {
            color: var(--q-gb-t-c-18);
          }
          
        }
      }
    }

    .item-inner {
      position: relative;
      z-index: 2;
      height: 100%;
      min-width: 0.8rem;
      border-radius: 0.05rem 0.05rem 0 0;
      overflow: hidden;

      .text-wrap {
        display: flex;
        justify-content: center;
        padding: 0 0.1rem;
        padding-top: 0.1rem;

        img {
          position: absolute;
          top: 0;
          left: -0.03rem;
          width: 0.24rem;
        }
      }

      .icon {
        width: 0.14rem;
        height: 0.14rem;

        margin-right: 0.04rem;
        display: none;
        background: url($SCSSPROJECTPATH+"/image/png/virtual_num.png")  no-repeat 0 0 / 100%;
        --per: -0.3rem;
      }

      @each $virtual-id, $y in (1001, 12),
                               (1002, 14),
                               (1004, 13),
                               (1010, 14),
                               (1009, 24),
                               (1011, 15) {
        .icon#{$virtual-id} {
          background-position-y: calc(var(--per) * #{$y});
        }
      }
    }
  }
}
</style>

