import React from "react";
import "./CardHome.scss";

const Cardhome = () => {
  return (
    <div className="card">
      <div className="card__content">
        <div className="card__img">
          <div className="card__like">
            <i className="ri-heart-line"></i>
          </div>

          <img src="https://images.unsplash.com/photo-1583564345817-9735ebbc0569?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80" />

          <svg width="0" height="0">
            <defs>
              <clipPath id="badge" clipPathUnits="objectBoundingBox">
                <path
                  transform="scale(0.003076923076923077,0.004169446361194832)"
                  d="M0 8C0 3.58172 3.58172 0 8 0H317C321.418 0 325 3.58172 325 8V202.127C325 205.929 322.345 209.201 318.619 209.958C289.564 215.853 170.833 239.84 162.5 239.84C154.167 239.84 35.4363 215.853 6.38121 209.958C2.65463 209.201 0 205.929 0 202.127V8Z"
                  fill="#D9D9D9"
                />
              </clipPath>
            </defs>
          </svg>
        </div>

        <div className="card__description">
          <h1 className="card__title">Boulangerie du Marais</h1>

          <div className="card__stats">
            <h3 className="mention">
              <div className="distance">
                <i className="ri-route-line"></i>
                <span>500m</span>
              </div>

              <div className="like">
                <i className="ri-heart-line"></i>
                <span>2200</span>
              </div>
            </h3>
          </div>

          <div className="card__badges">
            <div className="card__badge">Alimentation</div>
            <div className="card__badge">Baguette</div>
          </div>
        </div>
      </div>

      <footer>
        <div className="card__footer-background"></div>

        <div className="card__button-container">
          <div className="card__button">Voir plus</div>
        </div>
      </footer>
    </div>
  );
};

export default Cardhome;
