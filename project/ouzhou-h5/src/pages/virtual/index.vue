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
                <div class="item_content">
                    <div>267382-</div>
                    <img :src="`${LOCAL_PROJECT_FILE_PREFIX }/image/menu/top-menu/mask_group.png`" alt="">
                </div>
                <div class="item_vertical_line"></div>
            </div>
        </div>
        
        <div class="match_list_box">
            <div class="match_list">
                <div class="match_item" v-for="(item, index) in [0,1,2,3,4,5]" :key="index">
                    <div class="left">
                        <div class="left_item" v-for="(it, inde) in [0, 1]" :key="inde">
                            <div class="left_item_left"></div>
                            <div class="left_item_right"></div>
                        </div>
                    </div>
                    <div class="vertical_line"></div>
                    <div class="right"></div>
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
            background-color: #fff;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .nav_item{
                // width: 0.49rem;
                height: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                .item_content{
                    height: 100%;
                    // background-color: palegoldenrod;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    >div{
                        height: 0.15rem;
                        margin-top: 0.15rem;
                        padding-left: 0.15rem;
                        padding-right: 0.15rem;
                        // background-color: orange;
                        // border-right: 0.005rem solid #D9D9D9;
                        color: #FF7000;
                        text-align: center;
                        font-family: Roboto;
                        font-size: 13px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: normal;
                        text-transform: capitalize;
                    }
                    
                    >img{
                        margin-top: 0.10rem;
                        margin-bottom: 0.01rem;
                        // padding-right: 0.14rem;
                    }
                }

                .item_vertical_line{
                    // background-color: blue;
                    width: 0.005rem;
                    height: 0.12rem;
                    flex-shrink: 0;
                    background: #D9D9D9;
                }
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
                    height: 0.9rem;
                    background-color: orange;
                    // margin-top: 0.2rem;
                    border-top: 0.005rem solid #ccc;
                }
            }
        }
    }
</style>