import React from 'react'
import styled, { css } from 'styled-components'
import { GAMES, type ExtendedGameBundle } from '../games'
import { GameCard } from '../sections/Dashboard/GameCard'

// A responsive, center-mode carousel inspired by OwlCarousel2 "center" demo.
// - Centers the active card
// - Shows partial side cards via stage padding
// - Optional autoplay

// Match OwlCarousel2 center demo defaults:
// items:2 (mobile), items:4 (>=600px), margin:10, center:true, loop:true
type Layout = { items: number }
function useResponsive(): Layout {
	const [items, setItems] = React.useState<number>(() => {
		const w = typeof window !== 'undefined' ? window.innerWidth : 1200
		return w >= 600 ? 4 : 2
	})
	React.useEffect(() => {
		const onResize = () => {
			const w = window.innerWidth
			setItems(w >= 600 ? 4 : 2)
		}
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [])
	return { items }
}

const CarouselRoot = styled.div`
	position: relative;
	width: 100%;
	/* Add side gutters so nav buttons sit outside cards and minimize top spacing */
	padding: 0 44px 10px 44px; /* leave a bit of room for dots */
	box-sizing: border-box;
	overflow: hidden;
	z-index: 1; /* ensure no accidental overlay blocks clicks */
	margin: 0; /* minimal gap to heading */
	cursor: grab;
		pointer-events: auto;
		touch-action: pan-y; /* allow vertical scroll; we handle horizontal swipes */
`

const Track = styled.div<{ x: number }>`
	display: flex;
	align-items: stretch;
	gap: 10px; /* Owl default margin ~10px */
	will-change: transform;
	/* Match OwlCarousel2 default movement */
	transition: transform 250ms ease;
	transform: translate3d(${(p: { x: number }) => -p.x}px, 0, 0);

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`

const Slide = styled.div<{ width: number }>`
	flex: 0 0 ${(p: { width: number }) => p.width}px;
	display: flex;
	justify-content: center;
	align-items: stretch;
	& > .scaleWrap { width: 100%; }
`

const Dots = styled.div`
	display: flex;
	justify-content: center;
	gap: 8px;
	margin-top: 12px;
`

const Dot = styled.button<{ active?: boolean }>`
	all: unset;
	width: 8px;
	height: 8px;
	border-radius: 999px;
	background: ${(p: { active?: boolean }) => (p.active ? 'white' : 'rgba(255,255,255,0.4)')};
	box-shadow: 0 0 0 2px rgba(255,255,255,0.15) inset;
	cursor: pointer;
`

const NavButton = styled.button<{ $side: 'left' | 'right' }>`
	position: absolute;
	top: 50%;
	${(p: { $side: 'left' | 'right' }) => (p.$side === 'left' ? 'left: 8px;' : 'right: 8px;')}
	transform: translateY(-50%);
	width: 38px;
	height: 38px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: none;
	border-radius: 999px;
	background: rgba(0,0,0,0.45);
	color: #fff;
	cursor: pointer;
	z-index: 2;
	transition: background 150ms ease, transform 150ms ease, opacity 150ms ease;
	&:hover { background: rgba(0,0,0,0.6); }
	&:active { transform: translateY(-50%) scale(0.98); }
`

export interface VCardCarouselProps {
	autoplay?: boolean
	interval?: number
}

export default function VCardCarousel({ autoplay = false, interval = 3500 }: VCardCarouselProps) {
	const { items } = useResponsive()
	const rootRef = React.useRef<HTMLDivElement>(null)
	const baseGames = React.useMemo<ExtendedGameBundle[]>(() => GAMES.filter((g) => !g.disabled), [])
	const base = baseGames.length
	// Owl approach: minimal clones for seamless loop
	const games = React.useMemo<ExtendedGameBundle[]>(() => [...baseGames, ...baseGames, ...baseGames], [baseGames])
	const [currentIdx, setCurrentIdx] = React.useState(0) // logical index; use visual mapping
	// Start from the middle copy to keep headroom on both sides
	const [visIdx, setVisIdx] = React.useState(() => base)
  // baseGames/games control how many we render; base is original length

	// Measurements
		const [slideWidth, setSlideWidth] = React.useState(280)
		const gap = 10

	const recalc = React.useCallback(() => {
		const el = rootRef.current
		if (!el) return
		const viewport = el.clientWidth
		const inner = viewport
		const width = Math.max(140, Math.floor((inner - gap * (items - 1)) / items))
		setSlideWidth(width)
	}, [items])

	React.useEffect(() => {
		recalc()
	}, [recalc])

	React.useEffect(() => {
		const onResize = () => recalc()
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [recalc])

	// Autoplay
		React.useEffect(() => {
			if (!autoplay) return
				const id = setInterval(() => setCurrentIdx((i: number) => i + 1), interval)
		return () => clearInterval(id)
		}, [autoplay, interval])

	// Compute x-offset so that current slide center aligns to viewport center
			// Seamless mapping: choose the visually closest index within the tripled list
					React.useEffect(() => {
						if (base === 0) return
						const mod = ((currentIdx % base) + base) % base
						const candidates = [mod, mod + base, mod + 2 * base]
						const prev = visIdx
						let best = candidates[0]
						let bestDist = Math.abs(best - prev)
						for (const c of candidates) {
							const d = Math.abs(c - prev)
							if (d < bestDist) { best = c; bestDist = d }
						}
						// Keep within the middle third [base, 2*base) to avoid edge glitches
						if (best < base) best += base
						else if (best >= 2 * base) best -= base
						if (best !== prev) setVisIdx(best)
					}, [currentIdx, base])
		const centerOffset = React.useMemo(() => {
			const viewport = rootRef.current?.clientWidth ?? 0
			const total = games.length * (slideWidth + gap) - gap
			const leftOfCurrent = visIdx * (slideWidth + gap)
			const centerOfCurrent = leftOfCurrent + slideWidth / 2
			const viewportCenter = viewport / 2
			const desired = centerOfCurrent - viewportCenter
			const maxX = Math.max(0, total - viewport)
			const x = Math.max(0, Math.min(desired, maxX))
			return x
		}, [visIdx, gap, slideWidth, games.length])


		const prev = () => setCurrentIdx((i: number) => i - 1)
		const next = () => setCurrentIdx((i: number) => i + 1)

			// Basic drag-to-snap interaction
			const startX = React.useRef<number | null>(null)
			const dragged = React.useRef(false)

			const onPointerDown = (e: React.PointerEvent) => {
				startX.current = e.clientX
				dragged.current = false
				// Do not capture immediately to allow inner links to click
			}

			const onPointerMove = (e: React.PointerEvent) => {
				if (startX.current == null) return
				const dx = e.clientX - startX.current
				if (Math.abs(dx) > 12 && !dragged.current) {
					dragged.current = true
					;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
				}
			}

			const onPointerUp = (e: React.PointerEvent) => {
				if (startX.current == null) return
				const dx = e.clientX - startX.current
				startX.current = null
				if (Math.abs(dx) < 30) return
				if (dx > 0) prev()
				else next()
			}

			// Wheel navigation not part of Owl defaults; omit

	return (
		<div>
			<CarouselRoot
				ref={rootRef}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
			>
				<NavButton
					$side="left"
					aria-label="Previous"
					onPointerDown={(e: React.PointerEvent) => { e.stopPropagation() }}
					onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); prev() }}
				>
					‹
				</NavButton>
				<Track x={centerOffset}>
					{games.map((game: ExtendedGameBundle, i: number) => (
						<Slide key={i} width={slideWidth}>
							<div className="scaleWrap">
								<GameCard game={game} aspectRatio={'2/3'} />
							</div>
						</Slide>
					))}
				</Track>
				<NavButton
					$side="right"
					aria-label="Next"
					onPointerDown={(e: React.PointerEvent) => { e.stopPropagation() }}
					onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); next() }}
				>
					›
				</NavButton>
			</CarouselRoot>
			<Dots>
							{baseGames.map((_: ExtendedGameBundle, i: number) => (
								<Dot
									key={i}
									active={((currentIdx % base) + base) % base === i}
									onClick={() => {
										// Snap to nearest index with same modulo (i) to keep minimal motion
										const candidates = [i, i + base, i + base * 2]
										let best = candidates[0]
										let bestDist = Math.abs(best - currentIdx)
										for (const c of candidates) {
											const d = Math.abs(c - currentIdx)
											if (d < bestDist) { best = c; bestDist = d }
										}
										setCurrentIdx(best)
									}}
								/>
						))}
			</Dots>
		</div>
	)
}

