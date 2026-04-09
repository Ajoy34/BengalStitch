import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import DesignStudio from '@/components/studio/DesignStudio';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Design Studio — Create Custom Products',
  description: 'Design your own custom products with our easy-to-use studio. Upload designs, use AI generation, and preview with virtual try-on.',
};

export default function StudioPublicPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <DesignStudio />
        </div>
      </main>
      <Footer />
    </>
  );
}
