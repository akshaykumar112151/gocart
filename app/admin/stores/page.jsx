'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import Pagination from "@/components/Pagination"
import { Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const ITEMS_PER_PAGE = 6

export default function AdminStores() {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    const fetchStores = async () => {
        try {
            const res = await fetch('/api/admin/stores')
            const data = await res.json()
            if (data.success) {
                setStores(data.stores.filter(s => s.isActive))
            }
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    const toggleIsActive = async (storeId) => {
        try {
            const store = stores.find(s => s.id === storeId)
            const res = await fetch('/api/admin/approve-store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storeId, status: store.isActive ? 'rejected' : 'approved' })
            })
            const data = await res.json()
            if (data.success) {
                setStores(stores.map(s => s.id === storeId ? { ...s, isActive: !s.isActive } : s))
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (storeId) => {
        if (!confirm("Are you sure you want to delete this store?")) return;
        try {
            const res = await fetch('/api/admin/delete-store', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storeId })
            })
            const data = await res.json()
            if (data.success) {
                setStores(prev => prev.filter(s => s.id !== storeId))
                toast.success("Store deleted!")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    const totalPages = Math.ceil(stores.length / ITEMS_PER_PAGE)
    const paginatedStores = stores.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Live <span className="text-slate-800 font-medium">Stores</span></h1>
            {stores.length ? (
                <>
                    <div className="flex flex-col gap-4 mt-4">
                        {paginatedStores.map((store) => (
                            <div key={store.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl">
                                <StoreInfo store={store} />
                                <div className="flex items-center gap-3 pt-2 flex-wrap">
                                    <p>Active</p>
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                        <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleIsActive(store.id), { loading: "Updating..." })} checked={store.isActive} />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                    <button onClick={() => handleDelete(store.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition">
                                        <Trash2Icon size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">No stores Available</h1>
                </div>
            )}
        </div>
    ) : <Loading />
}