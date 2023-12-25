const crypto = require('crypto');

class Encryption {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  encrypt(data) {
    const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector)
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(this.secretKey), iv);
    const encryptedData = Buffer.concat([cipher.update(data, 'utf-8'), cipher.final()]);
    const tag = cipher.getAuthTag(); // Get authentication tag
    return { iv: iv.toString('hex'), data: encryptedData.toString('hex'), tag: tag.toString('hex') };
  }

  decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(this.secretKey),
      Buffer.from(encryptedData.iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    const decryptedData = Buffer.concat([decipher.update(Buffer.from(encryptedData.data, 'hex')), decipher.final()]);
    return decryptedData.toString('utf-8');
  }
}

module.exports = Encryption;
