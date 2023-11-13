<!--
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 404页面
-->
<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~public/image/wwwassets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">Sorry, nothing here...<strong>(404)</strong></p>
    <q-btn
      color="secondary"
      style="width:200px;"
      to="/"
      label="Go back"
    />
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>
