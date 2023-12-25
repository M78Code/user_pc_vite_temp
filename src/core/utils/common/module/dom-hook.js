/**
 * HTMLImageElement扩展 play()和stop()， 用于控制gif播放
 * @param {HTMLImageElement扩展} imgdom img对象
 * @param {*} config  一些配置项 暂时没有用只是用于扩展
 * @returns {paly,stop}
 * */
export const useImageElmentHook = (imgdom, config = {}) => {
  const _dom = imgdom;
  function play() {
    if (_dom.storeCanvas) {
      // 移除存储的canvas
      _dom.storeCanvas.parentElement.removeChild(_dom.storeCanvas);
      _dom.storeCanvas = null;
      // 透明度还原
      // image.style.opacity = '';
      _dom.style.opacity = "";
    }
    if (_dom.storeUrl) {
      _dom.src = _dom.storeUrl;
    }
  }
  function stop() {
    const canvas = document.createElement("canvas");
    // 尺寸
    const width = _dom.width,
      height = _dom.height;
    if (width && height) {
      // 存储之前的地址
      if (!_dom.storeUrl) {
        _dom.storeUrl = _dom.src;
      }
      // canvas大小
      canvas.width = width;
      canvas.height = height;
      // 绘制图片帧（第一帧）
      canvas.getContext("2d").drawImage(0, 0, width, height);
      // 重置当前图片
      try {
        _dom.src = canvas.toDataURL("image/gif");
      } catch (e) {
        // 跨域
        _dom.removeAttribute("src");
        // 载入canvas元素
        canvas.style.position = "absolute";
        // 前面插入图片
        _dom.parentElement.insertBefore(canvas, this);
        // 隐藏原图
        _dom.style.opacity = "0";
        // 存储canvas
        _dom.storeCanvas = canvas;
      }
    }
  }
  return { play, stop };
}

/**
 * @Description 设置css quasar源码复制的
 * @param {undefined} undefined
*/
export const set_css = (element, css) => {
  const style = element.style
  Object.keys(css).forEach(prop => {
    style.setProperty(prop,css[prop])
  })
}
/**
 * @Description 获取滚动条宽度  quasar源码复制的
 * @param {undefined} undefined
*/
export const getScrollbarWidth = () => {
  const
    inner = document.createElement('p'),
    outer = document.createElement('div');
  set_css(inner, {
    width: '100%',
    height: '200px'
  })
  set_css(outer, {
    position: 'absolute',
    top: '0px',
    left: '0px',
    visibility: 'hidden',
    width: '200px',
    height: '150px',
    overflow: 'hidden'
  })
  outer.appendChild(inner)
  document.body.appendChild(outer)
  const w1 = inner.offsetWidth
  outer.style.overflow = 'scroll'
  let w2 = inner.offsetWidth
  if (w1 === w2) {
    w2 = outer.clientWidth
  }
  outer.remove()
  return w1 - w2
}


/**
* @description 修改dom元素类名
* @param domClassName string 要获取元素的类名
* @param newName string 要修改成的类名
* @return undefined
*/
export function modify_dom_classname(domClassName, newName = '') {
  let scrollContainerW = document.getElementsByClassName(domClassName)
  if (scrollContainerW.length > 0) {
    for (let i = 0; i < scrollContainerW.length > 0; i++) {
      scrollContainerW[i].className = newName
    }
  }
}






/**
 * 动态 写入 css  变量 样式表
 * @param {*} content 
 */

 const set_theme_style_sheet=(content ,id_str='root-var')=> {
  const theme_style_content = `:root{${ content}\n}` 
  const root_var_stylesheet = document.getElementById(id_str)
 
  root_var_stylesheet.innerHTML = theme_style_content
   
}


/**
 *   动态 写入 css 对象  到  变量 样式表
 */

export const set_theme_style_sheet_by_css_obj=(obj={},id_str)=>{
  let str= ``
  if(typeof(obj) == 'string'){
    str = obj;
  } else {
    for(let key in obj){
      str+=`\n   ${key } : ${obj[key] ||''};`
    }
  }
  set_theme_style_sheet(str,id_str)
}









/**
 * 动态 写入 css  变量 样式表
 * @param {*} content 
 */

const set_theme_dom_style=(content ,id_str)=> {
 
  const  dom_style = document.getElementById( id_str)
 
      dom_style

      dom_style.style={
        ...dom_style.style,

       ...obj
      }
 
}


/**
 *   动态 写入 css 对象  到  变量 样式表
 */

export const set_theme_dom_style_by_css_obj=(obj={},id_str)=>{

  if(!id_str){
    return ''
  }
  const  dom_style = document.getElementById( id_str)
      dom_style.style={
        ...dom_style.style,
       ...obj
      }
}


