"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const OCCUPATIONS   = ["salaried", "self_employed", "business", "student", "retired"];
const VEHICLE_TYPES = ["hatchback", "sedan", "suv", "truck", "two_wheeler"];
const FUEL_TYPES    = ["petrol", "diesel", "cng", "electric"];

export default function PredictionForm({ onResult, onLoading }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    age:            35,
    occupation:     "salaried",
    annual_income:  700000,
    vehicle_type:   "sedan",
    vehicle_age:    3,
    engine_cc:      1500,
    fuel_type:      "petrol",
    city_tier:      1,
    traffic_index:  0.5,
  });

  const update = (key: string, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    onLoading(true);
    onResult(null);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      onResult(data);
    } catch {
      alert("API Error — make sure backend is running on port 8000");
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  const inputClass = `
    w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
    text-white text-sm focus:outline-none focus:border-blue-500/50
    transition-all placeholder:text-white/30
  `;

  const labelClass = "block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass glow rounded-2xl p-8"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
        Vehicle & Owner Details
      </h2>

      <div className="grid grid-cols-2 gap-5">

        {/* Age */}
        <div>
          <label className={labelClass}>Age</label>
          <input type="number" className={inputClass} value={form.age}
            onChange={e => update("age", +e.target.value)} min={18} max={70} />
        </div>

        {/* City Tier */}
        <div>
          <label className={labelClass}>City Tier</label>
          <select className={inputClass} value={form.city_tier}
            onChange={e => update("city_tier", +e.target.value)}>
            <option value={1}>Tier 1 — Metro</option>
            <option value={2}>Tier 2 — Mid City</option>
            <option value={3}>Tier 3 — Small Town</option>
          </select>
        </div>

        {/* Occupation */}
        <div className="col-span-2">
          <label className={labelClass}>Occupation</label>
          <div className="flex flex-wrap gap-2">
            {OCCUPATIONS.map(occ => (
              <button key={occ} onClick={() => update("occupation", occ)}
                className={`px-4 py-2 rounded-xl text-sm capitalize transition-all ${
                  form.occupation === occ
                    ? "bg-blue-600 text-white border border-blue-500"
                    : "bg-white/5 text-white/50 border border-white/10 hover:border-white/30"
                }`}>
                {occ.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Annual Income */}
        <div className="col-span-2">
          <label className={labelClass}>
            Annual Income — ₹{form.annual_income.toLocaleString("en-IN")}
          </label>
          <input type="range" min={80000} max={5000000} step={10000}
            value={form.annual_income}
            onChange={e => update("annual_income", +e.target.value)}
            className="w-full accent-blue-500" />
          <div className="flex justify-between text-white/30 text-xs mt-1">
            <span>₹80K</span><span>₹50L</span>
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="col-span-2">
          <label className={labelClass}>Vehicle Type</label>
          <div className="flex flex-wrap gap-2">
            {VEHICLE_TYPES.map(v => (
              <button key={v} onClick={() => update("vehicle_type", v)}
                className={`px-4 py-2 rounded-xl text-sm capitalize transition-all ${
                  form.vehicle_type === v
                    ? "bg-purple-600 text-white border border-purple-500"
                    : "bg-white/5 text-white/50 border border-white/10 hover:border-white/30"
                }`}>
                {v.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Age */}
        <div>
          <label className={labelClass}>Vehicle Age — {form.vehicle_age} yrs</label>
          <input type="range" min={0} max={20} value={form.vehicle_age}
            onChange={e => update("vehicle_age", +e.target.value)}
            className="w-full accent-purple-500" />
        </div>

        {/* Engine CC */}
        <div>
          <label className={labelClass}>Engine CC</label>
          <input type="number" className={inputClass} value={form.engine_cc}
            onChange={e => update("engine_cc", +e.target.value)} />
        </div>

        {/* Fuel Type */}
        <div>
          <label className={labelClass}>Fuel Type</label>
          <select className={inputClass} value={form.fuel_type}
            onChange={e => update("fuel_type", e.target.value)}>
            {FUEL_TYPES.map(f => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Traffic Index */}
        <div>
          <label className={labelClass}>Traffic Index — {form.traffic_index}</label>
          <input type="range" min={0.1} max={1.0} step={0.01}
            value={form.traffic_index}
            onChange={e => update("traffic_index", +e.target.value)}
            className="w-full accent-cyan-500" />
        </div>

      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600
          hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold
          transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Predicting...</>
          : <><Send className="w-4 h-4" /> Predict Mileage</>
        }
      </motion.button>
    </motion.div>
  );
}
