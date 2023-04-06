import { useState } from "react";
import { Box, Pagination } from "@mui/material";

const usePagination = (items, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const handleChangePage = (_, page) => {
    setCurrentPage(page);
  };

  const returnToFirstPage = () => {
    setCurrentPage(1);
  };

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pagination =
    items.length <= itemsPerPage ? (
      <></>
    ) : (
      <Box
        sx={{
          padding: "1rem",
          display: "flex",
          alignItems: "end",
          justifyContent: "center",
        }}
      >
        <Pagination
          color={"primary"}
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          size={"large"}
        />
      </Box>
    );

  return [paginatedItems, pagination, returnToFirstPage];
};

export default usePagination;
