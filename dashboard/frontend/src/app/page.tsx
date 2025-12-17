'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProvinceNavbar } from '@/components/province-navbar';
import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <ProvinceNavbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="text-center md:text-left space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#222222]">
                Comprehensive brand health analytics
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Track TD Bank's brand perception across social media, news, and customer feedback with sentiment analysis and regional insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center pt-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-[#3C8825] hover:bg-[#3C8825]/90 text-white px-8 py-6 text-lg rounded-sm">
                    View Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-sm border-2 border-[#3C8825] text-[#3C8825] hover:bg-[#3C8825]/10"
                  asChild
                >
                  <a href="/documentation">
                    Documentation
                  </a>
                </Button>
              </div>
            </div>

            {/* Animation */}
            <div className="flex justify-center items-center">
              <div className="w-full max-w-lg">
                <Lottie
                  animationData={require('../../public/animation/business_analysis.json')}
                  loop={true}
                  autoplay={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
