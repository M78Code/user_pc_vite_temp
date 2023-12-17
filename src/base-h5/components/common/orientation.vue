<template>
    <div class="orientation">
        <img :src="imgUrl" alt="" class="img">
        {{ i18n_t('common.hengping_tip') }}
    </div>
</template>

<script setup>
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/output';

const imgUrl = `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/hengpin.svg`
</script>

<style scoped lang="scss">

.orientation {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #666;
    color: #fff;
    font-size:14px;
    .img{
        width: 90px;
    height: 108px;
    margin-bottom: 10px;
    }
}
</style>