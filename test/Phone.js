
import { assert } from 'chai';
import Phone from '../Phone.js';
import validator from 'validator';

const validPhoneNumber = '+96555968743';
const invalidPhoneNumber = '96555968743';
const phoneToTest = process.env.phone;


describe('Phone.validate():', function () {

  it(`validate(${validPhoneNumber}) to return true`, function () {
    assert.isTrue(validator.isMobilePhone(validPhoneNumber, 'any', {strictMode: true}));
    assert.isTrue(Phone.validate(validPhoneNumber));
    assert.strictEqual(Phone.validate(validPhoneNumber), validator.isMobilePhone(validPhoneNumber, 'any', {strictMode: true}));
  });
  it(`validate(${invalidPhoneNumber}) to return false`, function () {
    assert.isFalse(validator.isMobilePhone(invalidPhoneNumber, 'any', {strictMode: true}));
    assert.isFalse(Phone.validate(invalidPhoneNumber));
    assert.strictEqual(Phone.validate(invalidPhoneNumber), validator.isMobilePhone(invalidPhoneNumber, 'any', {strictMode: true}));
  });
});

describe(`new Phone()`, function () {
  const phone = new Phone();
  it(`successful instance of the class Phone()`, function () {
    assert.instanceOf(phone, Phone);
  });

  it(`get() should return null`, function () {
    assert.isNull(phone.get());
  });

  it(`set(${validPhoneNumber}) to phone instance (successfully)`, function () {
    assert.equal(phone.set(validPhoneNumber), validPhoneNumber);
  });

  it(`set(${invalidPhoneNumber}) to phone instance (throws error)`, function () {
    try {
      phone.set(invalidPhoneNumber);
      assert.fail('phone value is invalid, therefore should have thrown an error.');
    } catch (error) {
      assert.instanceOf(error, Error);
      assert.strictEqual(error.message, 'phone value is invalid.');
    }
  });
  it(`get() value of phone instance to return ${validPhoneNumber}`, function () {
    assert.strictEqual(phone.get(), validPhoneNumber);
  });



});

if (phoneToTest) {


  describe(`Testing passed phone address: ${phoneToTest}`, function () {
    const phone = new Phone();
    const validatePhone = validator.isMobilePhone(phoneToTest, 'any', {strictMode: true});


    // check to see if phone is an instance of the class Phone
    it(`new Phone()`, function () {
      assert.instanceOf(phone, Phone);
    });

    if (validatePhone) {
      // test validate() static method on Phone
      it(`validate(${phoneToTest}) to return true`, function () {
        const valid = Phone.validate(phoneToTest);
        assert.isTrue(valid);
        assert.strictEqual(valid, validatePhone);
      });
      // try to set the address value to the Phone instance
      it(`set(${phoneToTest}) to Phone instance`, function () {
        assert.strictEqual(phone.set(phoneToTest), phoneToTest);
      });
      // try to get the address value from the instance phone
      it(`get() instance method to return ${phoneToTest}`, function () {
        assert.strictEqual(phone.get(), phoneToTest);
      });

      if (process.env.code) {
        it(`confirm verification phone to ${phoneToTest}`, async function () {
          try {
            const verification = await phone.confirmPhoneVerification(process.env.code);
            assert.isDefined(verification);
            assert.strictEqual(verification.status, 'approved');
            assert.strictEqual(verification.to, phone.get());
            assert.isTrue(verification.valid);
            assert.isTrue(phone.isVerified());

          } catch (error) {
            assert.fail(error.message);
          }
        });
      }
      else {
        it(`send verification phone to ${phoneToTest}`, async function () {
          try {
            const verification = await phone.sendSMSPhoneVerification();

            // const {sid, status, valid, sendCodeAttempts} = verification;
            // console.log({sid, status, valid, sendCodeAttempts});

            assert.isDefined(verification);
            assert.containsAllKeys(verification, [
              'sid',
              'serviceSid',
              'accountSid',
              'to',
              'channel',
              'status',
              'valid',
            ]);
            assert.strictEqual(verification.status, 'pending');
            assert.strictEqual(verification.to, phone.get());
            assert.isFalse(verification.valid);
            assert.isFalse(phone.isVerified());

          } catch (error) {
            assert.fail(error.message);
          }
        });
      }

      it(`set(${validPhoneNumber}) of Phone instance to update (successfully)`, function () {
        assert.strictEqual(phone.set(validPhoneNumber), validPhoneNumber);
      });
      it(`set(${invalidPhoneNumber}) of Phone instance to update (throws error)`, function () {
        try {
          phone.set(invalidPhoneNumber);
          assert.fail('phone value is invalid, therefore should have thrown an error.');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'phone value is invalid.');
        }
      });
      // try to get the address value from the instance phone
      it(`get() instance method to return ${validPhoneNumber} (last valid value)`, function () {
        assert.strictEqual(phone.get(), validPhoneNumber);
      });

    }
    else {
      it(`validate(${phoneToTest}) to return false (invalid)`, function () {
        assert.isFalse(Phone.validate(phoneToTest));
      });
      it(`set(${phoneToTest}) should fail and throw an error`, function () {
        try {
          phone.set(phoneToTest);
          assert.fail('phone value is invalid, therefore should have thrown an error.');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'phone value is invalid.');
        }
      });
      it(`get() should return null`, function () {
        assert.isNull(phone.get());
      });
    }
  });
}