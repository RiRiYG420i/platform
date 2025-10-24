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
	/* Add even wider side gutters so nav buttons sit fully outside cards */
	padding: 0 96px 10px 96px; /* leave a bit of room for dots */
	box-sizing: border-box;
	overflow: hidden;
	z-index: 1; /* ensure no accidental overlay blocks clicks */
	margin: 0; /* minimal gap to heading */
	cursor: grab;
		pointer-events: auto;
		touch-action: pan-y; /* allow vertical scroll; we handle horizontal swipes */
`

const Track = styled.div<{ x: number; dx: number; dragging: boolean; instant: boolean }>`
	display: flex;
	align-items: stretch;
	gap: 10px; /* Owl default margin ~10px */
	will-change: transform;
	/* Match OwlCarousel2 default movement; disable transition while dragging or during instant wraps */
	transition: ${(p: { dragging: boolean; instant: boolean }) => (p.dragging || p.instant ? 'none' : 'transform 250ms ease')};
	transform: translate3d(${(p: { x: number; dx: number }) => (-p.x + (p.dx || 0))}px, 0, 0);

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
	margin-top: 6px;
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
	${(p: { $side: 'left' | 'right' }) => (p.$side === 'left' ? 'left: 12px;' : 'right: 12px;')}
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

	// Map logical index to nearest visual index among clones without clamping;
	// we'll wrap back to the middle third after the transition ends to stay centered.
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

			// Drag interaction (mouse/touch): live move with snap on release
			const startX = React.useRef<number | null>(null)
			const dragged = React.useRef(false)
			const [dragDX, setDragDX] = React.useState(0)
			const [dragging, setDragging] = React.useState(false)
			const [instant, setInstant] = React.useState(false)

			const onPointerDown = (e: React.PointerEvent) => {
				startX.current = e.clientX
				dragged.current = false
				setDragging(false)
				setDragDX(0)
				// Do not capture immediately to allow inner links to click
			}

			const onPointerMove = (e: React.PointerEvent) => {
				if (startX.current == null) return
				const dx = e.clientX - startX.current
				if (Math.abs(dx) > 12 && !dragged.current) {
					dragged.current = true
					;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
					setDragging(true)
				}
				if (dragged.current) {
					setDragDX(dx)
				}
			}

			const finalizeDrag = (dx: number) => {
				setDragging(false)
				setDragDX(0)
				if (Math.abs(dx) < 30) return
				if (dx > 0) prev()
				else next()
			}

			const onPointerUp = (e: React.PointerEvent) => {
				if (startX.current == null) return
				const dx = e.clientX - startX.current
				startX.current = null
				finalizeDrag(dx)
			}

			const onPointerLeave = () => {
				if (startX.current == null) return
				const dx = dragDX
				startX.current = null
				finalizeDrag(dx)
			}

			const onPointerCancel = () => {
				startX.current = null
				setDragging(false)
				setDragDX(0)
			}

			// After a slide transition completes, if we drifted into clone zones
			// (left of base or right of 2*base-1), instantly wrap back by +/- base
			// so we remain near the middle clone block without any visible jump.
			const onTransitionEnd = () => {
				if (base === 0) return
				let next = visIdx
				if (visIdx < base) {
					next = visIdx + base
				} else if (visIdx >= 2 * base) {
					next = visIdx - base
				}
				if (next !== visIdx) {
					setInstant(true)
					setVisIdx(next)
					// Re-enable transition on the next frame
					requestAnimationFrame(() => setInstant(false))
				}
			}

			// Wheel navigation not part of Owl defaults; omit

	return (
		<div>
			<CarouselRoot
				ref={rootRef}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerLeave={onPointerLeave}
				onPointerCancel={onPointerCancel}
				style={{ cursor: dragging ? 'grabbing' : 'grab' }}
			>
				<NavButton
					$side="left"
					aria-label="Previous"
					onPointerDown={(e: React.PointerEvent) => { e.stopPropagation() }}
					onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); prev() }}
				>
					‹
				</NavButton>
				<Track x={centerOffset} dx={dragDX} dragging={dragging} instant={instant} onTransitionEnd={onTransitionEnd}>
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

