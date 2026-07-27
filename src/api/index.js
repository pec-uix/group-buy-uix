import axios from 'axios'
import store from '@/store'

const apiAxios = axios.create({
  baseURL:
    location.hostname === 'localhost'
      ? 'http://localhost:5000/api'
      : import.meta.env.VITE_ROOT_API,
})

const authAxios = axios.create({
  // baseURL: import.meta.env.VITE_AUTH_API,
  baseURL:
    location.hostname === 'localhost'
      ? 'http://localhost:5000/api/Account'
      : import.meta.env.VITE_AUTH_API,
})

class ApiError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ApiError'
  }
}

apiAxios.interceptors.request.use(config => {
  let accessToken = localStorage.getItem('pec_access_token')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      config.headers['Content-Type'] = 'application/json'
    }
  }
  return config
})

let isRefreshing = false
let failedQueue = []

apiAxios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const { config: originalRequest, response } = error
    if (response) {
      if (response.status === 401 && !originalRequest._retry) {
        if (!isRefreshing) {
          isRefreshing = true
          originalRequest._retry = true
          store.dispatch('inOrOutLog', { event_name: 'refresh_start' })
          store
            .dispatch('refreshAccessToken')
            .then(newToken => {
              store.commit('setToken', newToken)
              store.dispatch('inOrOutLog', { event_name: 'refresh_success' })
              failedQueue.forEach(x => x.resolve())
              failedQueue = []
            })
            .catch(() => {
              store.dispatch('inOrOutLog', { event_name: 'refresh_fail' })
              store.dispatch('logout')
              failedQueue.forEach(x =>
                x.reject(new ApiError('Invalid Refresh Token'))
              )
              failedQueue = []
            })
            .finally(() => {
              isRefreshing = false
            })
        }

        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              resolve(apiAxios(originalRequest))
            },
            reject,
          })
        })
      } else if (response.status === 403) {
        return Promise.reject(new ApiError('權限不足'))
      } else if (response.status === 404) {
        return Promise.reject(new ApiError('錯誤路徑'))
      } else if (response.status === 422) {
        return Promise.reject(new ApiError(error.response.data.message))
      } else if (response.status >= 500 && response.status < 600) {
        return Promise.reject(new ApiError('發生不可預期錯誤'))
      } else {
        return Promise.reject(error.response.data)
      }
    } else {
      if (!window.navigator.onLine) {
        return Promise.reject(new ApiError('無網路連線'))
      } else {
        return Promise.reject(new ApiError('資料存取錯誤'))
      }
    }
  }
)

function callApi(processName, pData) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    // APEX 4.2.5
    // wwv_flow.show
    // APEX 5.1.4
    // wwv_flow.ajax
    xhr.open('POST', 'wwv_flow.ajax')
    xhr.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    )
    xhr.setRequestHeader(
      'Accept',
      'application/json, text/javascript, */*; q=0.01'
    )
    //todo 自動 apex 抓版本
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        try {
          let res = JSON.parse(xhr.response)
          // APEX4.2.5
          // Invalid username or password or expired cookie, please login again.
          // APEX 5.1.4
          // Your session has expired
          if (res.error === 'Your session has expired') {
            let url = `${window.location.origin + window.location.pathname}?p=${
              document.querySelector('#pFlowId').value
            }:LOGIN_DESKTOP`
            window.location.replace(url)
          } else {
            resolve(res)
          }
        } catch (error) {
          reject({
            error: 'sql error',
            message: xhr.response,
          })
        }
      } else {
        reject({
          error: this.status,
          message: xhr.statusText,
        })
      }
    }

    xhr.onerror = function () {
      reject({
        error: 'network error',
        message: '網路連線錯誤',
        color: 'error',
      })
    }

    xhr.ontimeout = function () {
      reject({
        error: 'time out',
        message: '連線逾時',
        color: 'error',
      })
    }

    let body = {
      p_flow_id: document.querySelector('#pFlowId').value,
      p_flow_step_id: document.querySelector('#pFlowStepId').value,
      p_instance: document.querySelector('#pInstance').value,
      p_request: 'APPLICATION_PROCESS=' + processName,
      ...pData,
    }

    let formData = []

    for (var key in body) {
      if (Array.isArray(body[key])) {
        body[key].forEach(el => {
          let value = el === null || el === undefined ? '' : el
          formData.push(
            encodeURIComponent(key) + '=' + encodeURIComponent(value)
          )
        })
      } else {
        let value =
          body[key] === null || body[key] === undefined ? '' : body[key]
        formData.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
      }
    }

    xhr.send(formData.join('&'))
  })
}

export { authAxios, apiAxios, callApi, ApiError }
