const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressHandleBars = require('express-handlebars')
const dbo = require('./db');

// configuration set
app.engine("hbs",expressHandleBars.engine({layoutsDir: 'views/',defaultLayout: "main",extname: "hbs"}));
app.set('view engine','hbs'); //view engine name default not changed
app.set('views','views');


// routes
app.get('/', async (req,res)=>{
    let database = await dbo.getDatabase()
    const collection = database.collection('books');
    const cursor = collection.find({}); //cursor = query
    let employess = await cursor.toArray();

    let msg = employess.length > 0 ? "Data Retrived" : "No Data";
    res.render('main',{msg,employess});
})



const port = 3000
app.listen(port, () => {
    console.log(`Server running on ${port}`);
})