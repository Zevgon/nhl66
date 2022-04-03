const COMMERCIAL_BREAK_SECONDS = 90;

const addKeyboardControls = (video) => {
    const vidCtrl = (e) => {
        const key = e.code;

        if (key === 'ArrowLeft') {
            const timeBack = e.shiftKey ? COMMERCIAL_BREAK_SECONDS : 5;
            video.currentTime -= timeBack;
            if (video.currentTime < 0) {
                video.pause();
                video.currentTime = 0;
            }
        } else if (key === 'ArrowRight') {
            const timeForward = e.shiftKey ? COMMERCIAL_BREAK_SECONDS : 5;
            video.currentTime += timeForward;
            if (video.currentTime > video.duration) {
                video.pause();
                video.currentTime = 0;
            }
        }
    }

    window.onkeydown = vidCtrl;
};

const configureVideo = (video) => {
    video.addEventListener('loadeddata', () => {
        video.currentTime = 0;
        video.muted = false;
        addKeyboardControls(video);
    });
}

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes' &&
                mutation.target.nodeName === 'VIDEO' &&
                mutation.attributeName === 'src') {
            configureVideo(mutation.target);
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
});
