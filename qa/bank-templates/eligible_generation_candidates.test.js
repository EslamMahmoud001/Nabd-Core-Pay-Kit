'use strict';

process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

const appRoot = path.resolve(process.env.NABD_APP_ROOT || '');
if (!process.env.NABD_APP_ROOT) throw new Error('Set NABD_APP_ROOT to the current Nabd application clone');
process.chdir(appRoot);
const appRequire = createRequire(path.join(appRoot, 'package.json'));
const cds = appRequire('@sap/cds');
const { expect, data } = cds.test(appRoot);
const { asAhmed, seedPerson, seedEmployment } = appRequire('./test/_helpers');
const { INSERT } = cds.ql;

function candidate(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
}

async function seedCalendar(db, suffix) {
  const id = cds.utils.uuid();
  const calendarKey = `bank-${suffix}-${id.slice(0, 6)}`;
  await db.run(INSERT.into('nabd.pay.Calendars').entries({
    ID: id,
    isDeleted: false,
    calendarKey,
    displayNameEn: `Synthetic bank test ${suffix}`,
    frequency: 'monthly',
    cycleCutoffDay: 25,
    cycleDeliveryDay: 28,
    weekDefinition: 'sun_thu',
    sfPayGroup: `BANK-${suffix}`,
    country: 'EG',
    effectiveFrom: '2024-01-01',
    effectiveTo: '9999-12-31',
  }));
  return calendarKey;
}

async function seedEligibleCycle(db, suffix) {
  const calendarKey = await seedCalendar(db, suffix);
  const cycleId = cds.utils.uuid();
  await db.run(INSERT.into('nabd.pay.Cycles').entries({
    ID: cycleId,
    isDeleted: false,
    calendarKey,
    cycleKey: `${calendarKey}:2026-10`,
    cycleSeq: 1,
    cycleStart: '2026-10-01',
    cycleEnd: '2026-10-31',
    cutoffDate: '2026-10-25',
    payDate: '2026-10-29',
    status: 'approved',
  }));

  for (let index = 1; index <= 2; index += 1) {
    const personIdExternal = `SYN-${suffix}-${index}`;
    const person_ID = await seedPerson(db, { personIdExternal, displayName: `Synthetic Employee ${index}` });
    const employment_ID = await seedEmployment(db, { person_ID, paymentMethod: '05' });
    await db.run(INSERT.into('nabd.core.PersonBankAccounts').entries({
      ID: cds.utils.uuid(),
      isDeleted: false,
      employment_ID,
      accountNumber: `0012345678${index}`,
      bankName: suffix,
      routingNumber: index === 1 ? '12' : '345',
      currency: 'EGP',
      priority: 1,
    }));
    await db.run(INSERT.into('nabd.pay.DaybreakResults').entries({
      ID: cds.utils.uuid(),
      isDeleted: false,
      cycleId,
      personIdExternal,
      status: 'posted',
      isDryRun: false,
      runMode: 'actual',
      netPay: index === 1 ? 12345.67 : 8901.2,
      currency: 'EGP',
    }));
  }
  return cycleId;
}

const cases = [
  {
    file: 'cib-txt.candidate.json',
    suffix: 'CIB',
    params: { dateBlockDDMMYY: '291025291025', headerAccountBlock: '000000000000000000000000' },
    signature: null,
  },
  {
    file: 'hsbc-csv.candidate.json',
    suffix: 'HSBC',
    params: {
      debitAccount: '000000000001',
      firstPartyReference: 'Synthetic salary',
      secondPartyReference: 'Synthetic salary',
      paymentSetCode: 'D01',
      lccCbidCode: '11111111',
    },
    signature: null,
  },
  { file: 'credit-agricole-xlsx.candidate.json', suffix: 'CA', params: {}, signature: '504B' },
  { file: 'qnb-xlsx.candidate.json', suffix: 'QNB', params: { customerId: '1234567890' }, signature: '504B' },
];

describe('four bank candidates — eligible synthetic service generation', () => {
  let service;
  let db;

  before(async () => {
    service = await cds.connect.to('PayrollBankFileService');
    db = await cds.connect.to('db');
  });

  beforeEach(() => data.reset());

  for (const testCase of cases) {
    it(`${testCase.suffix} saves, generates and downloads through the current service`, async () => {
      const draft = candidate(testCase.file);
      const cycleId = await seedEligibleCycle(db, testCase.suffix);
      const saved = JSON.parse(await asAhmed(() => service.send('upsertTemplate', { payload: JSON.stringify(draft) })));
      expect(saved.ok, JSON.stringify(saved)).to.equal(true);

      const generated = JSON.parse(await asAhmed(() => service.send('generateBankFile', {
        cycleId,
        templateKey: draft.templateKey,
        confirm: true,
        params: JSON.stringify(testCase.params),
      })));
      expect(generated.ok, JSON.stringify(generated)).to.equal(true);
      expect(generated.recordCount).to.equal(2);

      const downloaded = JSON.parse(await asAhmed(() => service.send('downloadBankFile', { exportId: generated.exportId })));
      const bytes = Buffer.from(downloaded.fileBase64, 'base64');
      expect(bytes.length).to.be.greaterThan(0);
      if (testCase.signature) expect(bytes.subarray(0, 2).toString('hex').toUpperCase()).to.equal(testCase.signature);
    });
  }
});
