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

function Phone(verified = false) {
  try {
    if (new.target === undefined) return new Phone(verified);

    return Object.defineProperties(this, {
      phone: {
        value: null,
        configurable: true
      },
      verified: {
        value: verified,
        configurable: true
      },
      set: {
        value: (string) => {
          try {
            if (!validatePhone(string)) {
              throw new Error('phone value is invalid.');
            }
            else if (string === this.phone) {
              return this.phone;
            }
            else {
              // if set() was the first assignment (ie from database);
              // we'd want to set verified as it is fetched from the db
              // otherwise, any other phone change should set verified
              // back to false to require a re-verification
              if (this.get() === null) {
                Object.defineProperty(this, 'verified', {
                  value: verified,
                  configurable: true
                });
              }
              else {
                Object.defineProperty(this, 'verified', {
                  value: false,
                  configurable: true
                });
              }

              Object.defineProperty(this, 'phone', {
                value: string,
                configurable: true
              });

              return this.phone;
            }

          } catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      get: {
        value: () => {
          if (this.phone) return this.phone;
          else return null;
        },
        enumerable: true
      },
      validate: {
        value: validatePhone,
        enumerable: true
      },
      verification: {
        value: Object.defineProperties({}, {
          sendCodeSMS: {
            value: async () => {
              try {
                if (!this.phone) throw new Error('phone is not yet set.');

                const verification = await client.verify.services(serviceSid)
                  .verifications
                  .create({ to: this.phone, channel: 'sms' });

                return verification;

              }
              catch (error) {
                throw error;
              }
            },
            enumerable: true
          },
          sendCodeCall: {
            value: async () => {
              try {
                if (!this.phone) throw new Error('phone is not yet set.');

                const verification = await client.verify.services(serviceSid)
                  .verifications
                  .create({ to: this.phone, channel: 'call' });

                return verification;

              }
              catch (error) {
                throw error;
              }
            },
            enumerable: true
          },
          confirmCode: {
            value: async (code) => {
              try {
                if (typeof code !== 'string' || !code) throw new Error('value is invalid.');

                const verification = await client.verify.services(serviceSid)
                  .verificationChecks
                  .create({ to: this.phone, code });

                const { valid } = verification;
                if (valid) {
                  Object.defineProperty(this, 'verified', {
                    value: true,
                    configurable: true
                  });

                };
                return verification;
              }
              catch (error) {
                throw error;
              }
            },
            enumerable: true
          }
        })
      },
      isVerified: {
        value: () => {
          if (typeof this.verified === 'boolean') return this.verified;
          else return null;
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