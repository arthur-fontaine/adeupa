import React from "react";

function PersonalizationColor({ color, id }: { color: string; id: string }) {
  return (
    <li
      className="customization__ul__li li--color"
      id={id}
      style={{ backgroundColor: color }}
    ></li>
  );
}

export default PersonalizationColor;
