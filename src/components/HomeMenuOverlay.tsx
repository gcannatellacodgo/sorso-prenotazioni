import { Modal, ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import logo from '../assest/logo.svg'
type Props = {
    opened: boolean;
    onClose: () => void;
};

const items = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Foto ricordo", to: "/foto-ricordo" },
    { label: "Prenotazioni", to: "/prenotazioni" },
    { label: "Menù", to: "/menu" },
    { label: "Staff", to: "/staff" },
];

export default function HomeMenuOverlay({ opened, onClose }: Props) {
    const navigate = useNavigate();

    function go(to: string) {
        onClose();
        navigate(to);
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            fullScreen
            withCloseButton={false}
            transitionProps={{ transition: "fade", duration: 200, timingFunction: "ease" }}
            styles={{
                content: { background: "transparent" },
                body: { padding: 0, height: "100%" },
            }}
        >
            {/* background + blur */}
            <div className="relative h-screen w-full">
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 backdrop-blur-xl" />

                {/* gradiente tipo screenshot */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2e3b2a]/70 via-[#2a3b33]/40 to-[#6b3a28]/65" />

                {/* contenuto */}
                <div className="relative z-10 h-full w-full px-8 pt-10">
                    {/* header */}
                    <div className="flex items-start justify-between">
                        <div className="select-none">

                            <div className="mt-4">
                                <img
                                    src={logo}
                                    alt="Sørso"
                                    className="w-[100px] md:w-[200px] drop-shadow"
                                />
                            </div>
                        </div>

                        <ActionIcon
                            size="lg"
                            radius="xl"
                            variant="subtle"
                            onClick={onClose}
                            className="text-white hover:bg-white/10"
                            aria-label="Chiudi"
                        >
                            <IconX size={22} />
                        </ActionIcon>
                    </div>

                    {/* lista voci */}
                    <div className="mx-auto mt-16 max-w-2xl">
                        {items.map((it) => (
                            <button
                                key={it.to}
                                onClick={() => go(it.to)}
                                className="group w-full text-left"
                            >
                                <div className="py-6 text-2xl font-semibold text-white/90 transition group-hover:text-white">
                                    {it.label}
                                </div>
                                <div className="h-px w-full bg-white/35" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
}