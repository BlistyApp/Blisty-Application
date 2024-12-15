import React from "react";
import Svg, { Path } from "react-native-svg";

interface WaveBackgroundProps {
  color?: string;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

const WaveBackground = ({
  color,
  top,
  left,
  bottom,
  right,
}: WaveBackgroundProps) => {
  return (
    <Svg
      height="40%"
      width="120%"
      viewBox="0 0 1440 320"
      style={{
        position: "absolute",
        top: top || 0,
        left: left || 0,
        bottom: bottom || 0,
        right: right || 0,
      }}
    >
      <Path
        fill={color || "#1b0043"}
        d="M0,160L60,186.7C120,213,240,267,360,261.3C480,256,600,192,720,181.3C840,171,960,213,1080,218.7C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
      />
    </Svg>
  );
};

export default WaveBackground;
