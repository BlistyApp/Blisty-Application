import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

interface Icon404Props extends SvgProps {
  color?: string;
}

const Icon404 = ({ color, ...props }: Icon404Props) => (
  <Svg viewBox="0 0 448 448" {...props}>
    <Path
      d="M448 64H0v360c0 13.254 10.746 24 24 24h400c13.254 0 24-10.746 24-24zm-104 80h32v16h-32zm-224 0h208v16H120zm144 72v72c0 13.254-10.746 24-24 24h-32c-13.254 0-24-10.746-24-24v-72c0-13.254 10.746-24 24-24h32c13.254 0 24 10.746 24 24zM72 144h32v16H72zm-7.2 139.473a7.998 7.998 0 0 1 .962-8.473l64-80a7.993 7.993 0 0 1 8.886-2.543A8.004 8.004 0 0 1 144 200v72h24v16h-24v24h-16v-24H72a8 8 0 0 1-7.2-4.527zM104 360H72v-16h32zm224 0H120v-16h208zm48 0h-32v-16h32zm8-72h-24v24h-16v-24h-56a8.005 8.005 0 0 1-7.215-4.535 7.995 7.995 0 0 1 .969-8.465l64-80A8 8 0 0 1 360 200v72h24zm0 0"
      fill={color || "#3e009c"}
    />
    <Path
      d="M128 222.809 88.648 272H128zM208 208h32a8 8 0 0 1 8 8v72a8 8 0 0 1-8 8h-32a8 8 0 0 1-8-8v-72a8 8 0 0 1 8-8zM344 272v-49.191L304.648 272zM448 24c0-13.254-10.746-24-24-24H24C10.746 0 0 10.746 0 24v24h448zM48 32H32V16h16zm32 0H64V16h16zm32 0H96V16h16zm272 0H160V16h224zm0 0"
      fill={color || "#3e009c"}
    />
  </Svg>
);
export default Icon404;
