import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const BUCKET = 'product-assets';

export async function POST() {
  try {
    const supabase = createAdminClient();

    const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
    if (listErr) {
      return NextResponse.json({ error: listErr.message }, { status: 500 });
    }

    const exists = (buckets || []).some((b) => b.name === BUCKET);
    if (!exists) {
      const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024,
      });
      if (createErr) {
        return NextResponse.json({ error: createErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, bucket: BUCKET });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || 'Failed' }, { status: 500 });
  }
}

