<template>
  <div>

     <h4>客户端模块化+SDK版本---------full-version </h4>
     <h5>    full-version   full-version  full-version</h5>
     <div>
      <TestComponentFullVersionWapper @test-emit="handle_test_emit"   />
     </div>
 
  

    
  </div>
</template>

<script setup>
import {TestComponentFullVersionWapper} from "src/components/test-component/index.js"


const handle_test_emit=(params)=>{
      console.log("emit 事件收到 ");
      console.log("组件包装器  实际使用者 收到 emit 事件  ，携带  数据 ： ", params);
    }
</script>

<style lang="scss" scoped>


</style>