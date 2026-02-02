import { Button, Group } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export default function BottomBar({
                                      step,
                                      canProceed,
                                      onBack,
                                      onNext,
                                  }: {
    step: 1 | 2 | 3;
    selectedCount: number;
    canProceed: boolean;
    onBack: () => void;
    onNext: () => void;
}) {
    const ctaLabel = step === 1 ? "Avanti" : step === 2 ? "Inserisci dati" : "Conferma";

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur">
            <div className="mx-auto max-w-lg px-4 py-4">
                <Group justify="space-between" align="center">
                    <Button
                        radius="xl"
                        variant="subtle"
                        color="gray"
                        leftSection={<IconChevronLeft size={18} />}
                        disabled={step === 1}
                        onClick={onBack}
                    >
                        Indietro
                    </Button>

                    <Group gap="md">

                        <Button
                            radius="xl"
                            rightSection={<IconChevronRight size={18} />}
                            disabled={!canProceed}
                            onClick={onNext}
                        >
                            {ctaLabel}
                        </Button>
                    </Group>
                </Group>
            </div>
        </div>
    );
}