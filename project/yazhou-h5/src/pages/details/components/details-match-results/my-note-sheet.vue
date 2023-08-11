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
import commonCathecticItem from "src/project/components/common/common_cathectic_item";
import {mapGetters} from "vuex";
import settleVoid from "src/project/pages/cathectic/settle_void";
import common from "src/project/mixins/constant/module/common.js"

export default {
  mixins:[common],
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
    this.container_height = innerHeight - this.rem(1.68);
  },
  computed: {
    ...mapGetters(["get_note_sheet_records_data"])// 待确认中的提前结算订单
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
