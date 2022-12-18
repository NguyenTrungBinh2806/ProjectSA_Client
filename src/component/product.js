import React from 'react'; 
import './product.css';
import db from '../environment/firebase';
import { getDocs, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { Button, ShoppingCartIcon, Dialog, EyeOpenIcon, toaster, Select } from 'evergreen-ui';
import { addToCart, showCart, removeItem, cart } from './cart';
import { async } from '@firebase/util';
function Product(){
    const [product, setProduct] = React.useState([]);
    const getProduct = () => {
        const proRef = collection(db, "items");
        const data = [];
        getDocs(proRef).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
            setProduct(data);
        });
        // console.log(product);
        console.log('a');
    }

    const [view, setView] = React.useState({});

    const [isShown, setIsShown] = React.useState(false);

    const [isShown1, setIsShown1] = React.useState(false);

    const [amount, setAmount] = React.useState(0);

    React.useEffect(() => {
        getProduct();
        
    }, [])

    const [customerPhone, setCustomerPhone] = React.useState('');
    const [checkValue, setCheckValue] = React.useState(false);
    const [customerName, setCustomerName] = React.useState('');
    const [isShown2, setIsShown2] = React.useState(false);
    const [isShown3, setIsShown3] = React.useState(false);
    const [customerId, setCustomerId] = React.useState('');
    const [deliveryAddress, setDeliveryAddress] = React.useState('');
    const [customerOrderList, setCustomerOrderList] = React.useState([]);
    const checkCustomer = async () => {
        const cusRef = collection(db, "customer");
        const data = [];
        await getDocs(cusRef).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
        });
       
        let check = false;
        let id = '';
        let name = '';
        let orderList = [];

        data.forEach((item) => {
            if (item.phone === customerPhone) {
                check = true;
                id = item.id;
                name = item.name;
                orderList = item.orderList;

            }
        }
        );
        setCustomerId(id);
        setCustomerName(name);
        setCheckValue(check);
        setCustomerOrderList(orderList);
        console.log(check);
           
    }

    const createOrder = async () => {
        if(customerPhone === ''){
            toaster.danger('enter phone number');
        }
        else{
            if (checkValue === true) {
                if(deliveryAddress === ''){
                    toaster.danger('enter delivery address');
                    document.getElementById('deliveryAddress').focus();
                    document.getElementById('deliveryAddress').style.border = '1px solid red';
                }else{
                    const docId = Date.now().toString();
                const orderRef = doc(db, "order", docId);
                await setDoc(orderRef, {
                    id: docId,
                    cusID: customerId,
                    createdAt: new Date().toLocaleDateString(),
                    deliveryAddress: deliveryAddress,
                    state: false,
                    items: showCart().map((item) => {
                        return {
                            id: item.id,
                            amount: item.amount
                        }
                    }),
                    total: showCart().reduce((total, item) => {
                        return total + item.item.price * item.amount;
                    }, 0)

                });
                // update orderList array trong customer
                const cusRef = doc(db, "customer", customerId);
                await updateDoc(cusRef, {
                    orderList: [...customerOrderList, docId]
                });
                // clear cart in local storage
                // localStorage.removeItem('cart');
                setIsShown3(false);
                setIsShown2(false);
                toaster.success('order success');
            }



            }else{
                toaster.danger('phone number is not exist');
            }
        }
    }



    const [customerExist, setCustomerExist] = React.useState(false);
    // const create a customer
    const createCustomer = async () => {
        
        if(customerPhone === '' || customerName === ''){
            toaster.danger('Please fill out all the fields');
        }else{
            const cusRef = collection(db, "customer");
            const customerData = []
            // if phone is exist cannot create
            await getDocs(cusRef).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    customerData.push(doc.data());
                });
            });
            let isExist = false;
             customerData.forEach((item) => {
                if (item.phone === customerPhone) {
                    isExist = true;
                    toaster.danger('Phone number is exist');
                }
            });
            if (isExist === false){
                const docId = Date.now().toString();
                        const cusRef = doc(db, "customer", docId);
                        await setDoc(cusRef, {
                            id: docId,
                            name: customerName,
                            phone: customerPhone,
                            createdAt: new Date().toLocaleDateString(),
                            orderList: []
                        });
                        toaster.success('Sign up successfully');
                        setCustomerName('');
                        setCustomerPhone('');
                        setIsShown3(false);
                        setIsShown1(false);
                        setIsShown2(false);
                    }
            }
        
    }

    // const createCustomerMain = async () => {
    //         await createCustomer();
    //         if(customerExist === false){
    //             const docId = Date.now().toString();
    //                     const cusRef = doc(db, "customer", docId);
    //                     setDoc(cusRef, {
    //                         id: docId,
    //                         name: customerName,
    //                         phone: customerPhone,
    //                         createAt: new Date().toLocaleDateString(),
    //                         orderList: []
    //                     });
    //                     toaster.success('Sign up successfully');
    //                     setIsShown1(false);
    //                     setIsShown2(false);
    //                 }
    // }
    const [category, setCategory] = React.useState([]);
    const getCategory = async () => {
        const categoryRef = collection(db, "type");
        const data = [];
        await getDocs(categoryRef).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
        });
        console.log(data);
        setCategory(data);
    }

    React.useEffect(() => {
        getCategory();
    }, []);

    // get product with category id
    const getProductWithCategory = async (id) => {   
        if(id ==='all'){
            getProduct();
        }else{
            const productRef = collection(db, "items");
        const data = [];
        await getDocs(productRef).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
                // console.log(doc.data());
            });
        });
        const result = data.filter((item) => item.type === id);
        setProduct(result);
    }  
    }

    const getProductWithPrice = async (price) => {
        if(price === 'all'){
            getProduct();
        }else{
            const productRef = collection(db, "items");
            const data = [];
            await getDocs(productRef).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    data.push(doc.data());
                    // console.log(doc.data());
                });
            });
            const result = data.filter((item) => item.price <= price);
            setProduct(result);
        }
    }


       
    return (
        <div className="product">
            <div className='product-header'>
                <div className='Select-category' style={{ marginLeft: '50px', display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '10px' }}>
                        <h4 style={{ color: 'white' }}>Category</h4>
                    </label>
                    <Select className="select-category" onChange={(e) => getProductWithCategory(e.target.value)} >
                    <option value="all" selected>All</option>
                    {
                        category.map((item) => {
                            return (
                                <option value={item.id}>{item.name}</option>
                            )
                        })
                    }
                    </Select>
                </div>
                <div className='Select-price' style={{ marginLeft: '100px', display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '10px' }}>
                        <h4 style={{ color: 'white' }}>Price</h4>
                    </label>
                    <Select className="select-price" onChange={(e) => getProductWithPrice(e.target.value)} >
                        <option value="all" selected>All</option>
                        <option value="100000">Less than 100,000 VND</option>
                        <option value="200000">Less than 200,000 VND</option>
                        <option value="300000">Less than 300,000 VND</option>
                        <option value="400000">Less than 400,000 VND</option>
                        <option value="500000">Less than 500,000 VND</option>
                    </Select>
                </div>
            </div>
            <button className="product-shopping-cart" style={{ border: 'none', backgroundColor: 'white' }} onClick={() => setIsShown1(true)}>
                <ShoppingCartIcon size={30} color="info" />
                 <span style={{color: 'white', backgroundColor: 'red'}}>
                    {showCart().reduce((total, item) => total + item.amount, 0)}
                </span>
                
            </button>
            <div className="product-list">
                {/* <div className="product-list-item">
                    <div className="product-list-item-image">
                        <img src="https://images.unsplash.com/photo-1617672700003-8b8b1b2b1b1a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="product" />
                    </div>
                    <div className="product-list-item-info">
                        <div className="product-list-item-info-name">
                            <h3>Product Name</h3>
                        </div>
                        <div className="product-list-item-info-price">
                            <h3>Price</h3>
                        </div>
                    </div>
                    <div className="product-list-item-action">
                        <button>Add to Cart</button>
                    </div>
                </div> */}
                {
                    product.map((item, index) => {
                        // if product.state = true => show product
                        if (item.state === true) {
                            return (
                                <div className="product-list-item" key={index}>
                                    <div className="product-list-item-image" onClick={() => { setView(item); setIsShown(true) }} style={{ cursor: 'pointer' }}>
                                        <img src={item.imageUrl} alt="product" className='product-image' />
                                    </div>
                                    <div className="product-list-item-info">
                                        <div className="product-list-item-info-name" onClick={() => { setView(item); setIsShown(true) }} style={{ cursor: 'pointer' }}>
                                            <h4>
                                                {/* if name is too long, then show only 20 characters */}
                                                {item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name}
                                            </h4>
                                        </div>
                                        <div className="product-list-item-info-price">
                                            <h4 style={{ color: 'red', cursor: 'pointer' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="product-list-item-action">
                                        {/* add to card with item and quatity */}
                                        <Button onClick={() => {addToCart({ item, amount: 1, id: item.id })}} appearance="primary" intent="success" iconAfter={ShoppingCartIcon}>Add to Cart</Button>
                                        {/* <button onClick={showCart}>Show Cart</button>
                                        <button onClick={() => removeItem(item.id)}>Remove</button> */}
                                        
                                        <Button onClick={() => { setView(item); setIsShown(true) }} appearance="primary" intent="warning" iconAfter={EyeOpenIcon} marginTop={10}>View</Button>
                                    </div>
                                </div>
                            )
                        }
                        else{
                            return null;
                        }
                    })
                }

            
                
                
                
            </div>
            <Dialog
                isShown={isShown}
                title={view.name}
                onCloseComplete={() => setIsShown(false)}
                hasFooter={false}
                hasHeader={false}
                preventBodyScrolling
                // shouldCloseOnOverlayClick={false}
                // shouldCloseOnEscapePress={false}
            >
                <div className="product-view">
                    <div className="product-view-image">
                        <img src={view.imageUrl} alt="product" style={{ width: '500px', height: '400px', textAlign: 'center' }} />
                    </div>
                    <div className="product-view-info">
                        <div className="product-view-info-name">
                            <h3>{view.name}</h3>
                        </div>
                        <div className="product-view-info-price">
                            <h3 style={{color: 'red'}}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(view.price)}</h3>
                            <Button onClick={() => addToCart({ item: view, amount: 1, id: view.id })} appearance="primary" intent="success" iconAfter={ShoppingCartIcon}>Add to Cart</Button>
                        </div>
                        <div className="product-view-info-description">
                            <div dangerouslySetInnerHTML={{ __html: view.description }}></div>
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* dialog of cart */}
            <Dialog
                isShown={isShown1}
                title="Cart"
                onCloseComplete={() => setIsShown1(false)}
                hasFooter={false}
                // hasHeader={false}
                preventBodyScrolling
                width={900}
                // shouldCloseOnOverlayClick={false}
                // shouldCloseOnEscapePress={false}
            >
                <div className="product-cart">
                    <div className="product-cart-list">
                    {
                            showCart().map((item, index) => {
                                return (
                                    <div className="product-cart-list-item" key={index}>
                                        <table width={800}>
                                            <tr>
                                                <td width={200}>
                                                    <img src={item.item.imageUrl} alt="product" style={{ width: '80px', height: '80px' }} />
                                                </td>
                                                <td style={{ width: '250px' }}>
                                                    <p>{item.item.name}</p>
                                                </td>
                                                <td width={200}>
                                                    <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.item.price)}</p>
                                                </td>
                                                {/* <td>
                                                    <p>{item.amount}</p>
                                                </td> */}
                                                <td style={{ display: 'flex', flexDirection: 'row', marginTop: '30px' }}>
                                                   <button onClick={() => {removeItem(item.id); setIsShown1(false)}}>-</button>
                                                   <p style={{ margin: '0 10px 0 10px' }}>{item.amount}</p>
                                                    <button onClick={() => {addToCart(item); setIsShown1(false)}}>+</button>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                )
                            })
                        }
                        {/* tỏng tiền sản phẩm trong giỏ hàng */}
                        <div className="product-cart-total">
                            <h3>Total: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(showCart().reduce((total, item) => total + item.item.price * item.amount, 0))}</h3>
                        </div>
                    </div>
                    <div className="product-cart-action">
                        <Button appearance="primary" intent="success" iconAfter={ShoppingCartIcon} onClick={() => setIsShown2(true)}>Continue Shopping</Button>
                    </div>
                </div>
            </Dialog>

            {/* dialog of cart */}
            <Dialog
                isShown={isShown2}
                title="Order"
                onCloseComplete={() => setIsShown2(false)}
                hasFooter={false}
                // hasHeader={false}
                preventBodyScrolling
                width={900}
                >
                <div className="product-order">
                    <div className="product-order-customer">
                        <div className="product-order-customer-info">
                            <input type="text" placeholder="phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="input"  style={{ width: '60%', height: '30px' }} />
                            <Button appearance="primary" intent="success" onClick={() => checkCustomer()} height={35}>Confirm phone</Button>
                            <p style={{ color: 'green' }}>{customerName}</p>
                            {
                                customerName.length === 0 ? <button onClick={() => setIsShown3(true)} style={{ border: 'none', cursor: 'pointer' }}>Sign in a member?</button> : null
                            }
                            {/* input delivery address */}
                            <input type="text" placeholder="delivery address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="input" style={{ marginTop: '10px', width: '100%', height: '30px' }} id="deliveryAddress" />
                        </div>
                        <table width={800}>
                            {
                                showCart().map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td width={200}>
                                                <p>{item.item.name.length > 18 ? item.item.name.slice(0, 18) + '...' : item.item.name}</p>
                                            </td>
                                            <td width={200}>
                                                <p>Price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.item.price)}</p>
                                            </td>
                                            <td width={200}>
                                                <p>Quantity: {item.amount}</p>
                                            </td>
                                            <td width={200}>
                                                <p>Total price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.item.price * item.amount)}</p>
                                            </td>
                                        </tr>
                                    )
                                })

                            }
                            <h3>Total: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(showCart().reduce((total, item) => total + item.item.price * item.amount, 0))}</h3>

                        </table>
                        <Button appearance="primary" intent="success" onClick={() => createOrder()}>Create Order</Button>


                    </div>
                </div>
                </Dialog>

                {/* dialog for create customer */}
                <Dialog
                isShown={isShown3}
                title="Create Customer"
                onCloseComplete={() => setIsShown3(false)}
                onConfirm={() => createCustomer()}
                confirmLabel="Sign in"
                >
                <div className="product-order">
                    <div className="product-order-customer">
                        <label htmlFor="name">Name</label>
                        <br/>
                        <input type="text" placeholder="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="input" />
                        <br/>
                        <label htmlFor="phone">Phone</label>
                        <br/>
                        <input type="text" placeholder="phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="input" />
                        <br/>
                    </div>
                </div>
                </Dialog>





        </div>
    )
}

export default Product;