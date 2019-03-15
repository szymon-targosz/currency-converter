import React from 'react';
import { CSSTransition } from 'react-transition-group';
import classes from './Info.module.scss';

const Info = ({ from, to, result, amount, countries }) => {
   let ctrs = <li>{countries}</li>;

   if (typeof countries !== 'string') {
      ctrs = countries.map(ctr => (
         <li key={ctr.name}>
            <img src={ctr.flag} alt={`Flag - ${ctr.name}`} />
            {ctr.name}
         </li>
      ));
   }

   const label = typeof countries !== 'string' && <p>You can spend these in the following <strong>{countries.length > 1 ? 'countries' : 'country'}</strong>:</p>;

   return (
      <CSSTransition
         classNames={{
            appear: 'slide-in',
            appearActive: 'slide-in-active',
         }}
         timeout={500}
         in
         appear
      >
         <div className={classes.Info}>
            <div className={classes.Result}>
               <p>{amount} {from}</p>
               <span>&#61;</span>
               <p>{result} {to}</p>
            </div>
            <div className={classes.Countries}>
               {label}
               <ul>
                  {ctrs}
               </ul>
            </div>
         </div>
      </CSSTransition>
   );
};

export default Info;
