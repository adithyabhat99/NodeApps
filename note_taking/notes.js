const fs = require("fs");
const chalk=require("chalk");

const saveNotes = (notes) =>{
    fs.writeFileSync("notes.json",JSON.stringify(notes));
}

const loadNotes = () =>{
    try{
        const dataBuff=fs.readFileSync("notes.json");
        const dataJson=dataBuff.toString();
        return JSON.parse(dataJson);
    }
    catch(error){
        return []
    }
}

const getNotes = () =>{
    const notes= loadNotes();
    notes.map((note)=>{
        console.log(chalk.green(note.title));
    })
}

const addNote = (title,body) =>{
    const notes = loadNotes();
    const duplicateNotes = notes.filter((note)=>{
        return note.title===title;
    });
    if(duplicateNotes.length===0)
    {
        notes.push({
            title,
            body
        });
        saveNotes(notes);
        console.log(chalk.green("Note added!"));
    }
    else
    {
        console.log(chalk.grey("Note already exists"));
    }
}

const removeNote = (title) =>{
    const notes=loadNotes();
    const newNotes=notes.filter((note)=>{
        return note.title!==title;
    });
    if(newNotes.length===notes.length){
        console.log(chalk.red("Note does not exists"));
    }
    else{
        saveNotes(newNotes);
        console.log(chalk.green("Note deleted!"));
    }
}


const readNote = (title) =>{
    const notes=loadNotes();
    const note=notes.filter((note)=>{
        return note.title===title;
    })
    if(note.length===0){
        console.log(chalk.red("Note does not exist"));
    }
    else{
        console.log(chalk.grey(note[0].title));
        console.log(chalk.green(note[0].body));
    }
}

module.exports = { 
    getNotes,
    addNote,
    removeNote,
    readNote,
};