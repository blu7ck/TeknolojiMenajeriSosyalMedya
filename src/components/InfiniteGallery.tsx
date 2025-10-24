import type React from 'react';
import { useRef, useMemo, useCallback, useState, useEffect, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type ImageItem = string | { src: string; alt?: string };

// Error Boundary Component
class ErrorBoundary extends Component<
	{ children: React.ReactNode; fallback: React.ReactNode },
	{ hasError: boolean }
> {
	constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback;
		}
		return this.props.children;
	}
}

interface FadeSettings {
	fadeIn: {
		start: number;
		end: number;
	};
	fadeOut: {
		start: number;
		end: number;
	};
}

interface BlurSettings {
	blurIn: {
		start: number;
		end: number;
	};
	blurOut: {
		start: number;
		end: number;
	};
	maxBlur: number;
}

interface InfiniteGalleryProps {
	images: ImageItem[];
	className?: string;
	style?: React.CSSProperties;
	fadeSettings?: FadeSettings;
	blurSettings?: BlurSettings;
}

function FallbackGallery({ images }: { images: ImageItem[] }) {
	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === 'string' ? { src: img, alt: '' } : img
			),
		[images]
	);

	return (
		<div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
			<div className="flex overflow-x-auto gap-6 h-full items-center p-8 scrollbar-hide">
				{normalizedImages.map((img, i) => (
					<div
						key={i}
						className="flex-shrink-0 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
						onClick={() => {
							// TODO: Add link functionality later
							console.log('Image clicked:', img.alt);
						}}
					>
						<div className="relative overflow-hidden rounded-2xl shadow-lg">
							<img
								src={img.src}
								alt={img.alt}
								className="w-64 h-48 object-cover transition-transform duration-500 hover:scale-110"
								loading="lazy"
								crossOrigin="anonymous"
								referrerPolicy="no-referrer"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
								<div className="absolute bottom-4 left-4 right-4">
									<p className="text-sm font-medium text-white truncate">{img.alt}</p>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
			<style>{`
				.scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
			`}</style>
		</div>
	);
}

export default function InfiniteGallery({
	images,
	className = 'h-96 w-full',
	style,
	fadeSettings = {
		fadeIn: { start: 0.05, end: 0.25 },
		fadeOut: { start: 0.4, end: 0.43 },
	},
	blurSettings = {
		blurIn: { start: 0.0, end: 0.1 },
		blurOut: { start: 0.4, end: 0.43 },
		maxBlur: 8.0,
	},
	...props
}: InfiniteGalleryProps) {
	const [webglSupported, setWebglSupported] = useState(true);

	useEffect(() => {
		try {
			const canvas = document.createElement('canvas');
			const gl =
				canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
			if (!gl) {
				setWebglSupported(false);
			}
		} catch (e) {
			setWebglSupported(false);
		}
	}, []);

	// Always use fallback gallery to avoid WebGL issues
	return (
		<div className={className} style={style}>
			<FallbackGallery images={images} />
		</div>
	);
}