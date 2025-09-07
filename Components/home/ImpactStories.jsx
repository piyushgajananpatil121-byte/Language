import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Quote,
  Heart,
  Users,
  Mic,
  PlayCircle
} from "lucide-react";

const impactStories = [
  {
    quote: "My grandmother's Telugu lullabies were almost lost. Through Vani, I recorded them and now my daughter can learn them too.",
    author: "Priya Sharma",
    location: "Hyderabad, India",
    contribution: "15 songs recorded",
    language: "Telugu",
    impact: "Preserved family traditions"
  },
  {
    quote: "As the last fluent speaker of our tribal dialect, Vani helped me document 200+ words before they disappeared forever.",
    author: "Robert Standing Bear",
    location: "Montana, USA", 
    contribution: "200+ words",
    language: "Native American",
    impact: "Saved endangered dialect"
  },
  {
    quote: "Teaching my children Tamil was hard until we found Vani. Now they practice with their great-grandfather's recordings daily.",
    author: "Meera Patel",
    location: "London, UK",
    contribution: "Active learner",
    language: "Tamil",
    impact: "Connected generations"
  }
];

const globalImpact = [
  {
    icon: Mic,
    number: "12,847",
    label: "Words Recorded",
    description: "Across 47 heritage languages"
  },
  {
    icon: Users,
    number: "3,250",
    label: "Active Contributors",
    description: "From 6 continents"
  },
  {
    icon: Heart,
    number: "89%",
    label: "Families Reconnected",
    description: "With their cultural heritage"
  }
];

export default function ImpactStories() {
  return (
    <div className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real People, Real Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every contribution to Vani creates ripples of cultural preservation that span generations.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {globalImpact.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{stat.label}</h3>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Story Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {impactStories.map((story, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Quote className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-700 italic leading-relaxed mb-4">
                      "{story.quote}"
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{story.author}</h4>
                    <p className="text-sm text-gray-500">{story.location}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                      {story.language}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {story.contribution}
                    </Badge>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm font-medium text-green-700">
                      🌱 {story.impact}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="inline-block border-0 shadow-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Your Story Could Be Next
              </h3>
              <p className="text-orange-100 mb-6 max-w-md">
                Join thousands of heritage preservers making a lasting impact on cultural preservation.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-50"
              >
                Start Your Contribution
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
