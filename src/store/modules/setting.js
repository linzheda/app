const settings={
    state: {
        headerHeight: '44px',
    },
    mutations:{
        CHANGE_SETTING: (state, { key, value }) => {
            // eslint-disable-next-line no-prototype-builtins
            if (state.hasOwnProperty(key)) {
                state[key] = value;
            }
        }
    },
    actions:{
        changeSetting({ commit }, data) {
            commit('CHANGE_SETTING', data)
        }
    }
};
export default settings;
