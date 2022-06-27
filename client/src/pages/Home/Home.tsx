import React from "react";
import "./Home.scss";
import NavBar from "../../components/NavBar/NavBar";
import CardHome from "../../components/CardHome/CardHome";
import character from '../../assets/images/Character.svg';
import background from '../../assets/images/Background.png';

const Home = () => {
  return (
    <div className="home-page">
      <CardHome />

      <div className="home-page__character">
        <img src={character} alt="" />
      </div>

      <div className="home-page__background">
        <img src={background} />
      </div>

      <NavBar />
    </div>
  );
};

export default Home;
