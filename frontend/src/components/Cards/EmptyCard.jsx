const EmptyCard = (isSearch) => {
    return (
      <div className="flex flex-col items-center justify-center p-6 border-2 borderborder-gray-300 rounded-lg bg-black-900 dark:bg-gray-100">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18"></path>
        </svg>
        <p className="text-black-600 dark:text-black-300 text-lg font-semibold">{isSearch ?"No notes found" :"Not notes added"}</p>
        {/* <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Start by creating a new note!</p> */}
      </div>
    );
  };
  
  export default EmptyCard;
  