import { useState } from "react";


import VideoBackground from "../components/VideoBackground";
import HomeMenuOverlay from "../components/HomeMenuOverlay";


import logo from "../assest/logo.svg";
import {ContactActions} from "../components/ContactActions.tsx";

export default function Home() {
    const [menuOpened, setMenuOpened] = useState(false);

    return (
        <div className=" h-screen w-full overflow-hidden">
            <VideoBackground />

            {/* OVERLAY */}
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
                {/* HEADER */}


                {/* LOGO CENTRALE */}
                <div className="flex flex-1 items-center justify-center">
                    <img
                        src={logo}
                        alt="Sørso"
                        className="w-[200px] md:w-[360px] drop-shadow-xl"
                    />
                </div>

                {/* INFO BOTTOM */}
                <div className="pointer-events-auto px-6 pb-6">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/90">
                        <ContactActions/>
                    </div>
                </div>
            </div>

            {/* MENU OVERLAY */}
            <HomeMenuOverlay
                opened={menuOpened}
                onClose={() => setMenuOpened(false)}
            />
        </div>
    );
}