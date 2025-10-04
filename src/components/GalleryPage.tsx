import InfiniteGallery from './InfiniteGallery';

export function GalleryPage() {
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
			<InfiniteGallery
				images={sampleImages}
				speed={1.2}
				zSpacing={3}
				visibleCount={12}
				falloff={{ near: 0.8, far: 14 }}
				className="h-screen w-full"
			/>
			
			{/* Logo and Text Overlay */}
			<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
				<div className="text-center">
					{/* Logo */}
					<div className="mb-6">
						<img 
							src="/logo.svg" 
							alt="Teknoloji Menajeri Logo" 
							className="w-48 h-auto mx-auto filter drop-shadow-2xl"
						/>
					</div>
					
					{/* Social Media Agency Text */}
					<h2 
						className="text-2xl md:text-4xl font-bold text-white tracking-wider filter drop-shadow-2xl"
						style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
					>
						#SosyalMedyaAjansı
					</h2>
				</div>
			</div>
		</main>
	);
}
