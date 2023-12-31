<!--
 * @Author: jamison pmtyjamison@itcom888.com
 * @Date: 2023-11-07 21:45:55
 * @LastEditors: jamison pmtyjamison@itcom888.com
 * @LastEditTime: 2023-11-08 19:57:17
 * @FilePath: \user-pc-vite\src\base-h5\components\menu\app-h5-menu\tab\screen-modal.vue
 * @Description: 
-->
<!--
 * @Description:设置弹出框内 滑动组件
-->
<template>
  <div class="setting-filter" :style="bounced_high">
    <header class="top_title">
      <p>联赛选择/赛事搜索</p>
    </header>
    <div>
      <!-- 搜索input 输入框 -->
      <q-input
        class="quasar_input"
        maxlength="15"
        borderless
        outlined
        v-model="input_text"
        :input-class="{ 'search-keyword-input': true }"
        type="search"
        placeholder="请输入联赛/球队名称进行搜索"
        @blur="get_search_result"
      >
        <!-- 输入框的扩大镜图片 -->
        <template v-slot:prepend>
          <img
            class="search-icon"
            :class="[`icon-search ${get_y0_suffix}`, { 'input-without-word': !input_text.length }]"
            :src="compute_local_project_file_path('/image/list/league-search-icon.svg')"
             @click.stop.prevent.self="get_search_result"
            alt=""
          />
        </template>
        <template v-slot:append>
          <img
             v-show="input_text.length > 0"
            :class="{ 'input-without-word': !input_text.length }"
            class="clear-icon"
            :src="compute_local_project_file_path('/image/list/league-close-icon.svg')"
            @click.stop.prevent.self="clear_search"
            alt=""
          />
        </template>
      </q-input>
      <div class="content" v-if="list_data.length>0">
        <!-- 全选 -->
        <section class="all_select row justify-between items-center">
          <p class="row all_select_left">
            <img
              class="img"
              src="/src/base-h5/components/menu/app-h5-menu/tab/img/eventicons.svg"
              alt
            />
            <span>所有赛事</span>
          </p>
          <img
            class="select_img"
            v-show="!is_all_checked"
            @click="all_select"
            src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_nor.svg"
            alt
          />
          <img
            class="img"
            v-show="is_all_checked"
            @click="all_select"
            src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_sel.svg"
            alt
          />
        </section>
        <!-- 联赛 -->
        <section class="league_list" v-for="(type_item,type_index) in list_data" :key="type_index">
          <div class="league_title row justify-between items-center">
            <p class="text row justify-between items-center">
              <span>{{type_item.leagueName}}</span>
              <span class="league_num">{{type_item.matchList.length}}</span>
            </p>
            <img
              class="select_img"
              v-show="!type_item.checked"
              @click="league_select(type_item)"
              src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_nor.svg"
              alt
            />
            <img
              class="img"
              v-show="type_item.checked"
              @click="league_select(type_item)"
              src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_sel.svg"
              alt
            />
          </div>
          <ul class="list_info">
            <li
              class="list_data row items-center justify-between"
              v-for="match_item in type_item.matchList"
              :key="match_item.mid"
            >
              <p class="league_name row items-center">
                <img class="img" :src="match_item.lurl" alt />
                <span>{{match_item.man}} V {{match_item.mhn}}</span>
              </p>
              <img
                class="select_img"
                v-show="!match_item.checked"
                @click="match_select(match_item)"
                src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_nor.svg"
                alt
              />
              <img
                class="img"
                v-show="match_item.checked"
                @click="match_select(match_item)"
                src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_sel.svg"
                alt
              />
            </li>
          </ul>
        </section>
      </div>
         <section v-if="list_data.length>1" class="btn row items-center justify-between">
          <div class="confirm_btn" @click="select_confirm">确定</div>
          <div class="cancel_btn" @click="select_cancel">取消</div>
        </section>
       <!-- 无数据展示 -->
    <no-data v-if="list_data.length<1" which="noMatch" style="margin-top: 0.26rem" :height="100"
      ></no-data>
    </div>
 
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { api_search } from "src/api/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
// 无网络展示组件
import NoData from "src/base-h5/components/common/no-data.vue";
import {compute_local_project_file_path} from "src/output/index.js";
defineOptions({
  name: "screen-modal" // 设置组件名称
});
//输入框值
const input_text = ref("");
//是否全选
const is_all_checked = ref(false);
//日间夜间
const get_y0_suffix = "";

