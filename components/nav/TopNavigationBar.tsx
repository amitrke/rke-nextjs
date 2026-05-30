import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "../../firebase/useUser";
import { useAdminStatus } from "../../firebase/useAdminStatus";

export default function TopNavigationBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3">
                <Link href="/" className="flex items-center gap-2 text-base font-semibold text-slate-900">
                    <Image src="/icon.png" alt="Roorkee.org logo" width={32} height={32} style={{ borderRadius: 6 }} />
                    <span>Roorkee.org</span>
                </Link>

                <button
                    type="button"
                    onClick={() => setIsOpen((value) => !value)}
                    aria-expanded={isOpen}
                    aria-controls="site-nav-mobile"
                    className="ml-auto inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 md:hidden"
                >
                    Menu
                </button>

                <nav id="site-nav" className="ml-4 max-md:hidden md:flex md:flex-1 md:items-center md:justify-between">
                    <div className="flex items-center gap-1">
                        <NavLink href="/" label="Home" />
                        <NavLink href="/posts" label="Posts" />
                        <NavLink href="/news/1" label="News" />
                        <NavLink href="/events" label="Events" />
                        <NavLink href="/albums" label="Albums" />
                        <NavLink href="/contact" label="Contact" />
                    </div>
                    <div className="ml-4 flex items-center">
                        <UserInfo />
                    </div>
                </nav>
            </div>

            {isOpen && (
                <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden" id="site-nav-mobile">
                    <div className="flex flex-col gap-1">
                        <NavLink href="/" label="Home" onClick={() => setIsOpen(false)} />
                        <NavLink href="/posts" label="Posts" onClick={() => setIsOpen(false)} />
                        <NavLink href="/news/1" label="News" onClick={() => setIsOpen(false)} />
                        <NavLink href="/events" label="Events" onClick={() => setIsOpen(false)} />
                        <NavLink href="/albums" label="Albums" onClick={() => setIsOpen(false)} />
                        <NavLink href="/contact" label="Contact" onClick={() => setIsOpen(false)} />
                    </div>
                    <div className="mt-3 border-t border-slate-100 pt-3">
                        <UserInfo onNavigate={() => setIsOpen(false)} />
                    </div>
                </nav>
            )}
        </header>
    )
}

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
            {label}
        </Link>
    );
}

function UserInfo({ onNavigate }: { onNavigate?: () => void }) {
    const { user } = useUser();
    const { isAdmin } = useAdminStatus();

    if (user) {
        return (
            <div className="flex flex-col gap-1 lg:flex-row lg:items-center">
                <Link
                    href="/myaccount"
                    onClick={onNavigate}
                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                    My Account
                </Link>
                {isAdmin && (
                    <Link
                        href="/account/moderation"
                        onClick={onNavigate}
                        className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                        Moderation
                    </Link>
                )}
            </div>
        );
    } else {
        return (
            <Link
                href="/auth"
                onClick={onNavigate}
                className="inline-flex rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
                Login
            </Link>
        );
    }
}
