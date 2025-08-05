export const categoriesMap = new Map([
  [1, 'Pwn'],
  [2, 'Reverse Engineering'],
  [3, 'Web'],
  [4, 'Crypto'],
  [5, 'Game Hacking'],
  [6, 'Hardware'],
  [7, 'Programming'],
  [8, 'AI/ML'],
  [9, 'Forensics'],
  [10, 'Steganography'],
  [11, 'Misc.'],
  [12, 'OSINT'],
  [13, 'Mobile'],
  [14, 'Networking'],
]);

export const categoryOptions = Array.from(categoriesMap.entries()).map(([id, name]) => ({
  value: id,
  label: name,
}));
