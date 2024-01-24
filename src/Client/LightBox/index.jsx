import React, { useState } from 'react'
import closeone from '../../assets/images/icon-close1.svg'
// import "../ProductDetailsPage/style.css";

const Lightbox = ({
  show3,
  onClose,
  thumbNail,
  imageSlider,
  current,
  prevSlide,
  nextSlide,
  previous,
  next,
  setCurrent,
}) => {
  if (!show3) {
    return null
  }
  return (
    <div className='modallightbox'>
      <div className='modallightbox-content'>
        <div  className='modallightbox-body'>
          <div  className='insidediv'>
            <div className='slider1'>
            <div className='lightboximg'>
              <img onClick={onClose} src={closeone} alt='close' />
            </div>
              {imageSlider.map((slide, index) => {
                return (
                  <div
                    className={index === current ? 'slide active' : 'slide'}
                    key={index}
                  >
                    {index === current && (
                      <img
                        className='product2'
                        src={slide.image}
                        alt='product one'
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <div className='thumbnail1'>
              {thumbNail.map((item, key) => {
                return (
                  <div className='imgs' key={key}>
                    <img
                      className='thumbnailimg1'
                      src={item.image}
                      alt='thumNail product images'
                      onClick={() =>
                        setCurrent(current === item.id ? current : item.id)
                      }
                    />
                  </div>
                )
              })}
            </div>
            <div className='prevnext1'>
              <div>
                <img onClick={prevSlide} src={previous} alt='previous' />
              </div>
              <div>
                <img onClick={nextSlide} src={next} alt='next' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lightbox;