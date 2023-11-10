<template>
    <div class="announcement_page">
      <headerSelect :announcement_headle_info="announcement_headle_info"></headerSelect>
      <section>
        <div class="title"> <span>information</span>  <span class="titlebtn" @click="readall">Read All</span></div>
        <q-scroll-area style="height: 100%;">
          <div v-for="(item , index) in announcement_data" :key="index">
            <div class="contents">
              <span v-if="show">*</span><div>{{ item.content }}</div>
            </div>
            <div class="footer">
              <div class="ann-time">{{ DateForMat(new Date(), 'yyyy-MM-dd hh:mm') }}</div>
              <div v-if="show" class="read" @click="showclick(index)">Read</div>
            </div>
          </div>
        </q-scroll-area>
      </section>
    </div>
  </template>
   
<script setup>
import { ref ,reactive,onMounted} from 'vue'
import headerSelect from "src/base-h5/components/personal/components/header_select.vue"
import { DateForMat } from 'src/core/format/module/format-date.js'

const announcement_headle_info = reactive([
    {
      name:'Football',
      id:"1"
    },
    {
      name:'Basketball',
      id:"1"
    },
    {
      name:'tennis',
      id:"1"
    },
    {
      name:'Badminton',
      id:"1"
    },
    {
      name:'Badminton',
      id:"1"
    },
    {
      name:'Badminton',
      id:"1"
    },
  ]);

const announcement_data = reactive([
    {
      content:"abcdefgabcdefgabcdefgabcdefg",
      id:2
    },
    {
      content:"abcdefgabcdefgabcdefgabcdefg",
      id:2
    },
    {
      content:"abcdefgabcdefgabcdefgabcdefg",
      id:2
    },
    {
      content:"abcdefgabcdefgabcdefgabcdefg",
      id:2
    },
    {
      content:"abcdefgabcdefgabcdefgabcdefg",
      id:2
    },
    {
      content:"abcdefgabcdefgabcdefgabcdefg",
      id:2
    },
    {
      content:"abcdefgabcdefgabcdefgabcdefg",
      id:2
    },
    {
      content:"abcdefgabcdefgabcdefgabcdefg",
      id:2
    },
    {
      content:"abcdefgabcdefgabcdefgabcdefg",
      id:2
    },
    {
      content:"abcdefgabcdefgabcdefgabcdefg",
      id:2
    },
])

const show = ref(true)

const readall = () => {
  // console.log('全部')
}

const showclick = (index) => {
  // console.log("read")
}

</script>
   
  <style scoped lang="scss">
  .announcement_page{
    width: 100%;
    height: 100%;
    background: #E2E2E2;
    header{
      height: 44px;
      margin-bottom: 10px;
      background: #fff;
    }
    section{
      height: calc(100% - 75px);
      background: #fff;
      font-size: 14px;
      font-weight: 400;
      color: #1A1A1A;
      margin-top: 10px;
      .title{
        font-weight: 500;
        padding: 10px 20px;
        border-bottom: 1px solid #F3F3F3;
        display: flex;
        justify-content: space-between;
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
      :deep(.q-scrollarea__content){
        width: 100%;
        margin-bottom: 67px;
      }
      .ann-time {
                margin-top: 0.08rem;
                margin-bottom: 0.1rem;
                font-size: 0.12rem;
            }
            .titlebtn{
              width: 70px;
              height: 24px;
              border: 0.5px solid #ff7000;
              border-radius: 20px;
              text-align: center;
              line-height: 24px;
              font-size: 12px;
              font-weight: 400;
            }
            .contents{
              display: flex;
              padding: 5px 15px;
            }
            .read{
              width: 60px;
              height: 24px;
              border: 0.5px solid #DBDBDB;
              border-radius: 20px;
              text-align: center;
              line-height: 24px;
              font-size: 12px;
              font-weight: 400;
            }
            .footer{
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0px 20px;
            }
    }
  }
  
  </style>
  