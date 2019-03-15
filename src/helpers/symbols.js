import { getItem, storeItem } from './storage';

const transformSymbols = (data) => {
   const symbols = [];
   Object.keys(data).forEach((key) => {
      symbols.push({ symbol: key, label: data[key] });
   });
   return symbols;
};

const getSymbols = async () => {
   let symbols = getItem('symbols');
   if (symbols) return symbols;

   try {
      const response = await fetch('http://data.fixer.io/api/symbols?access_key=fdea14cc13cfa9510f49bb3a64138855');

      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!data.success) throw new Error();

      symbols = transformSymbols(data.symbols);
      storeItem('symbols', symbols);

      return symbols;
   } catch (error) {
      throw new Error('Unable to fetch currency symbols.');
   }
};

export default getSymbols;
