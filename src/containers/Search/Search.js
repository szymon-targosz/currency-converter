import React, { Component } from 'react';
import moment from 'moment';
import Autosuggest from 'react-autosuggest';
import { CSSTransition } from 'react-transition-group';
import getSymbols from '../../helpers/symbols';
import classes from './Search.module.scss';
import './autosuggest.css';

export default class Form extends Component {
   state = { from: '', to: '', amount: 1, symbols: [], suggestions: [], date: moment(), error: false }

   componentDidMount() {
      getSymbols()
         .then(symbols => this.setState({ symbols }))
         .catch(err => this.setState({ error: err.message }));

      this.interval = setInterval(() => {
         this.setState({ date: moment() });
      }, 1000);
   }

   componentWillUnmount() {
      clearInterval(this.interval);
   }

   // AUTOSUGGESTION
   getSuggestions = (value) => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;
      return inputLength === 0 ? [] : this.state.symbols.filter(currency => currency.symbol.toLowerCase().slice(0, inputLength) === inputValue);
   }

   getSuggestionValue = suggestion => suggestion.symbol;

   renderSuggestion = suggestion => (
      <div>
         {suggestion.symbol} ({suggestion.label})
      </div>
   );

   onSuggestionsFetchRequested = ({ value }) => {
      this.setState({
         suggestions: this.getSuggestions(value)
      });
   };

   onSuggestionsClearRequested = () => {
      this.setState({
         suggestions: []
      });
   };

   onChangeFrom = (e, { newValue }) => {
      this.setState({
         from: newValue.toUpperCase()
      });
   };

   onChangeTo = (e, { newValue }) => {
      this.setState({
         to: newValue.toUpperCase()
      });
   };

   onChangeAmount = (e) => {
      this.setState({
         amount: e.target.value
      });
   }

   renderInputComponent = inputProps => (
      <div>
         <input {...inputProps} />
         <label htmlFor={inputProps.id} className={classes.FormLabel}>{inputProps.placeholder}</label>
      </div>
   );

   getInputProps = (field = 'amount') => {
      const props = {
         placeholder: this.capitalize(field),
         value: this.state[field],
         onChange: this.onChangeFrom,
         name: field,
         id: field
      };
      switch (field) {
         case 'from':
            props.onChange = this.onChangeFrom;
            break;
         case 'to':
            props.onChange = this.onChangeTo;
            break;
         default:
            props.type = 'number';
            props.min = '0';
            props.onChange = this.onChangeAmount;
            break;
      }
      return props;
   };

   // SUBMIT
   checkSymbolValidity = sym => this.state.symbols.findIndex(currency => currency.symbol === sym) > -1;

   submitHandler = (e) => {
      e.preventDefault();
      const { from, to, amount } = this.state;
      if (this.checkSymbolValidity(from) && this.checkSymbolValidity(to)) {
         this.setState({ error: null, from: '', to: '', amount: 1 });
         this.props.onSubmit(from, to, amount);
      } else {
         this.setState({ error: true });
      }
   }

   capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
   }

   render() {
      return (
         <div className={classes.Search}>
            <form className={classes.Form} onSubmit={this.submitHandler}>
               <header className={classes.Header}>{this.state.date.format('MMM D, YYYY')}</header>
               <h1>Currency Converter</h1>
               <div className={classes.FormGroup}>
                  <Autosuggest
                     suggestions={this.state.suggestions}
                     onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                     onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                     getSuggestionValue={this.getSuggestionValue}
                     renderSuggestion={this.renderSuggestion}
                     inputProps={this.getInputProps('from')}
                     renderInputComponent={this.renderInputComponent}
                  />
               </div>
               <div className={classes.FormGroup}>
                  <Autosuggest
                     suggestions={this.state.suggestions}
                     onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                     onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                     getSuggestionValue={this.getSuggestionValue}
                     renderSuggestion={this.renderSuggestion}
                     inputProps={this.getInputProps('to')}
                     renderInputComponent={this.renderInputComponent}
                  />
               </div>
               <div className={classes.FormGroup}>
                  {this.renderInputComponent(this.getInputProps())}
               </div>
               <div className={classes.FormFooter}>
                  <CSSTransition
                     in={this.state.error}
                     timeout={200}
                     classNames={{ enterActive: 'show-error', exit: '', exitActive: 'hide-error' }}
                     mountOnEnter
                     unmountOnExit
                  >
                     <p className="error">Please enter the correct currency codes</p>
                  </CSSTransition>
                  <input type="submit" value="Convert" />
               </div>
            </form>
         </div>
      );
   }
}
