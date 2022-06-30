import React from "react";

function PersonalizationBackground({
  color,
  id,
}: {
  color: string;
  id: string;
}) {
  return (
    <li
      className="customization__ul__li li--background"
      id={id}
      style={{ backgroundColor: color }}
    ></li>
  );
}

export default PersonalizationBackground;
