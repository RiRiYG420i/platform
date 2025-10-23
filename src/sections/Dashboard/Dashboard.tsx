import React from 'react'
import styled from 'styled-components'
import { SlideSection } from '../../components/Slider'
import { GAMES } from '../../games'
import { GameCard } from './GameCard'
import { WelcomeBanner } from './WelcomeBanner'
import VCardCarousel from '../../components/VCardCarousel'
import LeaderboardsPanel from '../LeaderBoard/LeaderboardsPanel'
import FAQ from './FAQ'
import { PLATFORM_CREATOR_ADDRESS } from '../../constants'
// src/sections/Dashboard/Dashboard.tsx
import FeaturedInlineGame from './FeaturedInlineGame'



export function GameSlider() {
  return (
    <SlideSection>
      {GAMES.filter((game) => !game.disabled).map((game, i) => (
        <div key={i} style={{ width: '160px', display: 'flex' }}>
          <GameCard game={game} />
        </div>
      ))}
    </SlideSection>
  )
}

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (min-width: 600px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (min-width: 800px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

export function GameGrid() { return null }


// Removed unter_banner.gif image in favor of an always-visible Leaderboard panel

export default function Dashboard() {
  return (
    <>
      <WelcomeBanner />
      <VCardCarousel autoplay interval={4000} />
      <LeaderboardsPanel creator={PLATFORM_CREATOR_ADDRESS.toBase58()} />
      <FAQ />
    </>
  )
}