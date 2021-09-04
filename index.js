import isMobilePhone from 'validator/lib/isMobilePhone.js';

class Phone {
  #phone;

  constructor(phone) {
    try {
      if (isMobilePhone(phone, 'any', {strictMode: true})) {
        this.#phone = phone;
      }
      else {
        throw new Error('Phone value is invalid.');
      }

    }
    catch (error) {
      throw error;
    }
  }

  static validate(phone) {
    if (!isMobilePhone(phone, 'any', {strictMode: true})) {
      throw new Error('Phone value is invalid.');
    }
    else {
      return true;
    }
  }

  update(phone) {
    try {
      if (isMobilePhone(phone, 'any', {strictMode: true}) && phone !== this.#phone) {
        this.#phone = phone;
      }
      else if (this.#phone === phone) {
        throw new Error('update is not necessary.');
      }
      else {
        throw new Error('Phone value is invalid.');
      }
    }
    catch (error) {
      throw error;
    }
  }

  get() {
    try {
      return this.#phone;
    }
    catch (error) {
      throw error;
    }
  }
}

export default Phone;