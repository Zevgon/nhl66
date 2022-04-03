document.addEventListener('DOMContentLoaded', () => {
    const interval = setInterval(() => {
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('loadeddata', () => {
                video.currentTime = 0;
                video.muted = false;
                clearInterval(interval);
            });
        }
    }, 500);
    // const observer = new MutationObserver(function(mutations) {
    //     mutations.forEach(mutation => {
    //         if (mutation.type === 'attributes' && mutation.target.nodeName === 'VIDEO') {
    //             mutation.target.addEventListener('loadeddata', () => {
    //                 mutation.target.currentTime = 0;
    //             });
    //         }
    //     });
    // });
    // observer.observe(document.body, {
    //     childList: true, // observe direct children
    //     subtree: true, // lower descendants too
    //     attributes: true,
    // });
});

// "matches": ["https://nhl66.ir/*"],
