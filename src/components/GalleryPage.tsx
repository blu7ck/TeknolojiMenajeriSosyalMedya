import InfiniteGallery from './InfiniteGallery';

export default function GalleryPage() {
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
				speed={3.6}
				zSpacing={3}
				visibleCount={12}
				falloff={{ near: 0.8, far: 14 }}
				className="h-screen w-full"
			/>
		</main>
	);
}
