import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause,
  SkipForward,
  X,
  Mic,
  BookOpen,
  Volume2,
  GraduationCap,
  CheckCircle
} from "lucide-react";

const demoSteps = [
  {
    id: "welcome",
    title: "Welcome to Vani Demo",
    description: "Experience how Vani preserves heritage languages in under 2 minutes",
    duration: 8,
    action: "highlight-home",
    content: "🌟 Vani helps preserve endangered languages through community contributions"
  },
  {
    id: "record",
    title: "Record Words",
    description: "See how easy it is to contribute a word to preserve heritage",
    duration: 15,
    action: "navigate-record",
    content: "🎤 Tap the record button and say a word in your heritage language"
  },
  {
    id: "meaning",
    title: "Add Meaning",
    description: "Provide context and translation for your recorded word",
    duration: 10,
    action: "show-form",
    content: "📝 Add meaning, translation, and category to make it searchable"
  },
  {
    id: "dictionary",
    title: "Living Dictionary",
    description: "Explore the growing collection of community-contributed words",
    duration: 12,
    action: "navigate-dictionary",
    content: "📚 Browse, search, and listen to words from various heritage languages"
  },
  {
    id: "learn",
    title: "Interactive Learning",
    description: "Help others learn heritage languages through flashcards",
    duration: 15,
    action: "navigate-learn",
    content: "🎓 Practice with audio flashcards and test pronunciation skills"
  },
  {
    id: "impact",
    title: "Real Impact",
    description: "Every contribution helps preserve cultural heritage for future generations",
    duration: 10,
    action: "show-impact",
    content: "🌍 Join thousands preserving languages, one word at a time"
  }
];

export default function DemoMode({ onExit }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const currentDemo = demoSteps[currentStep];
  const totalDuration = demoSteps.reduce((sum, step) => sum + step.duration, 0);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < demoSteps.length) {
      interval = setInterval(() => {
        setStepProgress(prev => {
          const newProgress = prev + (100 / currentDemo.duration);
          if (newProgress >= 100) {
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep(s => s + 1);
              setStepProgress(0);
            } else {
              setIsPlaying(false);
            }
            return 0;
          }
          return newProgress;
        });
        setTotalTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, currentDemo?.duration]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setStepProgress(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (currentStep >= demoSteps.length) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Demo Complete!</h2>
            <p className="text-gray-600 mb-6">
              You've seen how Vani preserves heritage languages through community contributions.
            </p>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  setCurrentStep(0);
                  setStepProgress(0);
                  setTotalTime(0);
                  setIsPlaying(false);
                }}
                variant="outline"
                className="flex-1"
              >
                Watch Again
              </Button>
              <Button 
                onClick={onExit}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600"
              >
                Start Using Vani
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Play className="w-5 h-5" />
                Vani Demo Mode
              </CardTitle>
              <p className="text-blue-100 text-sm mt-1">
                {formatTime(totalTime)} / {formatTime(totalDuration)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onExit}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Overall progress */}
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(totalTime / totalDuration) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step indicator */}
              <div className="flex justify-center mb-6">
                <Badge className="bg-blue-100 text-blue-700 px-3 py-1">
                  Step {currentStep + 1} of {demoSteps.length}
                </Badge>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentDemo.title}
                </h2>
                <p className="text-gray-600 text-lg mb-4">
                  {currentDemo.description}
                </p>
                
                {/* Content preview */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 mb-6">
                  <div className="text-2xl mb-2">
                    {currentDemo.content.split(' ')[0]}
                  </div>
                  <p className="text-gray-700">
                    {currentDemo.content.substring(2)}
                  </p>
                </div>
              </div>

              {/* Step progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Step Progress</span>
                  <span>{currentDemo.duration}s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-amber-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${stepProgress}%` }}
                  />
                </div>
              </div>

              {/* Demo actions */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={togglePlayPause}
                  className={`${
                    isPlaying 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  } px-6`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Demo
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {stepProgress > 0 ? 'Resume' : 'Start Demo'}
                    </>
                  )}
                </Button>

                <Button
                  onClick={nextStep}
                  variant="outline"
                  disabled={currentStep >= demoSteps.length - 1}
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip Step
                </Button>
              </div>

              {/* Quick navigation */}
              <div className="flex justify-center gap-1 mt-6">
                {demoSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentStep(index);
                      setStepProgress(0);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentStep 
                        ? 'bg-blue-500' 
                        : index < currentStep 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
