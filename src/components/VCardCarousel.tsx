import React from 'react'
import styled, { css } from 'styled-components'
import { GAMES, type ExtendedGameBundle } from '../games'
import { GameCard } from '../sections/Dashboard/GameCard'

// A responsive, center-mode carousel inspired by OwlCarousel2 "center" demo.
// - Centers the active card
// - Shows partial side cards via stage padding
// - Optional autoplay

// Always 3 items visible per request; stagePadding gives a little side air
type Layout = { items: 3, stagePadding: number }
function useResponsive(): Layout {
	const [padding, setPadding] = React.useState<number>(() => {
		const w = typeof window !== 'undefined' ? window.innerWidth : 1200
		if (w < 600) return 16
		if (w < 900) return 24
		return 32
	})
	React.useEffect(() => {
		const onResize = () => {
			const w = window.innerWidth
			if (w < 600) setPadding(16)
			else if (w < 900) setPadding(24)
			else setPadding(32)
		}
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [])
	return { items: 3, stagePadding: padding }
}

const CarouselRoot = styled.div<{ stagePadding: number }>`
	position: relative;
	width: 100%;
	padding-left: ${(p: { stagePadding: number }) => p.stagePadding}px;
	padding-right: ${(p: { stagePadding: number }) => p.stagePadding}px;
		padding-top: 8px;
		padding-bottom: 12px; /* extra room for scaled center and dots */
	box-sizing: border-box;
	overflow: hidden;
	z-index: 1; /* ensure no accidental overlay blocks clicks */
	margin: 8px 0; /* give a bit of breathing room */
	cursor: grab;
		pointer-events: auto;
		touch-action: pan-y; /* allow vertical scroll; we handle horizontal swipes */
`

const Track = styled.div<{ x: number; noTransition?: boolean }>`
	display: flex;
	align-items: stretch;
	gap: 28px;
	will-change: transform;
	transition: ${(p: { noTransition?: boolean }) => (p.noTransition ? 'none' : 'transform 450ms ease')};
	transform: translate3d(${(p: { x: number }) => -p.x}px, 0, 0);
`

const CENTER_SCALE = 1.1
const NEIGHBOR_SCALE = CENTER_SCALE * 0.7
const OTHER_SCALE = 0.7

const Slide = styled.div<{ width: number; active?: boolean; neighbor?: boolean; offsetY?: number }>`
	flex: 0 0 ${(p: { width: number }) => p.width}px;
	display: flex;
	justify-content: center;
	align-items: stretch;
	transform-origin: center bottom;
	${css`
		transition: transform 300ms ease, filter 300ms ease; 
	`}

	${(p: { active?: boolean; neighbor?: boolean; offsetY?: number }) =>
		p.active
			? css`
					transform: translateY(0) scale(${CENTER_SCALE});
					z-index: 2;
					filter: none;
				`
			: p.neighbor
			? css`
					transform: translateY(-${(p.offsetY ?? 0)}px) scale(${NEIGHBOR_SCALE});
					z-index: 1;
					filter: brightness(0.98) saturate(0.98);
				`
			: css`
					transform: translateY(0) scale(${OTHER_SCALE});
					filter: brightness(0.9) saturate(0.95);
				`}
`

const Arrow = styled.button<{ side: 'left' | 'right' }>`
	all: unset;
	position: absolute;
	top: 0;
	bottom: 0;
	${(p: { side: 'left' | 'right' }) => (p.side === 'left' ? 'left: 0;' : 'right: 0;')}
	display: grid;
	place-items: center;
	width: 44px;
	background: linear-gradient(
		to ${(p: { side: 'left' | 'right' }) => (p.side === 'left' ? 'right' : 'left')},
		rgba(0,0,0,0.35),
		rgba(0,0,0,0.0)
	);
	cursor: pointer;
	color: white;
	opacity: 0.6;
	transition: opacity 150ms ease;
	&:hover { opacity: 1; }
	z-index: 3;
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

export interface VCardCarouselProps {
	autoplay?: boolean
	interval?: number
}

export default function VCardCarousel({ autoplay = false, interval = 3500 }: VCardCarouselProps) {
	const { items, stagePadding } = useResponsive()
	const rootRef = React.useRef<HTMLDivElement>(null)
	const baseGames = React.useMemo<ExtendedGameBundle[]>(() => GAMES.filter((g) => !g.disabled), [])
	const base = baseGames.length
	const games = React.useMemo<ExtendedGameBundle[]>(() => [...baseGames, ...baseGames, ...baseGames], [baseGames])
	const [currentIdx, setCurrentIdx] = React.useState(base) // start centered block
	const [noTransition, setNoTransition] = React.useState(false)
  // baseGames/games control how many we render; base is original length

	// Measurements
		const [slideWidth, setSlideWidth] = React.useState(280)
		const gap = 28

	const recalc = React.useCallback(() => {
		const el = rootRef.current
		if (!el) return
		const viewport = el.clientWidth
		const inner = viewport - stagePadding * 2
		const width = Math.max(160, Math.floor((inner - gap * (items - 1)) / items))
		setSlideWidth(width)
	}, [items, stagePadding])

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
		const centerOffset = React.useMemo(() => {
			const viewport = rootRef.current?.clientWidth ?? 0
			const total = games.length * (slideWidth + gap) - gap + stagePadding * 2
			const leftOfCurrent = currentIdx * (slideWidth + gap) + stagePadding
			const centerOfCurrent = leftOfCurrent + slideWidth / 2
			const viewportCenter = viewport / 2
			const desired = centerOfCurrent - viewportCenter
			const maxX = Math.max(0, total - viewport)
			const x = Math.max(0, Math.min(desired, maxX))
			return x
		}, [currentIdx, gap, slideWidth, stagePadding, games.length])


		const prev = () => setCurrentIdx((i: number) => i - 1)
		const next = () => setCurrentIdx((i: number) => i + 1)

			// Basic drag-to-snap interaction
			const startX = React.useRef<number | null>(null)
			const dragged = React.useRef(false)

			const onPointerDown = (e: React.PointerEvent) => {
				startX.current = e.clientX
				dragged.current = false
				;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
			}

			const onPointerMove = (e: React.PointerEvent) => {
				if (startX.current == null) return
				const dx = e.clientX - startX.current
				if (Math.abs(dx) > 10) dragged.current = true
			}

			const onPointerUp = (e: React.PointerEvent) => {
				if (startX.current == null) return
				const dx = e.clientX - startX.current
				startX.current = null
				if (Math.abs(dx) < 30) return
				if (dx > 0) prev()
				else next()
			}

			const onWheel = (e: React.WheelEvent) => {
				if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
					e.preventDefault()
					if (e.deltaX > 0) next()
					else prev()
				}
			}

	return (
		<div>
					<CarouselRoot
						ref={rootRef}
						stagePadding={stagePadding}
						onPointerDown={onPointerDown}
						onPointerMove={onPointerMove}
						onPointerUp={onPointerUp}
						onWheel={onWheel}
					>
				<Arrow side="left" aria-label="Previous" onClick={prev}>
					‹
				</Arrow>
				<Track x={centerOffset} noTransition={noTransition} onTransitionEnd={() => {
						// Keep index within the middle block for seamless loop
						if (currentIdx < base) {
							setNoTransition(true)
							setCurrentIdx(currentIdx + base)
							requestAnimationFrame(() => setNoTransition(false))
						} else if (currentIdx >= base * 2) {
							setNoTransition(true)
							setCurrentIdx(currentIdx - base)
							requestAnimationFrame(() => setNoTransition(false))
						}
					}}>
									{games.map((game: ExtendedGameBundle, i: number) => {
										const active = i === currentIdx
										const neighbor = i === (currentIdx - 1 + games.length) % games.length || i === (currentIdx + 1) % games.length
										const baseHeight = slideWidth * 1.5 // aspect 2/3 -> h = w * 1.5
										const neighborOffset = 0.5 * CENTER_SCALE * baseHeight
										return (
											<Slide key={i} width={slideWidth} active={active} neighbor={neighbor} offsetY={neighbor ? neighborOffset : 0}>
												<div style={{ width: '100%', maxWidth: slideWidth }}>
													<GameCard game={game} aspectRatio={'2/3'} />
												</div>
											</Slide>
										)
									})}
				</Track>
				<Arrow side="right" aria-label="Next" onClick={next}>
					›
				</Arrow>
			</CarouselRoot>
					<Dots>
							{baseGames.map((_: ExtendedGameBundle, i: number) => (
								<Dot
									key={i}
									active={(currentIdx % base + base) % base === i}
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

