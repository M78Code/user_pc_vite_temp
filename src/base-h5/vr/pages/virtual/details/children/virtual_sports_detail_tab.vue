<!--
 * @Date: 2023-12-14 
 * @Description: 虚拟体育详情tab
-->
<template>
  <div ref='details_tab' class="row vir-details-tab" v-cloak>
    <q-tabs v-model="viewTab" inline-label narrow-indicator class="bg-tabs" active-color="active-tab"
      @update:model-value="change_tab" :content-class="curr_active_tab">
      <q-tab v-for="item in tab_list" :label="item.name" :key="item.id" />
    </q-tabs>

  </div>
</template>

<script>
export default {
  name: 'virtual_sports_detail_tab',
  data() {
    return {
      tab_list: [
        { name: "历史战绩", id: 1 },
        { name: "投注", id: 2 },
        { name: "排行榜", id: 3 }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.vir-details-tab {
  height: 0.4rem;
  margin-bottom: 0.04rem;
  width: 100%;
}

.menu-third {
  padding-right: 0.1rem;
  height: 0.4rem;
  line-height: 0.4rem;
  position: relative;
  float: left;
  text-align: center;

  &:after {
    content: ' ';
    display: block;
    width: 1px;
    height: 0.21rem;
    position: absolute;
    top: 0.1rem;
  }
}

.tab-fixed {
  position: fixed;
  top: 2.04rem;
  z-index: 90;
}
</style>