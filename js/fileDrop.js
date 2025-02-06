function readFile(id, input) {
  console.log(`Got file {input.files[0].name}`);
  if (
    input.files &&
    input.files[0] &&
    input.files[0].type === "application/json"
  ) {
    const file = input.files[0];
    console.log(`Got a json file {file.name}`);
    let reader = new FileReader();
    reader.onload = (e) => {
      console.log(`loaded json file {file.name}`);
      let jsonData = e.target.result;
      let jsonName = file.name;
      console.log(e.target.result);
      document.getElementById(id).value = jsonData;
    };
    reader.readAsText(file);
  }
}

function dragOverHandler(id, event) {
  console.log(`File(s) in drop zone {id}`);
  event.preventDefault();
}
