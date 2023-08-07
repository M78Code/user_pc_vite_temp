<!--
 * @Description: API配置文档
 * @FilePath: \user-pc-vite\entries\development-document\src\components\user_doc.vue
 * @Date: 2023-08-04 16:08:04
-->

<template>
  <div class="user-doc">
    <q-tabs
      v-model="active_headKey"
      dense
      class="text-bold"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      no-caps
    >
      <q-tab
        v-for="(tab, idx) in headerKey"
        :key="idx"
        :name="tab.tabName"
        :label="tab.tabName"
        class="position-relative"
      >
        <span class="badge-right">{{ tab.sunLen }}</span>
      </q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="active_headKey" animated>
      <q-tab-panel
        :name="hand.tabName"
        v-for="(hand, id) in headerKey"
        :key="id"
      >
        <!-- 右边展示 -->
        <template v-if="['props'].includes(active_headKey)">
          <q-splitter
            v-model="splitterModel"
            style="height: 600px; text-align: left"
          >
            <template v-slot:before>
              <q-tabs
                v-model="active_leftKey"
                vertical
                class="text-primary"
                no-caps
                dense
              >
                <q-tab
                  v-for="(left, idx) in leftKey_data"
                  :key="idx"
                  :name="left.name"
                  :label="left.name"
                  class="position-relative"
                >
                  <span class="badge-right">{{ left.len }}</span>
                </q-tab>
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                v-model="active_leftKey"
                animated
                transition-prev="slide-down"
                transition-next="slide-up"
              >
                <q-tab-panel
                  :name="left.name"
                  v-for="(left, idx) in leftKey_data"
                  :key="idx"
                >
                  <div class="">
                    <div
                      v-for="(item, index) in table_data[active_headKey][
                        active_leftKey
                      ]"
                      :key="index"
                      style="border: 1px solid #000; margin: 5px; padding: 5px"
                    >
                      <div>{{ item.title }}：{{ item.type }}</div>
                      <div>描述：{{ item.desc }}</div>
                      <div v-show="item.default">
                        默认值：{{ item.default }}
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </template>

        <!-- 不展示右边 -->
        <template v-else>
          <div>
            <div v-for="(item, i) in table_data[active_headKey]" :key="i"  style="fontSize: 15px;border: 1px solid #000; margin: 5px; padding: 5px">
              <div style="font-size: 15px;">{{ item.title }}</div>
              <div>描述：{{ item.desc }}</div>
            </div>
          </div>
        </template>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";

const props = defineProps({
  docData: {
    type: Array,
    default: () => [],
  },
});
const splitterModel = ref(12);
// 顶部key
const headerKey = ref([]);
// 数据源
const table_data = ref({});
// props左边分类
const leftKey_data = ref([]);
// 顶部选中的key
const active_headKey = ref("props");
const active_leftKey = ref("");

const init_doc = (docdata) => {
  headerKey.value = [];
  table_data.value = {};
  docdata?.forEach((docdata) => {
    for (let key in docdata) {
      let keyObjData = [];
      // 排除
      if (!["file_path", "meta", "leftmenu", "mixins"].includes(key)) {
        for (let k in docdata[key]) {
          const obj = {
            title: k,
            ...docdata[key][k],
          };
          keyObjData.push(obj);
        }
        // header数据
        const keysObj = {
          tabName: key,
          sunLen: keyObjData?.length || 0,
        };
        headerKey.value.push(keysObj);
        table_data.value[key] = table_filter(key, keyObjData);
      }
    }
  });
};

function table_filter(keys, datas) {
  const arrobj = keys == "props" ? {} : [];
  return datas.reduce((prev, cur) => {
    // props 处理
    if (["props"].includes(keys)) {
      const categorys = cur.category?.split("|");
      categorys?.map((v) => {
        const obj1 = {
          ...cur,
          type: Array.isArray(cur.type) ? cur.type.join(" | ") : cur,
        };
        if (prev[v]) {
          prev[v].push(obj1);
        } else {
          prev[v] = [obj1];
        }
      });
    } else {
      prev.push(cur);
    }
    return prev;
  }, arrobj);
}

const props_left = (key) => {
  for (let k in table_data.value[key]) {
    let Obj = {
      len: Object.keys(table_data.value[key][k])?.length || 0,
      name: k,
    };
    leftKey_data.value.push(Obj);
  }
  active_leftKey.value = leftKey_data.value[0]?.name;
};

watch(
  () => props.docData,
  (docval) => {
    leftKey_data.value = [];
    init_doc(docval);
    props_left("props");
    active_headKey.value = "props";
  },
  { immediate: true }
);

watch(
  active_headKey,
  (handkey) => {
    leftKey_data.value = [];
    if (handkey == "props") {
      props_left(handkey);
    }
  },
  { immediate: true }
);

watch(active_leftKey, (val) => {
  active_leftKey.value = val;
});
</script>
<style lang="scss" src="basesrc/styles/common.scss" scoped />