import {db} from './firebase.mjs'

import fs from 'fs';
import {collection, addDoc} from "@firebase/firestore";
// Synchronous File Read
let data = fs.readFileSync('Withuta.json');
// @ts-ignore
let withuta = JSON.parse(data);

withuta.map(doc => {
    addDoc(collection(db, "buildings"), doc)
    console.log("added");
})
console.log(withuta[1]);