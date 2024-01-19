import React, { useEffect,useState } from 'react'
import {Link} from 'react-router-dom';
import { SwiperSlide,Swiper } from 'swiper/react';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
export default function Home() {
  const [offerListings,setOfferListings]=useState([]);
  const [saleListings,setSaleListings]=useState([]);
  const [rentListings,setRentListings]=useState([]);
  SwiperCore.use([Navigation])
  console.log(saleListings);
  useEffect(()=>{
    const fetchOfferListing=async()=>{
    try{
      const res=await fetch('/api/listing/get?offer=true&limit=4');
      const data=await res.json();
      setOfferListings(data);
      fetchRentListings();

    }
    catch(error)
    {
      console.log(error);
    }
    }
    const fetchRentListings =async ()=>{
      try{
        const res=await fetch('/api/listing/get?type=rent&limit=4');
        const data=await res.json();
        setRentListings(data);
        fetchSaleListings();

  
      }
      catch(error)
      {
        console.log(error);
      }
    }
    const fetchSaleListings =async ()=>{
      try{
        const res=await fetch('/api/listing/get?type=sale&limit=4');
        const data=await res.json();
        setSaleListings(data);
      }
      catch(error)
      {
        console.log(error);
      }
    }
    fetchOfferListing();
  },[]);

  return (
    <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
      <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find your next <span className='text-slate-500'>perfect</span> <br /> place with ease</h1>
      <div className=''>
        Ayesha Estate is the best place to find your next perfect place to live.
        <br />
        We have a wide range of properties form you to choose from. 
      </div>
      <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
        Let's get started..
      </Link>
      <Swiper navigation>
      {
        offerListings&&offerListings.legnth>0&&offerListings.map((listing)=>{
          <SwiperSlide>
            <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat`,backgroundSize:"cover"}} className='h-[500px]' key={listing._id}>

            </div>
          </SwiperSlide>
        })
      }
      </Swiper>
    </div>
  
  )
}
