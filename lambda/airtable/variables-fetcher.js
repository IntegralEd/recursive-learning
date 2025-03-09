async function getClientVariables(tableID) {
  const airtableApiKey = 'YOUR_AIRTABLE_API_KEY';
  const baseID = 'appqFjYLZiRlgZQDM';
  const url = `https://api.airtable.com/v0/${baseID}/${tableID}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${airtableApiKey}`,
    },
  });
  const data = await response.json();

  const variables = {};
  data.records.forEach(record => {
    const name = record.fields.Name;
    const value = record.fields.Value;
    variables[name] = value;
  });

  // Apply CSS variables dynamically
  applyVariables(variables);

  return variables;
}

function applyVariables(variables) {
  const root = document.documentElement;
  Object.keys(variables).forEach(key => {
    root.style.setProperty(`--${key}`, variables[key]);
  });
}

export { getClientVariables }; 