<!--
 * @Author:
 * @Date: 2021-09-29
 * @Description: 详情页 电竞第几局 以及 赛事时间
-->
<template>
  <!-- 电竞dota2 -->
  <div class="stage_child_101">
    <span>{{ i18n_t(Stage) }}</span>
    <!-- <span>{{lodash.get(i18n_t('mmp') ,"[detail_data.csid][detail_data.mmp]") }}</span> -->
    <!-- 倒/正计时组件 -->
    <counting-down
      v-if="+detail_data.mmp >0 && +detail_data.mst > 0"
      :title="null"
      :mmp="detail_data.mmp"
      :m_id="detail_data.mid"
      :second="detail_data.mst"
      :match="detail_data"
      :is_add="[100,101,102,103,104].includes(+detail_data.csid)"
      class="counting-down"
    />
  </div>
</template>

<script setup>
import countingDown from 'src/base-h5/components/common/counting-down.vue'
import { computed } from 'vue'

const props = defineProps(["detail_data"])

const Stage = computed(()=>{
  const { csid,mmp } = props.detail_data || {}
  return `mmp.${csid}.${mmp}`
})
</script>

<style lang="scss" scoped>
.stage_child_101 {
  display: flex;
  justify-content: center;
  align-items: center;
  .counting-down{
    position: unset;
    margin-left: .08rem;
  }
}
</style>
<style lang="scss">
.theme01 {
  .counting-down-wrap {
    .counting {
      font-family: dinMedium;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.theme02 {
  .counting-down-wrap {
    .counting {
      font-family: dinMedium;
      color: #fff;
    }
  }
}
</style>
