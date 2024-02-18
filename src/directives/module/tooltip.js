


 

const installer=(app)=>{
     // 自定义悬浮气泡指令
     app.directive('tooltip',{
    // 指令绑定
    bind(el,bind){
      el.tip_cancel = bind.value.cancel === true ? 1 : 0
      el.tip_tipid = _.uniqueId()
      el.tip_content = bind.value.content
      el.tip_time = bind.value.time || 0
      el.overflow = bind.value.overflow || 0
      el.m_width = bind.value.m_width || 0
      el.onmouseenter = tooltip_enter
      el.onmouseleave = tooltip_leave
    },
    // 指令参数更新
    update(el,bind){
      el.tip_cancel = bind.value.cancel === true ? 1 : 0
      el.tip_content = bind.value.content
      el.tip_time = bind.value.time || 0
      if(bind.value.cancel === true){
        tooltip('cancel',0,0,el.tip_tipid)
      }
    },
    // 组件销毁
    unbind(el){
      tooltip('cancel',0,0,el.tip_tipid)
      el.onmouseenter = null
      el.onmouseleave = null
    },
  }) 
} 

export default  installer