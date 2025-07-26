'use client';
import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import logo from '../Assets/logo.png';
import '../components/HomeScreen.css';
import Footer from '../components/Footer';
import gsap from 'gsap';

const AboutPage = () => {

  const AboutUsSection = () => {
    const aboutRef = useRef(null);
    useEffect(() => {
      if (aboutRef.current) {
        gsap.fromTo(
          aboutRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
      }
    }, []);
    return (
      <section ref={aboutRef} style={{ background: '#fff', padding: '2rem 1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '2rem',
          flexWrap: 'wrap',
          padding: '0 1rem',
        }}>
          <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
            <Image
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
              alt="Sushi chef"
              width={900}
              height={600}
              style={{ width: '100%', borderRadius: '4px', objectFit: 'cover' }}
            />
          </div>
          <div style={{ flex: '1 1 300px', minWidth: '280px', textAlign: 'left' }}>
            <h2 style={{ fontFamily: 'serif', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1.5rem', fontWeight: 400 }}>About Us</h2>
            <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', marginBottom: '2rem', lineHeight: 1.6 }}>
            At Oasis, we create smart, stylish, and user-friendly digital solutions that help businesses grow. With a focus on quality, creativity, and client satisfaction, our passionate team turns ideas into impactful results — fast, reliable, and future-ready.</p>
            <button className="hero-explore" style={{ background: '#000', color: '#fff', padding: '0.75rem 2rem', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', border: 'none', borderRadius: 2, cursor: 'pointer', width: '100%', maxWidth: '300px' }}>
               Reach Out
            </button>
          </div>
        </div>
      </section>
    );
  };

  const VisitSection = () => {
    const visitRef = useRef(null);
    useEffect(() => {
      if (visitRef.current) {
        gsap.fromTo(
          visitRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
        );
      }
    }, []);
    return (
      <section ref={visitRef} className="py-16 flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
        {/* Left Card */}
        <div className="bg-white  rounded-xl p-10 flex-1 max-w-lg flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-2">
            <span className="block text-[#bfa76f] font-[cursive] text-3xl md:text-4xl mb-1">Visit Our</span>
            <span style={{ fontFamily: 'serif', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1.5rem', fontWeight: 400 }}>RESTAURANT</span>
          </h2>
          <div className="my-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="mx-auto text-gray-300"><path d="M12 22s8-4.5 8-10A8 8 0 0 0 4 12c0 5.5 8 10 8 10Z" stroke="#bfa76f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', marginBottom: '2rem', lineHeight: 1.6 }}>
          We&apos;d love to see you!
          Drop by our office and experience our work culture, creativity, and commitment firsthand. Whether you&apos;re here for a meeting, collaboration, or just to say hello — our doors are always open.</p>
          {/* <a href="#" className="text-[#bfa76f] underline text-lg font-semibold hover:text-[#a88c4a] transition">Get Locations</a> */}
        </div>
        {/* Right Image Grid */}
        <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4 min-w-[280px] w-full">
          <div className="col-span-1 row-span-1 rounded-lg overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" alt="food1" width={400} height={400} className="w-full h-full object-cover" />
          </div>
          <div className="col-span-1 row-span-1 rounded-lg overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80" alt="chef" width={400} height={400} className="w-full h-full object-cover" />
          </div>
          <div className="col-span-1 row-span-1 rounded-lg overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=400&q=80" alt="dining" width={400} height={400} className="w-full h-full object-cover" />
          </div>
          <div className="col-span-2 row-span-1 rounded-lg overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80" alt="restaurant" width={800} height={400} className="w-full h-full object-cover" />
          </div>
          <div className="col-span-1 row-span-1 rounded-lg overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=400&q=80" alt="bar" width={400} height={400} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-8 md:pt-16 pb-8">
        {/* Heading with image in the middle */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex flex-col md:flex-row items-center justify-center text-center gap-4 md:gap-3">
            <span className="text-3xl md:text-6xl font-serif tracking-wide">ABOUT THE</span>
            <span className="mx-2">
              <Image src={logo} alt="Logo" width={100} height={100} className="inline-block border-2 md:w-[150px] md:h-[100px]" />
            </span>
            <span className="text-3xl md:text-6xl font-serif tracking-wide ">RESTAURANT</span>
          </div>
        </div>
        {/* Wide hero image */}
        <div className="w-full overflow-hidden rounded-lg mb-6">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
            alt="Restaurant Table"
            width={1200}
            height={300}
            className="w-full h-40 md:h-72 object-cover object-center"
            priority
          />
        </div>
        {/* Centered paragraph */}
        <div className="flex justify-center px-4">
          <p className="max-w-xl text-center text-sm md:text-lg text-gray-800">
          What started as a simple idea has grown into a brand known for quality, dedication, and trust. At Oasis, we set out to create something different — something better. With a strong focus on innovation, customer satisfaction, and attention to detail, we continue to evolve, always striving to deliver the best in everything we do.Today, we&apos;re proud to be a name people recognize and rely on — and this is just the beginning.   </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <AboutUsSection />
      </div>
      <VisitSection />
      <Footer />
    </div>
  );
};

export default AboutPage; 