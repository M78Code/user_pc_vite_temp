/*
 * @Author: Cable
 * @Date: 2020-08-04 17:13:55
 * @Description: 悬浮气泡指令
 */

let id = 0
let show_id = 0

// 悬浮气泡指令
export const tooltip = function(html,style,time,tipid,width,height,overflow,m_width){
  let tooltip_el = document.getElementById('v-tooltip')
  if(html == 'cancel'){
    if(tipid == show_id || tipid == 0){
      id++
      if(tooltip_el) {
        tooltip_el.innerHTML = ''
        tooltip_el.setAttribute('style','')
      }      
    }
    return
  }
  id++
  let _id = id 
  show_id = tipid
  setTimeout(function(){
    if(id != _id ){
      return
    } 
   
    if(tooltip_el) {
      tooltip_el.innerHTML = html
      tooltip_el.setAttribute('style',style)
      if(overflow == 1 && width + 10 - m_width < tooltip_el.getBoundingClientRect().width){
        tooltip_el.setAttribute('style',style.substr(0,style.indexOf('visibility')))
      }
      if(overflow == 2 && height < tooltip_el.clientHeight){
        tooltip_el.setAttribute('style',style.substr(0,style.indexOf('visibility')))
      }
    }
    tooltip_el = null
  },time)
}

 
  