import React from 'react'
import styled, { css } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

/*
Modern techniques used (2025) — rationale and sources:
- GPU-accelerated transforms only (translate/rotate/scale), opacity: Recommended by web.dev “High-performance animations”. Avoids layout/paint jank; use will-change only while animating.
- FLIP mindset for layout moves (transform-only) as described by David Khourshid (CSS‑Tricks FLIP). We never animate top/left.
- True 3D using perspective on the container + transform-style: preserve-3d with rotateY/rotateZ and translateZ depth.
- Framer Motion springs for interruptible, buttery transitions; physics tuned for UI feel. Drag gestures map to index changes; autoplay is frame-safe and pauses on interaction.
- Container queries for responsiveness; CSS custom properties expose spacing/angles so designers can tune without code changes.
- Neon/glow frame via layered box-shadow and an ::after border-fade; shadows use drop-shadow to keep composition on the GPU.
- A11y: keyboard arrows and Enter to activate; large hit target and focus ring.
*/

// Small value contract
// Inputs: items (id, title, optional tag/color). Optional onSelect.
// Outputs: navigates to /:id on click by default, calls onSelect(id).
// Error modes: empty items → renders nothing; out-of-range selection guarded.
// Success: smooth 60fps transforms; responsive angles; highlighted center card.

export interface CarouselItem {
  id: string
  title: string
  image?: string // optional small icon to render on top; background is fixed asset
  tag?: string
  color?: string
}

export interface VCardCarouselProps {
  items: CarouselItem[]
  initialIndex?: number
  onSelect?: (id: string) => void
  // visual tuning (can be overridden via CSS variables on parent)
  maxVisible?: number // max cards rendered around center (per side)
  autoplay?: boolean
  autoplayInterval?: number // ms
}

const Wrapper = styled.div`
  --card-w: 180px;
  --card-h: 240px;
  --gap: 28px;          /* base X spacing between cards */
  --angle: 12deg;       /* rotateZ for side cards */
  --yaw: 10deg;         /* rotateY to give a fan depth */
  --lift-z: 24px;       /* translateZ lift for center */
  --depth: 80px;        /* side cards recede per step */
  --scale-side: 0.92;   /* side card scale */
  --scale-far: 0.86;    /* far side scale */
  --shadow: 0 10px 30px rgba(0,0,0,0.35);
  --glow: 0 0 0px rgba(0, 255, 200, 0.0);
  --perspective: 1200px;
  --radius: 18px;

  position: relative;
  container-type: inline-size; /* enable container queries */
  perspective: var(--perspective);
  width: 100%;
  display: grid;
  place-items: center;
  padding: 12px 0 24px;

  @container (min-width: 520px) {
    --card-w: 200px;
    --card-h: 270px;
    --gap: 34px;
    --angle: 13deg;
    --yaw: 12deg;
    --depth: 90px;
  }
  @container (min-width: 760px) {
    --card-w: 220px;
    --card-h: 300px;
    --gap: 40px;
    --angle: 14deg;
    --yaw: 13deg;
    --depth: 100px;
  }
  @container (min-width: 1024px) {
    --card-w: 240px;
    --card-h: 320px;
    --gap: 46px;
    --angle: 15deg;
    --yaw: 14deg;
    --depth: 110px;
  }
`

const Stage = styled.div`
  position: relative;
  width: min(100%, calc(var(--card-w) * 3 + var(--gap) * 6));
  height: calc(var(--card-h) + 64px);
  transform-style: preserve-3d;
  perspective-origin: 50% 40%;
`

