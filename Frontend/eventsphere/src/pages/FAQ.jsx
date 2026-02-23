import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is EventSphere?",
      answer:
        "EventSphere is a college event management platform where students can explore, register, and participate in various college events like workshops, fests, seminars, competitions, and cultural activities.",
    },
    {
      question: "Who can use this platform?",
      answer:
        "College students, event organizers, faculty coordinators, and the admin team can use EventSphere.",
    },
    {
      question: "How do I register for an event?",
      answer:
        "Go to the Events page, select your desired event, click Register, fill in the required details, and confirm your registration.",
    },
    {
      question: "Can I register for multiple events?",
      answer:
        "Yes! You can register for multiple events as long as seats are available.",
    },
    {
      question: "How do I know if my registration is confirmed?",
      answer:
        "You will see a confirmation message on the website. If email integration is enabled, you will also receive a confirmation email.",
    },
    {
      question: "Will I receive a certificate?",
      answer:
        "Yes, digital certificates are provided after successful participation if the event includes certification.",
    },
    {
      question: "How can organizers create events?",
      answer:
        "Organizers can log in, go to their dashboard, click 'Create Event', fill in the details, and publish the event.",
    },
    {
      question: "What if I forget my password?",
      answer:
        "Click on 'Forgot Password' on the login page and follow the instructions to reset your password.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#EDE9FE] dark:from-gray-900 dark:to-gray-800 py-16 px-6">
      
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-[#6D28D9] dark:text-purple-400 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find answers to common questions about EventSphere.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-md transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-5 text-left"
            >
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {faq.question}
              </span>
              <ChevronDown
                className={`transition-transform duration-300 ${
                  openIndex === index ? "rotate-180 text-[#0D9488]" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-40 px-5 pb-5" : "max-h-0"
              }`}
            >
              <p className="text-gray-600 dark:text-gray-400">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
    <Footer/>
    </>
  );
}