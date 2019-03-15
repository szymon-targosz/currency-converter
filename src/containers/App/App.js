import React from 'react';
import Form from '../Search/Search';
import Info from '../../components/Info/Info';
import Footer from '../../components/Footer/Footer';
import getExchangeRates from '../../helpers/rates';
import getCountries from '../../helpers/countries';

class App extends React.Component {
   state = { rates: null, from: null, to: null, amount: null, result: null, countries: null }

   componentDidMount() {
      getExchangeRates()
         .then(rates => this.setState({ rates }))
         .catch(err => this.setState({ error: err.message }));
   }

   calculateResult = (from, to, amount) => {
      const euro = 1 / this.state.rates[from];
      const rate = euro * this.state.rates[to];
      return (amount * rate).toFixed(2);
   }

   onFormSubmit = async (from, to, amount) => {
      const result = this.calculateResult(from, to, amount);
      this.setState({ from, to, amount, result });

      try {
         const countries = await getCountries(to);
         this.setState({ countries });
      } catch (err) {
         this.setState({ countries: err.message });
      }
   }

   render() {
      const { from, to, amount, result, error, countries } = this.state;
      return (
         <React.Fragment>
            {this.state.error && <p className="error">{error}</p>}
            <Form onSubmit={this.onFormSubmit} />
            {!!countries && <Info from={from} to={to} amount={amount} result={result} countries={countries} />}
            <Footer />
         </React.Fragment>
      );
   }
}

export default App;
