
var faker = require('faker');

var SIZE = 2000;
var _cache = [];

function createFakeRowObjectData(/*number*/ index) {
  return {
    id: 'id_' + index,
    avartar: faker.image.avatar(),
    city: faker.address.city(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    street: faker.address.streetName(),
    zipCode: faker.address.zipCode(),
    date: faker.date.past(),
    bs: faker.company.bs(),
    catchPhrase: faker.company.catchPhrase(),
    companyName: faker.company.companyName(),
  };
}

function getObjectAt(/*number*/ index) /*?object*/ {
  if (_cache[index] === undefined && index >= 0 && index <= SIZE) {
    _cache[index] = createFakeRowObjectData(index);
  }
  return _cache[index];
}

function getSize() {
  return SIZE;
}

var FakeObjectDataListStore = {
  getObjectAt: getObjectAt,
  getSize: getSize,
};

module.exports = FakeObjectDataListStore;
