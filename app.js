const filter = document.querySelector("#status-filter");
const list = document.querySelector("#patient-list");
const errorMessage = document.querySelector("#error-message");

let xmlDocument;

async function loadRegistry() {
  const response = await fetch("patients.xml");
  const xmlText = await response.text();

  // TODO 3: Create a DOMParser and parse xmlText as "application/xml".
  const parser = new DOMParser();
  xmlDocument = parser.parseFromString(xmlText, "application/xml");

  // TODO 4: Find the parsererror element. Show its text and stop if it exists.
  const parseError = xmlDocument.querySelector("parsererror");
  if (parseError) {
    errorMessage.hidden = false;
    errorMessage.textContent = "XML error: " + parseError.textContent;
    return;
  }

  errorMessage.hidden = true;
  renderPatients();
}

function renderPatients() {
  list.replaceChildren();

  // TODO 5: Select all patient elements from xmlDocument.
  const patients = xmlDocument.querySelectorAll("patient");

  patients.forEach((patient) => {
    const status = patient.getAttribute("status");

    // TODO 6: Keep all patients when the filter is "all".
    // Otherwise, skip patients whose status does not match the filter.
    //The logic means: If the filter is all, do not skip anyone. If the filter is critical, skip stable patients.
    //If the filter is stable, skip critical patients.
    //he return skips only the current patient in the forEach() loop.
    if (filter.value !== "all" && status !== filter.value) {
    return;
}
    const card = document.createElement("article");
    card.className = "patient-card";
    card.dataset.status = status;

    const name = document.createElement("h3");
    // TODO 7: Read the name element and assign it with textContent.
    name.textContent = "Patient name";

    const details = document.createElement("p");
    const ward = patient.querySelector("ward").textContent;
    const condition = patient.querySelector("condition").textContent;
    details.textContent = `${ward}: ${condition}`;

    const observation = patient.querySelector("observation");
    const reading = document.createElement("p");
    reading.textContent = `${observation.getAttribute("code")}: ${observation.textContent} ${observation.getAttribute("unit")}`;

    const statusText = document.createElement("span");
    statusText.className = "status";
    statusText.textContent = status;

    card.append(name, details, reading, statusText);
    list.append(card);
  });
}

filter.addEventListener("change", renderPatients);
loadRegistry();

