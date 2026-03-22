'use client'
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
    const router = useRouter();
    const [search, setSearch] = useState('')
    const [menuOpen, setMenuOpen] = useState(false)
    const cartCount = useSelector(state => state.cart.total)
    const { data: session } = useSession();

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
        setMenuOpen(false)
    }

    return (
        <nav className="relative bg-white z-50">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
                    <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                        <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/">About</Link>
                        <Link href="/">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        {session ? (
                            <div className="flex items-center gap-3">
                                <img src={session.user.image} alt="avatar" className="size-8 rounded-full" />
                                <span className="text-sm text-slate-700">{session.user.name}</span>
                                <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-full text-sm">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => signIn("google")} className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile Right Side */}
                    <div className="sm:hidden flex items-center gap-3">
                        <Link href="/cart" className="relative text-slate-600">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-1 -right-1 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">{cartCount}</span>
                        </Link>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-600">
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 px-6 py-4 flex flex-col gap-4 text-slate-600">
                    <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
                    <Link href="/" onClick={() => setMenuOpen(false)}>About</Link>
                    <Link href="/" onClick={() => setMenuOpen(false)}>Contact</Link>

                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
                        <Search size={16} className="text-slate-600" />
                        <input className="w-full bg-transparent outline-none placeholder-slate-600 text-sm" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                    </form>

                    {session ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img src={session.user.image} alt="avatar" className="size-8 rounded-full" />
                                <span className="text-sm">{session.user.name}</span>
                            </div>
                            <button onClick={() => { signOut(); setMenuOpen(false) }} className="px-4 py-1.5 bg-red-500 text-white rounded-full text-sm">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => { signIn("google"); setMenuOpen(false) }} className="w-full py-2 bg-indigo-500 text-white rounded-full text-sm">
                            Login with Google
                        </button>
                    )}
                </div>
            )}

            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar