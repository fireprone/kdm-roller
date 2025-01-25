import './TermsList.css';
import { useState, useEffect } from 'react';
import glossaryTerms from '../../data/glossaryTerms.json';
// import { MdKeyboardArrowUp } from 'react-icons/md';
// import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { motion, AnimatePresence } from 'motion/react';

const TermsList = ({ terms, isShown }) => {
  const [activeTerm, setActiveTerm] = useState('');

  useEffect(() => {
    setTimeout(() => setActiveTerm(''), 500);
  }, [isShown]);

  return (
    <motion.div
      className='TermsList'
      initial={{ marginTop: 0 }}
      animate={{ marginTop: ['1rem', '3rem', '2rem'] }}
      transition={{
        marginTop: { type: 'spring', duration: 0.75 },
      }}
    >
      <AnimatePresence>
        {activeTerm && (
          <motion.div
            id='term-definition'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              marginTop: { type: 'spring', duration: 0.1 },
            }}
          >
            <h2>{activeTerm}</h2>
            <hr />
            <p>{glossaryTerms[activeTerm]}</p>
            <motion.div id='return' onTap={() => setActiveTerm('')}>
              {/* <MdKeyboardArrowUp /> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ul>
        {terms.map((term) => (
          <motion.li
            key={term.replace(/ /g, '-')}
            onTap={() => setActiveTerm(term)}
          >
            <div className='term'>
              {term}
              {/* <LibraryBooksIcon /> */}
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default TermsList;
