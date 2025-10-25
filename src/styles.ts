import styled from 'styled-components'

export const MainWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  transition: width .25s ease, padding .25s ease, margin-top .25s ease;
  margin: 0 auto;
  /* Remove extra top padding so content sits closer to the header */
  padding: 0 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* Place content directly under the fixed header */
  margin-top: calc(var(--header-height, 60px));
  @media (min-width: 600px) {
    padding: 0 20px 20px;
    width: 1000px;
  }
  @media (min-width: 1280px) {
    padding: 0 20px 20px;
    width: 1100px;
  }

  /* Mobile: remove horizontal padding so the game screen can be edge-to-edge */
  @media (max-width: 600px) {
    padding: 0 0 10px;
  }
`

export const TosWrapper = styled.div`
  position: relative;
  &:after {
    content: " ";
    background: linear-gradient(180deg, transparent, #15151f);
    height: 50px;
    pointer-events: none;
    width: 100%;
    position: absolute;
    bottom: 0px;
    left: 0px;
  }
`

export const TosInner = styled.div`
  max-height: 400px;
  padding: 10px;
  overflow: auto;
  position: relative;
`

// Gradient extracted from buttons/lang-b.svg (approximated)
// Now linear from left (start) to right (end)
export const LANG_B_GRADIENT =
  // Keep palette, but make the lightest area only a tiny sliver in the top-right corner
  'linear-gradient(to top right, #00D596 0%, #1FE0A0 20%, #36E4A9 40%, #63ECBB 65%, #90F4CE 88%, #CBFFE3 99%, #CBFFE3 100%)'
