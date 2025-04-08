import CommandFactory from "./Commands/CommandFactory.js";
import DesignatedExecutive from "./DesignatedExecutive.js";
import Event from "../Observer/Event.js";
import EventState from "../Observer/EventState.js";
import System from "../System.js";
//? **********************
//? THIS FILE IS JUST TO SHOW TO EVERYTHING WORKS. ITS NOT ACTUAL PRODUCTION CODE
//? **********************

// Create a CommandFactory instance
const commandFactory = new CommandFactory();

// Create a TechnicalAdmin
const DesignatedExecutive = new DesignatedExecutive("exe-001", []);

//! This is the logic that an Organizer would see
// Create an EventState object - This stores the main info on the event
const initialState = new EventState({
  name: "Tech Conference",
  date: new Date("2025-05-15"),
  location: "New York City",
  description: "A conference about the latest in tech.",
});

// Create an Event object
const event = new Event({
  id: 1,
  state: initialState, //Pass the initialState createdAbove
  executive: DesignatedExecutive, //Assign an executive to this - the one createda bove
});

// Create a command to create an event. This would be called by the technical Admin
const createEventCommand = commandFactory.createEventCommand({
  id: event.id,
  state: event.getState(),
  status: "Waiting Approval",
  executive: event.executive,
});

//! When the event is approved by the Admin, they submit it to the system

// Admin submits the command to the system
DesignatedExecutive.submitCommand(createEventCommand);

// Check the command history
console.log("Command History:", DesignatedExecutive.getCommandHistory());

// Undo the last command
DesignatedExecutive.undoLastCommand();

// Check the command history again
console.log("Command History after undo:", techAdmin.getCommandHistory());
