export const metadata = { title: 'Creator Dashboard' };

const STATS = [
  { label: 'Total Revenue', value: '৳ 45,200', change: '+12.5%', color: 'primary' },
  { label: 'Orders', value: '128', change: '+8.3%', color: 'secondary' },
  { label: 'Products', value: '24', change: '+3', color: 'tertiary' },
  { label: 'Store Views', value: '3,420', change: '+22.1%', color: 'primary' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="editorial-headline text-3xl font-extrabold mb-2">
          Welcome back, Creator
        </h1>
        <p className="text-on-surface-variant">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-2xl p-6 space-y-2"
          >
            <p className="text-on-surface-variant text-sm">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className={`text-${stat.color} text-sm font-medium`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-surface-container-high rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-surface-container rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg" />
                <div>
                  <p className="text-sm font-medium">
                    Order #AMP-{String(1000 + i).padStart(4, '0')}
                  </p>
                  <p className="text-xs text-on-surface-variant">2 items</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">
                  ৳ {(850 + i * 200).toLocaleString()}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {i === 0 ? 'Just now' : `${i}h ago`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
