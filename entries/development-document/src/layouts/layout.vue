<template>
    <div class=" ">
      <q-layout view="hHh Lpr lff" container style="height: 100vh" class="shadow-2 rounded-borders ">
        <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
          <q-toolbar>
            <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
            <q-toolbar-title>项目内部开发文档</q-toolbar-title>
            <q-btn flat @click="drawerRight = !drawerRight" round dense icon="menu" />
          </q-toolbar>
        </q-header>
  
        <q-drawer
          v-model="drawerLeft"
          show-if-above
          :width="400"
          :breakpoint="700"
          elevated
          class="bg-primary text-white"
        >
          <q-scroll-area class="fit">


            <!-- <div class="q-pa-sm">
              <div v-for="n in file_path_keys" :key="n">  {{ n }}  </div>
            </div> -->

            <q-list bordered separator>
      

      <q-item clickable v-ripple  v-for="n in file_path_keys" :key="n" @click="current_menu=n">
        <q-item-section>
          <q-item-label> {{ n }}</q-item-label>
          <!-- <q-item-label caption>Caption</q-item-label> -->
        </q-item-section>
      </q-item>

    
    </q-list>


          </q-scroll-area>
        </q-drawer>
  
     
  
        <q-page-container>
          <q-page padding>

        <!-- {{     file_path_base_obj[current_menu] }} -->
           

        <json-viewer
        style="max-height: calc(100vh - 100px);overflow: scroll;"  
  :value=" file_path_base_obj[current_menu] "
  :expand-depth=5
  expanded
  copyable
 
  sort></json-viewer>

          </q-page>
        </q-page-container>
      </q-layout>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'

  import  file_path_keys from "app/job/output/doc/key.json" ;
  import  file_path_base_obj from "app/job/output/doc/obj.json" ;
  import JsonViewer from 'vue-json-viewer'

  console.log( "file_path_keys-----",file_path_keys);
  
      const  drawerLeft= ref(false) 
      const  current_menu = ref(file_path_keys[0])
  
 
  </script>
  