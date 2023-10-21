
// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称

export default function (position){
    return { "background-position-y": `calc(var(--per)*${position})`}
 }