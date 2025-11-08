// Fallback QRIS String (akan di-override oleh hasil extract dari gambar URL)
// QRIS otomatis di-extract dari gambar saat aplikasi pertama kali load

export const FALLBACK_QRIS_STRING =
  '00020101021226670016COM.NOBUBANK.WWW01189360050300000898530214994000009284900303UMI51440014ID.CO.QRIS.WWW0215ID10220667076460303UMI5204839953033605802ID5920Toko Elektronik Jaya6015JAKARTA SELATAN61051234062070703A016304CCDA';

export const getQRISString = (): string => {
  if (typeof window !== 'undefined') {
    const cachedQRIS = localStorage.getItem('QRIS_STRING');
    if (cachedQRIS) {
      return cachedQRIS;
    }
  }
  return FALLBACK_QRIS_STRING;
};
