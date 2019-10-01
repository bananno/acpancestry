(() => {

test(t => {
  let date1, date2;

  t.setTitle('person age');

  date1 = null;
  date2 = null;
  t.assertEqual('age is null when either date is null',
    null,
    Person.age(date1, date2),
  );

  date1 = { year: 1900, month: 3, day: 10 };
  date2 = { year: 1900, month: 3, day: 11 };
  t.assertEqual('"1 day" when dates are exact',
    '1 day',
    Person.age(date1, date2),
  );

  date1 = { year: 1900, month: 3, day: 10 };
  date2 = { year: 1905, month: 3, day: 10 };
  t.assertEqual('"5 years" when full dates are exact',
    '5 years',
    Person.age(date1, date2),
  );

  date1 = { year: 1900, month: 3, day: 10 };
  date2 = { year: 1905, month: 3 };
  t.assertEqual('"5 years" when months are exact but day info is missing',
    '5 years',
    Person.age(date1, date2),
  );

  date1 = { year: 1900, month: 3, day: 10 };
  date2 = { year: 1905 };
  t.assertEqual('"5 years" when month info is missing',
    '5 years',
    Person.age(date1, date2),
  );

  date1 = { year: 1900, month: 3, day: 10 };
  date2 = { year: 1905, month: 6, day: 10 };
  t.assertEqual('"5 years, 3 months" when full dates are exact',
    '5 years, 3 months',
    Person.age(date1, date2),
  );

  date1 = { year: 1900, month: 3, day: 10 };
  date2 = { year: 1905, month: 6 };
  t.assertEqual('"5 years, 3 months" when months are exact but day info is missing',
    '5 years, 3 months',
    Person.age(date1, date2),
  );

  date1 = { year: 1900, month: 6, day: 10 };
  date2 = { year: 1905, month: 3, day: 10 };
  t.assertEqual('"4 years, 9 months" when full dates are exact',
    '4 years, 9 months',
    Person.age(date1, date2),
  );

  date1 = { year: 1900, month: 6, day: 10 };
  date2 = { year: 1905, month: 3 };
  t.assertEqual('"4 years, 9 months" when months are exact but day info is missing',
    '4 years, 9 months',
    Person.age(date1, date2),
  );

  date1 = { year: 1900, month: 6, day: 10 };
  date2 = { year: 1905, month: 3 };
  t.assertEqual('"4 years, 9 months" when months are exact but day info is missing',
    '4 years, 9 months',
    Person.age(date1, date2),
  );

  date1 = { year: 1900, month: 6, day: 10 };
  date2 = { year: 1910, month: 7 };
  t.assertEqual('"10 years"',
    '10 years',
    Person.age(date1, date2),
  );

});

})();
