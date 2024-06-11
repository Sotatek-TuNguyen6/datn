import React, { useEffect, useRef, useState, useContext } from 'react';
import Slider from "react-slick";
import './style.css';
import { Link } from 'react-router-dom';

import { MyContext } from '../../App';
const CatSlider = (props) => {
    const { data, product } = props
    const [allData, setAllData] = useState(data);
    const [totalLength, setTotalLength] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});

    const context = useContext(MyContext);

    const [itemBg, setItemBg] = useState([
        '#fffceb',
        '#ecffec',
        '#feefea',
        '#fff3eb',
        '#fff3ff',
        '#f2fce4',
        '#feefea',
        '#fffceb',
        '#feefea',
        '#ecffec',
        '#feefea',
        '#fff3eb',
        '#fff3ff',
        '#f2fce4',
        '#feefea',
        '#fffceb',
        '#feefea',
        '#ecffec'
    ]);

    const slider = useRef();


    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 1,
        fade: false,
        arrows: context.windowWidth > 992 ? true : false,
        autoplay: context.windowWidth > 992 ? 2000 : false,
        centerMode: context.windowWidth > 992 ? true : false
    };

    var catLength = 0;
    var lengthArr = [];
    useEffect(() => {
        if (allData.length !== 0 && product.length !== 0) {
            const counts = allData.reduce((acc, category) => {
                const productCount = product.filter(p => p.categoryId === category._id).length;
                acc[category._id] = productCount;
                return acc;
            }, {});
            setCategoryCounts(counts);
        }
    }, [allData, product]);

    return (
        <>
            <div className='catSliderSection'>
                <div className='container-fluid' ref={slider}>
                    <h2 className='hd'>Featured Categories</h2>
                    <Slider {...settings} className='cat_slider_Main' id="cat_slider_Main" >

                        {
                            allData.length !== 0 &&
                            allData.map((item, index) => {
                                return (
                                    <div className='item' key={index} >
                                        <Link to={`/cat/${item._id}`}>
                                            <div className='info' style={{ background: itemBg[index] }}>
                                                <img src={item.image} width="80" />
                                                <h5 className='text-capitalize mt-3'>{item.categoryName}</h5>
                                                <p>{categoryCounts[item._id]} items</p>
                                            </div>
                                        </Link>

                                    </div>
                                )
                            })
                        }

                        {
                            //    itemBg.length!==0 && itemBg.map((item,index)=>{
                            //     return(
                            //         <div className='item'>
                            //         <div className='info'  style={{background:item}}>
                            //             <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-13.png'/>
                            //             <h5>Cake & Milk</h5>
                            //             <p>26 items</p>
                            //         </div>
                            //     </div>
                            //     )
                            //    }) 
                        }


                        {/* <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-12.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div>

                        <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-11.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div>


                        <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-9.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div>


                        <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-3.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div>


                        <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-1.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div>


                        <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-2.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div>


                        <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-4.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div>


                        <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-13.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div>


                        <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-5.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div>

                        
                        <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-2.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div>


                        <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-4.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div>


                        <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-13.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div>


                        <div className='item'>
                            <div className='info'>
                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-5.png'/>
                                <h5>Cake & Milk</h5>
                                <p>26 items</p>
                            </div>
                        </div> */}


                    </Slider>
                </div >
            </div >



        </>
    )
}

export default CatSlider;