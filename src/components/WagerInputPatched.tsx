import React from 'react'
import { GambaUi } from 'gamba-react-ui-v2'

type AnyProps = any

export function WagerInputPatched(props: AnyProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const root = ref.current
    if (!root) return
    const buttons = Array.from(root.querySelectorAll('button')) as HTMLButtonElement[]
    buttons.forEach((btn) => {
      const raw = (btn.textContent || '').trim()
      const norm = raw.toLowerCase().replace(/\s+/g, '').replace('×', 'x')
      // Normalize labels
      if (norm === 'x.5' || norm === '.5x' || norm === '0.5x' || norm === 'x0.5') {
        btn.textContent = 'x 0.5'
        btn.classList.add('wager-multiplier-patched')
      }
      if (norm === '2x' || norm === 'x2') {
        btn.textContent = 'x 2'
        btn.classList.add('wager-multiplier-patched')
      }
    })
  }, [props?.value])

  return (
    <div ref={ref} className="wager-input-patched">
      <GambaUi.WagerInput {...props} />
    </div>
  )
}
