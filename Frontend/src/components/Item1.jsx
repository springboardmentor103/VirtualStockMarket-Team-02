import { useMemo } from "react";
import styles from "./Item1.module.css";
import logo8 from "../Images/-icon.svg";
const Item1 = ({
  fullName,
  linhNguyenPlaceholder,
  propBackgroundColor,
  propDisplay,
  propMinWidth,
  propWidth,
}) => {
  const titleStyle = useMemo(() => {
    return {
      backgroundColor: propBackgroundColor,
    };
  }, [propBackgroundColor]);

  const fullNameStyle = useMemo(() => {
    return {
      display: propDisplay,
      minWidth: propMinWidth,
    };
  }, [propDisplay, propMinWidth]);

  const linhNguyenStyle = useMemo(() => {
    return {
      width: propWidth,
    };
  }, [propWidth]);

  return (
    <div className={styles.item}>
      <div className={styles.inputstextFieldselected}>
        <div className={styles.line} />
        <img className={styles.icon} alt="" src={logo8} />
        <div className={styles.title} style={titleStyle}>
          <div className={styles.fullName} style={fullNameStyle}>
            {fullName}
          </div>
        </div>
        <input
          className={styles.linhNguyen}
          placeholder={linhNguyenPlaceholder}
          type="text"
          style={linhNguyenStyle}
        />
      </div>
    </div>
  );
};

export default Item1;
