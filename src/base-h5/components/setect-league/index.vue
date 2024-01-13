<!--
 * @Description:设置弹出框内 滑动组件
-->
<template>
  <!-- :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/league-collapse-icon-black.svg`" alt=""> -->
  <div class="select-league">
    <div class="sl-header">
    <!-- 取消 -->
      <div class="sl-btn" @click="closed">{{ i18n_t('common.cancel') }}</div>
      <!-- 选择联赛 -->
      <div class="sl-title">{{ i18n_t('filter.match_select_title') }}</div>
      <!-- 完成 -->
      <div class="sl-btn" @click="finishHandle">{{ i18n_t('common.finish') }}</div>
    </div>
    <div class="sl-search">
      <div class="sl-input-content">
        <div class="sl-icon-left">
          <img
            class="search-icon"
            :src="compute_local_project_file_path('/image/list/league-search-icon.svg')"
            alt=""
          />
        </div>
        <input
          class="sl-input"
          v-model="search_val"
          :placeholder="i18n_t('filter.match_key')" 
          type="text"
          maxlength="15"
        />
        <div class="sl-icon-right">
          <img
            v-if="search_val.length > 0"
            class="clear-icon"
            :src="compute_local_project_file_path('/image/list/league-close-icon.svg')"
            alt=""
            @click="clear_text"
          />
        </div>
      </div>
    </div>
    <!-- <div class="sl-filter-content"> -->
    <!-- 只有滚球全部走的这个 -->
    <match-filter-old ref="matchRef" 
                      :search_val="search_val"
                      v-if="MenuData.get_sub_is_all()"></match-filter-old>
    <!-- 今日早盘串关等 走新逻辑 -->
    <match-filter  v-else
                   ref="matchRefOld"
                  :league_select_list='UserCtr.league_select_list'
                  :search_val="search_val"></match-filter>
    <!-- </div> -->
  </div>
</template>
<script setup>
import { i18n_t, compute_css_obj } from "src/output/index.js";
import { useRouter, useRoute } from "vue-router";
import matchFilter from "src/base-h5/components/match-filter/index.vue";
import matchFilterOld from "src/base-h5/components/match-filter/index_old.vue";
import { reactive, toRefs, ref } from "vue";
import { useMittEmit, MITT_TYPES, MenuData } from "src/output/index.js";
import {LOCAL_PROJECT_FILE_PREFIX,compute_local_project_file_path} from "src/output/index.js";
import { UserCtr } from "src/output/index.js";
defineOptions({
  name: "selectLeague" // 设置组件名称
});

const router = useRouter();
//数据

//选中的值
const search_val = ref('')
//选中的值
const select_list = ref(MenuData.league_filter_list || [])
//组件数据
let matchRef = ref(null);
let matchRefOld = ref(null);

let rem_1 = (window.innerWidth * 100) / 375;
const bounced_high = {
  height: window.innerHeight - rem_1 + 50 + "px !important"
};
const emit = defineEmits(["search_fn","closedHandle"]);


/**
 * @description: 筛选完成
 * @param {Array} select_list 选中的数据
 */
const finishHandle = () => {
  if (MenuData.get_sub_is_all()) {
    select_list.value = matchRef.value.list.filter(v=>v.select)
  } else {
    select_list.value = matchRefOld.value.list.filter(v=>v.select)
  }
  // 派发首页设置菜单展开事件
  useMittEmit(MITT_TYPES.EMIT_CHANGE_SETTING_SHOW, {
    open: false
  });
  // 触发联赛选择完成事件
  useMittEmit(MITT_TYPES.EMIT_SELECT_LEAGUE_COMPLETE, {
    open: true,
    select_list: select_list.value,
  });
  //设置选中数据
  UserCtr.set_league_select_list(select_list)
  emit("closedHandle");
};
/**
 * @description: 取消
 * @param 
 */
const closed = () => {
  emit("closedHandle");
    useMittEmit(MITT_TYPES.EMIT_CHANGE_SETTING_SHOW, {
    open: true,
  });
};
/**
 * @description: 清空所有值
 * @param 
 */
const clear_text = () => {
  search_val.value = ''
};
defineProps({});
</script>
<style scoped lang="scss">
// 组件样式
.select-league {
  width: 100%;
  max-width: unset !important;
  /*  兼容性问题,高度的调整影响到安卓手机的软键盘弹出 */
  // max-height: calc(var(--vh, 1vh) * 100 - 80px) !important;
  border-radius: 0.16rem 0.16rem 0 0;
  position: absolute;
  bottom: 0;
  background: var(--q-gb-bg-c-23) ;
  backdrop-filter: blur(5px);
  height: 85%;
  .sl-header {
    display: flex;
    justify-content: space-between;
    padding: 0.18rem 0.2rem;
    align-items: baseline;
    background:var(--q-gb-bg-c-25);
    .sl-title {
      font-size: 0.18rem;
      color: var(--q-gb-t-c-18);
    }
    .sl-btn {
      font-size: 0.16rem;
      color: var(--q-gb-t-c-1);
    }
  }
  .sl-search {
    display: flex;
    padding: 0 0.2rem;
    background:var(--q-gb-bg-c-25);
    .sl-input-content {
      height: 0.4rem;
      width: 100%;
      background: var(--q-gb-bg-c-18);
      border-radius: 0.4rem;
      padding: 0 0.42rem;
      display: flex;
      align-items: center;
      position: relative;
      .sl-icon-left {
        position: absolute;
        left: 0.16rem;
        transform: translateY(0.02rem);
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
        background: transparent;
        outline: none;
        border: none;
        width: 100%;
        caret-color: var(--q-gb-t-c-1);
        font-size: 0.14rem;
        color: var(--q-gb-t-c-18);
        &::placeholder{
          color: var(--q-gb-t-c-16);
        }
      }
    }
  }

  .sl-filter-content {
    //position: relative;
    //transform: translateY(1.03rem);
  }
}
</style>/index.jssrc/output