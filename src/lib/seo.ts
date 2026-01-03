import type { Metadata } from "next"

const SITE_NAME = "Strivio"
const SITE_DESCRIPTION = "The premium marketplace for digital products, scripts, and templates."
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://strivio.world"

export function generateSeo({
    title,
    description = SITE_DESCRIPTION,
    image,
    noIndex = false,
}: {
    title: string
    description?: string
    image?: string
    noIndex?: boolean
}): Metadata {
    const fullTitle = `${title} | ${SITE_NAME}`

    return {
        title: fullTitle,
        description,
        openGraph: {
            title: fullTitle,
            description,
            url: SITE_URL,
            siteName: SITE_NAME,
            locale: "en_US",
            type: "website",
            images: image ? [{ url: image }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: image ? [image] : [],
        },
        robots: noIndex
            ? {
                index: false,
                follow: false,
            }
            : {
                index: true,
                follow: true,
            },
        metadataBase: new URL(SITE_URL),
    }
}
