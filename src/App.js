import React, {
  useState
} from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  Form,
  Table
} from 'react-bootstrap';
import FlagIcon from './FlagIcon.js'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  format,
  subYears,
  addDays
} from 'date-fns';
import './App.css';

function App() {

  // Dropdown values
  const [countries] = useState([
    { code: 'au', title: 'Australian Dollar', curr_code: 'AUD'},
    { code: 'bg', title: 'Bulgaria Lev', curr_code: 'BGN'},
    { code: 'br', title: 'Brazillian Real', curr_code: 'BRL'},
    { code: 'ca', title: 'Canadian Dollar', curr_code: 'CAD'},
    { code: 'cn', title: 'Chinese Yuan', curr_code: 'CNY'},
    { code: 'hr', title: 'Croatian Kuna', curr_code: 'HRK'},
    { code: 'cz', title: 'Czech Koruna', curr_code: 'CZK'},
    { code: 'dk', title: 'Danish Krone', curr_code: 'DKK'},
    { code: 'hk', title: 'Hong Kong Dollar', curr_code: 'HKD'},
    { code: 'hu', title: 'Hungarian Forint', curr_code: 'HUF'},
    { code: 'is', title: 'Icelandic Krona', curr_code: 'ISK'},
    { code: 'in', title: 'Indian Rupee', curr_code: 'INR'},
    { code: 'id', title: 'Indonesian Rupiah', curr_code: 'IDR'},
    { code: 'il', title: 'Israeli Shekel', curr_code: 'ILS'},
    { code: 'jp', title: 'Japanese Yen', curr_code: 'JPY'},
    { code: 'my', title: 'Malaysian Ringgit', curr_code: 'MYR'},
    { code: 'mx', title: 'Mexican Peso', curr_code: 'MXN'},
    { code: 'nz', title: 'New Zealand Dollar', curr_code: 'NZD'},
    { code: 'no', title: 'Norwegian Krone', curr_code: 'NOK'},
    { code: 'ph', title: 'Philippine Peso', curr_code: 'PHP'},
    { code: 'pl', title: 'Polish Zloty', curr_code: 'PLN'},
    { code: 'gb', title: 'Pound Sterling', curr_code: 'GBP'},
    { code: 'ro', title: 'Romanian Leu', curr_code: 'RON'},
    { code: 'ru', title: 'Russian Rouble', curr_code: 'RUB'},
    { code: 'sg', title: 'Singapore Dollar', curr_code: 'SGD'},
    { code: 'za', title: 'South African Rand', curr_code: 'ZAR'},
    { code: 'kr', title: 'South Korean Won', curr_code: 'KRW'},
    { code: 'se', title: 'Swedish Krona', curr_code: 'SEK'},
    { code: 'ch', title: 'Swiss Franc', curr_code: 'CHF'},
    { code: 'th', title: 'Thai Baht', curr_code: 'THB'},
    { code: 'tr', title: 'Turkish Lira', curr_code: 'TRY'},
    { code: 'us', title: 'US Dollar', curr_code: 'USD'}
  ]);
  const [toggleContents, setToggleContents] = useState("Select a base currency");
  const [toggleContents2, setToggleContents2] = useState("Select a target currency");

  // Capture selection values
  const [baseCurrency,setBaseCurrency] = useState('');
  const [targetCurrency,setTargetCurrency] = useState('');
  const [exchangeRates, setExchangeRates] = useState([]);

  const baseCurrencySelect = (e) => {
    setBaseCurrency(e);
  }
  const targetCurrencySelect = (e) => {
    setTargetCurrency(e);
  }

  // DatePicker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Format Date object to string
  const startDateRate = format(startDate, "yyyy-MM-dd");
  const endDateRate = format(endDate, "yyyy-MM-dd");

  // Get exchange rates info from selected values
  async function getRatesFromDates(startDate, endDate, baseCurrency, targetCurrency) {
    try {
      let response = await fetch('https://api.exchangeratesapi.io/history?start_at=' +
                                    startDate + '&end_at=' + endDate + '&base=' + baseCurrency + '&symbols=' + targetCurrency);
      let jsonData = await response.json();
      return jsonData.rates;
     } catch(error) {
      console.error(error);
    }
  }

  const getListCurrencyExchangeRate = () => {
    console.log("getListCurrencyExchangeRate");
    getRatesFromDates(startDateRate, endDateRate, baseCurrency, targetCurrency)
    .then( res =>{
      let list = [];
      Object.keys(res).forEach(key => {
        list.push({ date: key,
                    baseCurrencyName: baseCurrency,
                    targetCurrencyName: targetCurrency,
                    //baseCurrencyValue: res[key][baseCurrency],
                    targetCurrencyValue: res[key][targetCurrency]
                 })
      })
      // Sort data based on time
      list = list.sort((a, b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime())
      console.log(JSON.stringify(list));
      setExchangeRates(list);
    })
  }
  console.log(exchangeRates);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Currency Rate History</h1>
      </header>
      <div className="QueryArea">
        <Form>
          <Container>
            <Row>
              <Col sm={12} md={6} lg={3}>
                Select base currency: {baseCurrency}
                <Dropdown
                  onSelect={eventKey => {
                    const { code, title } = countries.find(({ curr_code }) => eventKey === curr_code);
                    setToggleContents(<><FlagIcon code={code} /> {title}</>);
                  }}>
                  <Dropdown.Toggle variant="outline-secondary" id="base_currency" className="text-left">
                    {toggleContents}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {countries.map(({ code, title, curr_code }) => (
                      <Dropdown.Item
                        key={code}
                        eventKey={curr_code}
                        onSelect={baseCurrencySelect}>
                        <FlagIcon code={code} />&nbsp;&nbsp;{title}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col sm={12} md={6} lg={3}>
                Select target currency: {targetCurrency}
                <Dropdown
                  onSelect={eventKey => {
                    const { code, title } = countries.find(({ curr_code }) => eventKey === curr_code);
                    setToggleContents2(<><FlagIcon code={code} /> {title}</>);
                  }}>
                  <Dropdown.Toggle variant="outline-secondary" id="to_currency" className="text-left">
                    {toggleContents2}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {countries.map(({ code, title, curr_code }) => (
                      <Dropdown.Item
                        key={code}
                        eventKey={curr_code}
                        onSelect={targetCurrencySelect}>
                        <FlagIcon code={code} />&nbsp;&nbsp;{title}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col sm={12} md={6} lg={3}>
                From: {startDateRate}
                <DatePicker
                  id="fromDate"
                  dateFormat="yyyy-MM-dd"
                  selected={startDate}
                  minDate={subYears(new Date(), 22)}
                  maxDate={addDays(new Date(), 0)}
                  onChange={date => setStartDate(date)} />
              </Col>
              <Col sm={12} md={6} lg={3}>
                To: {endDateRate}
                <DatePicker
                  id="toDate"
                  dateFormat="yyyy-MM-dd"
                  selected={endDate}
                  minDate={subYears(new Date(), 22)}
                  maxDate={addDays(new Date(), 0)}
                  onChange={date => setEndDate(date)} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button variant="primary" size="lg" block onClick={getListCurrencyExchangeRate}>
                  List currency exchange rate
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </div>
      <div className="ResultArea">
        <Container>
          <Row>
            <Col sm>
              <>
                <Table responsive striped bordered hover id="rateTable" size="sm" variant="dark">
                  <thead>
                    <tr>
                      <th></th>
                      {exchangeRates.map((rateArray, index) =>
                      <th key={index}>{rateArray.baseCurrencyName} -> {rateArray.targetCurrencyName}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {exchangeRates.map((rateArray, index) =>
                      (<tr key={index}>
                        <td>{rateArray.date}</td>
                      {/*  <td>{rateArray.baseCurrencyName}</td>
                        <td>{(Math.round((rateArray.baseCurrencyValue + Number.EPSILON) * 100) / 100).toFixed(2)}</td>
                        <td>-</td>
                        <td>{rateArray.targetCurrencyName}:</td> */}
                        <td>{(Math.round((rateArray.targetCurrencyValue + Number.EPSILON) * 100) / 100).toFixed(2)}</td>
                      </tr>))}
                  </tbody>
                </Table>
              </>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;
