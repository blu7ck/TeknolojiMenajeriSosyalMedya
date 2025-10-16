import InfiniteGallery from './InfiniteGallery';

export function GalleryPage() {
	const sampleImages = [
		// Professional social media and business images
		{ src: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Social Media Marketing' },
		{ src: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Digital Strategy' },
		{ src: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Content Creation' },
		{ src: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Team Collaboration' },
		{ src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Business Growth' },
		{ src: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Innovation' },
		{ src: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Technology' },
		{ src: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Creative Process' },
		{ src: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Digital Transformation' },
		{ src: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Brand Development' },
		{ src: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Marketing Strategy' },
		{ src: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Success Stories' },
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
