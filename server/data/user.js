const {hash, genSalt} = require("bcryptjs");
const { v4: generateId } = require("uuid");
const { NotFoundError } = require("../util/errors");
const { readData, writeData } = require("./util");

const add = async (data) => {
  const storedData = await readData();
  const hashedPw = await hash(data.password, 12);
  const userId = generateId();
  if (!storedData.users) {
    storedData.users = [];
  }
  storedData.users.push({ ...data, password: hashedPw, id: userId });
  await writeData(storedData);
  return { id: userId, email: data.email };
};

const get = async (email) => {
  const data = await readData();
  if (!data.users || data.users.length === 0)
    return 0;

  const user = data.users.find((user) => user.email === email);

  if (!user) return 0;
  return user;
};

exports.add = add;
exports.get = get;
