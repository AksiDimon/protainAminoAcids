// import { Box,  Typography, useMediaQuery  } from '@mui/material';
// import { colorsMap } from './types';
// import type {PropsSequence } from './types';
// export function AlignmentViewer({ seq1, seq2, showViewer, onCopy }: PropsSequence) {
//     const isWide = useMediaQuery('(min-width:310px)');

//         // обработчик, вызываем на mouseUp
//   function handleMouseUp () {
//     const sel = window.getSelection();

//     const text = sel?.toString().trim();
//     console.log(sel, '💕' , text)
//     if (text) {
//       onCopy(text);
//       // сбросим текущее выделение (опционально)
//       sel?.removeAllRanges();
//     }
//   };

//     if(!showViewer) {
//         return null
//     }

//   return (
//     <Box
//     component='section'
//     onMouseUp={handleMouseUp}
//       sx={{
//         display: 'flex',
//         flexWrap: 'wrap',
//         fontFamily: 'monospace',
//         justifyContent: 'center',
//         gap: 1,
//         mt: 4,
//         width: isWide ? '100%' : '65%',
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
//               whiteSpace: 'wrap',
//             border: '1px solid black'
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
// import { useCallback } from 'react';
// import { Box, useMediaQuery } from '@mui/material';
// import { colorsMap } from './types';
// import type { PropsSequence } from './types';

// export function AlignmentViewer({ seq1, seq2, showViewer, onCopy }: PropsSequence) {
//   if (!showViewer) return null;

//   // на очень узких экранах пусть уменьшается размер текста
//   const isWide = useMediaQuery('(min-width:600px)');

//     // обработчик, вызываем на mouseUp
//   const handleMouseUp = useCallback(() => {
//     const sel = window.getSelection();
//     const text = sel?.toString().trim();
//     if (text) {
//       onCopy(text);
//       // сбросим текущее выделение (опционально)
//       sel?.removeAllRanges();
//     }
//   }, [onCopy]);

//   return (
//     <Box
//       component="pre"
//       onMouseUp={handleMouseUp}
//       sx={{
//         fontFamily: 'monospace',
//         whiteSpace: 'pre-wrap',      // позволяем переносить строки
//         wordBreak: 'break-all',      // разрешаем перенос в середине "слов"
//         fontSize: isWide ? '1rem' : '0.85rem',
//         p: 2,
//         m: 2,
//         backgroundColor: '#fafafa',
//         borderRadius: 1,
//         overflowX: 'auto',
//       }}
//     >
//       {/* Первая строка: все буквы с фоном */}
//       {seq1.split('').map((char, i) => (
//         <span
//           key={`s1-${i}`}
//           style={{
//             border: '1px solid black',
//             backgroundColor: colorsMap[char] ?? 'transparent',
//                    padding: '2px 4px',
//           margin: '2px',
//           borderRadius: '4px',
//           }}
//         >
//           {char}
//         </span>
//       ))}

//       {'\n'}

//       {/* Вторая строка: только отличающиеся буквы окрашены */}
//       {seq2.split('').map((char, i) => {
//         const isDiff = char !== seq1[i];
//         return (
//           <span
//             key={`s2-${i}`}
//             style={{
//               backgroundColor: isDiff ? (colorsMap[char] ?? 'transparent') : 'transparent',
//                      padding: '2px 4px',
//           margin: '2px',
//           borderRadius: '4px',
//             }}
//           >
//             {char}
//           </span>
//         );
//       })}
//     </Box>
//   );
// }

import { Box, Typography } from '@mui/material';
import { colorsMap } from './types';
import type { PropsSequence } from './types';

export function AlignmentViewer({
  seq1,
  seq2,
  showViewer,
  onCopy,
}: PropsSequence) {
  // const isWide = useMediaQuery('(min-width:310px)');
  if (!showViewer) return null;

  // базовые стили
  const containerSx = {
    position: 'relative', // чтобы вложенный абсолют был привязан
    width: '100%',
    fontFamily: 'monospace',
    mt: 4,
  };
  const gridSx = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
    justifyContent: 'center',
  };
  const columnSx = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  const letterSx = {
    display: 'inline-block',
    padding: '2px 4px',
    borderRadius: '4px',
  };

  // копирование в буфер
  function handleMouseUp() {
    const sel = window.getSelection();
    const txt = sel?.toString().trim();
    if (txt) {
      onCopy(txt);
      sel?.removeAllRanges();
    }
  }

  return (
    <Box component="section" sx={containerSx} onMouseUp={handleMouseUp}>
      {/** 1) Слой поиска — поверх всё той же области */}
      <Box
        component="pre"
        sx={{
          ...gridSx,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          color: 'transparent', // текст невидим
          pointerEvents: 'none', // клики и выделения проходят сквозь
          zIndex: 1,
        }}
      >
        <Box
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap', // позволяем переносить строки
            wordBreak: 'break-all',
            position: 'relative',
            top: '-19%',
    justifyContent: 'center',
           
            overflowX: 'auto',
          }}
        >
          {seq1.split('').map((val, i) => {
            return (
              <span key={i} style={{ padding: '2px 7px' }}>
                {val}
              </span>
            );
          })}
          {'\n'}
                    {seq2.split('').map((val, i) => {
            return (
              <span key={i} style={{ padding: '2px 7px' }}>
                {val}
              </span>
            );
          })}
        </Box>

        
       
      </Box>

      {/** 2) Визуальный слой колонок */}
      <Box sx={gridSx}>
        {seq1.split('').map((ch, i) => {
          const ch2 = seq2[i];
          const diff = ch !== ch2;
          return (
            <Box key={i} component="span" sx={columnSx}>
              <Typography
                component="span"
                sx={{
                  ...letterSx,
                  backgroundColor: colorsMap[ch] ?? 'transparent',
                }}
              >
                {ch}
              </Typography>
              <Typography
                component="span"
                sx={{
                  ...letterSx,
                  backgroundColor: diff
                    ? colorsMap[ch2] ?? 'transparent'
                    : 'transparent',
                }}
              >
                {ch2}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
