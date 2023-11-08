<!--
 * @Author: jamison pmtyjamison@itcom888.com
 * @Date: 2023-11-07 21:45:55
 * @LastEditors: jamison pmtyjamison@itcom888.com
 * @LastEditTime: 2023-11-08 16:59:12
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
        @keydown.stop="key_down($event)"
        placeholder="请输入联赛/球队名称进行搜索"
        @keyup.enter="changeStr"
        @focus="search_input_focus_or_blur($event, true)"
        @blur="search_input_focus_or_blur"
      >
        <!-- 输入框的扩大镜图片 -->
        <template v-slot:prepend>
          <span
            :class="[`icon-search ${get_y0_suffix}`, { 'input-without-word': !input_text.length }]"
            @click.stop.prevent.self="go_to_details"
          ></span>
        </template>
        <template v-slot:append>
          <img
            :src="`/${project_name}image/svg/delete.svg`"
            alt
            class="icon-delete"
            @click.stop.prevent.self="clear_search"
            v-show="input_text.length > 0"
          />
        </template>
      </q-input>
      <div class="content">
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
            src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_nor.svg"
            alt
          />
          <!-- <p>
            <img :src="`/${project_name}image/svg/Vector.svg`" alt class="icon-delete" />
          </p>-->
        </section>
        <!-- 列表 -->
        <section class="league_list">
          <p class="league_title">
            热门联赛
            <span class="league_num">61</span>
          </p>
          <ul class="list_info">
            <li class="list_data row items-center justify-between">
              <p class="league_name row items-center">
              <img
                  class="img"
                  src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_sel.svg"
                  alt/>
                  欧洲冠军联赛
              </p>
              <img
                class="league_select"
                src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_sel.svg"
                alt
              />
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>
<script setup>
import { SearchData } from "src/core/";

import { reactive, toRefs, ref } from "vue";
defineOptions({
  name: "screen-modal" // 设置组件名称
});
//输入框值
const input_text = ref("");
//联赛的数据
const list = ref([]);
function search_input_focus_or_blur(e, event_handle) {
  let selectDialog = document.querySelector(".select-dia");
  selectDialog.style.display = "none";

  nextTick(() => {
    selectDialog.style.display = "block";
  });

  // 搜索弹窗 滚动区域 聚焦时 滚动到顶部
  if (event_handle) {
    clearTimeout(event_handle_timer);
    event_handle_timer = setTimeout(() => {
      selectDialog.scrollTop = 0;
    }, 200);
  }
}
function clear_search() {
  SearchData.set_search_term("");
  input_text.value = "";
}
// 跳转到赛事详情
function go_to_details() {}
</script>
<style scoped lang="scss">
.setting-filter {
  width: 100%;
  height: 100%;
  background: #ffffff;
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
      &:before {
        width: 0.2rem !important;
        height: 0.2rem !important;
      }
      &.input-without-word {
        position: absolute;
      }
    }

    .icon-delete {
      width: 0.32rem;
      height: 0.32rem;
      padding: 0.1rem;
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
    .all_select {
      width: 2.4rem;
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
  .league_list{
    .league_title{
      font-size: 0.14rem;
      color: #303442;
      font-weight: 500;
      padding: 0.1rem 0;
      border-top: 0.01rem solid #E4E6ED;
       .league_num{
        display: inline-block;
        width:  0.19rem;
        height:  0.15rem;
        border-radius: 0.8rem;
        background: #EBD3A8;
        font-size: 0.1rem;
        line-height: 0.15rem;
        text-align: center;
      }
    }
    .list_info{
      .list_data{
        .league_name{
          .img{
             margin-right: 0.04rem;
          }
        }
      }
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
  transform: translateX(0.14rem);
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