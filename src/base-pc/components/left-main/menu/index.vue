<template>
  <!-- 菜单项 -->
  <div v-show="LayOutMain_pc.layout_left_show == 'menu'" class="menu-wrap">
    <!-- 现场滚球盘 -->
    <div @click="new_menu_click(1)" class="menu-item menu-top menu-roll menu-border border-bottom" style="margin-bottom: 0px"
      :class="MenuData.menu_root == 1 && 'active'">
      <!-- 现场滚球盘 -->
      <span class="record-icon" :style="compute_css_obj('pc-img-play-match')"></span>
      <div class="col">
        {{ i18n_t("common.in_plays") }}
      </div>

      <div class="col-right">
        <span class="match-count yb-family-odds">
          {{ MenuData.menu_root_count.mi_1 }}
        </span>
      </div>
    </div>

    <div style="display:none;"> {{ MenuData.menu_data_version }}  </div>

    <!-- 热门赛事 -->
    <div @click="new_menu_click(500)" class="menu-item menu-top menu-play menu-border border-bottom"
      :class="MenuData.menu_root == 500 && 'active'"
      :id="DOM_ID_SHOW && `menu-${MenuData.add_mi_introduce.mi_500.label}`">
      <!-- 热门赛事图标 -->
      <span class="record-icon" :style="compute_css_obj('pc-img-hot-match')"></span>
      <div class="col">
        {{ i18n_t("menu.match_hot") }}
      </div>
      <div class="col-right">
        <!-- 热门赛事数量 -->
        <span class="match-count yb-family-odds">
          {{ MenuData.menu_root_count.mi_500 }}</span>
      </div>
    </div>

    <div style="display: none">{{ base_data_instance.base_data_version }}</div>
    <!-- 体育菜单 -->
    <menu-wapper use_component_key="PcMenuTemplate1" :base_data="base_data_instance"
      :version="base_data_instance.base_data_version"></menu-wapper>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

import base_data_instance from "src/core/base-data/base-data.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { MenuData } from "src/output/index.js";
import {LayOutMain_pc} from "src/output/project/index.js";
import { compute_css_obj } from 'src/core/server-img/index.js'

import { MenuWapper } from "src/base-pc/components/menu/index.js";

const router = useRouter();

const props = defineProps({
  // 自动化测试
  DOM_ID_SHOW: {
    type: Boolean,
    default: () => false,
  },
});

/**
 * 新菜单点击
 */
const new_menu_click = (root) => {
  // if(!['101201','101',].includes(root) ){
  //   set_unfold_multi_column(false)
  // }
  let mid_menu_show = {};

  let lv2_mi = "";
  if (root == 1) {
    mid_menu_show.list_filter = true;
    // 滚球 默认全部
    lv2_mi = 1;
  } else if (root == 500) {
    mid_menu_show.list_filter_hot = true;
    // 热门默认赛事
    let mi_500_obj = base_data_instance.mew_menu_list_res.find(
      (x) => x.mi == 500
    ) || {
      sl: [],
    };
    // 热门赛事有值的
    let { mi } = mi_500_obj["sl"].find((item) => item.ct);
    lv2_mi = mi;
  }
  // 清除数据 和 重置收藏
  set_route_url();

  let params = {
    root: root,
    lv1_mi: "",
    lv2_mi,
    sports: "",
    guanjun: "",
  };
  // 设置 中间 菜单输出
  MenuData.set_mid_menu_result(params);

  // 设置 左侧菜单
  MenuData.set_left_menu_result({
    root: root,
    lv1_mi: "",
    lv2_mi,
    sports: "",
    guanjun: "",
    mid_menu_show,
    has_mid_menu: true,
  });
};

/**
 * 详情页回首页
 */
const set_route_url = () => {
  let { name } = router;
  if (["details", "search", "video", "virtual_details"].includes(name)) {
    router.push({ path: "/home" });
  }
  useMittEmit(MITT_TYPES.EMIT_LAYOUT_LIST_TYPE, "match");
};
</script>

<style scoped lang="scss">
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
        padding: 10px 4px;

        .item {
          height: 30px;
          border-radius: 8px;
          margin-right: 10px;
          flex: 1;
          white-space: nowrap;
          max-width: 95px;

          &:last-child {
            margin-right: 0;
          }

          &.active {
            font-weight: 600;
            font-size: 14px;
          }

          &.active1 {
            margin-left: 152px;
          }
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
      &:hover{
        background: var(--q-gb-bg-lg-9);
      }

      &.active {
        font-weight: 700;
        border-bottom: 0;
        background: var(--q-gb-bg-lg-8);
        border-right: 0;
        position: relative;
        border-width: 0;
        color: var(--q-gb-t-c-15); 
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
        border-right: 2px solid transparent;

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
      border: 2px solid var(--q-gb-bd-c-8);
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
          color: var(--q-gb-bd-c-8);
          font-weight: bold;
        }
      }

      .triangle,
      .triangle1 {
        position: absolute;
        background: var(--q-gb-bg-c-4);
        border: 2px solid var(--q-gb-bd-c-8);
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

.record-icon{
  background-size: 100% 100%;
  width: 14px;
  height: 14px;
  margin-right: 10px;
}
.border-bottom{
  border-bottom: 1px solid var(--q-gb-bd-c-8);
}
</style>