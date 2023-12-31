const video = document.querySelector('#video');
const videoContainer = document.querySelector('#videoContainer');
const controls = document.querySelector('.controls');
const playBtn = document.querySelector('#playBtn');
const pauseBtn = document.querySelector('#pauseBtn');
const voiceOn = document.querySelector('#voiceOnBtn');
const voiceOff = document.querySelector('#voiceOffBtn');
const voiceDown = document.querySelector('#voiceDownBtn');
const range = document.querySelector('#range');
const settingBtn = document.querySelector('#setting');
const fullScreenBtn = document.querySelector('#fullScreen');
const lessFullScreenBtn = document.querySelector('#lessFullScreen');
const timer = document.querySelector('#timer');
const videoLength = document.querySelector("#videoLength");
const settingContainer = document.querySelector('.settings--container');
const summary = document.querySelector('#summary');
const containerSpeed = document.querySelector('.settings--container__speed');
const settingsTriagle = document.querySelector('#triangle');
const videoSlow = document.querySelector('#slow');
const videoNormal = document.querySelector('#normal');
const videoFast = document.querySelector('#fast');
const videoFaster = document.querySelector('#faster');
const timelineContainer = document.querySelector('.controls__timeline--container');


timelineContainer.addEventListener("mousemove", handleTime);
timelineContainer.addEventListener("mousedown", toggleScrubbing);

let isScrubbing = false;
let wasPaused;

document.addEventListener("mouseup", e => {
    if (isScrubbing) toggleScrubbing(e)
})
document.addEventListener("mousemove", e => {
    if (isScrubbing) handleTime(e)
})

function toggleScrubbing(e) {
    let rect = timelineContainer.getBoundingClientRect();
    let percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing = (e.buttons & 1) === 1;
    videoContainer.classList.toggle('scrubbing', isScrubbing);
    if (isScrubbing) {
        wasPaused = video.paused;
        video.pause();
    } else {
        video.currentTime = percent * video.duration;
        if (!wasPaused) {
            video.play();
        }
    }
};

function handleTime(e) {
    let rect = timelineContainer.getBoundingClientRect();
    let percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    timelineContainer.style.setProperty('--preview-position', percent);
    if (isScrubbing) {
        e.preventDefault();
        timelineContainer.style.setProperty('--progress-position', percent);
    }
};

/* pause and start functions */
function playVideo() {
    video.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "block";
}

function pauseVideo() {
    video.pause();
    pauseBtn.style.display = "none";
    playBtn.style.display = "block";
}

playBtn.addEventListener('click', playVideo);
pauseBtn.addEventListener('click', pauseVideo);

/* voice controls function */

range.addEventListener('input', function (e) {
    video.volume = e.currentTarget.value;
    video.muted = e.currentTarget.value === 0;
});

video.addEventListener('volumechange', function () {
    range.value = video.volume;
    if (video.muted || video.volume === 0) {
        range.value = 0;
        voiceDown.style.display = "none";
        voiceOff.style.display = "block";
        voiceOn.style.display = "none";
    } else if (video.volume >= 0.5) {
        voiceDown.style.display = "none";
        voiceOn.style.display = "block";
        voiceOff.style.display = "none";
    } else {
        voiceDown.style.display = "block";
        voiceOn.style.display = "none";
        voiceOff.style.display = "none";
    }
});

function voiceOnFunc() {
    video.muted = true;
    voiceOn.style.display = "none";
    voiceOff.style.display = "block";
}

function voiceOffFunc() {
    video.muted = false;
    video.volume = 1;
    voiceOff.style.display = "none";
    voiceOn.style.display = "block";
}

function voiceDownFunc() {
    range.value = 0;
    video.volume = 0;
    voiceOff.style.display = "block";
    voiceDown.style.display = "none";
}

voiceOn.addEventListener('click', voiceOnFunc);
voiceOff.addEventListener('click', voiceOffFunc);
voiceDown.addEventListener('click', voiceDownFunc);


/* fullScreen functions */

fullScreenBtn.addEventListener('click', fullScreenMode);
lessFullScreenBtn.addEventListener('click', fullScreenMode);

function fullScreenMode() {
    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen();
        lessFullScreenBtn.style.display = "block";
        fullScreenBtn.style.display = "none";
    } else {
        document.exitFullscreen();
        lessFullScreenBtn.style.display = "none";
        fullScreenBtn.style.display = "block";
    }
}

/* Time */

video.addEventListener("loadeddata", () => {
    videoLength.textContent = formatDuration(video.duration);
})

video.addEventListener('timeupdate', function () {
    var hours = parseInt(video.currentTime / (60 * 60), 10);
    var minutes = parseInt(video.currentTime / 60, 10);
    var seconds = video.currentTime % 60;
    if (hours == 0) {
        if (seconds < 10) {
            timer.innerHTML = `${minutes}:0${seconds.toFixed(0)}`;
        } else {
            timer.innerHTML = `${minutes}:${seconds.toFixed(0)}`;
        }
    } else {
        if (seconds < 10) {
            timer.innerHTML = `${hours}:${minutes}:0${seconds.toFixed}`;
        } else {
            timer.innerHTML = hours + ":" + minutes + ":" + seconds.toFixed(0);
        }
    }
    const percent = video.currentTime / video.duration;
    timelineContainer.style.setProperty("--progress-position", percent)
});

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
})
function formatDuration(time) {
    const seconds = Math.ceil(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)
    if (hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    } else {
        return `${hours}:${leadingZeroFormatter.format(
            minutes
        )}:${leadingZeroFormatter.format(seconds)}`
    }
}

/* settings */

settingBtn.addEventListener("click", function () {
    settingContainer.classList.toggle("settingsContainerShow");
    settingBtn.classList.toggle('settingAnimation');
})

summary.addEventListener('click', function () {
    containerSpeed.classList.toggle('settings--container__speedAnimation');
    settingsTriagle.style.float = "left";
    settingsTriagle.classList.toggle('triangleAnimation');
})

videoSlow.addEventListener('click', function () {
    video.playbackRate = 0.5;
});
videoNormal.addEventListener('click', function () {
    video.playbackRate = 1;
});
videoFast.addEventListener('click', function () {
    video.playbackRate = 1.5;
});
videoFaster.addEventListener('click', function () {
    video.playbackRate = 2;
});
