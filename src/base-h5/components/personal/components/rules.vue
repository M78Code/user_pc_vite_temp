<template>
    <div class="rule_page">
      <iframe class="rules-iframe" src="http://sports-rules-ouzhou-test.sportxxx3pk.com/#/zh_cn" />

      <!-- <section>
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
      </section> -->
    </div>
  </template>
   
  <script setup>
  </script>
   
  <style scoped lang="scss">
  .rule_page{
    height: 100%;
    background: #E2E2E2;
    .rules-iframe {
      width: 100%;
      height: 100%;
    }
  }
  
  </style>
  