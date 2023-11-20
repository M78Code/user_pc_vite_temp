<template>
   
  <div>
  <div v-show="false">{{ LayOutMain_pc.layout_version }}</div>
    <q-dialog v-model="LayOutMain_pc.layout_secondary_dialog" class="secondary_module" persistent full-width full-height>
      <!-- <q-card class="q-card dialog_card"> -->
       <div class="dialog_content">
        <!-- 头部 -->
        <header class="header">
          <div class="row items-center justify-between top_tit">
            <p>personal</p>
            <p @click="isShowclick">
             <img :src="compute_local_project_file_path('/image/svg/close.svg')"/>
            </p>
          </div>
          <div class="row secondary_obj">
          <p class="secondary_name active" v-for="item in list_data" :key="item.id">{{item.name}}</p>
          </div>
            <q-card>
      </q-card>
        </header>
        <!-- 内容 -->
        <section>
        
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="mails">
            <!--公告-->
            <AnnounceWapper></AnnounceWapper>  
          </q-tab-panel>

          <q-tab-panel name="alarms">
alarms
          </q-tab-panel>
movies
          <q-tab-panel name="movies">

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
import { ref,reactive } from "vue";
import { AnnounceWapper } from 'src/components/announce'
const layout_secondary_dialog = ref();
const tab = ref('mails')
const list_data = reactive([
    {id:"mails",name:'Announcement'},
    {id:"alarms",name:'Results'},
    {id:"movies",name:'Sports rules'},
])

const isShowclick = () => {
  LayOutMain_pc.set_layout_secondary_dialog()
}

</script>
<style lang="scss" scoped>
.secondary_module .q-dialog__inner .dialog_content{
  min-width: 1200px !important;
  background: #fff;
  .header {
    padding: 10px;
    width: 100%;
    height: 80px;
    background: url($SCSSPROJECTPATH+"/image/png/secondary_bg.png") no-repeat center / cover;
    .top_tit{
        font-size: 18px;
        -color: var(--q-gb-t-c-1);
        color: #fff;
    }
    .secondary_obj{
        color: #C2C2C2;
        .secondary_name{
            margin-right: 30px;
        }
        .active{
            color: #FF7000;
            position: relative;
            ::before{
                content: '444';
                position: absolute;
                display: inline-block;
                width: 54px;
                height: 2px;
                background: #FF7000;
            }
        }
    }
  }
}
::v-deep.q-tab-panel{
  padding: 0 ;
}
</style>