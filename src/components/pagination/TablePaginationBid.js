import React  from "react";
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';


const TablePaginationBid = ({
    pagesCountBid,
    currentPage,
    handlePageClickBid,
    handlePreviousClickBid, 
    handleNextClickBid,
    
    
  }) => { 
    return (
     
      <div>
        <Pagination size="sm">
          <PaginationItem disabled={currentPage <= 0}>
            <PaginationLink onClick={handlePreviousClickBid} previous href="#" />
          </PaginationItem>
  
          {[...Array(pagesCountBid)].map((page, i) => (
          <PaginationItem active={i === currentPage} key={i}>
            <PaginationLink onClick={(e) => handlePageClickBid(e, i)} href="#">
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
  
          <PaginationItem disabled={currentPage >= pagesCountBid - 1}>
            <PaginationLink onClick={handleNextClickBid} next href="#" />
          </PaginationItem>
        </Pagination>
      </div>
    );
  };
  
TablePaginationBid.propTypes = {
    pagesCountBid: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    handlePageClickBid: PropTypes.func.isRequired,
    handlePreviousClickBid: PropTypes.func.isRequired,
    handleNextClickBid: PropTypes.func.isRequired
   };
   export default TablePaginationBid;