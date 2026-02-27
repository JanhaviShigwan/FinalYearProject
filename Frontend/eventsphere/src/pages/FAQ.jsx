import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/faq.css";

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
      <Navbar />

      <div className="faq-wrapper">
        <div className="faq-header">
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">
            Find answers to common questions about EventSphere.
          </p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-card ${
                openIndex === index ? "faq-card-open" : ""
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="faq-button"
              >
                <span className="faq-question">{faq.question}</span>

                <ChevronDown
                  className={`faq-icon ${
                    openIndex === index ? "faq-icon-open" : ""
                  }`}
                />
              </button>

              <div
                className={`faq-answer-wrapper ${
                  openIndex === index ? "faq-answer-open" : ""
                }`}
              >
                <p className="faq-answer">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}