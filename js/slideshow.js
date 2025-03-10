let slideIndex = 0;
showSlides(0);
//showSlides(slideIndex);

function getSlides() {
  return document.getElementsByClassName("slide");
}

// Next/previous controls
function plusSlides(n) {
  stepSlides((slideIndex += n));
}

function getSlide(i) {
  return document.getElementById(`slideT=${i}`);
}

function isPlaying() {
  let playing = document.getElementById("playing");
  console.debug(playing);
  return playing && !playing.checked;
}

function stepSlides(n) {
  let slides = getSlides();
  if (n >= slides.length) {
    slideIndex = 0;
  }
  if (n < 0) {
    slideIndex = slides.length - 1;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  console.debug(slideIndex);

  slides[slideIndex].style.display = "block";
}

function showSlides(n = 1) {
  let i;
  let slides = getSlides();
  if (isPlaying()) {
    // Break if the user has paused the playback
    console.log("Stopping showing slides since it is not selected to play");
    return;
  }
  if (slides.length >= 0) {
    slideIndex += n;

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    if (slideIndex >= slides.length) {
      slideIndex = 0;
    } else if (slideIndex < 0) {
      slideIndex = slides.length - 1;
    }
    slides[slideIndex].style.display = "block";
    console.log(`Showing slide ${slideIndex}`);
  }

  console.debug(`Auto slide: ${slideIndex}`);
  setTimeout(showSlides, 1000);
}
