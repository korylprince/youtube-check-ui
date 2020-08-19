import Vue from "vue"
import vuetify from "./plugins/vuetify.js"

import MyApp from "./components/app.vue"

const App = new (Vue.extend(MyApp))({
    el: "#root",
    vuetify,
})

export default App
