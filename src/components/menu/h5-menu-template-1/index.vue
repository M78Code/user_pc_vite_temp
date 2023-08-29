<template>
  <div class="menu-container">
    <ul class="menu-container-lv1">
      <li v-for="(item, index) in menu_list">
        <span @click="setMenu(item)">
          {{ menu_obj.lv_1_menu_map[item.mi] || item.mi }}
          {{ t(`new_menu.${item.mi}`)  }}
          </span
        >
      </li>
    </ul>
    <ul class="menu-container-lv2">
      <li v-for="(item, index) in current_menu.sl">
        <span @click="setMenuItem(item)">
          {{
            base_data.menus_i18n_map[menu_obj.recombine_menu_desc(item.mi)] ||
            ""
          }}<i>{{ item.ct }}</i>
        </span>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { t } from "src/core/index.js";;
import menu_obj from "src/core/menu-h5/menu-data-class.js";
const props = defineProps({
  // 菜单配置
  menu_config: {
    type: Object,
    default: () => {},
  },
  base_data: {
    type: Object,
    default: () => {},
  },
});
const current_menu = ref("101");
//选中的球类
const current_menu_item = ref("");
const menu_list = ref([]);
const e_uid = ref("");
onMounted(() => {
  menu_list.value = menu_obj.recombine_menu(props.base_data.mew_menu_list_res);
  setMenu(menu_list.value[0]);
});
//选中二级菜单
const setMenuItem = (item) => {
  current_menu_item.value = item;
  menu_obj.set_current_lv2_menu(item);
};
const setMenu = (item) => {
  current_menu.value = item;
  menu_obj.set_current_menu(item);
};
</script>
<style lang="scss">
.menu-container-lv1 {
  display: flex;
  list-style: none;
  li {
    list-style: none;
    flex: 1;
    text-align: center;
  }
}
.menu-container-lv2 {
  overflow-x: auto;
  overflow-y: hidden;
  padding-top: 0.13rem;
  padding-bottom: 0.05rem;
  flex-wrap: nowrap;
  display: flex;
  list-style: none;
  li {
    width: 0.7rem;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    &.champion {
      // width: 0.9rem;
    }
    &.current {
      .inner-w {
        position: relative;
        font-size: 0.1rem;
        &.favorite {
          &:after {
            background: rgba(255, 145, 36, 0.08);
          }
        }
      }
    }
    .inner-w {
      height: 0.41rem;
      flex-direction: column;
      flex-wrap: nowrap;
      position: relative;
      .sport-w-icon {
        height: 0.27rem;
        position: relative;
        .sport-icon-wrap {
          --per: -0.32rem;
          display: block;
          width: auto;
          height: 0.22rem;
          width: 0.22rem;
        }
        .sport-icon-wrap2 {
          position: absolute;
          bottom: 0;
          right: -0.04rem;
          width: 0.13rem;
          height: 0.14rem;
        }
        .sport-match-count {
          width: 1px;
          height: 1px;
          line-height: 1;
          position: absolute;
          right: -0.03rem;
          top: 0;
          font-size: 0.11rem;
        }
      }
      .s-w-i-title {
        max-width: 0.7rem;
        font-size: 0.1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        top: -0.01rem;
      }
    }
  }
}
</style>
