<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          --亚洲版本----&nbsp;&nbsp;&nbsp;&nbsp;env:
          {{ current_env }} &nbsp;&nbsp;&nbsp;&nbsp; token: {{ token }}
        </q-toolbar-title>

        <q-btn @click="empty_bet_items"> 清除投注框内容 </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> 左侧菜单头部 </q-item-label>
      </q-list>
      <!-- <TestPcMenu2 /> -->
    </q-drawer>
    <q-page-container>
      <router-view />

      <!-- <BetBoxDialog /> -->
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import STANDARD_KEY from "src/core/standard-key";
// import LeftMenuTemplate1 from "../components/menu/left-menu/template1/template1.vue";
// import TestPcMenu2 from "../components/test/test-pc-menu2.vue";
// import BetBoxDialog from "../components/test/bet-box-dialog.vue";
// import store from "../store-redux-vuex/index.js";

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const token = ref(sessionStorage.getItem(STANDARD_KEY.get("token")));
// const current_env = process.env.current_env;

const empty_bet_items = () => {
  store.dispatch({
    type: "betReducer/empty_bet",
  });
  store.dispatch({
    type: "betReducer/show_bet",
    payload: false,
  });
};

</script>
