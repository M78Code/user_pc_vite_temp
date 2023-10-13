<template>
  <div
    @click="lv_2_click_wapper_3({ lv1_mi: item1, lv2_mi: item2.mi })"
    v-for="item2 in props.menu_list"
    :key="`${item2.mi}_2000`"
    :class="props.current_lv_2_mi == item2.mi ? 'active' : ''"
    class="menu-item menu-fold2"
  >
    <div class="row items-center relative-position">
      <span class="menu-point"></span>
      <span class="menu-text ellipsis">
        {{ base_data.menus_i18n_map[`${item2.mi}`] || "" }}
      </span>
    </div>
    <div class="col-right relative-position" style="min-width: 40px">
      <span class="match-count yb-family-odds"> </span>
    </div>
  </div>
</template>

<script setup>
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
  base_data: {
    type: Object,
    default: () => ({}),
  },
});

const lv_2_click_wapper_3 = (lv1_mi, lv2_mi) => {};
</script>
