// import axios from 'axios';



// axios.defaults.baseURL = 'https://api.sportxxxw1box.com';
// axios.defaults.timeout  = 11000;
// axios.defaults.headers['lang']  = 'zh';
// axios.defaults.headers['Content-Type']  = 'application/json';






// // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;


// // Add a request interceptor
// axios.interceptors.request.use(function (config) {




//   config.headers['requestId']  =   sessionStorage.getItem('token');
//   // x
//     // Do something before request is sent
//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });

// // Add a response interceptor
// axios.interceptors.response.use(function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   }, function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   });





  import http from "src/core/http/axios-warpper.js";


  export default http
