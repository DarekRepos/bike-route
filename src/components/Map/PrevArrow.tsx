import React from 'react';

interface PrevArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const PrevArrow: React.FC<PrevArrowProps> = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "grey", borderRadius: "1rem"  }}
      onClick={onClick}
    />
  );
}

export default PrevArrow;
