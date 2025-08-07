 
 export const CustomButton=({text="Get Started", onClick, className,disabled=false})=>{
    return(
        <button  className={`btn-get-started scrollto ${className}`} onClick={onClick} disabled={disabled}>
            {text}
        </button>
    )
}
 export const CustomButtonRec=({text="Get Started", onClick, className})=>{
    return(
        <a  className={`btn-learn-more scrollto ${className}`} onClick={onClick}>
            {text}
        </a>
    )
}
 export const CustomButtonGreen = ({ text = "Get Started", onClick, className, type = "button",btnSize='large' }) => {
  return (
    <button
      type={type} // "submit", "button", or "reset"
        className={`btn-outlined ${btnSize} scrollto ${className} `}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
