import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import * as db from './components/db';
import { IRequestItem } from './components/interfaces';
import path from 'path';
import fs from 'fs';


const app = express();

const storage = multer.diskStorage({
    
    destination: path.join(__dirname, '/../static/images'),
    filename: function ( req, file, cb ) {
        const fileLowerCase = file.originalname.toLowerCase();
        const filename = (fileLowerCase.endsWith('.jpg') || 
                        fileLowerCase.endsWith('.jpeg') || 
                        fileLowerCase.endsWith('.png')) ? file.originalname : file.originalname + '.jpg'
        
        if (!fs.existsSync(path.join(__dirname, '/../static/images/', filename))){
            cb(null, filename);
        }
    }
  });

const upload = multer( { storage: storage } );

app.use(morgan('combined'));
app.use(express.json());
app.use('/static', express.static(__dirname + '/../static'));
app.use(cors())
app.use('/upload', upload.single('image'), (req, res) => res.end('File uploaded!'));


// GET
app.get('/', async (req, res) => {
    res.send("<h1>Welcome on ordes store</h1>");
})
app.get('/categories', async (req, res) => {
    const response = await db.showCategories();
    res.json(response);
})
app.get('/orders', async (req, res) => {
    const result = await db.showOrders();
    res.json(result);
})
app.get('/last-order', async (req, res) => {
    const result = await db.showLastOrder();
    res.json(result);
})

// POST
app.post('/category', async (req, res) => {
    const {name} = req.body;
    const response = await db.createNewCategory(name);
    res.json(response);
})
app.post('/order', async (req, res) => {
    const {name, image, category}: IRequestItem = req.body;
    const result = await db.createNewOrder(name, image, category);
    res.json(result);
})

// PUT
app.put('/order/:id', async (req, res) => {
    const id: number = Number(req.params.id);
    const {name, image, category}: IRequestItem = req.body;
    await db.patchOrder(id, name, image, category)
    res.end("Patched successfully");
})
app.put('/order/:id/done', async (req, res) => {
    const id: number = Number(req.params.id);
    await db.orderDone(id, false);
    res.end("Patched successfully")
})


// LISTENING
app.listen(3000, '192.168.1.50', () => {
    console.log('Server started at: http://192.168.1.50:3000/');
})