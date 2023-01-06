const wishlist = require('../../models/wishlist')
const mongoose = require('mongoose')

const Wishlistpage = async(req,res)=>{
   try {
    const userId = req.session.userlo;
    const Id = mongoose.Types.ObjectId(userId)
    const wishdata = await wishlist.aggregate([
        {
            $match:{userId:Id}
        },
        {
            $unwind:"$products"
        },
        {
           $project:{
            productId:"$products.productId",
           },
        },
        {
            $lookup:{
                from:"products",
                localField:"productId",
                foreignField:"_id",
                as:'wish'
            }
        },
        {
            $project:{
                productId:1,
                wish:{$arrayElemAt:["$wish",0]},
            }
        }

    ])
console.log(wishdata);
    res.render('user/wishlistpage',{wishdata})
   } catch (error) {
    console.log(error.message);
   }

}

const addWishlist = async(req,res)=>{
    try {
        const data = req.body
        const id = data.prodId
      
        console.log(id);
        const userId = req.session.userlo;
        console.log(userId);
        const Id = mongoose.Types.ObjectId(userId)
        const wish = await wishlist.findOne({userId:Id})
        if(wish){
            let wishlistEx = wish.products.findIndex((products)=>
            
            products.productId == id
            );
           if(wishlistEx != -1){
            res.json({wish:true})

           }else{
            const dataPush = await wishlist.updateOne({userId:Id},
                {
                    $push:{products:{ productId:id } },
                }
                ).then(()=>{
                    res.redirect('/view_product')
                })
           }

            

        }else{
            const addWish = new wishlist({
                userId:userId,
                products:[{productId:id}]
            })
            await addWish.save()
        }

       
    } catch (error) {
        console.log(error.message);
    }
}

const removewishlist = async(req,res)=>{
    try {
        const id = req.query.id
        const userId = req.session.userlo;
        const remove = await wishlist.updateOne({userId:mongoose.Types.ObjectId(userId)},
        {
            $pull:{products:{productId:id}}
        }
        ).then(()=>{
            res.redirect('/wishlist')
        })
 
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    Wishlistpage,
    addWishlist,
    removewishlist
}