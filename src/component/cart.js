import { Card } from 'evergreen-ui';
import React from 'react';


// biến lưu trữ giá trị của giỏ hàng
let cart = [];

// hàm thêm sản phẩm vào giỏ hàng
function addToCart(product) {
   let isExist = false;
    cart.forEach((item) => {
        if (item.id === product.item.id) {
            item.amount++;
            isExist = true;
        }
    }
    );
    if (!isExist) {
        cart.push(product);
    }

    // lưu giỏ hàng, không mất dữ liệu khi reload trang
    localStorage.setItem('cart', JSON.stringify(cart));
}

// hàm xóa sản phẩm khỏi giỏ hàng
function removeItem(id) {
    // lấy giá trị của giỏ hàng từ localStorage
    cart = JSON.parse(localStorage.getItem('cart'));
    cart.forEach((item, index) => {
        // nếu sản phẩm có id trùng với id truyền vào thì trừ số lượng sản phẩm đi 1
        if (item.id === id) {
            item.amount--;
            // nếu số lượng sản phẩm bằng 0 thì xóa sản phẩm khỏi giỏ hàng
            if (item.amount === 0) {
                cart.splice(index, 1);
            }
        }
    });

    // lưu giỏ hàng, không mất dữ liệu khi reload trang và tắt máy
    // localStorage.setItem('cart', JSON.stringify(cart));

}

// hàm hiển thị giỏ hàng
function showCart() {
    // lấy giá trị của giỏ hàng từ localStorage
    // cart = JSON.parse(localStorage.getItem('cart'));
    // console.log(cart);
    return cart;
}

export { addToCart, showCart, cart, removeItem };

