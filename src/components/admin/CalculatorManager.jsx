import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { DEFAULT_SITE_SETTINGS } from "../../data/initialSettings";
import {
  Calculator as CalcIcon,
  Layers,
  Grid,
  Ruler,
  Sliders,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Package,
  Scale,
  Sparkles,
  Info,
} from "lucide-react";

export default function CalculatorManager() {
  const { siteSettings, updateSiteSettings } = useData();

  // Local state for live editing
  const [calcData, setCalcData] = useState(() => {
    const initial = siteSettings?.calculator || DEFAULT_SITE_SETTINGS.calculator;
    return {
      badge: initial.badge || DEFAULT_SITE_SETTINGS.calculator.badge,
      title: initial.title || DEFAULT_SITE_SETTINGS.calculator.title,
      subtitle: initial.subtitle || DEFAULT_SITE_SETTINGS.calculator.subtitle,
      adhesiveRatio: Number(initial.adhesiveRatio ?? 3.5),
      defaultReserve: Number(initial.defaultReserve ?? 5),
      stepLengths: Array.isArray(initial.stepLengths) ? [...initial.stepLengths] : [100, 120, 150, 180, 200, 240],
      stepDepths: Array.isArray(initial.stepDepths) ? [...initial.stepDepths] : [30, 35, 40],
      stepModels: Array.isArray(initial.stepModels) ? JSON.parse(JSON.stringify(initial.stepModels)) : JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS.calculator.stepModels)),
      paverSizes: Array.isArray(initial.paverSizes) ? JSON.parse(JSON.stringify(initial.paverSizes)) : JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS.calculator.paverSizes)),
    };
  });

  const [activeTab, setActiveTab] = useState("steps"); // 'steps' | 'pavers' | 'sizes' | 'texts'
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(null);

  // New step model form
  const [newStepModel, setNewStepModel] = useState({
    name: "",
    basePricePerMeter: 90,
    weightPerMeter: 35,
    desc: "",
  });

  // New paver format form + auto-area helper
  const [newPaverFormat, setNewPaverFormat] = useState({
    name: "",
    widthCm: 80,
    lengthCm: 80,
    thicknessCm: 6,
    areaPerTile: 0.64,
    basePricePerSqm: 75,
    weightPerSqm: 140,
    desc: "",
  });

  // Length & depth chip add inputs
  const [newLengthInput, setNewLengthInput] = useState("");
  const [newDepthInput, setNewDepthInput] = useState("");

  // Sync state if siteSettings changes externally
  useEffect(() => {
    if (siteSettings?.calculator) {
      setCalcData((prev) => ({
        ...prev,
        ...siteSettings.calculator,
        stepModels: siteSettings.calculator.stepModels || prev.stepModels,
        paverSizes: siteSettings.calculator.paverSizes || prev.paverSizes,
        stepLengths: siteSettings.calculator.stepLengths || prev.stepLengths,
        stepDepths: siteSettings.calculator.stepDepths || prev.stepDepths,
      }));
    }
  }, [siteSettings?.calculator]);

  const handleSave = async (updatedCalc = null) => {
    setIsSaving(true);
    const toSave = updatedCalc || calcData;
    const mergedSettings = {
      ...siteSettings,
      calculator: toSave,
    };
    await updateSiteSettings(mergedSettings);
    setIsSaving(false);
    setSaveToast("კალკულატორის პარამეტრები წარმატებით შეინახა!");
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleResetToDefaults = async () => {
    if (
      !window.confirm(
        "ნამდვილად გსურთ კალკულატორის პარამეტრების, მოდელებისა და ფორმატების საწყისზე დაბრუნება?"
      )
    ) {
      return;
    }
    const defs = JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS.calculator));
    setCalcData(defs);
    await handleSave(defs);
    setSaveToast("კალკულატორი დაბრუნდა საწყის ნაგულისხმევ მონაცემებზე.");
    setTimeout(() => setSaveToast(null), 3500);
  };

  // ================= STEP MODELS HELPERS =================
  const updateStepModel = (index, field, value) => {
    const list = [...calcData.stepModels];
    list[index] = {
      ...list[index],
      [field]: field === "basePricePerMeter" || field === "weightPerMeter" ? Number(value) : value,
    };
    setCalcData({ ...calcData, stepModels: list });
  };

  const deleteStepModel = (index) => {
    if (calcData.stepModels.length <= 1) {
      alert("მინიმუმ ერთი საფეხურის მოდელი უნდა იყოს შენარჩუნებული.");
      return;
    }
    const model = calcData.stepModels[index];
    if (!window.confirm(`ნამდვილად გსურთ წაშალოთ მოდელი: "${model.name}"?`)) return;
    const list = calcData.stepModels.filter((_, i) => i !== index);
    const updated = { ...calcData, stepModels: list };
    setCalcData(updated);
    handleSave(updated);
  };

  const moveStepModel = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= calcData.stepModels.length) return;
    const list = [...calcData.stepModels];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    const updated = { ...calcData, stepModels: list };
    setCalcData(updated);
    handleSave(updated);
  };

  const handleAddStepModel = (e) => {
    e.preventDefault();
    if (!newStepModel.name.trim()) {
      alert("გთხოვთ მიუთითოთ მოდელის დასახელება.");
      return;
    }
    const newId = `model-${Date.now().toString(36)}`;
    const modelObj = {
      id: newId,
      name: newStepModel.name.trim(),
      basePricePerMeter: Number(newStepModel.basePricePerMeter) || 80,
      weightPerMeter: Number(newStepModel.weightPerMeter) || 30,
      desc: newStepModel.desc.trim() || "არქიტექტურული ბეტონის კიბის საფეხური.",
    };
    const list = [...calcData.stepModels, modelObj];
    const updated = { ...calcData, stepModels: list };
    setCalcData(updated);
    setNewStepModel({
      name: "",
      basePricePerMeter: 90,
      weightPerMeter: 35,
      desc: "",
    });
    handleSave(updated);
  };

  // ================= PAVER SIZES HELPERS =================
  const updatePaverSize = (index, field, value) => {
    const list = [...calcData.paverSizes];
    list[index] = {
      ...list[index],
      [field]:
        field === "basePricePerSqm" || field === "weightPerSqm" || field === "areaPerTile"
          ? Number(value)
          : value,
    };
    setCalcData({ ...calcData, paverSizes: list });
  };

  const deletePaverSize = (index) => {
    if (calcData.paverSizes.length <= 1) {
      alert("მინიმუმ ერთი ფილის ფორმატი უნდა იყოს შენარჩუნებული.");
      return;
    }
    const item = calcData.paverSizes[index];
    if (!window.confirm(`ნამდვილად გსურთ წაშალოთ ფორმატი: "${item.name}"?`)) return;
    const list = calcData.paverSizes.filter((_, i) => i !== index);
    const updated = { ...calcData, paverSizes: list };
    setCalcData(updated);
    handleSave(updated);
  };

  const movePaverSize = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= calcData.paverSizes.length) return;
    const list = [...calcData.paverSizes];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    const updated = { ...calcData, paverSizes: list };
    setCalcData(updated);
    handleSave(updated);
  };

  const handleAddPaverFormat = (e) => {
    e.preventDefault();
    const finalName =
      newPaverFormat.name.trim() ||
      `${newPaverFormat.widthCm} × ${newPaverFormat.lengthCm} × ${newPaverFormat.thicknessCm} სმ`;
    const computedArea =
      newPaverFormat.areaPerTile > 0
        ? Number(newPaverFormat.areaPerTile)
        : Number(((newPaverFormat.widthCm * newPaverFormat.lengthCm) / 10000).toFixed(4));

    const newId = `paver-${Date.now().toString(36)}`;
    const formatObj = {
      id: newId,
      name: finalName,
      areaPerTile: computedArea,
      basePricePerSqm: Number(newPaverFormat.basePricePerSqm) || 75,
      weightPerSqm: Number(newPaverFormat.weightPerSqm) || 140,
      desc: newPaverFormat.desc.trim() || "პრემიუმ კლასის დიდფორმატიანი არქიტექტურული ფილა.",
    };

    const list = [...calcData.paverSizes, formatObj];
    const updated = { ...calcData, paverSizes: list };
    setCalcData(updated);
    setNewPaverFormat({
      name: "",
      widthCm: 80,
      lengthCm: 80,
      thicknessCm: 6,
      areaPerTile: 0.64,
      basePricePerSqm: 75,
      weightPerSqm: 140,
      desc: "",
    });
    handleSave(updated);
  };

  // ================= STANDARD SIZES & RATIOS HELPERS =================
  const addStepLength = (e) => {
    e.preventDefault();
    const val = Number(newLengthInput);
    if (!val || val <= 0) return;
    if (calcData.stepLengths.includes(val)) {
      alert("ეს სიგრძე უკვე დამატებულია.");
      return;
    }
    const sorted = [...calcData.stepLengths, val].sort((a, b) => a - b);
    const updated = { ...calcData, stepLengths: sorted };
    setCalcData(updated);
    setNewLengthInput("");
    handleSave(updated);
  };

  const removeStepLength = (len) => {
    if (calcData.stepLengths.length <= 1) {
      alert("მინიმუმ ერთი სიგრძე უნდა იყოს მითითებული.");
      return;
    }
    const filtered = calcData.stepLengths.filter((l) => l !== len);
    const updated = { ...calcData, stepLengths: filtered };
    setCalcData(updated);
    handleSave(updated);
  };

  const addStepDepth = (e) => {
    e.preventDefault();
    const val = Number(newDepthInput);
    if (!val || val <= 0) return;
    if (calcData.stepDepths.includes(val)) {
      alert("ეს სიღრმე უკვე დამატებულია.");
      return;
    }
    const sorted = [...calcData.stepDepths, val].sort((a, b) => a - b);
    const updated = { ...calcData, stepDepths: sorted };
    setCalcData(updated);
    setNewDepthInput("");
    handleSave(updated);
  };

  const removeStepDepth = (dep) => {
    if (calcData.stepDepths.length <= 1) {
      alert("მინიმუმ ერთი სიღრმე უნდა იყოს მითითებული.");
      return;
    }
    const filtered = calcData.stepDepths.filter((d) => d !== dep);
    const updated = { ...calcData, stepDepths: filtered };
    setCalcData(updated);
    handleSave(updated);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveToast && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl flex items-center justify-between gap-3 text-emerald-300 text-sm shadow-xl animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{saveToast}</span>
          </div>
          <button
            onClick={() => setSaveToast(null)}
            className="text-xs text-emerald-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner / Actions Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <CalcIcon className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  კალკულატორის სრული მართვა & ფორმულები
                </h2>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/30">
                  Live Sync
                </span>
              </div>
              <p className="text-stone-400 text-xs sm:text-sm mt-1 leading-relaxed">
                აქედან შეგიძლიათ დაამატოთ საფეხურების ახალი კონსტრუქციული მოდელები, ფილების ზომები,
                ჩაასწოროთ საბაზისო ფასები (₾/მ ან ₾/მ²), წონები და გაანგარიშების კოეფიციენტები.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            <Link
              to="/calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white text-xs font-bold border border-stone-700/80 transition"
              title="გახსენით კალკულატორი საიტზე"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>საიტზე ნახვა</span>
            </Link>

            <button
              type="button"
              onClick={handleResetToDefaults}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-stone-200 text-xs font-semibold border border-stone-700/80 transition"
              title="საწყის ნაგულისხმევ მონაცემებზე დაბრუნება"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">საწყისზე დაბრუნება</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "ინახება..." : "ცვლილებების შენახვა"}</span>
            </button>
          </div>
        </div>

        {/* Subtabs Bar */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-stone-800/80">
          <button
            type="button"
            onClick={() => setActiveTab("steps")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === "steps"
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. საფეხურების მოდელები ({calcData.stepModels.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pavers")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === "pavers"
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>2. ფილების ზომები & ფორმატები ({calcData.paverSizes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sizes")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === "sizes"
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white"
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>3. სტანდარტული ზომები & კოეფიციენტები</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("texts")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === "texts"
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>4. სათაურები & ტექსტები</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STEP MODELS */}
      {/* ========================================================================= */}
      {activeTab === "steps" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>კიბის საფეხურების კონსტრუქციული მოდელები</span>
            </h3>
            <span className="text-xs text-stone-400">
              სულ: <strong className="text-white">{calcData.stepModels.length}</strong> მოდელი
            </span>
          </div>

          {/* Existing Step Models List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calcData.stepModels.map((model, idx) => (
              <div
                key={model.id || idx}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 hover:border-stone-700 transition"
              >
                {/* Header with order buttons and delete */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-stone-800 text-stone-400 text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-stone-500">{model.id}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveStepModel(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white disabled:opacity-30 transition"
                      title="ზემოთ აწევა"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStepModel(idx, 1)}
                      disabled={idx === calcData.stepModels.length - 1}
                      className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white disabled:opacity-30 transition"
                      title="ქვემოთ ჩამოწევა"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteStepModel(idx)}
                      className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 ml-1 transition"
                      title="მოდელის წაშლა"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    მოდელის დასახელება:
                  </label>
                  <input
                    type="text"
                    value={model.name}
                    onChange={(e) => updateStepModel(idx, "name", e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white px-3 py-2 rounded-xl text-sm font-semibold outline-none"
                    placeholder="მაგ: L-ფორმის მონოლითური საფეხური"
                  />
                </div>

                {/* Base price & Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      საბაზისო ფასი (₾ / გრძ.მ):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={model.basePricePerMeter}
                        onChange={(e) => updateStepModel(idx, "basePricePerMeter", e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-amber-400 font-mono font-bold px-3 py-2 rounded-xl text-sm outline-none"
                      />
                      <span className="absolute right-3 top-2 text-xs text-stone-500 font-bold">
                        ₾/მ
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      სავარაუდო წონა (კგ / მ):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={model.weightPerMeter}
                        onChange={(e) => updateStepModel(idx, "weightPerMeter", e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-200 font-mono font-bold px-3 py-2 rounded-xl text-sm outline-none"
                      />
                      <span className="absolute right-3 top-2 text-xs text-stone-500 font-bold">
                        კგ/მ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    მოკლე განმარტება / აღწერა:
                  </label>
                  <textarea
                    rows={2}
                    value={model.desc}
                    onChange={(e) => updateStepModel(idx, "desc", e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-300 px-3 py-2 rounded-xl text-xs outline-none leading-relaxed resize-none"
                    placeholder="მოკლე აღწერა, რომელიც გამოჩნდება კალკულატორში ბარათზე..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add New Step Model Card */}
          <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4" />
              <span>ახალი საფეხურის მოდელის დამატება</span>
            </h4>

            <form onSubmit={handleAddStepModel} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    დასახელება *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStepModel.name}
                    onChange={(e) => setNewStepModel({ ...newStepModel, name: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white px-3 py-2 rounded-xl text-sm outline-none font-semibold"
                    placeholder="მაგ: რადიუსული მრუდი საფეხური"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    საბაზისო ფასი (₾ / გრძ.მ) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      value={newStepModel.basePricePerMeter}
                      onChange={(e) =>
                        setNewStepModel({ ...newStepModel, basePricePerMeter: Number(e.target.value) })
                      }
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-amber-400 font-mono font-bold px-3 py-2 rounded-xl text-sm outline-none"
                    />
                    <span className="absolute right-3 top-2 text-xs text-stone-500 font-bold">
                      ₾/მ
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    წონა (კგ / გრძ.მ) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      value={newStepModel.weightPerMeter}
                      onChange={(e) =>
                        setNewStepModel({ ...newStepModel, weightPerMeter: Number(e.target.value) })
                      }
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-200 font-mono font-bold px-3 py-2 rounded-xl text-sm outline-none"
                    />
                    <span className="absolute right-3 top-2 text-xs text-stone-500 font-bold">
                      კგ/მ
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  მოკლე აღწერა
                </label>
                <textarea
                  rows={2}
                  value={newStepModel.desc}
                  onChange={(e) => setNewStepModel({ ...newStepModel, desc: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-300 px-3 py-2 rounded-xl text-xs outline-none leading-relaxed resize-none"
                  placeholder="საფეხურის დანიშნულება, დიზაინის თავისებურება..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>მოდელის დამატება</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PAVER SIZES */}
      {/* ========================================================================= */}
      {activeTab === "pavers" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Grid className="w-4 h-4 text-amber-500" />
              <span>ეზოსა და ტერასის მოსაპირკეთებელი ფილების ფორმატები</span>
            </h3>
            <span className="text-xs text-stone-400">
              სულ: <strong className="text-white">{calcData.paverSizes.length}</strong> ფორმატი
            </span>
          </div>

          {/* Existing Paver Formats List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calcData.paverSizes.map((format, idx) => (
              <div
                key={format.id || idx}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 hover:border-stone-700 transition"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-stone-800 text-stone-400 text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-stone-500">{format.id}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => movePaverSize(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white disabled:opacity-30 transition"
                      title="ზემოთ აწევა"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePaverSize(idx, 1)}
                      disabled={idx === calcData.paverSizes.length - 1}
                      className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white disabled:opacity-30 transition"
                      title="ქვემოთ ჩამოწევა"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePaverSize(idx)}
                      className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 ml-1 transition"
                      title="ფორმატის წაშლა"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    ფორმატის დასახელება / ზომა:
                  </label>
                  <input
                    type="text"
                    value={format.name}
                    onChange={(e) => updatePaverSize(idx, "name", e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white px-3 py-2 rounded-xl text-sm font-semibold outline-none"
                    placeholder="მაგ: 80 × 80 × 6 სმ"
                  />
                </div>

                {/* Area & Price & Weight */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 truncate">
                      ფართობი (მ²):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={format.areaPerTile}
                        onChange={(e) => updatePaverSize(idx, "areaPerTile", e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white font-mono font-bold px-2 py-2 rounded-xl text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 truncate">
                      ფასი (₾/მ²):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={format.basePricePerSqm}
                        onChange={(e) => updatePaverSize(idx, "basePricePerSqm", e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-amber-400 font-mono font-bold px-2 py-2 rounded-xl text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 truncate">
                      წონა (კგ/მ²):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={format.weightPerSqm}
                        onChange={(e) => updatePaverSize(idx, "weightPerSqm", e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-200 font-mono font-bold px-2 py-2 rounded-xl text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    მოკლე აღწერა:
                  </label>
                  <textarea
                    rows={2}
                    value={format.desc}
                    onChange={(e) => updatePaverSize(idx, "desc", e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-300 px-3 py-2 rounded-xl text-xs outline-none leading-relaxed resize-none"
                    placeholder="მაგ: ყველაზე მოთხოვნადი ფორმატი თანამედროვე ვილების ეზოებისთვის..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add New Paver Format Card */}
          <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4" />
              <span>ახალი ფილის ფორმატის & ზომის დამატება</span>
            </h4>

            <form onSubmit={handleAddPaverFormat} className="space-y-4">
              {/* Quick auto-area helper */}
              <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                    სიგანე (სმ)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={newPaverFormat.widthCm}
                    onChange={(e) => {
                      const w = Number(e.target.value);
                      const area = Number(((w * newPaverFormat.lengthCm) / 10000).toFixed(4));
                      setNewPaverFormat({
                        ...newPaverFormat,
                        widthCm: w,
                        areaPerTile: area,
                      });
                    }}
                    className="w-full bg-stone-900 border border-stone-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                    სიგრძე (სმ)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={newPaverFormat.lengthCm}
                    onChange={(e) => {
                      const l = Number(e.target.value);
                      const area = Number(((newPaverFormat.widthCm * l) / 10000).toFixed(4));
                      setNewPaverFormat({
                        ...newPaverFormat,
                        lengthCm: l,
                        areaPerTile: area,
                      });
                    }}
                    className="w-full bg-stone-900 border border-stone-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                    სისქე (სმ)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={newPaverFormat.thicknessCm}
                    onChange={(e) =>
                      setNewPaverFormat({ ...newPaverFormat, thicknessCm: Number(e.target.value) })
                    }
                    className="w-full bg-stone-900 border border-stone-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono outline-none"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <span className="text-[10px] text-stone-400 font-bold mb-1">1 ფილის ფართობი:</span>
                  <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs px-2.5 py-1.5 rounded-lg text-center">
                    {newPaverFormat.areaPerTile} მ²
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    ფორმატის სახელი (ავტომატური თუ ცარიელია)
                  </label>
                  <input
                    type="text"
                    value={newPaverFormat.name}
                    onChange={(e) => setNewPaverFormat({ ...newPaverFormat, name: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white px-3 py-2 rounded-xl text-sm outline-none font-semibold"
                    placeholder={`${newPaverFormat.widthCm} × ${newPaverFormat.lengthCm} × ${newPaverFormat.thicknessCm} სმ`}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    საბაზისო ფასი (₾ / მ²) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      value={newPaverFormat.basePricePerSqm}
                      onChange={(e) =>
                        setNewPaverFormat({
                          ...newPaverFormat,
                          basePricePerSqm: Number(e.target.value),
                        })
                      }
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-amber-400 font-mono font-bold px-3 py-2 rounded-xl text-sm outline-none"
                    />
                    <span className="absolute right-3 top-2 text-xs text-stone-500 font-bold">
                      ₾/მ²
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    1 მ²-ის წონა (კგ / მ²) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      value={newPaverFormat.weightPerSqm}
                      onChange={(e) =>
                        setNewPaverFormat({
                          ...newPaverFormat,
                          weightPerSqm: Number(e.target.value),
                        })
                      }
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-200 font-mono font-bold px-3 py-2 rounded-xl text-sm outline-none"
                    />
                    <span className="absolute right-3 top-2 text-xs text-stone-500 font-bold">
                      კგ/მ²
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  მოკლე აღწერა / დანიშნულება
                </label>
                <textarea
                  rows={2}
                  value={newPaverFormat.desc}
                  onChange={(e) => setNewPaverFormat({ ...newPaverFormat, desc: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-300 px-3 py-2 rounded-xl text-xs outline-none leading-relaxed resize-none"
                  placeholder="მაგ: იდეალურია საცალფეხო ბილიკებისა და მცირე ეზოებისთვის..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>ფორმატის დამატება</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STANDARD SIZES & RATIOS */}
      {/* ========================================================================= */}
      {activeTab === "sizes" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Step Lengths */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-amber-500" />
                  <span>საფეხურის სტანდარტული სიგრძეები (სმ)</span>
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  კალკულატორში მომხმარებლის მიერ ასარჩევი სიგრძის ღილაკები.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {calcData.stepLengths.map((len) => (
                  <span
                    key={len}
                    className="inline-flex items-center gap-1.5 bg-stone-800 border border-stone-700/80 text-white font-mono font-bold text-xs px-3 py-1.5 rounded-xl"
                  >
                    <span>{len} სმ</span>
                    <button
                      type="button"
                      onClick={() => removeStepLength(len)}
                      className="text-stone-400 hover:text-rose-400 transition"
                      title="წაშლა"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={addStepLength} className="flex gap-2 pt-2">
                <input
                  type="number"
                  min="30"
                  max="500"
                  value={newLengthInput}
                  onChange={(e) => setNewLengthInput(e.target.value)}
                  placeholder="ახალი სიგრძე (სმ)"
                  className="bg-stone-950 border border-stone-800 focus:border-amber-500 text-white px-3 py-2 rounded-xl text-xs font-mono outline-none flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-bold border border-stone-700 transition"
                >
                  + დამატება
                </button>
              </form>
            </div>

            {/* Step Depths */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-amber-500" />
                  <span>საფეხურის სტანდარტული სიღრმეები (სმ)</span>
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  საფეხურის ზედა ჰორიზონტალური სიბრტყის სიგანე / სიღრმე.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {calcData.stepDepths.map((depth) => (
                  <span
                    key={depth}
                    className="inline-flex items-center gap-1.5 bg-stone-800 border border-stone-700/80 text-white font-mono font-bold text-xs px-3 py-1.5 rounded-xl"
                  >
                    <span>{depth} სმ</span>
                    <button
                      type="button"
                      onClick={() => removeStepDepth(depth)}
                      className="text-stone-400 hover:text-rose-400 transition"
                      title="წაშლა"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={addStepDepth} className="flex gap-2 pt-2">
                <input
                  type="number"
                  min="20"
                  max="100"
                  value={newDepthInput}
                  onChange={(e) => setNewDepthInput(e.target.value)}
                  placeholder="ახალი სიღრმე (სმ)"
                  className="bg-stone-950 border border-stone-800 focus:border-amber-500 text-white px-3 py-2 rounded-xl text-xs font-mono outline-none flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-bold border border-stone-700 transition"
                >
                  + დამატება
                </button>
              </form>
            </div>
          </div>

          {/* Coefficients & Ratios */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>გაანგარიშების კოეფიციენტები & ფორმულები</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                  წებო-ცემენტის ხარჯის კოეფიციენტი (C2TE):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="0.1"
                    value={calcData.adhesiveRatio}
                    onChange={(e) =>
                      setCalcData({ ...calcData, adhesiveRatio: Number(e.target.value) })
                    }
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white font-mono font-bold px-3 py-2 rounded-xl text-sm outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs text-stone-500 font-bold">
                    გრძ.მ / 1 ტომარა
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  მაგ: 3.5 ნიშნავს, რომ ყოველ 3.5 გრძივ მეტრ საფეხურზე საჭიროა 1 ტომარა (25კგ) წებო-ცემენტი.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                  სარეზერვო ჭრების ნაგულისხმევი პროცენტი (ფილებისთვის):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="1"
                    value={calcData.defaultReserve}
                    onChange={(e) =>
                      setCalcData({ ...calcData, defaultReserve: Number(e.target.value) })
                    }
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white font-mono font-bold px-3 py-2 rounded-xl text-sm outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs text-stone-500 font-bold">%</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  კუთხეებისა და პერიმეტრის ჩაჭრის ნაგულისხმევი მარაგი (ჩვეულებრივ 5%).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HEADINGS & TEXTS */}
      {/* ========================================================================= */}
      {activeTab === "texts" && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>კალკულატორის სათაურები & ტექსტები</span>
          </h4>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
              ზედა ბეიჯის ტექსტი (Badge):
            </label>
            <input
              type="text"
              value={calcData.badge}
              onChange={(e) => setCalcData({ ...calcData, badge: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white px-3.5 py-2.5 rounded-xl text-sm outline-none"
              placeholder="ონლაინ ხარჯთაღრიცხვის ხელსაწყო"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
              მთავარი სათაური (H1):
            </label>
            <input
              type="text"
              value={calcData.title}
              onChange={(e) => setCalcData({ ...calcData, title: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white px-3.5 py-2.5 rounded-xl text-base font-bold outline-none"
              placeholder="ბეტონის საფეხურებისა და ფილების კალკულატორი"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
              ქვესათაური / მოკლე აღწერა:
            </label>
            <textarea
              rows={3}
              value={calcData.subtitle}
              onChange={(e) => setCalcData({ ...calcData, subtitle: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-200 px-3.5 py-2.5 rounded-xl text-sm outline-none leading-relaxed resize-none"
              placeholder="მიუთითეთ თქვენი კიბის ზომები ან ეზოს ფართობი, მიიღეთ ზუსტი რაოდენობრივი გაანგარიშება..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
