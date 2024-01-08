<template>
    <div class="info_box">
        <div class="left">
            <div class="back" @click="go_back">
                <img class="bakc-icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/menu/top-menu/back.png`" alt="" />
            </div>
            <!-- <div class="detail-back" v-if="['/virtual_sports_details', '/virtual_sports_details/'].includes(router.currentRoute.value.path)" @click="go_where({back_to: 'go_back_from_virtual_detail', route_name:route.name,route,router})"></div> -->
            <div class="vr_name">
                <span style="margin-left: 0.01rem;">VR Sports</span>
                <img :src="`${LOCAL_PROJECT_FILE_PREFIX }/image/menu/top-menu/back.png`" alt="">
            </div>
            <div class="drop_menulist">
                <q-btn-dropdown color="rgba(0,0,0, 0)" :flat="true" no-caps :glossy="false" :ripple="false" label="VR-Basketball">
                    <q-list>
                        <q-item clickable v-close-popup @click="onItemClick">
                            <q-item-section>
                                <q-item-label>VR-Basketball</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="onItemClick">
                            <q-item-section>
                                <q-item-label>VR-Footerball</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="onItemClick">
                            <q-item-section>
                                <q-item-label>VR-Greyhounds</q-item-label>
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
import {ref} from 'vue';
import lodash from 'lodash';
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute()
import NavbarSubscribe from "../../detail-top/nav-bar-subscribe";
import BaseData from "src/core/base-data/base-data.js";
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';

const hisLen = ref(history.length)
const props = defineProps(['is_vr_page'])

const onItemClick = (event)=>{
    console.log('event', lodash.get(event, 'event.target', ''))
}


// 回到上一页
const go_back = () => {
  if(props.is_vr_page){
    // console.log("history===", history);
    // router.go(hisLen.value - history.length - 1)
    router.push('/virtual')
    return ;
  }
}


/** 返回上一页 */
const toHome = async() => {

    router.back()
    return
  // 设置 元数据计算 流程
  // 先通知观察者返回
  NavbarSubscribe.instance.back();
  // 异步获取状态
  const res = await NavbarSubscribe.instance.get_status();
  console.log("res",   res);
  // 状态为真，可以返回
  if (res) {
    BaseData.set_is_emit(true)
    // MatchMeta.clear_match_info()
    MatchResponsive.set_is_compute_origin(true)
    router.back()
  } else {
    // 状态为false，执行其他操作
  }
};

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

            .back{
                color: #ffd5b2;
                // width: 18%;
                .bakc-icon {
                    width: 0.05rem;
                    height: 0.08rem;
                    vertical-align: middle;
                    margin-left: 0.06rem;
                    margin-top: -0.02rem;
                }
            }

            .vr_name{
                color: #fff;
                font-family: Roboto;
                font-size: 0.14rem;
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