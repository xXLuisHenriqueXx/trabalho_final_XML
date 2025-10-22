const Drag = ({ show }: { show: boolean }) => {
  return (
    <>
      {show && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-blue-800 border-2 border-dashed border-blue-400 opacity-50 z-10 pointer-events-none text-blue-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </>
  );
};

export default Drag;
