const chalk = require("chalk");
const fs = require("fs");

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync("notes.json");
    const notesJSON = dataBuffer.toString();
    return JSON.parse(notesJSON);
  } catch (e) {
    return [];
  }
};

const saveNotes = notes => {
  const notesJSON = JSON.stringify(notes);
  fs.writeFileSync("notes.json", notesJSON);
};

const addNote = (title, body) => {
  const notes = loadNotes();
  const duplicateNote = notes.find(note => note.title === title);

  if (!duplicateNote) {
    notes.push({
      title: title,
      body: body
    });
    saveNotes(notes);
    console.log(chalk.inverse.green("Notes added!"));
  } else {
    console.log(chalk.inverse.red("ERROR!Duplicate note"));
  }
};

const deleteNote = title => {
  const notes = loadNotes();
  const updatedNotes = notes.filter(note => note.title !== title);
  if (updatedNotes.length < notes.length) {
    saveNotes(updatedNotes);
    console.log(chalk.inverse.green("Notes deleted"));
  } else {
    console.log(chalk.inverse.red("ERROR! Note not found"));
  }
}


module.exports = {
  add: addNote,
  delete: deleteNote
};
