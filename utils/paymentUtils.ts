import { getQRISString } from '../config/qrisConfig';

const crc16 = (str: string): string => {
  let crc = 0xFFFF;
  const strlen = str.length;
  for (let c = 0; c < strlen; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  const hex = (crc & 0xFFFF).toString(16).toUpperCase();
  return hex.padStart(4, '0');
};

export const generateUniqueCode = (residentId: string): number => {
  let sum = 0;
  for (let i = 0; i < residentId.length; i++) {
    sum += residentId.charCodeAt(i);
  }
  const uniqueCode = (sum % 900) + 100;
  return uniqueCode;
};

export const calculateTotalWithUniqueCode = (
  baseAmount: number,
  residentId: string
): number => {
  const uniqueCode = generateUniqueCode(residentId);
  return baseAmount + uniqueCode;
};

export const makeDemoPayload = (
  residentId: string,
  amount: number
): string => {
  const totalAmount = calculateTotalWithUniqueCode(amount, residentId);
  const qrisString = getQRISString();

  if (qrisString.length < 4) {
    throw new Error('Invalid QRIS data.');
  }

  const qrisWithoutCrc = qrisString.substring(0, qrisString.length - 4);
  const step1 = qrisWithoutCrc.replace('010211', '010212');

  const parts = step1.split('5802ID');
  if (parts.length !== 2) {
    throw new Error("QRIS data is not in the expected format (missing '5802ID').");
  }

  const amountStr = String(totalAmount);
  const amountTag = '54' + String(amountStr.length).padStart(2, '0') + amountStr;

  const payload = [parts[0], amountTag, '5802ID', parts[1]].join('');

  const finalCrc = crc16(payload);
  return payload + finalCrc;
};

export const generateTransactionId = (): string => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
