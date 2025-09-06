import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Word, Story } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  BookOpen, 
  Volume2, 
  TrendingUp,
  Users,
  Award,
  Sparkles,
  Play,
  Rocket
} from "lucide-react";

// Import new components
import OnboardingFlow from "../components/onboarding/OnboardingFlow";
import DemoMode from "../components/demo/DemoMode";
import DataSourcesSection from "../components/home/DataSourcesSection";
import ImpactStories from "../components/home/ImpactStories";
import InteractiveFeatures from "../components/home/InteractiveFeatures";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [stats, setStats] = useState({
    totalWords: 0,
    totalStories: 0,
    totalListens: 0
  });
  const [recentWords, setRecentWords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is new (simplified check)
  const [isNewUser] = useState(() => {
    return !localStorage.getItem('vani_visited');
  });

  useEffect(() => {
    loadData();
    
    // Show onboarding for new users
    if (isNewUser) {
      setShowOnboarding(true);
      localStorage.setItem('vani_visited', 'true');
    }
  }, [isNewUser]);

  const loadData = async () => {
    try {
      const words = await Word.list("-created_date", 5);
      const stories = await Story.list();
      
      const totalListens = words.reduce((sum, word) => sum + (word.listen_count || 0), 0);
      
      setStats({
        totalWords: words.length,
        totalStories: stories.length,
        totalListens
      });
      setRecentWords(words);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient }) => (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 text-orange-600`} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
              {loading ? "..." : value}
            </p>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        </div>
      </CardHeader>
      {subtitle && (
        <CardContent className="pt-0">
          <p className="text-xs text-gray-400">{subtitle}</p>
        </CardContent>
      )}
    </Card>
  );

  // Show onboarding flow
  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  // Show demo mode
  if (showDemo) {
    return <DemoMode onExit={() => setShowDemo(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100 mb-6">
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Preserving Heritage Languages</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-6">
              Welcome to Vani
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Every word you record, every story you share helps preserve the beautiful heritage of our languages for future generations
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to={createPageUrl("Record")}>
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg hover:scale-105">
                  <Mic className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
              </Link>
              
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setShowDemo(true)}
                className="w-full sm:w-auto border-orange-200 hover:bg-orange-50 px-8 py-6 text-lg hover:scale-105 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>

              <Link to={createPageUrl("Dictionary")}>
                <Button size="lg" variant="ghost" className="w-full sm:w-auto hover:bg-white hover:shadow-md px-8 py-6 text-lg transition-all duration-300">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Dictionary
                </Button>
              </Link>
            </div>

            {/* Quick Demo Button */}
            <div className="mb-16">
              <Button
                onClick={() => setShowDemo(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-full"
              >
                <Rocket className="w-4 h-4 mr-2" />
                2-Minute Demo Tour
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={Volume2}
            title="Words Recorded"
            value={stats.totalWords}
            subtitle="Community contributions"
            gradient="from-orange-500 to-amber-600"
          />
          <StatCard
            icon={BookOpen}
            title="Stories Shared"
            value={stats.totalStories}
            subtitle="Cultural narratives"
            gradient="from-amber-500 to-yellow-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Listens"
            value={stats.totalListens}
            subtitle="Learning engagement"
            gradient="from-yellow-500 to-orange-600"
          />
        </div>
      </div>

      {/* Interactive Features Section */}
      <InteractiveFeatures />

      {/* Data Sources Section */}
      <DataSourcesSection />

      {/* Impact Stories Section */}
      <ImpactStories />

      {/* Recent Words */}
      {recentWords.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Award className="w-6 h-6" />
                Recently Added Words
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentWords.map((word) => (
                  <div key={word.id} className="group p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">
                        {word.word_text || "Audio Word"}
                      </h3>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                        {word.category}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{word.meaning}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {word.dialect && `${word.dialect} • `}
                        {word.listen_count} listens
                      </span>
                      {word.word_audio_url && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            const audio = new Audio(word.word_audio_url);
                            audio.play();
                            Word.update(word.id, { listen_count: (word.listen_count || 0) + 1 });
                          }}
                          className="hover:bg-orange-100 group-hover:scale-110 transition-all duration-300"
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <Card className="text-center bg-gradient-to-r from-orange-500 to-amber-600 border-0 text-white shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10" />
          <CardContent className="relative py-16 px-8">
            <Users className="w-20 h-20 mx-auto mb-8 text-white opacity-90" />
            <h2 className="text-4xl font-bold mb-6">
              Join Our Heritage Preservers
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Every contribution matters. Help us build the world's most comprehensive collection of heritage language recordings and ensure these cultural treasures live on forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Record")}>
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-50 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg">
                  Start Contributing Now
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setShowDemo(true)}
                className="border-white text-white hover:bg-white hover:text-orange-600 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg"
              >
                Watch How It Works
              </Button>
            </div>
          //repo error handeling is done in backend 
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
