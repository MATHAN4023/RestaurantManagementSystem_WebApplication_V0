"use client";
import React from "react";
import Image from "next/image";
import '../components/HomeScreen.css';
import Footer from '../components/Footer';

type MenuItem = {
    name: string;
    desc: string;
    price: string;
};

const menuSections = [
    {
        title: 'Tiffin Specials',
        items: [
            {
                name: 'Ghee Roast Dosa',
                desc: 'Crispy rice and lentil crepe roasted with ghee, served with coconut chutney and sambar.',
                price: '₹90',
            },
            {
                name: 'Idli Vada Combo',
                desc: 'Steamed rice cakes and crispy lentil doughnuts, served with sambar and chutneys.',
                price: '₹80',
            },
            {
                name: 'Pongal',
                desc: 'Creamy rice and lentil porridge tempered with ghee, pepper, and cashews.',
                price: '₹70',
            },
        ],
    },
    {
        title: 'Chettinad Delights',
        items: [
            {
                name: 'Chettinad Chicken Curry',
                desc: 'Spicy chicken curry cooked with Chettinad spices, coconut, and herbs.',
                price: '₹220',
            },
            {
                name: 'Karaikudi Mutton Chukka',
                desc: 'Tender mutton pieces slow-cooked with black pepper, curry leaves, and Chettinad masala.',
                price: '₹280',
            },
            {
                name: 'Vegetable Kurma',
                desc: 'Mixed vegetables simmered in a coconut and cashew-based gravy, flavored with South Indian spices.',
                price: '₹140',
            },
        ],
    },
    {
        title: 'South Indian Curries',
        items: [
            {
                name: 'Fish Kuzhambu',
                desc: 'Tangy tamarind-based curry with seared fish, tomatoes, and South Indian spices.',
                price: '₹260',
            },
            {
                name: 'Sambar',
                desc: 'Classic lentil and vegetable stew, flavored with tamarind and sambar powder.',
                price: '₹90',
            },
            {
                name: 'Rasam',
                desc: 'Spicy, tangy South Indian soup made with tomatoes, tamarind, and black pepper.',
                price: '₹60',
            },
        ],
    },
];

function ElegantMenuSection({ title, items }: { title: string; items: MenuItem[] }) {
    return (
        <section className="py-10">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-serif text-[#6b5c3a] mb-2 flex items-center gap-4">
                    <span className="font-normal" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</span>
                    <span className="flex-1 border-t border-[#b6a98c]"></span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((item, idx) => (
                        <div key={idx} className="mb-6">
                            <div className="text-lg md:text-xl font-serif text-[#6b5c3a] mb-1" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>{item.name}</div>
                            <div className="text-gray-800 text-base mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.desc}</div>
                            <div className="text-[#6b5c3a] text-base font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.price}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const MenuScreen = () => (
    <div className="min-h-screen bg-[#ffff] py-8 px-2 md:px-8 font-sans">
        

        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <div className="text-[#e76f51] text-xl mb-2" style={{ fontFamily: 'cursive', letterSpacing: '2px' }}>best choice</div>
                <h1 className="hero-title">Flavour so good you&apos;ll</h1>
                <h1 className="hero-title1">try to eat with your eyes</h1>
                {/* <h1 className="text-4xl md:text-5xl mb-2" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400, letterSpacing: '-1px' }}> </h1> */}
            </div>


            {/* Elegant Menu Sections */}
            <div className="bg-[#fff] pb-12">
                {menuSections.map((section, idx) => (
                    <ElegantMenuSection key={idx} title={section.title} items={section.items} />
                ))}
            </div>
        </div>
        <br />
        <section className="bg-[#f3eada] rounded-3xl mb-12 flex flex-col md:flex-row overflow-hidden items-center">
            <div className="md:w-1/2 w-full h-64 md:h-[400px] relative">
                <Image
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                    alt="Salad with dressing"
                    width={800}
                    height={400}
                    className="object-cover w-full h-full"
                    style={{ borderTopLeftRadius: '1.5rem', borderBottomLeftRadius: '1.5rem' }}
                    unoptimized
                />
            </div>
            <div className="md:w-1/2 w-full flex flex-col justify-center p-8">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>A new way to<br />experience<br />food</h2>
                <p className="text-lg md:text-xl text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Enjoy our seasonal menu<br />and experience the beauty<br />of naturalness
                </p>
            </div>
        </section>
        {/* New Experience Section */}
        <section className="bg-[#fff] rounded-2xl mb-12 flex flex-col md:flex-row items-center md:items-start px-4 md:px-12 py-10 gap-8">
            <div className="md:w-1/2 w-full text-left">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-0 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    A place where food,<br />
                    design, and ambiance<br />
                    come together to<br />
                    create a memorable<br />
                    experience.
                </h2>
            </div>
            <div className="md:w-1/2 w-full text-right flex items-center justify-end">
                <p className="text-base md:text-lg text-gray-800 max-w-md" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Whether you&apos;re exploring healthier dining options or simply craving something fresh and flavorful, our menu offers a delightful variety of salads and plant-based dishes. Crafted with the finest ingredients, each recipe is designed to nourish, satisfy, and inspire your taste buds
                </p>
            </div>
        </section>
        {/* End New Experience Section */}

 

        <Footer />
    </div>
);

export default MenuScreen; 