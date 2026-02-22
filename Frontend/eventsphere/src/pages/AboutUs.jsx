import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <>
    <Navbar/>
    <div className="bg-[#F3F4F6] dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9]/10 via-[#0D9488]/10 to-[#FDBA74]/10 dark:from-[#6D28D9]/20 dark:via-[#0D9488]/20 dark:to-[#FDBA74]/20 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-[#6D28D9] dark:text-purple-400 mb-6">
            About Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Empowering campus events with smart digital experiences that simplify
            organization and enhance student participation.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-semibold text-[#6D28D9] mb-4">
            Who We Are
          </h2>
          <div className="w-16 h-1 bg-[#FDBA74] mb-6 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We are passionate developers and students who understand the
            challenges of managing college events. From long queues to scattered
            announcements, we’ve experienced it all — and built a solution to fix it.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:shadow-purple-900/20 transition-all duration-300">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Our platform eliminates manual paperwork, simplifies coordination,
            and enhances transparency — creating smoother, smarter campus
            experiences.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

          <div className="p-8 rounded-2xl bg-[#F3F4F6] dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#6D28D9] mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To simplify and modernize college event management through a secure,
              intuitive, and reliable digital platform that empowers students and organizers.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#F3F4F6] dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#0D9488] mb-4">
              Our Vision
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To build a digitally connected campus ecosystem where every event
              is structured, accessible, and impactful.
            </p>
          </div>

        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-[#6D28D9] mb-12">
          What We Offer
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            "Smart Event Creation",
            "Secure Registration",
            "Real-Time Notifications",
            "Organized Dashboard"
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-10 h-10 bg-[#FDBA74]/30 rounded-full mb-4"></div>
              <h4 className="font-semibold text-[#0D9488] mb-2">{item}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Designed to simplify and enhance your campus event experience.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800 transition-colors duration-300">
        <h2 className="text-3xl font-semibold text-center text-[#6D28D9] mb-12">
          Meet the Team
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {[1, 2, 3].map((member) => (
            <div key={member} className="hover:-translate-y-2 transition-all duration-300">
              <div className="w-28 h-28 mx-auto rounded-full bg-[#0D9488]/20 mb-4"></div>
              <h4 className="font-semibold text-[#6D28D9]">Team Member</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Developer</p>
            </div>
          ))}
        </div>
      </section>

    </div>
    <Footer/>
    </>
  );
};

export default AboutUs;