import { ActionIcon, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useLocation } from "react-router-dom";

import LogoMobile from "../assest/SorsoLogoMB.svg";
import LogoDesctop from "../assest/SorsoLogoDT.svg";
import insta_button from "../assest/ista_button.svg";
import fb_button from "../assest/fb_button.svg";
import menu_button from "../assest/menu_bt.svg";

type Props = {
    onOpenMenu: () => void;
};

export default function HeaderOverlay({ onOpenMenu }: Props) {
    const { pathname } = useLocation();
    const isHome = pathname === "/";
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <div className="relative z-50 pointer-events-auto flex items-start justify-between w-full px-6 pt-6">

            {/* SINISTRA */}
            <Group gap={10}>
                {isHome && (
                    <>
                        <ActionIcon
                            size="lg"
                            radius="xl"
                            variant="subtle"
                            component="a"
                            href="https://facebook.com"
                            target="_blank"
                            className="hover:bg-white/10"
                        >
                            <img src={fb_button} alt="Facebook" className="h-8 w-8" />
                        </ActionIcon>

                        <ActionIcon
                            size="lg"
                            radius="xl"
                            variant="subtle"
                            component="a"
                            href="https://instagram.com"
                            target="_blank"
                            className="hover:bg-white/10"
                        >
                            <img src={insta_button} alt="Instagram" className="h-8 w-8" />
                        </ActionIcon>
                    </>
                )}
                {isMobile && !isHome && (
                    <img src={LogoMobile} alt="Sorso logo  mobile" className="h-8 w-8" />
                )}
                {!isMobile && !isHome && (
                    <img src={LogoDesctop} alt="Sorso logo desctop" className="h-12 w-auto" />
                )}
            </Group>
            <ActionIcon
                size="lg"
                radius="xl"
                variant="subtle"
                className="hover:bg-white/10"
                onClick={onOpenMenu}
                aria-label="Secondo menu"
            >
                <img src={menu_button} alt="Menu secondario" className="h-8 w-8" />
            </ActionIcon>
        </div>
    );
}