//列表数据
const list_data = ref([]);
//选中的数据
const select_data = ref([]);
//抛出去的事件
const emits = defineEmits(['select_change'])

let rem_1 = (window.innerWidth * 100) / 375;
const bounced_high = {
  height: window.innerHeight - rem_1 + 50 + "px !important"
};
/**
 * @Description:全选反选
 * @param {string}
 * @return {Undefined} Undefined
 */
function all_select() {
  is_all_checked.value = !is_all_checked.value;
  list_data.value = list_data.value.map(item => {
    item.checked = is_all_checked.value;
    item.matchList = item.matchList.map(v => {
      v.checked = is_all_checked.value;
      return v;
    });
    return item;
  });
}
/**
 * @Description:联赛选中
 * @param {string}
 * @return {Undefined} Undefined
 */
function league_select(val) {
  list_data.value = list_data.value.map(item => {
    if (item.leagueName === val.leagueName) {
      item.checked = !val.checked;
      item.matchList = item.matchList.map(v => {
        v.checked = item.checked;
        return v;
      });
    }
    return item;
  });
}
/**
 * @Description:赛事选中
 * @param {string}
 * @return {Undefined} Undefined
 */
function match_select(item) {
  item.checked = !item.checked;
  if (!item.checked) {
    is_all_checked.value = false;
  }
}
/**
 * @Description:获取搜索结果数据
 * @param {string}
 * @return {Undefined} Undefined
 */
function clear_search() {
  input_text.value = "";
}
/**
 * @Description:被选中的数据
 * @param {string}
 * @return {Undefined} Undefined
 */
function select_confirm() {
  select_data.value = list_data.value.map(item => {
    item.matchList = item.matchList.filter(v => v.checked);
    return item;
  });
  
  emits('select_change',select_data.value);
  console.log('select_data.value',select_data.value)
}
/**
 * @Description:取消
 * @param {string}
 * @return {Undefined} Undefined
 */
function select_cancel() {
  console.log('取消')
}
/**
 * @Description:获取搜索结果
 * @param {string} keyword 搜索关键词
 * @param {number} csid 球种ID
 * @return {undefined} undefined
 */
