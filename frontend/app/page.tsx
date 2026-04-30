"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, TrendingUp, Shield, Zap } from "lucide-react";
import PredictionForm from "@/components/PredictionForm";
import ResultCard from "@/components/ResultCard";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-[#050810] text-white overflow-x-hidden">

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30">
            <Car className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-bold text-lg">MileageAI</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/50">
          <span className="hover:text-white cursor-pointer transition-colors">How it works</span>
          <span className="hover:text-white cursor-pointer transition-colors">API Docs</span>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-white text-sm">
            Get API Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center pt-20 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm mb-6">
            <Zap className="w-3 h-3" />
            <span>Powered by XGBoost · R² = 0.91</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Predict Vehicle
            <br />
            <span className="gradient-text">Annual Mileage</span>
          </h1>

          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            AI-powered mileage prediction for insurance pricing.
            Input vehicle and owner details — get instant risk assessment.
          </p>

          {/* Stats Row */}
          <div className="flex justify-center gap-8 mb-12">
            {[
              { icon: TrendingUp, label: "R² Score",      value: "0.91"    },
              { icon: Shield,     label: "Risk Levels",   value: "4 Tiers" },
              { icon: Car,        label: "Vehicle Types", value: "5 Types" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                  <Icon className="w-4 h-4" />
                  <span className="text-2xl font-bold text-white">{value}</span>
                </div>
                <span className="text-white/40 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <PredictionForm onResult={setResult} onLoading={setLoading} />
          <AnimatePresence mode="wait">
            {(result || loading) && (
              <ResultCard result={result} loading={loading} />
            )}
          </AnimatePresence>
        </div>
      </section>

    </main>
  );
}
