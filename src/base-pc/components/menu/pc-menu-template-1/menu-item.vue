<template>
  <div
    @click="lv_2_click_wapper_3(item2.mi)"
    v-for="item2 in props.menu_list"
    :key="`${item2.mi}_2000`"
    :class="props.current_lv_2_mi == item2.mi ? 'active' : ''"
    class="menu-item menu-fold2"
  >
    <div class="row items-center relative-position">
      <span class="menu-point"></span>
      <span class="menu-text ellipsis">
        {{ BaseData.menus_i18n_map[`${item2.mi}`] || "" }}
      </span>
    </div>
    <div class="col-right relative-position" style="min-width: 40px">
      <span class="match-count yb-family-odds"> </span>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['click_wapper_handle'])
import BaseData from "src/core/base-data/base-data.js"

const props = defineProps({
  // 菜单配置
  menu_list: {
    type: Object,
    default: () => [],
  },
  current_lv_2_mi: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: '',
  },
});

/**
 *      电竞    子菜单     点击
 */
const lv_2_click_wapper_3 = (lv2_mi) => {
  let config = {
    lv1_mi: props.type,
    lv2_mi
  }
  const config_data = {
    config,
    type: props.type
  }

  emit('click_wapper_handle',config_data)
};
</script>

<style lang="scss" scoped>
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
        padding: 0px;

        .item {
          border-radius: 8px;
          margin-right: 10px;
          white-space: nowrap;
          margin-right: 0 !important;
          height: 38px !important;
          background-size: 100% 100%;
          min-width: 98px;
          padding-bottom: 4px;
          box-shadow: none !important;
          &:last-child {
            margin-right: 0;
          }

          &.active {
            font-weight: 600;
            font-size: 14px;
            color: var(--q-gb-t-c-18);
          }

          &.active1 {
            margin-left: 152px;
          }
        }
      }
      &.menu-fold1 {
        &.y-active {
          background: var(--q-gb-bg-lg-8);
          color: var(--q-gb-t-c-15);
        }
        &:hover {
          background: var(--q-gb-bg-lg-9);
        }
      }
      &.menu-fold2 {
        &.active {
          color: var(--q-gb-t-c-15);
        }
      }
    }
    .menu-y-border {
      .menu-fold1 {
        border-top: 1px solid var(--q-gb-bd-c-8);
        border-bottom: 1px solid var(--q-gb-bd-c-8);
        &.y-active {
          border: none;
        }
      }
    }
    .menu-b-border {
      .menu-fold1 {
        border-bottom: 1px solid var(--q-gb-bd-c-8);
        &.y-active {
          border: none;
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

      &.active {
        font-weight: 700;
        border-bottom: 0;
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
      border: 2px solid #ff781d;
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
          color: #ff781d;
          font-weight: bold;
        }
      }

      .triangle,
      .triangle1 {
        position: absolute;
        background: var(--q-gb-bg-c-4);
        border: 2px solid #ff781d;
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
</style>
