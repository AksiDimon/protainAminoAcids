// import { Box,  Typography, useMediaQuery  } from '@mui/material';
// import { colorsMap } from './types';
// import type {PropsSequence } from './types';

// export function AlignmentViewer({ seq1, seq2, showViewer }: PropsSequence) {
//     const isWide = useMediaQuery('(min-width:900px)')
//     if(!showViewer) {
//         return null
//     } 

    
//   return (
//     <Box
//     component='section'
//       sx={{
//         display: 'flex',
//         flexWrap: 'wrap',
//         fontFamily: 'monospace',
//         justifyContent: 'center',
//         gap: 1,
//         mt: 4,
//         width: isWide ? '100%' : '35%',
        
//       }}
//     >
//       {seq1.split('').map((latter, i) => {
//         const letter2 = seq2[i];
//         const isDiff = latter !== letter2;
//         return (
//           <Box
//             key={i}
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//             //   whiteSpace: 'wrap'
            
//             }}
//           >
//             <Typography
//             component="span"

//               sx={{
//     display: 'inline-block',    // или 'block', если нужно
//     width: 'min-content',       // ширина ровно под содержимое
//     p: '2px 4px',
//     borderRadius: 1,
//     backgroundColor: colorsMap[latter] ?? 'transparent',
//     fontFamily: 'monospace',
//     textAlign: 'center',

//               }}
//             >
//               {latter}
//             </Typography>
//             <Typography 
//             component="span"

//             sx={{
//                 backgroundColor: isDiff ? (colorsMap[letter2] ?? 'transparent') : 'transparent',
//                 padding: '2px 4px',
//                 borderRadius: '4px',
//               }}
//             >
//                 {letter2}
//             </Typography>
//           </Box>
//         );
//       })}
//     </Box>
//   );
// }
import { useCallback } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { colorsMap } from './types';
import type { PropsSequence } from './types';

export function AlignmentViewer({ seq1, seq2, showViewer, onCopy }: PropsSequence) {
  if (!showViewer) return null;

  // на очень узких экранах пусть уменьшается размер текста
  const isWide = useMediaQuery('(min-width:600px)');

    // обработчик, вызываем на mouseUp
  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (text) {
      onCopy(text);
      // сбросим текущее выделение (опционально)
      sel?.removeAllRanges();
    }
  }, [onCopy]);

  return (
    <Box
      component="pre"
      onMouseUp={handleMouseUp}
      sx={{
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',      // позволяем переносить строки
        wordBreak: 'break-all',      // разрешаем перенос в середине "слов"
        fontSize: isWide ? '1rem' : '0.85rem',
        p: 2,
        m: 2,
        backgroundColor: '#fafafa',
        borderRadius: 1,
        overflowX: 'auto',
      }}
    >
      {/* Первая строка: все буквы с фоном */}
      {seq1.split('').map((char, i) => (
        <span
          key={`s1-${i}`}
          style={{
            backgroundColor: colorsMap[char] ?? 'transparent',
                   padding: '2px 4px',
          marginRight: '2px',
          borderRadius: '4px',
          }}
        >
          {char}
        </span>
      ))}

      {'\n'}

      {/* Вторая строка: только отличающиеся буквы окрашены */}
      {seq2.split('').map((char, i) => {
        const isDiff = char !== seq1[i];
        return (
          <span
            key={`s2-${i}`}
            style={{
              backgroundColor: isDiff ? (colorsMap[char] ?? 'transparent') : 'transparent',
                     padding: '2px 4px',
          marginRight: '2px',
          borderRadius: '4px',
            }}
          >
            {char}
          </span>
        );
      })}
    </Box>
  );
}
