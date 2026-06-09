export function Notification() {
  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Lock Screen Notification
        </h2>

        {/* Notification Card */}
        <div
          className="rounded-3xl p-5 shadow-2xl"
          style={{
            background: '#F8C8DC'
          }}
        >
          <div className="flex items-start gap-4">
            {/* App Icon */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                background: '#1A1A1A'
              }}
            >
              💌
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-black">💌 New Note from Car</h3>
                <span className="text-xs text-black/60">now</span>
              </div>
              <p className="text-black text-sm leading-relaxed">
                "I miss you baby ❤️"
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Swipe to open • Press for more
        </p>
      </div>
    </div>
  );
}
