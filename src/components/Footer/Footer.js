import React from 'react';
import classes from './Footer.module.scss';

const Footer = () => (
   <div className={classes.Footer}>
      {new Date().getFullYear()} &mdash; Currency Converter
   </div>
);

export default Footer;
