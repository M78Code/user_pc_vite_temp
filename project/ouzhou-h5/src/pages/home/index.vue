<template>
  <div class="home_page">
    <!-- tab 切换 -->
    <div class="header_tabs">
      <q-tabs v-model="tabValue" dense class="bg-grey-3" align="justify" narrow-indicator @update:modelValue="on_update">
        <q-tab name="featured" label="Featured" />
        <q-tab name="top_events" label="Top Events" />
      </q-tabs>
    </div>
    <!-- 主内容区 -->
    <div class="home_content" ref="scrollAreaRef" :visible="false">
      <q-tab-panels v-model="tabValue" animated>
        <!-- featured page -->
        <q-tab-panel name="featured">
          featured
        </q-tab-panel>
        <!-- top Events page -->
        <q-tab-panel name="top_events">
          <scroll-menu menu_type="1" :is_show_badge="false"  v-if="MenuData.menu_list.length" />
          <!-- 赛事列表 -->
          <div class="match_page">
            <MatchContainer />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
 
<script setup> 
import { ref } from "vue";
import { watch } from "vue";
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import scrollMenu from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-menu.vue';
import { MenuData } from "src/core/index.js";
watch(() => MenuData.update_time.value, () => {
  console.log("菜单id-球类id-对应euid",`${MenuData.menu_type.value}-${MenuData.menu_mi.value}-${MenuData.get_euid()}`)
})
const tabValue = ref('featured');
// tabs 切换
const on_update = () => {
}

</script>
 
<style scoped lang="scss">
.home_page{
  height: 100%;
  overflow: hidden;
  .header_tabs{
    border-bottom: 1px solid #FF7000;
    :deep(.q-tabs--dense){
      .scroll--mobile{
        height: 50px;
        background: #fff;
        padding: 0 10px;
        background-repeat: no-repeat;
        // background-image: url("src/assets/images/featured/mask.png");
        background-size: contain;
        background-position: right;
        .q-tab{
          flex: none;
        }
        .q-ripple{
          display: none;
        }
      }
      .q-tab__label{
        color: #8A8986;
        text-transform: capitalize;
        font-weight: 600;
      }
      .q-tab--active .q-tab__label{
        color: #FF7000;
      }
      .q-tab__indicator{
        height: 3px;
        background: #FF7000;
      }
    }
  }
  .home_content{
    height: calc(100% - 106px);
    .q-tab-panels{
      height: 100%;
      .q-tab-panel{
        padding: 0;
        overflow: hidden;
        .match_page{
          height: calc(100% - 66px - 54px);
          overflow-y: hidden;
          position: relative;
          .match-list-container{
            height: 100%;
            background: #fff !important;
            :deep(.scroll-wrapper){
              background: #fff !important;
              .s-w-item{
                background: #fff !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
