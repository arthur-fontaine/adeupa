import React from "react";

function PersonalizationClothes({ color, id }: { color: string; id: string }) {
  return (
    <li
      className="customization__ul__li li--clothes"
      id={id}
      style={{ backgroundColor: color }}
    ></li>
  );
}

export default PersonalizationClothes;
