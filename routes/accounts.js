import express, { Router } from "express"
import {promises as fs} from "fs"

const {readFile, writeFile} = fs;

const router = express.Router();

router.post("/", async (req,res)=>{
    try{
    let delivery = req.body;
    const data = JSON.parse(await readFile("accs.json"));

    delivery = {id: data.nextId++, ...delivery}
    delivery.timestamp = new Date();
    data.pedidos.push(delivery);
    
    

    await writeFile("accs.json", JSON.stringify(data))
    res.send(delivery);
    res.end()
    }
    catch(err){
        res.status(400).send({error: err.message});
    }
    
})

router.put("/", async (req,res)=>{
    try{
        const pedido = req.body
        const data = JSON.parse(await readFile("accs.json"));
        const index = data.pedidos.findIndex(a=> a.id === pedido.id);

        data.pedidos[index] = pedido;
        
        await writeFile("accs.json", JSON.stringify(data))
        res.send(pedido)
    }
    catch(err){
        res.status(400).send({error: err.message});
    }
})

router.patch('/', async(req,res)=>{
    try{
    const pedido = req.body
    const data = JSON.parse(await readFile("accs.json",));
    const index = data.pedidos.findIndex(a=> a.id === pedido.id);
    data.pedidos[index].entregue = pedido.entregue
    res.send(data);

    await writeFile('accs.json', JSON.stringify(data));
    }
    catch(err){
        res.status(400).send({error: err.message});
    } 
})

router.delete('/:id', async(req,res)=>{
    try{
        const data = JSON.parse(await readFile("accs.json"));
        const resul = data.pedidos.filter(list => list.id !== parseInt(req.params.id));
        

        await writeFile('accs.json',JSON.stringify(resul, null, 2));
        
    }
    catch(err){
        res.status(400).send({error: err.message});
    }
})

router.get('/:id', async (req,res) => {
    try{
        const data = JSON.parse(await readFile("accs.json"));
        const resul = data.pedidos.filter(list => list.id === parseInt(req.params.id));
        res.send(resul)
        res.end()
    }
    catch(err){
        res.status(400).send({error: err.message});
    }
})

router.get('/totalCliente/:cliente', async(req,res) => {
    try{   
        const data = JSON.parse(await readFile("accs.json"));
        const resul = data.pedidos.filter(list =>list.cliente === req.params.cliente && list.entregue === true)
        let total = 0;
        resul.map(lista => total += parseFloat(lista.valor))
        res.sendStatus(total.toString());
    }
    catch(err){
        res.status(400).send({error: err.message});
    }
})

router.get('/totalProduto/:produto', async(req,res) => {
    try{   
        const data = JSON.parse(await readFile("accs.json"));
        const resul = data.pedidos.filter(list =>list.produto === req.params.produto && list.entregue === true)
        let total = 0;
        resul.map(lista => total += parseFloat(lista.valor))
        res.send(total.toString())
    }
    catch(err){
        res.status(400).send({error: err.message});
    }
})

router.get("/", async(req,res) =>{
    try{
        const data = JSON.parse(await readFile("accs.json"));
        let pizzas = []
        
        data.pedidos.filter(p => p.entregue).forEach(p => {
            const index = pizzas.findIndex(it =>it.produto === p.produto);
            if(index === -1){
                pizzas.push({ produto: p.produto, quantidade: 1})
            } else {
                pizzas[index].quantidade++;
            }
        });

        pizzas.sort((a,b) => b.quantidade - a.quantidade);
        res.send(pizzas)
    }
    catch(err){
        res.status(400).send({error: err.message});
    }
})


export default router;