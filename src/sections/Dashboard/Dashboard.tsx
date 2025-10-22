import React from 'react'
import styled from 'styled-components'
import { SlideSection } from '../../components/Slider'
import { VCardCarousel } from '../../components/VCardCarousel'
import { GAMES } from '../../games'
import { GameCard } from './GameCard'
import { WelcomeBanner } from './WelcomeBanner'
// src/sections/Dashboard/Dashboard.tsx
import FeaturedInlineGame from './FeaturedInlineGame'



export function GameSlider() {
  return (
    <SlideSection>
      {GAMES.filter((game) => !game.disabled).map((game) => (
        <div key={game.id} style={{ width: '160px', display: 'flex' }}>
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

export function GameGrid() {
  return (
    <Grid>
      {GAMES.filter((game) => !game.disabled).map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </Grid>
  )
}


const unterBannerImg = new URL('../../../unter_banner.gif', import.meta.url).href;
const UnterBannerImg = styled.img`
  display: block;
  max-width: 100%;
  height: auto;
  margin: 16px auto 16px auto;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
`;

export default function Dashboard() {
  return (
    <>
      <WelcomeBanner />
  <UnterBannerImg src={unterBannerImg} alt="Unter Banner" />
      {/* Futuristic V-shaped Card Carousel (fan layout) */}
      <div style={{ margin: '10px 0 20px 0' }}>
        <VCardCarousel
          items={GAMES.filter(g => !g.disabled).map(g => ({
            id: g.id,
            title: g.meta.name,
            image: g.meta.image,
            tag: g.meta.tag,
          }))}
        />
      </div>
      <FeaturedInlineGame />
      <GameGrid />
    </>
  )
}