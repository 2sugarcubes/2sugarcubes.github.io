import init, {
  //initThreadPool,
  generate_observations_from_json,
  generate_universe,
  generate_universe_from_seed,
} from "./astro/astrograph_wasm.js";

async function loadJsonFile(url, callback) {
  fetch(url)
    .then((response) => response.json())
    .then((json) => callback(json));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

var frame = document.getElementById("slides");
const firstNavButton = document.getElementById("navButtonPrev");

window.draw_observation = function draw_observation(time, svgData) {
  const lines = svgData.split("\n").length;

  var dataURL =
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);

  var slide = document.createElement("img");
  const id = `slideT=${time}`;
  slide.src = dataURL;
  slide.classList.add("slide");
  slide.id = id;
  if (time != startTime.value) {
    // If it isn't the first slide hide it
    slide.style.display = "none";
  }
  frame.appendChild(slide);
};

let universe = document.getElementById("universe");
let observatories = document.getElementById("observatories");
let startTime = document.getElementById("startTime");
let endTime = document.getElementById("endTime");
let stepSize = document.getElementById("stepSize");

window.generateUniverse = function generateUniverse(seed, starNum) {
  if (!seed) {
    return generate_universe();
  } else {
    return generate_universe_from_seed(BigInt(seed));
  }
};

window.simulate = async function simulate() {
  frame.textContent = "";
  const local_universe = universe.value;
  const local_observatories = observatories.value;
  const local_startTime = startTime.value;
  const local_endTime = endTime.value;
  const local_stepSize = stepSize.value;

  generate_observations_from_json(
    local_universe,
    local_observatories,
    BigInt(local_startTime),
    BigInt(local_endTime),
    local_stepSize,
  );
};

console.debug(frame);
console.debug(firstNavButton);

console.debug("Initializing wasm modules");
await init();

// TODO: add support for web workers

//await initThreadPool(navigator.hardwareConcurrency);
console.debug("Finished initializing wasm modules");
