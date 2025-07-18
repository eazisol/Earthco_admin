const imagePathCorrector = (string) => {
    if (string) {
      const correctedString = `https://admin.earthcoapp.com/${string
        ?.replace(/\\/g, "/")
        }`;
      return correctedString;
    } else {
      return "";
    }
  };
  
  export default imagePathCorrector;
  