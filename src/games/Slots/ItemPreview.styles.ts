import styled from "styled-components";

export const StyledItemPreview = styled.div`
  display: flex;
  gap: 5px;

  & > div {
    position: relative;
    width: 50px;
    aspect-ratio: 1/1.5;
    border-radius: 5px;
    border: 1px solid #2d2d57;
    background: #ECD11E; /* Match button yellow */
    /* Allow multiplier badge to render outside the tile without being clipped */
    overflow: visible;
  }

  & > div.hidden {
    opacity: .5;
  }

  & > div > .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  & > div > .multiplier {
    display: none; /* Hide multiplier badges (x0.5, x1, x2, ...) */
  }

`
