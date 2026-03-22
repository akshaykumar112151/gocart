'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useDispatch } from "react-redux";
import { setRatings } from "@/lib/features/rating/ratingSlice";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const dispatch = useDispatch();

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/order/my-orders')
            const data = await res.json()
            if (data.success) {
                setOrders(data.orders)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchRatings = async () => {
        try {
            const res = await fetch('/api/rating/my-ratings')
            const data = await res.json()
            if (data.success) {
                dispatch(setRatings(data.ratings))
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Cancel hone par status update karo locally
    const handleCancel = (orderId) => {
        setOrders(prev =>
            prev.map(o => o.id === orderId ? { ...o, status: "CANCELLED" } : o)
        )
    }

    // Delete hone par order list se hatao
    const handleDelete = (orderId) => {
        setOrders(prev => prev.filter(o => o.id !== orderId))
    }

    useEffect(() => {
        fetchOrders()
        fetchRatings()
    }, []);

    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                <div className="my-20 max-w-7xl mx-auto">
                    <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText={'Go to home'} />
                    <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                        <thead>
                            <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                <th className="text-left">Product</th>
                                <th className="text-center">Total Price</th>
                                <th className="text-left">Address</th>
                                <th className="text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <OrderItem
                                    order={order}
                                    key={order.id}
                                    onCancel={handleCancel}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">You have no orders</h1>
                </div>
            )}
        </div>
    )
}