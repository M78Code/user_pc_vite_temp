// <!--
//  * @Author: snape
//  * @Date:
//  * @Description: 无限滑动容器组件
// -->

const throttle= _. throttle;

const getScrollContainer=el=>{
   return document.getElementById(el)
}


// 判断是否是html节点
const  isHTMLElement=obj=>{
    
    if(obj.nodeType){
        
        return obj.nodeType==1;
    }
    return  false;
}

const isUndefined=obj=>{
       return obj ===undefined;
}

const isDefined=obj=>{
    return obj!==undefined;
}

const getStyleComputedProperty = (element, property) => {
    if (element === window) {
        element = document.documentElement;
    }
    
    if (element.nodeType !== 1) {
        return [];
    }
    // 获取当前样式
    const css = window.getComputedStyle(element, null);
    return property ? css[property] : css;
};

const entries = (obj) => {
    return Object.keys(obj || {})
        .map(key => ([key, obj[key]]));
};

const getPositionSize = (el, prop) => {
    return el === window || el === document
        ? document.documentElement[prop]
        : el[prop];
};

const getOffsetHeight = el => {
    return getPositionSize(el, 'offsetHeight');
};

const getClientHeight = el => {
    return getPositionSize(el, 'clientHeight');
};

const scope = 'ElInfiniteScroll';
const attributes = {
    delay: {
        type: Number,
        default: 200
    },
    distance: {
        type: Number,
        default: 0
    },
    disabled: {
        type: Boolean,
        default: false
    },
    immediate: {
        type: Boolean,
        default: true
    }
};

const getScrollOptions = (el, vm) => {
    if (!isHtmlElement(el)) return {};
    
    return entries(attributes).reduce((map, [key, option]) => {
        const { type, default: defaultValue } = option;
        let value = el.getAttribute(`infinite-scroll-${key}`);
        value = isUndefined(vm[value]) ? value : vm[value];
        switch (type) {
            case Number:
                value = Number(value);
                value = Number.isNaN(value) ? defaultValue : value;
                break;
            case Boolean:
                value = isDefined(value) ? value === 'false' ? false : Boolean(value) : defaultValue;
                break;
            default:
                value = type(value);
        }
        map[key] = value;
        return map;
    }, {});
};

const getElementTop = el => el.getBoundingClientRect().top;

const handleScroll = function(cb) {
    const { el, vm, container, observer } = this[scope];
    const { distance, disabled } = getScrollOptions(el, vm);
    
    if (disabled) return;
    
    const containerInfo = container.getBoundingClientRect();
    if (!containerInfo.width && !containerInfo.height) return;
    
    let shouldTrigger = false;
    
    if (container === el) {
        // 获取滚动高度
        const scrollBottom = container.scrollTop + getClientHeight(container);
        shouldTrigger = container.scrollHeight - scrollBottom <= distance;
    } else {
        const heightBelowTop = getOffsetHeight(el) + getElementTop(el) - getElementTop(container);
        const offsetHeight = getOffsetHeight(container);
        const borderBottom = Number.parseFloat(getStyleComputedProperty(container, 'borderBottomWidth'));
        shouldTrigger = heightBelowTop - offsetHeight + borderBottom <= distance;
    }
    
    if (shouldTrigger && cb) {
        cb.call(vm);
    } else if (observer) {
        observer.disconnect();
        this[scope].observer = null;
    }
    
};

export default {
    name: 'InfiniteScroll',
    // 插入
    inserted(el, binding, vnode) {
        const cb = binding.value;
        
        const vm = vnode.context;
        // 只包含虚拟滚动
        const container = getScrollContainer(el, true);
        const { delay, immediate } = getScrollOptions(el, vm);
        const onScroll = throttle(delay, handleScroll.bind(el, cb));
        
        el[scope] = { el, vm, container, onScroll };
        
       // 容器 添加 observer
        if (container) {
            container.addEventListener('scroll', onScroll);
             
             //  监听dom 变动
            if (immediate) {
                const observer = el[scope].observer = new MutationObserver(onScroll);
                observer.observe(container, { childList: true, subtree: true });
                onScroll();
            }
        }
    },
    // 移除绑定事件
    unbind(el) {
        const { container, onScroll } = el[scope];
        if (container) {
            container.removeEventListener('scroll', onScroll);
        }
    }
};

