"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";
import { DataStore } from "@/lib/store";
import { FolderTree, Plus, Edit2, Trash2, Check, X } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const refreshCategories = () => {
    setCategories(DataStore.getCategories());
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      DataStore.saveCategory({
        id: editingId,
        name: name.trim(),
        description: description.trim(),
      });
      setEditingId(null);
    } else {
      DataStore.saveCategory({
        name: name.trim(),
        description: description.trim(),
      });
    }

    setName("");
    setDescription("");
    refreshCategories();
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  const handleToggle = (cat: Category) => {
    DataStore.saveCategory({
      ...cat,
      is_active: !cat.is_active,
    });
    refreshCategories();
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`Are you sure you want to delete category "${catName}"?`)) {
      DataStore.deleteCategory(id);
      refreshCategories();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          CATEGORY MANAGEMENT
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
          Organize product divisions (Air Filter Paper, Foam, Oil, Petrol).
        </p>
      </div>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4"
      >
        <h2 className="font-headline font-bold text-sm text-slate-900 uppercase tracking-wider">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Air Filter Paper"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Heavy-duty pleated cellulose paper elements"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-headline text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{editingId ? "Update Category" : "Add Category"}</span>
          </button>
        </div>
      </form>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500 uppercase">
            <tr>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Slug Identifier</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-bold font-sans text-slate-900">
                  {c.name}
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  {c.slug}
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-sans">
                  {c.description || "—"}
                </td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => handleToggle(c)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                      c.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        c.is_active ? "bg-emerald-600" : "bg-slate-400"
                      }`}
                    />
                    {c.is_active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-1 text-slate-600 hover:text-red-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
