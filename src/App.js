import { useState, useEffect } from 'react';
import './App.css';
import styled from '@emotion/styled';
import logo from './images/dollar_icon.png';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const colors = {
  bisque: '#FFDEC3',
  macaroniAndCheese: '#FFBD86',
  thistleGreenLight: '#EEEFD1',
  thistleGreen: '#C8C9AB',
  feijoaGreen: '#97DA7B',
  asparagus: '#74914C',
  tobaccoBrown: '#725C4A',
  logCabin: '#2f3640',
  black: '#000000',
  white: '#FFFFFF',
};

const breakpoints = {
  mobile: '@media (min-width: 375px)',
  tablet: '@media (min-width: 768px)',
  desktop: '@media (min-width: 1024px)',
  desktopXL: '@media (min-width: 1440px)',
};

const StyledContainer = styled.div`
  background-color: ${colors.thistleGreenLight};
  width: 100vw;
  height: 100vh;
`;

const StyledNav = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0px 2px 2px -3px ${colors.black}, 0px 0px 34px -17px ${colors.black};
  margin-bottom: 10px;
  background-color: ${colors.feijoaGreen};

  img {
    object-fit: cover;
    width: 40px;
    border-radius: 50%;
    margin-right: 20px;
  }

  span {
    font-family: 'Oswald', sans-serif;
    font-size: 24px;
    color: ${colors.logCabin};
  }
`;

const StyledListContainer = styled.div`
  margin: 20px;

  ${breakpoints.tablet} {
    margin: 40px 20px;
  }
  ${breakpoints.desktop} {
    margin: 40px auto;
    max-width: 700px;
  }
`;

const StyledList = styled.ul`
  background-color: ${colors.thistleGreen};
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  ${breakpoints.tablet} {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    padding: 10px 10px 0;
  }
`;

const StyledItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style-type: none;
  border-radius: 4px;
  border: 1px solid ${colors.thistleGreenLight};
  width: calc(100% - 20px);
  margin: 10px 0;
  color: ${colors.logCabin};

  h1 {
    font-family: 'Oswald', sans-serif;
    margin-top: 15px;
  }

  ${breakpoints.tablet} {
    width: calc(50% - 7px);
    margin: 0 0 10px;
    h1 {
      margin-top: 5px;
    }
  }
`;

const StyledBody = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 20px);
`;

const StyledCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% / 3);
  text-align: center;
  height: 15vh;
  justify-content: center;

  h2 {
    margin: 0;
    font-family: 'Oswald',sans-serif;
  }
  p {
    font-size: 14px;
    font-weight: 700;
  }
  ${breakpoints.tablet} {
    height: 10vh;
  }
`;

const StyledVariation = styled.div`
  display: flex;
  align-items: center;
`;

const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;


const Nav = () => (
  <StyledNav>
    <img src={logo} alt="Logo"/>
    <span>Dolar Hoy</span>
  </StyledNav>
);

const App = () => {
  // const ratesForMock = [{
  //     compra: '87,06',
  //     venta: '93,06',
  //     fecha: '02/02/2021 - 15:52',
  //     variacion: '0,08%',
  //     class-variacion: 'up',
  //   },
  //   {
  //     compra: '148,00',
  //     venta: '153,00',
  //     fecha: '02/02/2021 - 16:15',
  //     variacion: '0,00%',
  //     class-variacion: 'equal',
  //   },
  // ];
  const [rates, setRates] = useState([]);

  const fetchAll = (urls) => {
    return Promise.all(
      urls.map(url => fetch(url)
        .then(r => r.json())
        .then(data => ({ data, url }))
        .catch(error => ({ error, url }))
      )
    )
  };

  useEffect(() => {
    const api = [
      'https://mercados.ambito.com/dolar/oficial/variacion',
      'https://mercados.ambito.com/dolar/informal/variacion',
    ];

    const getRates = async () => {
      const response = await fetchAll(api);
      const formattedResponse = response.map(({ data, url }) => {
        return {
          buy: data.compra,
          sell: data.venta,
          date: data.fecha,
          variation: data.variacion,
          classVariation: data['class-variacion'],
          url,
        }
      });
      setRates(formattedResponse);
    };

    getRates();
  }, []);

  const formatVariation = (v) => {
    return v.split(' - ').join(' ');
  };

  return (
    <StyledContainer>
      <Nav />
      <StyledListContainer>
        <StyledList>
          {rates.length > 0 && rates.map(
            ({ buy, sell, date, variation, classVariation, url }, index) =>
            <StyledItem key={url}>
            <h1>{index === 0 ? 'Oficial' : 'Informal'}</h1>
            <StyledBody>
              <StyledCell>
                <h2>Compra</h2>
                <p>${buy}</p>
              </StyledCell>
              <StyledCell>
                <h2>Venta</h2>
                <p>${sell}</p>
              </StyledCell>
              <StyledCell>
                <StyledVariation>
                  <span>{classVariation === 'up' ?
                    <ArrowDropUpIcon/> : (classVariation === 'down' ?
                    <ArrowDropDownIcon/> : '')}</span>
                  <h2>{variation}</h2>
                </StyledVariation>
                <p>{formatVariation(date)}</p>
              </StyledCell>
            </StyledBody>
          </StyledItem>
          )}
        </StyledList>
      </StyledListContainer>
      <StyledFooter>
        <span>Valores tomados de&nbsp;</span><a href="https://www.ambito.com/">ambito.com</a>
      </StyledFooter>
    </StyledContainer>
  );
};

export default App;
