import styled from 'styled-components'
import { LANG_B_GRADIENT } from '../../styles'

export const StyledSlots = styled.div`
  perspective: 100px;
  user-select: none;
  position: relative;
  min-height: 100%;
  border-radius: 10px;
  /* Allow game UI (e.g., buttons) to extend outside without being clipped */
  overflow: visible;

  /* Background should always match device screen width */
  --slots-canvas-width: 100vw;

  & > div {
    position: relative; /* ensure content layers above decorative background */
    z-index: 1;
    display: grid;
    gap: 12px;
    width: var(--slots-canvas-width);
    margin: 0 auto; /* center overlay to match bg-image centering */
  }

  /* Oversized decorative background image that can extend beyond the frame */
  .bg-image {
    position: absolute;
    z-index: 0;
    pointer-events: none;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    width: var(--slots-canvas-width); /* match overlay width for perfect alignment */
    height: auto;
    filter: none;
    opacity: 1;
    image-rendering: -webkit-optimize-contrast;
  }

  .inline-header {
    display: block;
    height: clamp(28px, 6vw, 90px); /* responsive height */
    width: auto;
    margin: clamp(4px, 0.8vw, 10px) auto clamp(2px, 0.6vw, 8px); /* center horizontally with responsive gaps */
    image-rendering: -webkit-optimize-contrast;
  }

  @keyframes pulse {
    0%, 30% {
      transform: scale(1)
    }
    10% {
      transform: scale(1.3)
    }
  }

  @keyframes reveal-glow {
    0%, 30% {
      border-color: #2d2d57;
      background: #ffffff00;
    }
    10% {
      border-color: white;
      background: #ffffff33;
    }
  }

  @keyframes shine {
    0%, 30% {
      background: #ffffff00;
    }
    10% {
      background: #ffffff33;
    }
  }

  @keyframes result-flash {
    25%, 75% {
      filter: brightness(1.12) contrast(1.05);
    }
    50% {
      filter: brightness(1.02) contrast(1);
    }
  }
  @keyframes result-flash-2 {
    0%, 50% {
      filter: brightness(2) contrast(1.5) saturate(1.2);
    }
    100% {
      filter: brightness(1) contrast(1);
    }
  }

  .result {
    border: none;
    padding: clamp(8px, 1.2vw, 16px);
    text-transform: uppercase;
    position: relative;
    width: 100%;
    border-radius: clamp(8px, 1vw, 14px);
    border-spacing: 10px;
    border: 1px solid rgba(255,255,255,0.25);
    background: ${LANG_B_GRADIENT};
    color: #252C37;
    font-size: clamp(14px, 1.6vw, 20px);
    font-weight: bold;
    text-align: center;
  }

  .result[data-good="true"] {
    animation: result-flash 5s infinite;
  }

  .slots {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(16px, 2.5vw, 36px);
    width: 100%;
    justify-items: center;
    align-items: stretch;
    box-sizing: border-box;
    border-radius: 10px;
  }

  .slot::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }

  @keyframes reveal {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0%);
      opacity: 1;
    }
  }

  .slotImage {
    aspect-ratio: 1/1;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  /* Inline controls directly under the banner/result */
  .controls-inline {
    display: flex;
    gap: 12px;
    justify-content: center;
    align-items: stretch;
    margin-top: 6px;
    position: relative;
    z-index: 20; /* ensure above reels/overlays so they're never visually clipped */
    
    /* Scale buttons/inputs with viewport width (scoped to Slots only) */
    & .gamba-ui-button,
    & .gamba-ui-input,
    & .gamba-ui-select button {
      font-size: clamp(14px, 1.6vw, 20px) !important;
      min-height: clamp(38px, 5.2vw, 56px) !important;
      padding: 0 clamp(10px, 1.2vw, 16px) !important;
    }
  }

  .controls-inline > * {
    flex: 0 1 auto;
  }

  @media (max-width: 600px) {
    .controls-inline {
      flex-direction: column;
      align-items: center;
    }
    .controls-inline > * {
      width: 100%;
      max-width: 360px;
    }
  }
`
