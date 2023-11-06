  
  
  import { onUnmounted, ref } from 'vue'
  
  /**
   * @description 按 浏览器帧渲染
   */
  export const use_defer_render = (max = 50) => {
    let frame_id = undefined;
    const frame_count = ref(1)
    function update_frame_count () {
      frame_id = requestAnimationFrame(() => {
        frame_count.value++
        if (frame_count.value >= max) return
        update_frame_count()
      })
    }
    update_frame_count()
    onUnmounted(() => {
      cancelAnimationFrame(frame_id)
    })
    return function (n) {
      return frame_count.value >= n
    }
  }