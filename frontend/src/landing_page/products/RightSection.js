import React from "react";

function RightSection({
  imageURL,
  productName,
  productDescription,
  learnMore,
}) {
  return (
    <div className="container">
      <div className="row p-5">
        <div className="col-6 p-5 mt-5">
          <h1 className="fs-3">{productName}</h1>
          <p
            className="mt-3"
            style={{
              fontSize: "1rem",
              lineHeight: "1.8",
              marginBottom: "15px",
              color: "#424242",
            }}
          >
            {productDescription}
          </p>
          <div>
            <a href={learnMore} style={{ marginLeft: "0px" }}>
              learn More
            </a>
          </div>
        </div>
        <div className="col-6 ">
          <img src={imageURL} />
        </div>
      </div>
    </div>
  );
}

export default RightSection;
