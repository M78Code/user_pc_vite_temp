<template>
  <div>
    <div v-show="false">{{ LayOutMain_pc.layout_version }}</div>
    <q-dialog
      v-model="LayOutMain_pc.layout_secondary_dialog"
      class="secondary_module"
      persistent
      full-width
      full-height
    >
      <!-- <q-card class="q-card dialog_card"> -->
      <div class="dialog_content">
        <!-- 头部 -->
        <header class="header">
          <div class="row items-center justify-between top_tit">
            <!-- <p>{{ i18n_t('ouzhou.set.personal') }}</p> -->
            <p></p>
            <p>
              <img
                :src="compute_local_project_file_path('/image/svg/close.svg')"
                @click="close_page"
              />
            </p>
          </div>
          <div class="row secondary_obj">
          <div v-show="false">{{ LayOutMain_pc.layout_version }}</div>
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
        <section class="secondary_content">
          <q-tab-panels v-model="LayOutMain_pc.layout_secondary_active" animated>
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
    </q-dialog>
  </div>
</template>

<script setup>
import {LayOutMain_pc} from "src/output/project/index.js";
import { compute_local_project_file_path } from "src/output/index.js";
import { ref, reactive,toRef, toRefs } from "vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import rule from "src/base-pc/components/rule/index.vue";
import announce from "src/base-pc/components/announce/index.vue";
import matchResults from "src/base-pc/components/results/match-results.vue";
import { i18n_t } from "src/boot/i18n.js"

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
/**
 * @description: 关闭弹窗
 * @param {}
 * @return {}
 */
function close_page(value) {
  LayOutMain_pc.set_layout_secondary_dialog();
  BetData.set_bet_box_draggable({ show: true });
}
</script>
<style lang="scss">
//.q-dialog__inner .dialog_content

.secondary_module  {
  .dialog_content{
    padding-left: 320px;
  }
  max-width: 1200px !important;
  background: var(--q-gb-t-c-1);
  margin-left: 200px;
  z-index: 9999 !important;
  .header {
    padding: 10px;
    width: 1200px;
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
      }
      .active {
        -color: var(--q-gb-t-c-2);
        color: #ff7000;
        border-bottom:2px solid #ff7000;
      }
    }
  }
  .q-tab-panels{
  height: 100% !important;
}
  .q-tab-panel{
    padding: 0 !important;
}
    .secondary_content{
      height:calc(100% - 80px);
      width: 1200px;
    }
}

</style>/index.js