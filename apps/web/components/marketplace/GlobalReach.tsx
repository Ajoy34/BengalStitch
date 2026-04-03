'use client';

const STATS = [
  { value: '2,700+', label: 'Product SKUs To Customize', color: 'text-violet-600' },
  { value: '8K+', label: 'Partner Merchants', color: 'text-rose-600' },
  { value: '500K+', label: 'Items Sold', color: 'text-cyan-600' },
];

const COUNTRIES = [
  { name: 'Bangladesh', percent: '46%', partners: '22,324', flag: '🇧🇩' },
  { name: 'United States', percent: '25%', partners: '11,954', flag: '🇺🇸' },
  { name: 'Vietnam', percent: '15%', partners: '7,318', flag: '🇻🇳' },
  { name: 'Canada', percent: '2%', partners: '1,002', flag: '🇨🇦' },
  { name: 'United Kingdom', percent: '2%', partners: '934', flag: '🇬🇧' },
  { name: 'India', percent: '1%', partners: '549', flag: '🇮🇳' },
  { name: 'Australia', percent: '1%', partners: '549', flag: '🇦🇺' },
  { name: 'Germany', percent: '0.4%', partners: '193', flag: '🇩🇪' },
];

export function GlobalReach() {
  return (
    <section className="py-24 px-6 md:px-8 bg-gradient-to-b from-violet-50 to-white overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Decade stats */}
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-violet-600 uppercase tracking-wider">Global Presence</span>
          <h2 className="editorial-headline text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">
            Empowering Dreams Worldwide
          </h2>
        </div>

        {/* Big stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
              <div className={`text-5xl md:text-6xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 mt-2 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Map + countries */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* World map visual */}
          <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-xl mb-6">BengalStitch Delivers International Success</h3>
            <p className="text-gray-500 mb-6">
              Merchants worldwide rely on us to deliver customer satisfaction globally.
            </p>
            {/* Styled map representation using dots */}
            <div className="relative aspect-[2/1] bg-gradient-to-br from-violet-50 to-cyan-50 rounded-2xl overflow-hidden">
              <svg viewBox="0 0 800 400" className="w-full h-full" fill="none">
                {/* Simplified world map dots */}
                {/* North America */}
                <circle cx="180" cy="150" r="24" fill="rgba(108,60,233,0.15)" stroke="rgba(108,60,233,0.3)" strokeWidth="1"/>
                <circle cx="180" cy="150" r="8" fill="#6c3ce9"/>
                <text x="180" y="190" textAnchor="middle" className="text-[10px]" fill="#6c3ce9" fontWeight="bold">US 25%</text>

                {/* South America */}
                <circle cx="230" cy="280" r="8" fill="rgba(108,60,233,0.1)" stroke="rgba(108,60,233,0.2)" strokeWidth="1"/>
                <circle cx="230" cy="280" r="3" fill="#6c3ce9"/>

                {/* Europe */}
                <circle cx="400" cy="130" r="12" fill="rgba(244,63,94,0.15)" stroke="rgba(244,63,94,0.3)" strokeWidth="1"/>
                <circle cx="400" cy="130" r="5" fill="#f43f5e"/>
                <text x="400" y="160" textAnchor="middle" className="text-[10px]" fill="#f43f5e" fontWeight="bold">EU</text>

                {/* Africa */}
                <circle cx="420" cy="250" r="10" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.3)" strokeWidth="1"/>
                <circle cx="420" cy="250" r="4" fill="#06b6d4"/>

                {/* South Asia - Bangladesh highlight */}
                <circle cx="560" cy="200" r="32" fill="rgba(244,63,94,0.15)" stroke="rgba(244,63,94,0.3)" strokeWidth="2" className="animate-pulse"/>
                <circle cx="560" cy="200" r="12" fill="#f43f5e"/>
                <text x="560" y="245" textAnchor="middle" className="text-[11px]" fill="#f43f5e" fontWeight="bold">BD 46%</text>

                {/* Southeast Asia */}
                <circle cx="620" cy="220" r="18" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.3)" strokeWidth="1"/>
                <circle cx="620" cy="220" r="6" fill="#f59e0b"/>
                <text x="640" y="250" textAnchor="middle" className="text-[10px]" fill="#f59e0b" fontWeight="bold">VN 15%</text>

                {/* Australia */}
                <circle cx="660" cy="310" r="10" fill="rgba(108,60,233,0.1)" stroke="rgba(108,60,233,0.2)" strokeWidth="1"/>
                <circle cx="660" cy="310" r="4" fill="#6c3ce9"/>

                {/* Connection lines */}
                <path d="M180 150 Q300 80 400 130" stroke="rgba(108,60,233,0.15)" strokeWidth="1" strokeDasharray="4 4"/>
                <path d="M400 130 Q480 170 560 200" stroke="rgba(244,63,94,0.15)" strokeWidth="1" strokeDasharray="4 4"/>
                <path d="M560 200 Q610 210 620 220" stroke="rgba(245,158,11,0.15)" strokeWidth="1" strokeDasharray="4 4"/>
              </svg>
            </div>
          </div>

          {/* Country list */}
          <div>
            <h3 className="font-bold text-gray-900 text-xl mb-6">Top Markets</h3>
            <div className="space-y-3">
              {COUNTRIES.map((c) => (
                <div key={c.name} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                  <span className="text-3xl">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{c.name}</div>
                    <div className="text-sm text-gray-500">{c.partners} partners</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-violet-600">{c.percent}</div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-rose-500 rounded-full"
                      style={{ width: c.percent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
