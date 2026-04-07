import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency=import.meta.VITE_CURRENCY;
    const navigate = useNavigate();   
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin,setshowUserLogin ] = useState(false);
    const [products,setProducts ] = useState([]);
    const [cartItems,setcartItems ] = useState({});
    
    // fetch all product
    const fetchProducts=async()=>{
        setProducts(dummyProducts)
    }
//   add product to cart
const addToCart = (itemId)=>{
    let cartData = structuredClone(cartItems);
    if(cartData[itemId]){
        cartData[itemId]+=1;
    }
    else{
        cartData[itemId]=1;
    }
    setcartItems(cartData);
    toast.success("Added to Cart")
}
// update cart item quantity
const updateCartItem=(itemId,quantity)=>{
    let cartData=structuredClone(cartItems);
    cartData[itemId]=quantity;
    setcartItems(cartData)
    toast.success("Cart Updated")
}

// remove product from cart
const removeFromCart=(itemId)=>{
    let cartData=structuredClone(cartItems);
    if(cartData[itemId]){
        cartData[itemId]-=1;
        if(cartData[itemId]==0){
            delete cartData[itemId];
        }
    }
    toast.success("Removed from cart");
    setcartItems(cartData)
}

     useEffect(()=>{
        fetchProducts()
     },[])

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setshowUserLogin,
        products,
        currency,
        addToCart,
        updateCartItem,
        removeFromCart,
        cartItems


    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};


export const useAppContext = () => {
    return useContext(AppContext);
};





