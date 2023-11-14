

<!--
 * @Description: 顶部 搜索+ 个人头像组件
-->
<template>
  <div class="h-right">
    <div :class="[is_search ? 'search-click' : 'search']">
      <div class="s-input s-input-click">
        <q-input borderless rounded @click="show_search" v-model="text" label-color="primary"
          placeholder="Enter league or team">
          <template v-slot:prepend>
            <i class="icon-search q-icon c-icon" size="10px"></i>
          </template>
          <template v-slot:append>
            <i class="icon-close" size="10px" style="margin-right:10px" v-if="text.length" @click="text = ''"></i>
          </template>
        </q-input>
      </div>
    </div>
    <!-- <div class="s-input-active">
      <q-input borderless rounded readonly @click="change_input" v-model="text" label-color="primary" placeholder="Enter league or team">
        <template v-slot:prepend>
          <i class="icon-search q-icon c-icon" size="10px"></i>
        </template>
      </q-input>
    </div> -->
    <div class="h-right">
      <div class="user-info">
        <span style="font-weight: 500;">  {{ format_balance(UserCtr.balance) }} </span>
        <span style="font-size: 14px;font-weight: 400;opacity: 0.8;">{{ UserCtr.nickName }}</span>
      </div>
      <q-avatar size="40px"  @click="change_input">
        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/avator.png`" alt="" srcset="" />
      </q-avatar>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref,watch } from "vue";
import { format_balance,UserCtr,LOCAL_PROJECT_FILE_PREFIX } from "src/core/"
import { useRouter, useRoute } from 'vue-router'
import store from "src/store-redux/index.js";
import { SearchPCClass } from 'src/core/index.js'
import globalAccessConfig from "src/core/access-config/access-config.js"
import SearchHotPush from "src/core/search-class/search_hot_push.js";
console.log(globalAccessConfig,'globalAccessConfig');
export default defineComponent({
  name: "RightHead",
  setup() {
    const text = ref('')
    const is_search = ref(false)
    onMounted(() => {
      compute_userInfo();
     
    });

    const compute_userInfo = () => {
    

    };
    /**
     * 是否显示搜索组件 default: false
     * 路径: project_path\src\store\module\search.js
    */
    const search_isShow = ref(SearchPCClass.search_isShow)
    // 搜索
    const change_input = () => {

    }

    /** 搜索热推赛事 */
    const search_hot_push = ref(new SearchHotPush());

    /** 保存显示搜索组件状态 */
    const set_search_status = (data) => (store.dispatch({
      type: "SET_SEARCH_STATUS",
      data,
    }))

    /** 展开搜索 */
    function show_search() {
      // if (!globalAccessConfig.get_searchSwitch()) {
      if (!globalAccessConfig.config.searchSwitch) {
        return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("msg.msg_09"));
      }
      set_search_status(true);
    }
    /** 初始化 */
    function init() {
      set_search_status(false);
    }
    onMounted(init);

    return {
      text, change_input, is_search, format_balance, UserCtr, LOCAL_PROJECT_FILE_PREFIX, SearchPCClass, show_search, search_hot_push, search_isShow
    };
  },
});
</script>
<style lang="scss" scoped>
.h-right {
  float: right;
  display: flex;
  margin-left: 40px;
  // margin-right: 100px;

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 10px;
    font-family: "DIN";
  }
}

.s-input {
  width: 200px;
  transition: all 0.3s linear;
  :deep(.q-field) {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 20px;
    padding-left: 10px;
  }

  :deep(.q-field__control) {
    height: 40px;
  }
  :deep(.q-field__marginal) {
    height: 40px;
  }
  :deep(.q-field__native) {
    color:#FFFFFF
  }
}

.search-click .s-input {
  width: 500px;
  &:deep(.q-field) {
    background-color: #CE5B00 !important;

  }
}

.icon-search,
.icon-close {
  font-size: 14px;
  cursor: pointer;

  &::before {
    color: #ffffff;
  }
}
</style>
