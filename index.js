import express from "express"
import accountsRouter from "./routes/accounts.js"
import {promises as fs} from "fs"; 

const {readFile, writeFile} = fs;
const app = express();

app.use(express.json());

app.use("/accounts", accountsRouter);


app.listen(8003, async ()=>{
    try{
        await readFile("accs.json")
    }
    catch(err) {
            const initialJason = {
            nextId: 1,
            pedidos : 
            [
            {
            cliente: '',
            produto: '',
            valor: 0,
            entregue: false,
            timestamp: new Date()
            }
            ] }
        writeFile("accs.json", JSON.stringify(initialJason)).then(()=>{
            console.log("Primeiro dado inserido")
        }).catch(err =>{
            console.log(err);
        })
        
    }
    console.log("Api Iniciada")
});