/*
 * @Author: ty-rise 
 * @Date: 2023-10-20 16:12:02 
 * @Last Modified by: ty-rise
 * @Last Modified time: 2023-10-Sa 05:38:13
 */
<template>
    <div class="sub-menu-date-w">
        <div class="sport-m-container">
          <div class="s-menu-container flex" >
            <template  v-for="(item,index) in scrollDataListNew" :key="index">
              <!-- 全部 vr 收藏 电竞显示  -->
              <div v-if="item?.ct > 0 || menu_show_id.includes(+item.mi) || +item.mi>2000" ref="scrollTab" 
                :class="['sport-menu-item', 'flex', 'justify-center',current_mi == item.mi?'current':''] " 
                 @click="set_menu_lv2(item, $event)" >
              <!-- <div ref="scrollTab" :class="['sport-menu-item', 'flex', 'justify-center',current_mi == item.mi?'current':''] "  @click="set_menu_lv2(item, $event)" > -->
                <div class="inner-w flex justify-between items-center">
                  <div class="sport-w-icon">
                    <span class="sport-icon-wrap"
                      :style="compute_css_obj({key:current_mi == item.mi ? 'menu-sport-active-image' : 'menu-sport-icon-image', position:format_type(item)})"></span>
                  </div>
                
                  <div class="s-w-i-title">
                    {{ (item.btn ?item.title : item.name) || MenuData.get_menus_i18n_map(item) }}
                  </div>
                </div>
                <div v-if="props.is_show_badge" v-show="item.ct > 0 && MenuData.top_menu_title.mi != 50000" class="sport-match-count">
                  {{ item.ct || 0 }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { ref,reactive,onMounted,onUnmounted,computed } from "vue";
// import lodash_ from "lodash";
// import BaseData from "src/core/base-data/base-data.js";
import { compute_css_obj, MenuData } from "src/output/index.js";
import {scrollMenuEvent} from "../utils";
import { useMittEmit, MITT_TYPES ,useMittOn} from "src/core/mitt/index.js";
const ref_data = reactive({
    emit_lsit:{}
})
const router = useRouter()
const menu_show_id = reactive([0,300,50000,2000,28]);//全部 vr 收藏 电竞显示
const scrollTab = ref(null);
const props = defineProps({
  // 滑动菜单数据
  scrollDataList:{
    type: Array,
    default: () => []
  },
  // 当前选中的值
  current_mi:{
    type: [String,Number],
    default: ''
  },
  is_show_badge:{
    type: Boolean,
    default: true
  },
})
const scrollDataListNew = computed(()=>{
  if(MenuData.is_esports())return props.scrollDataList;
  return [...[{mi:50000,btn:1,ct:0,title:"收藏"}],...props.scrollDataList]
})
const emits = defineEmits(['changeList','changeMenu'])
/**
 * 二级菜单事件
*/
function set_menu_lv2(item = {},event) {
  // vr跳转
  if(item.mi == 300){
    router.push('/virtual');
    return;
  }
  if (props.current_mi === item.mi) return
  // if (item.mi === 2000) router.push('/esports')
  event = event || scrollTab.value[0];
  // 选中后点击无效
  // if (item.mi == MenuData.current_lv_2_menu_i) return;
  scrollMenuEvent(event,".s-menu-container",".current");
  emits('changeMenu',item)
  // nextTick(()=>{ //收藏是没有change的相当于是页面
  //   // 设置菜单点击事件
  //   useMittEmit(MITT_TYPES.EMIT_SCROLL_TOP_NAV_CHANGE,item)
  // })
}

/**
 * 初始化滚动条
 */
const scrollTabMenu = () =>{
    scrollMenuEvent(scrollTab.value[0],".s-menu-container",".sport-menu-item");
  // })
}
defineExpose({scrollTabMenu});
/**
 * @description: 球类id转化背景
 * @param {String} id 球类id
 * @return {}
 */
const format_type = ( item = {} ) => {
  // if (MenuData.is_results()) {
  //   let type = +item.menuId
  //   // 赛果电竞图标
  //   if ([100, 101, 103, 102].includes(type)) {
  //     type += 2000
  //   }
  //   // 赛果 我的投注
  //   if (item.menuType && item.menuType == 29) {
  //     type = item.menuType
  //   }
  //   // 赛果冠军
  //   if (type == 10000) {
  //     type = 100
  //   }
  //   return type
  // }
  return MenuData.recombine_menu_bg(item, true)
}
/**
 * ws推送球种数量
 * @param {*} list 
 */
const get_menu_ws_list = (list) =>{
    list = list.filter((item)=>{return item.mi});
    let wsList = props.scrollDataList?.map((item)=>{
        list.forEach((n)=>{
            if(item.mi == n.mi){
                item.ct = n.count;
            }
        })
        return item;
    })
    const index = wsList.findIndex((item)=>{return item.mi == 0}),
          is_not_ct = [0,50000];
    //全部增加数量
    if(index !== -1)wsList[index].ct = wsList.map((item)=>{return is_not_ct.includes(item.mi)?0:item.ct}).reduce((n1,n2)=>{return n1+n2}) || 0;//全部
    emits('changeList',wsList)
}
onMounted(()=>{
    ref_data.emit_lsit = {
        emitter_1: useMittOn(MITT_TYPES.EMIT_SET_BESE_MENU_COUNT_CHANGE, get_menu_ws_list).off,
    }
   
})
onUnmounted(()=>{
    Object.values(ref_data.emit_lsit).map((x) => x());
})


</script>
<style  scoped lang="scss">
  .sub-menu-date-w {
    z-index: 501;
    width: 100%;
    max-height: 1.35rem;
    height: 0.5rem;
    padding: 0 0.05rem;
    transition: transform 0.6s, max-height 0.3s;

    // 二级菜单
    .sport-m-container {
      width: 100%;
      height: auto;
      max-height: 1.35rem;
      overflow: hidden;
      position: relative;

      .s-menu-container {
        width: 100%;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        padding-top: 0.04rem;
        padding-bottom: 0.05rem;
        flex-wrap: nowrap;
        scrollbar-width: none; // 去除滚动条火狐浏览器兼容性问题

        .sport-menu-item {
          min-width: 0.52rem;
          height: 100%;
          flex-shrink: 0;
          position:relative;
          background-color: var(--q-gb-bg-c-15);
          color: var(--q-gb-t-c-19);
          &.current {
            //color: var(--q-gb-bd-c-2);
            color: var(--q-gb-t-c-20);
            position: -webkit-sticky;
            position: sticky;
            right: 0;
            left: 0;
            z-index: 2;
            .inner-w {
              position: relative;
              font-size: 0.1rem;
            }
          }
          .inner-w {
            height: 0.41rem;
            flex-direction: column;
            flex-wrap: nowrap;
            position: relative;

            .sport-w-icon {
              height: 0.27rem;
              position: relative;

              .sport-icon-wrap {
                --per: -0.22rem;
                display: block;
                width: auto;
                height: 0.22rem;
                width: 0.22rem;
                background-position: 0 0;
                background-size: 0.22rem auto;
              }

            
            }

            .s-w-i-title {
              max-width: 0.7rem;
              font-size: 0.1rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              position: relative;
              top: -0.01rem;
              padding: 0 1px;
            }
          }
          
        .sport-match-count {
                line-height: 1;
                position: absolute;
                right: 0;
                top: 0;
                font-size: 0.11rem;
        }
        }
      }
    }
  }

</style>