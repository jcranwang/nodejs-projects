const yargs = require("yargs");
const notes = require("./notes");

yargs.command({
  command: "add",
  describe: "add note",
  builder: {
    title: {
      describe: "note title",
      demandOption: true,
      type: "string"
    },
    body: {
      describe: "note body",
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
  describe: "delete note",
  builder: {
    title: {
      describe: "note title",
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
  describe: "show all notes title",
  handler() {
    notes.show();
  }
});

yargs.command({
  command: "read",
  describe: "read a note's title and body",
  builder: {
    title: {
      describe: "note title",
      demandOption: true,
      type: "string"
    }
  },
  handler(argv) {
    notes.read(argv.title);
  }
});

yargs.parse();
