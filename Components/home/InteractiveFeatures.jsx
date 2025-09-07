import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  BookOpen, 
  GraduationCap,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Sparkles
} from "lucide-react";

const features = [
  {
    id: "record",
    icon: Mic,
    title: "One-Tap Recording",
    description: "Capture heritage words with studio-quality audio",
    color: "from-red-500 to-pink-600",
    demo: {
      steps: ["Tap record", "Say your word", "Add meaning", "Save forever"],
      visual: "🎤"
    }
  },
  {
    id: "dictionary",
    icon: BookOpen,
    title: "Living Dictionary",
    description: "Search through thousands of community-contributed words",
    color: "from-blue-500 to-cyan-600",
    demo: {
      steps: ["Search any word", "Listen to pronunciation", "Learn context", "Discover heritage"],
      visual: "📚"
    }
  },
  {
    id: "learn",
    icon: GraduationCap,
    title: "Interactive Learning",
    description: "Master pronunciation with AI-powered feedback",
    color: "from-purple-500 to-indigo-600",
    demo: {
      steps: ["Listen to word", "Record yourself", "Get feedback", "Improve skills"],
      visual: "🎓"
    }
  }
];

export default function InteractiveFeatures() {
  const [activeFeature, setActiveFeature] = useState("record");
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentFeature = features.find(f => f.id === activeFeature);

  const startDemo = () => {
    setIsPlaying(true);
    setDemoStep(0);
    
    const interval = setInterval(() => {
      setDemoStep(prev => {
        if (prev < currentFeature.demo.steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
      });
    }, 1500);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setDemoStep(0);
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full mb-4">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Interactive Experience</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See Vani in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience how simple it is to preserve and learn heritage languages
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Feature Selection */}
          <div className="space-y-4">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer border-2 transition-all duration-300 ${
                    activeFeature === feature.id
                      ? 'border-purple-300 shadow-lg bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => {
                    setActiveFeature(feature.id);
                    resetDemo();
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                      {activeFeature === feature.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <Sparkles className="w-5 h-5 text-purple-600" />
                        </motion.div>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Interactive Demo */}
          <div className="sticky top-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-2xl overflow-hidden">
                  <CardHeader className={`text-white bg-gradient-to-r ${currentFeature.color}`}>
                    <CardTitle className="text-xl text-center">
                      {currentFeature.title} Demo
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    {/* Visual Demo */}
                    <div className="text-center mb-8">
                      <div className="text-6xl mb-6">{currentFeature.demo.visual}</div>
                      
                      {/* Demo Steps */}
                      <div className="space-y-3">
                        {currentFeature.demo.steps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0.3, scale: 0.95 }}
                            animate={{ 
                              opacity: isPlaying && index <= demoStep ? 1 : 0.3,
                              scale: isPlaying && index === demoStep ? 1.05 : 0.95
                            }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                              isPlaying && index === demoStep 
                                ? 'bg-purple-50 border-2 border-purple-200' 
                                : 'bg-gray-50'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              isPlaying && index <= demoStep 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-gray-300 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                            <span className={`font-medium ${
                              isPlaying && index === demoStep ? 'text-purple-900' : 'text-gray-700'
                            }`}>
                              {step}
                            </span>
                            {isPlaying && index === demoStep && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto"
                              >
                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-ping" />
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Demo Controls */}
                    <div className="flex justify-center gap-4">
                      {!isPlaying ? (
                        <Button 
                          onClick={startDemo}
                          className={`bg-gradient-to-r ${currentFeature.color} hover:scale-105 transition-transform`}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch Demo
                        </Button>
                      ) : (
                        <Button 
                          onClick={resetDemo}
                          variant="outline"
                          className="border-gray-300"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Stop Demo
                        </Button>
                      )}
                      
                      <Button 
                        onClick={resetDemo}
                        variant="ghost"
                        className="text-gray-600"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
