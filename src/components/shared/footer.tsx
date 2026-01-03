import Link from "next/link"

export default function Footer() {
    return (
        <footer className="border-t border-border-default bg-background-surface py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-text-tertiary md:text-left">
                        Built by{" "}
                        <a
                            href="https://twitter.com/shaswatraj"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            Shaswat
                        </a>
                        . The source code is available on{" "}
                        <a
                            href="https://github.com/shaswatraj/strivio"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            GitHub
                        </a>
                        .
                    </p>
                </div>
            </div>
        </footer>
    )
}
