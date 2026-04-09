import Link from 'next/link';
import Image from 'next/image';

const STEPS = [
  {
    number: 1,
    title: 'Sign Up for Free',
    description: 'Create your store in minutes — no upfront costs, no hidden fees. Connect your own domain for a professional branded storefront.',
    color: 'bg-green-100 text-green-600 border-green-200',
    accent: 'text-green-600',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSBagkS-atK37gtA9d20BF4oLJ-NfOaCtRTLwkaMPTDX2NQYEHPvS7UqSb8DTj9dWoYGcg_tFoXlcNPIt83b_MLZokEBmxhpiUgco1H-J2q_vlvEmiaXTMxSvq129up-jOZ5Fu-iiVTSFtLXrS8WLtr-HchaKMosGl_oOZYuIUvzZP7juVUH-pwIYD4-kiAqKpFf9RLbK-c-93UceRq746H9-rWz-Yn_SLWzdnKH7Whc0LFCTxEhuaxV-RXmLRJadh5GwwO4zFkg',
  },
  {
    number: 2,
    title: 'Choose Your Products',
    description: 'Pick from 2,700+ premium products. Use our AI Design Studio to create stunning designs or upload your own artwork.',
    color: 'bg-green-100 text-green-600 border-green-200',
    accent: 'text-green-600',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhksxVrdsL_Mf9yPmo5VUTo_r8TrINS99vOT_u0f5tohoTDPT3VtNOqpjCZWhf727xbeGrDOsSWuVJ7-DWMAYEuC0dy3eyWVx35ctHly4bG2mSMIKBnmCyec7cR2RnueiJW0DsU-OcgIkVtEfwtursAPrsSbtyqrXMIdlwYk8PbmvIfY-rssZucwibIp-SFYlmC5htaL9zmAC4SqjdXsj27iJZrU_cDzvt9Bimhh5PN2WJdPustaoUAnYrvYxYDFIul9pJ-ZNSVQ',
  },
  {
    number: 3,
    title: 'Start Selling',
    description: 'Launch your store with powerful tools. Share product links on social media — anyone who shares earns 10% commission.',
    color: 'bg-cyan-100 text-cyan-600 border-cyan-200',
    accent: 'text-cyan-600',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3UmUwXTrzX4fpFWmVplwIBTNpxn3Yez5JJi_yuv7ZkDmqfZnJIJphrR7PjVZVbhhuyz9sRkzDAbXZR7Sm9QXsZlqh5Dkewjhp0sihbacq9tJjkooqCTpr1epBZSt5-7oN7ks62d4bUuIjy6RJUtVTBz5DpjTdB1-UkvH96OzJ48WQaf--SlobIXRBn70kCSZu4MEdTHkArLTk46CTsPPzVfJBjDoAZrOsKoMO4P7XJw5E9-H-Q1tNQo-kTz3PHQqFhSCnInMIAQ',
  },
  {
    number: 4,
    title: 'We Handle the Rest',
    description: 'From printing and shipping to customer support — we handle everything. Get paid via bKash, Nagad, Stripe, or PayPal.',
    color: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    accent: 'text-emerald-600',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-36 py-24 px-6 md:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Simple Process</span>
          <h2 className="editorial-headline text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">
            How It Works
          </h2>
        </div>

        <div className="space-y-8">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow`}
            >
              <div className="flex-1 space-y-4">
                <div className={`inline-flex items-center gap-3 ${step.color} border px-4 py-2 rounded-full`}>
                  <span className="text-lg font-extrabold">{step.number}</span>
                  <span className="font-bold text-sm">{step.title}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
              </div>
              <div className="flex-1 max-w-md">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={500}
                    height={350}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/signup" className="gradient-cta inline-block px-10 py-4 rounded-xl font-bold text-lg">
            Start Selling — It&apos;s Free
          </Link>
        </div>
      </div>
    </section>
  );
}