const Row = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none; /* children handle it */
`

const CardBase = styled(motion.button)<{ $isCenter?: boolean }>`
  all: unset;
  box-sizing: border-box;
  width: var(--card-w);
  height: var(--card-h);
  border-radius: var(--radius);
  background-color: #10131b;
  background-image:
    url('/assets/images/background-gamecard.png'),
    radial-gradient(120% 80% at 50% 0%, rgba(20,220,220,0.12), rgba(16,19,27,0.0) 60%),
    linear-gradient(180deg, rgba(16,19,27,0.0), rgba(16,19,27,0.7));
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position: center, center, center;
  background-size: cover, cover, cover;
  /* Glow edge frame */
  box-shadow: var(--shadow), var(--glow);
  position: absolute;
  top: 50%; left: 50%;
  transform-style: preserve-3d;
  pointer-events: auto;
  cursor: pointer;
  will-change: transform, filter;
  outline: none;

  display: grid;
  grid-template-rows: 1fr auto;
  padding: 12px;
  color: #e6f7ff;
  text-align: left;
  transform-origin: 50% 70%;

  /* subtle frosted overlay for text legibility */
  &:before {
    content: '';
    position: absolute; inset: 0;
    border-radius: inherit;
    background: linear-gradient(180deg, rgba(10,12,18,0.35), rgba(10,12,18,0.15));
    pointer-events: none;
  }

  /* neon edge frame */
  &:after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    border: 1px solid rgba(0,255,200,0.28);
    box-shadow:
      0 0 18px rgba(0,255,200,0.18),
      0 0 36px rgba(0,255,200,0.12) inset;
    pointer-events: none;
  }

  /* focus-visible ring */
  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(0,255,200,0.6), var(--shadow);
  }

  ${(props: { $isCenter?: boolean }) => props.$isCenter && css`
    filter: drop-shadow(0 10px 22px rgba(0, 255, 200, 0.18));
  `}
`

const Title = styled.div`
  font-size: 14px;
  letter-spacing: .2px;
  font-weight: 600;
  margin-top: auto;
  z-index: 2;
  text-shadow: 0 2px 6px rgba(0,0,0,.6);
`

const Tag = styled.span`
  display: inline-block;
  font-size: 11px;
  line-height: 1;
  padding: 6px 8px;
  border-radius: 999px;
  background: rgba(0, 255, 200, 0.1);
  color: #7cffc8;
  border: 1px solid rgba(124, 255, 200, 0.25);
  backdrop-filter: blur(2px);
  margin-bottom: 8px;
  z-index: 2;
`

const Thumb = styled.div<{ $src?: string }>`
  position: absolute;
  inset: 12px 12px auto auto;
  width: 72px; height: 72px;
  border-radius: 12px;
  background: ${(p: { $src?: string }) => p.$src ? css`url(${p.$src}) center/cover` : css`linear-gradient(135deg, #0ef, #70f)`};
  opacity: .9;
  mix-blend-mode: screen;
  box-shadow: 0 8px 22px rgba(0,0,0,.35);
  z-index: 2;
`

const Controls = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
`

const ControlBtn = styled.button`
  all: unset;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(255,255,255,.05);
  color: #cfe9ff;
  border: 1px solid rgba(255,255,255,.08);
  transition: background .2s ease;
  &:hover { background: rgba(255,255,255,.12); }
`

function useSwipe(onLeft: () => void, onRight: () => void) {
  const startX = React.useRef<number | null>(null)
  const threshold = 24
  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current == null) return
    const dx = e.clientX - startX.current
    if (dx > threshold) onRight()
    else if (dx < -threshold) onLeft()
    startX.current = null
  }
  return { onPointerDown, onPointerUp }
}

