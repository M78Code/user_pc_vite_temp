<template>
  <div>

     <h4>客户端模块化+SDK版本---------self-use-version</h4>
     <h5>   self-use-version	自用版本项目	项目	常规开发 ，生产自用项目打包 入口	默认组件，支持配置合并，
不支持同功能性组件其他版本切换</h5>
     <div>
      <TestComponent/>
     </div>
 
  

    
  </div>
</template>

<script setup>
import { TestComponent} from "src/components/test-component/index.js"

</script>

<style lang="scss" scoped>


</style>