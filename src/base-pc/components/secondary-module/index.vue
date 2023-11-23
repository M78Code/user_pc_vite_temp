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
            <p>personal</p>
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
            >{{item.name}}</p>
          </div>
          <q-card></q-card>
        </header>
        <!-- 内容 -->
        <section>
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
import { LayOutMain_pc } from "src/core/index.js";
import { compute_local_project_file_path } from "src/core/index.js";
import { ref, reactive,toRef, toRefs } from "vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import rule from "src/base-pc/components/rule/index.vue";
import announce from "src/base-pc/components/announce/index.vue";
import matchResults from "src/base-pc/components/results/match-results.vue";

//数据列表
const list_data = reactive([
  { id: "announcement", name: "Announcement" },
  { id: "results", name: "Results" },
  { id: "sportsrules", name: "Sports rules" }
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
.secondary_module .q-dialog__inner .dialog_content {
  min-width: 1200px !important;
  background: var(--q-gb-t-c-1);
  .header {
    padding: 10px;
    width: 100%;
    height: 80px;
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
  .q-tab-panel{
    padding: 0 !important;
}
}
::v-deep.q-tab-panel{
  padding: 0 ;
}
</style>