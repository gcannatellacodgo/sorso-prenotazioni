import { useState } from "react";
import { Button, Card, Stack, Text, TextInput } from "@mantine/core";

import { useNavigate } from "react-router-dom";
import {supabase} from "../api/lib/supabase.ts";

export default function StaffLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        setLoading(false);

        if (error) {
            alert("Credenziali non valide");
            return;
        }

        navigate("/admin");
    };

    return (
        <div className="min-h-screen bg-black grid place-items-center px-4">
            <Card radius="lg" p="xl" className="w-full max-w-sm bg-zinc-900 border border-zinc-800">
                <Stack>
                    <Text fw={900} size="lg">
                        STAFF LOGIN
                    </Text>

                    <TextInput
                        label="Email"
                        placeholder="staff@sorso.it"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                    />

                    <TextInput
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                    />

                    <Button loading={loading} onClick={handleLogin} fullWidth color="cyan">
                        Accedi
                    </Button>
                </Stack>
            </Card>
        </div>
    );
}