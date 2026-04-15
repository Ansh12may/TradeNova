import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container">
      <div className="row p-5  ">
        <div className="col-6 ">
          <img src={imageURL} />
        </div>

        
        <div className="col-6 p-5 mt-5">
          <h1 className="fs-3">{productName}</h1>
          <p
            className="mt-3"
            style={{
              fontSize: "1rem",
              lineHeight:"1.8",
              marginBottom: "15px",
              color: "#424242",
            }}
          >
            {productDescription}
          </p>
          <div>
            <a href={tryDemo}>Try Demo</a>
            <a href={learnMore} style={{ marginLeft: "50px" }}>
              learn More
            </a>
          </div>

          <div className="mt-3">
            <a href={googlePlay}>
              <img src="media/googlePlayBadge.svg" />
            </a>
            <a href={appStore}>
              <img
                src="media/appstoreBadge.svg"
                style={{ marginLeft: "50px" }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
