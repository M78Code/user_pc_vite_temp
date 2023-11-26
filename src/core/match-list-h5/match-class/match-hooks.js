  
  
  import { onUnmounted, ref } from 'vue'
  import MatchFold from 'src/core/match-fold'

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

  /**
   * @description 可视区 监听, 动态控制显示的dom
   */
  export const use_match_observer = () => {
    const ob = new IntersectionObserver(
      (entries) =>{
        for(const entry of entries) {
          const match_Node = entry.target
          const mid = match_Node.getAttribute('data-mid')
          if (entry.isIntersecting) {
          } else {
          }
        }
      },
      {
        threshold: 0
      }
    )
    const match_list = document.querySelectorAll('.scroll-i-con > .s-w-item')
    match_list.forEach(match => {
      ob.observe(match)
    })
  }