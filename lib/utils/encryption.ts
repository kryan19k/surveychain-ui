import CryptoJS from 'crypto-js';

// Define a type for the answers
type Answer = string | number | string[];

export const encryptAnswers = (answers: Answer[], privateKey: string): string => {
  try {
    const answersString = JSON.stringify(answers);
    console.log('Answers before encryption:', answersString);
    const encrypted = CryptoJS.AES.encrypt(answersString, privateKey).toString();
    console.log('Encrypted answers:', encrypted);
    return encrypted;
  } catch (error) {
    console.error('Error encrypting answers:', error);
    throw new Error('Failed to encrypt answers');
  }
};

export function decryptAnswers(encryptedData: string, key: string): string {
  try {
    if (!encryptedData) {
      console.error("Encrypted data is empty");
      return "";
    }
    
    console.log("Encrypted data:", encryptedData);
    console.log("Decryption key:", key);
    
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    console.log("Decrypted bytes:", bytes.toString());
    
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      console.error("Decryption resulted in empty string");
      return "";
    }
    
    console.log("Decrypted text:", decryptedText);
    
    // Attempt to parse the decrypted text as JSON to ensure it's valid
    JSON.parse(decryptedText);
    
    return decryptedText;
  } catch (error) {
    console.error("Error in decryptAnswers:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    // Instead of throwing, return an error message
    return JSON.stringify({ error: "Failed to decrypt answers" });
  }
}