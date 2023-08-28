let arr = [
  {
    csid: "1001",
    menuName: "VR足球",
    sl:[
      {
        tid: "23622704727740417",
        menuName: "英格兰联赛",
      },
      {
        tid: "322922534798774275",
        menuName: "西班牙联赛",
      },
      {
        tid: "322922534798774276",
        menuName: "意大利联赛",
      },
      {
        tid: "23622704715157506",
        menuName: "冠军联赛",
      },
      {
        tid: "86945115832995842",
        menuName: "解放者杯",
      },
      {
        tid: "293506198389936131",
        menuName: "世界杯2022",
      },
    ]
  },
  {
    csid: "1004",
    menuName: "VR篮球",
    sl:[
       {
        tid: "79430600606371842",
        menuName: "3x3联赛",
      },
    ]
  },
  {
    csid: "1011",
    menuName: "VR赛马",
    sl:[
       {
        tid: "23622704245395458",
        menuName: "杰斐逊公园",
      },
    ]
  },
  {
    csid: "1002",
    menuName: "VR赛狗",
    sl:[ {
      tid: "34277798653612034",
      menuName: "跑马地公园",
    },]
  },
  {
    csid: "1010",
    menuName: "VR摩托车",
    sl:[   {
      tid: "137797697685966849",
      menuName: "M6 南部赛道",
    },]
  },
  {
    csid: "1009",
    menuName: "VR泥地摩托车",
    sl:[
      {
        tid: "160172018395664386",
        menuName: "布里斯托尔赛道",
      },]
  },
];


let obj={

}

arr.map(x=>{
obj[`mi_3${x.csid}`] =x

})




console.log( JSON.stringify(obj)  );
