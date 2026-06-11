import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FiAlertCircle, FiPlus } from "react-icons/fi";
import { BeatLoader } from "react-spinners";

interface AllergyFormProps {
  patientId: string | number;
}

const AllergyForm = ({ patientId }: AllergyFormProps) => {
  const queryClient = useQueryClient();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const [selectedAllergy, setSelectedAllergy] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [notes, setNotes] = useState("");

  // Fetch available allergies for suggestions
  const {
    data: availableAllergies = [],
    isError: isFetchError,
    isLoading: isFetching,
  } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["allergies", backendUrl],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Allergies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
    enabled: !!token && !!backendUrl,
  });

  useEffect(() => {
    if (isFetchError) {
      toast.error("Failed to load allergies list");
    }
  }, [isFetchError]);

  // Mutation for adding allergy to patient
  const mutation = useMutation({
    mutationFn: async (newAllergy: {
      patientId: number;
      allergyId: number;
      notes: string;
    }) => {
      const response = await axios.post(
        `${backendUrl}Patient/add-allergy`,
        newAllergy,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.succeeded) {
        setSelectedAllergy(null);
        setNotes("");
        // Invalidate queries if there's a list of patient allergies somewhere
        queryClient.invalidateQueries({
          queryKey: ["patient-allergies", patientId],
        });
      } else {
        toast.error(data.message || "Failed to add allergy");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while adding the allergy",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAllergy) {
      toast.warning("Please select an allergy from the suggestions");
      return;
    }
    mutation.mutate({
      patientId: Number(patientId),
      allergyId: selectedAllergy.id,
      notes: notes,
    });
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-red-600">
        <FiAlertCircle className="text-xl" />
        <h3 className="font-bold text-lg">Add Patient Allergy</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isFetching ? (
          <div className="mt-6 flex flex-col items-start">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Loading Suggestions...
            </p>
            <BeatLoader color="#EF4444" size={8} />
          </div>
        ) : (
          availableAllergies.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Suggestions (Click to select)
              </p>
              <div className="flex flex-wrap gap-2">
                {availableAllergies.map((allergy) => (
                  <button
                    key={allergy.id}
                    type="button"
                    onClick={() => setSelectedAllergy(allergy)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      selectedAllergy?.id === allergy.id
                        ? "bg-red-50 border-red-400 text-red-600"
                        : "bg-white border-gray-200 hover:border-red-400 hover:text-red-600"
                    }`}
                  >
                    {allergy.name}
                  </button>
                ))}
              </div>
            </div>
          )
        )}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
            Selected Allergy
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm min-h-[48px] flex items-center">
            {selectedAllergy ? (
              <span className="text-gray-900 font-bold">
                {selectedAllergy.name}
              </span>
            ) : (
              <span className="text-gray-400 italic">
                Select from suggestions above...
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
            Notes
          </label>
          <textarea
            placeholder="Add any specific notes about this allergy..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all min-h-[100px] resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer"
        >
          {mutation.isPending ? (
            <BeatLoader color="#white" size={6} />
          ) : (
            <>
              <FiPlus /> Add Allergy
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default AllergyForm;
