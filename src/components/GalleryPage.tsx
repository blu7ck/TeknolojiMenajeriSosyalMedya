import InfiniteGallery from './InfiniteGallery';
import { ArrowLeft } from 'lucide-react';

export function GalleryPage() {
	const handleBackClick = () => {
		window.location.reload();
	};
	const sampleImages = [
		{ src: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Social Media 1' },
		{ src: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Social Media 2' },
		{ src: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Social Media 3' },
		{ src: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Social Media 4' },
		{ src: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Social Media 5' },
		{ src: 'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Social Media 6' },
		{ src: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Social Media 7' },
		{ src: 'https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Social Media 8' },
	];

	return (
		<main className="min-h-screen relative">
			<button
				onClick={handleBackClick}
				className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg
				           hover:bg-white transition-all duration-200 flex items-center gap-2 shadow-lg"
			>
				<ArrowLeft size={20} />
				<span>Ana Sayfa</span>
			</button>

			<InfiniteGallery
				images={sampleImages}
				speed={1.2}
				zSpacing={3}
				visibleCount={12}
				falloff={{ near: 0.8, far: 14 }}
				className="h-screen w-full"
			/>
			<div className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white">
				<h1 className="text-4xl md:text-7xl tracking-tight font-bold">
					<span className="italic">Sosyal Medya</span> Portföyümüz
				</h1>
			</div>

			<div className="text-center fixed bottom-10 left-0 right-0 text-white font-mono uppercase text-[11px] font-semibold mix-blend-exclusion">
				<p>Fare tekerleği, ok tuşları veya dokunma ile gezinin</p>
				<p className="opacity-60">
					3 saniye hareketsizlik sonrası otomatik oynatma devam eder
				</p>
			</div>
		</main>
	);
}
