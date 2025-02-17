import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        loginUser: JSON.parse(localStorage.getItem('loginUser')) || null
    }),
    actions: {
        setUser(user) {
            this.loginUser = user
            localStorage.setItem('loginUser', JSON.stringify(user))
        },
        clearUser() {
            this.loginUser = null
            localStorage.removeItem('loginUser')
            localStorage.removeItem('authToken')
        }
    }
})