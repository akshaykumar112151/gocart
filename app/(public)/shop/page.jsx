'use client'
import { Suspense } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { useState } from "react"

function ShopContent() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const [selectedCategory, setSelectedCategory] = useState("All")

    const products = useSelector(state => state.product.list)

    // Dynamic categories from products
    const CATEGORIES = ["All", ...new Set(products.map(p => p.category))]

    const filteredProducts = products.filter(product => {
        const matchesSearch = search
            ? product.name.toLowerCase().includes(search.toLowerCase())
            : true
        const matchesCategory = selectedCategory === "All"
            ? true
            : product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="max-w-7xl mx-auto">
                <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer">
                    {search && <MoveLeftIcon size={20} />} All <span className="text-slate-700 font-medium">Products</span>
                </h1>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm border transition ${
                                selectedCategory === cat
                                    ? 'bg-green-500 text-white border-green-500'
                                    : 'bg-white text-slate-600 border-slate-300 hover:border-green-400'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-60 text-slate-400">
                        <p className="text-xl">No products found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function Shop() {
    return (
        <Suspense fallback={<div>Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    )
}