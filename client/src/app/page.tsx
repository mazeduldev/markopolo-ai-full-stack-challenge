import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-4 bg-gray-800 text-gray-200 border-gray-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Marketing Revolution
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Transform Your E-commerce Marketing with
            <span className="text-blue-400"> AI Intelligence</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Boost conversions, optimize campaigns, and scale your business with
            our cutting-edge AI marketing platform designed for modern
            e-commerce professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="text-lg px-8 py-3 text-gray-200 bg-blue-600 hover:bg-blue-700"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Marketing Professionals Choose Our AI Platform
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Advanced AI algorithms that understand your customers and optimize
            your marketing efforts in real-time
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-gray-700 bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-white">Smart Targeting</CardTitle>
              <CardDescription className="text-gray-300">
                AI-driven customer segmentation and personalized campaign
                targeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Behavioral analysis</li>
                <li>• Predictive audience modeling</li>
                <li>• Real-time personalization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-white">
                Performance Optimization
              </CardTitle>
              <CardDescription className="text-gray-300">
                Automatic campaign optimization for maximum ROI and conversion
                rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• A/B testing automation</li>
                <li>• Budget optimization</li>
                <li>• Performance forecasting</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <BarChart3 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-white">Advanced Analytics</CardTitle>
              <CardDescription className="text-gray-300">
                Deep insights and actionable data to drive your marketing
                strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Cross-channel attribution</li>
                <li>• Customer lifetime value</li>
                <li>• Predictive analytics</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800 border-y border-gray-700 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">250%</div>
              <div className="text-gray-300">Average ROI Increase</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">85%</div>
              <div className="text-gray-300">Conversion Rate Boost</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">
                10K+
              </div>
              <div className="text-gray-300">Active Marketers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">
                24/7
              </div>
              <div className="text-gray-300">AI Optimization</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Revolutionize Your Marketing?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful marketers who&apos;ve already
            transformed their campaigns with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="text-lg px-8 py-3 bg-white text-gray-900 hover:bg-gray-200"
              >
                <Zap className="mr-2 w-5 h-5" />
                Get Started Now
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 text-white border-white hover:bg-white"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
