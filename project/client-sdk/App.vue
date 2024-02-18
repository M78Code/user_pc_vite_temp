<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lff" container style="height: 100vh" class="shadow-2 rounded-borders">
      <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
        <q-toolbar>
          <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
          <q-btn flat @click="drawerRight = !drawerRight" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawerLeft"
        show-if-above
        :width="200"
        :breakpoint="700"
        elevated
        class="bg-primary text-white"
      >
        <q-scroll-area class="fit">
          <div class="q-pa-sm">
            <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
          </div>
        </q-scroll-area>
      </q-drawer>

      <q-drawer
        side="right"
        v-model="drawerRight"
        show-if-above
        bordered
        :width="200"
        :breakpoint="500"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      >
        <q-scroll-area class="fit">
          <div class="q-pa-sm">
            <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
          </div>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <!-- <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
          </p> -->
          <div v-for="item  in all_components_names" :key="item">
            1
            <!-- <H5Tabs1/> -->
            <component :is="item" />
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { ref } from 'vue'
const  ALL_COMPONENTS_GLOB = import.meta.glob("./components.js",{ eager: true });
const  ALL_COMPONENTS  =Object.values(ALL_COMPONENTS_GLOB)[0]['default'] 
console.log('ALL_COMPONENTS----------',ALL_COMPONENTS);


 
export default {
  components:ALL_COMPONENTS,
  setup () {
    return {
      drawerLeft: ref(false),
      drawerRight: ref(false)
    }
  },
  data() {
    return {
      all_components_names:[]
    }
  },
  created () {
      
 
    this.all_components_names= Object.keys(ALL_COMPONENTS)
    console.log( 'Object.keys(ALL_COMPONENTS)',  this.all_components_names );

    ;
  },
}
</script>
