import CryptoJS from "crypto-js";

export const getSharedKey = (userId, targetUserId) => {
  return CryptoJS.SHA256([userId, targetUserId].sort().join("#SECRET_SALT$"))
    .toString()
    .substring(0, 32);
};

export const encryptMessage = (plainText, key) => {
  return CryptoJS.AES.encrypt(plainText, key).toString();
};

export const decryptMessage = (cipherText, key) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
