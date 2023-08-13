<!--
 * @Description: API配置文档-卡片
 * @FilePath: \user-pc-vite\entries\development-document\src\components\user_props.vue
 * @Date: 2023-08-12 17:19:33
-->

<template>
  <div class="q-ml-md">
    <div class="item-definition">
      <div class="col-xs-12 col-sm-12 row items-center item-definition-title" v-if="userData.key">
        <q-badge
          class="item-definition-title-pill"
          :label="userData.key"
          :class="['badge-1']"
        />
        <div class="item-definition-title-type q-ml-xs">
          ：{{ userData.type }}
        </div>
      </div>
      <div class="item-definition-content">
        <div class=" q-mt-xs" v-if="userData.desc">
          <div>描述</div>
          <div class="text-black">{{ userData.desc }}</div>
        </div>
        <div class=" q-mt-xs" v-if="userData.default">
          <div>默认值</div>
          <div class="q-ml-md row">
            <div class="item-examples">
              {{ userData.default }}
            </div>
          </div>
        </div>
        <div class=" q-mt-xs" v-if="userData.values">
          <div>接受的值</div>
          <div class="q-ml-md row">
            <div
              class="item-examples"
              v-for="(vals, i) in userData.values"
              :key="i"
            >
              {{ vals }}
            </div>
          </div>
        </div>

        <!-- 属性-参数 -->
        <div class=" q-mt-xs" v-if="userData.params">
          <div>参数</div>
          <div class="q-ml-md">
            <div
              class="item-definition"
              v-for="(dparms, x) in userData.params"
              :key="x"
            >
              <div
                class="col-xs-12 col-sm-12 row items-center item-definition-title"
              >
                <q-badge
                  class="item-definition-title-pill"
                  :label="dparms.key"
                  :class="['badge-2']"
                />
                <div class="item-definition-title-type q-ml-xs">
                  ： {{ dparms.type }}
                </div>
              </div>
              <div class="item-definition-content">
                <div class=" q-mt-xs" v-if="dparms.desc">
                  <div>描述</div>
                  <div class="text-black">
                    {{ dparms.desc }}
                  </div>
                </div>
                <div>
                  <div
                    class=" q-mt-xs"
                    v-if="dparms.examples"
                  >
                    <div>例子</div>
                    <div class="q-ml-md row">
                      <div
                        class="item-examples"
                        v-for="(m, i) in dparms.examples"
                        :key="i"
                      >
                        {{ m }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 属性-返回 -->
        <div class=" q-mt-xs" v-if="userData.returns">
          <div>返回 &nbsp;&lt;{{ userData.returns.type }}&gt;&nbsp;</div>
          <div class="q-ml-md">
            <div class="item-definition">
              <div class="item-definition-content">
                <div
                  class=" q-mt-xs"
                  v-if="userData.returns.desc"
                >
                  <div>描述</div>
                  <div class="text-black">
                    {{ userData.returns.desc }}
                  </div>
                </div>
                <div
                  class=" q-mt-xs"
                  v-if="userData.returns.examples"
                >
                  <div>例子</div>
                  <div class="q-ml-md row">
                    <div
                      class="item-examples"
                      v-for="(detx, di) in userData.returns.examples"
                      :key="di"
                    >
                      {{ detx }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 例子 -->
        <div class=" q-mt-xs" v-if="userData.examples">
          <div>例子</div>
          <div class="q-ml-md row">
            <div
              class="item-examples"
              v-for="(dples, ix) in userData.examples"
              :key="ix"
            >
              {{ dples }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  userData: {
    type: Object,
    default: () => ({}),
  },
  badgeColor: {
    type: Number,
    default: 1,
  },
});

</script>

<style lang="scss" scoped>
// 属性参数
.item-definition {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 16px;
  margin-top: 5px;
  border-radius: 5px;
  &-title {
    min-height: 25px;
    &-pill {
      font-size: 15px;
      letter-spacing: 0.7px;
      line-height: 1.4em;
      color: #fff;
    }
    &-type {
      line-height: 24px;
      color: #000;
    }
  }
  &-content {
    .item-examples {
      background-color: #eee;
      border: 1px solid #ddd;
      color: #000;
      margin: 4px;
      padding: 2px 4px;
      border-radius: 4px;
    }
  }
  .badge-1 {
    background-color: var(--q-accent);
  }
  .badge-2 {
    background-color: var(--q-secondary);
  }
}
</style>