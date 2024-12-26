"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import Image from 'next/image';

const Home = () => {
  const [input, setInput] = useState('');
  const router = useRouter(); // Initialize router for navigation

  return (
    <div className='bg-black text-white'>
      {/* NAVBAR */}
      <div className='flex flex-col md:flex-row h-28 bg-black items-center justify-between py-4 px-5 md:px-20 sticky top-0 z-50'>
        <div className='text-xl'>BookBot</div>
        <div className='space-y-2 md:space-y-0 space-x-4 md:space-x-10 md:flex-row flex-col'>
          <a href="#product" className='text-lg'>Product</a>
          <a href="#vision" className='text-lg'>Vision</a>
          <a href="#footer" className='text-lg'>Footer</a>
          <button
            onClick={() => router.push('/auth')}
            className="bg-white text-lg text-black rounded-full border border-white py-1 px-6 hover:bg-transparent hover:text-white transition ease-in-out duration-300 delay-150"
          >
            SIGN IN
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-col md:flex-row items-start justify-center min-h-screen px-5 md:px-20">
        <div className='w-full md:w-2/5 flex flex-col space-y-6 z-10'>
          <h1 className='text-4xl md:text-8xl leading-snug mb-10'>&lt;search <br /> reimagined&gt;</h1>
          <p className='text-base md:text-lg'>Are you ready to transform your book shopping experience? Meet BookBot, your personal assistant designed to help you navigate our extensive collection of books effortlessly!</p>
        </div>
        <div className='w-full md:w-3/5 flex flex-col justify-end items-end'>
          <Image
            src="https://static.wixstatic.com/media/d2baa5_a934055d98b34a6f855662ac141608b3f000.jpg/v1/fill/w_1374,h_645,al_c,q_85,usm_0.33_1.00_0.00,enc_avif,quality_auto/d2baa5_a934055d98b34a6f855662ac141608b3f000.jpg"
            alt='' width={500} height={500}
            className='w-full'></Image>
          <h1 className='text-4xl md:text-8xl'>&lt;/&gt;</h1>
        </div>
      </div>

      {/* VISION */}
      <div id='vision' className='flex flex-col border-t border-gray-600 items-center justify-center h-full px-5 md:px-20 py-10'>
        <h1 className='text-xl tracking-tight mb-10' style={{ fontFamily: 'var(--font-manrope)' }}>VISION</h1>
        <p className='text-xl md:text-7xl font-light tracking-normal text-center' style={{ fontFamily: 'var(--font-manrope)' }}>We’re here to bridge the gap between how readers discover stories and how they shop for books online.</p>
        <div className='mt-20 relative flex flex-col justify-center bg-cover bg-center h-[300px] md:h-[500px]' style={{ backgroundImage: "url('https://static.wixstatic.com/media/d2baa5_cce5270ad01b4a4b94af5b4cbe5980b9f000.jpg/v1/fill/w_1401,h_502,al_c,q_85,usm_0.33_1.00_0.00,enc_avif,quality_auto/d2baa5_cce5270ad01b4a4b94af5b4cbe5980b9f000.jpg')" }}>
          <p className='text-white p-5 w-full md:w-1/2'>
          We believe that finding your next favorite book shouldn't feel like a daunting task. That's why we've developed a suite of AI-powered tools that enhance your online literature exploration. Our platform combines advanced artificial intelligence with a deep understanding of readers' preferences, creating a more intuitive and personalized shopping experience. With our technology, readers can easily discover stories that resonate with them, ensuring that every book feels like it was meant just for them.
          </p>
        </div>
      </div>

      {/* PRODUCT */}
      <div id='product' className='flex flex-col border-t border-gray-600 items-center justify-center h-full px-5 md:px-20 py-10'>
        <h1 className='text-xl tracking-tight mb-10' style={{ fontFamily: 'var(--font-manrope)' }}>PRODUCT</h1>
        <p className='text-xl md:text-7xl font-light tracking-tight text-center' style={{ fontFamily: 'var(--font-manrope)' }}>It's not just a random chatbot; it's built to handle all your book buying needs.</p>
        <div className='mt-20 relative flex justify-center bg-gradient-to-br from-black via-black to-purple-900 bg-cover bg-center h-[500px] p-5 md:p-10'>
          <div className='flex flex-col md:flex-row items-center text-white p-5 rounded-lg bg-opacity-80 backdrop-filter backdrop-blur-lg'>
            <div className='w-full md:w-1/2 h-full flex flex-col justify-center border-l p-5 md:p-10'>
              <h1 className='text-xl md:text-2xl h-auto'>Effortless Book Shopping with AI Chatbot</h1>
              <p className='border-t py-4'>
              Finding your next favorite book should be a breeze, not a chore. Our AI-powered chatbot streamlines the entire shopping experience, making it easy to search, filter, and add books to your cart. With just a simple chat, you can quickly discover titles that match your interests, explore detailed descriptions, and receive personalized recommendations tailored to your reading preferences.
              </p>
            </div>
            <div className='w-1/2 hidden md:block h-fit p-5 md:p-10'>
              <Image src={"https://static.wixstatic.com/media/d2baa5_1f3f558d01714894a9208a22c36daba1~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Chips_1.png"} alt='' height={500} width={500}></Image>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div id='footer' className='flex flex-col border-t border-gray-600 items-center justify-center h-full px-5 md:px-20 py-10'>
        <h1 className='text-xl tracking-tight mb-10' style={{ fontFamily: 'var(--font-manrope)' }}>Why me?</h1>
        <p className='text-xl md:text-7xl font-light tracking-tight text-center' style={{ fontFamily: 'var(--font-manrope)' }}>
          A Different Approach,<br /> Using the Power of Creative Thinking
        </p>
        <div className='relative flex flex-col items-start justify-between bg-gradient-to-br from-black via-black to-purple-900 bg-cover bg-center w-full h-[500px]'>
          <p className='text-white p-5 w-full'>
          I believe in handling every project with passion, making even the simplest tasks engaging and meaningful. My approach combines creativity and dedication, ensuring that every detail is thoughtfully considered. By infusing innovative ideas into my work, I create experiences that captivate and resonate with clients, transforming routine tasks into memorable achievements. With a commitment to excellence, I strive to bring a unique touch to everything I do, making the journey as enjoyable as the destination.
          </p>
          <div className='flex flex-col md:flex-row items-start justify-between w-full'>
            <h1 className='text-xl'>BookBot</h1>
            <div className='flex w-1/2 mt-5 md:mt-auto'>
              <div className='w-full md:w-[50%] flex flex-col items-start justify-start pr-[10%]'>
                <h1 className='text-xl'>SOCIAL</h1>
                <p className='text-white py-2'>linkedin</p>
              </div>
              <div className='w-full md:w-[50%] flex flex-col items-start justify-start pl-[10%]'>
                <h1 className='text-xl'>CONTACT</h1>
                <p className='text-white py-2'>email</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Home;
