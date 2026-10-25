import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const { loginAdmin } = useData();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginAdmin(password)) {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 p-8 rounded-lg w-full max-w-md">
        <div className="w-12 h-12 bg-amber-600/20 text-amber-500 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">ადმინ პანელში შესვლა</h1>
        <p className="text-xs text-stone-400 mt-1">შეიყვანეთ ადმინისტრატორის პაროლი (საწყისი: admin123)</p>

        <input
          type="password"
          placeholder="პაროლი"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          className="w-full mt-6 bg-stone-950 border border-stone-800 rounded px-4 py-2.5 text-white text-sm"
        />
        {error && <p className="text-red-400 text-xs mt-2">არასწორი პაროლი!</p>}

        <button
          type="submit"
          className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2.5 rounded text-sm"
        >
          შესვლა
        </button>
      </form>
    </div>
  );
}