import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

interface IconNoConnectionProps extends SvgProps {
  color?: string;
}

const IconNoConnection = ({ color, ...props }: IconNoConnectionProps) => (
  <Svg fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      stroke={color || "#3e009c"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.85 11.544a8 8 0 0 0-2.88-1.972m5.806-.756a12 12 0 0 0-9.488-3.795m-2.945 9.57a5 5 0 0 1 4.902-1.434m-7.096-1.613A8 8 0 0 1 9.623 9.36m-6.4-.545a12 12 0 0 1 3.11-2.393M4.413 4l14.142 14.142M12 19a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
    />
  </Svg>
);
export default IconNoConnection;
