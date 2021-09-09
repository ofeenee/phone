import validator from 'validator';
const {isMobilePhone} = validator;


class Phone {
  #phone;

  constructor() {
    try {
      this.#phone = null;
    }
    catch (error) {
      throw error;
    }
  }

  static validate(phone) {
    if (isMobilePhone(phone, 'any', {strictMode: true})) return true;
    else return false;
  }


  set(phone) {
    try {
      if (!isMobilePhone(phone, 'any', { strictMode: true })) {
        throw new Error('phone value is invalid.');
      }
      else if (phone === this.#phone) {
        return this.#phone;
      }
      else {
        this.#phone = phone;
        return this.#phone;
      }
    }
    catch (error) {
      throw error;
    }
  }

  get() {
    try {
      if (this.#phone) return this.#phone;
      else return null;
    }
    catch (error) {
      throw error;
    }
  }
}


export default Phone;