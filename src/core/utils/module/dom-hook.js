/**
 * HTMLImageElement扩展 play()和stop()， 用于控制gif播放
 * @param {HTMLImageElement扩展} imgdom img对象
 * @param {*} config  一些配置项 暂时没有用只是用于扩展
 * @returns {paly,stop}
 * */
function useImageElmentHook(imgdom, config = {}) {
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
      canvas.getContext("2d").drawImage( 0, 0, width, height);
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

export { useImageElmentHook };
