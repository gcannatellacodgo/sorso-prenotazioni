export default function VideoBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <video
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
            >
                <source src="https://yqkgexyzwrseoftvxpko.supabase.co/storage/v1/object/public/sorso-prenotazioni/video-bg.mp4" type="video/mp4" />
            </video>

            {/* Overlay scuro */}
            <div className="absolute inset-0 bg-black/50" />
        </div>
    );
}