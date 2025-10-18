// src/sections/Footer.tsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  background: #646464b7;
  backdrop-filter: blur(20px);
  position: relative;
  bottom: 0;
  left: 0;
  z-index: 1000;
  margin-top: 50px;
`

const Logo = styled(NavLink)`
  height: 35px;
  margin: 0 15px;
  & > img {
    height: 120%;
  }
`

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin: 0 15px;
`

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: 0.9;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover {
    transform: scale(1.1);
    opacity: 1;
  }
`

export default function Footer() {
  const socials = [
    { name: 'X (Twitter)', icon: '/x.png', url: 'https://x.com/SolWin_Official' },
    { name: 'Telegram', icon: '/telegram.png', url: 'https://t.me/SOL_WIN_Casino' },
    { name: 'Linktree', icon: '/linktree.png', url: 'https://linktr.ee/Solwin_Casino' },
  ]

  return (
    <StyledFooter>
      <Logo to="/">
        <img alt="SOL-WIN logo" src="/logo.svg" />
      </Logo>

      <SocialLinks>
        {socials.map((social) => (
          <SocialIcon
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
          >
            <img alt={social.name} src={social.icon} />
          </SocialIcon>
        ))}
      </SocialLinks>
    </StyledFooter>
  )
}
