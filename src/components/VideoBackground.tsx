export default function VideoBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden">
            <video
                className="h-full w-full absolute object-cover"
                autoPlay
                muted
                loop
                controls={false}
                playsInline
                preload="auto"
                webkit-playsinline="true"
                x5-playsinline="true"
            >
                <source src="https://yqkgexyzwrseoftvxpko.supabase.co/storage/v1/object/public/sorso-prenotazioni/output-mobile.mp4" type="video/mp4" />
            </video>

            {/* Overlay scuro */}
            <div className="absolute inset-0 bg-black/50" />
        </div>
    );
}