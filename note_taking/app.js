const yargs = require("yargs");
const utils = require("./notes");


// Add note command
yargs.command({
    command:"add",
    desc:"add a note",
    builder:{
        title:{
            describe:"Title of the note",
            demandOption:true,
            type:"string"
        },
        body:{
            describe:"Body of the note",
            demandOption:true,
            type:"string"
        }
    },
    handler:(argv)=>{
        utils.addNote(argv.title,argv.body);
    }
});

// Remove note command
yargs.command({
    command:"remove",
    desc:"remove a note",
    builder:{
        title:{
            describe:"Title of the note",
            demandOption:true,
            type:"string"
        },
    },
    handler:(argv)=>{
        utils.removeNote(argv.title);
    }
});

// Read note command
yargs.command({
    command:"read",
    desc:"read a note",
    builder:{
        title:{
            describe:"Title of the note",
            demandOption:true,
            type:"string"
        },
    },
    handler:(argv)=>{
        utils.readNote(argv.title);
    }
});

// List notes command
yargs.command({
    command:"list",
    desc:"list all notes",
    handler:(argv)=>{
        utils.getNotes();
    }
});

yargs.parse()