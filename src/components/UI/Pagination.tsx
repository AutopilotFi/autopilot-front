import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

export default function Pagination({
  currentPage,
  setCurrentPage,
  dataPerPage,
  dataLength,
  startIndex,
  endIndex,
  isDarkMode,
}: {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  dataPerPage: number;
  dataLength: number;
  startIndex: number;
  endIndex: number;
  isDarkMode?: boolean;
}) {
  const totalPages = Math.ceil(dataLength / dataPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTableTop();
  };

  const scrollToTableTop = () => {
    const tableTopElement = document.getElementById('tableTop');
    // setTimeout(() => {
    if (tableTopElement) {
      const yOffset = -77; // offset in px
      const y = tableTopElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    // }, 100)
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToTableTop();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollToTableTop();
    }
  };

  return (
    <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-border' : 'border-gray-100'}`}>
      <div className={`text-sm mb-4 ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>
        Showing {dataLength > 0 ? `${startIndex + 1} to ${Math.min(endIndex, dataLength)}` : '0'} of{' '}
        {dataLength} entries
      </div>
      <div className="flex items-center justify-center space-x-2 overflow-x-auto">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-0 md:pr-3 md:pl-1 py-1 border rounded-lg text-sm
            disabled:opacity-50 disabled:cursor-not-allowed w-[29px] md:w-[60px] h-[26.5px]
            ${
              isDarkMode
                ? 'border-border text-foreground enabled:hover:bg-gray-700 enabled:hover:border-gray-600'
                : 'border-gray-200 text-gray-700 enabled:hover:bg-gray-50'
            }
            flex items-center space-x-1 justify-center
            `}
        >
          <ChevronLeft className="w-4 h-4 flex justify-center" />
          <span className="hidden lg:block">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            // Show first page, last page, current page, and pages around current page
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                    page === currentPage
                      ? 'bg-[#9159FF] text-white border-[#9159FF]'
                      : isDarkMode
                        ? 'border-border text-foreground enabled:hover:bg-gray-700 enabled:hover:border-gray-600'
                        : 'border-gray-200 text-gray-700 enabled:hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="px-1 text-gray-400">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-0 md:pl-3 md:pr-1 py-1 border rounded-lg text-sm
            disabled:opacity-50 disabled:cursor-not-allowed w-[29px] md:w-[60px] h-[26.5px]
                        ${
                          isDarkMode
                            ? 'border-border text-foreground enabled:hover:bg-gray-700 enabled:hover:border-gray-600'
                            : 'border-gray-200 text-gray-700 enabled:hover:bg-gray-50'
                        }
            flex items-center space-x-1 justify-center
            `}
        >
          <span className="hidden lg:block">Next</span>
          <ChevronRight className="w-4 h-4 flex justify-center" />
        </button>
      </div>
    </div>
  );
}
