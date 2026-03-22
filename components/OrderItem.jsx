'use client'
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";
import toast from "react-hot-toast";

const OrderItem = ({ order, onCancel, onDelete }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);

    const { ratings } = useSelector(state => state.rating);

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this order?")) return;
        try {
            const res = await fetch('/api/order/my-orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order.id })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Order cancelled!");
                onCancel(order.id);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    const handleDelete = async () => {
        if (!confirm("Remove this order from history?")) return;
        try {
            const res = await fetch('/api/order/my-orders', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order.id })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Order removed!");
                onDelete(order.id);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                    <Image
                                        className="h-14 w-auto"
                                        src={item.product.images[0]}
                                        alt="product_img"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">{item.product.name}</p>
                                    <p>{currency}{item.price} Qty : {item.quantity}</p>
                                    <p className="mb-1">{new Date(order.createdAt).toDateString()}</p>
                                    <div>
                                        {ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId)
                                            ? <Rating value={ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId).rating} />
                                            : <button onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })} className={`text-green-500 hover:bg-green-50 transition ${order.status !== "DELIVERED" && 'hidden'}`}>Rate Product</button>
                                        }
                                    </div>
                                    {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center max-md:hidden">{currency}{order.total}</td>

                <td className="text-left max-md:hidden">
                    <p>{order.address.name}, {order.address.street},</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                    <p>{order.address.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div className={`flex items-center justify-center gap-1 rounded-full p-1 ${
                        order.status === 'DELIVERED' ? 'text-green-500 bg-green-100'
                        : order.status === 'CANCELLED' ? 'text-red-500 bg-red-100'
                        : 'text-slate-500 bg-slate-100'
                    }`}>
                        <DotIcon size={10} className="scale-250" />
                        {order.status.split('_').join(' ').toLowerCase()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2">
                        {order.status === "ORDER_PLACED" && (
                            <button
                                onClick={handleCancel}
                                className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                        >
                            Delete
                        </button>
                    </div>
                </td>
            </tr>

            {/* Mobile */}
            <tr className="md:hidden">
                <td colSpan={5}>
                    <p>{order.address.name}, {order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                    <p>{order.address.phone}</p>
                    <br />
                    <div className="flex items-center gap-2">
                        <span className={`text-center px-6 py-1.5 rounded ${
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                            {order.status.replace(/_/g, ' ').toLowerCase()}
                        </span>
                        {order.status === "ORDER_PLACED" && (
                            <button onClick={handleCancel} className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100">
                                Cancel
                            </button>
                        )}
                        <button onClick={handleDelete} className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>

            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>
        </>
    )
}

export default OrderItem