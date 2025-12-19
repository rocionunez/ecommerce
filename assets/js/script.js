//EMPTY LIST PRODUCT ARRAY
let listProductHTML = document.querySelector('.listProduct');
let listProducts = [];
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.cart-qty');
let carts = [];
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if(listProducts.length > 0){
        listProducts.forEach(product=> {
            //si es que necesito usar el id en algo de html hay que usarlo asi: ${newProduct.dataset.id}
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML= `
                <div class="card-image">
                    <img src="${product.image}" alt="" class="imagen my-2">                  
                    <img src="${product.overimage}" alt="" class="imagen my-2">
                    <p>${product.description}</p>
                    </div> 
                <h5 class="name my-3">${product.name}</h5>
                <div class="price my-2">$${product.price}</div>
                <button class="btn btn-success my-2 addCart">Añadir al carro</button>
                `;
            listProductHTML.appendChild(newProduct);
        })
    }
}

listProductHTML.addEventListener('click',(event)=> {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})

const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if(carts.length <= 0){
        carts = [{
            product_id : product_id,
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0){
        carts.push({
            product_id : product_id,
            quantity: 1
        });
    }else {
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    console.log(carts);
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];
            newCart.innerHTML = `
            <div class="image">
                        <img src="${info.image}" alt="" class="product-image">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    <div class="total-price">
                        $${info.price * cart.quantity}
                    </div>
                    <div class="quantity">
                        <span class="minus"><i class="fa-solid fa-less-than"></i></span>
                        <span>${cart.quantity}</span>
                        <span class="plus"><i class="fa-solid fa-greater-than"></i></span>
                    </div>
                </div>
                `;
                listCartHTML.appendChild(newCart);
        });
    }
    iconCartSpan.innerText = totalQuantity;
}
listCartHTML.addEventListener('click', (event)=> {
    let positionClick = event.target;
    let type = 'minus';
    let product_id = positionClick.parentElement.dataset.id;
    if(positionClick.classList.contains('minus')||positionClick.classList.contains('plus')){
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantity(product_id, type)
    }
    changeQuantity(product_id, type);
})
const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;
            default: 
                let valueChange = carts[positionItemInCart].quantity - 1;
                if(valueChange>0){
                    carts[positionItemInCart].quantity = valueChange;
                }else{
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}
const initApp = () => {
    //GET DATA FROM JSON
    fetch('assets/products.json')
    .then(response=>response.json())
    .then(data => {
        listProducts = data;
        console.log(listProducts);
        addDataToHTML();

        //GET DATA FROM MEMORY
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
    
}
initApp();
