'use client';

export default function DesignStudioPage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="editorial-headline text-2xl font-extrabold">
          Design Studio
        </h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 ghost-border rounded-lg text-sm font-medium hover:border-primary transition-colors">
            Undo
          </button>
          <button className="px-4 py-2 ghost-border rounded-lg text-sm font-medium hover:border-primary transition-colors">
            Redo
          </button>
          <button className="px-4 py-2 gradient-cta text-on-primary rounded-lg text-sm font-bold">
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[80px_1fr_300px] gap-4 min-h-0">
        {/* Left toolbar */}
        <div className="bg-surface-container-low rounded-2xl p-3 flex flex-col gap-2">
          {[
            { icon: '🖼️', label: 'Image' },
            { icon: '✏️', label: 'Text' },
            { icon: '⬜', label: 'Shape' },
            { icon: '😀', label: 'Sticker' },
            { icon: '🤖', label: 'AI' },
            { icon: '📁', label: 'Upload' },
          ].map((tool) => (
            <button
              key={tool.label}
              className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-surface-container transition-colors"
              title={tool.label}
            >
              <span className="text-xl">{tool.icon}</span>
              <span className="text-[10px] text-on-surface-variant">
                {tool.label}
              </span>
            </button>
          ))}
        </div>

        {/* Canvas area */}
        <div className="bg-surface-container-lowest rounded-2xl flex items-center justify-center relative overflow-hidden">
          <div className="w-[400px] h-[500px] bg-surface-container rounded-2xl flex items-center justify-center ghost-border">
            <div className="text-center space-y-4">
              <p className="text-4xl">👕</p>
              <p className="text-on-surface-variant text-sm">
                Select a product and start designing
              </p>
              <button className="gradient-cta text-on-primary px-6 py-2 rounded-lg text-sm font-bold">
                Choose Product
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-surface-container-low rounded-2xl p-4 space-y-6 overflow-y-auto">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3">
              Product
            </h3>
            <select className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors">
              <option>T-Shirt</option>
              <option>Hoodie</option>
              <option>Mug</option>
              <option>Phone Case</option>
              <option>Tote Bag</option>
              <option>Poster</option>
              <option>Cap</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3">
              View
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {['Front', 'Back', 'Side'].map((view) => (
                <button
                  key={view}
                  className="py-2 bg-surface-container-highest rounded-lg text-xs font-bold hover:bg-primary hover:text-on-primary transition-colors"
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3">
              Color
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                '#000000',
                '#ffffff',
                '#1a1a2e',
                '#e94560',
                '#0f3460',
                '#533483',
                '#2b2d42',
                '#8d99ae',
              ].map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full ghost-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3">
              Layers
            </h3>
            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant text-center py-8">
                No layers yet. Add elements to see them here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