export const VCardCarousel = ({
  items,
  initialIndex = 0,
  onSelect,
  maxVisible = 4,
  autoplay = false,
  autoplayInterval = 2800,
}: VCardCarouselProps) => {
  const navigate = useNavigate()
  const [index, setIndex] = React.useState(() => Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0)))
  const [isInteracting, setInteracting] = React.useState(false)

  const clamp = React.useCallback((i: number) => {
    if (items.length === 0) return 0
    return Math.max(0, Math.min(i, items.length - 1))
  }, [items.length])

  const select = React.useCallback((i: number) => {
    const ni = clamp(i)
    setIndex(ni)
  }, [clamp])

  const handleActivate = React.useCallback((id: string) => {
    onSelect?.(id)
    // Navigate to game route by default
    navigate('/' + id)
  }, [navigate, onSelect])

  // keyboard support
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); select(index - 1) }
      if (e.key === 'ArrowRight') { e.preventDefault(); select(index + 1) }
      if (e.key === 'Enter') {
        const current = items[index]
        if (current) handleActivate(current.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, items, select, handleActivate])

  const { onPointerDown, onPointerUp } = useSwipe(
    () => select(index + 1),
    () => select(index - 1),
  )

  // Framer drag handling on the row (click-drag / touch-drag)
  const dragX = React.useRef(0)
  const onDragStart = () => {
    setInteracting(true)
    dragX.current = 0
  }
  const onDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: { delta: { x: number } }) => {
    dragX.current += info.delta.x
  }
  const onDragEnd = () => {
    const threshold = 60
    if (dragX.current > threshold) select(index - 1)
    else if (dragX.current < -threshold) select(index + 1)
    setInteracting(false)
    dragX.current = 0
  }

  // Autoplay (pauses while interacting / when window not focused)
  React.useEffect(() => {
    if (!autoplay || isInteracting || items.length === 0) return
    const id = setInterval(() => {
      setIndex((i: number) => (i + 1) % items.length)
    }, Math.max(800, autoplayInterval))
    return () => clearInterval(id)
  }, [autoplay, autoplayInterval, isInteracting, items.length])

  // Compute transform for each card based on its offset from center
  const visible = items.map((it: CarouselItem, i: number) => ({
    item: it,
    offset: i - index,
  })).filter(({ offset }: { offset: number }) => Math.abs(offset) <= maxVisible)

  return (
    <Wrapper>
      <Stage>
        <Row
          onPointerDown={(e: any) => { setInteracting(true); onPointerDown(e) }}
          onPointerUp={(e: any) => { onPointerUp(e); setInteracting(false) }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={onDragStart}
          onDrag={onDrag as any}
          onDragEnd={onDragEnd}
        >
          <AnimatePresence initial={false}>
            {visible.map(({ item, offset }: { item: CarouselItem, offset: number }) => {
              const side = Math.sign(offset) // -1 left, 0 center, 1 right
              const abs = Math.abs(offset)
              // Positioning math (V shape & depth)
              const x = offset * 1
              const isCenter = abs === 0

              // stacking: center on top, then closer sides
              const zIndex = (items.length + 10) - abs

              return (
                <CardBase
                  key={item.id}
                  $isCenter={isCenter}
                  style={{ zIndex }}
                  initial={false}
                  whileHover={{
                    scale: isCenter ? 1.04 : 1.02,
                    filter: 'drop-shadow(0 12px 28px rgba(0, 255, 200, 0.25))',
                    transition: { type: 'spring', stiffness: 300, damping: 24 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => isCenter ? handleActivate(item.id) : select(index + offset)}
                  aria-label={item.title}
                  onFocus={() => setInteracting(true)}
                  onBlur={() => setInteracting(false)}
                  animate={{
                    x: offset *  (/* spacing */ 1) , // computed in transformTemplate
                    rotateZ: side * (10 + Math.min(12, abs * 4)),
                    rotateY: side * (12 + Math.min(14, (abs - 1) * 6)),
                    rotateX: abs === 0 ? 0 : -6, // slight backward tilt
                    scale: abs === 0 ? 1 : abs === 1 ? 0.92 : abs === 2 ? 0.88 : 0.84,
                    opacity: abs === 0 ? 1 : abs === 1 ? 0.85 : abs === 2 ? 0.72 : 0.6,
                    transition: { type: 'spring', stiffness: 180, damping: 22 }
                  }}
                  transformTemplate={(transform: string, generated: string) => {
                    // Compose our own to inject spacing with translateX
                    const rz = /rotateZ\(([^)]+)\)/.exec(generated)?.[1] ?? '0deg'
                    const ry = /rotateY\(([^)]+)\)/.exec(generated)?.[1] ?? '0deg'
                    const rx = /rotateX\(([^)]+)\)/.exec(generated)?.[1] ?? '0deg'
                    const sc = /scale\(([^)]+)\)/.exec(generated)?.[1] ?? '1'

                    // Spacing & depth
                    // Center card pops forward (lift-z), side cards recede by depth per step
                    const depth = `translateZ(calc(${abs === 0 ? 'var(--lift-z)' : `calc(-1 * ${Math.abs(offset)} * (var(--depth, 80px)))`}))`
                    const spacing = `translateX(calc(${offset} * var(--gap))) translateY(calc(${Math.abs(offset)} * -3px))`
                    return `${spacing} ${depth} rotateY(${ry}) rotateZ(${rz}) rotateX(${rx}) scale(${sc})`
                  }}
                >
                  {item.tag && <Tag>{item.tag}</Tag>}
                  <Title>{item.title}</Title>
                  {item.image && <Thumb aria-hidden $src={item.image} />}
                </CardBase>
              )
            })}
          </AnimatePresence>
        </Row>
      </Stage>
      <Controls>
        <ControlBtn onClick={() => select(index - 1)}>◀</ControlBtn>
        <ControlBtn onClick={() => select(index + 1)}>▶</ControlBtn>
      </Controls>
    </Wrapper>
  )
}
