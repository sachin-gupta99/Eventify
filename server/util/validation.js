function isValidEmail(value) {
  return value && value.includes('@');
}

function isValidPassword(value) {
  return value.length>6;
}

function isValidText(value) {
  return value && value.trim().length > 0;
}

function isValidDate(value) {
  const date = new Date(value);
  return value && date !== 'Invalid Date';
}

function isValidImageUrl(value) {
  return value && value.startsWith('http');
}

exports.isValidEmail = isValidEmail;
exports.isValidPassword = isValidPassword;
exports.isValidText = isValidText;
exports.isValidDate = isValidDate;
exports.isValidImageUrl = isValidImageUrl;
