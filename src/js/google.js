/* global gapi */
/* global CLIENT_ID */
/* global BLOCKED_CATEGORIES */

const google = {
    async gapi_init() {
        const load = new Promise((resolve, reject) => {
            gapi.load("client:auth2", {
                callback: resolve,
                onerror: reject,
            })
        })

        try {
            await load
        } catch (err) {
            console.error("Error loading gapi:", err)
            throw Error("Unable to load gapi libraries")
        }

        try {
            await gapi.client.init({
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
                clientId: CLIENT_ID,
                scope: "https://www.googleapis.com/auth/youtube.readonly",
            })
        } catch (err) {
            console.error("Error initializing gapi:", err)
            throw Error("Unable to initialize gapi libraries")
        }
    },
    async init() {
        await this.gapi_init()

        const auth = gapi.auth2.getAuthInstance()
        await auth
        const signed_in = auth.isSignedIn.get()
        if (!signed_in) {
            return {signed_in, user: {name: null, email: null, image_url: null}}
        }

        const user = auth.currentUser.get()
        const name = user.getBasicProfile().getName()
        const email = user.getBasicProfile().getEmail()
        const image_url = user.getBasicProfile().getImageUrl()

        return {signed_in, user: {name, email, image_url}}
    },
    attach_handlers(update_signin_status, update_user) {
        const auth = gapi.auth2.getAuthInstance()
        auth.isSignedIn.listen(update_signin_status)
        auth.currentUser.listen(update_user)
    },
    signin() {
        return gapi.auth2.getAuthInstance().signIn()
    },
    signout() {
        return gapi.auth2.getAuthInstance().signOut()
    },
    getVideoID(url) {
        const u = new URL(url)
        if (u.host === "youtu.be") {
            return u.pathname.slice(1)
        }
        if (u.pathname.startsWith("/v/")) {
            return u.pathname.slice(3)
        }
        const p = new URLSearchParams(u.search)
        return p.get("v")
    },
    async getVideo(url) {
        let id
        try {
            id = this.getVideoID(url)
        } catch (err) {
            console.error("Unable to parse URL:", err)
            throw Error("URL not recognized. Make sure it's a YouTube URL.")
        }

        let video
        let categoryID
        try {
            video = await gapi.client.youtube.videos.list({
                id,
                part: "snippet,contentDetails",
            })
            categoryID = video.result.items[0].snippet.categoryId
        } catch (err) {
            if (err.status && err.status === 401) {
                this.signout()
                return
            }
            console.error("Unable to get video:", err)
            throw Error("Unable to get video information. Please check the URL.")
        }

        try {
            const category = await gapi.client.youtube.videoCategories.list({
                id: categoryID,
                part: "snippet",
            })
            const categoryName = category.result.items[0].snippet.title
            return {title: video.result.items[0].snippet.title, category: categoryName, blocked: BLOCKED_CATEGORIES.includes(categoryName)}
        } catch (err) {
            console.error("Unable to get category:", err)
            throw Error("Unable to get category information. Please try again later.")
        }
    },
}

export default google
