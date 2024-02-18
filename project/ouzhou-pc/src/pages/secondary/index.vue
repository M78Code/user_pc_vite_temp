<template>
  <div class="secondary_module">
        <!-- 头部 -->
        <header class="header">
          <div class="row items-center justify-between top_tit">
          <p></p>
            <!-- <p>{{ i18n_t('ouzhou.set.personal') }}</p> -->
            <!-- <p>
              <img
                :src="compute_local_project_file_path('/image/svg/close.svg')"
                @click="close_page"
              />
            </p> -->
          </div>
          <div class="row secondary_obj">
            <p
              class="secondary_name"
              :class="item.id === LayOutMain_pc.layout_secondary_active ? 'active' :'' "
              v-for="item in list_data"
              :key="item.id"
              @click="active_change(item.id)"
            >{{ i18n_t(`ouzhou.set.${item.i18filed}`)}}</p>
          </div>
          <q-card></q-card>
        </header>
        <!-- 内容 -->
        <div v-show="false">{{ LayOutMain_pc.layout_version }}</div>
        <section class="secondary_content">
          <q-tab-panels class="secondary_panels" v-model="LayOutMain_pc.layout_secondary_active" animated transition-prev="slide-down"
                transition-next="slide-up">
          <!-- 公告 -->
            <q-tab-panel name="announcement">
              <announce></announce>
            </q-tab-panel>
            <!-- 赛果 -->
            <q-tab-panel name="results">
            <matchResults></matchResults>
            </q-tab-panel>
            <!-- 规则 -->
            <q-tab-panel name="sportsrules">
              <rule></rule>
            </q-tab-panel>
          </q-tab-panels>
        </section>
  </div>
</template>

<script setup>
import {LayOutMain_pc} from "src/output/project/index.js";
import { compute_local_project_file_path } from "src/output/index.js";
import { ref, reactive,onMounted,nextTick } from "vue";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import rule from "src/base-pc/components/rule/index.vue";
import announce from "src/base-pc/components/announce/index.vue";
import matchResults from "src/base-pc/components/results/match-results.vue";
import { i18n_t } from "src/boot/i18n.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import { loadLanguageAsync } from "src/output/index.js";
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
//数据列表
const list_data = reactive([
  { id: "announcement", name: "Announcement", i18filed: 'announcement' },
  { id: "results", name: "Results", i18filed: 'results' },
  { id: "sportsrules", name: "Sports rules", i18filed: 'sport_rules' }
]);
/**
 * @description: 改变激活的数据
 * @param {}
 * @return {}
 */
function active_change(value) {
 LayOutMain_pc.set_layout_secondary_active(value)
}
onMounted(()=>{
 loadLanguageAsync(LocalStorage.get('lang'));
 const value = SEARCH_PARAMS.init_param.get("secondary_active") || localStorage.getItem("secondary_active") ;
 active_change(value)
 nextTick(() => {
    // 隐藏loading动画 
    useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD,0);
  })
})
</script>
<style lang="scss" scope>
//.q-dialog__inner .dialog_content
.secondary_module  {
  width: 100%;
  height: 100%;
  background: var(--q-gb-t-c-1);
  .header {
    padding: 10px;
    width: 100%;
    height: 80px;
    border-bottom: 1px solid #ff7000;
    background: url($SCSSPROJECTPATH+"/image/png/secondary_bg.png") no-repeat
      center / cover;
    .top_tit {
      font-size: 18px;
      -color: var(--q-gb-t-c-1);
      color: #ffffff;
    }
    .secondary_obj {
      -color: var(--q-gb-t-c-3);
      color: #C2C2C2;
      .secondary_name {
        margin-right: 30px;
        cursor: pointer;
      }
      .active {
        -color: var(--q-gb-t-c-2);
        color: #ff7000;
        border-bottom:2px solid #ff7000;
      }
    }
  }
  .q-tab-panel{
    padding: 0 !important;
}
.secondary_panels{
  // height: 760px !important;
}
.secondary_content{
  height:calc(100% - 80px);
}
}
</style>