import React, { useState, useEffect } from "react";
import { Word, Story } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Volume2, 
  Search, 
  BookOpen,
  Filter,
  Heart,
  TrendingUp
} from "lucide-react";

export default function Dictionary() {
  const [words, setWords] = useState([]);
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialectFilter, setDialectFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const wordsData = await Word.list("-created_date");
      const storiesData = await Story.list("-created_date");
      setWords(wordsData);
      setStories(storiesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWords = words.filter(word => {
    const matchesSearch = !searchTerm || 
      word.meaning?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.translation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.word_text?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || word.category === categoryFilter;
    const matchesDialect = dialectFilter === "all" || word.dialect === dialectFilter;
    
    return matchesSearch && matchesCategory && matchesDialect;
  });

  const filteredStories = stories.filter(story => {
    const matchesSearch = !searchTerm || 
      story.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.transcription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.translation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDialect = dialectFilter === "all" || story.dialect === dialectFilter;
    
    return matchesSearch && matchesDialect;
  });

  const uniqueDialects = [...new Set([...words, ...stories].map(item => item.dialect).filter(Boolean))];

  const playAudio = async (audioUrl, itemId, isStory = false) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      
      // Update listen count
      if (isStory) {
        const story = stories.find(s => s.id === itemId);
        await Story.update(itemId, { listen_count: (story.listen_count || 0) + 1 });
        setStories(prev => prev.map(s => 
          s.id === itemId ? { ...s, listen_count: (s.listen_count || 0) + 1 } : s
        ));
      } else {
        const word = words.find(w => w.id === itemId);
        await Word.update(itemId, { listen_count: (word.listen_count || 0) + 1 });
        setWords(prev => prev.map(w => 
          w.id === itemId ? { ...w, listen_count: (w.listen_count || 0) + 1 } : w
        ));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dictionary...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Living Dictionary
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our growing collection of heritage words and stories. Each entry is a precious piece of cultural heritage.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search words, meanings, or translations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="noun">Noun</SelectItem>
                    <SelectItem value="verb">Verb</SelectItem>
                    <SelectItem value="adjective">Adjective</SelectItem>
                    <SelectItem value="greeting">Greeting</SelectItem>
                    <SelectItem value="household">Household</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="emotion">Emotion</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dialectFilter} onValueChange={setDialectFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Dialect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dialects</SelectItem>
                    {uniqueDialects.map(dialect => (
                      <SelectItem key={dialect} value={dialect}>{dialect}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="words" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12 bg-white shadow-sm">
            <TabsTrigger value="words" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              Words ({filteredWords.length})
            </TabsTrigger>
            <TabsTrigger value="stories" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              Stories ({filteredStories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="words" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWords.map((word) => (
                <Card key={word.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {word.word_text || "Audio Word"}
                        </CardTitle>
                        {word.dialect && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {word.dialect}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => playAudio(word.word_audio_url, word.id)}
                        className="hover:bg-orange-50 shrink-0"
                      >
                        <Volume2 className="w-4 h-4 text-orange-600" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-gray-900">{word.meaning}</p>
                        <p className="text-sm text-gray-600">{word.translation}</p>
                      </div>
                      
                      {word.category && (
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                          {word.category}
                        </Badge>
                      )}

                      {word.example_sentence && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Example:</span> {word.example_sentence}
                          </p>
                          {word.example_audio_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => playAudio(word.example_audio_url, word.id)}
                              className="h-8 px-3"
                            >
                              <Volume2 className="w-3 h-3 mr-1" />
                              Play Example
                            </Button>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {word.listen_count || 0} listens
                        </span>
                        {word.is_verified && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredWords.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No words found</h3>
                <p className="text-gray-500">Try adjusting your search terms or filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredStories.map((story) => (
                <Card key={story.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{story.title}</CardTitle>
                        <div className="flex gap-2 mt-2">
                          {story.dialect && (
                            <Badge variant="outline" className="text-xs">
                              {story.dialect}
                            </Badge>
                          )}
                          {story.story_type && (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                              {story.story_type.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => playAudio(story.audio_url, story.id, true)}
                        className="hover:bg-purple-50 shrink-0"
                      >
                        <Volume2 className="w-4 h-4 text-purple-600" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {story.transcription && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Original:</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {story.transcription}
                          </p>
                        </div>
                      )}

                      {story.translation && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Translation:</h4>
                          <p className="text-sm text-gray-600">
                            {story.translation}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {story.listen_count || 0} listens
                        </span>
                        {story.is_transcribed && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Transcribed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStories.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No stories found</h3>
                <p className="text-gray-500">Try adjusting your search terms or filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
