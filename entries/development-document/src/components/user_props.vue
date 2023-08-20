<!--
 * @Description: API配置文档-卡片
 * @FilePath: \user-pc-vite\entries\development-document\src\components\user_props.vue
 * @Date: 2023-08-12 17:19:33
-->
<template>
  <div class="q-ml-md">
    <div class="item-definition">
      <!-- 标题/类型 -->
      <div
        class="col-xs-12 col-sm-12 row items-center item-definition-title"
        v-if="userData.title"
      >
        <q-badge
          class="item-definition-title-pill"
          :label="userData.title"
          :color="userData.bcolor"
        />
        <div class="item-definition-title-type q-ml-xs">
          ：{{ userData.type }}
        </div>
      </div>
      <!-- 内容部分 -->
      <div class="item-definition-content">
        <!-- 描述 -->
        <div class="q-mt-xs" v-if="userData.desc">
          <div>描述</div>
          <div class="text-black">{{ userData.desc }}</div>
        </div>
        <!-- 默认值 -->
        <div class="q-mt-xs" v-if="userData.default">
          <div>默认值</div>
          <div class="q-ml-md row">
            <div class="item-examples">
              {{ userData.default }}
            </div>
          </div>
        </div>
        <!-- 接受的值 -->
        <div class="q-mt-xs" v-if="userData.values">
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
        <!-- 参数-->
        <div class="q-mt-xs" v-if="userData.params">
          <div>参数</div>
          <div v-for="(dples3, ix) in userData.params" :key="ix">
            <user_props :userData="dples3"></user_props>
          </div>
        </div>

        <!-- 属性-返回 -->
        <div class="q-mt-xs" v-if="userData.returns">
          <div>返回 &nbsp;&lt;{{ userData.returns.type }}&gt;&nbsp;</div>
          <div class="q-ml-md">
            <div class="item-definition">
              <div class="item-definition-content">
                <div class="q-mt-xs" v-if="userData.returns.desc">
                  <div>描述</div>
                  <div class="text-black">
                    {{ userData.returns.desc }}
                  </div>
                </div>
                <div class="q-mt-xs" v-if="userData.returns.examples">
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
        <div class="q-mt-xs" v-if="userData.examples">
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
        <!-- 属性 -->
        <div class="q-mt-xs" v-if="userData.definition">
          <div>属性</div>
          <div v-for="(dples, ix) in userData.definition" :key="ix">
            <user_props :userData="dples"></user_props>
          </div>
        </div>
        <!-- 范围 -->
        <div class="q-mt-xs" v-if="userData.scope">
          <div>范围</div>
          <div v-for="(dples2, ix) in userData.scope" :key="ix">
            <user_props :userData="dples2"></user_props>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>scope
  
<script setup>

const props = defineProps({
  userData: {
    type: Object,
    default: () => ({}),
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
}
</style>