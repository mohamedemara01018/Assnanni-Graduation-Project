const RequestTimeOff = () => {
  return (
    <div className="m-4 ml-0 p-4 bg-(--color-surface) rounded-2xl">
      <h1 className="text-(--color-text)">Time Off Requests</h1>
      <button className="border-black border-2 shadow-2xs w-full  rounded-2xl bg-(--color-border) py-2 mt-4 cursor-pointer hover:bg-red-900/10 text-(--color-text)">
        Request Time Off
      </button>
    </div>
  );
};

export default RequestTimeOff;
