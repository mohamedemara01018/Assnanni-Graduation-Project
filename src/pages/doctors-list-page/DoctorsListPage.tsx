/* eslint-disable @typescript-eslint/no-unused-vars */
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import SearchInput from "@/components/search-input/SearchInput";
import { governorates, regions, selectInputData } from "@/constants/doctorsListConstant";
import SelectInput from "@/components/select-input/SelectInput";
import { FaStar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { AppDispatch, RootState } from "@/store/store";
import Error from "@/components/error/Error";
import { ScaleLoader } from "react-spinners";
import { NotFound } from "@/components/notfound/NotFound";
import Pagination from "@/components/pagination/Pagination";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { allDoctorsState, fetchAllDoctors, type Doctor } from "@/store/slices/patient-slice/all-doctors.slice/allDoctorsSlice";
import { SlidersHorizontal, User, X, Stethoscope, CalendarCheck, ChevronDown, MapPin, Sliders, ArrowUpDown } from "lucide-react";
import { toast } from "react-toastify";

// ── Quick filter tabs ──────────────────────────────────────────────────────────

const QUICK_FILTERS = [
  { label: "Top Rated", value: "HighestRating" },
  // { label: "Available Now", value: "AvailableNow" }, // Assuming this is the naming convention
  { label: "Most Experienced", value: "MostExperienced" },
  { label: "Lowest Fee", value: "LowestFee" }, // Added based on the image
];
// ── Page shell ────────────────────────────────────────────────────────────────

function DoctorsListPage() {
  const role = useSelector(
    (state: { auth: { role: string } }) => state.auth.role
  );

  return role === "patient" ? (
    <DashboardLayout pageTitle="Patient">
      <DoctorList />
    </DashboardLayout>
  ) : (
    <div className="m-6">
      <Header />
      <main className="flex-1 w-full mt-33">
        <DoctorList />
      </main>
      <Footer />
    </div>
  );
}

export default DoctorsListPage;

// ── Doctor list ───────────────────────────────────────────────────────────────

function DoctorList() {
  const [governorate, setGovernorate] = useState("");
  const [region, setRegion] = useState("");
  const [search, setSearch] = useState("");
  const [activeQuick, setActiveQuick] = useState("");
  const [filters, setFilters] = useState({
    experience: "", rating: "", availability: "", gender: "", sort: "",
  });
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const dispatch: AppDispatch = useDispatch();
  const { data, loading, error } = useSelector(allDoctorsState);

  // Separate sorting from other filters
  const detailsFilters = selectInputData.filter((item) => item.id !== "sort");
  const sortFilter = selectInputData.find((item) => item.id === "sort");

  useEffect(() => {
    dispatch(fetchAllDoctors({
      Search: search,
      SpecializationId: 1,
      Experience: filters.experience,
      RatingFilter: filters.rating,
      Availability: filters.availability,
      Gender: filters.gender,
      SortBy: filters.sort,
      Page: pageNumber,
      PageSize: pageSize,
    }));
  }, [dispatch, search, filters.availability, filters.experience, filters.gender, filters.rating, filters.sort, pageNumber, pageSize]);

  const clearFilters = () => {
    setGovernorate("");
    setRegion("");
    setActiveQuick("");
    setFilters({ experience: "", rating: "", availability: "", gender: "", sort: "" });
  };

  const hasActiveFilters =
    governorate || region || filters.experience || filters.rating ||
    filters.availability || filters.gender || filters.sort;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Search ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4">
        <SearchInput
          style="w-full max-w-2xl bg-(--color-surface)"
          placeholder="Search by doctor name, specialization, or location"
          padding="p-3.5"
          setSearch={setSearch}
        />

        {/* Quick filter pills */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                const newActiveQuick = activeQuick === f.value ? "" : f.value;

                setActiveQuick(newActiveQuick);

                dispatch(
                  fetchAllDoctors({
                    Search: search,
                    SpecializationId: 1,
                    Experience: filters.experience,
                    RatingFilter: filters.rating,
                    Availability: filters.availability,
                    Gender: filters.gender,
                    SortBy: newActiveQuick || filters.sort,
                    Page: pageNumber,
                    PageSize: pageSize,
                  })
                );
              }}
              className={`px-4 py-1.5 rounded-full text-sm border transition-all duration-150 cursor-pointer font-medium ${activeQuick === f.value
                ? "bg-(--color-primary) text-white border-(--color-primary) shadow-sm"
                : "border-(--color-border) bg-(--color-surface) text-(--color-text-light) hover:border-(--color-primary) hover:text-(--color-primary) hover:bg-(--color-bg-blue)"
                }`}
            >
              {f.label}
            </button>
          ))}

          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm border border-(--color-border) bg-(--color-surface) text-(--color-text-light) hover:border-(--color-primary) hover:text-(--color-primary) hover:bg-(--color-bg-blue) transition-all duration-150 cursor-pointer sm:hidden"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-primary) ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex gap-5 w-full relative">

        {/* ── Sidebar (desktop) ──────────────────────────────────────────────── */}
        <aside
          className={`self-start sticky top-4 shrink-0 max-sm:hidden rounded-2xl border bg-(--color-surface) transition-all duration-300 ${
            desktopSidebarOpen
              ? "w-[260px] border-(--color-border) opacity-100"
              : "w-0 border-transparent overflow-hidden opacity-0 pointer-events-none"
          }`}
          style={{ boxShadow: desktopSidebarOpen ? "var(--shadow)" : "none" }}
        >
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-(--color-border)">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-(--color-text-light)" />
              <h2 className="text-sm font-semibold text-(--color-text)">Filters</h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-(--color-primary) hover:text-(--color-primary-light) font-medium transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="p-4 space-y-6">
            {/* Section 1: Location */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-(--color-primary) flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location Settings</span>
              </h3>
              <div className="space-y-3.5 pl-0.5">
                <FilterSelect
                  id="governorate"
                  label="Governorate"
                  value={governorate}
                  onChange={(v) => {
                    setGovernorate(v);
                    setRegion("");
                  }}
                  options={governorates}
                />

                <FilterSelect
                  id="region"
                  label="Region"
                  value={region}
                  onChange={setRegion}
                  disabled={!governorate}
                  options={governorate && regions[governorate] ? regions[governorate] : []}
                />
              </div>
            </div>

            <div className="h-px bg-(--color-border)" />

            {/* Section 2: Doctor Preferences */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-(--color-primary) flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5" />
                <span>Doctor Criteria</span>
              </h3>
              <div className="space-y-3.5 pl-0.5">
                {detailsFilters.map((item) => (
                  <SelectInput
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    options={item.options}
                    setFilter={setFilters}
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-(--color-border)" />

            {/* Section 3: Sort Options */}
            {sortFilter && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-(--color-primary) flex items-center gap-1.5 uppercase tracking-wider">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sorting Options</span>
                </h3>
                <div className="pl-0.5">
                  <SelectInput
                    key={sortFilter.id}
                    id={sortFilter.id}
                    label={sortFilter.label}
                    options={sortFilter.options}
                    setFilter={setFilters}
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ── Mobile sidebar overlay ─────────────────────────────────────────── */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute right-0 top-0 h-full w-80 bg-(--color-surface) overflow-y-auto shadow-2xl flex flex-col border-l border-(--color-border)">
              <div className="flex items-center justify-between px-4 py-4 border-b border-(--color-border)">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-(--color-text-light)" />
                  <h2 className="text-sm font-bold text-(--color-text)">Filters</h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="cursor-pointer text-(--color-text-light) p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-4 space-y-6">
                {/* Section 1: Location */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-(--color-primary) flex items-center gap-1.5 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Location Settings</span>
                  </h3>
                  <div className="space-y-3.5 pl-0.5">
                    <FilterSelect
                      id="governorate"
                      label="Governorate"
                      value={governorate}
                      onChange={(v) => {
                        setGovernorate(v);
                        setRegion("");
                      }}
                      options={governorates}
                    />
                    <FilterSelect
                      id="region"
                      label="Region"
                      value={region}
                      onChange={setRegion}
                      disabled={!governorate}
                      options={governorate && regions[governorate] ? regions[governorate] : []}
                    />
                  </div>
                </div>

                <div className="h-px bg-(--color-border)" />

                {/* Section 2: Doctor Preferences */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-(--color-primary) flex items-center gap-1.5 uppercase tracking-wider">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Doctor Criteria</span>
                  </h3>
                  <div className="space-y-3.5 pl-0.5">
                    {detailsFilters.map((item) => (
                      <SelectInput
                        key={item.id}
                        id={item.id}
                        label={item.label}
                        options={item.options}
                        setFilter={setFilters}
                      />
                    ))}
                  </div>
                </div>

                <div className="h-px bg-(--color-border)" />

                {/* Section 3: Sort Options */}
                {sortFilter && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-(--color-primary) flex items-center gap-1.5 uppercase tracking-wider">
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span>Sorting Options</span>
                    </h3>
                    <div className="pl-0.5">
                      <SelectInput
                        key={sortFilter.id}
                        id={sortFilter.id}
                        label={sortFilter.label}
                        options={sortFilter.options}
                        setFilter={setFilters}
                      />
                    </div>
                  </div>
                )}
              </div>
              {hasActiveFilters && (
                <div className="p-4 border-t border-(--color-border) bg-gray-50/50 dark:bg-gray-900/10">
                  <button
                    onClick={() => {
                      clearFilters();
                      setSidebarOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl border border-(--color-border) text-sm font-semibold text-(--color-text-light) hover:bg-(--color-bg-link-hover) transition-colors cursor-pointer bg-(--color-surface)"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </aside>
          </div>
        )}

        {/* ── Doctor grid ────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Result count & filters toggle button */}
          <div className="flex items-center justify-between border-b border-(--color-border) pb-3 mb-2">
            <p className="text-sm text-(--color-text-light)">
              <span className="font-semibold text-(--color-text) text-base">{data.totalCount}</span>
              {" "}doctor{data.totalCount !== 1 ? "s" : ""} found
            </p>

            <button
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs font-bold text-(--color-text) hover:border-(--color-primary) hover:text-(--color-primary) hover:bg-(--color-bg-blue) transition-all duration-150 cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {desktopSidebarOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <ScaleLoader color="var(--color-primary)" />
            </div>
          ) : error ? (
            <Error message={error} />
          ) : data.totalCount === 0 ? (
            <NotFound subMessage="No doctors found matching your criteria" />
          ) : (
            <div
              className={`grid grid-cols-1 gap-4 transition-all duration-300 ${
                desktopSidebarOpen
                  ? "md:grid-cols-2 xl:grid-cols-3"
                  : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {data.items.map((doctor: Doctor) => (
                <DoctorCard key={doctor.doctorId} doctor={doctor} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!error && !loading && data.items.length > 0 && (
            <Pagination
              pageNumber={pageNumber}
              pageSize={pageSize}
              totalItems={data.totalCount}
              onPageChange={(page) => setPageNumber(page)}
              onPageSizeChange={(size) => { setPageSize(size); setPageNumber(1); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}


export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const isOnline = doctor.status?.toLowerCase() === "available";
  const role = useSelector((state: RootState) => state.auth?.role);
  const navigate = useNavigate();

  const handleBookingClick = (id: number) => {
    if (role === "guest") {
      const redirectPath = `/appointments/booking/${id}`;
      sessionStorage.setItem("redirectAfterAuth", redirectPath);
      toast.info("Please sign in to continue booking your appointment.");
      navigate("/login");
      return;
    }
    navigate(`/appointments/booking/${id}`);
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-(--color-border) bg-(--color-surface) overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 shadow-sm">

      {/* Main Container */}
      <div className="p-4 flex items-start gap-4">

        {/* Avatar Section */}
        <div className="relative shrink-0">
          {doctor.imageUrl ? (
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-(--color-border)"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-(--color-bg-blue) border border-primary/20 flex items-center justify-center">
              <User className="w-7 h-7 text-(--color-primary)" />
            </div>
          )}
          {/* Status Dot indicator */}
          <span
            className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-(--color-surface) ${isOnline ? "bg-emerald-500" : "bg-red-400"
              }`}
          />
        </div>

        {/* Info Layout Column */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-sm font-semibold text-(--color-text) truncate">
              {doctor.name?.trim().length > 0 ? `Dr. ${doctor.name}` : "Unknown Doctor"}
            </h2>
            {/* Dynamic Price Flag */}
            <span className="text-xs font-bold text-(--color-primary) bg-(--color-bg-blue) px-2 py-0.5 rounded-md border border-primary/10 shrink-0">
              ${doctor.price}
            </span>
          </div>

          {/* Specialization Field - Fixed mapping */}
          {doctor.specialization && (
            <p className="text-xs font-medium text-(--color-text-light) flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-(--color-primary) shrink-0" />
              <span className="truncate">{doctor.specialization}</span>
            </p>
          )}

          {/* Dynamic Badges Row */}
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            {/* Rating and Reviews Counter combined */}
            <span className="inline-flex items-center gap-1 text-xs text-(--color-text-light) bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-200/40">
              <FaStar className="text-amber-400 w-3 h-3" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">{doctor.rating ?? 0}</span>
              <span className="text-[10px] text-(--color-text-light)">({doctor.reviewsCount ?? 0})</span>
            </span>

            {/* Experience */}
            <span className="inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-(--color-text) border border-(--color-border)">
              {doctor.yearsOfExperience} yrs exp
            </span>
          </div>

          {/* Location details (Clinic Name + City metadata mapping) */}
          {(doctor.clinicName || doctor.city) && (
            <p className="text-[11px] text-(--color-text-light) flex items-center gap-1 truncate">
              <IoLocationOutline className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">
                {doctor.clinicName && `${doctor.clinicName}, `}
                {doctor.city && <span className="font-medium text-(--color-text)">{doctor.city}</span>}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Divider line */}
      <div className="h-px bg-(--color-border)" />

      {/* Action Footer Controls */}
      <div className="flex gap-2 p-3 bg-gray-50/50 dark:bg-gray-900/10">
        <Link
          to={`/doctors-list/${doctor.doctorId}`}
          className="flex-1 py-2 text-center text-xs font-semibold rounded-xl border border-(--color-border) text-(--color-text-light) hover:border-(--color-primary) hover:text-(--color-primary) hover:bg-(--color-bg-blue) transition-all duration-150"
        >
          View Profile
        </Link>
        <button
          onClick={() => handleBookingClick(doctor.doctorId)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-xl bg-(--color-primary) text-white hover:bg-(--color-primary-dark) transition-all duration-150 shadow-sm cursor-pointer"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          Book Appointment
        </button>
      </div>
    </div>
  );
}

// ── Reusable filter select ────────────────────────────────────────────────────

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-(--color-text-light) uppercase tracking-wide"
      >
        {label}
      </label>
      <div className="relative w-full flex items-center">
        <select
          id={id}
          name={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) text-sm pl-3.5 pr-10 py-2.5 outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value} className="bg-(--color-surface) text-(--color-text)">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 pointer-events-none flex items-center justify-center text-gray-400 dark:text-gray-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
