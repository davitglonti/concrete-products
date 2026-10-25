import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { CONCRETE_TEXTURES } from "../data/textureData";
import {
  Calculator as CalcIcon,
  Layers,
  ArrowRight,
  CheckCircle2,
  Phone,
  Scale,
  Sparkles,
  ShieldCheck,
  Send,
  HelpCircle,
  Truck,
  FileSpreadsheet,
} from "lucide-react";

export default function Calculator() {
  const { addInquiry } = useData();

  // Active Tab: 'steps' | 'pavers'
  const [activeTab, setActiveTab] = useState("steps");

  // --- STEPS CALCULATOR STATE ---
  const [stepType, setStepType] = useState("l-step"); // 'l-step' | 'straight' | 'cantilever'
  const [stepCount, setStepCount] = useState(12);
  const [stepLength, setStepLength] = useState(120); // cm
  const [stepDepth, setStepDepth] = useState(35); // cm
  const [stepColor, setStepColor] = useState(CONCRETE_TEXTURES[0].id);

  // --- PAVERS CALCULATOR STATE ---
  const [paverArea, setPaverArea] = useState(50); // m²
  const [paverSize, setPaverSize] = useState("80x80"); // '60x60' | '80x80' | '100x100' | '120x60'
  const [paverReserve, setPaverReserve] = useState(5); // %
  const [paverColor, setPaverColor] = useState(CONCRETE_TEXTURES[0].id);

  // --- SUBMISSION FORM ---
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  // Step types config
  const STEP_MODELS = {
    "l-step": {
      name: "L-ფორმის მონოლითური საფეხური",
      basePricePerMeter: 95,
      weightPerMeter: 38, // kg per linear meter (approx M500 concrete)
      desc: "საფეხური და ვერტიკალური ნაწილი (პადსტუპენოკი) ერთ მთლიან ნაჭერში, ნაკერის გარეშე.",
    },
    straight: {
      name: "სწორი მასიური ბეტონის ფილა",
      basePricePerMeter: 75,
      weightPerMeter: 28,
      desc: "მინიმალისტური ჰორიზონტალური ბეტონის ფილა გარე და შიდა კიბეებისთვის.",
    },
    cantilever: {
      name: "მცურავი / კონსოლური საფეხური",
      basePricePerMeter: 125,
      weightPerMeter: 45,
      desc: "გაძლიერებული შიდა კარკასით კედლიდან გამომავალი 'მცურავი' კიბის დიზაინისთვის.",
    },
  };

  // Paver sizes config
  const PAVER_SIZES = {
    "60x60": {
      name: "60 × 60 × 5 სმ",
      areaPerTile: 0.36,
      basePricePerSqm: 60,
      weightPerSqm: 115, // kg per m²
      desc: "იდეალურია საცალფეხო ბილიკებისა და მცირე ეზოებისთვის.",
    },
    "80x80": {
      name: "80 × 80 × 6 სმ",
      areaPerTile: 0.64,
      basePricePerSqm: 75,
      weightPerSqm: 140,
      desc: "ყველაზე მოთხოვნადი ფორმატი თანამედროვე ვილების ეზოებისთვის.",
    },
    "100x100": {
      name: "100 × 100 × 8 სმ",
      areaPerTile: 1.0,
      basePricePerSqm: 95,
      weightPerSqm: 190,
      desc: "მასიური არქიტექტურული ფილა მსუბუქი საავტომობილო დატვირთვისთვისაც.",
    },
    "120x60": {
      name: "120 × 60 × 6 სმ",
      areaPerTile: 0.72,
      basePricePerSqm: 85,
      weightPerSqm: 145,
      desc: "წაგრძელებული ელიტური გეომეტრია ტერასებისა და აუზის გარშემო სივრცისთვის.",
    },
  };

  // Calculations: Steps
  const stepsCalc = useMemo(() => {
    const model = STEP_MODELS[stepType];
    const texture = CONCRETE_TEXTURES.find((t) => t.id === stepColor) || CONCRETE_TEXTURES[0];

    const totalLinearMeters = (stepCount * stepLength) / 100;
    const estimatedWeightKg = Math.round(totalLinearMeters * model.weightPerMeter);
    const estimatedCost = Math.round(
      totalLinearMeters * model.basePricePerMeter * texture.priceMultiplier
    );

    // Recommended adhesive: ~1 bag per 3-4 linear meters
    const adhesiveBags = Math.ceil(totalLinearMeters / 3.5);

    return {
      totalLinearMeters: totalLinearMeters.toFixed(1),
      estimatedWeightKg,
      estimatedCost,
      adhesiveBags,
      model,
      texture,
    };
  }, [stepType, stepCount, stepLength, stepColor]);

  // Calculations: Pavers
  const paversCalc = useMemo(() => {
    const size = PAVER_SIZES[paverSize];
    const texture = CONCRETE_TEXTURES.find((t) => t.id === paverColor) || CONCRETE_TEXTURES[0];

    const effectiveArea = paverArea * (1 + paverReserve / 100);
    const totalTiles = Math.ceil(effectiveArea / size.areaPerTile);
    const estimatedWeightKg = Math.round(effectiveArea * size.weightPerSqm);
    const estimatedCost = Math.round(
      effectiveArea * size.basePricePerSqm * texture.priceMultiplier
    );

    return {
      effectiveArea: effectiveArea.toFixed(1),
      totalTiles,
      estimatedWeightKg,
      estimatedWeightTons: (estimatedWeightKg / 1000).toFixed(2),
      estimatedCost,
      size,
      texture,
    };
  }, [paverArea, paverSize, paverReserve, paverColor]);

  const handleSubmitInquiry = (e) => {
    e.preventDefault();

    let detailsSummary = "";
    if (activeTab === "steps") {
      detailsSummary = `საფეხურების გაანგარიშება: ${stepCount} ცალი (სიგრძე: ${stepLength} სმ, სიღრმე: ${stepDepth} სმ). ტიპი: ${stepsCalc.model.name}, ფერი: ${stepsCalc.texture.name}. საერთო გრძ.მ: ${stepsCalc.totalLinearMeters} მ, სავარაუდო ბიუჯეტი: ~${stepsCalc.estimatedCost} ₾, წონა: ~${stepsCalc.estimatedWeightKg} კგ.`;
    } else {
      detailsSummary = `ფილების გაანგარიშება: ფართობი ${paverArea} მ² (+${paverReserve}% რეზერვით: ${paversCalc.effectiveArea} მ²). ფორმატი: ${paversCalc.size.name}, ფერი: ${paversCalc.texture.name}. საჭიროა: ${paversCalc.totalTiles} ცალი ფილა. სავარაუდო ბიუჯეტი: ~${paversCalc.estimatedCost} ₾, წონა: ~${paversCalc.estimatedWeightTons} ტონა.`;
    }

    addInquiry({
      name: form.name,
      phone: form.phone,
      comment: `${detailsSummary} ${form.address ? `| ობიექტი: ${form.address}` : ""} ${form.notes ? `| შენიშვნა: ${form.notes}` : ""}`,
      source: `Online Calculator (${activeTab === "steps" ? "კიბის საფეხურები" : "ფილები"})`,
    });

    setSubmitted(true);
    setForm({ name: "", phone: "", address: "", notes: "" });
  };

  return (
    <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Header Breadcrumb & Title */}
        <div className="max-w-4xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-amber-500/20">
            <CalcIcon className="w-3.5 h-3.5" />
            <span>ონლაინ ხარჯთაღრიცხვის ხელსაწყო</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
            ბეტონის საფეხურებისა და ფილების კალკულატორი
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-3 leading-relaxed">
            მიუთითეთ თქვენი კიბის ზომები ან ეზოს ფართობი, მიიღეთ ზუსტი რაოდენობრივი გაანგარიშება, სავარაუდო წონა და ბიუჯეტი რეალურ დროში.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 mb-8 sm:mb-10 gap-3">
          <button
            onClick={() => {
              setActiveTab("steps");
              setSubmitted(false);
            }}
            className={`pb-4 px-2 sm:px-4 text-sm sm:text-base font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "steps"
                ? "border-amber-500 text-stone-950 dark:text-white"
                : "border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>1. საფეხურების კალკულატორი</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("pavers");
              setSubmitted(false);
            }}
            className={`pb-4 px-2 sm:px-4 text-sm sm:text-base font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "pavers"
                ? "border-amber-500 text-stone-950 dark:text-white"
                : "border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            <CalcIcon className="w-4 h-4 text-amber-500" />
            <span>2. მოსაპირკეთებელი ფილების კალკულატორი</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: PARAMETERS INPUTS (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {activeTab === "steps" ? (
              // --- STEPS TAB ---
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2.5">
                    საფეხურის კონსტრუქციული მოდელი:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(STEP_MODELS).map(([key, item]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setStepType(key)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          stepType === key
                            ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-stone-900 dark:text-white"
                            : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400"
                        }`}
                      >
                        <span className="text-xs font-bold block">{item.name}</span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-1 line-clamp-2">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step Count Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      საფეხურების რაოდენობა:
                    </label>
                    <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                      {stepCount} ცალი
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={stepCount}
                    onChange={(e) => setStepCount(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                    <span>1 საფეხური</span>
                    <span>25</span>
                    <span>50 საფეხური</span>
                  </div>
                </div>

                {/* Step Length Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-2">
                    საფეხურის სიგრძე:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[100, 120, 150, 180, 200, 240].map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setStepLength(len)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                          stepLength === len
                            ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 border-transparent shadow-sm"
                            : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400"
                        }`}
                      >
                        {len} სმ
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step Depth */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-2">
                    საფეხურის სიღრმე / სიგანე:
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[30, 35, 40].map((depth) => (
                      <button
                        key={depth}
                        type="button"
                        onClick={() => setStepDepth(depth)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                          stepDepth === depth
                            ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 border-transparent shadow-sm"
                            : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400"
                        }`}
                      >
                        {depth} სმ
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-2.5">
                    არქიტექტურული ფერი / პიგმენტაცია:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {CONCRETE_TEXTURES.map((tex) => (
                      <button
                        key={tex.id}
                        type="button"
                        onClick={() => setStepColor(tex.id)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold transition text-left ${
                          stepColor === tex.id
                            ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-stone-900 dark:text-white"
                            : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-stone-400 shrink-0"
                          style={{ backgroundColor: tex.hex }}
                        />
                        <span className="truncate">{tex.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // --- PAVERS TAB ---
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-6">
                {/* Area Input & Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      დასაფარი ეზოს / ტერასის ფართობი:
                    </label>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="number"
                        min="5"
                        max="1000"
                        value={paverArea}
                        onChange={(e) => setPaverArea(Math.max(1, Number(e.target.value)))}
                        className="w-20 text-right font-extrabold text-amber-600 dark:text-amber-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 font-mono text-base"
                      />
                      <span className="text-sm font-bold text-stone-500">მ²</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="5"
                    value={paverArea}
                    onChange={(e) => setPaverArea(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                    <span>10 მ²</span>
                    <span>150 მ²</span>
                    <span>300+ მ²</span>
                  </div>
                </div>

                {/* Paver Size Format */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-2.5">
                    ფილის ფორმატი და ზომა:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(PAVER_SIZES).map(([key, item]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPaverSize(key)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          paverSize === key
                            ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-stone-900 dark:text-white"
                            : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400"
                        }`}
                      >
                        <span className="text-xs font-extrabold block">{item.name}</span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-1">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reserve */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <span>სარეზერვო ჭრების მარაგი:</span>
                      <HelpCircle className="w-3.5 h-3.5 text-stone-400" title="გათვალისწინებულია კუთხეებისა და პერიმეტრის ჩაჭრისთვის" />
                    </label>
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200 font-mono">
                      +{paverReserve}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[5, 8, 10].map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => setPaverReserve(res)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                          paverReserve === res
                            ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 border-transparent shadow-sm"
                            : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400"
                        }`}
                      >
                        +{res}% {res === 5 ? "(სტანდარტული)" : res === 10 ? "(რთული ეზო)" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-2.5">
                    არქიტექტურული ფერი / პიგმენტაცია:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {CONCRETE_TEXTURES.map((tex) => (
                      <button
                        key={tex.id}
                        type="button"
                        onClick={() => setPaverColor(tex.id)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold transition text-left ${
                          paverColor === tex.id
                            ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-stone-900 dark:text-white"
                            : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-stone-400 shrink-0"
                          style={{ backgroundColor: tex.hex }}
                        />
                        <span className="truncate">{tex.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: CALCULATION RESULTS & INQUIRY FORM (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Calculation Summary Card */}
            <div className="bg-gradient-to-br from-[#f8f6f0] to-[#f0ebdf] dark:from-[#1b1a18] dark:to-[#141412] p-6 sm:p-8 rounded-3xl border border-stone-300/80 dark:border-stone-800 shadow-xl">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 dark:text-stone-400 block">
                წინასწარი გაანგარიშების შედეგი
              </span>
              
              {/* Estimated Cost */}
              <div className="mt-2 pb-5 border-b border-stone-300/60 dark:border-stone-800">
                <span className="text-xs text-stone-500 dark:text-stone-400">სავარაუდო ღირებულება:</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-stone-950 dark:text-white tracking-tight">
                    ~{activeTab === "steps" ? stepsCalc.estimatedCost : paversCalc.estimatedCost} ₾
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">დღგ-ს ჩათვლით</span>
                </div>
              </div>

              {/* Breakdown metrics */}
              <div className="py-4 space-y-3 text-xs sm:text-sm border-b border-stone-300/60 dark:border-stone-800">
                {activeTab === "steps" ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">საფეხურების რაოდენობა:</span>
                      <strong className="text-stone-900 dark:text-white">{stepCount} ცალი</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">საერთო გრძივი მეტრი:</span>
                      <strong className="text-stone-900 dark:text-white">{stepsCalc.totalLinearMeters} გრძ.მ</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">სავარაუდო ჯამური წონა:</span>
                      <strong className="text-stone-900 dark:text-white">~{stepsCalc.estimatedWeightKg} კგ</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">არჩეული ფერი:</span>
                      <strong className="text-stone-900 dark:text-white">{stepsCalc.texture.name}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">რეკომენდებული წებო (C2TE):</span>
                      <strong className="text-stone-900 dark:text-white">~{stepsCalc.adhesiveBags} ტომარა</strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">სუფთა ფართობი:</span>
                      <strong className="text-stone-900 dark:text-white">{paverArea} მ²</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">ფართობი რეზერვით:</span>
                      <strong className="text-stone-900 dark:text-white">{paversCalc.effectiveArea} მ²</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">საჭირო ფილების რაოდენობა:</span>
                      <strong className="text-stone-900 dark:text-white">{paversCalc.totalTiles} ცალი</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">სავარაუდო წონა:</span>
                      <strong className="text-stone-900 dark:text-white">~{paversCalc.estimatedWeightTons} ტონა</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">არჩეული ფერი:</span>
                      <strong className="text-stone-900 dark:text-white">{paversCalc.texture.name}</strong>
                    </div>
                  </>
                )}
              </div>

              {/* 1-Click Request Submission */}
              <div className="pt-5">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-2">
                  გსურთ ოფიციალური ხარჯთაღრიცხვის მიღება?
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-4 leading-relaxed">
                  შეიყვანეთ თქვენი ნომერი და ჩვენი ინჟინერი გადმოგცემთ ზუსტ შეთავაზებას ტრანსპორტირებისა და მონტაჟის ჩათვლით.
                </p>

                {submitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold">ხარჯთაღრიცხვის მოთხოვნა მიღებულია!</p>
                      <p className="text-[11px] mt-0.5">ჩვენი მენეჯერი უმოკლეს დროში დაგიკავშირდებათ.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="თქვენი სახელი *"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />

                    <input
                      type="tel"
                      required
                      placeholder="ტელეფონის ნომერი (მაგ: 599 XX XX XX) *"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />

                    <input
                      type="text"
                      placeholder="ობიექტის მისამართი / ქალაქი (სურვილისამებრ)"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>ხარჯთაღრიცხვის მოთხოვნის გაგზავნა</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Quality Note */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 dark:text-white block font-bold">100% გარანტირებული M500 ხარისხი</strong>
                ყველა ნაკეთობა მზადდება F300 ყინვაგამძლეობის სერტიფიცირებული ბეტონისგან Bayferrox მინერალური პიგმენტებით.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
