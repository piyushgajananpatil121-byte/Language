import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  BookOpen, 
  Award,
  CheckCircle,
  Globe,
  University,
  Heart
} from "lucide-react";

const dataSources = [
  {
    icon: University,
    title: "Academic Partnerships",
    description: "Collaborating with linguistics departments from 15+ universities worldwide",
    badge: "Research Verified",
    color: "blue"
  },
  {
    icon: Users,
    title: "Native Speaker Communities",
    description: "Direct contributions from heritage language speakers and cultural experts",
    badge: "Authentic Voices",
    color: "green"
  },
  {
    icon: BookOpen,
    title: "Cultural Organizations",
    description: "Working with 50+ cultural preservation societies and heritage foundations",
    badge: "Community Backed",
    color: "purple"
  },
  {
    icon: Shield,
    title: "Quality Verification",
    description: "Multi-layer verification by linguists, native speakers, and cultural experts",
    badge: "Expert Reviewed",
    color: "orange"
  }
];

const credibilityStats = [
  { number: "2,500+", label: "Verified Contributors" },
  { number: "15", label: "Languages Documented" },
  { number: "98%", label: "Accuracy Rate" },
  { number: "50+", label: "Partner Organizations" }
];

export default function DataSourcesSection() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Trusted & Verified</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built on Authentic Heritage Data
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every word and story in Vani is verified through our network of linguistic experts, 
            native speakers, and cultural preservation organizations.
          </p>
        </div>

        {/* Credibility Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {credibilityStats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-md">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Sources Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {dataSources.map((source, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-${source.color}-100`}>
                      <source.icon className={`w-6 h-6 text-${source.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{source.title}</CardTitle>
                      <Badge 
                        className={`mt-2 bg-${source.color}-50 text-${source.color}-700 border-${source.color}-200`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {source.badge}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{source.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 bg-gray-50 px-8 py-6 rounded-2xl">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">UNESCO Recognition</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Academic Citations</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Community Endorsed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
