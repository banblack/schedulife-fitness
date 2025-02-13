
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What's included in the personal coaching sessions?",
      answer: "Personal coaching sessions include one-on-one video calls with your certified trainer, form assessment, progress tracking, and personalized workout adjustments. Your coach will review your goals, adapt your training plan, and provide expert guidance for optimal results."
    },
    {
      question: "Can I switch between plans?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle. When upgrading, you'll get immediate access to the new features, and we'll prorate the difference."
    },
    {
      question: "How do I schedule my coaching sessions?",
      answer: "After subscribing, you'll get access to our scheduling platform where you can book sessions with your coach based on mutual availability. We offer flexible scheduling options including early morning and evening slots."
    },
    {
      question: "What if I need to cancel my subscription?",
      answer: "You can cancel your subscription at any time through your account settings. We offer a 14-day money-back guarantee for new subscribers. After cancellation, you'll maintain access until the end of your current billing period."
    },
    {
      question: "How are the workout plans customized?",
      answer: "Our coaches create personalized workout plans based on your goals, fitness level, available equipment, and schedule. Plans are regularly adjusted based on your progress and feedback to ensure optimal results."
    },
    {
      question: "What kind of support is available?",
      answer: "Support varies by plan but includes email support, chat support, and direct communication with your coach. Pro and Elite members get priority support and faster response times."
    }
  ];

  return (
    <div className="mt-16 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <HelpCircle className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
