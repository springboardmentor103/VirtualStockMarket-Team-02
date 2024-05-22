import { useMemo } from "react";
import "./Ellipse.css";

const Ellipse = ({
  ellipseEllipse7,
  ellipseIconOverflow,
  ellipseIconPosition,
  ellipseIconTop,
  ellipseIconLeft,
}) => {
  const ellipseIconStyle = useMemo(() => {
    return {
      overflow: ellipseIconOverflow,
      position: ellipseIconPosition,
      top: ellipseIconTop,
      left: ellipseIconLeft,
    };
  }, [
    ellipseIconOverflow,
    ellipseIconPosition,
    ellipseIconTop,
    ellipseIconLeft,
  ]);

  return (
    <img
      className="ellipse-icon1"
      alt=""
      src={ellipseEllipse7}
      style={ellipseIconStyle}
    />
  );
};

export default Ellipse;
