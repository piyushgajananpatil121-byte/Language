
import React, { useState, useRef, useEffect } from "react";
import { Word, Story } from "@/entities/all";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Square,
  Play,
  Pause,
  Save,
  RefreshCw,
  Volume2,
  BookText,
  CheckCircle,
  AlertCircle,
  Sparkles // Added Sparkles import
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Record() {
  // Word recording state
  const [wordRecording, setWordRecording] = useState(false);
  const [wordAudio, setWordAudio] = useState(null);
  const [wordData, setWordData] = useState({
    word_text: "",
    meaning: "",
    translation: "",
    category: "",
    dialect: "",
    example_sentence: ""
  });

  // Example sentence recording state
  const [exampleRecording, setExampleRecording] = useState(false);
  const [exampleAudio, setExampleAudio] = useState(null);

  // Story recording state
  const [storyRecording, setStoryRecording] = useState(false);
  const [storyAudio, setStoryAudio] = useState(null);
  const [storyData, setStoryData] = useState({
    title: "",
    story_type: "",
    dialect: "",
    transcription: "",
    translation: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("word");

  // Add performance optimization with lazy loading
  const [isVisible, setIsVisible] = useState(false);

  const wordMediaRecorder = useRef(null);
  const exampleMediaRecorder = useRef(null);
  const storyMediaRecorder = useRef(null);

  // Effect to set isVisible to true after component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Word recording functions
  const startWordRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      wordMediaRecorder.current = new MediaRecorder(stream);

      const chunks = [];
      wordMediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      wordMediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setWordAudio(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      wordMediaRecorder.current.start();
      setWordRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setSubmitStatus({ type: "error", message: "Error starting recording. Please ensure microphone access is granted." });
    }
  };

  const stopWordRecording = () => {
    if (wordMediaRecorder.current && wordRecording) {
      wordMediaRecorder.current.stop();
      setWordRecording(false);
    }
  };

  // Example sentence recording functions
  const startExampleRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      exampleMediaRecorder.current = new MediaRecorder(stream);

      const chunks = [];
      exampleMediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      exampleMediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setExampleAudio(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      exampleMediaRecorder.current.start();
      setExampleRecording(true);
    } catch (error) {
      console.error("Error starting example recording:", error);
      setSubmitStatus({ type: "error", message: "Error starting example recording. Please ensure microphone access is granted." });
    }
  };

  const stopExampleRecording = () => {
    if (exampleMediaRecorder.current && exampleRecording) {
      exampleMediaRecorder.current.stop();
      setExampleRecording(false);
    }
  };

  // Story recording functions
  const startStoryRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      storyMediaRecorder.current = new MediaRecorder(stream);

      const chunks = [];
      storyMediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      storyMediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setStoryAudio(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      storyMediaRecorder.current.start();
      setStoryRecording(true);
    } catch (error) {
      console.error("Error starting story recording:", error);
      setSubmitStatus({ type: "error", message: "Error starting story recording. Please ensure microphone access is granted." });
    }
  };

  const stopStoryRecording = () => {
    if (storyMediaRecorder.current && storyRecording) {
      storyMediaRecorder.current.stop();
      setStoryRecording(false);
    }
  };

  const submitWord = async () => {
    if (!wordAudio || !wordData.meaning || !wordData.translation) {
      setSubmitStatus({ type: "error", message: "Please record the word and provide both meaning and translation." });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null); // Clear previous status
    try {
      // Upload word audio
      const audioFile = new File([wordAudio], `word-${Date.now()}.wav`, { type: 'audio/wav' });
      const { file_url: wordAudioUrl } = await UploadFile({ file: audioFile });

      let exampleAudioUrl = null;
      if (exampleAudio) {
        const exampleFile = new File([exampleAudio], `example-${Date.now()}.wav`, { type: 'audio/wav' });
        const { file_url } = await UploadFile({ file: exampleFile });
        exampleAudioUrl = file_url;
      }

      // Create word entry
      await Word.create({
        ...wordData,
        word_audio_url: wordAudioUrl,
        example_audio_url: exampleAudioUrl
      });

      setSubmitStatus({ type: "success", message: "Word recorded successfully! Thank you for your contribution." });

      // Reset form
      setWordAudio(null);
      setExampleAudio(null);
      setWordData({
        word_text: "",
        meaning: "",
        translation: "",
        category: "",
        dialect: "",
        example_sentence: ""
      });

    } catch (error) {
      setSubmitStatus({ type: "error", message: "Error saving word. Please try again." });
      console.error("Error submitting word:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitStory = async () => {
    if (!storyAudio || !storyData.title) {
      setSubmitStatus({ type: "error", message: "Please record the story and provide a title." });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null); // Clear previous status
    try {
      // Upload story audio
      const audioFile = new File([storyAudio], `story-${Date.now()}.wav`, { type: 'audio/wav' });
      const { file_url: storyAudioUrl } = await UploadFile({ file: audioFile });

      // Create story entry
      await Story.create({
        ...storyData,
        audio_url: storyAudioUrl
      });

      setSubmitStatus({ type: "success", message: "Story recorded successfully! Thank you for preserving our heritage." });

      // Reset form
      setStoryAudio(null);
      setStoryData({
        title: "",
        story_type: "",
        dialect: "",
        transcription: "",
        translation: ""
      });

    } catch (error) {
      setSubmitStatus({ type: "error", message: "Error saving story. Please try again." });
      console.error("Error submitting story:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render a loading spinner until the component is visible
  if (!isVisible) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100 mb-4">
            <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Preserve Heritage</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Record & Preserve
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share the beauty of your language with the world. Every recording helps preserve our cultural heritage for future generations.
          </p>
        </div>

        {submitStatus && (
          <Alert className={`mb-6 ${submitStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            {submitStatus.type === 'success' ?
              <CheckCircle className="h-4 w-4 text-green-600" /> :
              <AlertCircle className="h-4 w-4 text-red-600" />
            }
            <AlertDescription className={submitStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 max-w-md mx-auto h-12 bg-white shadow-sm">
            <TabsTrigger value="word" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Mic className="w-4 h-4 mr-2" />
              Record Word
            </TabsTrigger>
            <TabsTrigger value="story" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <BookText className="w-4 h-4 mr-2" />
              Share Story
            </TabsTrigger>
          </TabsList>

          <TabsContent value="word" className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Record a Word
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Word Recording Section */}
                <div className="text-center">
                  <div className="mb-6">
                    <Button
                      size="lg"
                      onClick={wordRecording ? stopWordRecording : startWordRecording}
                      className={`w-32 h-32 rounded-full ${
                        wordRecording
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                          : 'bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700'
                      } shadow-xl`}
                    >
                      {wordRecording ? (
                        <Square className="w-8 h-8" />
                      ) : (
                        <Mic className="w-8 h-8" />
                      )}
                    </Button>
                  </div>

                  {wordAudio && (
                    <div className="mb-4">
                      <Badge className="bg-green-100 text-green-700 mb-2">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Word Recorded
                      </Badge>
                      <div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const audio = new Audio(URL.createObjectURL(wordAudio));
                            audio.play();
                          }}
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          Play Recording
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Word Details Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="word_text">Word (Optional)</Label>
                    <Input
                      id="word_text"
                      placeholder="Write the word if possible"
                      value={wordData.word_text}
                      onChange={(e) => setWordData({...wordData, word_text: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dialect">Dialect/Language</Label>
                    <Input
                      id="dialect"
                      placeholder="e.g., Telugu, Kannada, Hindi"
                      value={wordData.dialect}
                      onChange={(e) => setWordData({...wordData, dialect: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meaning">Meaning *</Label>
                    <Input
                      id="meaning"
                      placeholder="What does this word mean?"
                      value={wordData.meaning}
                      onChange={(e) => setWordData({...wordData, meaning: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="translation">Translation *</Label>
                    <Input
                      id="translation"
                      placeholder="Translation in Hindi/English"
                      value={wordData.translation}
                      onChange={(e) => setWordData({...wordData, translation: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={wordData.category} onValueChange={(value) => setWordData({...wordData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="noun">Noun</SelectItem>
                        <SelectItem value="verb">Verb</SelectItem>
                        <SelectItem value="adjective">Adjective</SelectItem>
                        <SelectItem value="greeting">Greeting</SelectItem>
                        <SelectItem value="household">Household Item</SelectItem>
                        <SelectItem value="nature">Nature</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="emotion">Emotion</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="example_sentence">Example Sentence (Optional)</Label>
                    <Input
                      id="example_sentence"
                      placeholder="Use the word in a sentence"
                      value={wordData.example_sentence}
                      onChange={(e) => setWordData({...wordData, example_sentence: e.target.value})}
                    />
                  </div>
                </div>

                {/* Example Sentence Recording */}
                {wordData.example_sentence && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Record Example Sentence (Optional)</h3>
                    <div className="text-center">
                      <Button
                        onClick={exampleRecording ? stopExampleRecording : startExampleRecording}
                        className={`${
                          exampleRecording
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-purple-500 hover:bg-purple-600'
                        } mb-4`}
                      >
                        {exampleRecording ? (
                          <>
                            <Square className="w-4 h-4 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Record Example
                          </>
                        )}
                      </Button>

                      {exampleAudio && (
                        <div>
                          <Badge className="bg-green-100 text-green-700 mb-2">
                            Example Recorded
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  onClick={submitWord}
                  disabled={isSubmitting || !wordAudio}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 py-3"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Word
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="story" className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookText className="w-5 h-5" />
                  Share a Story
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Story Recording Section */}
                <div className="text-center">
                  <div className="mb-6">
                    <Button
                      size="lg"
                      onClick={storyRecording ? stopStoryRecording : startStoryRecording}
                      className={`w-32 h-32 rounded-full ${
                        storyRecording
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                          : 'bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                      } shadow-xl`}
                    >
                      {storyRecording ? (
                        <Square className="w-8 h-8" />
                      ) : (
                        <Mic className="w-8 h-8" />
                      )}
                    </Button>
                  </div>

                  {storyAudio && (
                    <div className="mb-4">
                      <Badge className="bg-green-100 text-green-700 mb-2">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Story Recorded
                      </Badge>
                      <div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const audio = new Audio(URL.createObjectURL(storyAudio));
                            audio.play();
                          }}
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          Play Recording
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Story Details Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Story Title *</Label>
                      <Input
                        id="title"
                        placeholder="Give your story a title"
                        value={storyData.title}
                        onChange={(e) => setStoryData({...storyData, title: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="story_dialect">Dialect/Language</Label>
                      <Input
                        id="story_dialect"
                        placeholder="e.g., Telugu, Kannada, Hindi"
                        value={storyData.dialect}
                        onChange={(e) => setStoryData({...storyData, dialect: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="story_type">Story Type</Label>
                      <Select value={storyData.story_type} onValueChange={(value) => setStoryData({...storyData, story_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="What type of story is this?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="folktale">Folktale</SelectItem>
                          <SelectItem value="song">Song</SelectItem>
                          <SelectItem value="ritual">Ritual</SelectItem>
                          <SelectItem value="personal_story">Personal Story</SelectItem>
                          <SelectItem value="proverb">Proverb</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transcription">Transcription (Optional)</Label>
                    <Textarea
                      id="transcription"
                      placeholder="Write down the story in the original language"
                      value={storyData.transcription}
                      onChange={(e) => setStoryData({...storyData, transcription: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="story_translation">Translation (Optional)</Label>
                    <Textarea
                      id="story_translation"
                      placeholder="Translate the story to Hindi/English"
                      value={storyData.translation}
                      onChange={(e) => setStoryData({...storyData, translation: e.target.value})}
                      rows={4}
                    />
                  </div>
                </div>

                <Button
                  onClick={submitStory}
                  disabled={isSubmitting || !storyAudio}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 py-3"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Story
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
