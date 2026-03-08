import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqs = [
  { question: "What is EventSphere?",                    answer: "EventSphere is a college event management platform where students can explore, register, and participate in various college events like workshops, fests, seminars, competitions, and cultural activities." },
  { question: "Who can use this platform?",              answer: "College students, event organizers, faculty coordinators, and the admin team can use EventSphere." },
  { question: "How do I register for an event?",         answer: "Go to the Events page, select your desired event, click Register, fill in the required details, and confirm your registration." },
  { question: "Can I register for multiple events?",     answer: "Yes! You can register for multiple events as long as seats are available." },
  { question: "How do I know if my registration is confirmed?", answer: "You will see a confirmation message on the website. If email integration is enabled, you will also receive a confirmation email." },
  { question: "Will I receive a certificate?",           answer: "Yes, digital certificates are provided after successful participation if the event includes certification." },
  { question: "How can organizers create events?",       answer: "Organizers can log in, go to their dashboard, click 'Create Event', fill in the details, and publish the event." },
  { question: "What if I forget my password?",           answer: "Click on 'Forgot Password' on the login page and follow the instructions to reset your password." },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <>
      <Navbar />

      {/* faq-wrapper — ::before animated grid kept in index.css as .faq-wrapper */}
      <div className="faq-wrapper relative min-h-screen py-16 px-6 overflow-hidden"
           style={{ background: "linear-gradient(to bottom right, #FFFFFF, #F6F1EB, #F9F5FF)" }}>

        {/* Header */}
        <div className="relative z-10 max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#9B96E5]">Frequently Asked Questions</h1>
          <p className="text-[#3F3D56]">Find answers to common questions about EventSphere.</p>
        </div>

        {/* FAQ list */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-2xl transition-all duration-300 bg-white ${
                  isOpen
                    ? "shadow-[0_0_20px_rgba(155,150,229,0.4)]"
                    : "shadow-md"
                }`}
              >
                {/* Question button */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex justify-between items-center p-5 text-left"
                >
                  <span className="font-medium text-[#3F3D56]">{faq.question}</span>
                  <ChevronDown
                    className={`transition-all duration-300 ${
                      isOpen
                        ? "rotate-180 text-[#F08A6C] drop-shadow-[0_0_6px_rgba(240,138,108,0.8)]"
                        : "text-[#9B96E5]"
                    }`}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 px-5 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="text-[#3F3D56]">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </>
  );
}