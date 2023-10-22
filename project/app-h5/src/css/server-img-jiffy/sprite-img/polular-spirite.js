
// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 

function get_positon(csid) {
    {
        let csid_poz_y = 1;
        switch (csid) {
            case 1:
                csid_poz_y = 0;// 足球
                break;
            case 2:
                csid_poz_y = 1;// 篮球
                break;
            case 5:
                csid_poz_y = 2;// 网球
                break;
            case 7:
                csid_poz_y = 7;// 斯诺克
                break;
            case 10:
                csid_poz_y = 3;// 羽毛球
                break;
            case 8:
                csid_poz_y = 4;// 乒乓球
                break;
            case 9:
                csid_poz_y = 5;// 排球
                break;
            case 4:
                csid_poz_y = 6;// 冰球
                break;
            case 3:
                csid_poz_y = 8;// 棒球
                break;
            case 6:
                csid_poz_y = 9;// 美式足球
                break;
        }
        return csid_poz_y
    }
}
export default function (position) {
    return {
        "background-position-y": `calc(var(--per)*${get_positon(position)})`,
    }
}