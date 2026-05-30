/* eslint-disable @typescript-eslint/no-unused-vars */
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import SearchInput from "@/components/search-input/SearchInput";
import { governorates, regions, selectInputData } from "@/constants/doctorsListConstant";
import SelectInput from "@/components/select-input/SelectInput";
import { CiBookmark } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from "react-router";
import LazyImage from "@/components/ui/LazyImage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { AppDispatch } from "@/store/store";
import Error from "@/components/error/Error";
import { ScaleLoader } from "react-spinners";
import { NotFound } from "@/components/notfound/NotFound";
import Pagination from "@/components/pagination/Pagination";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { allDoctorsState, fetchAllDoctors } from "@/store/slices/patient-slice/all-doctors.slice/allDoctorsSlice";
function DoctorsListPage() {
  const role = useSelector(
    (state: { auth: { role: string } }) => state.auth.role
  );

  return role == "patient" ? (
    <DashboardLayout pageTitle="Patient ">
      <DoctorList />
    </DashboardLayout>
  ) : (
    <div className="m-6">
      <Header />
      <DoctorList />
      <Footer />
    </div>
  );
}

export default DoctorsListPage;

function DoctorList() {

  const [governorate, setGovernorate] = useState('');
  const [region, setRegion] = useState('');
  const [filters, setFilters] = useState({ experience: '', rating: '', availability: '', gender: '', sort: '' })
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const dispatch: AppDispatch = useDispatch();
  const { data, loading, error } = useSelector(allDoctorsState);

  useEffect(() => {
    dispatch(fetchAllDoctors({ SpecializationId: 1, Experience: filters.experience, RatingFilter: filters.rating, Availability: filters.availability, Gender: filters.gender, SortBy: filters.sort, Page: pageNumber, PageSize: pageSize }))
  }, [dispatch, filters.availability, filters.experience, filters.gender, filters.rating, filters.sort, pageNumber, pageSize])
  console.log(data)
  const clearFilters = () => {
    setGovernorate('');
    setRegion('');
    setFilters({ experience: '', rating: '', availability: '', gender: '', sort: '' })
  }

  return (
    <div className="flex flex-col items-center gap-9">
      <SearchInput
        style="w-[80%] max-sm:w-full bg-(--color-surface)"
        placeholder="Search by doctor name, specialization, or location"
        padding="p-4"
      />
      <div className="flex items-center justify-center flex-wrap gap-4">
        <button className="px-6 py-2 border border-(--color-border) bg-(--color-surface) hover:bg-(--color-bg-blue) hover:border-(--color-primary) rounded-full shadow-sm cursor-pointer">
          Top Rated
        </button>
        <button className="px-6 py-2 border border-(--color-border) bg-(--color-surface) hover:bg-(--color-bg-blue) hover:border-(--color-primary) rounded-full shadow-sm cursor-pointer">
          Available Now
        </button>
        <button className="px-6 py-2 border border-(--color-border) bg-(--color-surface) hover:bg-(--color-bg-blue) hover:border-(--color-primary) rounded-full shadow-sm cursor-pointer">
          Most Experienced
        </button>
      </div>
      <div className="relative flex w-full space-x-6">
        <div className="sticky self-start top-1 p-4 bg-(--color-surface) border border-(--color-border) rounded-lg shadow-sm w-[300px] max-sm:hidden">
          <div className="space-y-6">
            <h1 className="text-2xl">Filters</h1>
            <div className="space-y-4">

              <div className='flex flex-col gap-2 items-start '>
                <label htmlFor={'governorate'}>{'Governorate'}</label>
                <select name={'governorate'} id={'governorate'} onChange={(e) => setGovernorate(e.target.value)} className='w-full p-2 border-2 border-(--color-border) rounded-lg'>
                  {
                    governorates && governorates.map((governorate, idx) => {
                      return (
                        <option key={idx} value={governorate.value}>{governorate.label}</option>
                      )
                    })
                  }
                </select>
              </div>

              <div className='flex flex-col gap-2 items-start '>
                <label htmlFor={'region'}>{'Region'}</label>
                <select disabled={governorate == ''} name={'region'} id={'region'} onChange={(e) => setRegion(e.target.value)} className='w-full p-2 border-2 border-(--color-border) rounded-lg'>
                  {
                    governorate && regions && regions[governorate].map((region, idx) => {
                      return (
                        <option key={idx} value={region.value}>{region.label}</option>
                      )
                    })
                  }
                </select>
              </div>

              {selectInputData &&
                selectInputData.map((item) => {
                  return (
                    <>
                      <SelectInput
                        id={item.id}
                        label={item.label}
                        options={item.options}
                        setFilter={setFilters}
                      />
                    </>
                  );
                })}
            </div>

            <button onClick={clearFilters} className="border border-(--color-border) w-full p-2 rounded-lg hover:bg-(--color-bg) duration-150 cursor-pointer">
              Clear All Filter
            </button>
          </div>
        </div>
        <div>


          <div className="flex flex-col items-start w-full gap-4">
            <h1 className="text-2xl">{data.totalCount} Doctors Founded</h1>
            <div className={`grid md:grid-cols-1 xl:${data.totalCount == 0 ? 'grid-cols-1' : 'grid-cols-3 '} gap-4 w-full justify-items-center `}>
              {data.totalCount == 0 ? <NotFound subMessage={'There are no Doctors Found'} /> : loading ? (
                <div className="w-full  flex items-center justify-center">
                  <ScaleLoader color="#6d61ff" />{" "}
                </div>
              ) : error ? (
                <Error message={error} />
              ) : data.items.map((doctor) => {
                return (
                  <div className="bg-(--color-surface) p-4 border border-(--color-border) shadow-sm rounded-lg flex items-center justify-center grow">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <LazyImage
                          src={doctor.imageUrl ? doctor.imageUrl : `https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg`}
                          alt="docotr-img"
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="space-y-2">
                          <h2 className="text-lg">{doctor.name.trim().length > 0 ? `Dr.${doctor.name}` : 'unkown'}</h2>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <FaStar className="text-amber-400" />
                              <span className="text-(--color-text-light) text-sm">
                                {doctor.rating}
                              </span>
                            </div>
                            <span className="bg-(--color-bg-blue) px-2 text-sm rounded-sm border border-(--color-primary) text-(--color-primary)">
                              {doctor.yearsOfExperience} years
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        {doctor.city && <div className="flex items-center gap-1">
                          <IoLocationOutline />
                          <span className="text-sm text-(--color-text-light)">
                            {doctor.city}
                          </span>
                        </div>}
                        {doctor.status && <div className="flex gap-1 items-center ml-1">
                          <span className="p-1 w-1 rounded-full bg-red-500 block"></span>
                          <span className="text-sm text-(--color-text-light)">
                            {doctor.status}
                          </span>
                        </div>}
                      </div>
                      <div className="flex flex-col items-center  gap-2">
                        <Link
                          to={`/doctors-list/${doctor.doctorId}`}
                          className="w-full p-2 text-center border border-(--color-primary) rounded-lg text-(--color-primary) cursor-pointer hover:bg-(--color-bg-blue) duration-150"
                        >
                          View Profile
                        </Link>
                        <Link
                          to={`/appointments/booking/${doctor.doctorId}`}
                          className=" flex items-center justify-center gap-1 w-full p-2 border border-(--color-primary) rounded-lg bg-(--color-primary) text-white cursor-pointer hover:bg-(--color-primary-dark) duration-150 "
                        >
                          <CiBookmark className="text-xl text-white" />
                          <span>Book</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {!error && !loading && data.items.length > 0 && < Pagination
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalItems={data.totalCount}
            onPageChange={(page) => setPageNumber(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageNumber(1);
            }} />}
        </div>

      </div>
    </div>
  );
}
