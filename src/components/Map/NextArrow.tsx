import React from 'react';

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const NextArrow: React.FC<ArrowProps> = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "grey", borderRadius: "1rem"  }}
      onClick={onClick}
    />
  );
}

export default NextArrow;
