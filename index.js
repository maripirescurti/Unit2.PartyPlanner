const COHORT = "2404-FTB-MT-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);


// Sync state with the API and rerender

async function render() {
  await getEvents();
  renderEvents();
}
render();


// Update state with artists from API

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error)
  }
}

console.log(state.events)


//  Render artists from state
 
function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events.</li>";
    return;
  }

  eventList.innerHTML = ""; // clears previous content

  const eventCards = state.events.map(event => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${event.name}</h2>
      <p>${event.description}</p>
      <p>${event.date}</p>
      <p>${event.location}</p>
      <button class="delete-button" data-id="${event.id}">Delete</button>
      `;

      const deleteButton = li.querySelector(".delete-button");
      deleteButton.addEventListener("click", () => deleteEvent(event.id))

      return li;
  });
  
  eventList.append(...eventCards);
}


// Ask the API to create a new artist based on form data
 
async function addEvent(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: addEventForm.date.value,
        location: addEventForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteEvent(eventId) {
  try {
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed t delete event");
    }
    // after deletion, re-render events
    await getEvents();
    renderEvents();
  } catch (error) {
    console.error(error);
  }
}
