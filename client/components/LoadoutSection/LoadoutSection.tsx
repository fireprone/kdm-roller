import './LoadoutSection.css';
import LoadoutGrid from '../LoadoutGrid/LoadoutGrid';
import { AnimatePresence } from 'motion/react';
import Overlay from '../Overlay/Overlay';
import React, { useState, useRef, useEffect } from 'react';

const LoadoutSection = (props) => {
  const [activeIndex, setActiveIndex] = useState(null);

  let defaultGrid = [
    null,
    null,
    null,
    null,
    'founding-stone',
    'cloth',
    null,
    null,
    null,
  ];
  const gridInSession = sessionStorage.getItem('gearGrid');
  if (gridInSession) {
    defaultGrid = JSON.parse(gridInSession);
  }
  const [gridArray, setGridArray] = useState(defaultGrid);

  const cell0 = useRef(null),
    cell1 = useRef(null),
    cell2 = useRef(null),
    cell3 = useRef(null),
    cell4 = useRef(null),
    cell5 = useRef(null),
    cell6 = useRef(null),
    cell7 = useRef(null),
    cell8 = useRef(null);
  const cells = [cell0, cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8];
  const sectionRef = useRef(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayIndex, setOverlayIndex] = useState(-1);

  useEffect(() => {
    //Save grid
    sessionStorage.setItem('gearGrid', JSON.stringify(gridArray));
  }, [gridArray]);

  const checkCellIndex = ({ point }) => {
    const cellIndex = cells.findIndex((cell) => {
      const { left, right, top, bottom } = cell.current.getBoundingClientRect();

      return (
        point.x >= left &&
        point.x <= right &&
        point.y >= top &&
        point.y <= bottom
      );
    });

    return cellIndex;
  };

  const dragEnd = (event, info) => {
    const cellIndex = checkCellIndex(info);
    const newGridArray = [...gridArray];
    const draggedCard = event.srcElement;

    if (cellIndex >= 0 && cellIndex !== activeIndex) {
      if (activeIndex === null || isNaN(activeIndex)) {
        newGridArray[cellIndex] = draggedCard.classList[0];
      } else {
        const temp = newGridArray[cellIndex];
        newGridArray[cellIndex] = newGridArray[activeIndex];
        newGridArray[activeIndex] = temp;
      }
    }
      setGridArray(newGridArray);
      setActiveIndex(null);
  };

  const activateCard = (event) => {
    const parentElem = event.target.parentElement;
    if (parentElem) {
      parentElem.parentElement.style.zIndex = 2;
      setActiveIndex(parseInt(parentElem.parentElement.id));
    }
  };

  return (
    <div id='loadout-view' ref={sectionRef}>
      <AnimatePresence>
        {isOverlayOpen && (
          <Overlay 
            setIsOverlayOpen={setIsOverlayOpen} 
            overlayIndex={overlayIndex} 
            setGridArray={setGridArray}
          />
        )}
      </AnimatePresence> 
      <section id='grid-section'>
        <LoadoutGrid
          cells={cells}
          gridArray={gridArray}
          activeIndex={activeIndex}
          tapStart={activateCard}
          dragEnd={dragEnd}
          clickListener={setIsOverlayOpen}
          setOverlayIndex={setOverlayIndex}
          dragConstraints={sectionRef}
        />
      </section>
    </div>
  );
};

export default LoadoutSection;
