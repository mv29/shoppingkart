$(function(){

    let lol = $(".lol");

    // lol is in the layout hbs file
    // button clicks (always use id while attaching event listeners to a parent element for children
    // on attribute is useful for dynamic html elements


    $("#logout").click(function () {
         logout();
    }
    );

    lol.on('click', '#mv', function(){

          let mv=  $(this).val();
          quantity(mv);
    });

    lol.on('click', '#listwish', function(){

         let mv=  $(this).val();
         wishlist(mv);
    });

     lol.on('click', '#email', function(){

         let mv=  document.getElementById('email1').value;
         emailverfivation(mv);
    });

    lol.on('click', '#resetpassword', function(){

        let mv=  document.getElementById('email2').value;
        ResetPassword(mv);
    });

    lol.on('click', '#loda', function(){

         alert("Password has been changed");
    });




    // function of adding catalog items in the catalog page not cartitems
    function cartlsit(data){
        $('#cart').empty();
        for (let i = 0; i < data.length; i++) {
            if(data[i].quantity<1)
                continue;
            $("#cart").append(
                $(`
                  <div class="row">
                       <div class="col-md-5">
                       
                       <p style="color:ghostwhite">ProductId ${data[i].name} </p>
                    </div>
                    <div class="col-md-7">
                       <p style="color:ghostwhite">Quantity ${data[i].quantity} </p>
                    </div>
          </div>
            `)
            )
        }
    }




    let total=0;
    function bill(data)
    {
        $('#bill').empty();
        for (let i = 0; i < (data.length); i++) {
            total += data[i].quantity * data[i].price;
            if (i < data.length) {
                if (data[i].quantity == 0)
                    continue;
                $("#bill").append(
                    $(`
                <tr>
                <td>${i}</td>             
                <td>${data[i].name}</td>
                <td>${data[i].vendor}</td>
                <td>${data[i].tax}</td>
                <td>${data[i].price}</td>
                <td>${data[i].quantity}</td>
                <td>${(data[i].quantity) * data[i].price}</td>
                </tr>
               `)
                )
            }
    }
     if (total > 0) { // adding total at the end
            $("#bill").append(
                $(`
                <tr>
                <td>Total</td>
                <td>   </td>
                <td>   </td>
                <td>   </td>
                <td>   </td>
                <td>   </td>
                <td>${total}</td>             
                </tr>
               `)
            )
         $("#navigate").append(
             $(`
                <a href="/profile/wishlist" type="button" class="btn user mv" style="margin: 30px; width:300px;">Add to wish list</a>
                <a href="/address" type="button" class="btn user mv" style="margin: 30px; width:300px; ">Payment</a>              
`)
         )
     }
    }

    function emailerror() {
        alert("There was an error sending email try again ");
    }
    function emailsend(y) {
        alert("email has been sent to " + y);
    }
    function emailsend1(y) {
        alert("email has been sent to email id of " + y);
    }




    // **************** ****************************** catalog functions  ********************************** **************************



    window.quantity = function (product_id) {
        $.get(`/catalog/adddata?x=${product_id}`, function (data) {
            cartlsit(data);
        })
    };


    // functions with $.get() are invoked for each page change and refresh and to remove ths add them as window property

    $.get(`/catalog/senddata`,function(data){ // refreshes the catalog without rendering
        cartlsit(data);
    });





    //  **************** *********************** cart functions *********************** ********************************************


    $.get(`/cart/senddata`,function(data){  // refreshes the cart without rendering
        bill(data);
    });
    window.wishlist = function (product_id) {
        $.get(`/cart/adddata?x=${product_id}`, function (data) {
            bill(data);
        })
    };







    //  **************** *********************** Email *********************** ********************************************
    window.emailverfivation = function (email) {
        console.log(email);
         $.get(`/email/send?x=${email}`, function (data) {
             console.log(data);
             if (data==="error")
             {
                 emailerror();
             }
                 else
             {
                 emailsend(email);
             }
         })
     };
    window.ResetPassword = function (username) {
        console.log(username);
        $.get(`/resetpassword/send?x=${username}`, function (data) {
            console.log(data);
            if (data==="error")
            {
                emailerror();
            }
            else
            {
                emailsend1(username);
            }
        })
    };
    window.logout = function () {
        $.get(`/logout`, function (data) {
            console.log("succesful logogut");
        })
    };
});