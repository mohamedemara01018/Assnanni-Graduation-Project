import { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { ChevronRight, Trash2, Star, BriefcaseMedical, DollarSign, MapPin, Building2 } from "lucide-react";
import { fetchFavoriteDoctors, selectFavoriteDoctorsState } from "@/store/slices/patient-slice/favorites-slice/favoritesSlice";
import { removeDoctorFromFavorites, resetDeleteFavoriteState, selectDeleteFavoriteState } from "@/store/slices/patient-slice/remove-doctor-from-favorites-slice/removeDoctorFromFavoritesSlice";
import MiniLoading from "@/components/mini-loading/MiniLoading";
import Error from "@/components/error/Error";
import { NotFound } from "@/components/notfound/NotFound";
import UserAvatar from "@/components/user-avatar/UserAvatar";

function FavoritesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { favoriteDoctors, loading, error } = useSelector(selectFavoriteDoctorsState);
    const { deleteState } = useSelector(selectDeleteFavoriteState);

    useEffect(() => {
        dispatch(fetchFavoriteDoctors());
    }, [dispatch]);

    useEffect(() => {
        if (deleteState.success) {
            dispatch(fetchFavoriteDoctors());
            dispatch(resetDeleteFavoriteState());
        }
    }, [deleteState.success, dispatch]);

    const handleDelete = (e: React.MouseEvent, doctorId: number) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(removeDoctorFromFavorites(doctorId));
    };

    return (
        <DashboardLayout pageTitle="Favorites">
            <div>
                <h1 className="text-2xl font-semibold text-(--color-text) max-sm:text-lg">
                    Favorites
                </h1>
                <p className="text-sm text-(--color-text-light) mt-0.5 max-sm:text-xs">
                    Manage and view all your saved doctors
                </p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                {/* Count header */}
                {!loading && !error && favoriteDoctors.length > 0 && (
                    <div className="px-1 pb-1">
                        <span className="text-xs font-medium text-(--color-text-light) uppercase tracking-wide">
                            {favoriteDoctors.length} saved doctor{favoriteDoctors.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                )}

                {loading ? (
                    <MiniLoading />
                ) : error ? (
                    <Error message="Something went wrong" />
                ) : !favoriteDoctors.length ? (
                    <NotFound message="Doctors you save will appear here for quick access" />
                ) : (
                    favoriteDoctors.map((doctor) => (
                        <div
                            key={doctor.doctorId}
                            className="group flex items-center gap-4 px-4 py-4 rounded-xl bg-(--color-surface) border border-(--color-border) hover:border-(--color-primary) hover:shadow-sm transition-all duration-200 max-sm:gap-3 max-sm:px-3"
                        >
                            {/* Avatar */}
                            <div className="shrink-0 w-12 h-12 rounded-full bg-(--color-bg-blue) border border-(--color-border) overflow-hidden flex items-center justify-center max-sm:w-10 max-sm:h-10">
                                <UserAvatar src={doctor.imageUrl} alt={doctor.doctorName} />
                            </div>

                            {/* Main content — navigates on click */}
                            <Link
                                to={`/doctors-list/${doctor.doctorId}`}
                                className="flex-1 min-w-0 flex items-center gap-6 group/link max-lg:gap-4 max-md:flex-col max-md:items-start max-md:gap-2"
                            >
                                {/* Name + specialization */}
                                <div className="min-w-0 w-44 shrink-0 max-lg:w-36 max-md:w-full">
                                    <p className="text-sm font-semibold text-(--color-text) truncate group-hover/link:text-(--color-primary) transition-colors">
                                        {doctor.doctorName}
                                    </p>
                                    <p className="text-xs text-(--color-text-light) truncate mt-0.5">
                                        {doctor.specialization}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="w-px h-8 bg-(--color-border) shrink-0 max-md:hidden" />

                                {/* Attributes */}
                                <div className="flex items-center gap-5 flex-wrap max-md:gap-3">
                                    {/* Rating */}
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                                        <span className="text-xs font-medium text-(--color-text)">
                                            {doctor.rating?.toFixed(1) ?? "—"}
                                        </span>
                                    </div>

                                    {/* Experience */}
                                    <div className="flex items-center gap-1.5">
                                        <BriefcaseMedical className="w-3.5 h-3.5 text-(--color-text-blue) shrink-0" />
                                        <span className="text-xs text-(--color-text-light)">
                                            {doctor.experience != null ? `${doctor.experience} yrs` : "—"}
                                        </span>
                                    </div>

                                    {/* Consultation fee */}
                                    <div className="flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                        <span className="text-xs text-(--color-text-light)">
                                            {doctor.consultationFee != null ? `${doctor.consultationFee} EGP` : "—"}
                                        </span>
                                    </div>

                                    {/* Clinic name */}
                                    {doctor.clinicName && (
                                        <div className="flex items-center gap-1.5 max-sm:hidden">
                                            <Building2 className="w-3.5 h-3.5 text-(--color-text-light) shrink-0" />
                                            <span className="text-xs text-(--color-text-light) max-w-[120px] truncate">
                                                {doctor.clinicName}
                                            </span>
                                        </div>
                                    )}

                                    {/* Clinic location */}
                                    {doctor.clinicLocation && (
                                        <div className="flex items-center gap-1.5 max-md:hidden">
                                            <MapPin className="w-3.5 h-3.5 text-(--color-text-light) shrink-0" />
                                            <span className="text-xs text-(--color-text-light) max-w-[120px] truncate">
                                                {doctor.clinicLocation}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <ChevronRight className="w-4 h-4 shrink-0 text-(--color-border) group-hover/link:text-(--color-primary) transition-colors ml-auto max-md:hidden" />
                            </Link>

                            {/* Delete button */}
                            <button
                                onClick={(e) => handleDelete(e, doctor.doctorId)}
                                disabled={deleteState.loading}
                                title="Remove from favorites"
                                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-(--color-text-light) hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}

export default FavoritesPage;





