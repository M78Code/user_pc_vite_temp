<template>
  <div class="q-pa-md">
    <q-table
      class="quasar-table-3"
      flat bordered
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
  
  <style lang="scss">
.my-sticky-header-table
{
  /* height or max-height is important */
  /* this is when the loading indicator appears */
  /* prevent scrolling behind sticky top row on focus */
  height:310px;
}
.my-sticky-header-table .q-table__top,.my-sticky-header-table .q-table__bottom,.my-sticky-header-table thead tr:first-child th
{
  /* bg color is important for th; just specify one */
  background-color:#00b4ff;
}
.my-sticky-header-table
{
  thead tr
  {
    th
    {
      position:sticky;
      z-index:1;
    }
    &:first-child th
    {
      top:0;
    }
  }
  &.q-table--loading thead tr &:last-child th
  {
    /* height of all previous header rows */
    top:48px;
  }
  tbody
  {
    /* height of all previous header rows */
    scroll-margin-top:48px;
  }
}

</style>