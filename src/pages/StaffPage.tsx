import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {supabase} from "../api/lib/supabase.ts";


export default function StaffPage() {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let mounted = true;

        const checkAuth = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (!mounted) return;

            if (error || !data.session) {
                navigate("/staff-login", { replace: true });
                return;
            }

            setChecking(false);
        };

        checkAuth();

        // ascolta logout / scadenza sessione
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!session) {
                    navigate("/staff-login", { replace: true });
                }
            }
        );

        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, [navigate]);

    // mentre controlla → non renderizzare nulla
    if (checking) return null;

    return <div />;
}