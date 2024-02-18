<template>
    <div class="q-pa-md">
      <div class="text-h4">测试组件-版本2  tableClass_computed------- {{ tableClass_computed }}</div>
      <div class="text-h4">测试组件-版本2  title_computed------- {{ title_computed }}</div>
      <div class="text-h4">测试组件-版本2  title2_computed------- {{ title2_computed }}</div>
     
      <div class="q-my-md"> <q-btn  color="primary"  label="测试事件透传 测试组件-版本2"  @click="handle_test_emit" /> </div>
      <q-table
        title="测试组件-版本2"
        :table-class="tableClass_computed"
        :rows="rows"
        :columns="columns"
        row-key="name"
      />
    </div>
  </template>
  
  <script setup>
//-------------------- 对接参数 prop 注册  开始  -------------------- 
import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"

let useProps ={} 
let useComputed={}
import {component_symbol ,need_register_props} from "../config/index.js"
 useRegistPropsHelper( {
  useProps,
  useComputed,
  component_symbol ,need_register_props
 })



 


const props = defineProps({ ...useProps })
const tableClass_computed = useComputed.tableClass_computed(props)

const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 

const emit = defineEmits(['test-emit' ])
const   handle_test_emit=()=>{
  console.log('emit 事件发出 ');
  emit('test-emit',{
    aa:'xxxxxxxxxxxxxxxxxxxxxxxxx-------测试组件-版本   2---------x'
  })
}

  const columns = [
    {
      name: 'name',
      required: true,
      label: 'Dessert (100g serving)',
      align: 'left',
      field: row => row.name,
      format: val => `${val}`,
      sortable: true
    },
    { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
    { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
    { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
    { name: 'protein', label: 'Protein (g)', field: 'protein' },
    { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
    { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
    { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
  ]
  
  const rows = [
    {
      name: 'Frozen Yogurt',
      calories: 159,
      fat: 6.0,
      carbs: 24,
      protein: 4.0,
      sodium: 87,
      calcium: '14%',
      iron: '1%'
    },
    {
      name: 'Ice cream sandwich',
      calories: 237,
      fat: 9.0,
      carbs: 37,
      protein: 4.3,
      sodium: 129,
      calcium: '8%',
      iron: '1%'
    },
    {
      name: 'Eclair',
      calories: 262,
      fat: 16.0,
      carbs: 23,
      protein: 6.0,
      sodium: 337,
      calcium: '6%',
      iron: '7%'
    },
    {
      name: 'Cupcake',
      calories: 305,
      fat: 3.7,
      carbs: 67,
      protein: 4.3,
      sodium: 413,
      calcium: '3%',
      iron: '8%'
    },
    {
      name: 'Gingerbread',
      calories: 356,
      fat: 16.0,
      carbs: 49,
      protein: 3.9,
      sodium: 327,
      calcium: '7%',
      iron: '16%'
    },
    {
      name: 'Jelly bean',
      calories: 375,
      fat: 0.0,
      carbs: 94,
      protein: 0.0,
      sodium: 50,
      calcium: '0%',
      iron: '0%'
    },
    {
      name: 'Lollipop',
      calories: 392,
      fat: 0.2,
      carbs: 98,
      protein: 0,
      sodium: 38,
      calcium: '0%',
      iron: '2%'
    },
    {
      name: 'Honeycomb',
      calories: 408,
      fat: 3.2,
      carbs: 87,
      protein: 6.5,
      sodium: 562,
      calcium: '0%',
      iron: '45%'
    },
    {
      name: 'Donut',
      calories: 452,
      fat: 25.0,
      carbs: 51,
      protein: 4.9,
      sodium: 326,
      calcium: '2%',
      iron: '22%'
    },
    {
      name: 'KitKat',
      calories: 518,
      fat: 26.0,
      carbs: 65,
      protein: 7,
      sodium: 54,
      calcium: '12%',
      iron: '6%'
    }
  ]
  
 
  </script>
  