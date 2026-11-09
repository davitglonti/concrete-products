import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import SEO from "../components/common/SEO";
import { CONCRETE_TEXTURES } from "../data/textureData";
import { DEFAULT_SITE_SETTINGS } from "../data/initialSettings";
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
  const { addInquiry, siteSettings } = useData();

  // Active Tab: 'steps' | 'pavers'
  const [activeTab, setActiveTab] = useState("steps");

  // Dynamic configuration from siteSettings with rock-solid defaults
  const calcConfig = siteSettings?.calculator || DEFAULT_SITE_SETTINGS.calculator;
  const stepModelsList =
    Array.isArray(calcConfig?.stepModels) && calcConfig.stepModels.length > 0
      ? calcConfig.stepModels
      : DEFAULT_SITE_SETTINGS.calculator.stepModels;
  const paverSizesList =
    Array.isArray(calcConfig?.paverSizes) && calcConfig.paverSizes.length > 0
      ? calcConfig.paverSizes
      : DEFAULT_SITE_SETTINGS.calculator.paverSizes;
  const stepLengths =
    Array.isArray(calcConfig?.stepLengths) && calcConfig.stepLengths.length > 0
      ? calcConfig.stepLengths
      : DEFAULT_SITE_SETTINGS.calculator.stepLengths;
  const stepDepths =
    Array.isArray(calcConfig?.stepDepths) && calcConfig.stepDepths.length > 0
      ? calcConfig.stepDepths
      : DEFAULT_SITE_SETTINGS.calculator.stepDepths;
  const adhesiveRatio = Number(calcConfig?.adhesiveRatio) || 3.5;
  const defaultReserve = Number(calcConfig?.defaultReserve) || 5;

  // --- STEPS CALCULATOR STATE (Initially unselected) ---
  const [stepType, setStepType] = useState(null);
  const [stepCount, setStepCount] = useState(null);
  const [stepLength, setStepLength] = useState(null); // cm
  const [stepDepth, setStepDepth] = useState(null); // cm
  const [stepColor, setStepColor] = useState(null);

  // --- PAVERS CALCULATOR STATE (Initially unselected) ---
  const [paverArea, setPaverArea] = useState(null); // m²
  const [paverSize, setPaverSize] = useState(null);
  const [paverReserve, setPaverReserve] = useState(() => defaultReserve || 5); // %
  const [paverColor, setPaverColor] = useState(null);

  // Clear selection ONLY if selected item was deleted from admin
  useEffect(() => {
    if (stepType && !stepModelsList.some((m) => m.id === stepType)) {
      setStepType(null);
    }
  }, [stepModelsList, stepType]);

  useEffect(() => {
    if (paverSize && !paverSizesList.some((s) => s.id === paverSize)) {
      setPaverSize(null);
    }
  }, [paverSizesList, paverSize]);

  useEffect(() => {
    if (stepLength && !stepLengths.includes(stepLength)) {
      setStepLength(null);
    }
  }, [stepLengths, stepLength]);

  useEffect(() => {
    if (stepDepth && !stepDepths.includes(stepDepth)) {
      setStepDepth(null);
    }
  }, [stepDepths, stepDepth]);

  // --- SUBMISSION FORM ---
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  // Active step model & texture
  const currentStepModel = useMemo(() => {
    if (!stepType) return null;
    return stepModelsList.find((m) => m.id === stepType) || null;
  }, [stepModelsList, stepType]);

  const currentStepTexture = useMemo(() => {
    if (!stepColor) return null;
    return CONCRETE_TEXTURES.find((t) => t.id === stepColor) || null;
  }, [stepColor]);

  // Active paver format & texture
  const currentPaverSize = useMemo(() => {
    if (!paverSize) return null;
    return paverSizesList.find((s) => s.id === paverSize) || null;
  }, [paverSizesList, paverSize]);

  const currentPaverTexture = useMemo(() => {
    if (!paverColor) return null;
    return CONCRETE_TEXTURES.find((t) => t.id === paverColor) || null;
  }, [paverColor]);

  // Readiness flags: calculations & prices appear ONLY when all parameters are selected
  const isStepsReady = Boolean(
    stepType &&
    currentStepModel &&
    stepCount &&
    stepCount > 0 &&
    stepLength &&
    stepDepth &&
    stepColor &&
    currentStepTexture
  );

  const isPaversReady = Boolean(
    paverSize &&
    currentPaverSize &&
    paverArea &&
    paverArea > 0 &&
    paverColor &&
    currentPaverTexture
  );

  // Calculations: Steps
  const stepsCalc = useMemo(() => {
    if (!isStepsReady) {
      return {
        totalLinearMeters: "0.0",
        totalSquareMeters: "0.00",
        estimatedWeightKg: 0,
        estimatedCost: 0,
        adhesiveBags: 0,
        model: currentStepModel,
        texture: currentStepTexture,
      };
    }

    const model = currentStepModel;
    const texture = currentStepTexture;

    const currentLen = Number(stepLength) || 120;
    const currentDepth = Number(stepDepth) || 35;
    const count = Number(stepCount) || 1;

    // Linear meters: (count * length in cm) / 100
    const totalLinearMeters = (count * currentLen) / 100;

    // Surface area in m²: count * (length in m) * (depth in m)
    const totalSquareMeters = (count * (currentLen / 100) * (currentDepth / 100)).toFixed(2);

    // Baseline depth ratio (standard architectural baseline is 35cm)
    const depthRatio = currentDepth / 35;

    // Weight scales directly with volume/depth
    const baseWeightPerMeter = Number(model?.weightPerMeter) || 35;
    const estimatedWeightKg = Math.round(totalLinearMeters * baseWeightPerMeter * depthRatio);

    // Cost scales with baseline manufacturing plus material depth factor
    const basePricePerMeter = Number(model?.basePricePerMeter) || 85;
    const depthCostFactor = 0.7 + 0.3 * depthRatio;
    const estimatedCost = Math.round(
      totalLinearMeters * basePricePerMeter * depthCostFactor * (texture?.priceMultiplier || 1)
    );

    const ratio = adhesiveRatio > 0 ? adhesiveRatio : 3.5;
    const adhesiveBags = Math.ceil(totalLinearMeters / ratio);

    return {
      totalLinearMeters: totalLinearMeters.toFixed(1),
      totalSquareMeters,
      estimatedWeightKg,
      estimatedCost,
      adhesiveBags,
      model,
      texture,
    };
  }, [isStepsReady, currentStepModel, currentStepTexture, stepCount, stepLength, stepDepth, adhesiveRatio]);

  // Calculations: Pavers
  const paversCalc = useMemo(() => {
    if (!isPaversReady) {
      return {
        effectiveArea: "0.0",
        totalTiles: 0,
        estimatedWeightKg: 0,
        estimatedWeightTons: "0.00",
        estimatedCost: 0,
        size: currentPaverSize,
        texture: currentPaverTexture,
      };
    }

    const size = currentPaverSize;
    const texture = currentPaverTexture;

    const effectiveArea = Number(paverArea) * (1 + (Number(paverReserve) || 0) / 100);

    // Calculate realistic tile area in m²
    // If areaPerTile is missing/zero, attempt dimension calculation or fallback to standard 0.05 m²
    let tileArea = Number(size?.areaPerTile);
    if (!tileArea || tileArea <= 0) {
      if (size?.width && size?.length) {
        tileArea = (Number(size.width) * Number(size.length)) / 10000;
      } else {
        tileArea = 0.05; // 0.05 m² is a realistic ~20x25cm concrete paving tile
      }
    }

    const totalTiles = tileArea > 0 ? Math.ceil(effectiveArea / tileArea) : 0;
    const estimatedWeightKg = Math.round(effectiveArea * (Number(size?.weightPerSqm) || 140));
    const estimatedCost = Math.round(
      effectiveArea * (Number(size?.basePricePerSqm) || 75) * (texture?.priceMultiplier || 1)
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
  }, [isPaversReady, currentPaverSize, currentPaverTexture, paverArea, paverReserve]);

  const handleSubmitInquiry = (e) => {
    e.preventDefault();

    if (activeTab === "steps" && !isStepsReady) {
      alert("გთხოვთ ჯერ აირჩიოთ საფეხურის ყველა პარამეტრი (მოდელი, რაოდენობა, ზომები და ფერი).");
      return;
    }
    if (activeTab === "pavers" && !isPaversReady) {
      alert("გთხოვთ ჯერ აირჩიოთ ფილის ყველა პარამეტრი (ფორმატი, ფართობი და ფერი).");
      return;
    }

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
      <SEO
        title="ბეტონის საფეხურებისა და ფილების ონლაინ კალკულატორი"
        description="დაითვალეთ კიბის საფეხურების, ეზოს ფილებისა და ბორდიურების საჭირო რაოდენობა, საერთო წონა და ხარჯთაღრიცხვა ონლაინ რეჟიმში. მიიღეთ მყისიერი შეთავაზება."
        keywords="ბეტონის კალკულატორი, საფეხურების დათვლა, ეზოს ფილების კალკულატორი, კიბის ხარჯთაღრიცხვა, ბეტონის ნაკეთობები ფასი"
      />
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Header Breadcrumb & Title */}
        <div className="max-w-4xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-amber-500/20">
            <CalcIcon className="w-3.5 h-3.5" />
            <span>{calcConfig?.badge || "ონლაინ ხარჯთაღრიცხვის ხელსაწყო"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
            {calcConfig?.title || "ბეტონის საფეხურებისა და ფილების კალკულატორი"}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-3 leading-relaxed">
            {calcConfig?.subtitle ||
              "მიუთითეთ თქვენი კიბის ზომები ან ეზოს ფართობი, მიიღეთ ზუსტი რაოდენობრივი გაანგარიშება, სავარაუდო წონა და ბიუჯეტი რეალურ დროში."}
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
                    {stepModelsList.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStepType(item.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          stepType === item.id
                            ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-stone-900 dark:text-white"
                            : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold block">{item.name}</span>
                          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold shrink-0">
                            {item.basePricePerMeter} ₾/მ
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 block line-clamp-2">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step Count Input & Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      საფეხურების რაოდენობა:
                    </label>
                    <div className="flex items-baseline gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        placeholder="მიუთითეთ"
                        value={stepCount ?? ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? null : Math.max(1, Number(e.target.value));
                          setStepCount(val);
                        }}
                        className="w-28 text-right font-extrabold text-amber-600 dark:text-amber-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 font-mono text-sm outline-none focus:border-amber-500 placeholder:text-xs placeholder:font-normal placeholder:text-stone-400"
                      />
                      <span className="text-xs font-bold text-stone-500">ცალი</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={stepCount || 1}
                    onChange={(e) => setStepCount(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1.5">
                    <span>1 საფეხური</span>
                    <div className="flex gap-1.5">
                      {[5, 10, 12, 15, 20].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setStepCount(num)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                            stepCount === num
                              ? "bg-amber-500 text-stone-950 font-extrabold"
                              : "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300 dark:hover:bg-stone-700"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <span>50 საფეხური</span>
                  </div>
                </div>

                {/* Step Length Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      საფეხურის სიგრძე:
                    </label>
                    {stepLength ? (
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                        {stepLength} სმ
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-400">აირჩიეთ სიგრძე</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {stepLengths.map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setStepLength(len)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                          stepLength === len
                            ? "bg-amber-500 text-stone-950 dark:bg-amber-400 dark:text-stone-950 border-amber-500 font-extrabold shadow-sm ring-2 ring-amber-500/20"
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      საფეხურის სიღრმე / სიგანე:
                    </label>
                    {stepDepth ? (
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                        {stepDepth} სმ
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-400">აირჩიეთ სიღრმე</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {stepDepths.map((depth) => (
                      <button
                        key={depth}
                        type="button"
                        onClick={() => setStepDepth(depth)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                          stepDepth === depth
                            ? "bg-amber-500 text-stone-950 dark:bg-amber-400 dark:text-stone-950 border-amber-500 font-extrabold shadow-sm ring-2 ring-amber-500/20"
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
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      არქიტექტურული ფერი / პიგმენტაცია:
                    </label>
                    {currentStepTexture ? (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {currentStepTexture.name}
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-400">აირჩიეთ ფერი</span>
                    )}
                  </div>
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
                    <div className="flex items-baseline gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="2000"
                        placeholder="მიუთითეთ"
                        value={paverArea ?? ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? null : Math.max(1, Number(e.target.value));
                          setPaverArea(val);
                        }}
                        className="w-28 text-right font-extrabold text-amber-600 dark:text-amber-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 font-mono text-sm outline-none focus:border-amber-500 placeholder:text-xs placeholder:font-normal placeholder:text-stone-400"
                      />
                      <span className="text-xs font-bold text-stone-500">მ²</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="5"
                    value={paverArea || 10}
                    onChange={(e) => setPaverArea(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1.5">
                    <span>10 მ²</span>
                    <div className="flex gap-1.5">
                      {[25, 50, 75, 100, 150].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPaverArea(num)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                            paverArea === num
                              ? "bg-amber-500 text-stone-950 font-extrabold"
                              : "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300 dark:hover:bg-stone-700"
                          }`}
                        >
                          {num} მ²
                        </button>
                      ))}
                    </div>
                    <span>300+ მ²</span>
                  </div>
                </div>

                {/* Paver Size Format */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-2.5">
                    ფილის ფორმატი და ზომა:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paverSizesList.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPaverSize(item.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          paverSize === item.id
                            ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-stone-900 dark:text-white"
                            : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-extrabold block">{item.name}</span>
                          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold shrink-0">
                            {item.basePricePerSqm} ₾/მ²
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 block line-clamp-2">
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
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      არქიტექტურული ფერი / პიგმენტაცია:
                    </label>
                    {currentPaverTexture ? (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {currentPaverTexture.name}
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-400">აირჩიეთ ფერი</span>
                    )}
                  </div>
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
                  {(activeTab === "steps" ? isStepsReady : isPaversReady) ? (
                    <>
                      <span className="text-3xl sm:text-4xl font-black text-stone-950 dark:text-white tracking-tight animate-fade-in">
                        ~{activeTab === "steps" ? stepsCalc.estimatedCost : paversCalc.estimatedCost} ₾
                      </span>
                      <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">დღგ-ს ჩათვლით</span>
                    </>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-stone-400 dark:text-stone-600 font-mono tracking-wider">
                        — ₾
                      </span>
                      <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        მონიშნეთ პარამეტრები
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Breakdown metrics */}
              <div className="py-4 space-y-3 text-xs sm:text-sm border-b border-stone-300/60 dark:border-stone-800">
                {activeTab === "steps" ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">საფეხურის მოდელი:</span>
                      <strong className="text-stone-900 dark:text-white">
                        {currentStepModel ? (
                          currentStepModel.name
                        ) : (
                          <span className="text-stone-400 font-normal">არ არის არჩეული</span>
                        )}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">საფეხურების რაოდენობა:</span>
                      <strong className="text-stone-900 dark:text-white">
                        {stepCount ? (
                          `${stepCount} ცალი`
                        ) : (
                          <span className="text-stone-400 font-normal">არ არის მითითებული</span>
                        )}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">ზომები (სიგრძე × სიღრმე):</span>
                      <strong className="text-stone-900 dark:text-white">
                        {stepLength && stepDepth ? (
                          `${stepLength} × ${stepDepth} სმ`
                        ) : (
                          <span className="text-stone-400 font-normal">არ არის არჩეული</span>
                        )}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">არჩეული ფერი:</span>
                      <strong className="text-stone-900 dark:text-white">
                        {currentStepTexture ? (
                          currentStepTexture.name
                        ) : (
                          <span className="text-stone-400 font-normal">არ არის არჩეული</span>
                        )}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">საერთო გრძივი მეტრი:</span>
                      <strong className="text-stone-900 dark:text-white">
                        {isStepsReady ? `${stepsCalc.totalLinearMeters} გრძ.მ` : "—"}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">სავარაუდო ჯამური წონა:</span>
                      <strong className="text-stone-900 dark:text-white">
                        {isStepsReady ? `~${stepsCalc.estimatedWeightKg} კგ` : "—"}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">რეკომენდებული წებო (C2TE):</span>
                      <strong className="text-stone-900 dark:text-white">
                        {isStepsReady ? `~${stepsCalc.adhesiveBags} ტომარა` : "—"}
                      </strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">ფილის ფორმატი:</span>
                      <strong className="text-stone-900 dark:text-white">
                        {currentPaverSize ? (
                          currentPaverSize.name
                        ) : (
                          <span className="text-stone-400 font-normal">არ არის არჩეული</span>
                        )}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">სუფთა ფართობი:</span>
                      <strong className="text-stone-900 dark:text-white">
                        {paverArea ? (
                          `${paverArea} მ²`
                        ) : (
                          <span className="text-stone-400 font-normal">არ არის მითითებული</span>
                        )}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">ფართობი რეზერვით:</span>
                      <strong className="text-stone-900 dark:text-white">
                        {isPaversReady ? `${paversCalc.effectiveArea} მ²` : "—"}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">არჩეული ფერი:</span>
                      <strong className="text-stone-900 dark:text-white">
                        {currentPaverTexture ? (
                          currentPaverTexture.name
                        ) : (
                          <span className="text-stone-400 font-normal">არ არის არჩეული</span>
                        )}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">საჭირო ფილების რაოდენობა:</span>
                      <strong className="text-stone-900 dark:text-white">
                        {isPaversReady ? `${paversCalc.totalTiles} ცალი` : "—"}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-stone-400">სავარაუდო წონა:</span>
                      <strong className="text-stone-900 dark:text-white">
                        {isPaversReady ? `~${paversCalc.estimatedWeightTons} ტონა` : "—"}
                      </strong>
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
                      disabled={activeTab === "steps" ? !isStepsReady : !isPaversReady}
                      className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {(activeTab === "steps" ? isStepsReady : isPaversReady)
                          ? "ხარჯთაღრიცხვის მოთხოვნის გაგზავნა"
                          : "გთხოვთ ჯერ აირჩიოთ პარამეტრები"}
                      </span>
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
