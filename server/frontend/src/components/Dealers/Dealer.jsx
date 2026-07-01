import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import positiveIcon from "../assets/positive.png";
import neutralIcon from "../assets/neutral.png";
import negativeIcon from "../assets/negative.png";
import reviewIcon from "../assets/reviewbutton.png";
import Header from "../Header/Header";

const Dealer = () => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>);

  const params = useParams();
  const id = params.id;

  const rootUrl = `${window.location.origin}/`;
  const dealerUrl = `${rootUrl}djangoapp/dealer/${id}`;
  const reviewsUrl = `${rootUrl}djangoapp/reviews/dealer/${id}`;
  const postReviewUrl = `${rootUrl}postreview/${id}`;

  const getDealer = async () => {
    try {
      const res = await fetch(dealerUrl, {
        method: "GET"
      });

      const retobj = await res.json();

      if (retobj.status === 200 && retobj.dealer) {
        const dealerObj = Array.isArray(retobj.dealer)
          ? retobj.dealer[0]
          : retobj.dealer;

        setDealer(dealerObj || {});
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
    }
  };

  const getReviews = async () => {
    try {
      const res = await fetch(reviewsUrl, {
        method: "GET"
      });

      const retobj = await res.json();

      if (retobj.status === 200) {
        if (retobj.reviews && retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setUnreviewed(true);
    }
  };

  const sentiIcon = (sentiment) => {
    if (sentiment === "positive") {
      return positiveIcon;
    }

    if (sentiment === "negative") {
      return negativeIcon;
    }

    return neutralIcon;
  };

  useEffect(() => {
    getDealer();
    getReviews();

    if (sessionStorage.getItem("username")) {
      setPostReview(
        <a href={postReviewUrl}>
          <img
            src={reviewIcon}
            style={{ width: "10%", marginLeft: "10px", marginTop: "10px" }}
            alt="Post Review"
          />
        </a>
      );
    }
  }, []);

  if (!dealer) {
    return (
      <div style={{ margin: "20px" }}>
        <Header />
        <p>Loading dealer...</p>
      </div>
    );
  }

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name}
          {postReview}
        </h1>
        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>

      <div className="reviews_panel">
        {reviews.length === 0 && unreviewed === false ? (
          <p>Loading Reviews....</p>
        ) : unreviewed === true ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div className="review_panel" key={index}>
              <img
                src={sentiIcon(review.sentiment)}
                className="emotion_icon"
                alt="Sentiment"
              />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model}{" "}
                {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;