function encryptCustomerNumber(customerNumber) {
  const key = CryptoJS.lib.WordArray.random(32);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(customerNumber, key, { iv: iv }).toString();

  return {
    encryptedCustomerNumber: encrypted,
    key: CryptoJS.enc.Base64.stringify(key),
    iv: CryptoJS.enc.Base64.stringify(iv)
  };
}

function decryptCustomerNumber(encryptedCustomerNumber, key, iv) {
  const decrypted = CryptoJS.AES.decrypt(encryptedCustomerNumber, CryptoJS.enc.Base64.parse(key), {
    iv: CryptoJS.enc.Base64.parse(iv)
  }).toString(CryptoJS.enc.Utf8);

  return decrypted;
}

function encryptAndGenerateLink() {
  const customerNumber = document.getElementById("siret").value;
  const { encryptedCustomerNumber, key, iv } = encryptCustomerNumber(customerNumber);

  document.getElementById("encryptedCustNum").textContent = encryptedCustomerNumber;
  document.getElementById("encryptedUrl").value = generateDecryptionURL(encryptedCustomerNumber, key, iv);
  document.getElementById("decryptedCustNum").textContent = "";
}

function generateDecryptionURL(encryptedCustomerNumber, key, iv) {
  const encodedEncryptedCustomerNumber = encodeURIComponent(encryptedCustomerNumber);
  const encodedKey = encodeURIComponent(key);
  const encodedIV = encodeURIComponent(iv);

  return `/creer-votre-compte/?code=1123&enc=${encodedEncryptedCustomerNumber}&key=${encodedKey}&iv=${encodedIV}`;
}

function decrypt() {
  const encryptedCustomerNumber = document.getElementById("encryptedCustNum").textContent;
  const url = document.getElementById("encryptedUrl").value;

  if (url === "") {
    alert("Please enter the decryption URL.");
    return;
  }

  const urlParams = new URLSearchParams(url);
  const encryptedKey = urlParams.get("key");
  const iv = urlParams.get("iv");

  const decryptedCustomerNumber = decryptCustomerNumber(encryptedCustomerNumber, encryptedKey, iv);

  document.getElementById("decryptedCustNum").textContent = decryptedCustomerNumber;
}

document.addEventListener("DOMContentLoaded", function() {
  let copyBtn = document.querySelector(".Copy");

  copyBtn.addEventListener("click", copyToClipboard);

  function copyToClipboard() {
    let Input = document.getElementById("encryptedUrl");
    Input.select();
    document.execCommand("copy");
    copyBtn.innerHTML = "Copied";
    copyBtn.classList.add("copied"); // Ajoute la classe "copied" au bouton

    setTimeout(function() {
      copyBtn.innerHTML = "Copy";
      copyBtn.classList.remove("copied"); // Supprime la classe "copied" du bouton
    }, 1000);
  }
});
