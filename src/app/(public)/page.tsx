import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
    return (
        <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background-default text-center">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tighter text-text-primary sm:text-5xl md:text-6xl/none lg:text-7xl">
                            The Premium Marketplace for <span className="text-brand-primary">Digital Creators</span>
                        </h1>
                        <p className="mx-auto max-w-[600px] text-text-secondary md:text-xl">
                            Buy and sell high-quality scripts, templates, and design assets. Built for quality, speed, and security.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                        <Link href="/marketplace">
                            <Button size="lg" className="h-12 px-8">
                                Browse Marketplace
                            </Button>
                        </Link>
                        <Link href="/sell">
                            <Button size="lg" variant="outline" className="h-12 px-8 border-border-default text-text-primary hover:bg-background-surface hover:text-text-primary">
                                Start Selling
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
