<template>
  <div class="q-pa-md">
    <q-table
      color="primary"
      card-class="bg-amber-5 text-brown"
      table-class="text-grey-8"
      table-header-class="text-brown"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
  </template>
  
  <script>

import    QuasarTableMixin from "../mixin/index.js"
  export default {
   mixins:[QuasarTableMixin]
  }
  </script>
  