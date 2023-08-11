<!-- @Description: 简单页面头部  体育规则，公告页面使用到 -->
<template>
    <div class="header">
        <!-- /TODO: $common -->
        <div class="go-back"
            @click="$common.go_where({ back_to: 'go_back_from_notice', route_name: $route.path.split('/')[2] })"></div>
        <span class="title">
            <slot />
        </span>
    </div>
</template>

<script setup>
// import { onUnmounted } from 'vue'
// import store from "src/store-redux/index.js";
// /** 收藏菜单为6 */
// const menu_type = ref()
// /** stroe仓库 */
// const unsubscribe = store.subscribe(() => {
//     const new_state = store.getState()
//     menu_type.value = new_state.menu_type
// })
// onUnmounted(unsubscribe)
</script>
  
<style lang="scss" scoped>
.header {
    display: flex;
    align-items: center;
    padding-left: 0.15rem;
    padding-top: 0.01rem;
    position: relative;
    height: 0.44rem;

    .go-back {
        display: block;
        width: 0.12rem;
        height: 0.2rem;

        background-size: 100% 100%;
    }

    .title {

        font-size: 0.16rem;

        text-align: center;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
  