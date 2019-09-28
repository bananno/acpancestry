test(t => {
  t.setTitle('helpers');
  t.setTitle2('string methods');

  t.assertEqual('"Children".singularize() = "Child"',
    'Child',
    'Children'.singularize()
  );

  t.assertEqual('"children".singularize() = "child"',
    'child',
    'children'.singularize()
  );

  t.assertEqual('"Child".pluralize() = "Children"',
    'Children',
    'Child'.pluralize()
  );

  t.assertEqual('"child".pluralize() = "children"',
    'children',
    'child'.pluralize()
  );

  t.assertEqual('"randomthings".singularize() = "randomthing"',
    'randomthing',
    'randomthings'.singularize()
  );

  t.assertEqual('"randomthing".pluralize() = "randomthings"',
    'randomthings',
    'randomthing'.pluralize()
  );

  t.assertEqual('"hello".capitalize() = "Hello"',
    'Hello',
    'hello'.capitalize()
  );
});
