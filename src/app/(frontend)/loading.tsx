export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Opaque white overlay sits below the header (z-50) but covers the footer */}
      <div className="fixed inset-0 z-[45] bg-white pointer-events-none" />
      {/* Visible brand-gradient progress bar — above everything including header */}
      <div className="fixed inset-x-0 top-0 z-[10000] h-[3px] pointer-events-none">
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#eb531f] via-[#ff4a1f] to-[#ed1c24] animate-[loadingBar_1.2s_cubic-bezier(0.4,0,0.2,1)_forwards]" />
      </div>
    </div>
  )
}
