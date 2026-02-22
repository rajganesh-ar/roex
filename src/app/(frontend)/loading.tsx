export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* Thin progress bar at top — appears instantly on navigation */}
        <div className="absolute top-0 left-0 h-[2px] bg-white/90 animate-[loadingBar_1.2s_cubic-bezier(0.4,0,0.2,1)_forwards]" />
      </div>
    </div>
  )
}
