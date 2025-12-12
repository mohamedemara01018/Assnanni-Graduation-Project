import FeaturedDoctors from "./FeaturedDoctors";
import Filter from "./Filter";
import FiltersPreview from "./FiltersPreview";

const BrowseDoctors = () => {
  return (
    <div>
      <Filter />
      <FiltersPreview />
      <FeaturedDoctors />
    </div>
  );
};

export default BrowseDoctors;
