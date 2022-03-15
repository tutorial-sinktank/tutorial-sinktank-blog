import React, { useCallback } from "react";
import "./pagination-number.scss";

const PageNumber = ({ centerNumber, oddNumberForDisplayCount, lastNumber, onPageButtonClick }) => {

    // start 이상, end 미만의 숫자 array를 반환한다.
    const getNumArrayOfRange = useCallback((start, end, step = 1) => {
        return Array.from({ length: (end - start) }, (_, idx) => start + (idx * step));
    }, []);

    // 현재 페이지 넘버가 가운데 있다고 했을 때, 왼쪽과 오른쪽에 몇 개가 표시되야 하는지 정의한다.
    const gap = Math.floor(oddNumberForDisplayCount / 2);

    let start = centerNumber - gap;
    let end = centerNumber + gap + 1; // end 미만이므로 1 추가

    // 현재 페이지가 1과 gap 사이에 있을 때,
    // 즉, 현재 페이지 넘버의 왼쪽에 표시할 숫자가 gap보다 모자랄 때
    if (centerNumber <= gap) {
        start = 1;
        end = oddNumberForDisplayCount + 1;
    }

    // 현재 페이지가 마지막 페이지에 가까워서
    // 현재 페이지 넘버 오른쪽에 표시할 숫자가 gap보다 모자랄 때
    if (gap > lastNumber - centerNumber) {
        start = lastNumber - gap * 2;
        end = lastNumber + 1
    }

    const onClickPageNumberButton = useCallback((newPageNum) => () => {
        if (newPageNum === centerNumber) {
            return;
        }
        if (newPageNum === 1 && centerNumber === 1) {
            return;
        }
        if (newPageNum === lastNumber && centerNumber === lastNumber) {
            return;
        }
        onPageButtonClick(newPageNum);
    }, [centerNumber, lastNumber, onPageButtonClick]);

    const numbersToDisplay = getNumArrayOfRange(start, end)
        .filter((num) => num >= 1 && num <= lastNumber) // 처음과 끝이 범위 안에 있게 하여 예외 처리
        .sort((a, b) => a - b);

    return (
        <div className="pagination-page-number wrapper">
            {
                numbersToDisplay.map((num, idx) => {
                    return <button
                        key={`page-num-${num}-${idx}`}
                        onClick={onClickPageNumberButton(num)}
                        className={`pagination-page-number button ${num === centerNumber ? "selected" : ""}`}
                    >{num !== 0 ? String(num) : " "}</button>
                })
            }
        </div>
    )
};

export default PageNumber;
