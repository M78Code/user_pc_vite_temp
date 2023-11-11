<!--
 * @Description:设置弹出框内 滑动组件
-->
<template>
  <!-- :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/league-collapse-icon-black.svg`" alt=""> -->
  <div class="select-league" :style="bounced_high">
    <div class="sl-header">
      <div class="sl-btn" @click="closedHandle">取消</div>
      <div class="sl-title">选择联赛</div>
      <div class="sl-btn" @click="finishHandle">完成</div>
    </div>
    <div class="sl-search">
      <div class="sl-input-content">
        <div class="sl-icon-left">
          <img
            class="search-icon"
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/search.svg`"
            alt=""
          />
        </div>
        <input
          class="sl-input"
          v-model="search_val"
          placeholder="请输入联赛名"
          type="text"
          maxlength="15"
        />
        <div class="sl-icon-right">
          <img
            v-if="search_val.length > 0"
            class="clear-icon"
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/delete.svg`"
            alt=""
          />
        </div>
      </div>
    </div>
    <!-- <div class="sl-filter-content"> -->
    <match-filter ref="match_com" :search_val="search_val"></match-filter>
    <!-- </div> -->
  </div>
</template>
<script setup>
import { i18n_t, compute_css_obj } from "src/core/index.js";
import { useRouter, useRoute } from "vue-router";
import matchFilter from "src/base-h5/components/match-filter/index.vue";
import { reactive, toRefs, ref } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/index.js";

defineOptions({
  name: "selectLeague" // 设置组件名称
});

const router = useRouter();
//数据
const state = reactive({
  //搜索值
  search_val: ""
});
//组件数据
const match_com = ref();
let { search_val } = toRefs(state);

let rem_1 = (window.innerWidth * 100) / 375;
const bounced_high = {
  height: window.innerHeight - rem_1 + 50 + "px !important"
};
const emit = defineEmits(["closedHandle", "finishHandle", "search_fn"]);

const closedHandle = () => {
  emit("closedHandle");
};

const finishHandle = () => {
  let filter_data = [];
  filter_data = [match_com.value || []].filter(v => v.select);
  emit("closedHandle", filter_data);
  // 派发首页设置菜单展开事件
  useMittEmit(MITT_TYPES.EMIT_CHANGE_SETTING_SHOW, {
    open: true
  });
  console.log("match_filter", match_com.value);
  // emit("finishHandle");
};
defineProps({});
</script>
<style scoped lang="scss">
// 组件样式
.select-league {
  width: 100%;
  max-width: unset !important;
  /*  兼容性问题,高度的调整影响到安卓手机的软键盘弹出 */
  max-height: calc(var(--vh, 1vh) * 100 - 80px) !important;
  border-radius: 0.16rem 0.16rem 0 0;
  position: absolute;
  bottom: 0;
  background: var(--q-gb-bg-c-15) !important;
  backdrop-filter: blur(5px);
  .sl-header {
    display: flex;
    justify-content: space-between;
    padding: 0.18rem 0.2rem;
    align-items: baseline;
    .sl-title {
      font-size: 0.18rem;
    }
    .sl-btn {
      font-size: 0.16rem;
      color: var(--q-gb-t-c-1);
    }
  }
  .sl-search {
    display: flex;
    padding: 0 0.14rem;
    .sl-input-content {
      height: 0.4rem;
      width: 100%;
      background: var(--q-gb-t-c-6);
      border-radius: 0.4rem;
      padding: 0 0.42rem;
      display: flex;
      align-items: center;
      position: relative;
      .sl-icon-left {
        position: absolute;
        left: 0.16rem;
        .search-icon {
          width: 0.18rem;
          height: 0.18rem;
          -background: var(--q-gb-t-c-1);
        }
      }
      .sl-icon-right {
        position: absolute;
        right: 0.16rem;
        .clear-icon {
          width: 0.12rem;
          height: 0.12rem;
          -background: var(--q-gb-t-c-1);
        }
      }
      .sl-input {
        background: var(--q-gb-t-c-6);
        outline: none;
        border: none;
        width: 100%;
        font-size: 0.14rem;
      }
    }
  }

  .sl-filter-content {
    //position: relative;
    //transform: translateY(1.03rem);
  }
}
</style>