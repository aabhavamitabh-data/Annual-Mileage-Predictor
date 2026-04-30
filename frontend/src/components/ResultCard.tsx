"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

const RISK_CONFIG: Record<string, { color: string; bg: string; icon: any; desc: string }> = {
  "Low Risk":       { color: "text-green-400",  bg: "bg-green-500/10  border-green-500/30",  icon: CheckCircle,   desc: "Low premium recommended"     },
  "Medium Risk":    { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", icon: Shield,        desc: "Standard premium applies"     },
  "High Risk":      { color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", icon: TrendingUp,    desc: "Higher premium recommended"   },
  "Very High Risk": { color: "text-red-400",    bg: "bg-red-500/10    border-red-500/30",    icon: AlertTriangle, desc: "Maximum premium tier"         },
};

export default function ResultCard({ result, loading }: any) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-80"
      >
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-white/50">Running ML model...</p>
      </motion.div>
    );
  }

  if (!result) return null;

  const risk   = RISK_CONFIG[result.risk_category] || RISK_CONFIG["Medium Risk"];
  const Icon   = risk.icon;
  const annKms = result.predicted_annual_kms.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const monKms = result.predicted_monthly_kms.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const fillPct = Math.min((result.predicted_annual_kms / 80000) * 100, 100);

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="glass glow rounded-2xl p-8 space-y-6"
    >
      <h2 className="text-xl font-bold flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
        Prediction Result
      </h2>

      {/* Main KMS Display */}
      <div className="text-center py-6 border border-white/5 rounded-xl bg-white/2">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <p className="text-white/40 text-sm mb-2 uppercase tracking-widest">Annual Mileage</p>
          <p className="text-6xl font-bold gradient-text">{annKms}</p>
          <p className="text-white/40 mt-1">kilometres / year</p>
        </motion.div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-white/50 text-xs">Monthly</span>
          </div>
          <p className="text-2xl font-bold">{monKms}</p>
          <p className="text-white/30 text-xs">km / month</p>
        </div>

        <div className={`rounded-xl p-4 border ${risk.bg}`}>
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-4 h-4 ${risk.color}`} />
            <span className="text-white/50 text-xs">Risk Level</span>
          </div>
          <p className={`text-lg font-bold ${risk.color}`}>{result.risk_category}</p>
          <p className="text-white/30 text-xs">{risk.desc}</p>
        </div>
      </div>

      {/* Usage Bar */}
      <div>
        <div className="flex justify-between text-xs text-white/40 mb-2">
          <span>Usage Intensity</span>
          <span>{Math.round(fillPct)}% of max</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fillPct}%` }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          />
        </div>
        <div className="flex justify-between text-xs text-white/30 mt-1">
          <span>0 km</span><span>80,000 km</span>
        </div>
      </div>

      {/* Insurance Recommendation */}
      <div className="bg-white/3 rounded-xl p-4 border border-white/5">
        <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
          Insurance Recommendation
        </p>
        <p className="text-sm text-white/80">
          Based on predicted <strong className="text-white">{annKms} km/year</strong>,
          this vehicle falls in the{" "}
          <strong className={risk.color}>{result.risk_category}</strong> category.
          {" "}{risk.desc}.
        </p>
      </div>

    </motion.div>
  );
}
