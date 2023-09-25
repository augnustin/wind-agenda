import ReactSlider from "react-slider";

import styled from "styled-components";

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 20px;
`;

const StyledThumb = styled.div`
  height: 30px;
  line-height: 30px;
  width: 30px;
  text-align: center;
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  cursor: grab;
  top: -5px;
  margin-bottom: 2rem;
`;

const Thumb = (props, state) => <StyledThumb {...props}>{state.valueNow}</StyledThumb>;

const sliderLabel = (index) => {
  if (index === 0) return "Trop faible";
  if (index === 1) return "Vent modéré";
  if (index === 2) return "Vent fort";
  return "Trop fort";
};

const sliderBackground = (index) => {
  if (index === 1) return "var(--bs-green)";
  if (index === 2) return "var(--bs-orange)";
  if (index === 3) return "rgba(255, 0, 0, 0.1)";
  return "#ddd";
};

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${(props) => sliderBackground(props["data-index"])};
  border-radius: 999px;
  text-align: center;
  font-size: 0.75rem;
  &:after {
    content: "${(props) => sliderLabel(props["data-index"])}";
    position: relative;
    bottom: -2rem;
  }
`;

const Track = (props, state) => <StyledTrack {...props} data-index={state.index} />;

export default (props) => {
  return <StyledSlider renderTrack={Track} renderThumb={Thumb} {...props} />;
};
