'use client'
import { usePathname } from "next/navigation"
import { HomeIcon, ShieldCheckIcon, StoreIcon, TicketPercentIcon } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

const AdminSidebar = () => {
    const pathname = usePathname()
    const { data: session } = useSession()

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Stores', href: '/admin/stores', icon: StoreIcon },
        { name: 'Approve Store', href: '/admin/approve', icon: ShieldCheckIcon },
        { name: 'Coupons', href: '/admin/coupons', icon: TicketPercentIcon },
    ]

    return (
        <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60">
            <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
                {session?.user?.image ? (
                    <img className="w-14 h-14 rounded-full" src={session.user.image} alt="" />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xl font-bold">
                        {session?.user?.name?.charAt(0)}
                    </div>
                )}
                <p className="text-slate-700">Hi, {session?.user?.name?.split(' ')[0]}</p>
            </div>

            <div className="max-sm:mt-6">
                {sidebarLinks.map((link, index) => (
                    <Link key={index} href={link.href} className={`relative flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-2.5 transition ${pathname === link.href && 'bg-slate-100 sm:text-slate-600'}`}>
                        <link.icon size={18} className="sm:ml-5" />
                        <p className="max-sm:hidden">{link.name}</p>
                        {pathname === link.href && <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default AdminSidebar