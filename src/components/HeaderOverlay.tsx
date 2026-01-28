import { ActionIcon, Group } from "@mantine/core";

import insta_button from "../assest/ista_button.svg";
import fb_button from "../assest/fb_button.svg";
import menu_button from "../assest/menu_bt.svg";

type Props = {
    onOpenMenu: () => void;
};

export default function HeaderOverlay({ onOpenMenu }: Props) {
    return (
        <div className="relative z-50 pointer-events-auto flex items-start justify-between w-full px-6 pt-6">
            {/* SOCIAL */}
            <Group gap={10}>
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
            </Group>

            {/* MENU */}
            <ActionIcon
                size="lg"
                radius="xl"
                variant="subtle"
                className="hover:bg-white/10"
                onClick={onOpenMenu}
                aria-label="Apri menu"
            >
                <img src={menu_button} alt="Menu" className="h-8 w-8" />
            </ActionIcon>
        </div>
    );
}