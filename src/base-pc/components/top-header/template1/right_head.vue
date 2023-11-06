
<!--
 * @Author: cooper cooper@123.com
 * @Date: 2023-06-18 15:20:44
 * @LastEditors: nico
 * @LastEditTime: 2023-07-17 10:41:07
 * @FilePath: \user-pc-vue3\src\components\header\top-header\template1\right_head.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Description: 顶部 搜索+ 个人头像组件
-->
<template>
  <div class="h-right">
    <div :class="[is_search ? 'search-click' : 'search']">
      <div class="s-input s-input-click">
        <q-input borderless rounded :readonly="!is_search" @click="change_input" v-model="text" label-color="primary"
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
        <span style="font-weight: 500;">{{ utils.format_balance(amount) }}</span>
        <span style="font-size: 14px;font-weight: 400;opacity: 0.8;">{{ userInfo.nickName }}</span>
      </div>
      <q-avatar size="40px"  @click="change_input">
       <img :src="avator" alt="" srcset="">
      </q-avatar>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref,watch } from "vue";
import store from "src/store-redux-vuex/index.js";
import { api_match } from "src/api/index.js";
import { utils } from "src/public/utils/utils";
import { useRouter, useRoute } from 'vue-router'
import avator from 'src/assets/images/avator.png'
export default defineComponent({
  name: "RightHead",
  setup() {
    const userRouter = useRouter()
    const route = useRoute()
    let userInfo = ref({});
    const amount = ref(0)
    const text = ref('')
    const is_search = ref(false)
    watch(() => route.path, (newVal) => {
      is_search.value = newVal=='/search'
    },
      { immediate: true }
    )
    onMounted(() => {
      compute_userInfo();
      //     store.subscribe(() => {
      //       compute_userInfo();
      // });
    });
    const compute_userInfo = () => {
      let state = store.getState();
      userInfo.value = state.userReducer.userInfo;
      get_balance(userInfo.value)

    };
    //  获取用户余额
    const get_balance = async (userinfo) => {
      try {
        let uid = userinfo.userinfo;
        const res = await api_match.check_balance({ uid, t: new Date().getTime() })
        let obj = res?.data?.data || {};
        amount.value = obj.amount
        // 将用户余额保存于公共仓库
        store.dispatch({
          type: "SETAMOUNT",
          amount: obj.amount,
        });
      } catch (error) {

      }
    };
    // 搜索
    const change_input = () => {
      store.dispatch({
        type: "TIP_SHOW_STATE",
        data: true,
    })
  

      // is_search.value = true
      // userRouter.push({
      //   path: '/search',
      //   query: {}
      // })
    }

    
    // 监听变化
    store.subscribe(() => {
      let state = store.getState()
      amount.value = state.userReducer.amount;
      userInfo.value = state.userReducer.userInfo;
    });


    return {
      userInfo,
      amount,
      utils,
      text,
      change_input,
      is_search,
      avator
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
    background: rgba(255, 255, 255, 0.1);
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
