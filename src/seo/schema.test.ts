import assert from 'node:assert/strict';
import test from 'node:test';

import {
  aboutJsonLd,
  homeJsonLd,
  resumeJsonLd,
  type JsonLd,
} from './schema.ts';
import { PERSON_ID, absoluteUrl } from './site.ts';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function graph(jsonLd: JsonLd): JsonLd[] {
  const items = jsonLd['@graph'];
  assert.ok(Array.isArray(items), 'expected an @graph array');
  return items as JsonLd[];
}

function hasType(item: JsonLd, expected: string): boolean {
  const type = item['@type'];
  return type === expected || (Array.isArray(type) && type.includes(expected));
}

function personFrom(items: JsonLd[]): JsonLd {
  const person = items.find((item) => item['@id'] === PERSON_ID);
  assert.ok(person, 'canonical Person node is missing');
  return person;
}

function subjectOf(person: JsonLd): JsonLd[] {
  const items = person.subjectOf;
  assert.ok(Array.isArray(items), 'Person.subjectOf must be an array');
  return items as JsonLd[];
}

test('about exposes one authoritative ProfilePage node', () => {
  const items = graph(aboutJsonLd());
  const url = absoluteUrl('/about');
  const pageId = `${url}#webpage`;
  const profilePages = items.filter((item) => hasType(item, 'ProfilePage'));

  assert.equal(profilePages.length, 1);
  const page = profilePages[0];
  assert.equal(page['@id'], pageId);
  assert.equal(page.url, url);
  assert.ok(hasType(page, 'WebPage'));
  assert.ok(hasType(page, 'AboutPage'));
  assert.deepEqual(page.mainEntity, { '@id': PERSON_ID });
  assert.match(String(page.dateModified), ISO_DATE);

  const references = subjectOf(personFrom(items));
  assert.equal(references.filter((item) => hasType(item, 'ProfilePage')).length, 0);
  assert.ok(references.some((item) => item['@id'] === pageId));
});

test('resume uses one canonical WebPage without a competing ProfilePage item', () => {
  const items = graph(resumeJsonLd());
  const url = absoluteUrl('/resume');
  const pages = items.filter((item) => item.url === url && hasType(item, 'WebPage'));

  assert.equal(pages.length, 1);
  assert.equal(items.filter((item) => hasType(item, 'ProfilePage')).length, 0);
  assert.deepEqual(pages[0].mainEntity, { '@id': PERSON_ID });
});

test('shared Person schema does not embed incomplete third-party ProfilePage nodes', () => {
  const references = subjectOf(personFrom(graph(homeJsonLd())));

  assert.equal(references.filter((item) => hasType(item, 'ProfilePage')).length, 0);
  assert.ok(references.some((item) => item['@id'] === `${absoluteUrl('/about')}#webpage`));
});
