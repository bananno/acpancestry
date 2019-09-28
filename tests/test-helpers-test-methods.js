
test(t => {
  let obj1, obj2, arr1, arr2;

  t.setTitle('helpers');
  t.setTitle2('comparison for tests');

  obj1 = { a: 'one', b: 'two' };
  obj2 = { b: 'two', a: 'one' };
  t.assertTrue('two objects with the same keys in different order are equal',
    areValuesEqual(obj1, obj2)
  );

  obj1 = { a: 'one', b: 'two' };
  obj2 = { a: 'three', b: 'four' };
  t.assertFalse('two objects with the same keys but different values are not equal',
    areValuesEqual(obj1, obj2)
  );

  arr1 = [obj1, obj2];
  arr2 = [obj1, obj2];
  t.assertTrue('two arrays holding the same objects in the same order are equal',
    areValuesEqual(arr1, arr2)
  );

});
