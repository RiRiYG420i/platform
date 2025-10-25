import styled from 'styled-components'
import { LANG_B_GRADIENT } from '../../styles'

export const StyledSlots = styled.div`
  perspective: 100px;
  user-select: none;
  position: relative;
  min-height: 100%;
  border-radius: 10px;
  overflow: hidden;

  & > div {
    display: grid;
    gap: 12px;
    transform: rotateX(3deg) rotateY(0deg);
  }

  .inline-header {
    display: block;
    height: 28px; /* make header much smaller */
    width: auto;
    margin: 4px auto 2px; /* center horizontally */
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
    padding: 10px;
    text-transform: uppercase;
    position: relative;
    padding: 10px;
    width: 100%;
    border-radius: 10px;
    border-spacing: 10px;
    border: 1px solid rgba(255,255,255,0.25);
    background: ${LANG_B_GRADIENT};
    color: #252C37;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }

  .result[data-good="true"] {
    animation: result-flash 5s infinite;
  }

  .slots {
    display: flex;
    gap: 20px;
    justify-content: center;
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
  }

  /* Inline controls directly under the banner/result */
  .controls-inline {
    display: flex;
    gap: 12px;
    justify-content: center;
    align-items: stretch;
    margin-top: 6px;
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
