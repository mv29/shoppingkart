
exports=module.exports= {
   mv: function mrinal(price, tax,discount)
   {
       let a="negative price is not allowed";
       let b="negative tax is not allowed";
       let c="negative discount is not allowed";
       let d="price cannot be string";
       let e="tax cannot be string";
       let f="discount cannot be string";
       if(typeof(price)=='string')
           return d
       if(typeof(tax)=='string')
           return e
       if(typeof(discount)=='string')
           return f
       if(price<0)
           return a
       if(tax<0)
           return b
       if(discount<0)
       return c
    let total = price + (price * tax) / 100 - (price *discount)/ 100;
    return total;
   }
};