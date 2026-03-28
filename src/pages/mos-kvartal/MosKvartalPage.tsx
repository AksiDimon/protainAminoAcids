import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Box, Button, Chip, Container, Switch, Typography } from '@mui/material';

const assets = {
  topLeft: 'https://www.figma.com/api/mcp/asset/6599eaac-29d4-41ef-a628-1e4011878a9d',
  bottomLeft:
    'https://www.figma.com/api/mcp/asset/09d13c1c-bd7f-4911-8cb7-e41638eedf81',
  right: 'https://www.figma.com/api/mcp/asset/da9cee9c-1e38-4841-bb85-bfea8bba7593',
  p1: 'https://www.figma.com/api/mcp/asset/01347e1e-e806-4c9c-b584-3247aff581c8',
  p2: 'https://www.figma.com/api/mcp/asset/1e736b7e-ec25-43be-8a9b-4cddbe13152f',
  p3: 'https://www.figma.com/api/mcp/asset/ebb39d20-fd2f-4f89-82d1-b5b974044e3c',
  p4: 'https://www.figma.com/api/mcp/asset/8f45575d-d41d-4c61-99f1-2f4c60fbb555',
  p5: 'https://www.figma.com/api/mcp/asset/352a4daa-bdcc-4171-b120-dd01b113cea4',
  p6: 'https://www.figma.com/api/mcp/asset/9a6eee38-d561-49d7-af66-87b5fa72b847',
};

const montserrat = '"Montserrat", "Roboto", "Arial", sans-serif';

const bannerCardSx = {
  position: 'relative',
  borderRadius: '16px',
  overflow: 'hidden',
  p: 4,
};

const bannerTitleSx = {
  fontFamily: montserrat,
  fontSize: '24px',
  lineHeight: 1.5,
  fontWeight: 600,
  letterSpacing: '0.04em',
  color: '#FFFFFF',
};

const bannerSubtitleSx = {
  mt: 0.5,
  fontFamily: montserrat,
  fontSize: '14px',
  lineHeight: 1.5,
  fontWeight: 500,
  letterSpacing: '0.04em',
  color: '#FFFFFF',
};

const whiteButtonSx = {
  mt: 3,
  minWidth: 0,
  px: 2.5,
  py: 0.5,
  borderRadius: '20px',
  textTransform: 'none',
  fontFamily: montserrat,
  fontSize: '14px',
  lineHeight: 1.3,
  fontWeight: 400,
  bgcolor: '#FFFFFF',
  color: '#CC0605',
};

const outlineWhiteButtonSx = {
  mt: 3,
  minWidth: 0,
  px: 2.5,
  py: 0.5,
  borderRadius: '20px',
  textTransform: 'none',
  fontFamily: montserrat,
  fontSize: '14px',
  lineHeight: 1.3,
  fontWeight: 400,
  color: '#FFFFFF',
  border: '1px solid #FFFFFF',
};

const filterChipSx = {
  borderRadius: '40px',
  borderColor: '#505050',
  color: '#505050',
  fontFamily: montserrat,
  fontSize: '12px',
  height: '34px',
  '& .MuiChip-label': { px: 1.5 },
};

const cards = [
  {
    image: assets.p1,
    tags: ['строится', 'с отделкой', 'ввод в декабре 2025'],
    address:
      'д. Марушкино, Северная ул., д. 21, к. 1, 2, 3, 4 (д. Марушкино, Северная ул., д. 21, к. 1, 2)',
    price: 'от 14,8 млн ₽',
    discount: 'скидка от 4%',
  },
  {
    image: assets.p2,
    tags: ['готовые квартиры', 'с отделкой', 'семейная ипотека'],
    address: 'Дмитровское ш., з/у 89 (стр. 1)',
    price: 'от 16,7 млн ₽',
    discount: '',
  },
  {
    image: assets.p3,
    tags: ['строится', 'с отделкой', 'семейная ипотека'],
    address: 'Севастопольский пр-кт, д. 28, к. 9',
    price: 'от 25,6 млн ₽',
    discount: 'скидка от 4%',
  },
  {
    image: assets.p4,
    tags: ['строится', 'с отделкой', 'семейная ипотека'],
    address:
      'д. Марушкино, Северная ул., д. 21, к. 1, 2, 3, 4 (д. Марушкино, Северная ул., д. 21, к. 1, 2)',
    price: 'от 9,6 млн ₽',
    discount: 'скидка от 4%',
  },
  {
    image: assets.p5,
    tags: ['строится', 'с отделкой', 'семейная ипотека'],
    address: 'Салтыковская ул., д. 6/2, к. 1, 2, 3, 4',
    price: 'от 13,2 млн ₽',
    discount: 'скидка от 4%',
  },
  {
    image: assets.p6,
    tags: ['строится', 'с отделкой', 'семейная ипотека'],
    address: 'Маршала Еременко ул., д. 5, к. 1, 2, 3, 4',
    price: 'от 7,8 млн ₽',
    discount: 'скидка от 4%',
  },
];

