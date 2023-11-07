<template>
    <div class="rule_page">
      <headerSelect :rule_headle_info ="rule_headle_info"></headerSelect>
      <section>
        <div class="title">General Sports Explanation</div>
        <q-scroll-area style="height: 100%;">
          <collapse v-for="(item,index) in rules_list" :key="index" :title="item.title">
            <template v-slot:content>
              <div class="content">
                {{ item.content }}
              </div>
            </template>
            <div>{{ item.content }}</div>
          </collapse>
        </q-scroll-area>
      </section>
    </div>
  </template>
   
  <script setup>
  import { ref ,reactive,onMounted} from 'vue'
  import collapse from "src/base-h5/components/personal/components/collapse.vue"
  import headerSelect from "src/base-h5/components/personal/components/header_select.vue"
  import { rules_data } from "src/base-h5/components/personal/components/rules"
  
  let rule_headle_info = reactive([
    {
      name:'General Rules',
      id:"112"
    },
    {
      name:'Betting Tutorial',
      id:"112"
    },
    {
      name:'General Rules',
      id:"112"
    },
    {
      name:'General Rules',
      id:"112"
    },
    {
      name:'General Rules',
      id:"112"
    },
    {
      name:'General Rules',
      id:"112"
    },
  ]);
  
  const rules_list = rules_data
  </script>
   
  <style scoped lang="scss">
  .rule_page{
    height: 100%;
    background: #E2E2E2;
    header{
      height: 44px;
      margin-bottom: 10px;
      background: #fff;
    }
    section{
      height: calc(100% - 54px);
      background: #fff;
      font-size: 14px;
      font-weight: 400;
      color: #1A1A1A;
      margin-top: 10px;
      .title{
        font-weight: 500;
        padding: 10px 20px;
        border-bottom: 1px solid #F3F3F3;
      }
      :deep(.q-scrollarea__thumb){
        display: none;
      }
      :deep(.collapse_page) {
        .title{
          height: 50px;
          padding: 0 20px;
          border-bottom: 1px solid #F3F3F3;
        }
        .content{
          line-height: 22px;
          padding: 5px 10px;
        }
      }
    }
  }
  
  </style>
  