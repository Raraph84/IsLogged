import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "is.login.logged.fr"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Suspense>{children}</Suspense>
            </body>
        </html>
    );
}
