import validator from 'validator';
const {isMobilePhone} = validator;

import dotenv from 'dotenv';
dotenv.config();

const {
  TWILIO_ACCOUNT_SID: accountSid,
  TWILIO_AUTH_TOKEN: authToken,
  TWILIO_SERVICE_SID: serviceSid
} = process.env;

import twilio from 'twilio';
const client = twilio(accountSid, authToken);

class Phone {
  #phone;
  #verified = false;

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

  async sendSMSPhoneVerification() {
    try {
      const verification = await client.verify.services(serviceSid)
        .verifications
        .create({ to: this.#phone, channel: 'sms' });

      return verification;

    }
    catch (error) {
      console.log(error.message);
    }
  }
  async sendVoiceCallPhoneVerification() {
    try {
      const verification = await client.verify.services(serviceSid)
        .verifications
        .create({ to: this.#phone, channel: 'call' });

      return verification;

    }
    catch (error) {
      console.log(error.message);
    }
  }
  async confirmPhoneVerification(code) {
    try {
      const verification = await client.verify.services(serviceSid)
        .verificationChecks
        .create({ to: this.#phone, code });

      const { valid } = verification;
      if (valid) this.#verified = true;
      return verification;

    }
    catch (error) {
      console.log(error.message);
    }
  }

  isVerified() {
    return this.#verified;
  }
}


export default Phone;