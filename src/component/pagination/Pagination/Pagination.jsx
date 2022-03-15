import React, { useCallback } from "react";
import { navigate } from "gatsby";
import PageNumber from "../PageNumber/PaginationNumber";
import "./pagination.scss";
import arrowLeft from "../../../images/arrow-left.svg";
import arrowRight from "../../../images/arrow-right.svg";

const Pagination = ({ totalPage, currentPage, category, queryParams }) => {

    const onMoveButtonClick = useCallback((numberToAdd) => (_) => {
        const newPageNum = currentPage + numberToAdd;
        console.log(newPageNum);

        if (newPageNum >= 1 && newPageNum <= totalPage) {
            navigate(`/list/${newPageNum}${category}?${queryParams.toString()}`);
        }
    }, [currentPage, totalPage]);

    const onPageButtonClick = useCallback((newPageNum) => {
        navigate(`/list/${newPageNum}${category}?${queryParams.toString()}`);
    }, [category, queryParams]);

    return (
        <div className="pagination wrapper">
            <button onClick={onMoveButtonClick(-1)} className="pagination button left">
                <img src={arrowLeft} alt="pagination left" />
            </button>
            <PageNumber centerNumber={currentPage} oddNumberForDisplayCount={3} lastNumber={totalPage} onPageButtonClick={onPageButtonClick} />
            <button onClick={onMoveButtonClick(1)} className="pagination button right">
                <img src={arrowRight} alt="pagination right" />
            </button>
        </div>
    )
};

export default Pagination;
