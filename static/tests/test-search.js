
test(t => {
  let obj1, obj2, arr1, arr2;

  t.setTitle('search functionality');
  t.setTitle2('compare values');

  obj1 = { a: 'one', b: 'two' };
  obj2 = { b: 'two', a: 'one' };
  t.assertEqual('two objects with the same keys in different order are equal',
    true,
    areValuesEqual(obj1, obj2)
  );

  obj1 = { a: 'one', b: 'two' };
  obj2 = { a: 'three', b: 'four' };
  t.assertEqual('two objects with the same keys but different values are not equal',
    false,
    areValuesEqual(obj1, obj2)
  );

  arr1 = [obj1, obj2];
  arr2 = [obj1, obj2];
  t.assertEqual('two arrays holding the same objects in the same order are equal',
    true,
    areValuesEqual(arr1, arr2)
  );

});
