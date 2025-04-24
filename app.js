const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressHandleBars = require('express-handlebars')

// configuration set
app.engine("hbs",expressHandleBars.engine({layoutsDir: 'views/',defaultLayout: "main",extname: "hbs"}));
app.set('view engine','hbs'); //view engine name default not changed
app.set('views','views');


// routes
app.get('/',(req,res)=>{
    let msg = "Hello Nice to meet to you too!";
    res.render('main',{msg});
})



const port = 3000
app.listen(port, () => {
    console.log(`Server running on ${port}`);
})