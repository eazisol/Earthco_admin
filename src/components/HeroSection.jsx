import React from 'react';
import { CustomButton } from './CustomButton';
import { useNavigate } from "react-router";
const HeroSection = () => {
   let navigate = useNavigate();
  return(
  
  <section id="hero" className="d-flex align-items-center">
    <div className="container">
      <div className="row">
        <div
          className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h1>Transforming Outdoor Spaces with Excellence</h1>
          <h2 style={{color:"white"}}>
            We are Earthco — experts in landscape design, maintenance, and
            beautification for commercial and residential properties.
          </h2>
          <div className="d-flex justify-content-center justify-content-lg-start">
            <CustomButton  onClick={()=> navigate("/register")}/>
          </div>
        </div>
        {/* No right column image, background is set via CSS */}
      </div>
    </div>
  </section>
)};

export default HeroSection; 