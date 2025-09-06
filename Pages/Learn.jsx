import React, { useState, useEffect } from "react";
import { Word } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Volume2, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  Award,
  Target,
  Play,
  Pause
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Learn() {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [sessionWords, setSessionWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameMode, setGameMode] = useState('meaning'); // 'meaning' or 'pronunciation'

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      const allWords = await Word.list();
      const shuffledWords = allWords.sort(() => Math.random() - 0.5).slice(0, 10);
      setWords(shuffledWords);
      setSessionWords(shuffledWords);
      setCurrentWordIndex(0);
    } catch (error) {
      console.error("Error loading words:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentWord = sessionWords[currentWordIndex];
  const progress = sessionWords.length > 0 ? ((currentWordIndex + (showAnswer ? 1 : 0)) / sessionWords.length) * 100 : 0;

  const playAudio = async (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      
      // Update listen count
      if (currentWord) {
        await Word.update(currentWord.id, { 
          listen_count: (currentWord.listen_count || 0) + 1 
        });
      }
    }
  };

  const handleAnswer = (isCorrect) => {
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    setShowAnswer(true);
  };

  const nextWord = () => {
    if (currentWordIndex < sessionWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      // Session complete
      setCurrentWordIndex(-1);
    }
  };

  const resetSession = () => {
    const shuffledWords = words.sort(() => Math.random() - 0.5).slice(0, 10);
    setSessionWords(shuffledWords);
    setCurrentWordIndex(0);
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading learning session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No Words Available</h2>
          <p className="text-gray-500 mb-8">There are no words in the dictionary yet. Start by recording some words!</p>
          <Button onClick={() => window.location.href = '/record'} className="bg-blue-500 hover:bg-blue-600">
            Record Words
          </Button>
        </div>
      </div>
    );
  }

  // Session complete screen
  if (currentWordIndex === -1) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Award className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Session Complete!</h1>
            
            <Card className="max-w-md mx-auto mb-8 shadow-xl border-0">
              <CardContent className="p-8 text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">{percentage}%</div>
                <p className="text-gray-600 mb-4">
                  You got {score.correct} out of {score.total} words correct
                </p>
                
                <div className="space-y-2">
                  {percentage >= 80 ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-lg px-4 py-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Excellent!
                    </Badge>
                  ) : percentage >= 60 ? (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-lg px-4 py-2">
                      Good Job!
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-lg px-4 py-2">
                      Keep Practicing!
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={resetSession}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 px-8"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              <Button 
                onClick={() => window.location.href = '/dictionary'}
                size="lg"
                variant="outline"
                className="px-8"
              >
                Browse Dictionary
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Learn Heritage Words
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Word {currentWordIndex + 1} of {sessionWords.length}
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Score: {score.correct}/{score.total}
            </div>
          </div>
          <Progress value={progress} className="max-w-md mx-auto mt-4 h-2" />
        </div>

        <AnimatePresence mode="wait">
          {currentWord && (
            <motion.div
              key={currentWordIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-2xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-8">
                  <CardTitle className="text-2xl mb-4">Listen and Learn</CardTitle>
                  
                  {/* Audio Player */}
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={() => playAudio(currentWord.word_audio_url)}
                      className="w-24 h-24 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm"
                    >
                      <Volume2 className="w-8 h-8" />
                    </Button>
                  </div>
                  
                  {currentWord.dialect && (
                    <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30 mt-4">
                      {currentWord.dialect}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="p-8">
                  {!showAnswer ? (
                    <div className="text-center space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                          What does this word mean?
                        </h2>
                        <p className="text-gray-600">
                          Listen to the audio and choose the correct meaning
                        </p>
                      </div>

                      {/* Multiple choice options */}
                      <div className="grid gap-3 max-w-2xl mx-auto">
                        {/* Generate some fake options along with the correct one */}
                        {[
                          currentWord.meaning,
                          ...words.filter(w => w.id !== currentWord.id)
                                 .sort(() => Math.random() - 0.5)
                                 .slice(0, 3)
                                 .map(w => w.meaning)
                        ].sort(() => Math.random() - 0.5).map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="p-4 h-auto text-left justify-start hover:bg-blue-50"
                            onClick={() => handleAnswer(option === currentWord.meaning)}
                          >
                            <span className="text-base">{option}</span>
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="ghost"
                        onClick={() => playAudio(currentWord.word_audio_url)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Volume2 className="w-4 h-4 mr-2" />
                        Play Again
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {currentWord.word_text || "Word"}
                        </h2>
                        <p className="text-xl text-gray-700 mb-2">{currentWord.meaning}</p>
                        <p className="text-lg text-gray-600">{currentWord.translation}</p>
                      </div>

                      {currentWord.category && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          {currentWord.category}
                        </Badge>
                      )}

                      {currentWord.example_sentence && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">Example:</h3>
                          <p className="text-gray-700">{currentWord.example_sentence}</p>
                          {currentWord.example_audio_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => playAudio(currentWord.example_audio_url)}
                              className="mt-2"
                            >
                              <Volume2 className="w-4 h-4 mr-2" />
                              Play Example
                            </Button>
                          )}
                        </div>
                      )}

                      <Button
                        onClick={nextWord}
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        {currentWordIndex < sessionWords.length - 1 ? 'Next Word' : 'Finish Session'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Button */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={resetSession}
            className="border-gray-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart Session
          </Button>
        </div>
      </div>
    </div>
  );
}
