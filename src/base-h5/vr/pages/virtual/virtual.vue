<!--
 * @Description: 虚拟体育最外层父组件，包括了上方的球种菜单切换
-->
<template>
  <div>
    <div class="virtual-main router_scroll_layout" ref="scrollArea" @scroll="wrapper_scroll_handler">
      <!-- 头部 -->
      <div class="virtual-head">
        <div class="type-bg" :class="'bg'+lodash.get(sub_menu_list,`[${sub_menu_i}].field1`)">
          <!-- 主题换肤 龙年元素 日间：theme-2   夜间：theme-1 -->
          <img v-if="UserCtr.theme == 'theme-2'" :src="compute_local_project_file_path('/image/home/h5_long_bg.png')" alt="">
          <img v-if="UserCtr.theme == 'theme-1'" :src="compute_local_project_file_path('/image/home/h5_long_gb2.png')" alt="">

          <!-- 返回按钮 及 刷新 注单  设置 按钮 -->
          <div class="title-wrap">
            <div class="detail-back-a">
              <div class="detail-back" @click="go_to_back(),go_where({back_to: 'go_back_from_virtual',  route_name:route.name,route,router})" :style="compute_css_obj({key: 'h5_back_img'})"></div>
            </div>
            <!-- 虚拟体育 -->
            <div class="col virtual-title">{{i18n_t('common.virtual_sports')}}</div>
            <!-- 复刻版暂时用不到先注释了 -->
            <!-- <set-menu /> -->

            <!-- 从macth顶部 搬运过来的  用户金额 -->
            <div class="main-menu-right" @click.stop="get_user_balance()">
                <!-- <span class="main-menu-right-symbol">￥</span> -->
                <img :src="compute_local_project_file_path('image/svg/home/coin.svg')" alt="" style="margin-right: 4px;">
                <span class="main-menu-right-money">{{ format_money2(balance) }}</span>
            </div>

          </div>
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
import { UserCtr } from "src/output/index.js";
import { h5_long_bg, h5_long_gb2 } from 'src/base-h5/core/utils/local-image.js'
import virtual_mixin from "src/core/vr/mixin/pages/virtual/virtual-mixin.js";
import virtualSports from "src/base-h5/vr/pages/virtual/virtual-sports-part/virtual-sports.vue";    // 虚拟体育
export default {
  mixins:[virtual_mixin],
  name:'match_main',
  components: {
    virtualSports,
  }
}
</script>

<style lang="scss" scoped>
.virtual-main {
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  overflow-x: hidden;
  overflow-y: auto;
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
      > img{
        position: absolute;
        width: 100%;
      }
    }

    .title-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.16rem;
      height: 0.44rem;
      // background-color: var(--q-gb-bg-c-27);
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
    // background-color: var(--q-gb-bg-c-27);
    position: relative;
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

