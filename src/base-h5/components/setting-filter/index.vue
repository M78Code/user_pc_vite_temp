<!--
 * @Description:设置弹出框内 滑动组件
    style中已经计算出最大高度，直接内容撑开即可
-->
<template>
  <div class="setting-filter">
    <div class="setting-top setting-item">
      <div class="title">
        联赛筛选
        <span v-if="league_select_count > 0">(已选{{league_select_count}}) </span>
        <span v-else>全部</span>
      </div>
      <div>
      </div>
      <div class="more row items-center justify-between"  @click="searchClick">
       <img
            class="league-icon"
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/league_icon.svg`"
            alt=""
          />
        <p>
        更多
        <img  
          :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/left_icon.svg`"
          srcset="">
        </p>
      
      </div>
    </div>
    <div class="setting-list">
      <div class="setting-item border" v-for="item in setting_list" :key="item.name">
        <div class="title">{{ item.name }}</div>
        <div class="more">
          <Switch
            :value="item.switchValue"
            :leftVal="item.leftVal"
            :rightVal="item.rightVal"
            @change_value="switch_handle(item)"
          />
        </div>
      </div>
      <div class="setting-item border" @click="jumpHandle">
        <div class="title">盘口教程</div>
        <div class="more">
        <img  
        :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/left_icon.svg`"
         srcset="">
        </div>
      </div>
      <div class="setting-item">
        <div class="title">前往旧版</div>
        <div class="goto-website">前往网页版</div>
      </div>
    </div>
    <div class="closed-btn" @click="closedHandle">
      <span>关闭</span>
    </div>
  </div>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { useMittEmit, MITT_TYPES,SessionStorage,UserCtr,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import {ref,computed} from "vue";
import Switch from "./components/switch.vue";
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
import { default_theme_key } from "src/core/theme/";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
defineOptions({
  name: "settingFilter" // 设置组件名称
});

const router = useRouter();

const jumpHandle = () => {
  router.push({ name: "handicapTutorial" }); // 此处跳转至盘口教程
  closedHandle();
};

defineProps({});

const emit = defineEmits(["closedHandle"]);

const setting_list = ref([
  {
    name: "投注模式",
    leftVal: "新手版",
    rightVal: "专业版",
    switchValue: UserCtr.standard_edition === 2 ? "rightVal" : "leftVal",
    mark: "version"
  },
  {
    name: "排序规则",
    leftVal: "热门",
    rightVal: "时间",
    switchValue: UserCtr.sort_type === 2 ? "rightVal" : "leftVal",
    mark: "sort"
  },
  {
    name: "盘口设置",
    leftVal: "欧洲盘",
    rightVal: "香港盘",
    switchValue: UserCtr.odds.cur_odds === "HK" ? "rightVal" : "leftVal",
    mark: "Handicap"
  },
  // { name: '字号大小', leftVal: '默认', rightVal: '放大',mark:'size' },
  {
    name: "主题风格",
    leftVal: "日间",
    rightVal: "夜间",
    switchValue: UserCtr.theme === "theme-1" ? "rightVal" : "leftVal",
    mark: "theme"
  },
  {
    name: "每日活动",
    leftVal: "开启",
    rightVal: "关闭",
    switchValue: UserCtr.daily_activities ? "leftVal" : "rightVal",
    mark: "activity"
  }
]);

const closedHandle = () => {
  emit("closedHandle");
    useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
    text: "footer-refresh"
  })
};
/**
 * 选中的联赛数量
 */
const league_select_count = computed(() =>{
  return UserCtr.league_select_list.length
})
/**
 * 打开联赛筛选框
 */
const searchClick = () => {
    // console.log(`搜索足球`)
    // 派发首页设置菜单展开事件
    emit("closedHandle");
    useMittEmit(MITT_TYPES.EMIT_CHANGE_SEARCH_FILTER_SHOW, {
      open: true,
    });

}
/**
 *@description 设置菜单改变
 *@return {Undefined} undefined
 */
const switch_handle = item => {
  item.switchValue = item.switchValue === "rightVal" ? "leftVal" : "rightVal";
  const typeMap = {
    version: version_handle,
    sort: sort_handle,
    Handicap: Handicap_handle,
    size: size_handle,
    theme: theme_handle,
    activity: activity_handle
  };
  typeMap[item.mark] && typeMap[item.mark](item);
};
/**
 *@description 处理版本改变
 *@return {Undefined} undefined
 */
const version_handle = item => {
  const status = item.switchValue === "rightVal" ? 2 : 1;
  UserCtr.set_standard_edition(status);
  useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP);
  MatchMeta.compute_page_render_list({ scrollTop: 0, type: 2, is_scroll: false })
  // if (status === 1) {
  //   setTimeout(() => {
  //     useMittEmit(MITT_TYPES.EMIT_HANDLE_START_OBSERVER);
  //   }, 1000)
  // }
};
/**
 *@description 处理排序规则
 *@return {Undefined} undefined
 */
const sort_handle = item => {
  const status = item.switchValue === "rightVal" ? 2 : 1;
  UserCtr.set_sort_type(status);
};
/**
 *@description 处理盘口设置
 *@return {Undefined} undefined
 */
const Handicap_handle = item => {
  const status = item.switchValue === "rightVal" ? "HK" : "EU";
  UserCtr.set_cur_odds(status);
};
/**
 *@description 处理字号大小
 *@return {Undefined} undefined
 */
const size_handle = item => {
  console.log("item", item);
};
/**
 *@description 处理主题风格
 *@return {Undefined} undefined
 */
const theme_handle = item => {
  const status = item.switchValue === "rightVal" ? "theme-1" : "theme-2";
  UserCtr.set_theme(status);
  // 切换主题色
  useMittEmit(MITT_TYPES.EMIT_THE_THEME_CHANGE)
};
/**
 *@description 处理每日活动
 *@return {Undefined} undefined
 */
const activity_handle = item => {
  const status = item.switchValue === "rightVal" ? false : true;
  UserCtr.set_daily_activities(status);
};
</script>
<style scoped lang="scss">
// 组件样式
.setting-filter {
  width: 100%;
  max-width: unset !important;
  /*  兼容性问题,高度的调整影响到安卓手机的软键盘弹出 */
  max-height: calc(var(--vh, 1vh) * 100 - 80px) !important;
  //   border-radius: 0.16rem 0.16rem 0 0;
  position: absolute;
  bottom: 0;
  background: var(--q-gb-bg-c-15);
  backdrop-filter: blur(5px);
  z-index: 99;

  .setting-top.setting-item {
    border-bottom: 0.08rem solid var(--q-gb-t-c-8);
    padding: 0.14rem;
    margin: 0;
    height: 0.5rem;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.14rem;
    padding: 0.14rem 0;
    margin: 0 0.14rem;

    &.border {
      border-bottom: 1px solid var(--q-gb-bd-c-4);
    }

    .title {
      color: var(--q-gb-t-c-20);

      span {
        color: var(--q-gb-bd-c-4);
      }
    }

    .more {
      color: var(--q-gb-t-c-19);
    }

    .goto-website {
      width: 1.04rem;
      height: 0.28rem;
      line-height: 0.28rem;
      background-color: #f3faff;
      border-radius: 0.18rem;
      text-align: center;
      //color: #7981a4;
      color: var(--q-gb-t-c-11);
      font-weight: 500;
    }
  }

  .closed-btn {
    display: flex;
    padding: 0.13rem;
    align-items: center;
    justify-content: center;
    border-top: 0.08rem solid var(--q-gb-t-c-8);

    span {
      font-size: 0.18rem;
    }
  }
}
</style>