'use client'
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import Pagination from "@/components/Pagination"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon } from "lucide-react"
import { useEffect, useState } from "react"

const ITEMS_PER_PAGE = 6

export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })
    const [currentPage, setCurrentPage] = useState(1)

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Total Revenue', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
    ]

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/admin/dashboard')
            const data = await res.json()
            if (data.success) {
                setDashboardData(data.dashboardData)
            }
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const totalPages = Math.ceil(dashboardData.allOrders.length / ITEMS_PER_PAGE)
    const paginatedOrders = dashboardData.allOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    if (loading) return <Loading />

    return (
        <div className="text-slate-500">
            <h1 className="text-2xl">Admin <span className="text-slate-800 font-medium">Dashboard</span></h1>

            {/* Cards — 2 column mobile, flex desktop */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 my-6">
                {dashboardCardsData.map((card, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 border border-slate-200 p-3 px-4 rounded-lg">
                        <div className="flex flex-col gap-2 text-xs">
                            <p>{card.title}</p>
                            <b className="text-xl sm:text-2xl font-medium text-slate-700">{card.value}</b>
                        </div>
                        <card.icon size={40} className="w-9 h-9 p-2 text-slate-400 bg-slate-100 rounded-full shrink-0" />
                    </div>
                ))}
            </div>

            {/* Area Chart */}
            {dashboardData.allOrders.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-3 sm:p-5 mb-10 max-w-4xl">
                    <OrdersAreaChart allOrders={dashboardData.allOrders} />
                </div>
            )}

            {/* Orders Table */}
            <h2 className="text-xl mt-8 mb-4">Recent <span className="text-slate-800 font-medium">Orders</span></h2>

            {/* Mobile Cards */}
            <div className="sm:hidden flex flex-col gap-3 mb-4">
                {paginatedOrders.map((order, index) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-green-600 font-medium">#{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>
                            <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-800">${order.total}</span>
                            <span className="text-xs text-slate-500">{order.paymentMethod}</span>
                        </div>
                        <div className="mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-700'
                                : order.status === 'CANCELLED' ? 'bg-red-100 text-red-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                                {order.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto max-w-4xl rounded-md shadow border border-gray-200">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
                        <tr>
                            {["Sr. No.", "Order ID", "Total", "Payment", "Status", "Date"].map((h, i) => (
                                <th key={i} className="px-4 py-3">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedOrders.map((order, index) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                <td className="pl-6 text-green-600">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                <td className="px-4 py-3 text-xs text-slate-400">{order.id.slice(0, 10)}...</td>
                                <td className="px-4 py-3 font-medium text-slate-800">${order.total}</td>
                                <td className="px-4 py-3">{order.paymentMethod}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700'
                                        : order.status === 'CANCELLED' ? 'bg-red-100 text-red-700'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    )
}