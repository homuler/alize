'use strict';

export default function lazyRESTGenerator(template) {
  return function rest(baseUrl) {
    return {
      ...template.get(baseUrl),
      ...template.put(baseUrl),
      ...template.post(baseUrl),
      ...template.patch(baseUrl),
      ...template.delete(baseUrl),
    };
  };
}
