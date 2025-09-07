import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  Mic, 
  BookOpen, 
  Award,
  ArrowRight,
  Globe,
  Clock,
  AlertTriangle
} from "lucide-react";

const onboardingSteps = [
  {
    id: "heritage",
    title: "What is Heritage Language?",
    icon: Heart,
    content: {
      headline: "Languages are Living Treasures",
      description: "Heritage languages carry the soul of our ancestors - their stories, wisdom, and unique ways of understanding the world.",
      stats: [
        { number: "7,000+", label: "Languages worldwide" },
        { number: "1", label: "Language dies every 14 days" },
        { number: "40%", label: "At risk of extinction" }
      ],
      visual: "🌍"
    }
  },
  {
    id: "importance",
    title: "Why It Matters",
    icon: AlertTriangle,
    content: {
      headline: "We're Losing Our Cultural DNA",
      description: "When a language disappears, we lose centuries of knowledge, oral traditions, and unique perspectives on life.",
      impacts: [
        "📚 Traditional stories and wisdom vanish",
        "🧬 Unique ways of thinking are lost",
        "👴 Elders can't pass down heritage",
        "🌱 Cultural identity weakens"
      ],
      visual: "⏳"
    }
  },
  {
    id: "solution",
    title: "How You Help Preserve It",
    icon: Mic,
    content: {
      headline: "Every Voice Matters",
      description: "With just your smartphone, you become a guardian of heritage. Every word you record helps preserve languages for future generations.",
      actions: [
        { icon: "🎤", title: "Record Words", desc: "Capture pronunciations and meanings" },
        { icon: "📖", title: "Share Stories", desc: "Preserve folktales and traditions" },
        { icon: "🎓", title: "Learn Together", desc: "Help others discover their roots" },
        { icon: "🤝", title: "Build Community", desc: "Connect with other preservers" }
      ],
      visual: "✨"
    }
  }
];

export default function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  const step = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <step.icon className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl">{step.title}</CardTitle>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStep ? 'bg-white' : 'bg-white bg-opacity-30'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="text-6xl mb-6">{step.content.visual}</div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {step.content.headline}
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                {step.content.description}
              </p>

              {/* Stats for heritage step */}
              {step.content.stats && (
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {step.content.stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="text-center"
                    >
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Impacts for importance step */}
              {step.content.impacts && (
                <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                  {step.content.impacts.map((impact, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-left p-4 bg-red-50 rounded-lg border border-red-100"
                    >
                      <span className="text-gray-700">{impact}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Actions for solution step */}
              {step.content.actions && (
                <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
                  {step.content.actions.map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-4xl mb-3">{action.icon}</div>
                      <h3 className="font-bold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.desc}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              <Button
                onClick={nextStep}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 px-8 py-4 text-lg"
              >
                {currentStep < onboardingSteps.length - 1 ? (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  "Start Preserving Heritage"
                )}
              </Button>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
