import {post} from '@/plugins/http';

const user = {
    state: {
        id: '',
        token: '',
        name: '',
        roles: []
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },

        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },
    actions: {
        Login({commit}, userinfo) {
            return new Promise((resolve, reject) => {
                post('/user/userCtr/login', userinfo).then(data => {
                    commit('SET_TOKEN', data.data.token);
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },

    }
}

export default user
