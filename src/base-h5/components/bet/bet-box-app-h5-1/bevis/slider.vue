<template>  
  <div class="slider-container">  
    <input type="range" min="0" max="100" v-model="value" @input="updateValue">  
    <div class="slider-handle"></div>  
  </div>  
</template>  
  
<script>  
export default {  
  data() {  
    return {  
      value: 0,  
    };  
  },  
  methods: {  
    updateValue() {  
      console.log("Slider value:", this.value);  
      // 在这里可以添加处理滑块值变化的逻辑  
    },  
  },  
};  
</script>  
  
<style scoped>  
.slider-container {  
  width: 300px;  
  height: 20px;  
  background-color: #ddd;  
  border-radius: 5px;  
  overflow: hidden;  
}  
  
.slider-handle {  
  width: 20px;  
  height: 20px;  
  background-color: #007BFF;  
  border-radius: 50%;  
  position: absolute;  
  top: 0;  
  left: 50%;  
  transform: translateX(-50%);  
  cursor: pointer;  
}  
</style>