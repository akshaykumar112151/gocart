'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);
    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                cartArray.push({ ...product, quantity: value });
                setTotalPrice(prev => prev + product.price * value);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-4 sm:mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto">
                <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />

                <div className="flex items-start justify-between gap-5 max-lg:flex-col">

                    {/* Mobile Cart List */}
                    <div className="w-full max-w-4xl sm:hidden flex flex-col gap-4">
                        {cartArray.map((item, index) => (
                            <div key={index} className="flex gap-3 border border-slate-100 rounded-lg p-3 shadow-sm">
                                <div className="flex items-center justify-center bg-slate-100 rounded-md w-20 h-20 shrink-0">
                                    <Image src={item.images[0]} className="h-14 w-auto" alt="" width={45} height={45} />
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium">{item.name}</p>
                                            <p className="text-xs text-slate-500">{item.category}</p>
                                            <p className="text-sm">{currency}{item.price}</p>
                                        </div>
                                        <button onClick={() => handleDeleteItemFromCart(item.id)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-full">
                                            <Trash2Icon size={16} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <Counter productId={item.id} />
                                        <p className="text-sm font-medium">{currency}{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table */}
                    <table className="hidden sm:table w-full max-w-4xl text-slate-600 table-auto">
                        <thead>
                            <tr>
                                <th className="text-left">Product</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th className="max-md:hidden">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartArray.map((item, index) => (
                                <tr key={index} className="space-x-2">
                                    <td className="flex gap-3 my-4">
                                        <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                            <Image src={item.images[0]} className="h-14 w-auto" alt="" width={45} height={45} />
                                        </div>
                                        <div>
                                            <p>{item.name}</p>
                                            <p className="text-xs text-slate-500">{item.category}</p>
                                            <p>{currency}{item.price}</p>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <Counter productId={item.id} />
                                    </td>
                                    <td className="text-center">{currency}{(item.price * item.quantity).toLocaleString()}</td>
                                    <td className="text-center max-md:hidden">
                                        <button onClick={() => handleDeleteItemFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all">
                                            <Trash2Icon size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <OrderSummary totalPrice={totalPrice} items={cartArray} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
        </div>
    )
}