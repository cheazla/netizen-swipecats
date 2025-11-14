import React from "react";

interface Props {
  url: string;
  style?: React.CSSProperties;
}

const Card: React.FC<Props> = ({ url, style }) => {
  return (
    <div className="card" style={style}>
      <img src={url} alt="cat" />
    </div>
  );
};

export default Card;
