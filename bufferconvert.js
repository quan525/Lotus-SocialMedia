const hexString = '7b2274797065223a226f6e6c696e65222c227061796c6f6164223a7b22757365725f6964223a31317d7d';
const buffer = Buffer.from(hexString, 'hex');

console.log(buffer); // Output: <Buffer 7b 22 74 79 70 65 22 3a 22 6f 6e 6c 69 6e 65 22 2c 22 70 61 79 6c 6f 61 64 22 3a 7b 22 75 73 65 72 5f 69 64 22 3a 31 31 7d 7d>
console.log(buffer.toString()); // Output: {"type":"online","payload":{"user_id":11}}
