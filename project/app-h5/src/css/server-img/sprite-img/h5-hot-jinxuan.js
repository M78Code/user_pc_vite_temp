
// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 

// x y 
const item = {
    item_1: 0, // 足球
    item_2: -23, // 蓝球
    item_5: -46, // 网球
    item_7: -69, // 斯诺克
    item_10: -115, // 羽毛球
    item_8: -138, // 乒乓球
    item_9: -161, // 排球
    item_4: -184, // 冰球
    item_3: -207, // 棒球
    item_114: -230, // 橄榄球
}
export default function (position) {
    return {
        "background-position-x": `0`,
        "background-position-y": `${item[position]}px`,
    };
}