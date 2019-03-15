const getCountries = async (currencyCode) => {
   try {
      const resp = await fetch(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      return data.map(country => ({ name: country.name, flag: country.flag }));
   } catch (err) {
      throw new Error(`Unable to get countries that use ${currencyCode}.`);
   }
};

export default getCountries;
