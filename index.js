let start = String.fromCodePoint(0x2E28);

let end = String.fromCodePoint(0x2E29);

let symbols = [
  String.fromCodePoint(0x200B),
  String.fromCodePoint(0x200C),
  String.fromCodePoint(0x200D),
  String.fromCodePoint(0x2060),
];

let indices = new Map(symbols.map((c, i) => [c, i]));

let [top, bottom] = document.getElementsByTagName('textarea');

function encode(s) {
  let z = '';

  for (let byte of new TextEncoder().encode(top.value)) {
    for (let i = 0; i < 4; i++) {
      let n = (byte >> (i * 2) & 0b11)
      z += symbols[n];
    }
  }

  return start + z + end;
}

function decode(z) {
  let bytes = [];

  for (let i = 0; i < z.length; i += 4) {
    let byte = 0;

    for (let j = 0; j < 4; j++) {
      let n = indices.get(z[i + j]);
      byte |= (n << (j * 2));
    }

    bytes.push(byte);
  }

  return new TextDecoder().decode(new Uint8Array(bytes));
}

top.addEventListener('input', function () {
  if (top.value) {
    let match = /\u{2E28}(.*)\u{2E29}/u.exec(top.value);
    bottom.value = match ? decode(match[1]) : encode(top.value);
  } else {
    bottom.value = '';
  }
});
