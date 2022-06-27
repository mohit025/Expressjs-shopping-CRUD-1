const express=require('express');
const router=express.Router();
const Product=require('../models/product');
const Review=require('../models/review');

//display all products
router.get('/products', async(req,res)=>{
    try{

        const products =await Product.find({});
        res.render('products/index',{products});
    } catch(e){
        console.log("something went wrong");
        req.flash('error', 'cant find products');
        res.render('error')
    }
})
//new product
router.get('/products/new' , (req,res)=>{
    res.render('products/new');
})
//create it
router.post('/products', async(req,res)=>{
try{

    await Product.create(req.body.product);
    req.flash('success', 'Product successfully created');
    res.redirect('/products')
} catch(e){
    console.log(e.message);
    req.flash('error', 'cant create product, Something wrong');
        res.render('error')
}

})
// Show product
router.get('/products/:id', async (req,res)=>{
    try{

        const product=await Product.findById(req.params.id).populate('reviews');
         res.render('products/show', {product});
    } catch(e){
        console.log(e.message);
        req.flash('error', 'cant Find product');
        req.flash('error', 'cant find this product');
            res.redirect('error')
    }
})
//For to get edit form
router.get('/products/:id/edit', async (req,res)=>{
    const product=await Product.findById(req.params.id);

    res.render('products/edit', {product});
})
//update it
router.patch('/products/:id',async(req,res)=>{
    await Product.findByIdAndUpdate(req.params.id,req.body.product);
    req.flash('success','Updated success');
    res.redirect(`/products/${req.params.id}`)
})
//delete it
router.delete('/products/:id', async(req,res)=>{
await Product.findByIdAndDelete(req.params.id);
res.redirect('/products');
})

// create new comment
router.post('/products/:id/review', async (req,res)=>{
    // res.send("COmment route");
    const product = await Product.findById(req.params.id);
    const review=new Review(req.body);
    product.reviews.push(review);
    await review.save();

    await product.save();
    res.redirect(`/products/${req.params.id}`);
})
router.get('/error',(req,res)=>{
    res.render('error');
})
module.exports=router;