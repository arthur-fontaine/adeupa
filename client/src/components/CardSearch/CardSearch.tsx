import React from "react";
import "./CardSearch.scss";

function CardSearch({image, title, adress}: {title:string, adress:string, image:string}){
  return (

    <div className="card-search">
      <img src={`data:image/png;base64,${image}`} alt="" className="card-search__image" />
      <div className="card-search__block-data">
        <p className="card-search__block-data--tittle" >{title}</p>
        <span className="card-search__block-data--adress">{adress}</span>
      </div>
    </div>
    
  );
};

export default CardSearch;
