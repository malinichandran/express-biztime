const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

router.get('/', async(req, res, next)=>{
    try{
        const results = await db.query(`SELECT * FROM invoices`)
        return res.json({ invoices: results.rows })
    }catch(e){
        return next(e);
    }
});

router.get('/:id', async(req, res, next)=>{
    try{
        const {id} = req.params;
        const results = await db.query(`SELECT * FROM invoices WHERE id =$1`, [id]);
        if (results.rows.length === 0){
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404);
        }
        return res.json( {invoice: results.rows})
    }catch(e){
        return next(e);
    }
});

router.post('/', async(req, res, next)=>{
    try{
        const {comp_Code, amt, paid, paid_date} = req.body;
        const results = await db.query(`INSERT INTO invoices (comp_Code, amt, paid, paid_date) VALUES ($1, $2, $3, $4) RETURNING comp_Code, amt, paid, paid_date`, [comp_Code, amt, paid, paid_date])
        return res.status(201).json({ invoice :results.rows})
    }catch(e){
        return next(e);
    }
});

router.put('/:id', async(req, res, next)=>{
    try{
        const {id} = req.params;
        const {  amt, paid, paid_date} = req.body;
        const results = await db.query('UPDATE invoices SET  amt=$1, paid=$2, paid_date=$3 WHERE id=$4 RETURNING amt, paid, paid_date', [amt, paid, paid_date, id]);
        if(results.rows.length === 0){
            throw new ExpressError(`Can't update company with code of ${code}`, 404);
        }
        return res.send({ invoice: results.rows })
    }catch(e){
        return next(e);
    }
});

router.delete('/:id', async(req, res, next)=>{
    try{
     const results = db.query('DELETE FROM invoices WHERE id = $1', [req.params.id]);
     return res.send({status: "DELETED!"})
    }catch(e){
        return next(e);
    }
});


module.exports = router;