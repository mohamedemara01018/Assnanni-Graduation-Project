import QuickStats from "./QuickStats";
import RequestTimeOff from "./RequestTimeOff";

interface Props {
  role: string;
}

const SecondDiv = ({ role }: Props) => {
  return (
    <div className="flex flex-col gap-6">
      {role !== "studentDoctor" && (
        <>
          <QuickStats />
          <RequestTimeOff />
        </>
      )}
    </div>
  );
};

export default SecondDiv;
