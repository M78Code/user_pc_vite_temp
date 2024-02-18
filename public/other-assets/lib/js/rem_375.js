// 动态设置rem
(function(win,doc){
	const docEl = doc.documentElement,
	calc = function(){
		let clientWidth = docEl.clientWidth
		// 设计图宽度以375px 计算 
		if(clientWidth >= 375){
			docEl.style.fontSize = '100px'
		}else{
			docEl.style.fontSize = 100 * clientWidth / 375 + 'px' 
		}
	}
	window.addEventListener('DOMContentLoaded', calc, false)
	window.addEventListener('resize', calc, false);
})(window,document)