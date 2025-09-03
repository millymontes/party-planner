let BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";

let COHORT = "/2507";
let RESOURCE = "/events";
let API = BASE + COHORT;

// STATE //
let selectedParty;
let parties = [];
let rsvps = [];
let guests = [];

//application renders a list of party names

async function getParties() {
  try {
    let response = await fetch(API + "/events/");
    let result = await response.json();
    parties = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

// application updates state by fetching info about a single party

async function getParty(id) {
  try {
    let response = await fetch(API + "/events/" + id); //whatever.com/events/7
    let result = await response.json();
    selectedParty = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

// update state w all rsvps

async function getRSVPs() {
  try {
    let response = await fetch(API + "/rsvps");
    let result = await response.json();
    rsvps = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

// update w all guests

async function getGuests() {
  try {
    let response = await fetch(API + "/guests");
    let result = await response.json();
    guests = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

// COMPONENTS //

// application renders the name, id, date, desc, and location of the selected party
function PartyListItem(party) {
  let $li = document.createElement("li");

  if (party.id === selectedParty?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href='#selected'>${party.name} </a>
    `;
  $li.addEventListener("click", () => getParty(party.id));
  return $li;
}

function PartyList() {
  let $ul = document.createElement("ul");
  $ul.classList.add("parties");
  let $parties = parties.map(PartyListItem);
  $ul.replaceChildren(...$parties);
  return $ul;
}

// selected party information
// application renders a message

function SelectedParty() {
  if (!selectedParty) {
    let $p = document.createElement("p");
    $p.textContent = "Select a party.";
    return $p;
  }

  let $party = document.createElement("section");
  $party.innerHTML = `
<h3> ${selectedParty.name} #${selectedParty.id}</h3>
<time datetime= '${selectedParty.date}'>
  ${selectedParty.date.slice(0, 10)}
  </time>

  <address> ${selectedParty.location} </address>
  <p>${selectedParty.description}</p>

  <GuestList></GuestList>

`;
  $party.querySelector("GuestList").replaceWith(GuestList());

  return $party;
}

// guest list

function GuestList() {
  let $ul = document.createElement("ul");
  let partyGuests = guests.filter((guest) =>
    rsvps.find(
      (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedParty.id
    )
  );
  return $ul;
}

// render //

function render() {
  let $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1> Party Planner </h1>
    <main>
    <section>
        <h2> Upcoming Parties </h2>
        <PartyList></PartyList>
    </section>
        <section id="selected"> 
        <h2> Party Details </h2>
        <SelectedParty></SelectedParty>
        </section>
    </main>
    `;

  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("SelectedParty").replaceWith(SelectedParty());
}

// not working ?
async function init() {
  await getGuests();
  await getParties();
  await getRSVPs();
  render();
}

init();
// functions are used to organize logic involving state methods

// rerender when state changes

// UI elements are organized into component functions
