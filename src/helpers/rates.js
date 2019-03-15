import { getItem, storeItem } from './storage';

const isStillValid = (tmp) => {
   if ((Date.now() - (tmp * 1000)) / 1000 < 3600) return true;
   return false;
};

const getExchangeRates = async () => {
   const ratesData = getItem('ratesData');
   if (ratesData && isStillValid(ratesData.tmp)) return ratesData.rates;

   try {
      const response = await fetch(`http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_KEY}&format=1`);
      if (!response.ok) throw new Error();

      const data = await response.json();

      if (!data.success) throw new Error();
      storeItem('ratesData', { tmp: data.timestamp, rates: data.rates });

      return data.rates;
   } catch (error) {
      throw new Error('Unable to fetch exchange rates.');
   }
};

export default getExchangeRates;
