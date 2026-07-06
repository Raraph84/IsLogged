"use client";

import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const searchParams = useSearchParams();
    const [login, setLogin] = useState(searchParams.get("login") ?? "norminet");
    const [location, setLocation] = useState<{ location: string | null; since: string | null } | null>(null);

    useEffect(() => {
        const hostname = document.location.hostname;
        if (
            hostname.split(".").length === 4 &&
            hostname.startsWith("is.") &&
            hostname.endsWith(".logged.fr") &&
            login !== hostname.split(".")[1]
        ) {
            setLogin(hostname.split(".")[1]);
            return;
        }

        (async () => {
            let res;
            try {
                res = await fetch("https://api.raraph.fr/fortytwo/sessions/" + login);
            } catch (error) {
                return;
            }
            if (!res.ok) return;

            const location = await res.json();
            setLocation(location);
            if (location.location) document.title = login + " is logged at " + location.location;
            else document.title = login + " is not logged.";
        })();
    }, [login]);

    if (!location) return <h3>Loading... (our intra might be slow)</h3>;
    if (!location.location) return <h1>{login} is not logged</h1>;
    return (
        <>
            <h1>
                {login} is logged at {location.location}
            </h1>
            <h3>Since {moment(location.since).format("DD/MM/YYYY HH:mm:ss")}</h3>
        </>
    );
}
