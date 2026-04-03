const INTEGRATIONS = [
  { name: 'bKash', color: '#E2136E' },
  { name: 'Nagad', color: '#F6921E' },
  { name: 'SSLCommerz', color: '#35A7FF' },
  { name: 'Stripe', color: '#635BFF' },
  { name: 'PayPal', color: '#003087' },
  { name: 'Shopify', color: '#96BF48' },
];

export function IntegrationBar() {
  return (
    <section className="py-16 px-6 md:px-8 bg-white border-y border-gray-100">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">We Integrate With</h3>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {INTEGRATIONS.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: integration.color }}
              >
                {integration.name.charAt(0)}
              </div>
              <span className="font-bold text-gray-600">{integration.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
