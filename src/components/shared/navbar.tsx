import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border-default bg-background-overlay backdrop-blur supports-[backdrop-filter]:bg-background-overlay/60">
            <div className="container flex h-14 items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-display font-bold text-xl text-text-primary">Strivio</span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link href="/marketplace" className="text-text-secondary hover:text-text-primary transition-colors">
                        Marketplace
                    </Link>
                    <Link href="/categories" className="text-text-secondary hover:text-text-primary transition-colors">
                        Categories
                    </Link>
                    <Link href="/sell" className="text-text-secondary hover:text-text-primary transition-colors">
                        Become a Seller
                    </Link>
                </nav>
                <div className="ml-auto flex items-center space-x-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link href="/signup">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
