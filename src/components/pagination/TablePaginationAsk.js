import React  from "react";
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';


const TablePaginationAsk = ({
    pagesCountAsk,
    currentPage,
    handlePageClickAsk,
    handlePreviousClickAsk, 
    handleNextClickAsk,
    
    
  }) => { 
    return (
     
      <div>
        <Pagination size="sm">
          <PaginationItem disabled={currentPage <= 0}>
            <PaginationLink onClick={handlePreviousClickAsk} previous href="#" />
          </PaginationItem>
  
          {[...Array(pagesCountAsk)].map((page, i) => (
          <PaginationItem active={i === currentPage} key={i}>
            <PaginationLink onClick={(e) => handlePageClickAsk(e, i)} href="#">
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
  
          <PaginationItem disabled={currentPage >= pagesCountAsk - 1}>
            <PaginationLink onClick={handleNextClickAsk} next href="#" />
          </PaginationItem>
        </Pagination>
      </div>
    );
  };
  
TablePaginationAsk.propTypes = {
    pagesCountAsk: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    handlePageClickAsk: PropTypes.func.isRequired,
    handlePreviousClickAsk: PropTypes.func.isRequired,
    handleNextClickAsk: PropTypes.func.isRequired
   };
   export default TablePaginationAsk;