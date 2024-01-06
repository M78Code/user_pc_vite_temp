<template>
    <q-page class="container">
        <div class="tablist">
            <q-tabs v-model="tab" align="left" :breakpoint="0" class="text-white shadow-2" dense no-caps>
                <q-tab class="text-orange" name="mails" label="Leagues 3x3" />
            </q-tabs>
        </div>
        <div class="video_box"></div>

        <div class="nav_list">
            <div class="nav_item" v-for="(item, index) in [0,1]" :key="index">
                <div>267382-</div>
                <img :src="`${LOCAL_PROJECT_FILE_PREFIX }/image/menu/top-menu/mask_group.png`" alt="">
            </div>
        </div>
        
        <div class="match_list_box">
            <div class="match_list">
                <div class="match_item" v-for="(item, index) in [0,1,2,3,4,5]" :key="index">
                    比赛item{{ index }}
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
    import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
    import {ref} from 'vue'
    const tab = ref('mails')
</script>

<style lang="scss" scoped>
    .container{
        .video_box{
            width: 100vw;
            height: 2.08rem;
            flex-shrink: 0;
            background-color: rgba($color: #000000, $alpha: .3);
        }

        .nav_list{
            width: 100%;
            height: 0.44rem;
            background-color: paleturquoise;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .nav_item{
                // width: 0.49rem;
                height: 0.15rem;
                margin-top: 0.15rem;
                margin-bottom: 0.15rem;
                padding-right: 0.15rem;
                background-color: orange;
                border-right: 0.01rem solid blue;

                color: #FF7000;

                text-align: center;
                font-family: Roboto;
                font-size: 13px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                text-transform: capitalize;

                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        }

        .match_list_box{
            width: 100vw;
            height: 100%;
            background-color: palegoldenrod;
            .match_list{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .match_item{
                    width: 100%;
                    background-color: orange;
                    margin-top: 0.2rem;
                }
            }
        }
    }
</style>