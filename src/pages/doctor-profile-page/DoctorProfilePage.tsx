/* eslint-disable @typescript-eslint/no-unused-vars */
import CardComp from "@/components/card-comp/CardComp";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Error from "@/components/error/Error";
import Loading from "@/components/loading/Loading";
import { doctorProfileState, fetchDoctorProfile, type DoctorDetailsState } from "@/store/slices/patient-slice/doctor-profile-slice/doctorProfileSlice";
import type { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { CiBookmark } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { FiAward } from "react-icons/fi";
import { IoLanguageOutline, IoLocationOutline } from "react-icons/io5";
import { LuAward } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

function DoctorProfilePage() {
  const role = useSelector(
    (state: { auth: { role: string } }) => state.auth.role
  );
  return role == "patient" ? (
    <DashboardLayout pageTitle="patient">
      <View />
    </DashboardLayout>
  ) : (
    <div className="w-11/12 h-11/12 m-auto my-10">
      <View />
    </div>
  );
}

function View() {

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(doctorProfileState);

  useEffect(() => {
    if (id) {
      dispatch(fetchDoctorProfile({ id }));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <Error message={error} />
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <CardComp>
          <div className="flex items-center gap-4 max-md:flex-col max-md:text-center">
            <img
              className="w-32 h-32 rounded-full object-cover"
              src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg"
              alt={data.name}
            />

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold">
                Dr. {data.name || "Unknown Doctor"}
              </h1>

              <p className="text-(--color-text-light)">
                {data.specialty || "No specialty available"}
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <FaStar className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-(--color-text-light)">
                    {data.rating} ({data.reviewsCount} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <LuAward className="w-5 h-5" />
                  <span className="text-(--color-text-light)">
                    {data.yearsOfExperience} years experience
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <BsCurrencyDollar className="w-5 h-5" />
                  <span className="text-(--color-text-light)">
                    ${data.consultationPrice} consultation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardComp>

        <div className="flex items-start max-lg:flex-col gap-4">
          {/* Left Side */}
          <div className="flex flex-col gap-4 grow-2 w-full">
            {/* About */}
            <CardComp>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About</h2>

                <p className="text-(--color-text-light)">
                  {data.about || "No information available."}
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <FiAward className="w-5 h-5 mt-1" />

                    <div>
                      <h3 className="font-medium">Education</h3>

                      <p className="text-sm text-(--color-text-light)">
                        {data.education ||
                          "No education information available."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <IoLanguageOutline className="w-5 h-5 mt-1" />

                    <div>
                      <h3 className="font-medium">Languages</h3>

                      <p className="text-sm text-(--color-text-light)">
                        {data.languages.length > 0
                          ? data.languages.join(", ")
                          : "No languages specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardComp>

            {/* Clinic Info */}
            <CardComp>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Clinic Information
                </h2>

                <div className="flex items-start gap-2">
                  <IoLocationOutline className="w-5 h-5 mt-1" />

                  <div>
                    <h3 className="font-medium">
                      {data.clinicName || "Clinic Name Not Available"}
                    </h3>

                    <p className="text-sm text-(--color-text-light)">
                      {data.clinicLocation ||
                        "Location Not Available"}
                    </p>
                  </div>
                </div>
              </div>
            </CardComp>

            {/* Reviews */}
            <CardComp>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Patient Reviews
                </h2>

                {data.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {data.reviews.map((review: any, index: number) => (
                      <div key={index}>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            {Array(review.rating || 5)
                              .fill("")
                              .map((_, idx) => (
                                <FaStar
                                  key={idx}
                                  className="w-5 h-5 text-yellow-500"
                                />
                              ))}
                          </div>

                          <h3>{review.patientName}</h3>

                          <p className="text-sm text-(--color-text-light)">
                            {review.comment}
                          </p>

                          <p className="text-xs text-(--color-text-light)">
                            {review.createdAt}
                          </p>
                        </div>

                        <hr className="border border-(--color-border) mt-4" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-(--color-text-light)">
                    No reviews available.
                  </p>
                )}
              </div>
            </CardComp>
          </div>

          {/* Right Side */}
          <div className="flex flex-col gap-4 grow max-lg:w-full">
            {/* Booking */}
            <CardComp>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Appointment Status
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1 rounded-full ${data.isAvailable
                        ? "bg-green-600"
                        : "bg-red-600"
                        }`}
                    />

                    <p>
                      {data.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </p>
                  </div>

                  <button
                    disabled={!data.isAvailable}
                    className="flex items-center gap-2 p-2 bg-(--color-primary) hover:bg-(--color-primary-light) disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md cursor-pointer duration-150"
                  >
                    <CiBookmark className="w-5 h-5" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            </CardComp>

            {/* Time Slots */}
            <CardComp>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Available Time Slots
                </h2>

                {data.timeSlots.length > 0 ? (
                  <div className="space-y-3">
                    {data.timeSlots.map(
                      (slot: any, index: number) => (
                        <div
                          key={index}
                          className="space-y-2"
                        >
                          <p className="text-sm text-(--color-text-light)">
                            {slot.date}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {slot.times?.map(
                              (
                                time: string,
                                timeIndex: number
                              ) => (
                                <span
                                  key={timeIndex}
                                  className="text-sm py-1 px-3 rounded-lg bg-(--color-bg-link-hover)"
                                >
                                  {time}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-(--color-text-light)">
                    No available time slots.
                  </p>
                )}
              </div>
            </CardComp>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfilePage;
