<!--
 * @Description: 脚本配置文档
 * @FilePath: \user-pc-vite\entries\development-document\src\components\job_doc.vue
 * @Date: 2023-08-05 10:56:23
-->

<template>
  <div class="job-doc">
    <q-card class="q-my-md" flat bordered>
      <q-tabs
        v-model="activeTab"
        dense
        class="text-black"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab
          v-for="(item, idx) in docData"
          :key="idx"
          :name="item.category"
          :label="item.category"
          no-caps
          class="text-bold"
        >
          <q-badge color="primary" text-color="white" floating>{{
            item.items?.length
          }}</q-badge>
          <div style="transform: scale(0.9); font-weight: normal">
            <span>说明：{{ item.description }}</span
            ><br />
            <span>路径：{{ item["directory-name"] }}</span>
          </div>
        </q-tab>
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel
          :name="tab.category"
          v-for="(tab, idx) in docData"
          :key="idx"
        >
          <q-splitter v-model="splitterModel">
            <template v-slot:before>
              <q-tabs
                v-model="innerTab"
                vertical
                class="text-black"
                active-color="primary"
                indicator-color="primary"
              >
                <q-tab
                  v-for="(tab, idx) in table_header[activeTab]"
                  :key="idx"
                  :name="tab.filename"
                  :label="tab.filename"
                  no-caps
                />
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                v-model="innerTab"
                animated
                transition-prev="slide-down"
                transition-next="slide-up"
              >
                <q-tab-panel
                  v-for="(tab, idx) in table_header[activeTab]"
                  :key="idx"
                  :name="tab.filename"
                >
                  <span class="job-doc-table-desc">描述：</span>
                  <div
                    v-for="(val, i) in tab.descriptions"
                    :key="i"
                    class="q-mb-xs"
                  >
                    {{ val }}
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  docData: {
    type: Array,
    default: () => [],
  },
});
const splitterModel = 20;
// 头部table
let table_header = [];

const init_table = () => {
  table_header = props.docData.reduce((prve, cur) => {
    prve[cur.category] = cur.items;
    return prve;
  }, {});
};
init_table();

// 顶部选中tab
const activeTab = ref(props.docData[0]?.category);
// 侧边选中tab
const innerTab = ref(table_header[activeTab.value]?.[0]?.filename);

watch(activeTab, (val) => {
  innerTab.value = table_header[val]?.[0]?.filename;
});
</script>

<style lang="scss" scoped>
.job-doc {
  &-table-desc {
    font-size: 16px;
    color: #9f9e9e;
    font-weight: bold;
  }
}
</style>