"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Upload, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import {
  uploadLogo,
  getMySubscription,
  updateBusinessDetails,
} from "@/lib/tenants";
import { getErrorMessage, getAssetUrl } from "@/lib/utils";

export default function BusinessBrandingForm() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getMySubscription()
      .then((tenant) => {
        setLogoUrl(tenant?.logo_url ?? null);
        setLocation(tenant?.location ?? "");
        setPhone(tenant?.phone ?? "");
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }

    setLoading(true);
    try {
      const tenant = await uploadLogo(file);
      setLogoUrl(tenant.logo_url);
      toast.success("Logo updated successfully");
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDetails() {
    setSavingDetails(true);
    try {
      await updateBusinessDetails({ location, phone });
      toast.success("Business details updated");
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingDetails(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg space-y-6">
      <div>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Business Branding
            </h3>
            <p className="text-xs text-gray-500">
              Your logo appears on printed receipts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            {logoUrl ? (
              <img
                src={getAssetUrl(logoUrl) ?? ""}
                alt="Business logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-gray-300" />
            )}
          </div>

          <label
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5
                           rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            {loading ? "Uploading..." : "Upload logo"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
          </label>
        </div>
      </div>
      <div className="pt-5 border-t border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Business Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Kimathi Street, Nairobi"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Contact Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +254 700 000 000"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          onClick={handleSaveDetails}
          disabled={savingDetails}
          className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium
                     hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          {savingDetails ? "Saving..." : "Save Details"}
        </button>
      </div>
    </div>
  );
}
