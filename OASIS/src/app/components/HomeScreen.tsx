'use client';
import React, { useEffect, useRef, useState } from 'react';
import './HomeScreen.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from './Footer';
import BookingForm from './BookingForm';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = ({ onReserve }: { onReserve: () => void }) => (
  <section className="hero-section">
    <h1 className="hero-title">Crafted with Love,</h1>
    <h1 className="hero-title1">Served with Flavor</h1>
    <p className="hero-subtitle">Fresh. Flavorful. Unforgettable. Step in and taste the magic—where every bite brings you closer to delicious.</p>
    <button className="hero-explore desktop-only">Explore</button>
    <button className="hero-explore mobile-only" onClick={onReserve}>Reserve Table</button>
    <div className="hero-image-wrapper">
      <Image
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
        alt="Sushi"
        width={900}
        height={600}
        className="hero-image"
      />
    </div>
  </section>
);


const whyChooseData = [
  {
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    title: 'Exquisite Menu',
    subtitle: 'Diverse Selections',
    desc: `Our menu offers a wide range of sushi options, from classic rolls to unique creations, ensuring there's something for every palate.`,
    imgFirst: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=600&q=80',
    title: 'Fresh Ingredients',
    subtitle: 'Sustainability Focus',
    desc: `We prioritize using sustainable seafood and fresh produce, guaranteeing the highest quality and supporting environmental conservation.`,
    imgFirst: false,
  },
  {
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    title: 'Impeccable Service',
    subtitle: 'Customer-Centric Approach',
    desc: `Our dedicated staff is committed to providing exceptional service, ensuring a memorable dining experience for every guest.`,
    imgFirst: true,
  },
];

const WhyChooseSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.why-choose-block').forEach((block) => {
        gsap.from(block as HTMLElement, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block as Element,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      });
      gsap.utils.toArray('.why-choose-title').forEach((el) => {
        gsap.from(el as HTMLElement, {
          opacity: 0,
          y: -40,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el as Element,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });
      gsap.utils.toArray('.why-choose-animate-text').forEach((el, i) => {
        gsap.to(el as HTMLElement, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el as Element,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
      gsap.utils.toArray('.why-choose-img').forEach((img) => {
        gsap.fromTo(img as HTMLElement, {
          scale: 1.08,
        }, {
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: img as Element,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="why-choose-section" ref={sectionRef}>
      <h2 className="why-choose-title">Why Choose <span> OASIS </span></h2>
      <div className="why-choose-list">
        {whyChooseData.map((item) => (
          <div className="why-choose-block" key={item.title}>
            <div className={`why-choose-row ${item.imgFirst ? '' : 'reverse'}`}>
              <div className="why-choose-img-wrap">
                <Image src={item.img} alt={item.title} className="why-choose-img" width={600} height={340} style={{objectFit: 'cover', width: '100%', height: '100%'}} />
              </div>
              <div className="why-choose-content">
                <h3 className="why-choose-heading why-choose-animate-text">{item.title}</h3>
                <h4 className="why-choose-subheading why-choose-animate-text">{item.subtitle}</h4>
                <p className="why-choose-desc why-choose-animate-text">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const HomeScreen = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  return (
    <main>
      <HeroSection onReserve={() => setShowBookingForm(true)} />
      <WhyChooseSection />
      {showBookingForm && (
        <BookingForm onClose={() => setShowBookingForm(false)} />
      )}
      <Footer />
    </main>
  );
};

export default HomeScreen; 