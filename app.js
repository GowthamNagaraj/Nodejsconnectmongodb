const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressHandleBars = require('express-handlebars')
const dbo = require('./db');
const ObjectID = dbo.ObjectID;

// configuration set
app.engine("hbs",expressHandleBars.engine({layoutsDir: 'views/',defaultLayout: "main",extname: "hbs"}));
app.set('view engine','hbs'); //view engine name default not changed
app.set('views','views');

app.use(bodyParser.urlencoded({extended:true}))


// routes
app.get('/', async (req,res)=>{
    let database = await dbo.getDatabase()
    const collection = database.collection('books');
    const cursor = collection.find({}); //cursor = query
    let books = await cursor.toArray();

    let msg = '';

    // edit
    let edit_id, edit_book;

    if(req.query.edit_id){
        edit_id = req.query.edit_id;
        edit_book = await collection.findOne({_id:new ObjectID(edit_id)})
    }

    // delete
    if(req.query.delete_id){
        await collection.deleteOne({_id:new ObjectID(req.query.delete_id)})
        return res.redirect('/?status=3')
    }

    switch (req.query.status) {
        case '1':
            msg = "Inserted Successfully"
            break;
        case '2':
            msg = "Updated Successfully"
            break;
        case '3':
            msg = "Deleted Successfully"
            break;
    
        default:
            break;
    }


    res.render('main',{msg,books,edit_id,edit_book});
})

// post
app.post('/store_book', async (req,res) => {
    let database = await dbo.getDatabase();
    const collection = database.collection('books');

    let book = {
        title: req.body.title,
        author: req.body.author
    }

    await collection.insertOne(book);

    return res.redirect('/?status=1')
})

// update

app.post('/update_book/:edit_id', async (req,res) => {
    let database = await dbo.getDatabase();
    const collection = database.collection("books");

    let books = {
        title: req.body.title,
        author: req.body.author
    }
    let edit_id = req.params.edit_id;
    
    await collection.updateOne({_id:new ObjectID(edit_id)},{$set:books})
    return res.redirect('/?status=2')
})


const port = 3000
app.listen(port, () => {
    console.log(`Server running on ${port}`);
})