// 动态设置rem
(function(win,doc){
	const docEl = doc.documentElement,
	calc = function(){
		let clientWidth = docEl.clientWidth
		// 设计图宽度以390px 计算 
		docEl.style.fontSize = 100 * clientWidth / 390 + 'px' 
	}
	window.addEventListener('DOMContentLoaded', calc, false)
	window.addEventListener('resize', calc, false);
})(window,document)