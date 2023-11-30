<template>
    <div class="q-pa-md">
      <q-table
        title="quasar-table-1"
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
  