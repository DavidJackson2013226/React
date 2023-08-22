import React, { Component } from "react";
import { CarouselData } from "./CarouselData";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Swipe from "react-easy-swipe";

class SayAboutUs extends Component  {
    constructor(props) {
        super(props);
        this.state = {
          currentSlide: 0,
          paused: false,
        };
      }
    
      componentDidMount() {
        setInterval(() => {
          if (this.state.paused === false) {
            let newSlide =
              this.state.currentSlide === CarouselData.length - 1
                ? 0
                : this.state.currentSlide + 1;
            this.setState({ currentSlide: newSlide });
          }
        }, 3000);
      }
    
      nextSlide = () => {
        let newSlide =
          this.state.currentSlide === CarouselData.length - 1
            ? 0
            : this.state.currentSlide + 1;
        this.setState({ currentSlide: newSlide });
      };
    
      prevSlide = () => {
        let newSlide =
          this.state.currentSlide === 0
            ? CarouselData.length - 1
            : this.state.currentSlide - 1;
        this.setState({ currentSlide: newSlide });
      };
    
      setCurrentSlide = (index) => {
        this.setState({ currentSlide: index });
      };
    
    render() {
        return (
            <div id="reviews" className="lg:pb-24 lg:pb-9 pt-10 lg:pt-10 bg-no-repeat bg-right-bottom bg-[length:130px_150px] sm:bg-[length:160px_180px] md:bg-[length:250px_220px] lg:bg-[length:400px_300px] bg-[url('./img/image_7_1.png')] md:bg-[url('./img/image7.png')] pb-12">
                <div className="w-full">
                    <div>
                        <p className="text-center text-gray-400 text-sm">REVIEWS</p>
                        <p className="text-center font-bold text-3xl mt-3 pb-2 max-w-xs md:max-w-md mx-auto">What people <label className='text-teal-500'>say</label> about us?</p>
                    </div>
                    <div className="text-center flex lg:max-w-7xl mx-auto">
                        <div className='hidden lg:block flex-none w-1/12 my-auto'>
                            <button className='my-auto' type='button' onClick={this.prevSlide}><img src='./img/Group_1.png'/></button>
                        </div>
                        <div className="flex-auto w-10/12 p-10" onSwipeLeft={this.nextSlide} onSwipeRight={this.prevSlide}>
                            {CarouselData.map((slide, index) => {
                                return (
                                    <div key={index} 
                                    className={
                                        index === this.state.currentSlide
                                        ? "block w-full h-auto object-cover"
                                        : "hidden"
                                    }
                                    onMouseEnter={() => {
                                        this.setState({ paused: true });
                                    }}
                                    onMouseLeave={() => {
                                        this.setState({ paused: false });
                                    }}>
                                        <div className='mx-auto max-w-3xl p-12 border-solid border-teal-500 border-2 rounded-3xl'>
                                            <div className='w-full'><img src='./img/icomoon.png'/></div>
                                            <div className='lg:flex flex-row-reverse mb-8 lg:mb-0'>
                                                <div className='avata flex-none w-[92px] h-[92px] sm:w-[115px] sm:h-[115px] md:w-[138px] md:h-[138px] lg:w-[160px] lg:h-[160px] mx-auto lg:ms-10'>
                                                    <img src={slide.image}
                                                        alt="This is a carousel slide"
                                                        key={index}
                                                        className={
                                                            index === this.state.currentSlide
                                                            ? "block w-full h-auto object-cover border-solid border-teal-500 border-2 rounded-full w-[92px] h-[92px] sm:w-[115px] sm:h-[115px] md:w-[138px] md:h-[138px] lg:w-[160px] lg:h-[160px]"
                                                            : "hidden"
                                                        }
                                                        onMouseEnter={() => {
                                                            this.setState({ paused: true });
                                                        }}
                                                        onMouseLeave={() => {
                                                            this.setState({ paused: false });
                                                        }}/>
                                                </div>
                                                <div className='my-auto me-auto w-full'>
                                                    <p className='mt-5 lg:mt-0 text-justify lg:max-w-lg lg:text-left'>
                                                        <snap key={index}
                                                            className={
                                                                index === this.state.currentSlide
                                                                ? "block w-full h-auto object-cover"
                                                                : "hidden"
                                                            }
                                                            onMouseEnter={() => {
                                                                this.setState({ paused: true });
                                                            }}
                                                            onMouseLeave={() => {
                                                                this.setState({ paused: false });
                                                            }}>{slide.artical}</snap>
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className='text-left'>
                                                    <snap key={index}
                                                            className={
                                                                index === this.state.currentSlide
                                                                ? "block w-full h-auto object-cover"
                                                                : "hidden"
                                                            }
                                                            onMouseEnter={() => {
                                                                this.setState({ paused: true });
                                                            }}
                                                            onMouseLeave={() => {
                                                                this.setState({ paused: false });
                                                            }}>{slide.name}</snap>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className='hidden lg:block flex-none w-1/12 my-auto'>
                            <button className='my-auto' type='button' onClick={this.nextSlide}><img src='./img/Group_2.png'/></button>
                        </div>
                    </div>
                    <div className='mx-auto lg:hidden flex w-[200px]'>
                        <div className='flex-none mx-auto'>
                            <button className='mx-auto' type='button' onClick={this.prevSlide}><img src='./img/Group_1.png'/></button>
                        </div>
                        <div className='flex-none mx-auto'>
                            <button className='mx-auto' type='button' onClick={this.nextSlide}><img src='./img/Group_2.png'/></button>
                        </div>
                    </div>
                    <div className='mx-auto w-[150px] flex justify-center'>
                        {CarouselData.map((element, index) => {
                            return (
                                <div
                                className={
                                    index === this.state.currentSlide
                                    ? "h-3 w-3 bg-teal-500 rounded-full mx-2 mb-2 cursor-pointer"
                                    : "h-3 w-3 bg-white border-solid border-teal-500 border-2 rounded-full mx-2 mb-2 cursor-pointer"
                                }
                                key={index}
                                onClick={() => {
                                    this.setCurrentSlide(index);
                                }}
                                ></div>
                            );
                            })}
                    </div>
                </div>
            </div>
        )
    }
}

export default SayAboutUs;