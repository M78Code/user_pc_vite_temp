<template>
    <div class="info_box">
        <div class="left">
            <div class="vr_name">
                <span style="margin-left: 0.01rem;">VR Sports</span>
                <img :src="`${LOCAL_PROJECT_FILE_PREFIX }/image/menu/top-menu/back.png`" alt="">
            </div>
            <div class="drop_menulist">
                <q-btn-dropdown color="rgba(0,0,0, 0)" :flat="true" :glossy="false" :ripple="false" label="vr足球">
                    <q-list>
                        <q-item clickable v-close-popup @click="onItemClick">
                        <q-item-section>
                            <q-item-label>vr足球</q-item-label>
                        </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="onItemClick">
                        <q-item-section>
                            <q-item-label>vr蓝球</q-item-label>
                        </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="onItemClick">
                        <q-item-section>
                            <q-item-label>vr赛马</q-item-label>
                        </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </div>
        </div>
        <div class="right">
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX }/image/menu/top-menu/refresh.png`" alt="">
        </div>
    </div>
</template>

<script setup>
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
</script>

<style lang="scss" scoped>
    .info_box{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .left{
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .vr_name{
                color: #fff;
                font-family: Roboto;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                margin-left: 0.2rem;

                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                > img {
                width: 0.05rem;
                height: 0.08rem;
                margin-left: 0.08rem;
                }
            }
            .dropmenulist{
                margin-left: 0.08rem;
            }
        }

        .right{
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }
  }
</style>