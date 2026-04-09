import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Affiliate' };

export default async function AffiliatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('users')
    .select('referral_code')
    .eq('id', user?.id || '')
    .single();

  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('*')
    .eq('user_id', user?.id || '')
    .single();

  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://bengalstitch.com'}/ref/${profile?.referral_code || ''}`;

  return (
    <div>
      <h1 className="editorial-headline text-2xl font-extrabold text-gray-900 mb-8">Affiliate Program</h1>

      {/* Referral link card */}
      <div className="bg-gradient-to-r from-violet-50 to-rose-50 rounded-2xl p-6 border border-violet-100 mb-8">
        <p className="font-bold mb-2">Your Referral Link</p>
        <div className="flex items-center gap-3">
          <input
            readOnly
            value={referralLink}
            className="flex-1 bg-white border border-violet-200 rounded-xl px-4 py-3 text-sm font-mono"
          />
          <button className="gradient-cta px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap">
            Copy Link
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Earn 10% commission on every sale made through your link</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Clicks', value: affiliate?.total_clicks || 0 },
          { label: 'Conversions', value: affiliate?.total_conversions || 0 },
          { label: 'Total Earned', value: `৳ ${(affiliate?.total_earned || 0).toLocaleString()}` },
          { label: 'Pending Payout', value: `৳ ${(affiliate?.pending_payout || 0).toLocaleString()}` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-extrabold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="font-bold mb-4">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Share your link', desc: 'Copy your unique referral link and share it on social media, blogs, or with friends.' },
            { step: '2', title: 'Someone buys', desc: 'When someone clicks your link and makes a purchase within 30 days, you get credited.' },
            { step: '3', title: 'Earn commission', desc: "You earn 10% of the seller's profit on every sale. Commission is credited after delivery." },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                {item.step}
              </div>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
