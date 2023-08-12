<template>
    <div class="header">
        <div class="go-back" @click="go_to_back"></div>
        <span class="title">
            <slot></slot>
        </span>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
/** 路由实例 */
const router = useRouter()

// TODO:
/** H5 返回上一级 */
const go_to_back = () => {
    if (menu_type.value == 900 && current_route_name == 'rule_description') {
        router.push({ name: 'virtual_sports' });//跳转到虚拟体育
        return
    }
    if (route.path == '/rule_description') router.push('/match');
    if (route.path == '/notice') router.push('/home');
}
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