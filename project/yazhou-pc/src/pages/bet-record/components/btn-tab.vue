<template>
  <!--表格头部分 未结算已结算预约注单按钮tab-->
  <div class="tab-wrap relative-position">
    <!--未结算已结算预约注单按钮tab-->
    <div class="btn-wrap">
      <!-- 未结算注单按钮 -->
      <div
        class="btn"
        @click="toolClicked(0)"
        :class="{ active: toolSelected === 0 }"
      >
        {{ i18n_t("bet_record.outstanding_notes") }}
      </div>
      <!-- 已结算注单按钮 -->
      <div
        class="btn"
        @click="toolClicked(1)"
        :class="{ active: toolSelected === 1 }"
      >
        {{ i18n_t("bet_record.settled_note") }}
      </div>
      <!-- 预约注单按钮 -->
      <div
        class="btn"
        @click="toolClicked(2)"
        :class="{ active: toolSelected === 2 }"
      >
        {{ i18n_t("bet_record.book_note") }}
      </div>
    </div>
    <!-- 按钮后面的描述 -->
    <div class="bet-desc">
      <!-- 文字前面的点-->
      <div class="point"></div>
      <!--未结算文字描述-->
      <div class="text" v-if="toolSelected == 0">
        {{ i18n_t("bet_record.msg_1") }}
      </div>
      <!--已结算文字描述-->
      <div class="text" v-if="toolSelected == 1">
        <template v-if="toolIndex === 0">
          <!--此记录将显示今天所有已派奖彩的投注-->
          {{ i18n_t("bet_record.msg_2") }}
        </template>
        <template v-else-if="toolIndex == 1">
          <!--此记录将显示昨天所有已派奖彩的投注-->
          {{ i18n_t("bet_record.msg_3") }}
        </template>
        <template v-else-if="toolIndex == 2">
          <!--此记录将显示7天内所有已派奖彩的投注-->
          {{ i18n_t("bet_record.msg_4") }}
        </template>
        <template v-else-if="toolIndex == 3">
          <!--此记录将显示30天内所有已派奖彩的投注-->
          {{ i18n_t("bet_record.msg_5") }}
        </template>
        <template v-else>
          <!-- 此记录将显示所选范围内所有已派彩的投注 -->
          {{ i18n_t("bet_record.msg_6") }}
        </template>
      </div>
      <!-- 预约注单文字描述 此记录将显示所有未派彩的投注 -->
      <div class="text" v-if="toolSelected == 2">{{i18n_t('bet_record.msg_7')}}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { i18n_t } from "src/boot/i18n.js"
const toolSelected = ref(0);

const props = defineProps({
    toolIndex: Number, // 当前选中 tab 的下标
})

const emit = defineEmits("toolClicked");

/**
 * @description:记录切换 结算、未结算
 * @param f 0:未结算 1:已结算 2:预约注单
 * @return {undefined} undefined
 */
const toolClicked = (f) => {
  if (toolSelected.value != f) {
    toolSelected.value = f;
    emit("toolClicked", f);
  }
};
</script>

<style lang="scss" scoped>
/**表格头部分 未结算已结算预约注单按钮tab*/
.tab-wrap {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 10px;
  color: var(--q-gb-t-c-5);
  border-bottom: 1px solid var(--q-bet-record-color-8);
  height: 30px;
  /**未结算已结算预约注单按钮tab*/
  .btn-wrap {
    position: absolute;
    bottom: -1px;
    left: 0;
    display: flex;
    height: 30px;
    /**按钮样式*/
    .btn {
      margin-right: 5px;
      border: 1px solid var(--q-gb-bd-c-7);
      background: var(--q-gb-bg-c-10);
      color: var(--q-gb-t-c-5);
      height: 100%;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      padding: 0 10px;
      &.active {
        border: 1px solid var(--q-gb-bd-c-7);
        border-bottom: none;
        background: var(--q-gb-bg-c-11);
        color: var(--q-bet-record-color-28);
      }
    }
  }
  /**按钮后面的描述*/
  .bet-desc {
    display: flex;
    align-items: center;
    color: var(--q-gb-t-c-11);
    /**文字前面的点*/
    .point {
      margin-right: 5px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: var(--q-gb-t-c-11);
    }
  }
}
</style>
