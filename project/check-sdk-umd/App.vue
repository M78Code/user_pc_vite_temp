<template>
  <div>

     <h1>SDK 本地 调试   check-sdk-umd  ```</h1>
     <H5Tabs4 :list="list" />
  </div>
</template>

<script>


export default {
  data() {
    return {
      // key: value
      list: [
        'aaa',
        'bbb',
        'ccc'
      ]
    }
  },
  created () {
    console.log('TY_JSSDK------222----',window);  ;
  },
}



</script>

<style lang="scss" scoped>

</style>