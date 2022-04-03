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
});
