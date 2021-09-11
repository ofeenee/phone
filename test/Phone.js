
import { assert } from 'chai';
import Phone from '../Phone.js';
import validator from 'validator';

const validPhoneNumber = '+96555968743';
const invalidPhoneNumber = '96555968743';
const phoneToTest = process.env.phone;


describe('Phone.validate():', function () {
  const phone = new Phone();
  it(`validate(${validPhoneNumber}) to return true`, function () {
    try {
      assert.isTrue(phone.validate(validPhoneNumber));
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
  it(`validate(${invalidPhoneNumber}) to return false`, function () {
    try {
      assert.isFalse(phone.validate(invalidPhoneNumber));
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
});

describe(`new Phone()`, function () {
  const phone = new Phone();
  it(`create successful instance of the class Phone() = "phone"`, function () {
    try {
      assert.instanceOf(phone, Phone);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`the property phoneNumber of the Phone instance "phone" should return null`, function () {
    try {
      assert.isNull(phone.phoneNumber);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`assign (${validPhoneNumber}) to phoneNumber property of the Phone instance "phone" (successfully)`, function () {
    try {
      phone.phoneNumber = validPhoneNumber;
      assert.equal(phone.phoneNumber, validPhoneNumber);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`assign (${invalidPhoneNumber}) to phoneNumber property of the Phone instance "phone" (throws error)`, function () {
    try {
      phone.phoneNumber = invalidPhoneNumber;
      assert.fail('phone value is invalid, therefore should have thrown an error.');
    } catch (error) {
      assert.instanceOf(error, Error);
      assert.strictEqual(error.message, 'phone value is invalid.');
    }
  });
  it(`phoneNumber property of the Phone instance "phone" should return ${validPhoneNumber}`, function () {
    try {
      assert.strictEqual(phone.phoneNumber, validPhoneNumber);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
});

if (phoneToTest) {
  describe(`Testing passed phone address: ${phoneToTest}`, function () {
    const phone = new Phone();
    const validatePhone = validator.isMobilePhone(phoneToTest, 'any', {strictMode: true});


    // check to see if phone is an instance of the class Phone
    it(`new Phone()`, function () {
      try {
        assert.instanceOf(phone, Phone);
      }
      catch (error) {
        assert.fail(error.message);
      }
    });

    if (validatePhone) {
      // test validate() static method on Phone
      it(`validate(${phoneToTest}) to return true`, function () {
        try {
          const valid = phone.validate(phoneToTest);
          assert.isTrue(valid);
          assert.strictEqual(valid, validatePhone);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
      // try to set the address value to the Phone instance
      it(`assign (${phoneToTest}) to phoneNumber property`, function () {
        try {
          phone.phoneNumber = phoneToTest;
          assert.strictEqual(phone.phoneNumber, phoneToTest);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
      // try to get the address value from the instance phone
      it(`phoneNumber property should return ${phoneToTest}`, function () {
        try {
          assert.strictEqual(phone.phoneNumber, phoneToTest);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });


      if (process.env.code) {
        it(`confirm verification phone to ${phoneToTest}`, async function () {
          try {
            const verification = await phone.confirm(process.env.code);
            assert.isDefined(verification);
            assert.strictEqual(verification.status, 'approved');
            assert.strictEqual(verification.to, phone.phoneNumber);
            assert.isTrue(verification.valid);
            assert.isTrue(phone.verified);

          } catch (error) {
            assert.fail(error.message);
          }
        }).timeout(10000);
      }
      else {
        it(`send verification phone to ${phoneToTest}`, async function () {
          try {
            const verification = await phone.verifySMS();

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
            assert.strictEqual(verification.to, phone.phoneNumber);
            assert.isFalse(verification.valid);
            assert.isFalse(phone.verified);

          } catch (error) {
            assert.fail(error.message);
          }
        }).timeout(10000);
      }

      it(`assign (${validPhoneNumber}) to phoneNumber property to update (successfully)`, function () {
        try {
          phone.phoneNumber = validPhoneNumber;
          assert.strictEqual(phone.phoneNumber, validPhoneNumber);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`assign (${invalidPhoneNumber}) to phoneNumber property to update (throws error)`, function () {
        try {
          phone.phoneNumber = invalidPhoneNumber;
          assert.fail('phone value is invalid, therefore should have thrown an error.');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'phone value is invalid.');
        }
      });

      it(`retrieve (${validPhoneNumber}) from the phoneNumber property (last valid assignment)`, function () {
        try {
          assert.strictEqual(phone.phoneNumber, validPhoneNumber);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

    }
    else {
      it(`validate(${phoneToTest}) to return false (invalid)`, function () {
        try {
          assert.isFalse(phone.validate(phoneToTest));
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`assign (${phoneToTest}) to property phoneNumber property should fail and throw an error`, function () {
        try {
          phone.phoneNumber = phoneToTest;
          assert.fail('phone value is invalid, therefore should have thrown an error.');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'phone value is invalid.');
        }
      });

      it(`phoneNumber property should return null`, function () {
        assert.isNull(phone.phoneNumber);
      });
    }
  });
}