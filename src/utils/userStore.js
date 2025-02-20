import {defineStore} from 'pinia'
import {AUTH_TOKEN, LOGIN_USER} from "@/config.js";

export const useUserStore = defineStore('user', {
    state: () => ({
        loginUser: JSON.parse(localStorage.getItem(LOGIN_USER)) || null
    }),
    actions: {
        setUser(user) {
            this.loginUser = user
            localStorage.setItem(LOGIN_USER, JSON.stringify(user))
        },
        setToken(token) {
            localStorage.setItem(AUTH_TOKEN, JSON.stringify(token))
        },
        clearUser() {
            this.loginUser = null
            localStorage.removeItem(LOGIN_USER)
            localStorage.removeItem(AUTH_TOKEN)
        }
    }
})
