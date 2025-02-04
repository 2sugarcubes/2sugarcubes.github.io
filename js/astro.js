import init, {
  //initThreadPool,
  generate_observations_from_json,
  generate_universe,
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
  slide.src = dataURL;
  slide.classList.add("slide");
  frame.appendChild(slide);
};

window.simulate = async function simulate() {
  const universe = document.getElementById("universe").value;
  const observatories = document.getElementById("observatories").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const stepSize = document.getElementById("stepSize").value;

  generate_observations_from_json(
    universe,
    observatories,
    BigInt(startTime),
    BigInt(endTime),
    stepSize,
  );
};

console.debug(frame);
console.debug(firstNavButton);

console.debug("Initializing wasm modules");
await init();

// TODO: add support for web workers

//await initThreadPool(navigator.hardwareConcurrency);
console.debug("Finished initializing wasm modules");
