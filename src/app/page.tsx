"use client";

import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.scss";

const getHostnameLogin = () => {
    const hostname = document.location.hostname;
    const split = hostname.split(".");
    if (split.length === 4 && hostname.startsWith("is.") && hostname.endsWith(".logged.fr")) return split[1];
    if (split.length === 4 && hostname.endsWith(".is.logged.fr")) return split[0];
    if (split.length === 3 && hostname.endsWith(".logged.fr")) return split[0];
    return null;
};

export default function Home() {
    const searchParams = useSearchParams();
    const [login, setLogin] = useState(searchParams.get("login") ?? "norminet");
    const [location, setLocation] = useState<{ host: string | null; startTime: string | null } | null>(null);

    useEffect(() => {
        const hostnameLogin = getHostnameLogin();
        if (hostnameLogin && login !== hostnameLogin) {
            setLogin(hostnameLogin);
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
            if (location.host) document.title = login + " is logged at " + location.host;
            else document.title = login + " is not logged";
        })();
    }, [login]);

    if (!location) return <h3>Loading... (our intra might be slow)</h3>;
    if (!location.host) return <h1>{login} is not logged</h1>;
    return (
        <>
            <h1>
                {login} is logged at {location.host}
            </h1>
            <h3>Since {moment(location.startTime).format("DD/MM/YYYY HH:mm:ss")}</h3>
        </>
    );
}
