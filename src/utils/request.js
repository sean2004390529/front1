import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Qs from 'qs'

// create an axios instance
const service = axios.create({
  // transformRequest: [function(data){
  //   return Qs.stringify(data)
  // }],
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
      config.headers['Authorization'] = localStorage.getItem('Authorization')
      config.headers.Authorization = store.getters.token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  
  response => {
      const res = response.data
      console.log(response)
      
      if (response.status === 200 || response.status === 201) {
          return Promise.resolve(res);
      } else {
          return Promise.reject(response);
      }
  },
  error => {
      if (error.response.status) {
          switch (error.response.status) {
              case 400:
                  //do something
                //   Message("用户名或密码错误,request.js")
                  break;

              case 401:
                  Message("无权限访问，请登出重新登录")
                  router.replace({
                    path: "/login",
                    query: { redirect: router.currentRoute.fullPath }
                  });
                  break;
              case 403:
                  router.replace({
                      path: "/login",
                      query: { redirect: router.currentRoute.fullPath }
                  });
                  break;
              case 404:
                  alert('page not exist');
                  break;
              case 502:
                  setTimeout(() => {
                      router.replace({
                          path: "/login",
                          query: {
                              redirect: router.currentRoute.fullPath
                          }
                      });
                  }, 1000);
          }
          return Promise.reject(error.response);
      }
  }
)


// service.interceptors.response.use(

//   response => {
//     const res = response.data
//     console.log(res)

//     if (res.code !== 0) {
//       Message({
//         message: res.msg || '请求失败',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.msg,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

export default service
