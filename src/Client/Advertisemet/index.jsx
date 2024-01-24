import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import DEALOFWEEK from "../../assets/images/deal_ofthe_week.png";

const Advertisement = ({ date }) => {
  const [countDown, setCountDown] = useState({
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
  });

  useEffect(() => {
    // update every second
    const interval = setInterval(() => {
      const calculatedCountdown = calculateCountdown(date);
      calculatedCountdown ? setCountDown(calculatedCountdown) : stop();
    }, 1000);

    return () => {
      stop(interval);
    };
  }, [date]);

  const calculateCountdown = (endDate) => {
    let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeft = {
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
    };

    // calculate time difference between now and expected date
    if (diff >= 365.25 * 86400) {
      // 365.25 * 24 * 60 * 60
      timeLeft.days = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.days * 365.25 * 86400;
    }
    if (diff >= 86400) {
      // 24 * 60 * 60
      timeLeft.hours = Math.floor(diff / 86400);
      diff -= timeLeft.hours * 86400;
    }
    if (diff >= 3600) {
      // 60 * 60
      timeLeft.min = Math.floor(diff / 3600);
      diff -= timeLeft.min * 3600;
    }
    if (diff >= 60) {
      timeLeft.sec = diff % 60;
    }

    return timeLeft;
  };

  const stop = (interval) => {
    clearInterval(interval);
  };

  const addLeadingZeros = (value) => {
    value = String(value);
    while (value.length < 2) {
      value = "0" + value;
    }
    return value;
  };

  return (
    <div className="deal_ofthe_week" >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="deal_ofthe_week_img">
              <img src={DEALOFWEEK} alt="" />
            </div>
          </div>
          <div className="col-lg-6 text-right deal_ofthe_week_col">
            <div className="deal_ofthe_week_content d-flex flex-column align-items-center float-right">
              <div className="section_title">
                <h2>Deal Of The Week</h2>
              </div>
              <ul className="timer">
                <li className="d-inline-flex flex-column justify-content-center align-items-center">
                  <div id="day" className="timer_num">
                    {addLeadingZeros(countDown.days)}
                  </div>
                  <div className="timer_unit">
                    {countDown.days === 1 ? "Day" : "Days"}
                  </div>
                </li>
                <li className="d-inline-flex flex-column justify-content-center align-items-center">
                  <div id="hour" className="timer_num">
                    {addLeadingZeros(countDown.hours)}
                  </div>
                  <div className="timer_unit">Hours</div>
                </li>
                <li className="d-inline-flex flex-column justify-content-center align-items-center">
                  <div id="minute" className="timer_num">
                    {addLeadingZeros(countDown.min)}
                  </div>
                  <div className="timer_unit">Mins</div>
                </li>
                <li className="d-inline-flex flex-column justify-content-center align-items-center">
                  <div id="second" className="timer_num">
                    {addLeadingZeros(countDown.sec)}
                  </div>
                  <div className="timer_unit">Sec</div>
                </li>
              </ul>
              <div className="red_button deal_ofthe_week_button">
                <a href="/categories">shop now</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Advertisement.propTypes = {
  date: PropTypes.string.isRequired,
};

Advertisement.defaultProps = {
  date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toString(),
};

export default Advertisement;
