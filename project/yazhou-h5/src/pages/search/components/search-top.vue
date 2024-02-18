<!--
 * @Author: ledron
 * @Date: 2020-11-10 11:09:47
 * @Description: 搜索页
-->
<template>
  <div :style="{ height: show_tab == 'saiguo_xunitiyu' ? 'unset' : '1rem' }">
    <div class='searchTop' id="sport_menu2" :style="{ height: show_tab == 'saiguo_xunitiyu' ? 'unset' : '1rem' }">
      <!-- 搜索头部骨架屏 -->
      <SSearch v-if="!skeleton_loading" />
      <div class="searchGroup">
        <div>
          <!-- 搜索input 输入框 -->
          <q-input class="quasar_input" maxlength="15" borderless outlined v-model="text"
            :input-class="{ 'search-keyword-input': true }" type="search" @keydown.stop="key_down($event)" :placeholder="show_tab == 'saiguo_xunitiyu' ? i18n_t('search.search_qihao') : (details_search && details_search.word ?
              details_search?.word :
              i18n_t('search.search_title_bw3'))" @keyup.enter="changeStr"
            @focus="search_input_focus_or_blur($event, true)" @blur="search_input_focus_or_blur">
            <!-- 输入框的扩大镜图片 -->
            <template v-slot:append>
              <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/delete.svg`" alt="" class="icon-delete"
                @click.stop.prevent.self="clear_search" v-show="text.length > 0">
              <span :class="[`icon-search ${get_y0_suffix}`, { 'input-without-word': !text.length }]"
                @click.stop.prevent.self="go_to_details"></span>
            </template>
          </q-input>
          <!--取消按钮 -->
          <span class="cancleBtn" @click="cancle_btn()">{{ i18n_t('common.cancel') }}</span>
        </div>
      </div>
      <!-- 球类tab 选项卡 -->
      <div class="row balls" ref="scrollBox" v-if="show_tab != 'saiguo_xunitiyu'">
        <div class="ball_son" ref="scrollItem" :class="{ checked_ball_son: index_num == index }"
          v-for="(item, index) of sport_list" :key="index" @click="change_record(index)">
          <span>{{ item.sportName }}</span>
        </div>
        <div style="width:0.09rem;flex-shrink:0;margin-left: 0.1rem;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {  SearchData, useMittEmit, useMittOn, MenuData, UserCtr, MITT_TYPES,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import SSearch from "src/base-h5/components/skeleton/search.vue"// 骨架屏
import { api_search } from 'src/api/'
const { get_hot_push, get_sport } = api_search || {}
import { ref, watch, nextTick, computed, onMounted, onBeforeUnmount, } from 'vue'
import { useRouter } from "vue-router";
const router = useRouter()
defineProps({
  show_tab: String
})
const emits = defineEmits(['get_suggestion_list', 'get_search_result', 'change_show_content'])
// 输入框输入的文字
const text = ref('');
const index_num = ref(0); // 下标
let is_hot_history = false // 代表的是 点击 历史搜索 和 热门搜索的模块
const details_search = ref(null)// 搜索占位符
const sport_list = ref([]) //搜索下面的球种+球类ID
const skeleton_loading = ref(false)  //搜索数据是否加载中
const { menu_type } = MenuData;
// dom 操作
const scrollBox = ref(null)
// 页面初始高度
let originHeight = 0;
const get_y0_suffix = '' // get_y0_suffix()

//定时器
let cancleTimer, event_handle_timer, timer00, fun;

// ...mapGetters([
const get_search_txt = ref('')
const get_search_term = ref(SearchData.search_term)
// 是赛果虚拟体育赛事
const results_of_the_virtual_display = MenuData.is_results_virtual_sports();
// ...mapMutations([
//       'set_show_match_filter',
//       'set_goto_detail_matchid',
//       'set_details_item',

// 获取搜索球类
// 列表页二级菜单 对应 搜索头部的 球类二级菜单
async function get_sport_list() {
  try {
    let params = {}
    skeleton_loading.value = false
    // 如果是赛果
    if (menu_type.value == '28') {
      // 增加参数：分球类搜索
      params.from = 2;
    }
    const { data = [] } = await get_sport(params)
    skeleton_loading.value = true
    sport_list.value = data;
    // menuType 5 足球， 7 篮球， 13 网球， 14 斯诺克， 15 羽毛球， 16 乒乓球，  17 排球，  18 冰球，  19 棒球， 20 美式足球
    //TODO if (this.get_current_menu && this.get_current_menu.sub) {
    const get_current_menu_sub = MenuData.get_current_sub_menuid()
    if (get_current_menu_sub && data) {
      // 赛果使用get_current_menu中二级菜单数据，其他则使用get_useid_ievname
      let usid_type = menu_type.value == 28 ? get_current_menu_sub : Math.abs(MenuData.get_useid_ievname())
      if (get_search_term.value && SearchData.cur_csid) {
        data.forEach((item, index, arr) => {
          if (SearchData.cur_csid == item.id) {
            index_num.value = index
            // 存储列表页二级菜单 球类id
            SearchData.set_cur_csid(SearchData.cur_csid);
            nextTick(() => {
              tab_move2(index, scrollBox.value, true)
            })
            return
          }
        })
        return
      }
      // 默认选中对应二级菜单赛种
      let index = data.findIndex(item => item.id == usid_type)
      if (index < 0) index = 0
      // 选中下标
      index_num.value = index
      // 赛种id储存

      SearchData.set_cur_csid(data[index].id);
      // 赛种滚动条
      nextTick(() => {
        tab_move2(index, scrollBox.value, true)
      })
    } else {
      // 存储 球类id
      data && SearchData.set_cur_csid(data[0].id);
    }
  } catch (error) {
    console.error(error, '123');
    skeleton_loading.value = true
  }
}
// 跳转到赛事详情
function go_to_details() {
  if (details_search.value != null && details_search.value.word.length > 0) {
    // 如果是冠军，跳转到冠军的列表页面
    if (details_search.value.isChampion == 1) {
      //TODO set_show_match_filter(false)
      useMittEmit(MITT_TYPES.EMIT_SEARCH_GOTO_BY_MAIN_SPORT, details_search.value.menuId.slice(-2));
    } else {
      goto_details(details_search.value)
    }
  }
  if (results_of_the_virtual_display) {
    console.log('是赛果的虚拟体育');
    //  调用列表页接口
    useMittEmit(MITT_TYPES.EMIT_TAB_HOT_CHANGING);
    useMittEmit(MITT_TYPES.EMIT_HID_SEARCH_DIA)
    clearTimeout(timer00);
    timer00 = setTimeout(() => {
      SearchData.set_search_txt('')
    }, 300)
  }
}
/**
 * @description: 跳转至详情
 * @param {Object} match 赛事
 * @return {String}
 */
function goto_details(match) {
  if (!match || !match.matchId) return;
  //TODO set_goto_detail_matchid(match.matchId);
  //TODO set_details_item(0);
  router.push({ name: 'category', params: { mid: match.matchId, csid: match.csid } });
  SearchData.set_search_term(get_search_txt.value)
}
// 点击球种调用搜索接口
function change_record(val) {
  index_num.value = val;
  tab_move2(val, scrollBox.value)
  // 点击球种更换球类ID
  SearchData.set_cur_csid(sport_list.value[val].id);
  // 点击球种,搜索框内容不为空时,调用搜索接口
  if (get_search_txt.value.length > 0) {
    emits('get_search_result')
  }
}
// 输入框去抖动
function debounce(fn, wait) {
  clearTimeout(fun)
  fun = setTimeout(fn, wait)
}
// 键入回车换行
function key_down(event) {
  event = event || window.event;
  if (event.keyCode == 13) {
    event.returnValue = false;
  }
}
function changeStr(evt) {
  is_hot_history = false
  if (evt && evt.keyCode == 13) {
    if (details_search.value != null && details_search.value.word.length > 0 && !get_search_term.value) {
      goto_details(details_search.value)
    }
  } else {
    emits('get_suggestion_list', evt)
  }
}
function search_input_focus_or_blur(e, event_handle) {
  let selectDialog = document.querySelector('.select-dia')
  selectDialog.style.display = 'none'

  nextTick(() => {
    selectDialog.style.display = 'block'
  })

  // 搜索弹窗 滚动区域 聚焦时 滚动到顶部
  if (event_handle) {
    clearTimeout(event_handle_timer)
    event_handle_timer = setTimeout(() => {
      selectDialog.scrollTop = 0
    }, 200)
  }
}
// 清除相关定时器
function clear_timer() {
  [
    cancleTimer,
    event_handle_timer,
    timer00,
    fun,
  ].forEach((i) => clearTimeout(i))
}
let searchInputFocusin = false;
//搜索逻辑
function cancle_btn() {
  if (searchInputFocusin) {
    // 延迟隐藏，满足动画效果
    clearTimeout(cancleTimer)
    cancleTimer = setTimeout(() => {
      emits('change_show_content', text.value);
      SearchData.set_search_term('')
      text.value = '';
      useMittEmit(MITT_TYPES.EMIT_HID_SEARCH_DIA)
    }, 300)
  } else {
    emits('change_show_content', text.value);
    SearchData.set_search_term('')
    text.value = '';
    useMittEmit(MITT_TYPES.EMIT_HID_SEARCH_DIA)
  }
}
function clear_search() {
  emits('change_show_content', text.value);
  SearchData.set_search_term('')
  text.value = '';
}
function resizeHandler() {
  let selectDialog = document.querySelector('.select-dia')
  const resizeHeight = selectDialog.clientHeight
  const activeElement = document.activeElement

  // 输入框高度变化(小于初始高度，则为弹出键盘，大于初始高度则为收起键盘)
  if (resizeHeight < originHeight) {
    // 键盘弹起后逻辑
    if (activeElement && (activeElement.tagName === 'INPUT')) {
      selectDialog.scrollTop = 1000
      searchInputFocusin = true
    }
  } else {
    selectDialog.scrollTop = 0
    searchInputFocusin = false
  }
}
// 获取搜索占位符字段
function get_hot_push_fun() {
  get_hot_push().then(({ code, data }) => {
    if (code === 200 && data != null) {
      data.word.length > 0 ? details_search.value = data : ''
    }
  }).catch((err) => {
    console.error(err);
  })
}
watch(text, (newV, oldV) => {
  SearchData.set_search_txt(newV);
  debounce(changeStr, is_hot_history ? 0 : 1000);
  if (!newV.length) clear_search()
  details_search.value = null
})
watch(SearchData.update_time, () => {
  text.value = SearchData.search_txt;
  get_search_term.value = SearchData.search_term;
})
text.value = get_search_txt.value; //TODO 没有太懂二次赋值
get_hot_push_fun()
get_sport_list();
text.value = get_search_term.value; //TODO 没有太懂二次赋值
const mitt_list = [
  useMittOn(MITT_TYPES.EMIT_SET_IS_HOT_HISTORY, function set_hot_history_handle() {
    is_hot_history = true
  }).off
];
onMounted(() => {
  originHeight = document.querySelector('.select-dia').clientHeight
  // 监听手机键盘弹出，收起高度变化
  window.addEventListener('resize', resizeHandler)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  mitt_list.forEach((i) => i())
  clear_timer()
})
</script>
<style lang="scss" scoped>
.searchTop {
  position: fixed;
  width: 100%;
  max-width: 7.68rem;

  z-index: 999;

  .balls {
    width: 100%;
    position: absolute;
    margin-left: 0.2rem;
    overflow-x: auto;
    overflow-y: hidden;

    flex-wrap: nowrap;
    font-weight: 540;
    z-index: 999;
    scrollbar-width: none;
    /*  去除滚动条火狐浏览器兼容性问题 */
  }

  .ball_son {
    flex-shrink: 0;
    letter-spacing: 0;
    text-align: center;
    margin: 0.09rem 0.15rem;

    span {

      font-size: 0.14rem;
    }

    &:nth-child(1) {
      margin-left: 0.08rem;
    }

    &.checked_ball_son {
      span {


        font-weight: bold;
      }
    }
  }

  :deep(input) {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  @Supports (-webkit-mask: none) and (not (caret-color: red)) {
    input {
      color: #FFB001;
    }

    input::first-line {
      color: #FFB001;
      width: 0.03rem;
    }
  }

  .title {
    height: 0.44rem;
    line-height: 0.44rem;
    font-size: 0.16rem;

    span {
      display: inline-block;

      &:nth-child(2) {
        width: 100%;
        text-align: center;
      }
    }

    .go {
      height: 0.28rem;
      line-height: 0.28rem;
      transform: rotateZ(90deg);
      position: absolute;
      top: 0.06rem;

      &:before {
        font-size: 0.14rem;
      }
    }

    .searchBtn {
      position: absolute;
      right: 0.16rem;
      color: #D2B79C;
      display: none;
    }
  }

  .searchGroup {
    position: relative;
    padding: 0.08rem 0 0.08rem 0.15rem;

    >div {
      display: flex;
    }

    .quasar_input {
      width: 2.88rem;
      height: 0.4rem;
      vertical-align: middle;

      border-radius: 0.5rem;

      &.q-field--focused {
        :deep().q-field__control:after {
          border-width: 1px;
        }

        .icon-search {
          background-image: var(--q-color-img-bg-93);

          /*&:before {*/
          /*  color: #FFB001;*/
          /*}*/

          /*&:after {*/
          /*  background: #FFB001;*/
          /*}*/

          // 由于使用了变量，这个代码无效，对应的js也要优化。
          &._y0 {
            /*  在search_top中设置无效 原因暂不明 因此在此处添加类 */
            // background-image: url('/image/svg/search3_y0.svg');

            &:before {
              color: #569FFD;
            }

            &:after {
              background: var(--q-color-page-bg-color-63);
            }
          }
        }
      }

      :deep(.q-field__control) {
        height: 100%;
        border-radius: .5rem;

        &::after {
          border-width: 1px;
        }
      }

      :deep(.q-field__marginal) {
        height: 100%;
      }
    }

    .icon-search {
      display: inline-block;
      width: 0.2rem;
      height: 0.2rem;

      position: relative;
      background: var(--q-color-com-img-bg-113) no-repeat center / 100% 100%;
      transition: all 0.3s ease-in-out;

      &.input-without-word {
        position: absolute;
        right: .12rem;
      }

      // &:after {
      //   content: "";
      //   width: 0.01rem;
      //   height: 0.14rem;
      //   position: absolute;
      //   left: -0.06rem;
      //   top: 0.03rem;
      //   border-radius: 0.015rem;
      //   transition: all 0.3s ease-in-out;
      // }
    }

    .icon-delete {

      width: 0.32rem;
      height: 0.32rem;
      padding: 0.1rem;
    }

    .cancleBtn {


      display: inline-block;
      margin: 0 auto;
      line-height: 0.4rem;
      font-size: 0.16rem;
    }
  }

  /*******兼容部分ios下输入框背景色等样式异常情况 开始*******/
  :deep(.search-keyword-input) {
    -webkit-appearance: none;
    border-radius: 0;
    outline: 0;
    background: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    &::-webkit-input-placeholder {


      font-size: 0.14rem;
    }

    &:-moz-placeholder {


      font-size: 0.14rem;
    }

    &::-moz-placeholder {


      font-size: 0.14rem;
    }

    &:-ms-input-placeholder {


      font-size: 0.14rem;
    }

    &:-webkit-autofill {
      transition: background-color 5s ease-in-out;
    }
  }

  /*******兼容部分ios下输入框背景色等样式异常情况 结束*******/
  :deep(.q-placeholder) {
    height: 0.4rem;
    vertical-align: middle;
    font-size: 0.16rem;
    min-height: unset;
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


    border-radius: 0.5rem;
    min-height: unset;
    align-items: center;
  }
}
</style>