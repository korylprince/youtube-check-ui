import "@mdi/font/css/materialdesignicons.css"
import Vue from "vue"
import Vuetify from "vuetify/lib"

Vue.use(Vuetify)

import colors from "vuetify/lib/util/colors"

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: colors.red.base,
                accent: colors.blue.base,
                secondary: colors.blue.accent4,
            },
        },
    },
})