function PropertyCard({
  image,
  tags,
  address,
  price,
  discount,
}: {
  image: string;
  tags: string[];
  address: string;
  price: string;
  discount: string;
}) {
  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: { xs: 240, sm: 274 },
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 2,
            left: 2,
            right: 2,
            p: 1,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {tags.map((tag, index) => (
            <Chip
              key={`${tag}-${index}`}
              label={tag}
              size="small"
              sx={{
                height: 20,
                borderRadius: '6px',
                fontFamily: montserrat,
                fontSize: '12px',
                color: index === 2 ? '#FFFFFF' : '#727272',
                bgcolor: index === 2 ? '#09941D' : '#F9F9F9',
                '& .MuiChip-label': { px: 1 },
              }}
            />
          ))}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            p: '10px',
            display: 'flex',
            gap: '2px',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: 4,
                borderRadius: '100px',
                bgcolor: i === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 1.25, display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: '#4E4E4E',
              fontFamily: montserrat,
              fontSize: '16px',
              lineHeight: 1.5,
            }}
          >
            {address}
          </Typography>

          <Box sx={{ mt: 0.75, display: 'grid', gap: 0.5 }}>
            <Typography sx={{ color: '#505050', fontFamily: montserrat, fontSize: '10px', lineHeight: 1.3 }}>
              Бабушкинская · 11 мин. · 2 мин.
            </Typography>
            <Typography sx={{ color: '#505050', fontFamily: montserrat, fontSize: '10px', lineHeight: 1.3 }}>
              Отрадное · 15 мин.
            </Typography>
          </Box>

          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              sx={{
                color: '#4E4E4E',
                fontFamily: montserrat,
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {price}
            </Typography>
            {discount ? (
              <Chip
                label={discount}
                size="small"
                variant="outlined"
                sx={{
                  height: 16,
                  borderRadius: '6px',
                  borderColor: '#09941D',
                  color: '#09941D',
                  fontFamily: montserrat,
                  fontSize: '8px',
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            ) : null}
          </Box>
        </Box>

        <FavoriteBorderIcon sx={{ color: '#CC0605', mt: 0.5, flexShrink: 0 }} />
      </Box>
    </Box>
  );
}

function MosKvartalPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 3, md: 6 },
        background:
          'linear-gradient(180deg, #ECE9DE 0.23%, #ECE9DE 80.56%, rgba(236, 233, 222, 0) 100%)',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1304px', px: { xs: 2, md: 0 } }}>
        <Box
          component="section"
          id="mos-kvartal-banner"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '617px 651px' },
            gap: 2.5,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateRows: { xs: 'auto auto', md: '154px 154px' },
              gap: 2.5,
            }}
          >
            <Box
              sx={{
                ...bannerCardSx,
                minHeight: 154,
                backgroundImage: `url(${assets.topLeft})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <Typography sx={{ ...bannerTitleSx, maxWidth: 403 }}>
                Городской застройщик
              </Typography>
              <Typography sx={bannerSubtitleSx}>
                более 2500 квартир во всех районах Москвы
              </Typography>
              <Button sx={whiteButtonSx}>Подробнее →</Button>
            </Box>

            <Box
              sx={{
                ...bannerCardSx,
                minHeight: 154,
                backgroundImage: `url(${assets.bottomLeft})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <Typography sx={{ ...bannerTitleSx, maxWidth: 560 }}>
                Готовые квартиры
              </Typography>
              <Typography sx={bannerSubtitleSx}>по семейной ипотеке</Typography>
              <Button sx={outlineWhiteButtonSx}>Выбрать квартиру</Button>
            </Box>
          </Box>

          <Box
            sx={{
              ...bannerCardSx,
              minHeight: { xs: 300, lg: 328 },
              backgroundImage: `url(${assets.right})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography sx={{ ...bannerTitleSx, maxWidth: 409 }}>
              Квартиры на севере Москвы рядом с метро
            </Typography>
            <Button sx={{ ...outlineWhiteButtonSx, mt: 'auto', alignSelf: 'flex-start' }}>
              Выбрать квартиру
            </Button>
          </Box>
        </Box>

        <Box component="section" id="mos-kvartal-projects" sx={{ mt: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              sx={{
                color: '#CC0605',
                fontFamily: montserrat,
                fontSize: { xs: '34px', md: '40px' },
                lineHeight: 1.5,
                fontWeight: 600,
              }}
            >
              Квартиры
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: '#CC0605', fontSize: 28 }} />
          </Box>

          <Box
            sx={{
              mt: 1,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr auto' },
              gap: 2,
              alignItems: 'start',
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                justifyContent: 'space-between',
                borderColor: '#505050',
                color: '#505050',
                borderRadius: '40px',
                py: 1,
                px: 1.5,
                textTransform: 'none',
                fontFamily: montserrat,
                fontSize: '12px',
                lineHeight: 1.3,
              }}
            >
              Расположение
            </Button>

            <Box sx={{ width: { xs: '100%', lg: 204 } }}>
              <Typography sx={{ color: '#505050', fontFamily: montserrat, fontSize: '12px', mb: 0.75 }}>
                Цена, млн ₽
              </Typography>
              <Box
                sx={{
                  border: '1px solid #505050',
                  borderRadius: '40px',
                  py: 1,
                  px: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#505050',
                  fontFamily: montserrat,
                  fontSize: '12px',
                  lineHeight: 1.3,
                }}
              >
                <span>3</span>
                <span>-</span>
                <span>33</span>
              </Box>
              <Box sx={{ mt: 1.2, height: 2, bgcolor: '#CC0605', position: 'relative' }}>
                <Box sx={{ position: 'absolute', left: 0, top: -3, width: 8, height: 8, borderRadius: '50%', bgcolor: '#CC0605' }} />
                <Box sx={{ position: 'absolute', right: 0, top: -3, width: 8, height: 8, borderRadius: '50%', bgcolor: '#CC0605' }} />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: '622px 622px' },
              gap: 2,
            }}
          >
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              <Box>
                <Typography sx={{ color: '#505050', fontFamily: montserrat, fontSize: '12px', mb: 0.75 }}>
                  Комнаты
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {['Ст', '1', '2', '3', '4+'].map((item) => (
                    <Chip key={item} label={item} variant="outlined" sx={filterChipSx} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                <Box>
                  <Typography sx={{ color: '#505050', fontFamily: montserrat, fontSize: '12px', mb: 0.75 }}>
                    Покупка
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {['Аукцион', 'Без аукциона'].map((item) => (
                      <Chip key={item} label={item} variant="outlined" sx={filterChipSx} />
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography sx={{ color: '#505050', fontFamily: montserrat, fontSize: '12px', mb: 0.75 }}>
                    Ипотека
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {['Стандартная', 'Семейная'].map((item) => (
                      <Chip key={item} label={item} variant="outlined" sx={filterChipSx} />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'auto auto' },
                gap: 1.5,
                justifyContent: { xs: 'start', sm: 'space-between' },
              }}
            >
              <Box>
                <Typography sx={{ color: '#505050', fontFamily: montserrat, fontSize: '12px', mb: 0.75 }}>
                  Со скидкой
                </Typography>
                <Switch checked={false} sx={{ '& .MuiSwitch-thumb': { boxShadow: 'none' } }} />
              </Box>

              <Box>
                <Typography sx={{ color: '#505050', fontFamily: montserrat, fontSize: '12px', mb: 0.75 }}>
                  Скрыть забронированные
                </Typography>
                <Switch checked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#CC0605' } }} />
              </Box>

              <Button
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  justifySelf: { xs: 'start', sm: 'end' },
                  textTransform: 'none',
                  fontFamily: montserrat,
                  fontSize: '24px',
                  color: '#505050',
                  p: 0.5,
                  minWidth: 0,
                }}
              >
                Больше фильтров
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: { xs: 'flex-start', lg: 'flex-end' } }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#CC0605',
                color: '#CC0605',
                borderRadius: '20px',
                textTransform: 'none',
                fontFamily: montserrat,
                fontSize: '14px',
              }}
            >
              Показать 41 объект
            </Button>
            <Button
              sx={{
                bgcolor: '#CC0605',
                color: '#FFFFFF',
                borderRadius: '20px',
                textTransform: 'none',
                fontFamily: montserrat,
                fontSize: '14px',
                '&:hover': { bgcolor: '#b50504' },
              }}
            >
              Показать 401 квартиру
            </Button>
            <Button
              sx={{
                color: '#505050',
                textTransform: 'none',
                fontFamily: montserrat,
                fontSize: '14px',
                minWidth: 0,
              }}
            >
              Сбросить
            </Button>
          </Box>

          <Box
            sx={{
              mt: 2.25,
              backgroundColor: '#F9F9F9',
              borderRadius: '4px',
              p: 1.25,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Switch checked={false} />
            <LocationOnOutlinedIcon sx={{ color: '#505050', fontSize: 17 }} />
            <Typography sx={{ color: '#505050', fontFamily: montserrat, fontSize: '14px', lineHeight: 1.3 }}>
              Карта
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: 'repeat(3, 1fr)' },
              gap: { xs: 3, md: '40px' },
            }}
          >
            {cards.map((card, index) => (
              <PropertyCard
                key={`${card.address}-${index}`}
                image={card.image}
                tags={card.tags}
                address={card.address}
                price={card.price}
                discount={card.discount}
              />
            ))}
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              endIcon={<KeyboardArrowDownIcon sx={{ transform: 'rotate(-90deg)' }} />}
              sx={{
                borderColor: '#CC0605',
                color: '#CC0605',
                borderRadius: '20px',
                textTransform: 'none',
                fontFamily: montserrat,
                fontSize: '24px',
                lineHeight: 1.3,
                px: 2.5,
                py: 0.5,
              }}
            >
              Показать все
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default MosKvartalPage;
