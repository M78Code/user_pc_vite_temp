<template>
  <div class="choose-carefully-wrapper" :style="{height:`${container_height}px`}">
    <div v-if="Object.keys(get_note_sheet_records_data).length > 0">
      <!-- 加载中 -->
      <div v-for="(value,name,index) in get_note_sheet_records_data" :key="index" >
        <div v-for="(item2,key) in value.data" :key="key" class="my-4">
          <common-cathectic-item :item_data="item2"></common-cathectic-item>
        </div>
      </div>
    </div>
    <!-- 去投注 -->
    <settle-void v-if="Object.keys(get_note_sheet_records_data).length <= 0"></settle-void>
  </div>
</template>

<script>
import commonCathecticItem from "src/base-h5/components/common/common-cathectic-item.vue";
// import {mapGetters} from "vuex";
import settleVoid from "src/base-h5/components/cathectic/settle-void.vue";
// import common from "src/base-h5/mixins/constant/module/common.js"

export default {
  // mixins:[common],
  name: "",
  components: {
    commonCathecticItem,
    settleVoid,
  },
  provide(){
    return {
      queryorderpresettleconfirm_data: '',  // 待确认中的提前结算订单，实际上赛果页面不会有未结算的订单，这里是占位，避免报错
    }
  },
  data() {
    return {
      list_data: {},  //列表数据
      container_height:0
    }
  },
  mounted() {
    tcontainer_height = innerHeight - trem(1.68);
  },
  computed: {
    // ...mapGetters(["get_note_sheet_records_data"])// 待确认中的提前结算订单
  },
};
</script>

<style lang="scss" scoped>
.choose-carefully-wrapper {
  width: 100%;
  border-top: 1px solid transparent;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