async function get_search_result() {
  try {
    const params = {
      keyword: input_text.value,
      cuid: UserCtr.get_uid(),
      pageNumber: 1,
      rows: 200,
      isPc: false,
      searchSportType: 1
    };
    let res = await api_search.get_search_result(params);
    const { code, data } = res;
    if (code === "200") {
      list_data.value = data?.data.league.map(item => {
        item.checked = false;
        item.matchList = item.matchList.map(v => {
          v.checked = false;
          return v;
        });
        return item;
      });
    }
  } catch (error) {
    console.error(error);
  }
}
</script>
<style scoped lang="scss">
.setting-filter {
  width: 100%;
  height: 100%;
  background: var(--q-gb-bg-c-15);
  //头部标题样式
  .top_title {
    font-size: 16px;
    color: #303442;
    text-align: center;
    height: 0.44rem;
    font-weight: 500;
    line-height: 0.44rem;
  }
  //输入框样式
  .quasar_input {
    width: 2.88rem;
    height: 0.4rem;
    vertical-align: middle;
    margin-bottom: 0.1rem;
    &.q-field--focused {
      :deep().q-field__control:after {
        border-width: 1px;
      }

      .icon-search {
        background-image: var(--q-color-img-bg-93);
        &._y0 {
          &:before {
            color: #569ffd;
          }

          &:after {
            background: var(--q-color-page-bg-color-63);
          }
        }
      }
    }
    .icon-search {
      position: relative;
      background: var(--q-color-com-img-bg-113) no-repeat center / 100% 100%;
      transition: all 0.3s ease-in-out;
      transform: scale(0.8);
      &.input-without-word {
        position: absolute;
      }
    }

    .icon-delete {
      width: 0.2rem;
      height: 0.2rem;
      z-index: 9;
      transform: scale(0.8);
    }
    :deep(.q-field__control) {
      height: 100%;
      border-left: none;
    }
    :deep(.q-field__marginal) {
      height: 100%;
    }
  }
  //内容样式
  .content {
    padding: 0 0.1rem;
    height: 100%;
    .all_select {
      width: 2.68rem;
      height: 0.32rem;
      margin-bottom: 0.1rem;
      .all_select_left {
        color: #7981a4;
        font-size: 0.12rem;
        .img {
          margin-right: 0.04rem;
        }
      }
      .select_img {
        width: 0.2rem;
        height: 0.2rem;
      }
    }
  }
  //联赛列表
  .league_list {
    .league_title {
      font-size: 0.14rem;
      color: #303442;
      font-weight: 500;
      padding: 0.1rem 0;
      border-top: 0.01rem solid #e4e6ed;
      .text{
        width: 86%;
        span{
        display: inline-block;
        }
      }
      .league_num {
        width: 0.19rem;
        height: 0.15rem;
        border-radius: 0.8rem;
        background: #ebd3a8;
        font-size: 0.1rem;
        line-height: 0.15rem;
        text-align: center;
      }
    }
    .list_info {
      .list_data {
        .league_name {
          min-width: 2rem;
          .img {
            margin-right: 0.04rem;
          }
        }
      }
    }
  }
  .btn{
    position: fixed;
    bottom: 0;
    height: 1rem;
    width: 100%;
    background: var(--q-gb-bg-c-15);
    div{
      width: 1.29rem;
      height: 0.36rem;
      padding: 0.08rem 0.24rem;
      border-radius: 0.12rem;
      background: #179CFF;
      font-size: 0.14rem;
      text-align: center;
      line-height: 0.22rem;
      color: #ffffff;
      font-weight: 400;
      letter-spacing: 0.04rem;
    }
    .cancel_btn{
      background: linear-gradient(0deg, #F8F9FA, #F8F9FA),
       linear-gradient(0deg, #E4E6ED, #E4E6ED);
       border: 1px solid #E4E6ED;
       color: #AFB3C8;
    }
  }
}
:deep(.q-field__control) {
  &:before {
    background: linear-gradient(0deg, #e4e6ed, #e4e6ed),
      linear-gradient(0deg, #f2f2f6, #f2f2f6);
    border-left: none;
    border-right: none;
    border-radius: 0;
    border-width: 1px, 0px, 1px, 0px;
    border-color: rgba(228, 230, 237, 1);
  }
}
:deep(.q-placeholder) {
  transform: translateX(0.18rem);
}
/*******兼容部分ios下输入框背景色等样式异常情况 开始*******/
:deep(.search-keyword-input) {
  -webkit-appearance: none;
  border-radius: 0;
  outline: 0;
  background: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &::-webkit-input-placeholder {
    color: #afb3c8;
    font-size: 0.12rem;
  }
  &:-moz-placeholder {
    color: #afb3c8;
    font-size: 0.12rem;
  }

  &::-moz-placeholder {
    color: #afb3c8;
    font-size: 0.12rem;
  }

  &:-ms-input-placeholder {
    font-size: 0.12rem;
  }

  &:-webkit-autofill {
    transition: background-color 5s ease-in-out;
  }
}

/*******兼容部分ios下输入框背景色等样式异常情况 结束*******/
:deep(.q-placeholder) {
  vertical-align: middle;
  font-size: 0.12rem;
  min-height: unset;
  color: #afb3c8;
}

:deep(.q-field__control),
:deep(.q-field__prepend),
:deep(.q-field__append) {
  height: 0.4rem;
  vertical-align: middle;
}

:deep(.q-field__control-container),
:deep(.q-field__native) {
  height: 0.38rem;
  background: transparent;
}

:deep(.q-field__control) {
  min-height: unset;
  align-items: center;
}
</style>