import { Button, Group, Modal, Text } from "@mantine/core";

import { useNavigate } from "react-router-dom";
import {supabase} from "../api/lib/supabase.ts";
import { emit } from "../utility/AppEvents.ts";

export function LogoutModal() {

    const navigate = useNavigate();

    async function handleLogout() {
        await supabase.auth.signOut();
        emit("user:logout")
        navigate("/", { replace: true });
    }

    return (
        <>



            {/* Modal di conferma */}
            <Modal
                opened={true}
                onClose={()=>{navigate("/admin")}}
                centered
                radius="md"
                title="Conferma logout"
                overlayProps={{ blur: 4 }}
            >
                <Text size="sm" c="dimmed">
                    Vuoi uscire dall’area staff?
                </Text>

                <Group justify="flex-end" mt="lg">
                    <Button variant="default" onClick={()=>{navigate("/admin")}}>
                        Annulla
                    </Button>
                    <Button color="red" onClick={handleLogout}>
                        Logout
                    </Button>
                </Group>
            </Modal>
        </>
    );
}