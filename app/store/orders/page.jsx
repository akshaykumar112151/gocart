'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import Pagination from "@/components/Pagination"

const ITEMS_PER_PAGE = 6

export default function StoreOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/store/orders")
            const data = await res.json()
            if (data.success) setOrders(data.orders)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const updateOrderStatus = async (orderId, status) => {
        try {
            const res = await fetch("/api/store/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status })
            })
            const data = await res.json()
            if (data.success) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
            }
        } catch (error) {
            console.error(error)
        }
    }

    const openModal = (order) => { setSelectedOrder(order); setIsModalOpen(true) }
    const closeModal = () => { setSelectedOrder(null); setIsModalOpen(false) }

    useEffect(() => { fetchOrders() }, [])

    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE)
    const paginatedOrders = orders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Store <span className="text-slate-800 font-medium">Orders</span></h1>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <>
                    {/* Mobile Card Layout */}
                    <div className="sm:hidden flex flex-col gap-3">
                        {paginatedOrders.map((order, index) => (
                            <div key={order.id} onClick={() => openModal(order)} className="border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-green-600 font-medium">#{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>
                                    <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-700 font-medium">{order.user?.name}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-slate-800 font-medium">${order.total}</span>
                                    <span className="text-xs text-slate-500">{order.paymentMethod}</span>
                                    {order.isCouponUsed && (
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{order.coupon?.code}</span>
                                    )}
                                </div>
                                <div className="mt-2" onClick={e => e.stopPropagation()}>
                                    <select
                                        value={order.status}
                                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                                        className="border border-gray-300 rounded-md text-xs p-1 w-full"
                                    >
                                        <option value="ORDER_PLACED">ORDER_PLACED</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="SHIPPED">SHIPPED</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden sm:block overflow-x-auto max-w-4xl rounded-md shadow border border-gray-200">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
                                <tr>
                                    {["Sr. No.", "Customer", "Total", "Payment", "Coupon", "Status", "Date"].map((h, i) => (
                                        <th key={i} className="px-4 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedOrders.map((order, index) => (
                                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openModal(order)}>
                                        <td className="pl-6 text-green-600">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                        <td className="px-4 py-3">{order.user?.name}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">${order.total}</td>
                                        <td className="px-4 py-3">{order.paymentMethod}</td>
                                        <td className="px-4 py-3">
                                            {order.isCouponUsed ? (
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{order.coupon?.code}</span>
                                            ) : "—"}
                                        </td>
                                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                            <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)} className="border-gray-300 rounded-md text-sm">
                                                <option value="ORDER_PLACED">ORDER_PLACED</option>
                                                <option value="PROCESSING">PROCESSING</option>
                                                <option value="SHIPPED">SHIPPED</option>
                                                <option value="DELIVERED">DELIVERED</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            )}

            {/* Modal */}
            {isModalOpen && selectedOrder && (
                <div onClick={closeModal} className="fixed inset-0 flex items-center justify-center bg-black/50 text-slate-700 text-sm backdrop-blur-xs z-50">
                    <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">Order Details</h2>
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Customer Details</h3>
                            <p><span className="text-green-700">Name:</span> {selectedOrder.user?.name}</p>
                            <p><span className="text-green-700">Email:</span> {selectedOrder.user?.email}</p>
                            <p><span className="text-green-700">Phone:</span> {selectedOrder.address?.phone}</p>
                            <p><span className="text-green-700">Address:</span> {`${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.state}, ${selectedOrder.address?.zip}, ${selectedOrder.address?.country}`}</p>
                        </div>
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Products</h3>
                            <div className="space-y-2">
                                {selectedOrder.orderItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 border border-slate-100 shadow rounded p-2">
                                        <img src={item.product.images?.[0]?.src || item.product.images?.[0]} alt={item.product?.name} className="w-16 h-16 object-cover rounded" />
                                        <div className="flex-1">
                                            <p className="text-slate-800">{item.product?.name}</p>
                                            <p>Qty: {item.quantity}</p>
                                            <p>Price: ${item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <p><span className="text-green-700">Payment:</span> {selectedOrder.paymentMethod}</p>
                            <p><span className="text-green-700">Paid:</span> {selectedOrder.isPaid ? "Yes" : "No"}</p>
                            {selectedOrder.isCouponUsed && (
                                <p><span className="text-green-700">Coupon:</span> {selectedOrder.coupon.code} ({selectedOrder.coupon.discount}% off)</p>
                            )}
                            <p><span className="text-green-700">Status:</span> {selectedOrder.status}</p>
                            <p><span className="text-green-700">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={closeModal} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}