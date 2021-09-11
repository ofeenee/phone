import validator from 'validator';
const { isMobilePhone } = validator;

function validatePhone(string) {
  try {
    if (typeof string !== 'string' || !string) throw new Error('value is invalid.');
    return isMobilePhone(string, 'any', { strictMode: true });
  }
  catch (error) {
    throw error;
  }
}

import dotenv from 'dotenv';
dotenv.config();

const {
  TWILIO_ACCOUNT_SID: accountSid,
  TWILIO_AUTH_TOKEN: authToken,
  TWILIO_SERVICE_SID: serviceSid
} = process.env;

import twilio from 'twilio';
const client = twilio(accountSid, authToken);

function Phone() {
  try {
    if (new.target === undefined) return new Phone();
    let phone = null;
    let verified = false;


    return Object.defineProperties(this, {
      validate: {
        value: validatePhone,
        enumerable: true
      },
      phoneNumber: {
        set: function setPhoneNumber(string) {
          try {
            if (!validatePhone(string)) {
              throw new Error('phone value is invalid.');
            }
            else if (string === phone) {
              return phone;
            }
            else {
              phone = string;
              return phone;
            }

          } catch (error) {
            throw error;
          }
        },
        get: function getPhoneNumber() {
          if (phone) return phone;
          else return null;
        },
        enumerable: true
      },
      verified: {
        set: function (boolean) {
          try {
            if (typeof boolean !== 'string' || !boolean) throw new Error('value is invalid.');

            if (boolean === verified) {
              return verified;
            }
            else {
              verified = boolean;
              return verified;
            }
          }
          catch (error) {
            throw error;
          }
        },
        get: function () {
          if (typeof verified === 'boolean') return verified;
          else return null;
        },
        enumerable: true
      },
      verifySMS: {
        value: async function sendPhoneVerificationCodeBySMS() {
          try {
            if (!phone) throw new Error('phone is not yet set.');

            const verification = await client.verify.services(serviceSid)
              .verifications
              .create({ to: phone, channel: 'sms' });

            return verification;

          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      verifyCall: {
        value: async function sendPhoneVerificationCodeByCall() {
          try {
            if (!phone) throw new Error('phone is not yet set.');

            const verification = await client.verify.services(serviceSid)
              .verifications
              .create({ to: phone, channel: 'call' });

            return verification;

          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      confirm: {
        value: async function confirmPhoneVerificationCode(code) {
          try {
            if (!code) throw new Error('value is invalid.');

            const verification = await client.verify.services(serviceSid)
              .verificationChecks
              .create({ to: phone, code });

            const { valid } = verification;
            if (valid) verified = true;
            return verification;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      }
    });
  }
  catch (error) {
    throw error;
  }
}

export default Phone;