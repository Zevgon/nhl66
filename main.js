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

const informalTzToFormalTz = new Map([
    ['ET', 'America/New_York'],
    ['CT', 'America/Chicago'],
    ['MT', 'America/Denver'],
    ['PT', 'America/Los_Angeles'],
]);

// Extracts the 'ET' from '04/03 16:00 (ET)', e.g.
const parseTimezone = (startTimeText) => {
    return startTimeText.match(/\((\w+)\)/)[1];
};

// Converts the timezone from e.g. ET to EDT/EST
const convertTimezone = (timezone) => {
    const formalTz = informalTzToFormalTz.get(timezone);
    if (!formalTz) return null;
    return new Date().toLocaleString("en", {timeZone: formalTz, timeStyle: "long"}).split(' ').slice(-1)[0];
};

// Takes a string like '04/03 16:00 (ET)' and turns it into '04/03 16:00 2022 EDT'
const formatStartTimeText = (startTimeText) => {
    const timezone = parseTimezone(startTimeText);
    const convertedTimezone = convertTimezone(timezone);
    const currentYear = new Date().getFullYear()
    return startTimeText.replace(/\(\w+\)/, `${currentYear} ${convertedTimezone}`);
};

const getVideo = () => {
    return document.querySelector('video');
};

const getVideoStart = (video) => {
    try {
        const gameStartElContents = document.querySelectorAll('.live .vertical .datetime')[0].innerText;
        const startTimeText = gameStartElContents.split('\n')[0];
        const formattedStartTimeText = formatStartTimeText(startTimeText);
        const startTimeSeconds = Math.floor(new Date(formattedStartTimeText).getTime() / 1000);
        const currentTimeSeconds = Math.floor(new Date().getTime() / 1000);
        const videoDurationSeconds = video.duration;
        const diff = videoDurationSeconds - (currentTimeSeconds - startTimeSeconds);
        // Setting the time to exactly live causes the video to load for a longer time,
        // so subract 10 seconds.
        const ret = Math.max(Math.min(diff, videoDurationSeconds - 10), 0);
        return ret;
    } catch (e) {
        console.error('couldn\'t figure out where to start the game from. starting at 0');
        return 0;
    }
}

const configureVideo = (video) => {
    video.addEventListener('loadeddata', () => {
        const loadedVideo = getVideo();
        loadedVideo.currentTime = getVideoStart(loadedVideo);
    });
    video.addEventListener('loadedmetadata', function() {
        video.currentTime = 0;
        video.muted = false;
        addKeyboardControls(video);
    }, false);
};

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
