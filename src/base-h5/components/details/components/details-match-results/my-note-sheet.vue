<template>
  <div class="choose-carefully-wrapper"  :style="page_style" >
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

<script setup>
const page_style = ref('')
page_style.value = compute_css_variables({ category: 'component', module: 'cathectic' })
import { compute_css_variables } from "src/core/css-var/index.js"
import commonCathecticItem from "src/base-h5/components/common/common-cathectic-item.vue";
// import {mapGetters} from "vuex";
import settleVoid from "src/base-h5/components/cathectic/settle-void.vue";
import  matchDetail from "src/core/match-detail/match-detail-class.js"
import { onMounted,ref,provide  } from "vue";
provide("queryorderpresettleconfirm_data","") // 待确认中的提前结算订单，实际上赛果页面不会有未结算的订单，这里是占位，避免报错
const  list_data = ref({})  //列表数据
const container_height =ref(0)
const  get_note_sheet_records_data= ref(matchDetail.get_my_sheet())
onMounted(()=>{
    // tcontainer_height.value = innerHeight - rem(1.68)
    // get_note_sheet_records_data.value = matchDetail.get_my_sheet()
})

</script>

<style lang="scss" scoped>
.choose-carefully-wrapper {
  width: 100%;
  border-top: 1px solid transparent;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}
</style>
