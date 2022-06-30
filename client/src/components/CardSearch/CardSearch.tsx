import React from "react";
import "./CardSearch.scss";

function CardSearch({image, title, address}: {title:string, address:string, image:string}){
  return (

    <div className="card-search">
      <img src={`data:image/png;base64,${image}`} alt="" className="card-search__image" />
      <div className="card-search__block-data">
        <p className="card-search__block-data--tittle" >{title}</p>
        <span className="card-search__block-data--adress">{address}</span>
      </div>
    </div>

  );
};

export default CardSearch;
