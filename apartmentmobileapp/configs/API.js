import axios from "axios";

const HOST = "http:192.168.1.8:8000"

export const endpoints = {
    'register-relative':'/relatives/',// đăng kí người thân
    'family':'/relatives/family/',// lấy danh sách người thân
    'login':'/o/token/',
    'register':'/users/',
    'users':'/users/',
    'current-user':'/users/current-user/',
    'my-locker':'/lockers/my-locker/',
    'get-services':(serviceId) =>`/services/${serviceId}/`,
    'my-invoice':'/invoices/my-invoice/',
    'set-received': (itemId) => `/items/${itemId}/set-received/`,
    'change-password': (itemId) => `/users/${itemId}/change-password/`,
    'get-users': '/users/',
    'get-user': (userId) => `/users/${userId}/`,
    'upload-avatar': (userId) => `/users/${userId}/upload-avatar/`,
    'complaint':'/complaints/',
    'rooms':'/rooms/',
    'lock-users': (itemId) => `/users/${itemId}/lock-users/`,
    'surveys': '/survey_forms/',
    'response_forms': '/response_forms/',
    'questions':'/questions/'
}

export const authAPI = (access_token) => {
    return axios.create({
        baseURL: HOST,
        headers: {
            'Authorization' : `Bearer ${access_token}`
        }
    })
}

export default axios.create(
    {
        baseURL: HOST
    }
)
