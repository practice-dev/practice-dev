import https from 'https';
import qs from 'querystring';
import http from 'http';

export function checkHasSelectorMatches(
  document: Document,
  input: string,
  text: string | number,
  exact: boolean
) {
  const elements = document.querySelectorAll(input);
  if (elements.length !== 1) {
    return false;
  }
  const element = elements[0];
  const getInputValue = () => {
    const input = element as HTMLInputElement;
    if (input.getAttribute('type') === 'number') {
      return input.valueAsNumber;
    }
    return input.value;
  };
  const textContent =
    element.tagName.toLowerCase() === 'input'
      ? getInputValue()
      : element.tagName.toLowerCase() === 'select'
      ? (element as HTMLSelectElement).value
      : (element as HTMLDivElement).innerText || '';
  if (typeof text === 'number') {
    return text === Number(textContent);
  }
  if (typeof textContent === 'number') {
    if (text === '' && isNaN(textContent)) {
      return true;
    }
    return Number(text) === textContent;
  }
  return exact ? textContent === text : textContent.includes(text);
}

export function getSelectorMatchResult(document: Document, input: string) {
  const elements = document.querySelectorAll(input);
  if (elements.length !== 1) {
    return { error: 'multiple' as 'multiple', count: elements.length };
  }
  const element = elements[0];
  return element.tagName.toLowerCase() === 'input'
    ? (element as HTMLInputElement).value
    : element.tagName.toLowerCase() === 'select'
    ? (element as HTMLSelectElement).value
    : (element as HTMLDivElement).innerText || '';
}

export interface MakeUrlOptions {
  baseUrl: string;
  path: string;
  query?: any;
  params?: any;
}

export function makeUrl(options: MakeUrlOptions) {
  const { baseUrl, path, query, params } = options;
  let url = `${baseUrl}${path}`;
  if (params) {
    Object.entries(params).forEach(([name, value]) => {
      url = url.replace(':' + name, encodeURIComponent(String(value)));
    });
  }
  if (query && Object.keys(query).length) {
    url += '?' + qs.stringify(query);
  }

  return url;
}

export function getRequest(url: string) {
  if (url.startsWith('http://')) {
    return http.request.bind(http);
  }
  if (url.startsWith('https://')) {
    return https.request.bind(https);
  }
  throw new Error('Not supported protocol');
}

export function tryParse(data: any) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

export function isPuppeteerTimeout(error: Error) {
  return error.constructor.name === 'TimeoutError';
}
