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

  // // Sélectionnez l'élément avec l'ID "URL"
  // const urlElement = document.getElementById("URL");

  // // Définissez la valeur de l'élément et ajoutez la classe "antique-bg"
  // urlElement.innerHTML = generateDecryptionURL(encryptedCustomerNumber, key, iv);
  // urlElement.classList.add("antique-bg");

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


let copyBtn = document.querySelector(".Copy");

function copyToClipboard() {
  let Input = document.getElementById("encryptedUrl");
  Input.select();
  document.execCommand("copy");
  copyBtn.innerHTML = "Copied";
  copyBtn.classList.add("copied");

  setTimeout(function() {
    copyBtn.innerHTML = "Copy";
    copyBtn.classList.remove("copied");
  }, 1000);
};
copyBtn.addEventListener("click", copyToClipboard);

function Link() {
  let selectedValue
  const customerNumber = document.getElementById("siret").value;
  const { encryptedCustomerNumber, key, iv } = encryptCustomerNumber(customerNumber);
  document.getElementById("encryptedUrl").value = generateDecryptionURL(encryptCustomerNumber, key, iv);
  const selectedOption = document.querySelector('input[name="choix"]:checked');
  if (selectedOption) {

    const selectedValue = selectedOption.value;
    console.log("Option choisie : " + selectedValue);
    console.log(selectedValue.concat(document.getElementById("encryptedUrl").value));
    
    // Sélectionnez l'élément avec l'ID "URL"
    const urlElement = document.getElementById("URL");

    // Définissez la valeur de l'élément et ajoutez la classe "antique-bg"
    urlElement.innerHTML = selectedValue.concat(document.getElementById("encryptedUrl").value);
    urlElement.classList.add("antique-bg");
    // Vous pouvez maintenant utiliser la valeur choisie pour effectuer d'autres opérations
  } else {
    console.log("Aucune option sélectionnée.");
  }
};

let copyBtn2 = document.querySelector(".Copy2");

function copyToClipboard0() {
  let TextLink = document.getElementById("URL");
  
  // Créer une plage de texte et sélectionner le contenu de la div
  let range = document.createRange();
  range.selectNodeContents(TextLink);
  window.getSelection().removeAllRanges(); // Effacer les anciennes sélections
  window.getSelection().addRange(range); // Sélectionner le nouveau contenu
  
  // Copier le contenu sélectionné dans le presse-papiers
  document.execCommand("copy");
  
  // Réinitialiser le bouton après un délai
  copyBtn2.innerHTML = "Copied";
  copyBtn2.classList.add("copied");

  setTimeout(function() {
    copyBtn2.innerHTML = "Copy";
    copyBtn2.classList.remove("copied");
  }, 1000);
}

