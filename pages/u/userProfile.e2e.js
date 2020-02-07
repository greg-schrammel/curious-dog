import { Selector } from 'testcafe';

fixture`TDD Day Homepage`.page('https://tddday.com');

test('Page should load and display the correct title', async t => {
  const actual = Selector('h1').innerText;
  const expected = 'TDD DAY 2019';
  await t.expect(actual).eql(expected);
});
