<!--
 * @
 * @Author: Yellow
 * @Description: 自定义下拉框
 * @Date: 2020-09-29 11:08:05
-->
<template>
  <div
    class="y-select handel relative-position"
    :class="versions_class"
    @click.stop
  >
    <div
      class="y-field-control"
      @click="isShow = true"
      :style="{ width: `${popWidth}px` }"
    >
      <input
        type="text"
        class="input"
        v-model="input_val"
        @input="ipt_change"
        @blur="ipt_blur"
        @focus="ipt_focus"
        :class="{ is_select: is_select }"
        :placeholder="i18n_t('select.placeholder')"
      />
      <icon-wapper name="icon-search" color="#99A3B1" size="12px" />
    </div>

    <div class="select-content" v-if="isShow">
      <div class="top-btn">
        <!-- 全选 -->
        <div class="btn-item" @click="checkAll()">
          <div :class="{ active: menu == 'all' }" class="radio-checked" />
          <span class="">{{ i18n_t("select.checkAll") }}</span>
        </div>
        <!-- 反选 -->
        <div class="btn-item" @click="checkInvert()">
          <div :class="{ active: menu == 'invert' }" class="radio-checked" />
          <span class="">{{ i18n_t("select.invert") }}</span>
        </div>
        <!-- 热门 -->
        <div class="btn-item checkbox" @click="checkHot()">
          <div class="y-checkbox" :class="{ active: is_hot }" />
          <span>{{ i18n_t("select.hot") }}</span>
        </div>
      </div>
      <q-scroll-area :style="{ flex: '1' }">
        <div
          class="wrap-item"
          v-for="(item, index) in list"
          :key="`select_${index}`"
          :class="{ active: item.id == active }"
          @click="choose(item, index)"
        >
          <div
            class="y-checkbox"
            :class="{ active: active_tournament.includes(item.id) }"
          />
          <div class="select-item">{{ item.tournamentName }}</div>
        </div>
      </q-scroll-area>
      <div class="btn-confrim">
        <span class="cancel" @click="cancel">{{
          i18n_t("select.cancel")
        }}</span>
        <span @click="confrim()">{{ i18n_t("select.confirm") }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { i18n_t } from "src/output/index.js";
import { IconWapper } from 'src/components/icon'
const { DEFAULT_VERSION_NAME } = window.BUILDIN_CONFIG;
// import { mapGetters } from "vuex";
import {
  useMittOn,
  useMittEmitterGenerator,
  MITT_TYPES,
} from "src/output/index.js";
const option = ref(null); //选中项
const isShow = ref(false); // 是否展示联赛列表
const active = ref(null); //选择的下标
const active_tournament = ref([]); //选中项的id
const shape = ref("all"); //默认全选
const menu = ref("all"); //全选、反选、热门
const is_select = ref(false); //是否筛选
const input_val = ref(null);
const timer = ref(null); //定时器
const isSearch = ref(false); //是否模糊查询
const is_hot = ref(false); //是否热门
const copy_list = ref([]); // 复制一份完整的 list
const copy_id = ref([]);
const new_list = ref([]);
const isConfirm = ref(false); // 是否已经点了确认
const targetSport = ref(false);
const inputOldVal = ref(null); // 输入框 focus 时的旧值
const init = ref(false); // 是否处理从 url 获取的数据
const selectedIds = ref([]); // 已选中的联赛
const initSport = ref(0); // 当前更新是否是切换球种
const isAllSelect = ref(1); // 1 全选 0反选
const itemAllSelect = ref("all"); // 针对选项的判断 all 全部选中  part 部分选中

const props = defineProps({
  list: {
    //下拉框子项
    type: Array,
    default: [],
  },
  sport_id: String, //球类id
  popWidth: String, //宽度
  hideSelect: Number, // 隐藏下拉框
  isTimeChanged: Boolean, // 判断时间是否有变
});
const emit = defineEmits([
  "to_hide_select",
  "confirm",
  "ipt_search",
  "select_submit",
]);
/**
 * @description: input获取焦点
 */
const ipt_focus = () => {
  emit("confirm", 0);
  emit("to_hide_select");
  // 获取焦点时会获取联赛列表，同时会触发 list 的监听，所以需要修改此标记
  initSport.value = 0;
  // 获取焦点时保留旧的值
  inputOldVal.value = input_val.value;
  if (input_val.value == i18n_t("select.all")) {
    input_val.value = "";
    isSearch.value = false;
    is_select.value = false;
  }
  if (input_val.value == i18n_t("select.filter")) {
    input_val.value = "";
    // menu = ""
  }
  // 如果是跳转过来赛果的，就不请求全部
  // 当前是筛选状态也不请求全部，保留当前状态
  // inputOldVal !=i18n_t("select.filter")
  if (!targetSport.value) {
    emit("ipt_search", input_val.value, Number(is_hot.value));
  }
};
/**
 * @description: input失去焦点
 */
const ipt_blur = () => {};
/**
 * @description: 监听input输入
 * @param {String} val input值
 */
const ipt_change = () => {
  emit("confirm", 0);
  //'','全部','已筛选'
  if (
    ["", i18n_t("select.all"), i18n_t("select.filter")].includes(
      input_val.value
    )
  ) {
    isSearch.value = false;
  } else {
    isSearch.value = true;
  }

  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
  // 输入完之后把当前已选中的联赛清空
  active_tournament.value.length = 0;
  timer.value = setTimeout(() => {
    emit("ipt_search", input_val.value, Number(is_hot.value));
  }, 500);
};
/**
 * @description: 全选
 * @param {}
 * @return {undefined} undefined
 */
const checkAll = () => {
  emit("confirm", 0);
  list.value &&
    list.value.forEach((item) => {
      if (!active_tournament.value.includes(item.id)) {
        active_tournament.value.push(item.id);
      }
    });
  // 全选
  menu.value = "all";
  isAllSelect.value = 1;
};
/**
 * @description: 反选
 * @param {}
 * @return {undefined} undefined
 */
const checkInvert = () => {
  // 如果当前选中状态是反选并且没有联赛就不予处理
  if (menu.value == "invert" && !list.value) return false;
  emit("confirm", 0);
  list.value &&
    list.value.forEach((item) => {
      if (!active_tournament.value.includes(item.id)) {
        active_tournament.value.push(item.id);
      } else {
        active_tournament.value.splice(
          active_tournament.value.indexOf(item.id),
          1
        );
      }
    });
  menu.value = "invert";
  isAllSelect.value = 0;
};

/**
 * @description: 热门
 * @return {}
 * @param {n} 1 初始化联赛选中状态 0 正常处理
 */
const checkHot = (n) => {
  emit("confirm", 0);
  menu.value = "hot";
  initSport.value = n;
  if (n == 1) {
    is_hot.value = false;
    is_select.value = false;
    init.value = true;
    active_tournament.value.length = 0;
    checkAll();
    input_val.value = i18n_t("select.all");
  } else {
    init.value = false;
    is_hot.value = !is_hot;
    $emit("search_hot", Number(is_hot.value));
  }
};
mitt_list = [
  useMittOn(MITT_TYPES.EMIT_INIT_SELECT, checkHot).off
]
onUnmounted(() => {
  mitt_list.forEach(i => i());
});
/**
 * @description: 展开联赛下拉框
 * @return {undefined} undefined
 */
const show_menu = () => {
  isShow.value = !isShow.value;
};

/**
 * @description: 勾选联赛
 * @param {}
 * @return {undefined} undefined
 */
const choose = (item, index) => {
  if (active_tournament.value.includes(item.id)) {
    active_tournament.value.splice(active_tournament.value.indexOf(item.id), 1);
  } else {
    active_tournament.value.push(item.id);
  }
  // 是否全部选中
  let allSelect = list.every((item) =>
    active_tournament.value.includes(item.id)
  );
  menu.value = allSelect ? "all" : "";
};

/**
 * @description: 取消并收起联赛下拉框
 */
const cancel = () => {
  emit("confirm", 0);
  isShow.value = false;
};
const { off } = useMittOn(MITT_TYPES.EMIT_SHOW_SELECT, (e) => {
  cancel(e);
});
onUnmounted(off);

/**
 * @description: 确认
 */
const confrim = () => {
  $emit("confirm", 1);
  if (isSearch.value) {
    is_select.value = true;
    input_val.value = i18n_t("select.filter");
  } else {
    // 点击筛选确认按钮时，如果输入框值为空（全部）则查询全部
    if (
      active_tournament.value.length == (list.value ? list.value.length : 0) &&
      !is_hot.value
    ) {
      is_select.value = false;
      input_val.value = i18n_t("select.all"); //全部
    } else {
      is_select.value = true;
      input_val.value = i18n_t("select.filter"); //已筛选
    }
  }
  // 点击确认的时候，上一次选中的联赛换成最新选中的联赛
  if (selectedIds.value.length) {
    active_tournament.value = _.cloneDeep(selectedIds.value);
  }
  isShow.value = false;
  emit("select_submit", {
    ids: active_tournament.value,
    isHot: Number(is_hot.value),
    cur_type: menu.value,
  });
};
const versions_class = computed(() => {
  return `versions-${DEFAULT_VERSION_NAME}`;
});

onMounted(() => {
  input_val.value = i18n_t("select.all");
});
watch(
  list,
  (res) => {
    let _no_active = active_tournament.value.length == 0;
    // 当前是不是反选
    let is_invert = menu.value == "invert";
    // 如果当前没有已选中的联赛，就清空备用数据
    if (_no_active) {
      selectedIds.value.length = 0;
    }
    // 如果有已选中联赛并且当前是切换球种，就清空选中
    if (!_no_active && initSport.value == 1) {
      _no_active = true;
      // active_tournament.length = 0;
      selectedIds.value.length = 0;
    }
    let tournamentName,
      { tid } = $route.query;
    let active_item = null;
    if (res && res.length) {
      // 如果条件有变，就清空已选中id
      if (
        _no_active ||
        isTimeChanged ||
        is_hot.value ||
        itemAllSelect.value == "all"
      ) {
        active_tournament.value.length = 0;
      }
      res.filter((item, i) => {
        if (input_val == i18n_t("select.all")) {
          copy_list[i] = item;
          copy_id[i] = item.id;
        }
        // 如果没有已选中的联赛
        // 或者时间有变化
        // 或者当前为热门并且是全部选中状态
        // 或者当前是全部选中状态，就重新全部选中
        if (
          _no_active ||
          isTimeChanged ||
          is_hot ||
          itemAllSelect.value == "all"
        ) {
          // 当前不是反选才进行全选操作
          if (!is_invert || menu.value == "") {
            if (!active_tournament.value.includes(item.id)) {
              active_tournament.value.push(item.id);
            }
          }
        }
        if (tid == item.id) {
          tournamentName = item.tournamentName;
          return true;
        }
        return item.tournamentName == option;
      });
    }
    targetSport.value = false;
    // 如果是跳转过来的则需要带上条件
    if (tournamentName && !init) {
      active_tournament.value = [tid];
      option.value = tournamentName;
      active.value = tid;
      is_select.value = true;
      menu.value = "";
      targetSport.value = true; // 跳转过来的
      input_val.value = i18n_t("select.filter"); //已筛选
      isShow.value = false;
      emit("select_submit", {
        ids: active_tournament.value,
        isHot: Number(is_hot.value),
        cur_type: menu.value,
      });
    } else if (active_item && active_item.length) {
      option.value = active_item[0].tournamentName;
      active.value = active_item[0].id;
    } else if (!tid) {
      if (isAllSelect.value && itemAllSelect.value == "all") {
        menu.value = "all";
        active.value = "";
      } else {
        menu.value = "";
      }
    }
  },
  { immediate: true }
);
watch(sport_id, (res) => {
  is_select.value = false;
  menu.value = "all";
  input_val.value = i18n_t("select.all"); //全部
});
watch(hideSelect, (res) => {
  isShow.value = false;
});
// 全局点击事件
watch(get_global_click, (res) => {
  isShow.value = false;
});

watch(
  active_tournament,
  (arr) => {
    let allSelect = list.every((item) => arr.includes(item.id));
    // 热门全部选中和部分选中要区分开来
    if (is_hot.value) {
      itemAllSelect.value = allSelect
        ? list.length == arr.length
          ? "all"
          : "part"
        : "part";
    } else {
      itemAllSelect.value = allSelect ? "all" : "part";
    }
  },
  { deep: true }
);

onUnmounted(() => {
  clearTimeout(timer);
  active_tournament.value = null;
});
</script>

<style lang="scss" scoped>
.y-select {
  position: relative;

  /*************** 下拉框展示框 *************** -S*/
  .y-field-control {
    border: 1px solid #d0d8de;
    border-radius: 2px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 15px;
    cursor: pointer;
  }
}
.input {
  position: relative;
  top: 0;
  right: 5px;
  width: 120px;
  height: 26px;
  border: none;
  outline: medium;
  background: transparent;
  color: #5a6074;

  /*************** 下拉选项 *************** -S*/
}
.select-content {
  position: absolute;
  top: 33px;
  left: 0;
  min-width: 321px;
  height: 314px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  background: var(--q-gb-bg-c-4);
  z-index: 99;
  display: flex;
  flex-direction: column;
  .top-btn {
    display: flex;
    align-items: center;
    height: 34px;
    padding: 0 15px;
    color: #333333;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid #d0d8de;
    border-radius: 2px 2px 0 0;
    .btn-item {
      margin-right: 17px;
      cursor: pointer;
      display: flex;
      align-content: center;
      span {
        line-height: 14px;
      }
      .radio-checked,
      .y-checkbox {
        width: 14px;
        height: 14px;
        margin-right: 5px;
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
  }
  .wrap-item {
    padding: 0px 15px;
    min-height: 34px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-left: var(--qq--theme-bd-y-select);
    border-right: var(--qq--theme-bd-y-select);
    .select-item {
      border: none;
    }
    &:hover {
      background-color: #e3e9ee;
    }
    .y-checkbox {
      width: 14px;
      height: 14px;
      margin-right: 8px;
      background-size: 100%;
      background-repeat: no-repeat;
    }
    &.checked {
      background: red;
    }
  }
  .btn-confrim {
    border: 1px solid #d0d8de;
    display: flex;
    color: #333333;
    font-size: 13px;
    height: 34px;

    span {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .cancel {
      border-right: 1px solid #d0d8de;
    }
  }
  :deep(.q-scrollarea__thumb) {
    background-color: rgba(60, 63, 76, 0.3) !important;
    width: 8px;
    border-radius: 4px;
  }
}
</style>
