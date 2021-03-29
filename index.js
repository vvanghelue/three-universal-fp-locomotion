import * as THREE from "three"

// detect context before loading
let context 
if (window) {
    context = 'desktop'
    if (window.document) {
        window.document.addEventListener('touchstart', () => {
            context = "mobile"
        })
    }
    const agent = window.navigator.userAgent
    if (agent.includes("Quest")) {
        context = "vr"
    }
}

export default function () {
    if (!context) {
        throw new Error('Cannot detect context, you must handle a user-based click before starting')
    }
    return {
        on() {},
        getContext: () => context
    }
}