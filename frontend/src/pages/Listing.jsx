import React, { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper,SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from 'swiper/modules';
import "swiper/css/bundle";
export default function Listing() {
    SwiperCore.use(Navigation);
    const [list,setlist]=useState(null);
    const [error,setError]=useState(false);
    const [loading,setloading]=useState(true);
    const params=useParams();
    useEffect(()=>{
      
       
        const getlist=async function(){
        try{
        setloading(true);
       const res=await fetch(`/api/listing/get/${params.id}`);
       const data=await res.json();
       if(data.status==="failed")
       {
            setError(data.message);
            setloading(false);
       }
       setlist(data);
       console.log(data);
       setloading(false);
       setError(false);
        }
    catch(error){
        setError(true);
        console.log(error)
        setloading(false);
    }}
        getlist();
    },[params.id])
    console.log(list)
    console.log(error)
  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error&& <p className='text-center my-7 text-2xl'>Something went wrong</p>}
        {list && !loading && !error &&
        <div>
        <Swiper navigation>
            {list.imageUrls.map(url=><SwiperSlide key={url}>
             <div className='h-[550px]' style={{background:`url(${url}) center no-repeat`,backgroundSize:'cover'}}>
                
             </div>
            </SwiperSlide>)}
        </Swiper>

        </div>
        }
    </main>
  )
}
