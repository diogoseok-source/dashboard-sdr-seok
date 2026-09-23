const opening = document.querySelector('#opening')
const video = document.querySelector('#opening-video')
const app = document.querySelector('#app')
const status = document.querySelector('#opening-status')
const minimumDuration = 4000
let startedAt, playbackStartedAt, fallbackTimer, finishTimer, leaving

function finish() {
  if (leaving) return
  const remaining = minimumDuration - (performance.now() - startedAt)
  if (remaining > 0) {
    clearTimeout(finishTimer)
    finishTimer = setTimeout(finish, remaining)
    return
  }
  leaving = true
  clearTimeout(fallbackTimer)
  opening.classList.add('is-leaving')
  finishTimer = setTimeout(() => {
    opening.hidden = true
    video.pause()
    app.inert = false
    document.documentElement.classList.remove('intro-active')
  }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350)
}

function start() {
  clearTimeout(fallbackTimer)
  clearTimeout(finishTimer)
  startedAt = performance.now()
  playbackStartedAt = null
  leaving = false
  opening.hidden = false
  opening.classList.remove('is-leaving')
  app.inert = true
  document.documentElement.classList.add('intro-active')
  status.textContent = 'SEOK · PREPARANDO SEU DASHBOARD'
  video.muted = true
  video.currentTime = 0
  // Do not trap the user if the connection stalls or the media cannot load.
  fallbackTimer = setTimeout(finish, 12000)
  video.play().catch(finish)
}

video.addEventListener('playing', () => {
  playbackStartedAt ??= performance.now()
  status.textContent = 'SEOK · BORA VENDER'
})
video.addEventListener('timeupdate', () => {
  if (playbackStartedAt !== null && video.currentTime >= 4 &&
      performance.now() - playbackStartedAt >= minimumDuration) finish()
})
video.addEventListener('ended', finish)
video.addEventListener('error', finish)
// Replaying on a history-cache return also counts as a fresh entry.
window.addEventListener('pageshow', event => { if (event.persisted) start() })
start()
