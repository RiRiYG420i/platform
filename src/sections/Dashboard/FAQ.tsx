import React, { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  gap: 12px;
  margin: 16px 0 8px;
`

const Item = styled.div`
  background: rgba(37, 44, 55, 0.6);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  overflow: hidden;
`

const Question = styled.button<{ $open: boolean }>`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  background: ${(p)=> p.$open ? 'rgba(255,255,255,0.05)' : 'transparent'};
`

const Answer = styled.div<{ $open: boolean }>`
  max-height: ${(p)=> p.$open ? '800px' : '0'};
  overflow: hidden;
  transition: max-height 220ms ease;
  padding: ${(p)=> p.$open ? '0 16px 14px' : '0 16px 0'};
  color: #cfd3da;
  line-height: 1.5;
`

interface QA { q: string; a: React.ReactNode }

const DEFAULT_QA: QA[] = [
  { q: 'How does the platform work?', a: 'Choose a game, select your token and wager, then play. Results are computed on-chain and are provably fair.' },
  { q: 'Which wallets are supported?', a: 'Any Solana wallet supported by the wallet adapter (Phantom, Solflare, Backpack, and more).' },
  { q: 'What fees apply?', a: 'Small creator and jackpot fees may apply per wager. See Jackpot info and platform constants for exact rates.' },
  { q: 'Is it provably fair?', a: 'Yes. Games are powered by on-chain randomness and can be verified via the explorer.' },
  { q: 'How do I withdraw winnings?', a: 'Winnings are credited directly to your connected wallet balance.' },
]

export default function FAQ({ items = DEFAULT_QA }: { items?: QA[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  return (
    <Wrapper>
      {items.map((it, i) => {
        const open = openIndex === i
        return (
          <Item key={i}>
            <Question $open={open} onClick={() => setOpenIndex(open ? null : i)}>
              <span>{it.q}</span>
              <span aria-hidden> {open ? '−' : '+'} </span>
            </Question>
            <Answer $open={open}>{it.a}</Answer>
          </Item>
        )
      })}
    </Wrapper>
  )
}
