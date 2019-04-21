const yargs = require("yargs");
const notes = require("./notes");

yargs.command({
  command: "add",
  description: "add note",
  builder: {
    title: {
      description: "note title",
      demandOption: true,
      type: "string"
    },
    body: {
      description: "note body",
      demandOption: true,
      type: "string"
    }
  },
  handler(argv) {
    notes.add(argv.title, argv.body);
  }
});

yargs.command({
  command: "delete",
  description: "delete note",
  builder: {
    title: {
      description: "note title",
      demandOption: true,
      type: "string"
    }
  },
  handler(argv) {
    notes.delete(argv.title);
  }
});

yargs.command({
  command: "show",
  description: "show all notes title",
  handler() {
    console.log("Show titles");
  }
});

yargs.command({
  command: "read",
  description: "read a note's title and body",
  builder: {
    title: {
      description: "note title",
      demandOption: true,
      type: "string"
    }
  },
  handler(argv) {
    console.log(argv.title);
  }
});

yargs.parse();
