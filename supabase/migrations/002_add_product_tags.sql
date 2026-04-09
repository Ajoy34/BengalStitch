-- Add tags to products for collections / search

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';

-- Fast tag filtering
CREATE INDEX IF NOT EXISTS idx_products_tags_gin
ON public.products
USING GIN (tags);

