// ✅ stessa password (duplicata qui per sicurezza del gate)
// Nota: non è sicurezza vera (è lato client), ma blocca accesso “casuale”.
const ADMIN_PASSWORD = "test";

import { useMemo, useState } from "react";
import {
    Button,
    Card,
    Group,
    PasswordInput,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
    const navigate = useNavigate();

    const [pwd, setPwd] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [unlocked, setUnlocked] = useState(false);

    const canSubmit = useMemo(() => pwd.trim().length > 0, [pwd]);

    const tryUnlock = () => {
        const value = pwd.trim();
        if (!value) {
            setErr("Inserisci la password");
            return;
        }
        if (value !== ADMIN_PASSWORD) {
            setErr("Password non corretta");
            return;
        }
        setErr(null);
        setPwd("");
        setUnlocked(true);
    };

    // ✅ schermata login (mobile-first)
    if (!unlocked) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white">
                <div className="mx-auto max-w-md px-4 py-10">
                    <Title
                        order={2}
                        className="text-3xl font-black"
                        style={{
                            background:
                                "linear-gradient(90deg, #22c55e 0%, #06b6d4 40%, #d946ef 70%, #f59e0b 100%)",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        Admin • Sorso
                    </Title>

                    <Text className="mt-2 text-zinc-200/85">
                        Inserisci la password per accedere alla sezione admin.
                    </Text>

                    <Card radius="xl" padding="lg" className="mt-5 bg-white/5 border border-white/15">
                        <Stack gap="sm">
                            <PasswordInput
                                label="Password"
                                placeholder="••••••••"
                                value={pwd}
                                onChange={(e) => {
                                    setPwd(e.currentTarget.value);
                                    setErr(null);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") tryUnlock();
                                }}
                            />

                            {err && <Text size="sm" className="text-red-300">{err}</Text>}

                            <Group justify="space-between" mt="xs">
                                <Button radius="xl" variant="light" onClick={() => navigate("/")}>
                                    Torna al sito
                                </Button>
                                <Button radius="xl" onClick={tryUnlock} disabled={!canSubmit}>
                                    Entra
                                </Button>
                            </Group>
                        </Stack>
                    </Card>
                </div>
            </div>
        );
    }

    // ✅ sezione admin vera (contenuto placeholder)
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <div className="mx-auto max-w-5xl px-4 py-10">
                <Group justify="space-between" align="center">
                    <Title
                        order={2}
                        className="text-3xl font-black"
                        style={{
                            background:
                                "linear-gradient(90deg, #22c55e 0%, #06b6d4 40%, #d946ef 70%, #f59e0b 100%)",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        Area Admin
                    </Title>

                    <Button radius="xl" variant="light" onClick={() => navigate("/")}>
                        Torna al sito
                    </Button>
                </Group>

                <Card radius="xl" padding="lg" className="mt-6 bg-white/5 border border-white/15">
                    <Stack gap="sm">
                        <Text fw={900}>Qui costruiremo:</Text>
                        <Text className="text-zinc-200/90">• Gestione eventi settimanali</Text>
                        <Text className="text-zinc-200/90">• Lista prenotazioni per evento</Text>
                        <Text className="text-zinc-200/90">• Conferma / annulla prenotazioni</Text>
                    </Stack>
                </Card>
            </div>
        </div>
    );
}