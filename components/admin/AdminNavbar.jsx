'use client'
import Link from "next/link"
import { useSession } from "next-auth/react"

const AdminNavbar = () => {
    const { data: session } = useSession()

    return (
        <div className="flex items-center justify-between px-4 sm:px-12 py-3 border-b border-slate-200 transition-all">
            <Link href="/" className="relative text-3xl sm:text-4xl font-semibold text-slate-700">
                <span className="text-green-600">go</span>cart<span className="text-green-600 text-4xl sm:text-5xl leading-0">.</span>
                <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                    Admin
                </p>
            </Link>
            <div className="flex items-center gap-2">
                {session?.user?.image && (
                    <img src={session.user.image} alt="avatar" className="size-7 sm:size-8 rounded-full" />
                )}
                <p className="text-sm">Hi, {session?.user?.name?.split(' ')[0] || 'Admin'}</p>
            </div>
        </div>
    )
}

export default AdminNavbar