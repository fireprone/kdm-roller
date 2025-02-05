import './LoadoutSection.css';
import LoadoutGrid from '../LoadoutGrid/LoadoutGrid';
import LoadoutCard from '../LoadoutCard/LoadoutCard';
import { AnimatePresence, motion, useDragControls } from 'motion/react';
import Overlay from '../Overlay/Overlay';
import React, { useState, useRef, useEffect } from 'react';


// TODO: Clone card on drag instead of removing from list
const LoadoutSection = (props) => {
  const [focusedCard, setFocusedCard] = useState({ name: '', origin: '' });
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentDraggingCard, setCurrentDraggingCard] = useState('');

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
  // const removalRef = useRef(null);

  const controls = useDragControls();

  useEffect(() => {
    //Save grid
    sessionStorage.setItem('gearGrid', JSON.stringify(gridArray));
  }, [gridArray]);

  const startGearCardDrag = (event, cardName) => {
    controls.start(event, { snapToCursor: true });
    setCurrentDraggingCard(cardName);
  };

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

  const dragStart = (e) => {
    e.stopPropagation(); 
    setIsDragging(true);
  };

  // const dragActive = (event, info) => {
  //   const activeCard = event.target;
  //   if (!activeCard.classList) {
  //     return;
  //   }

  //   // if (info.point.y < removalRef.current.clientHeight) {
  //   //   activeCard.classList.add('removable');
  //   // } else {
  //   //   activeCard.classList.remove('removable');
  //   // }
  // };

  const dragEnd = (event, info) => {
    setIsDragging(false);

    const cellIndex = checkCellIndex(info);
    const newGridArray = [...gridArray];
    const draggedCard = event.srcElement;
    // const removableCard = document.querySelector('.removable');

    // if (removableCard) {
    //   newGridArray[activeIndex] = null;
    // } else if (cellIndex >= 0 && cellIndex !== activeIndex) {
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
      <motion.div
        drag
        // layout
        // whileDrag={{ zIndex: 5, scale: 1.3, opacity: 1 }}
        onDragStart={dragStart}
        onDragEnd={dragEnd}
        // dragControls={controls}
        style={{
          position: 'absolute',
          width: '10rem',
          zIndex: -5,
          opacity: 0,
        }}
        transition={{
          opacity: { duration: 0 },
        }}
      >
        <LoadoutCard
          name={currentDraggingCard}
          clickListener={setFocusedCard}
        />
      </motion.div>
      <section id='grid-section'>
        {/* <div id='card-removal' ref={removalRef}></div> */}
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
