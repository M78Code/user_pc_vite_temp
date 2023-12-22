  
  
  import { onUnmounted, ref } from 'vue'

  /**
   * @description 按 浏览器帧渲染
   */
  export const use_defer_render = (max = 2000) => {
    let frame_id = undefined;
    const frame_count = ref(1)
    function update_frame_count () {
      const start = Date.now()
      frame_id = requestAnimationFrame(() => {
        // 当前渲染帧 有剩余 则 渲染
        if (Date.now() - start < 16.6) {
          frame_count.value++
          if (frame_count.value >= max) return
        } 
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