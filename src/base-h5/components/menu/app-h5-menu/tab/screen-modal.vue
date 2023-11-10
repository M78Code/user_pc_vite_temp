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
          <span
            :class="[`icon-search ${get_y0_suffix}`, { 'input-without-word': !input_text.length }]"
            @click.stop.prevent.self="get_search_result"
          ></span>
        </template>
        <template v-slot:append>
          <span
            @click.stop.prevent.self="clear_search"
            v-show="input_text.length > 0"
            :class="[`icon-delete ${get_y0_suffix}`, { 'input-without-word': !input_text.length }]"
          ></span>
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
            v-show="!is_all_checked"
            @click="is_all_checked = true"
            src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_nor.svg"
            alt
          />
            <img
              class="img"
              v-show="is_all_checked"
              @click="is_all_checked = false"
              src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_sel.svg"
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
            <span class="league_num">{{list_data.length}}</span>
          </p>
          <ul class="list_info">
           <!-- 类型 -->
            <li class="list_data"
                v-for="(type_item,type_index) in list_data" :key='type_index'>
                <!-- 赛事 -->
                 <div v-for="(match_item,match_index) in type_item.data" :key='match_index'>
                 <!-- 联赛 -->
                      <div v-for="(league_item,league_index) in match_item.league" :key='league_index'
                           class="row items-center justify-between">
                          <p class="league_name row items-center">
                        <img
                            class="img"
                            :src="league_item.lurl"
                            alt/>
                            {{league_item.leagueName}}
                        </p>
                        <img
                          class="select_img"
                          v-show="!league_item.is_active"
                          @click="league_item.is_active = true"
                          src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_nor.svg"
                          alt
                        />
                          <img
                            class="img"
                            v-show="league_item.is_active"
                            @click="league_item.is_active = false"
                            src="/src/base-h5/components/menu/app-h5-menu/tab/img/icon_checkbox_sel.svg"
                            alt
                          />
                      </div>
                 </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>
<script setup>
import { SearchData } from "src/core/";
import { reactive, toRefs, ref,onMounted,watch} from "vue";
import search from "src/core/search-class/search.js"
defineOptions({
  name: "screen-modal" // 设置组件名称
});
//输入框值
const input_text = ref("");
//联赛的数据
let list_data = reactive([]);
//是否全选
const is_all_checked = ref(false);
//日间夜间
const get_y0_suffix = ''

onMounted(()=>{
  get_search_result()
})
watch(()=>is_all_checked,(val)=>{
  list_data = list_data.map(item=>{
      item.children.forEach(sub => {
        sub.children.forEach(sitem=>{
          sitem.is_active = val
        })
      });
      return item
  })
})
/**
 * @Description:获取搜索结果数据
 * @param {string} keyword 搜索关键字
 * @return {Undefined} Undefined
 */
function clear_search() {
  input_text.value = "";
}

/**
 * @Description:获取搜索结果数据
 * @param {string} keyword 搜索关键字
 * @return {Undefined} Undefined
 */
function get_search_result() {
    //调用接口获取获取搜索结果数据
    search.get_search_result(input_text.value, '').then(res => {
        const { state, list } = res
        list_data.value = list
    })
}
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