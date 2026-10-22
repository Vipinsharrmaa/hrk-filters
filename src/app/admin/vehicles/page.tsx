"use client";

import { useState, useEffect } from "react";
import { Manufacturer, VehicleModel } from "@/types";
import { DataStore, initialManufacturers } from "@/lib/store";
import { Bike, Plus, Trash2, Check, X } from "lucide-react";

export default function AdminVehiclesPage() {
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(initialManufacturers);

  const [name, setName] = useState("");
  const [manufacturerId, setManufacturerId] = useState("mfg-hero");
  const [vehicleType, setVehicleType] = useState<"Motorcycle" | "Scooter" | "Moped" | "Commercial 3-Wheeler">("Motorcycle");
  const [displacement, setDisplacement] = useState("");

  const refreshModels = () => {
    setModels(DataStore.getVehicleModels());
  };

  useEffect(() => {
    refreshModels();
    DataStore.syncWithSupabase();

    const handleUpdate = () => refreshModels();
    window.addEventListener("hrk_store_updated", handleUpdate);
    return () => window.removeEventListener("hrk_store_updated", handleUpdate);
  }, []);

  const handleAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    DataStore.saveVehicleModel({
      name: name.trim(),
      manufacturer_id: manufacturerId,
      vehicle_type: vehicleType,
      engine_displacement: displacement.trim(),
      is_active: true,
    });

    setName("");
    setDisplacement("");
    refreshModels();
  };

  const handleToggle = (m: VehicleModel) => {
    DataStore.saveVehicleModel({
      ...m,
      is_active: !m.is_active,
    });
    refreshModels();
  };

  const handleDelete = (id: string, modelName: string) => {
    if (confirm(`Remove vehicle model "${modelName}"?`)) {
      DataStore.deleteVehicleModel(id);
      refreshModels();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          VEHICLE COMPATIBILITY DATABASE
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
          Maintain two-wheeler OEMs and models for fitment tagging.
        </p>
      </div>

      {/* Add Model Form */}
      <form
        onSubmit={handleAddModel}
        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4"
      >
        <h2 className="font-headline font-bold text-sm text-slate-900 uppercase tracking-wider">
          Register New Vehicle Model
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Manufacturer <span className="text-red-500">*</span>
            </label>
            <select
              value={manufacturerId}
              onChange={(e) => setManufacturerId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 bg-white"
            >
              {manufacturers.map((mfg) => (
                <option key={mfg.id} value={mfg.id}>
                  {mfg.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Model Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Activa 6G"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 bg-white"
            >
              <option value="Motorcycle">Motorcycle</option>
              <option value="Scooter">Scooter</option>
              <option value="Moped">Moped</option>
              <option value="Commercial 3-Wheeler">Commercial 3-Wheeler</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Engine Displacement
            </label>
            <input
              type="text"
              value={displacement}
              onChange={(e) => setDisplacement(e.target.value)}
              placeholder="e.g. 110cc"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-headline text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle Model</span>
          </button>
        </div>
      </form>

      {/* Models Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500 uppercase">
            <tr>
              <th className="py-3 px-4">Manufacturer</th>
              <th className="py-3 px-4">Vehicle Model</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Engine</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {models.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-800 font-sans">
                  {m.manufacturer_name}
                </td>
                <td className="py-3.5 px-4 font-bold text-red-600">
                  {m.name}
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  {m.vehicle_type}
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  {m.engine_displacement || "—"}
                </td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => handleToggle(m)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                      m.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        m.is_active ? "bg-emerald-600" : "bg-slate-400"
                      }`}
                    />
                    {m.is_active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => handleDelete(m.id, m.name)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
