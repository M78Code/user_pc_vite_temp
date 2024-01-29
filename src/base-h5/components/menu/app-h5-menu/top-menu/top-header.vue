<template>
    <div class="top-header">
        <div class="top-header-left">
            <div class="detail-back" @click="goBack()" :style="compute_css_obj({key: 'h5_back_img'})"></div>
        </div>
        <div class="top-header-content">
            {{MenuData.top_menu_title.title}}
        </div>
        <div class="top-header-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script setup>
import { MenuData,LOCAL_PROJECT_FILE_PREFIX , compute_css_obj, compute_local_project_file_path } from "src/output/index.js";
import { useRoute , useRouter } from "vue-router";
import { useMittOn,MITT_TYPES, useMittEmit } from "src/core/mitt/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
const route = useRoute()
const router = useRouter()
  /**
   * 初始化数据
   */
  const goBack = () =>{
    MenuData.set_top_menu_title({})
    MenuData.set_init_menu_list()
    useMittEmit(MITT_TYPES.EMIT_MENU_GO_BACK)
    //电竞返回页面，返回串关显示串关图标，其他页面不显示
    if(MenuData.old_current_lv_1_menu_i!=6) {
        BetData.set_is_bet_single('single')
    }
        BetData.set_clear_bet_info()
        BetViewDataClass.set_clear_bet_view_config()
    if (route.name === 'esports_sports') router.back()
  }


</script>
<style lang="scss" scoped>
    .top-header{
        width: 100%;
        height: 0.44rem;
        line-height: 0.44rem;
        align-items: center;
        display: flex;
        white-space: nowrap;
        padding: 0 0.14rem 0 0 ;
        position: relative;
        .top-header-left{
            height: 100%;
            padding-left: 0.09em;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex: 1 1;
            
        }
        .top-header-content{
            font-weight: 400;
            font-size: 18px;
            flex: auto;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--q-gb-t-c-18);
        }
        .top-header-right{
            text-align: right;
            flex: 1 1;
        }
    }
    .detail-back {
        width: 0.3rem;
        height: 100%;
        z-index: 0;
        background-size: 0.1rem auto;
        margin-left: 0.05rem;
       background-position: center;
      }
</style>