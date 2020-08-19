<template>
    <v-app>
        <v-app-bar color="primary" dark dense app>
            <v-avatar size="36" color="white" style="margin-right: 5px"><img src="icons/android-chrome-48x48.png"></v-avatar>
            <v-toolbar-title>YouTube Check</v-toolbar-title>
            <v-spacer></v-spacer>
           <v-menu offset-y v-if="signed_in">
                <template v-slot:activator="{on: onMenu}">
                   <v-tooltip bottom>
                       <template v-slot:activator="{on: onToolTip}">
                           <v-avatar v-on="{...onMenu, ...onToolTip}" size="36" style="cursor: pointer">
                               <img :src="avatar_url">
                           </v-avatar>
                       </template>
                       <span>{{name}} &lt;{{email}}&gt;</span>
                   </v-tooltip>
                </template>
                <v-list>
                    <v-list-item @click="signout">
                        <v-list-item-title>Sign Out</v-list-item-title>
                    </v-list-item>
                </v-list>
           </v-menu>
        </v-app-bar>

        <v-main class="centered">
            <v-container fluid :pa-0="$vuetify.breakpoint.xsOnly">
                <v-layout justify-center>

                    <v-card width="100%" max-width="480px" v-if="!signed_in" :loading="loading">
                        <v-card-title primary-title>
                            <div class="headline">Sign In</div>
                        </v-card-title>

                        <v-card-text style="text-align: center">
                            <v-btn type="submit"
                                   color="white"
                                   @click="signin"
                                   :loading="loading"
                                   :disabled="loading">
                                <img src="img/google.svg" width="25px" style="margin-right: 5px">
                                Sign in with Google
                            </v-btn>
                            <div v-if="error" style="color: red">{{error}}</div>
                        </v-card-text>
                    </v-card>

                    <v-card width="100%" max-width="600px" v-if="signed_in" :loading="loading">
                        <v-card-title primary-title>
                            <div class="headline">Check YouTube Video</div>
                        </v-card-title>

                        <form novalidate @submit.prevent="check_url(url)">
                            <v-card-text>
                                <v-text-field
                                    label="Enter YouTube URL..."
                                    v-model="url"
                                    required>
                                </v-text-field>
                                <span v-if="video">
                                    <strong>Title:</strong> <a :href="video_url">{{video.title}}</a><br />
                                    <strong>Category:</strong> {{video.category}}<br />
                                    <strong>Status:</strong>
                                    <span :style="{color: video.blocked ? 'red' : 'green'}">
                                        {{video.blocked ? "Blocked" : "Unblocked"}}
                                    </span>
                                </span>
                                <span v-if="error" style="color: red">{{error}}</span>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn type="submit"
                                       color="primary"
                                       text
                                       :loading="loading"
                                       :disabled="loading || url == null">
                                    Check</v-btn>
                            </v-card-actions>
                        </form>

                    </v-card>
                </v-layout>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import google from "../js/google.js"
export default {
    name: "my-app",
    data() {
        return {
            signed_in: false,
            name: "",
            email: "",
            avatar_url: "",
            url: "",
            video: null,
            error: "",
            loading: false,
        }
    },
    computed: {
        video_url() {
            if (this.video == null) {
                return ""
            }
            return `https://www.youtube.com/watch?v=${this.video.id}`
        },
    },
    methods: {
        async signin() {
            this.error = false
            this.loading = true
            try {
                await google.signin()
            } catch (err) {
                console.error("Signin error:", err)
                this.error = `Unable to sign in: ${err.error}`
            } finally {
                this.loading = false
            }
        },
        signout() {
            this.url = ""
            this.video = null
            this.error = ""
            google.signout()
        },
        setSignedIn(status) {
            this.signed_in = status
        },
        setUser(user) {
            this.name = user.getBasicProfile().getName()
            this.email = user.getBasicProfile().getEmail()
            this.avatar_url = user.getBasicProfile().getImageUrl()
        },
        async check_url(url) {
            if (this.loading) {
                return
            }
            this.video = null
            this.error = ""
            this.loading = true
            try {
                this.video = await google.getVideo(url)
            } catch (err) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
    },
    async created() {
        const {signed_in, user} = await google.init()
        google.attach_handlers(this.setSignedIn, this.setUser)

        this.signed_in = signed_in
        if (user) {
            this.name = user.name
            this.email = user.email
            this.avatar_url = user.image_url
        }
    },
}
</script>

<style lang="sass" scoped>
.centered
    display: flex
    align-items: center
    background-color: #fafafa
</style>
