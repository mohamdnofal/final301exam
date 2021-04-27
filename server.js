'use strict'

const express = require('express');
const pg = require('pg');
const superagent = require ('superagent');
const cors = require('cors');
const methodOverride = require ('method-override');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);
// const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
// const client = new pg.Client( { connectionString: process.env.DATABASE_URL, ssl: process.env.LOCALLY ? false : {rejectUnauthorized: false}} );
app.get('/',renderHome);
app.get('/saved',saveToFav);
app.get('/saved',renderFav); 
app.get('/details',renderDetails); 
app.put('/details', update);
app.delete('/details', deleteFav);

function renderHome (req,res){
    let url = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline&price_greater_than=10&price_less_than=14`
    console.log(url);
    superagent.get(url).then(apiRes=>{
        console.log(apiRes.body);
        res.render('pages/index',{data:apiRes.body})
    });
   
}


function saveToFav(req,res){
let sql = "INSERT INTO makeup (name,price, image_link, description ) VALUES ($1,$2,$3,$4)";
let sql2= "SELECT * FROM makeup"

let values = [req.body.name,req.body.price,req.body.image_link,req.body.description];
client.query(sql,values).then((results)=>{

}).then (client.query(sql2).then(results=>{
    res.render('pages/saved', {data:results.rows})
}))
}

function renderFav(req,res){
    let sql = "SELECT * FROM makeup";
    client.query(sql).then(results=>{
        res.render('pages/saved', {data:results.rows.sort()})
})
}

function renderDetails (req,res){
    let id = req.params.id;
    let sql = "SELECT * FRPM makeup WHERE id = $1";
    let values = [id];
    client.query(sql,values).then(results =>{
        res.render('pages/details', {data:results.rows[0]})
    })
}

function update(req,res){

    let id = req.params.id;
    let sql = 'UPDATE makeup SET name=$1, price=$2, image_url=$3, description=$4 WHERE id=$4 RETURNING *';

    let values = [ req.body.name, req.body.price, req.body.image_url, req.body.description,id];
    client.query(sql,values).then(results=>{
        res.render('pages/details', {data:results.rows[0]})
    })

}

function deleteFav (req,res){

    let id = req.params.id
    let sql = "DELETE FROM makeup WHERE id=$1"

    let values= [id];
    client.query(sql,values).then(results=>
        res.redirect('/details'))

}

client.connect().then(()=> 
app.listen(PORT,() => console.log (`listenning on port${PORT}`))
);


