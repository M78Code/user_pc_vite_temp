<template>
  <div>
    <menu-wapper  :base_data="base_data_instance" :version="base_data_instance.base_data_version"></menu-wapper>
  </div>
</template>
<script setup>
import base_data_instance from 'src/core/utils/base-data/base-data.js'
import { MenuWapper } from "src/components/menu";
</script>