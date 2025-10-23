// src/components/GameCard.tsx
import React from 'react';
import { GameBundle } from 'gamba-react-ui-v2';
import { NavLink, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const tileAnimation = keyframes`
  0%   { background-position: -100px 100px; }
  100% { background-position: 100px -100px; }
`;

const StyledGameCard = styled.div<{ $small: boolean; $disabled?: boolean; $aspectRatio?: string }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};

  width: 100%;
  aspect-ratio: ${({ $aspectRatio, $small }) => ($aspectRatio ? $aspectRatio : ($small ? '1/.5' : '1/.6'))};
  background: transparent; /* Let a dedicated bottom strip handle the background tone */
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 24px;
  transition: transform 0.2s ease;

  /* Bottom background strip (footer tone), only visible below the image */
  & > .bottom-bg {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 30%;
    background: #252C37; /* Footer tone */
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    z-index: 0;
  }

  & > .image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.2s ease, opacity 0.3s ease;
  }

  & > .image {
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    transform: none;
    z-index: 1; /* Over the bottom-bg, so color is only visible below */
  }

  & > .play {
    position: absolute;
    bottom: 5px;
    right: 5px;
    padding: 5px 10px;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    text-transform: uppercase;
    opacity: 1; /* Always visible */
    backdrop-filter: blur(20px);
    transition: opacity 0.2s ease;
    z-index: 2;
  }

  & > .disabled-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(128,128,128,0.5);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #fff;
    pointer-events: none;
    border-radius: 10px;
    backdrop-filter: blur(2px);
    text-align: center;
    white-space: pre-line;
    padding: 0 10px;
  }

  @media (max-width: 600px) {
    & > .disabled-overlay {
      font-size: 16px;
      padding: 0 5px;
      line-height: 1.3;
    }
  }

  &:hover {
    transform: scale(1.01);
    outline: 5px solid rgba(149, 100, 255, 0.2);
    outline-offset: 0;
    & > .image {
      transform: none;
    }
  }
`;

// New badge for the “VS” tag (or any other tag you choose)
const Tag = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 4px;
  text-transform: uppercase;
  z-index: 2;
`;

export function GameCard({
  game,
  aspectRatio,
}: {
  game: GameBundle & { meta: { tag?: string; [key: string]: any }, disabled?: boolean };
  aspectRatio?: string;
}) {
  const small = useLocation().pathname !== '/';

  const CardContent = (
    <StyledGameCard
      $small={small}
      $disabled={game.disabled}
      $aspectRatio={aspectRatio}
    >
      <div className="bottom-bg" />
      {game.meta.tag && <Tag>{game.meta.tag}</Tag>}
      <div
        className="image"
        style={{ backgroundImage: `url(${game.meta.image})` }}
      />
      <div className="play">Play {game.meta.name}</div>
      {game.disabled && (
        <div className="disabled-overlay">new game<br />coming soon!</div>
      )}
    </StyledGameCard>
  );

  return game.disabled ? CardContent : (
    <NavLink to={`/${game.id}`}>{CardContent}</NavLink>
  );
}
